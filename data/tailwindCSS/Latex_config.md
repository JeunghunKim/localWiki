# LaTeX 프로젝트 설정 가이드

향후 프로젝트에서 현재와 동일한 LaTeX 환경을 구성하기 위한 설정 문서입니다.

---

## 컴파일 환경

| 항목 | 값 |
|---|---|
| 엔진 | **XeLaTeX** (`xelatex`) |
| 배포판 | TeX Live 2024 이상 |
| 컴파일 횟수 | **2회** (교차 참조·목차 갱신) |

```bash
xelatex main.tex
xelatex main.tex
```

> **주의:** pdflatex은 사용 불가. 한국어 폰트(fontspec)와 CJK 지원이 XeLaTeX 전용임.

---

## 문서 클래스

```latex
\documentclass[12pt, a4paper]{book}
```

| 옵션 | 설명 |
|---|---|
| `12pt` | 기본 본문 폰트 크기 |
| `a4paper` | A4 용지 |
| `book` | 챕터 구조, 홀수/짝수 페이지 레이아웃 지원 |

단일 문서(챕터 없음)는 `article`로 교체 가능.

---

## 패키지 목록

```latex
\usepackage{kotex}        % 한글 지원 (xetexko 자동 로드)
\usepackage{fontspec}     % XeTeX 폰트 설정
\usepackage{geometry}     % 페이지 여백
\usepackage{hyperref}     % 하이퍼링크 및 PDF 북마크
\usepackage{listings}     % 코드 블록
\usepackage{xcolor}       % 색상 정의
\usepackage{booktabs}     % 표 (toprule/midrule/bottomrule)
\usepackage{graphicx}     % 이미지 삽입
\usepackage{enumitem}     % 목록(list) 스타일 조정
\usepackage{fancyhdr}     % 헤더/푸터
\usepackage{titlesec}     % 제목(chapter/section) 스타일
\usepackage{tocloft}      % 목차(TOC) 스타일
\usepackage{tabularx}     % 자동 너비 조절 표 (X 컬럼)
\usepackage{parskip}      % 단락 들여쓰기 대신 빈줄로 구분
% microtype은 사용하지 않음 (CJK 폰트와 비호환)
```

---

## 페이지 여백

```latex
\geometry{
  top=25mm,
  bottom=25mm,
  left=30mm,
  right=25mm,
  headheight=15pt,
}
```

---

## 폰트 설정

> 시스템에 Noto CJK 폰트가 설치되어 있어야 합니다.
> 설치 확인: `fc-list | grep -i "noto"`
> 설치 방법: sudo apt install fonts-noto-cjk

```latex
%% 본문 폰트 (영문 + 한글 세리프)
\setmainfont{Noto Serif CJK KR}[
  BoldFont       = * Bold,
  ItalicFont     = * Regular,    % Noto CJK는 Italic 없음 → Regular로 대체
  BoldItalicFont = * Bold,
  AutoFakeSlant  = 0.2,          % 기울임꼴 합성
]

%% 산세리프 폰트
\setsansfont{Noto Sans CJK KR}[
  BoldFont       = * Bold,
  ItalicFont     = * Regular,
  BoldItalicFont = * Bold,
  AutoFakeSlant  = 0.2,
]

%% 모노스페이스 폰트 (코드용)
\setmonofont{DejaVu Sans Mono}

%% kotex 한국어 폰트 명시 (UnDotum 폴백 방지)
\setmainhangulfont{Noto Serif CJK KR}[
  BoldFont      = * Bold,
  AutoFakeSlant = 0.2,
]
\setsanshangulfont{Noto Sans CJK KR}[
  BoldFont      = * Bold,
  AutoFakeSlant = 0.2,
]
```

**핵심 포인트:**
- `BoldFont = * Bold` — `*`는 현재 폰트 패밀리 이름을 의미 (예: `Noto Serif CJK KR Bold`)
- `AutoFakeSlant = 0.2` — Italic 미지원 폰트에서 기울임꼴을 소프트웨어로 합성
- `\setmainhangulfont` / `\setsanshangulfont` — xetexko(kotex) 전용. 미설정 시 UnDotum 폴백 발생

---

## 색상 정의

```latex
%% 기본 색상 팔레트 (Tailwind CSS 기반; 프로젝트에 맞게 변경)
\definecolor{accent1}{HTML}{6366F1}   % 인디고 - 챕터 제목
\definecolor{accent2}{HTML}{3B82F6}   % 블루   - 섹션 제목, 링크

%% 코드 블록 색상
\definecolor{codebg}{HTML}{F8FAFC}    % 연회색 배경
\definecolor{codekw}{HTML}{2563EB}    % 키워드 (파란색)
\definecolor{codestr}{HTML}{059669}   % 문자열 (초록색)
\definecolor{codecomment}{HTML}{6B7280} % 주석 (회색)
\definecolor{codenumber}{HTML}{D97706}  % 줄 번호 (황색)
```

