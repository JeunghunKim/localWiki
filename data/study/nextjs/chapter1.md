# Chapter 1: Next.js 소개 및 환경 설정

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. Next.js가 무엇인지, 왜 사용하는지 설명할 수 있다.
2. CSR, SSR, SSG의 차이점을 이해하고 각각의 장단점을 비교할 수 있다.
3. React와 Next.js의 차이점을 설명할 수 있다.
4. Next.js의 핵심 기능(파일 기반 라우팅, API Routes, 이미지 최적화 등)을 나열할 수 있다.
5. Node.js 환경을 확인하고 `create-next-app`으로 새 프로젝트를 생성할 수 있다.
6. 생성된 프로젝트의 디렉터리 구조를 이해하고 각 파일의 역할을 설명할 수 있다.
7. 개발 서버를 실행하고 첫 번째 Hello World 페이지를 만들 수 있다.

---

## 1. Next.js란 무엇인가

**Next.js**는 Vercel이 개발한 React 기반의 풀스택 웹 프레임워크입니다. 순수 React 애플리케이션의 한계(클라이언트 사이드 렌더링 전용, SEO 취약, 별도 설정 필요 등)를 보완하기 위해 만들어졌습니다.

### 렌더링 방식 비교

웹 애플리케이션의 렌더링 방식은 크게 세 가지로 나뉩니다.

#### CSR (Client-Side Rendering, 클라이언트 사이드 렌더링)

- **동작 방식**: 브라우저가 빈 HTML을 받은 후 JavaScript를 다운로드하여 페이지를 완성합니다.
- **장점**: 초기 로드 이후 페이지 전환이 빠르고, 서버 부하가 적습니다.
- **단점**: 초기 로딩이 느리고, 검색 엔진이 JavaScript를 실행하지 않으면 SEO에 불리합니다.
- **대표 예**: 순수 React 앱 (Create React App)

```
브라우저 요청 → 빈 HTML 수신 → JS 번들 다운로드 → React 실행 → 화면 렌더링
```

#### SSR (Server-Side Rendering, 서버 사이드 렌더링)

- **동작 방식**: 서버에서 매 요청마다 완성된 HTML을 생성하여 브라우저에 전달합니다.
- **장점**: 초기 로딩이 빠르고, SEO에 유리하며 항상 최신 데이터를 보여줄 수 있습니다.
- **단점**: 서버 부하가 크고, 매 요청마다 서버 처리가 필요합니다.
- **대표 예**: Next.js의 `getServerSideProps`

```
브라우저 요청 → 서버에서 HTML 생성 (최신 데이터 포함) → 완성된 HTML 수신 → 화면 표시
```

#### SSG (Static Site Generation, 정적 사이트 생성)

- **동작 방식**: 빌드 시점에 HTML 파일을 미리 생성합니다.
- **장점**: 매우 빠른 응답 속도, CDN 캐싱 가능, 서버 불필요.
- **단점**: 빌드 후 데이터 변경 시 재빌드가 필요합니다.
- **대표 예**: Next.js의 `getStaticProps`

```
빌드 시 → 서버에서 HTML 미리 생성 → CDN에 배포 → 브라우저 요청 → 즉시 HTML 제공
```

> **ISR (Incremental Static Regeneration)**: Next.js의 강력한 기능으로, SSG의 장점을 유지하면서 일정 시간마다 백그라운드에서 페이지를 재생성합니다.

---

## 2. React vs Next.js 비교

| 항목 | React | Next.js |
|------|-------|---------|
| **타입** | UI 라이브러리 | 풀스택 프레임워크 |
| **렌더링** | CSR 기본 | CSR, SSR, SSG, ISR 지원 |
| **라우팅** | 별도 라이브러리 필요 (react-router) | 파일 기반 라우팅 내장 |
| **API 서버** | 별도 서버 필요 | API Routes 내장 |
| **SEO** | 추가 설정 필요 | 기본 지원 |
| **이미지 최적화** | 수동 처리 | `next/image` 내장 |
| **코드 분할** | 수동 설정 | 자동 처리 |
| **설정** | CRA 또는 Vite 등 필요 | 제로 설정 시작 가능 |
| **학습 곡선** | 낮음 | 중간 (React 지식 필요) |
| **배포** | 정적 호스팅 가능 | Vercel 최적화, 다양한 옵션 |

