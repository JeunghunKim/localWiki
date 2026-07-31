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
   * 검색 실행
   * @param {string} query
   * @returns {Array<{title: string, path: string, snippet: string, score: number}>}
   */
  search(query) {
    if (!query || query.trim() === '') return [];

    const tokens = this._tokenize(query);
    if (tokens.length === 0) return [];

    // Multi-word AND 검색: 모든 토큰이 포함된 파일만 매칭
    const candidates = this._intersectTokens(tokens);
    if (candidates.length === 0) return [];

    // 점수 계산 및 정렬
    const scored = candidates.map((relPath) => ({
      ...this._scoreFile(relPath, tokens, query),
    }));

    scored.sort((a, b) => b.score - a.score);

    // 상위 30개 반환
    return scored.slice(0, 30);
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

  /** 여러 토큰의 AND 교집합 */
  _intersectTokens(tokens) {
    let candidates = null;
    for (const token of tokens) {
      const termSet = this.terms.get(token);
      if (!termSet || termSet.size === 0) return []; // 하나라도 없으면 빈 결과
      if (candidates === null) {
        candidates = new Set(termSet);
      } else {
        candidates = new Set([...candidates].filter((f) => termSet.has(f)));
      }
    }
    return candidates ? [...candidates] : [];
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