---

## 레이아웃 경고 억제

```latex
%% \begin{document} 전에 선언
\hfuzz=10pt    % 10pt 이내 가로 오버플로우 경고 억제
\vfuzz=10pt    % 10pt 이내 세로 오버플로우 경고 억제
```

```latex
%% \begin{document} 직후에 선언
\raggedbottom          % 페이지 하단 정렬 강제 해제 (Underfull \vbox 방지)
\emergencystretch=3em  % 단어 간격 탄력 조정 (Overfull \hbox 완화)
```

---

## 코드 블록 (listings)

### 전역 설정

```latex
\lstset{
  basicstyle        = \ttfamily\footnotesize,  % 코드 폰트 크기 (~10pt)
  backgroundcolor   = \color{codebg},
  keywordstyle      = \color{codekw}\bfseries,
  stringstyle       = \color{codestr},
  commentstyle      = \color{codecomment},     % \itshape 금지: CJK 폰트 경고 발생
  numberstyle       = \tiny\color{codenumber},
  numbers           = left,
  numbersep         = 8pt,
  stepnumber        = 1,
  frame             = single,
  framesep          = 4pt,
  rulecolor         = \color{gray!30},
  breaklines        = true,
  breakatwhitespace = false,
  columns           = fullflexible,   % 한국어 문서에서 글자 간격 정상화
  keepspaces        = true,
  tabsize           = 2,
  showstringspaces  = false,
  captionpos        = b,
  xleftmargin       = 12pt,
  xrightmargin      = 4pt,
}
```

**핵심 포인트:**
- `commentstyle`에 `\itshape` 추가 금지 — CJK 폰트에 italic 없어 `UnDotum italic undefined` 경고 발생
- `columns=fullflexible` — 한국어 혼용 시 글자 간격이 자연스럽게 처리됨 (`fixed` 사용 시 어색함)
- `\footnotesize`(~10pt) vs `\small`(~10.95pt) — 긴 코드 줄이 많으면 `\footnotesize` 권장

### 언어 정의 (listings 미내장 언어)

`listings` 패키지에 내장되지 않은 언어는 직접 정의합니다.  
내장 언어: `bash`, `HTML`, `Python`, `Java`, `C`, `C++` 등  
**미내장 언어: `CSS`, `JavaScript` → 아래 정의 복사 필요**

```latex
%% CSS
\lstdefinelanguage{CSS}{
  morekeywords={color, background, background-color, font-size, font-weight,
    font-family, margin, padding, border, border-radius, display, flex,
    grid, width, height, max-width, min-width, position, top, left, right,
    bottom, z-index, overflow, opacity, transition, transform, animation,
    content, box-shadow, text-align, text-decoration, line-height,
    letter-spacing, white-space, cursor, pointer-events, align-items,
    justify-content, flex-direction, flex-wrap, gap, grid-template-columns,
    grid-template-rows, grid-column, grid-row, object-fit, filter,
    @apply, @layer, @tailwind, @import, @media, @keyframes},
  sensitive=false,
  morestring=[b]",
  morestring=[b]',
  morecomment=[l]{//},
  morecomment=[s]{/*}{*/},
}

%% JavaScript
\lstdefinelanguage{JavaScript}{
  keywords={break, case, catch, continue, debugger, default, delete,
    do, else, finally, for, function, if, in, instanceof, new, return,
    switch, this, throw, try, typeof, var, void, while, with, let,
    const, class, export, import, extends, super, yield, async, await,
    true, false, null, undefined, module, require},
  sensitive=true,
  morestring=[b]",
  morestring=[b]',
  morestring=[b]`,
  morecomment=[l]{//},
  morecomment=[s]{/*}{*/},
}
```

### 코드 블록 사용법

```latex
\begin{lstlisting}[language=HTML, caption={예제 코드}]
<div class="flex items-center">
  <p>내용</p>
