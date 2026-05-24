# LaTeX 설정 가이드 (Next.js 학습 자료 기준)

이 문서는 현재 프로젝트의 LaTeX 설정을 재현하기 위한 가이드입니다.
`main.tex`의 프리앰블 구성을 그대로 옮겨와서 새 프로젝트에 적용할 수 있습니다.

---

## 컴파일 환경

- **엔진**: XeLaTeX (xelatex)
- **컴파일 횟수**: 2회 이상 실행 (TOC, 상호 참조 정확성 보장)
- **권장 명령**:
  ```bash
  xelatex -interaction=nonstopmode main.tex
  xelatex -interaction=nonstopmode main.tex
  ```
- **출력 디렉터리 지정** (선택):
  ```bash
  xelatex -interaction=nonstopmode -output-directory=build main.tex
  ```

---

## 문서 클래스

```latex
\documentclass[a4paper,12pt,openany]{book}
```

| 옵션 | 설명 |
|------|------|
| `a4paper` | A4 용지 크기 |
| `12pt` | 기본 글꼴 크기 |
| `openany` | 챕터를 홀수/짝수 페이지 구분 없이 시작 |

---

## 필수 패키지 목록

### 언어 및 폰트

```latex
\usepackage{fontspec}
\usepackage{kotex}

\setmainfont{Noto Serif CJK KR}[
  BoldFont = Noto Serif CJK KR Bold
]
\setsansfont{Noto Sans CJK KR}
\setmonofont{Noto Sans Mono CJK KR}
\defaultfontfeatures{Ligatures=TeX}
```

- `fontspec`: XeLaTeX 전용 폰트 설정 패키지
- `kotex`: 한국어 조판 지원
- Noto CJK 폰트는 시스템에 설치되어 있어야 함
  - Ubuntu/Debian: `sudo apt install fonts-noto-cjk`

### 레이아웃

```latex
\usepackage[margin=2.5cm, headheight=15pt]{geometry}
```

- 상하좌우 여백 2.5cm
- `headheight=15pt`: 한국어 폰트 사용 시 fancyhdr 경고 방지

### 코드 하이라이팅

```latex
\usepackage{listings}
\usepackage{xcolor}
```

언어 직접 정의가 필요한 경우 (`listings` 기본 미포함):

```latex
% JavaScript
\lstdefinelanguage{JavaScript}{
  keywords={break,case,catch,continue,debugger,default,delete,do,else,
    false,finally,for,function,if,in,instanceof,new,null,return,switch,
    this,throw,true,try,typeof,var,void,while,with,let,const,class,
    export,import,extends,super,of,from,async,await,yield,static,get,set},
  keywordstyle=\color{blue}\bfseries,
  sensitive=true,
  comment=[l]{//},
  morecomment=[s]{/*}{*/},
  morestring=[b]',
  morestring=[b]",
  morestring=[b]`,
}

% TypeScript = JavaScript + 타입 키워드
\lstdefinelanguage{TypeScript}[]{JavaScript}{
  morekeywords={interface,type,enum,namespace,module,declare,
    abstract,as,implements,readonly,keyof,typeof,infer,
    never,unknown,any,string,number,boolean,void,symbol,
    bigint,object,tuple},
}

% JSX / TSX
\lstdefinelanguage{TSX}[]{TypeScript}{}
\lstdefinelanguage{JSX}[]{JavaScript}{}

