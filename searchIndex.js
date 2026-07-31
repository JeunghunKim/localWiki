/**
 * SearchIndex — 메모리 기반 검색 인덱스
 *
 * 서버 시작 시 모든 .md 파일을 스캔하여 인메모리 인덱스를 구축하고,
 * chokidar 이벤트에 따라 증분 업데이트합니다.
 */
const fs = require('fs');
const path = require('path');

class SearchIndex {
  constructor(dataDir) {
    this.dataDir = dataDir;
    /** @type {Map<string, Set<string>>} term → Set<relativePath> */
    this.terms = new Map();
    /** @type {Map<string, FileMeta>} relativePath → meta */
    this.files = new Map();
  }

  /**
   * 최초 전체 인덱스 구축 (서버 시작 시 호출)
   */
  build() {
    const fileList = [];
    this._walkDir(this.dataDir, fileList);
    for (const filePath of fileList) {
      this._indexFile(filePath);
    }
    console.log(`[SearchIndex] Indexed ${this.files.size} files`);
  }

  /**
   * 단일 파일 증분 색인 (추가/수정 시 호출)
   */
  indexFile(relativePath) {
    const absPath = path.join(this.dataDir, relativePath);
    this._removeFileFromIndex(relativePath);
    this._indexFile(absPath);
  }

  /**
   * 파일 삭제 시 인덱스에서 제거
   */
  removeFile(relativePath) {
    this._removeFileFromIndex(relativePath);
  }

  /**
   * 검색 실행 (Fuzzy 검색 + 고급 연산자 지원)
   *
   * 연산자:
   *   `term1 term2`  → AND (모든 term 포함)
   *   `term1 OR term2` → OR (둘 중 하나라도 포함)
   *   `-term`         → 제외 (term 불포함)
   *   `"phrase"`     → 정확한 구문 일치
   *   `term~`         → Fuzzy (오타 허용, Levenshtein distance 2 이내)
   *
   * @param {string} query
   * @returns {Array<{title: string, path: string, snippet: string, score: number}>}
   */
  search(query) {
    if (!query || query.trim() === '') return [];

    const parsed = this._parseQuery(query.trim());
    if (parsed.include.length === 0 && parsed.includeOr.length === 0) return [];

    // AND 그룹: 모든 term이 포함된 파일
    let candidates = null;
    if (parsed.include.length > 0) {
      for (const token of parsed.include) {
        const matched = this._fuzzyMatchTerm(token);
        if (matched.length === 0) return [];
        if (candidates === null) {
          candidates = new Set(matched);
        } else {
          candidates = new Set([...candidates].filter((f) => matched.includes(f)));
        }
      }
    }

    // OR 그룹: candidates에 OR term 파일 추가
    if (parsed.includeOr.length > 0) {
      const orFiles = new Set();
      for (const token of parsed.includeOr) {
        const matched = this._fuzzyMatchTerm(token);
        matched.forEach((f) => orFiles.add(f));
      }
      if (candidates === null) {
        candidates = orFiles;
      } else {
        orFiles.forEach((f) => candidates.add(f));
      }
    }

    if (!candidates || candidates.size === 0) return [];

    // 제외(-) term 필터링
    let resultFiles = [...candidates];
    for (const token of parsed.exclude) {
      const matched = this._fuzzyMatchTerm(token);
      const excludeSet = new Set(matched);
      resultFiles = resultFiles.filter((f) => !excludeSet.has(f));
    }

    if (resultFiles.length === 0) return [];

    // 구문 검색 (phrase) 필터링
    if (parsed.phrase) {
      resultFiles = resultFiles.filter((relPath) => {
        const meta = this.files.get(relPath);
        if (!meta) return false;
        return meta.content.toLowerCase().includes(parsed.phrase.toLowerCase());
      });
    }

    if (resultFiles.length === 0) return [];

    // 점수 계산 및 정렬
    const queryTokens = this._tokenize(parsed.rawQuery);
    const scored = resultFiles.map((relPath) => ({
      ...this._scoreFile(relPath, queryTokens, parsed.rawQuery),
    }));

    scored.sort((a, b) => b.score - a.score);

    // 상위 30개 반환
    return scored.slice(0, 30);
  }

  /**
   * 검색어 파싱: 연산자 분리
   */
  _parseQuery(raw) {
    const result = {
      include: [],   // AND term (일반 term)
      includeOr: [], // OR term
      exclude: [],   // 제외 term (-term)
      phrase: null,  // 구문 검색 ("phrase")
      rawQuery: raw,
    };

    // 구문 검색 먼저 추출
    const phraseMatch = raw.match(/"([^"]+)"/);
    if (phraseMatch) {
      result.phrase = phraseMatch[1];
      raw = raw.replace(phraseMatch[0], '').trim();
    }

