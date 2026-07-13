# Postprocessing: Tailwind CSS 학습 자료 제작 기록

이 문서는 Tailwind CSS 한국어 학습 자료(PDF) 제작 과정에서 발생한 문제와 해결 과정을 정리한 기록입니다.

---

## 1. 프로젝트 초기 설정

`project.md`의 요구사항을 기반으로 아래 순서로 파일을 생성했습니다.

1. `.gitignore` 생성 (LaTeX 빌드 아티팩트, `.env` 등 제외)
2. `git init` 및 initial commit
3. `ROADMAP.md` 작성 (7개 chapter 커리큘럼)
4. `chapter1~7.md` / `chapter1~7.tex` 작성 (병렬 에이전트 2개로 생성)
5. `main.tex` 작성 (xelatex 컴파일용 메인 파일)

### 생성된 파일 목록

| 파일 | 내용 |
|---|---|
| `ROADMAP.md` | 7개 chapter 커리큘럼 로드맵 |
| `chapter1.md` / `.tex` | Tailwind CSS 소개 및 설치 |
| `chapter2.md` / `.tex` | 기본 유틸리티 클래스 |
| `chapter3.md` / `.tex` | 레이아웃 |
| `chapter4.md` / `.tex` | 반응형 디자인 |
| `chapter5.md` / `.tex` | 타이포그래피 및 색상 |
| `chapter6.md` / `.tex` | 상태 변형 및 애니메이션 |
| `chapter7.md` / `.tex` | 커스터마이징 |
| `main.tex` | 모든 chapter를 묶는 XeLaTeX 메인 파일 |

---

## 2. 컴파일 오류 수정

### 2-1. 폰트 미발견 오류

**증상:** `Font ... not found` 오류 다수 발생

**원인:** `main.tex`에서 폰트 이름을 잘못 지정함
- 잘못된 이름: `Noto Serif CJK KR Regular`, `Noto Sans CJK KR Regular`
- `fc-list`로 확인한 실제 이름: `Noto Serif CJK KR` (style: `Regular`/`Bold`)

**해결:**
```latex
% 수정 전
\setmainfont{Noto Serif CJK KR Regular}

% 수정 후
\setmainfont{Noto Serif CJK KR}[
  BoldFont = * Bold,
  AutoFakeSlant = 0.2,   % Noto CJK는 Italic 미지원 → 기울임 합성
]
\setmainhangulfont{Noto Serif CJK KR}   % kotex 한글 폰트 설정
\setsanshangulfont{Noto Sans CJK KR}
```

**배경 지식:**
- Noto CJK 계열 폰트는 Italic 스타일이 없어 `AutoFakeSlant`로 합성 처리
- fontspec의 `BoldFont = * Bold` 패턴에서 `*`는 현재 폰트 패밀리 이름을 의미
- `\setmainhangulfont` / `\setsanshangulfont`는 xetexko(kotex) 전용 명령어

---

### 2-2. listings 언어 미정의 오류

**증상:** `language=CSS`, `language=JavaScript` 사용 시 오류

**원인:** `listings` 패키지에는 CSS, JavaScript가 내장되어 있지 않음

**해결:** `\lstdefinelanguage`로 직접 정의
```latex
\lstdefinelanguage{CSS}{
  morekeywords={color, background, margin, padding, ...},
  sensitive=false,
  morecomment=[l]{//},
  morecomment=[s]{/*}{*/},
  morestring=[b]",...
}

\lstdefinelanguage{JavaScript}{
  morekeywords={const, let, var, function, return, ...},
  ...
}
```

---

### 2-3. `\begin{document}` 누락 오류

**증상:** `LaTeX Error: Missing \begin{document}` at main.tex:107

**원인:** CSS 언어 정의를 삽입하면서 `\lstdefinelanguage{JavaScript}{` 여는 줄을 실수로 덮어씀

**해결:** `\lstdefinelanguage{JavaScript}{` 줄 복원

---

## 3. 컴파일 경고 수정

### 3-1. microtype 경고 44개

**증상:**
```
Package microtype Warning: Unknown slot number of character `\k A' in font encoding `TU'
```

**원인:** `microtype` 패키지가 TU(Unicode) 인코딩의 CJK 폰트와 호환되지 않아 유럽 특수문자 slot을 찾지 못함

**해결:** `microtype` 패키지 제거

---

### 3-2. hyperref bookmarks 경고

**증상:**
```
Package hyperref Warning: Option `bookmarks' has already been used
```

**원인:** `kotex` / `xetexko`가 내부적으로 `hyperref`를 먼저 로드한 뒤, `\hypersetup`에서 `bookmarks=true` 등을 중복 설정

**해결:** `\hypersetup`에서 `bookmarks`, `bookmarksopen`, `bookmarksnumbered` 옵션 제거

---

### 3-3. UnDotum italic 경고

**증상:**
```
LaTeX Font Warning: Font shape `TU/UnDotum.ttf(0)/m/it' undefined
```

**원인:** 코드 블록 설정의 `commentstyle=\itshape`가 한국어 주석에도 적용되어, italic이 없는 UnDotum 폴백 폰트를 요청함

**해결:** `commentstyle`에서 `\itshape` 제거
```latex
% 수정 전
commentstyle=\color{codecomment}\itshape,