</div>
\end{lstlisting}
```

---

## 하이퍼링크 설정

```latex
\hypersetup{
  colorlinks = true,
  linkcolor  = accent1,   % 내부 링크 (색상 이름은 \definecolor로 정의한 것 사용)
  urlcolor   = accent2,
  citecolor  = accent2,
  pdftitle   = {문서 제목},
  pdfauthor  = {저자},
  pdfsubject = {주제},
  pdfkeywords= {키워드1, 키워드2},
  % bookmarks, bookmarksopen, bookmarksnumbered 옵션 생략
  % → kotex/xetexko가 내부적으로 hyperref를 로드하므로 중복 설정 시 경고 발생
}
```

---

## 헤더/푸터

```latex
\pagestyle{fancy}
\fancyhf{}
\fancyhead[LE]{\small\leftmark}   % 짝수 페이지 왼쪽: 챕터명
\fancyhead[RO]{\small\rightmark}  % 홀수 페이지 오른쪽: 섹션명
\fancyfoot[C]{\thepage}           % 하단 가운데: 페이지 번호
\renewcommand{\headrulewidth}{0.4pt}
```

---

## 제목 스타일

```latex
%% 챕터 제목
\titleformat{\chapter}[display]
  {\normalfont\huge\bfseries\color{accent1}}
  {\chaptertitlename\ \thechapter}{20pt}{\Huge}
\titlespacing*{\chapter}{0pt}{50pt}{40pt}

%% 섹션 제목
\titleformat{\section}
  {\normalfont\Large\bfseries\color{accent2}}
  {\thesection}{1em}{}
\titlespacing*{\section}{0pt}{3.5ex plus 1ex minus .2ex}{2.3ex plus .2ex}

%% 서브섹션 제목
\titleformat{\subsection}
  {\normalfont\large\bfseries}
  {\thesubsection}{1em}{}
```

---

## 목차(TOC) 설정

```latex
\setcounter{tocdepth}{2}     % TOC에 subsection까지 표시
\setcounter{secnumdepth}{3}  % 번호는 subsubsection까지 부여
```

---

## 표 작성 지침

긴 텍스트가 들어가는 열은 반드시 `tabularx`의 `X` 컬럼을 사용합니다.  
일반 `tabular`의 `l`/`c`/`r`은 너비가 고정되어 Overfull \hbox 경고를 유발합니다.

```latex
%% 권장 패턴
\begin{tabularx}{\linewidth}{|l|X|}
\hline
\textbf{항목} & \textbf{설명} \\
\hline
짧은 항목 & 여기에 길어도 되는 내용이 들어갑니다. 자동으로 줄바꿈됩니다. \\
\hline
\end{tabularx}

%% 3열 예시
\begin{tabularx}{\linewidth}{|l|X|X|}
```

---

## float 위치 지정

```latex
%% 권장
\begin{table}[htbp]    % here, top, bottom, page 순서로 배치 시도
\begin{figure}[htbp]

%% 금지 (단독 [h]는 배치 실패 시 경고 발생)
\begin{table}[h]
```

---

## 문서 구조 템플릿

```latex
\begin{document}
\raggedbottom
\emergencystretch=3em

%% 표지
\begin{titlepage}
  \centering
  \vspace*{3cm}
  {\Huge\bfseries\color{accent1} 제목\par}
  \vspace{1.5cm}
  {\large 부제목\par}
  \vfill
  {\large \the\year년\par}
\end{titlepage}

%% 전문 (목차 등)
\frontmatter
\tableofcontents
\clearpage

%% 본문
\mainmatter
\input{chapter1}
\input{chapter2}
% ...

%% 후문 (참고 자료 등)
\backmatter
\chapter*{참고 자료}
\addcontentsline{toc}{chapter}{참고 자료}
\begin{itemize}
  \item 항목: \url{https://example.com}
\end{itemize}

\end{document}
```

---

## 자주 발생하는 경고와 해결법 요약

| 경고 메시지 | 원인 | 해결 |
|---|---|---|
| `microtype: Unknown slot number` | microtype + CJK 폰트 비호환 | `microtype` 패키지 제거 |
| `hyperref: Option bookmarks already used` | kotex와 중복 설정 | `\hypersetup`에서 `bookmarks*` 옵션 제거 |
| `Font shape .../m/it undefined (UnDotum)` | `\itshape`를 한국어 폰트에 적용 | `commentstyle`에서 `\itshape` 제거 |
| `Overfull \hbox ... too wide` (표) | `tabular` 열 너비 초과 | `tabularx` + `X` 컬럼으로 교체 |
| `float specifier changed to ht` | `[h]` 단독 사용 | `[htbp]`로 변경 |
| `Underfull \vbox` | 페이지 하단 정렬 강제 | `\raggedbottom` 추가 |
| `language=CSS undefined` | listings 미내장 언어 | `\lstdefinelanguage{CSS}{...}` 직접 정의 |
| `language=JavaScript undefined` | listings 미내장 언어 | `\lstdefinelanguage{JavaScript}{...}` 직접 정의 |

---

## 시스템 폰트 설치 (Ubuntu/Debian)

```bash
# Noto CJK 폰트
sudo apt install fonts-noto-cjk

# DejaVu 폰트
sudo apt install fonts-dejavu

# 설치 확인
fc-list | grep -i "noto serif cjk kr"
fc-list | grep -i "dejavu sans mono"
```