    // 나머지 토큰 처리
    const tokens = raw.split(/\s+/).filter((t) => t.length > 0);
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
      if (token.startsWith('-')) {
        result.exclude.push(token.slice(1));
      } else if (token.toUpperCase() === 'OR' && i > 0 && i < tokens.length - 1) {
        // 이전 토큰을 includeOr로 이동
        const prev = result.include.pop();
        if (prev) result.includeOr.push(prev);
        result.includeOr.push(tokens[i + 1]);
        i += 2;
        continue;
      } else {
        result.include.push(token);
      }
      i++;
    }

    return result;
  }

  /**
   * Fuzzy 매칭: 정확히 일치하지 않아도 Levenshtein distance 2 이내면 매칭
   */
  _fuzzyMatchTerm(term) {
    const lowerTerm = term.toLowerCase();
    // 정확히 일치하는 term 먼저 확인
    if (this.terms.has(lowerTerm)) {
      return [...this.terms.get(lowerTerm)];
    }

    // Fuzzy 매칭 (Levenshtein distance <= 2)
    const matchedFiles = new Set();
    for (const [indexTerm, fileSet] of this.terms) {
      const dist = this._levenshtein(lowerTerm, indexTerm);
      if (dist <= 2 && indexTerm.length >= 2) {
        for (const f of fileSet) matchedFiles.add(f);
      }
    }

    return [...matchedFiles];
  }

  /**
   * Levenshtein distance 계산
   */
  _levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  }

  // ─── Private Methods ────────────────────────────────

  /** 디렉토리를 재귀적으로 탐색하여 .md 파일 목록 반환 */
  _walkDir(dir, fileList) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const absPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this._walkDir(absPath, fileList);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        fileList.push(absPath);
      }
    }
  }

  /** 파일을 읽어 인덱스에 추가 */
  _indexFile(absPath) {
    const relativePath = path.relative(this.dataDir, absPath);
    if (!fs.existsSync(absPath)) return;

    const content = fs.readFileSync(absPath, 'utf8');
    const title = path.basename(relativePath, '.md');
    const tokens = this._tokenize(title + ' ' + content);
    const termCounts = new Map();
    const positions = new Map();

    tokens.forEach((token, idx) => {
      const count = termCounts.get(token) || 0;
      termCounts.set(token, count + 1);

      if (!positions.has(token)) positions.set(token, []);
      positions.get(token).push(idx);
    });

    // 인덱스에 term 추가
    for (const [term] of termCounts) {
      if (!this.terms.has(term)) {
        this.terms.set(term, new Set());
      }
      this.terms.get(term).add(relativePath);
    }

    // 파일 메타데이터 저장
    this.files.set(relativePath, {
      title,
      path: relativePath,
      content,
      termCounts,
      positions,
    });
  }

  /** 인덱스에서 파일 제거 */
  _removeFileFromIndex(relativePath) {
    const meta = this.files.get(relativePath);
    if (!meta) return;

    for (const term of meta.termCounts.keys()) {
      const termSet = this.terms.get(term);
      if (termSet) {
        termSet.delete(relativePath);
        if (termSet.size === 0) this.terms.delete(term);
      }
    }
    this.files.delete(relativePath);
  }

  /** 텍스트를 검색 토큰으로 분리 */
  _tokenize(text) {
    // 한글/영문/숫자만 추출, 소문자 변환
    const cleaned = text.replace(/[^a-zA-Z0-9가-힣\s]/g, ' ');
    return cleaned
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }

  /** 파일의 검색 점수 계산 */
  _scoreFile(relPath, queryTokens, rawQuery) {
    const meta = this.files.get(relPath);
    if (!meta) {
      return { title: path.basename(relPath, '.md'), path: relPath, snippet: '', score: 0 };
    }

    let score = 0;
    const queryLower = rawQuery.toLowerCase();

    // 1. 제목 매칭 — 가중치 높음
    const titleLower = meta.title.toLowerCase();
    if (titleLower === queryLower) {
      score += 20; // 정확히 일치
    } else if (titleLower.includes(queryLower)) {
      score += 10; // 부분 일치
    }

    // 2. 본문 TF (Term Frequency) 기반 점수
    const contentLower = meta.content.toLowerCase();
    if (contentLower.includes(queryLower)) {
      // 전체 본문에서 검색어 등장 횟수
      const regex = new RegExp(queryLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = contentLower.match(regex);
      const count = matches ? matches.length : 0;
      score += Math.min(count, 10); // 최대 10점
    }

    // 3. 스니펫 추출 — 검색어 주변 라인
    let snippet = '';
    const lines = meta.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(queryLower)) {
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 2);
        snippet = lines.slice(start, end)
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .join(' | ');
        snippet = snippet.substring(0, 200);
        break;
      }
    }

    return {
      title: meta.title,
      path: relPath,
      snippet: snippet || '',
      score,
    };
  }
}

module.exports = SearchIndex;