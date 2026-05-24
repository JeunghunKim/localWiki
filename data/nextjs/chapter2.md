# Chapter 2: 파일 기반 라우팅 (Pages Router)

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. Pages Router의 파일 기반 라우팅 원리를 설명하고 직접 페이지를 생성할 수 있다.
2. 동적 라우트(`[id].js`, `[...slug].js`)를 작성하고 URL 파라미터를 활용할 수 있다.
3. 중첩 라우트를 구성하여 계층적인 URL 구조를 만들 수 있다.
4. `<Link>` 컴포넌트를 사용하여 클라이언트 사이드 네비게이션을 구현할 수 있다.
5. `useRouter` 훅으로 프로그래밍 방식의 라우팅과 쿼리 파라미터 접근을 구현할 수 있다.
6. `_app.js`와 `_document.js`의 역할을 이해하고 커스터마이징할 수 있다.
7. 커스텀 404 페이지를 만들 수 있다.

---

## 1. Pages Router란 무엇인가

**Pages Router**는 Next.js의 전통적인 라우팅 시스템으로, `pages/` 디렉터리의 파일 구조를 URL 경로와 1:1로 매핑합니다. Next.js 13 이전의 기본 라우팅 방식이며, 현재도 널리 사용되고 있습니다.

### Pages Router vs App Router

| 항목 | Pages Router | App Router |
|------|-------------|------------|
| **도입 버전** | Next.js 초기부터 | Next.js 13 (안정: 14) |
| **기반 기술** | React 컴포넌트 | React Server Components |
| **레이아웃** | `_app.js` 단일 레이아웃 | 중첩 레이아웃 지원 |
| **데이터 페칭** | `getServerSideProps`, `getStaticProps` | `async/await` + `fetch` |
| **스트리밍** | 미지원 | 지원 |
| **러닝 커브** | 낮음 | 중간 |
| **안정성** | 매우 안정적 | 안정적 (권장) |

> **언제 Pages Router를 사용하나요?**
> - 기존 Next.js 프로젝트를 유지보수할 때
> - 팀이 Pages Router에 익숙할 때
> - App Router의 새로운 개념 학습 전 기초를 다질 때

---

## 2. `pages/` 디렉터리 기반 라우팅 원리

`pages/` 디렉터리에 파일을 생성하면 자동으로 해당 경로의 라우트가 생성됩니다.

### 기본 라우팅 규칙

```
pages/
├── index.js          → /
├── about.js          → /about
├── contact.js        → /contact
├── blog/
│   ├── index.js      → /blog
│   └── first-post.js → /blog/first-post
└── api/
    └── hello.js      → /api/hello (API Route)
```

### 라우팅 규칙 요약

- `pages/index.js` → 루트 경로 (`/`)
- `pages/about.js` → `/about`
- `pages/blog/index.js` → `/blog` (디렉터리 인덱스)
- `pages/blog/post.js` → `/blog/post`
- 파일 확장자는 `.js`, `.jsx`, `.ts`, `.tsx` 모두 지원

---

## 3. 기본 페이지 생성 예제

### 홈 페이지 (`pages/index.js`)

```jsx
// pages/index.js
export default function HomePage() {
  return (
    <div>
      <h1>홈 페이지</h1>
      <p>Next.js Pages Router에 오신 것을 환영합니다!</p>
    </div>
  );
}
```

### 소개 페이지 (`pages/about.js`)

```jsx
// pages/about.js
export default function AboutPage() {
  return (
    <div>
      <h1>소개 페이지</h1>
      <p>이 사이트는 Next.js로 만들어졌습니다.</p>
      <ul>
        <li>📍 위치: 서울, 대한민국</li>
        <li>🛠 기술: Next.js, React, TypeScript</li>
        <li>📧 이메일: hello@example.com</li>
      </ul>
    </div>
  );
}
```

### 블로그 목록 페이지 (`pages/blog/index.js`)

```jsx
// pages/blog/index.js
const posts = [
  { id: 1, title: 'Next.js 시작하기', date: '2024-01-01' },
  { id: 2, title: '파일 기반 라우팅 이해하기', date: '2024-01-08' },
  { id: 3, title: 'getStaticProps 활용법', date: '2024-01-15' },
];

export default function BlogIndexPage() {
  return (
    <div>
      <h1>블로그</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> — {post.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 4. 동적 라우트

### 4.1 단일 파라미터 동적 라우트 (`[id].js`)

대괄호(`[]`)로 감싼 파일명은 동적 세그먼트를 나타냅니다.

```
pages/blog/[id].js  →  /blog/1, /blog/2, /blog/abc, ...
```

```jsx
// pages/blog/[id].js
import { useRouter } from 'next/router';