---

## 3. Next.js 주요 기능

### 3.1 파일 기반 라우팅 (File-based Routing)

`pages/` 또는 `app/` 디렉터리의 파일 구조가 URL 경로로 자동 변환됩니다.

```
app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
└── blog/
    ├── page.tsx      → /blog
    └── [slug]/
        └── page.tsx  → /blog/:slug
```

별도의 라우터 설정 없이 파일만 생성하면 됩니다.

### 3.2 서버 사이드 렌더링 (SSR) 및 정적 생성 (SSG)

- **App Router (권장)**: React Server Components 기반, `fetch`에 캐시 옵션으로 제어
- **Pages Router**: `getServerSideProps`, `getStaticProps` 함수로 제어

### 3.3 API Routes

`pages/api/` 또는 `app/api/` 디렉터리에 API 엔드포인트를 만들 수 있습니다. 별도 Express 서버 없이 백엔드 로직을 작성할 수 있습니다.

### 3.4 이미지 최적화 (`next/image`)

- WebP 자동 변환
- 레이지 로딩 기본 지원
- 반응형 이미지 크기 자동 조정
- Core Web Vitals 개선

### 3.5 폰트 최적화 (`next/font`)

Google Fonts를 빌드 시 자동으로 다운로드하고 셀프 호스팅하여 레이아웃 이동(CLS)을 방지합니다.

### 3.6 자동 코드 분할

각 페이지에서 필요한 JavaScript만 로드하여 성능을 최적화합니다.

### 3.7 미들웨어 (Middleware)

요청이 완료되기 전에 코드를 실행할 수 있어, 인증, 리다이렉트, A/B 테스트 등에 활용됩니다.

---

## 4. 개발 환경 설정

### 4.1 Node.js 및 npm 버전 확인

Next.js 14 이상은 **Node.js 18.17 이상**이 필요합니다.

```bash
# Node.js 버전 확인
node --version
# 출력 예: v20.11.0

# npm 버전 확인
npm --version
# 출력 예: 10.2.4
```

Node.js가 설치되지 않았다면 [nodejs.org](https://nodejs.org)에서 LTS 버전을 다운로드합니다.

> **팁**: 여러 Node.js 버전을 관리하려면 `nvm` (Node Version Manager) 사용을 권장합니다.

```bash
# nvm으로 최신 LTS 설치
nvm install --lts
nvm use --lts
```

### 4.2 `create-next-app`으로 프로젝트 생성

```bash
npx create-next-app@latest my-next-app
```

명령 실행 후 대화형 설정이 시작됩니다:

```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → No
✔ Would you like to use App Router? (recommended) → Yes
✔ Would you like to customize the default import alias (@/*)? → No
```

> **App Router vs Pages Router**: Next.js 13부터 도입된 App Router가 권장 방식입니다. React Server Components, Streaming, 더 직관적인 레이아웃 시스템을 지원합니다.

---

## 5. 프로젝트 디렉터리 구조

생성된 프로젝트의 구조는 다음과 같습니다:

```
my-next-app/
├── app/                      # App Router 루트 디렉터리
│   ├── favicon.ico           # 파비콘
│   ├── globals.css           # 전역 스타일시트
│   ├── layout.tsx            # 루트 레이아웃 (모든 페이지 공통)
│   └── page.tsx              # 홈 페이지 (/ 경로)
├── public/                   # 정적 파일 (이미지, 아이콘 등)
│   ├── next.svg
│   └── vercel.svg
├── node_modules/             # npm 패키지 (버전 관리 제외)
├── .eslintrc.json            # ESLint 설정
├── .gitignore                # Git 제외 파일 목록
├── next.config.js            # Next.js 설정 파일
├── package.json              # 프로젝트 메타데이터 및 의존성
├── postcss.config.js         # PostCSS 설정 (Tailwind 필요)
├── tailwind.config.ts        # Tailwind CSS 설정
└── tsconfig.json             # TypeScript 설정
```

### 주요 파일 설명

#### `app/layout.tsx` — 루트 레이아웃

모든 페이지를 감싸는 공통 레이아웃입니다. `<html>`, `<body>` 태그를 포함합니다.

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next App',
  description: 'Next.js로 만든 첫 번째 앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

#### `app/page.tsx` — 홈 페이지

`/` 경로에 해당하는 페이지 컴포넌트입니다.

#### `next.config.js` — Next.js 설정

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 설정 옵션
};