% JSON
\lstdefinelanguage{json}{
  string=[s]{"}{"},
  stringstyle=\color{red!60!black},
  comment=[l]{//},
  keywords={true,false,null},
  keywordstyle=\color{blue},
}

% CSS
\lstdefinelanguage{CSS}{
  morekeywords={color,background,font-size,font-family,font-weight,
    margin,padding,border,width,height,display,flex,grid,position,
    top,left,right,bottom,overflow,text-align,align-items,
    justify-content,border-radius,box-shadow,transition,transform,
    opacity,z-index,content,cursor,line-height,letter-spacing,
    text-decoration,animation,from,to},
  keywordstyle=\color{blue!80!black},
  sensitive=false,
  morecomment=[l]{//},
  morecomment=[s]{/*}{*/},
  morestring=[b]",
  morestring=[b]',
}
```

전역 코드 스타일:

```latex
\lstset{
  basicstyle=\ttfamily\small,
  breaklines=true,
  frame=single,
  backgroundcolor=\color{gray!10},
  keywordstyle=\color{blue},
  commentstyle=\color{green!50!black},
  stringstyle=\color{red!60!black},
  showstringspaces=false,
  numbers=left,
  numberstyle=\tiny\color{gray},
  xleftmargin=1.5em,
  framexleftmargin=1.5em,
}
```

### 수학 기호

```latex
\usepackage{amssymb}
```

- `\checkmark` (✓), `$\times$` (×) 사용을 위해 필요

### 표

```latex
\usepackage{booktabs}   % \toprule, \midrule, \bottomrule
\usepackage{array}      % 컬럼 타입 확장
\usepackage{longtable}  % 페이지 넘김 표
```

### 리스트

```latex
\usepackage{enumitem}
```

- `\begin{enumerate}[leftmargin=*, label=...]` 옵션 사용 가능

### 컬러 박스 (notebox, warningbox, tipbox)

```latex
\usepackage[most]{tcolorbox}

\tcbset{
  base box style/.style={
    arc=3pt, boxrule=0.8pt,
    left=6pt, right=6pt, top=4pt, bottom=4pt,
    fonttitle=\small\bfseries\sffamily,
  }
}

\newtcolorbox{notebox}{
  base box style,
  colback=blue!5!white,
  colframe=blue!50!black,
  title={참고},
}

\newtcolorbox{warningbox}{
  base box style,
  colback=orange!8!white,
  colframe=orange!70!black,
  title={주의},
}

\newtcolorbox{tipbox}{
  base box style,
  colback=green!5!white,
  colframe=green!50!black,
  title={팁},
}
```

사용 예:
```latex
\begin{notebox}
  참고 내용을 여기에 작성합니다.
\end{notebox}
```

### 하이퍼링크

```latex
\usepackage[
  bookmarks=true,
  bookmarksnumbered=true,
  colorlinks=true,
  linkcolor=blue!70!black,
  urlcolor=blue!70!black,
  citecolor=green!50!black,
  pdfauthor={저자},
  pdftitle={문서 제목},
]{hyperref}
```

> **주의**: `bookmarks` 옵션은 반드시 `\usepackage[...]` 안에 전달해야 합니다.  
> `\hypersetup{bookmarks=true}`로 전달하면 "already used" 경고가 발생합니다.

### 섹션 스타일 (titlesec)

```latex
\usepackage{titlesec}

% chapter 제목 스타일
\titleformat{\chapter}[display]
  {\normalfont\huge\bfseries\sffamily}
  {\filleft\Large\sffamily Chapter\ \thechapter}
  {0.5em}
  {\titlerule[1.5pt]\vspace{0.5em}\filright}
  [\vspace{0.5em}\titlerule]

% section 스타일 (아래 구분선 포함)
\titleformat{\section}
  {\Large\bfseries\sffamily}
  {\thesection}{1em}{}[\titlerule]

% subsection 스타일
\titleformat{\subsection}
  {\large\bfseries\sffamily}
  {\thesubsection}{1em}{}

% subsubsection 스타일 (명시적 정의 권장)
\titleformat{\subsubsection}
  {\normalsize\bfseries\sffamily}
  {\thesubsubsection}{1em}{}

% chapter 앞 간격 조정
\titlespacing*{\chapter}{0pt}{-10pt}{30pt}
```

### 헤더/푸터 (fancyhdr)

```latex
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[LE,RO]{\small\sffamily 문서 제목}
\fancyhead[RE,LO]{\small\sffamily\leftmark}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}

% chapter 시작 페이지는 plain 스타일
\fancypagestyle{plain}{%
  \fancyhf{}
  \fancyfoot[C]{\thepage}
  \renewcommand{\headrulewidth}{0pt}
}
```

### TOC 설정

```latex
% TOC 깊이: chapter(0), section(1), subsection(2)
\setcounter{tocdepth}{2}
% 섹션 번호 깊이: subsubsection(3)까지 번호 부여
\setcounter{secnumdepth}{3}

% tocloft: TOC 번호 폭 조정 (챕터10 이상의 "10.x.y" 번호 수용)
\usepackage{tocloft}
\setlength{\cftsubsecnumwidth}{3.3em}
```

### Overfull 경고 억제

```latex
% 단락 줄바꿈 유연성 (paragraph overfull 방지)
\setlength{\emergencystretch}{3em}

% 2pt 이하의 미세한 overfull hbox 경고 억제
% (CJK 폰트 메트릭 차이로 인한 허용 가능 수준)
\hfuzz=2pt
```

### subfiles (챕터별 독립 컴파일)

```latex
\usepackage{subfiles}
```

각 챕터 파일 상단:
```latex
\documentclass[main.tex]{subfiles}
\begin{document}
\chapter{챕터 제목}
% ... 내용 ...
\end{document}
```

main.tex에서 포함:
```latex
\subfile{chapter1}   % 확장자 없이
```

---

## 문서 구조 (book 클래스)

```latex
\begin{document}

% 표지
\begin{titlepage}
  % ...
\end{titlepage}

% 목차 (로마자 페이지 번호)
\frontmatter
\tableofcontents
\clearpage

% 본문 (아라비아 페이지 번호, 챕터 번호 리셋)
\mainmatter
\subfile{chapter1}
\subfile{chapter2}
% ...

\end{document}
```

---

## 자주 발생하는 문제 및 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| `\checkmark` undefined | `amssymb` 미로드 | `\usepackage{amssymb}` 추가 |
| `notebox` environment undefined | `tcolorbox` 미설정 | 위의 `\newtcolorbox` 정의 추가 |
| CSS/JS language undefined in listings | 기본 미포함 | `\lstdefinelanguage` 직접 정의 |
| `bookmarks already used` 경고 | `\hypersetup`에 bookmarks 전달 | `\usepackage[bookmarks=true]{hyperref}`로 이동 |
| TOC subsection overfull | 챕터10 이상에서 "10.x.y" 번호 폭 부족 | `\setlength{\cftsubsecnumwidth}{3.3em}` |
| 이모지 출력 불가 | CJK 폰트 이모지 미지원 | 텍스트 대체 (예: `👋` → `(^_^)/`) |
| URL 계행 불가로 overfull | `\texttt{URL}` 사용 | `\url{URL}`로 교체 (`hyperref` 제공) |
| 긴 단락 overfull | 줄바꿈 공간 부족 | `\begin{sloppypar}...\end{sloppypar}` 사용 |

---

## 권장 디렉터리 구조

```
project/
├── main.tex          # 전체 합본 (프리앰블 + \subfile)
├── chapter1.tex      # \documentclass[main.tex]{subfiles}
├── chapter2.tex
├── ...
└── build/
    ├── main.pdf      # 최종 출력
    └── *.aux, *.toc  # 중간 파일
```