% 수정 후
commentstyle=\color{codecomment},
```

---

### 3-4. float `[h]` 경고

**증상:**
```
LaTeX Warning: `h' float specifier changed to `ht'.
```

**원인:** `\begin{table}[h]`에서 `[h]` 단독 지정 시 LaTeX이 배치 가능한 위치를 찾지 못하면 경고 발생

**해결:** `[h]` → `[htbp]`로 교체 (chapter1, 3, 4.tex에 `sed`로 일괄 적용)
```bash
sed -i 's/\\begin{table}\[h\]/\\begin{table}[htbp]/g' chapter1.tex
```

---

### 3-5. Overfull `\hbox` 경고 (표 너비 초과)

**증상:**
```
Overfull \hbox (41.19025pt too wide) in paragraph at lines 42--61
Overfull \hbox (153.55852pt too wide) in paragraph at lines 360--373
...
```

**원인:** `tabular` 환경에서 두 번째 열이 고정 너비인데 내용이 길어 페이지 너비를 초과

**해결:** `tabularx` 패키지 + `X` 컬럼 타입 사용

```latex
% 수정 전
\begin{tabular}{|l|l|}

% 수정 후
\begin{tabularx}{\linewidth}{|l|X|}
```

적용 파일: `chapter1.tex` (Bootstrap 비교표), `chapter5.tex` (font-family 표), `chapter6.tex` (transition 표, 챕터 요약 표), `chapter7.tex` (챕터 요약 표)

**배경 지식:**
- `tabularx`의 `X` 컬럼은 가용 너비를 자동 계산하여 텍스트를 줄바꿈 처리
- `center` 환경 안에서도 `\linewidth` 사용 권장 (`\textwidth`보다 정확)

---

### 3-6. lstlisting 내 긴 코드 줄 (Overfull)

**증상:** lstlisting 블록 내 한 줄이 페이지 너비를 6pt 초과

**해결 방법 1:** lstset에 `breaklines=true`, `breakatwhitespace=false` 설정 (전역)

**해결 방법 2:** 소스에서 직접 줄바꿈
```html
<!-- 수정 전 -->
<button class="bg-primary text-primary-foreground px-4 py-2 rounded">

<!-- 수정 후 -->
<button class="bg-primary text-primary-foreground
               px-4 py-2 rounded">
```

**해결 방법 3:** `\hfuzz` / `\vfuzz`로 허용 오차 설정 (10pt 이내 미세 오버플로우 억제)
```latex
\hfuzz=10pt
\vfuzz=10pt
```

---

### 3-7. Underfull `\vbox` 경고

**증상:** 페이지 하단 여백이 들쭉날쭉하여 경고 발생

**해결:**
```latex
\raggedbottom                          % 페이지 하단 정렬 강제 해제
\setlength{\emergencystretch}{3em}     % 단어 간격 탄력적 조정
```

---

## 4. main.tex 최종 설정 요약

```latex
%% 패키지
\usepackage{kotex}          % 한국어
\usepackage{fontspec}       % 폰트 설정
\usepackage{listings}       % 코드 블록
\usepackage{tabularx}       % 자동 너비 조절 표
\usepackage{hyperref}       % PDF 하이퍼링크
% microtype 제거 (CJK 폰트와 비호환)

%% 폰트
\setmainfont{Noto Serif CJK KR}[BoldFont=* Bold, AutoFakeSlant=0.2]
\setsansfont{Noto Sans CJK KR}[BoldFont=* Bold, AutoFakeSlant=0.2]
\setmonofont{DejaVu Sans Mono}
\setmainhangulfont{Noto Serif CJK KR}
\setsanshangulfont{Noto Sans CJK KR}

%% 레이아웃
\raggedbottom
\setlength{\emergencystretch}{3em}
\hfuzz=10pt
\vfuzz=10pt

%% 코드 블록 (lstset)
\lstset{
  basicstyle=\ttfamily\footnotesize,
  columns=fullflexible,
  breaklines=true,
  breakatwhitespace=false,
  keepspaces=true,
  numbers=left,
  ...
}

%% hyperref (bookmarks 관련 옵션 제거 - kotex와 중복)
\hypersetup{
  colorlinks=true,
  linkcolor=...,
  % bookmarks=true  ← 제거
}
```

---

## 5. 컴파일 환경

| 항목 | 내용 |
|---|---|
| TeX 엔진 | XeLaTeX (xelatex) |
| TeX 배포판 | TeX Live 2024 |
| 버전 | 3.141592653-2.6-0.999996 |
| 본문 폰트 | Noto Serif CJK KR |
| 산세리프 폰트 | Noto Sans CJK KR |
| 모노스페이스 폰트 | DejaVu Sans Mono |
| 폰트 경로 | `/usr/share/fonts/opentype/noto/`, `/usr/share/fonts/truetype/dejavu/` |

컴파일 명령 (2회 실행으로 교차 참조 해결):
```bash
xelatex main.tex
xelatex main.tex
```

---

## 6. Git 커밋 이력

| 커밋 해시 | 타입 | 내용 |
|---|---|---|
| `fc3491f` | chore | 프로젝트 초기화 및 .gitignore 추가 |
| `9211a14` | docs | ROADMAP.md 추가 |
| `13528a4` | docs | Chapter 1 소개 및 설치 |
| `2cb7333` | docs | Chapter 5 타이포그래피 및 색상 |
| `148496d` | docs | Chapter 6 상태 변형 및 애니메이션 |
| `1931f35` | docs | Chapter 2 기본 유틸리티 클래스 |
| `83e4faf` | docs | Chapter 3 레이아웃 |
| `1db26a0` | docs | Chapter 4 반응형 디자인 |
| `a86e965` | docs | Chapter 7 커스터마이징 |
| `662dbbb` | docs | main.tex 추가 |
| `28c5074` | fix | 폰트 설정 및 CSS listings 언어 정의 수정 |
| `9921fdb` | fix | lstdefinelanguage JavaScript 정의 누락 수정 |
| `b75da1d` | fix | 컴파일 경고 전체 해결 |