export default function BlogPostPage() {
  const router = useRouter();
  const { id } = router.query; // URL에서 id 파라미터 추출

  return (
    <div>
      <h1>블로그 포스트</h1>
      <p>포스트 ID: {id}</p>
    </div>
  );
}
```

`/blog/42`에 접속하면 `id`는 `"42"`가 됩니다.

### 4.2 `getStaticProps`와 `getStaticPaths` 조합

```jsx
// pages/blog/[id].js
export default function BlogPostPage({ post }) {
  if (!post) return <div>포스트를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

// 어떤 경로를 미리 생성할지 정의
export async function getStaticPaths() {
  // 실제로는 API나 DB에서 가져옴
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];

  return {
    paths,
    fallback: false, // 정의되지 않은 경로는 404
  };
}

// 각 경로에 대한 데이터 페칭
export async function getStaticProps({ params }) {
  const posts = {
    '1': { id: '1', title: 'Next.js 시작하기', content: '...' },
    '2': { id: '2', title: '라우팅 이해하기', content: '...' },
    '3': { id: '3', title: '데이터 페칭', content: '...' },
  };

  const post = posts[params.id] ?? null;

  return {
    props: { post },
  };
}
```

### 4.3 캐치올 라우트 (`[...slug].js`)

여러 경로 세그먼트를 배열로 받습니다.

```
pages/docs/[...slug].js  →  /docs/a, /docs/a/b, /docs/a/b/c, ...
```

```jsx
// pages/docs/[...slug].js
import { useRouter } from 'next/router';

export default function DocsPage() {
  const router = useRouter();
  const { slug } = router.query;
  // /docs/guide/intro → slug = ['guide', 'intro']
  // /docs/api/route   → slug = ['api', 'route']

  return (
    <div>
      <h1>문서</h1>
      <p>현재 경로: {slug ? slug.join(' / ') : '로딩 중...'}</p>
      <p>세그먼트 수: {slug?.length ?? 0}</p>
    </div>
  );
}
```

### 4.4 선택적 캐치올 라우트 (`[[...slug]].js`)

파라미터가 없는 경우도 처리합니다.

```
pages/docs/[[...slug]].js  →  /docs, /docs/a, /docs/a/b, ...
```

```jsx
// pages/docs/[[...slug]].js
import { useRouter } from 'next/router';

export default function DocsPage() {
  const router = useRouter();
  const { slug } = router.query;
  // /docs → slug = undefined
  // /docs/intro → slug = ['intro']

  if (!slug) {
    return <h1>문서 홈</h1>;
  }

  return (
    <div>
      <h1>문서: {slug.join(' > ')}</h1>
    </div>
  );
}
```

---

## 5. 중첩 라우트 구조

```
pages/
├── index.js              → /
├── about.js              → /about
├── blog/
│   ├── index.js          → /blog
│   ├── [id].js           → /blog/:id
│   └── category/
│       ├── index.js      → /blog/category
│       └── [name].js     → /blog/category/:name
├── products/
│   ├── index.js          → /products
│   ├── [productId].js    → /products/:productId
│   └── [productId]/
│       └── reviews.js    → /products/:productId/reviews
└── api/
    ├── posts/
    │   ├── index.js      → /api/posts (GET 전체 목록)
    │   └── [id].js       → /api/posts/:id (GET 단건)
    └── auth/
        └── [...nextauth].js → /api/auth/* (NextAuth.js)
```

### 중첩 라우트 예제

```jsx
// pages/products/[productId]/reviews.js
import { useRouter } from 'next/router';

export default function ProductReviewsPage() {
  const router = useRouter();
  const { productId } = router.query;

  return (
    <div>
      <h1>상품 리뷰</h1>
      <p>상품 ID: {productId}</p>
      {/* 리뷰 목록 표시 */}
    </div>
  );
}
```

---

## 6. `next/link`의 `<Link>` 컴포넌트

`<Link>` 컴포넌트는 클라이언트 사이드 네비게이션을 구현합니다. 일반 `<a>` 태그와 달리 페이지 전체를 새로 로드하지 않고 필요한 부분만 업데이트합니다.

### 기본 사용법

```jsx
// pages/index.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">홈</Link>
        </li>
        <li>
          <Link href="/about">소개</Link>
        </li>
        <li>
          <Link href="/blog">블로그</Link>
        </li>
      </ul>
    </nav>
  );
}
```

### 동적 라우트로 링크

```jsx
import Link from 'next/link';