module.exports = nextConfig;
```

#### `public/` — 정적 파일

이 디렉터리의 파일은 `/` 경로로 직접 접근 가능합니다.
- `public/logo.png` → `http://localhost:3000/logo.png`

---

## 6. 개발 서버 실행

```bash
# 프로젝트 디렉터리로 이동
cd my-next-app

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속하면 기본 페이지가 표시됩니다.

### package.json 스크립트 정리

```json
{
  "scripts": {
    "dev": "next dev",       // 개발 서버 (핫 리로딩 포함)
    "build": "next build",   // 프로덕션 빌드
    "start": "next start",   // 프로덕션 서버 실행 (build 후)
    "lint": "next lint"      // ESLint 검사
  }
}
```

---

## 7. 첫 번째 페이지 만들기: Hello World

`app/page.tsx`를 열고 내용을 수정합니다.

### 기본 Hello World

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Hello, World!</h1>
      <p>Next.js 학습에 오신 것을 환영합니다.</p>
    </main>
  );
}
```

### Tailwind CSS 스타일 적용

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Hello, World! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Next.js 학습에 오신 것을 환영합니다.
        </p>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            🚀 App Router + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
```

### 메타데이터 추가

```tsx
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '홈 | My Next App',
  description: 'Next.js로 만든 첫 번째 페이지입니다.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Hello, World! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Next.js 학습에 오신 것을 환영합니다.
        </p>
      </div>
    </main>
  );
}
```

파일을 저장하면 개발 서버에서 자동으로 변경 사항이 반영됩니다(Hot Module Replacement).

---

## 요약

- **Next.js**는 React 기반의 풀스택 프레임워크로, SSR·SSG·CSR을 모두 지원합니다.
- **CSR**은 브라우저에서 렌더링, **SSR**은 서버에서 매 요청마다 렌더링, **SSG**는 빌드 시 미리 렌더링합니다.
- React와 달리 Next.js는 **파일 기반 라우팅**, **API Routes**, **이미지·폰트 최적화**를 내장합니다.
- `create-next-app`으로 TypeScript + Tailwind CSS + App Router 옵션을 선택해 프로젝트를 시작합니다.
- 프로젝트 구조에서 `app/` 디렉터리가 라우팅의 핵심이며, `layout.tsx`는 공통 레이아웃, `page.tsx`는 각 경로의 페이지 컴포넌트입니다.
- `npm run dev`로 개발 서버를 실행하고 핫 리로딩 환경에서 개발합니다.

---

## 연습 문제

1. **렌더링 방식 선택**: 다음 시나리오에서 CSR, SSR, SSG 중 어떤 방식이 가장 적합한지 이유와 함께 설명하세요.
   - (a) 실시간 주식 가격 대시보드
   - (b) 회사 소개 페이지 (내용이 거의 바뀌지 않음)
   - (c) 로그인한 사용자의 개인 프로필 페이지

2. **프로젝트 구조 수정**: 새 Next.js 프로젝트를 생성한 후, `app/` 디렉터리에 `about/page.tsx` 파일을 만들어 간단한 소개 페이지를 작성하세요. `/about` 경로로 접근했을 때 자신의 이름과 한 줄 소개가 표시되어야 합니다.

3. **레이아웃 커스터마이징**: `app/layout.tsx`를 수정하여 모든 페이지 상단에 네비게이션 바(홈, 소개 링크 포함)와 하단에 푸터("© 2024 My Next App")가 표시되도록 만드세요.