const posts = [
  { id: 1, title: '첫 번째 포스트' },
  { id: 2, title: '두 번째 포스트' },
];

export default function BlogList() {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {/* 문자열 방식 */}
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

### 객체 방식으로 경로 지정 (쿼리 파라미터 포함)

```jsx
import Link from 'next/link';

export default function SearchLink() {
  return (
    <Link
      href={{
        pathname: '/blog',
        query: { category: 'nextjs', page: '2' },
      }}
    >
      Next.js 포스트 2페이지
    </Link>
    // 결과 URL: /blog?category=nextjs&page=2
  );
}
```

### `<Link>` 주요 속성

```jsx
import Link from 'next/link';

export default function NavExample() {
  return (
    <>
      {/* replace: 브라우저 히스토리 스택에 추가하지 않음 */}
      <Link href="/login" replace>
        로그인
      </Link>

      {/* prefetch: false → 링크 사전 로딩 비활성화 */}
      <Link href="/heavy-page" prefetch={false}>
        무거운 페이지
      </Link>

      {/* 외부 링크는 일반 <a> 태그 사용 */}
      <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
        Next.js 공식 문서
      </a>
    </>
  );
}
```

---

## 7. `next/router`의 `useRouter` 훅

`useRouter` 훅은 라우터 객체에 접근하여 현재 경로 정보 조회, 프로그래밍 방식 네비게이션, 쿼리 파라미터 접근 등을 가능하게 합니다.

### 기본 사용법 및 라우터 객체 속성

```jsx
// pages/blog/[id].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();

  console.log(router.pathname);  // "/blog/[id]"
  console.log(router.query);     // { id: "42" }  (/blog/42 접속 시)
  console.log(router.asPath);    // "/blog/42?ref=home"
  console.log(router.locale);    // "ko" (다국어 설정 시)
  console.log(router.isReady);   // true (쿼리 파라미터 준비 완료 여부)

  return (
    <div>
      <p>현재 포스트 ID: {router.query.id}</p>
      <p>현재 경로: {router.pathname}</p>
    </div>
  );
}
```

### 프로그래밍 방식 네비게이션

```jsx
import { useRouter } from 'next/router';

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    // 로그인 처리 로직...
    const success = true;

    if (success) {
      // push: 히스토리에 추가하며 이동
      await router.push('/dashboard');

      // 또는 객체 방식
      await router.push({
        pathname: '/dashboard',
        query: { welcome: 'true' },
      });
    }
  };

  const handleBack = () => {
    // replace: 히스토리 교체하며 이동 (뒤로가기 방지)
    router.replace('/');
  };

  const handleGoBack = () => {
    // 브라우저 뒤로가기와 동일
    router.back();
  };

  return (
    <form onSubmit={handleLogin}>
      <button type="submit">로그인</button>
      <button type="button" onClick={handleGoBack}>
        뒤로가기
      </button>
    </form>
  );
}
```

### 쿼리 파라미터 활용

```jsx
// pages/search.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const { q, page = '1' } = router.query;
  // URL: /search?q=nextjs&page=2 → q="nextjs", page="2"

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!router.isReady) return; // 쿼리가 준비될 때까지 대기
    if (!q) return;

    // 검색 실행
    fetchResults(q, Number(page)).then(setResults);
  }, [q, page, router.isReady]);

  const handleSearch = (newQuery) => {
    router.push({
      pathname: '/search',
      query: { q: newQuery, page: '1' },
    });
  };

  return (
    <div>
      <h1>검색 결과: "{q}"</h1>
      <p>페이지: {page}</p>
    </div>
  );
}

async function fetchResults(query, page) {
  // 실제 검색 API 호출
  return [];
}
```

### 라우터 이벤트 구독

```jsx
// pages/_app.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`페이지 이동 시작: ${url}`);
    };
    const handleComplete = (url) => {
      console.log(`페이지 이동 완료: ${url}`);
    };
    const handleError = (err, url) => {
      console.error(`페이지 이동 오류: ${url}`, err);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return <Component {...pageProps} />;
}
```

---

## 8. `_app.js`와 `_document.js`

### 8.1 `pages/_app.js` — 앱 공통 레이아웃

모든 페이지를 감싸는 최상위 컴포넌트입니다. 글로벌 스타일, 공통 레이아웃, 전역 상태 관리에 활용합니다.

```jsx
// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  // Component: 현재 페이지 컴포넌트
  // pageProps: getServerSideProps/getStaticProps에서 반환한 props

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

### 페이지별 레이아웃 분기

```jsx
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  // 각 페이지 컴포넌트에 getLayout 함수를 정의할 수 있음
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
```

```jsx
// pages/dashboard.js
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardPage() {
  return <div>대시보드 내용</div>;
}

// 이 페이지는 DashboardLayout으로 감싸짐
DashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
```

### 8.2 `pages/_document.js` — HTML 문서 구조

서버에서만 렌더링되는 HTML `<html>`, `<head>`, `<body>` 태그를 커스터마이징합니다. 구글 폰트, 언어 설정, 외부 스크립트 추가에 사용합니다.

```jsx
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 모든 페이지 공통 메타 태그 */}
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />

        {/* 구글 폰트 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### `_app.js` vs `_document.js` 비교

| 항목 | `_app.js` | `_document.js` |
|------|-----------|----------------|
| **렌더링** | 서버 + 클라이언트 | 서버 전용 |
| **역할** | 공통 레이아웃, 전역 상태 | HTML 구조 커스터마이징 |
| **React Hooks** | 사용 가능 | 사용 불가 |
| **글로벌 CSS** | 임포트 가능 | 불가 |
| **실행 빈도** | 페이지 이동마다 | 첫 로드 시 한 번 |

---

## 9. 404 페이지 커스터마이징

`pages/404.js` 파일을 생성하면 커스텀 404 페이지가 자동으로 적용됩니다.

```jsx
// pages/404.js
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#333' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem' }}>
        페이지를 찾을 수 없습니다
      </h2>
      <p style={{ color: '#999', marginBottom: '2rem' }}>
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: '#0070f3',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
```

### 500 에러 페이지 커스터마이징

```jsx
// pages/500.js
export default function Custom500() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>500 - 서버 오류</h1>
      <p>서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
    </div>
  );
}
```

---

## 요약

- **Pages Router**는 `pages/` 디렉터리의 파일 구조를 URL 경로로 자동 매핑합니다.
- **동적 라우트**는 `[id].js`로 단일 파라미터, `[...slug].js`로 복수 파라미터를 처리합니다.
- **중첩 라우트**는 디렉터리 구조로 표현하며, 계층적인 URL을 자연스럽게 구성합니다.
- **`<Link>` 컴포넌트**는 클라이언트 사이드 네비게이션을 구현하며, 일반 `<a>` 태그보다 성능이 뛰어납니다.
- **`useRouter` 훅**으로 현재 경로 정보 조회, 쿼리 파라미터 접근, 프로그래밍 방식 네비게이션이 가능합니다.
- **`_app.js`**는 모든 페이지의 공통 래퍼로 전역 상태와 레이아웃에 사용하고, **`_document.js`**는 HTML 문서 구조 커스터마이징에 사용합니다.
- **`pages/404.js`**를 생성하면 커스텀 404 페이지가 자동 적용됩니다.

---

## 연습 문제

1. **블로그 시스템 구축**: `pages/` 디렉터리를 사용하여 다음 라우트를 모두 구현하세요.
   - `/` — 홈 (최신 포스트 3개 목록)
   - `/blog` — 전체 포스트 목록
   - `/blog/[id]` — 개별 포스트 (하드코딩된 데이터 사용 가능)
   - 각 페이지 간 `<Link>` 컴포넌트로 네비게이션 구현

2. **검색 기능 구현**: `pages/search.js`를 만들고 `useRouter`를 활용하여 다음 기능을 구현하세요.
   - URL 쿼리 파라미터(`?q=검색어`)에서 검색어를 읽어 화면에 표시
   - 검색 폼 제출 시 `router.push()`로 URL을 업데이트
   - 검색어가 없을 때는 "검색어를 입력해 주세요" 메시지 표시

3. **공통 레이아웃 적용**: `pages/_app.js`를 수정하고 `components/Layout.jsx`를 만들어 다음을 구현하세요.
   - 모든 페이지에 공통 헤더(사이트 이름, 네비게이션 링크 3개 이상) 적용
   - 모든 페이지에 공통 푸터(저작권 표시) 적용
   - 단, 로그인 페이지(`pages/login.js`)는 헤더/푸터 없이 표시되도록 `getLayout` 패턴 적용
