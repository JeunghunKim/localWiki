# Chapter 3: App Router와 서버 컴포넌트

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. App Router와 Pages Router의 차이점을 설명하고 적합한 상황에 맞게 선택할 수 있다.
2. `app/` 디렉터리의 폴더/파일 기반 라우팅 구조를 이해하고 직접 구성할 수 있다.
3. `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` 등 특수 파일의 역할을 파악하고 활용할 수 있다.
4. React Server Components(RSC)와 Client Components의 차이점을 이해하고 올바르게 구분하여 사용할 수 있다.
5. 서버 컴포넌트에서 직접 데이터를 페칭하는 패턴을 구현할 수 있다.
6. 동적 라우트, Route Groups, Parallel Routes 개념을 설명할 수 있다.

---

## 1. App Router 소개

### 1.1 App Router란?

Next.js 13(2022년 10월)에서 도입된 **App Router**는 React Server Components를 기반으로 하는 새로운 라우팅 시스템입니다. `app/` 디렉터리를 사용하며, 기존 `pages/` 디렉터리 기반의 **Pages Router**와 공존할 수 있습니다.

App Router는 다음 핵심 기술을 활용합니다:

- **React Server Components (RSC)**: 서버에서만 렌더링되는 컴포넌트
- **Streaming**: 부분적 HTML을 점진적으로 전송
- **Suspense**: 비동기 데이터 로딩 UI 처리
- **중첩 레이아웃**: 경로별로 독립적인 레이아웃 구성

### 1.2 Pages Router vs App Router 비교

| 항목 | Pages Router | App Router |
|---|---|---|
| 디렉터리 | `pages/` | `app/` |
| 기본 컴포넌트 | Client Component | Server Component |
| 데이터 페칭 | `getStaticProps`, `getServerSideProps` | `async` 컴포넌트 + `fetch()` |
| 레이아웃 | `_app.tsx`로 전역 관리 | 중첩 `layout.tsx` |
| 로딩/에러 UI | 별도 구현 필요 | `loading.tsx`, `error.tsx` |
| Streaming | 미지원 | 지원 (Suspense 기반) |
| 안정성 | 안정 (레거시) | Next.js 13.4+ 안정 |

> **권장사항**: 새 프로젝트에는 App Router를 사용하세요. 기존 Pages Router 프로젝트는 점진적으로 마이그레이션할 수 있습니다.

---

## 2. `app/` 디렉터리 구조

App Router에서는 **폴더가 라우트 세그먼트**가 되고, **파일이 UI**를 담당합니다.

```
app/
├── layout.tsx          # 루트 레이아웃 (필수)
├── page.tsx            # / 경로
├── globals.css
├── about/
│   └── page.tsx        # /about 경로
├── blog/
│   ├── layout.tsx      # /blog/* 공통 레이아웃
│   ├── page.tsx        # /blog 경로
│   └── [slug]/
│       ├── page.tsx    # /blog/:slug 경로
│       └── loading.tsx # /blog/:slug 로딩 UI
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx        # /dashboard
│   ├── settings/
│   │   └── page.tsx    # /dashboard/settings
│   └── (overview)/     # Route Group (URL에 포함되지 않음)
│       └── page.tsx
└── api/
    └── users/
        └── route.ts    # API Route Handler
```

### 라우트 세그먼트 규칙

- 폴더 이름 → URL 경로 세그먼트
- `page.tsx`가 있는 폴더만 공개적으로 접근 가능
- `layout.tsx`는 해당 폴더와 하위 경로에 적용

---

## 3. 특수 파일들

App Router는 특정 이름을 가진 파일에 특별한 역할을 부여합니다.

### 3.1 `page.tsx` — 페이지

해당 경로의 고유한 UI를 정의합니다. `page.tsx`가 있어야 그 경로로 접근할 수 있습니다.

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>회사 소개</h1>
      <p>저희 회사는 2020년에 설립되었습니다.</p>
    </main>
  );
}
```

`searchParams`와 `params`를 props로 받을 수 있습니다:

```tsx
// app/blog/[slug]/page.tsx
interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export default function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = params;
  const page = searchParams.page ?? '1';

  return <div>포스트: {slug} (페이지: {page})</div>;
}
```

### 3.2 `layout.tsx` — 레이아웃

자식 페이지들을 감싸는 공통 UI입니다. **상태를 유지하며 리렌더링되지 않습니다.**

```tsx
// app/layout.tsx (루트 레이아웃 — 필수)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: '학습용 Next.js 앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header>
          <nav>글로벌 네비게이션</nav>
        </header>
        <main>{children}</main>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
```

**중첩 레이아웃** — 특정 섹션에만 적용되는 레이아웃:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside>
        <ul>
          <li><a href="/dashboard">홈</a></li>
          <li><a href="/dashboard/settings">설정</a></li>
        </ul>
      </aside>
      <section>{children}</section>
    </div>
  );
}
```

레이아웃은 중첩됩니다: `RootLayout` → `DashboardLayout` → `page.tsx`

### 3.3 `loading.tsx` — 로딩 UI

페이지가 로딩 중일 때 표시되는 UI입니다. React `Suspense`로 자동 래핑됩니다.

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>데이터를 불러오는 중...</p>
    </div>
  );
}
```

### 3.4 `error.tsx` — 에러 처리

렌더링 중 발생한 에러를 처리합니다. **반드시 Client Component**여야 합니다.

```tsx
// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    // 에러 로깅 서비스에 전송
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>문제가 발생했습니다!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 3.5 `not-found.tsx` — 404 페이지

`notFound()` 함수를 호출하거나 존재하지 않는 경로에 접근할 때 표시됩니다.

```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>페이지를 찾을 수 없습니다 (404)</h2>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  );
}
```

특정 경로에서 `notFound()` 호출:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound(); // not-found.tsx 렌더링
  }

  return <article>{post.title}</article>;
}
```

### 3.6 `template.tsx` — 템플릿

`layout.tsx`와 비슷하지만, **탐색 시마다 새 인스턴스를 생성**합니다. 상태를 유지하지 않고 페이지 전환마다 마운트/언마운트 효과가 필요할 때 사용합니다.

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

---

## 4. React Server Components (RSC) vs Client Components

### 4.1 서버 컴포넌트 (기본값)

App Router의 모든 컴포넌트는 기본적으로 **서버 컴포넌트**입니다.

**특징:**
- 서버에서만 실행되어 클라이언트에 JS 번들이 전송되지 않음
- `async/await`를 컴포넌트 함수에서 직접 사용 가능
- 데이터베이스, 파일 시스템, 내부 API에 직접 접근 가능
- `useState`, `useEffect` 등 React 훅 사용 불가
- 이벤트 핸들러 사용 불가

```tsx
// app/users/page.tsx — 서버 컴포넌트 (기본값)
import { db } from '@/lib/db';

export default async function UsersPage() {
  // 서버에서 직접 DB 쿼리 (클라이언트에 노출되지 않음)
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 4.2 클라이언트 컴포넌트

파일 최상단에 `'use client'` 지시어를 추가하면 클라이언트 컴포넌트가 됩니다.

**특징:**
- 브라우저에서 실행 (JS 번들에 포함)
- `useState`, `useEffect`, `useContext` 등 모든 훅 사용 가능
- 이벤트 핸들러 사용 가능
- `window`, `document` 등 브라우저 API 접근 가능
- 데이터베이스에 직접 접근 불가

```tsx
// components/Counter.tsx — 클라이언트 컴포넌트
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
      <button onClick={() => setCount(count - 1)}>감소</button>
    </div>
  );
}
```

### 4.3 언제 무엇을 사용할까?

| 판단 기준 | 서버 컴포넌트 | 클라이언트 컴포넌트 |
|---|:---:|:---:|
| 데이터 페칭 (DB, API) | ✅ | ❌ |
| 민감한 정보 (API 키 등) | ✅ | ❌ |
| 큰 의존성 (번들 크기 감소) | ✅ | ❌ |
| `useState`, `useReducer` | ❌ | ✅ |
| `useEffect` | ❌ | ✅ |
| 브라우저 이벤트 핸들러 | ❌ | ✅ |
| 브라우저 전용 API | ❌ | ✅ |
| React Context | ❌ | ✅ |
| 커스텀 훅 (상태/효과 사용) | ❌ | ✅ |

### 4.4 컴포넌트 구성 패턴

서버 컴포넌트는 클라이언트 컴포넌트를 **children**으로 받을 수 있습니다:

```tsx
// app/page.tsx — 서버 컴포넌트
import { fetchProducts } from '@/lib/api';
import ProductList from '@/components/ProductList'; // 서버 컴포넌트
import SearchBar from '@/components/SearchBar';     // 클라이언트 컴포넌트

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div>
      <SearchBar />           {/* 클라이언트 컴포넌트 */}
      <ProductList products={products} /> {/* 서버 컴포넌트 */}
    </div>
  );
}
```

> **주의**: 클라이언트 컴포넌트에서 서버 컴포넌트를 **직접 import**하면 안 됩니다. `children` prop으로 전달하세요.

---

## 5. 코드 예제: 서버 컴포넌트로 데이터 페칭

```tsx
// app/posts/page.tsx
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'force-cache', // 정적 캐싱 (SSG와 유사)
  });

  if (!res.ok) {
    throw new Error('포스트를 불러오지 못했습니다.');
  }

  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="container">
      <h1>블로그 포스트 목록</h1>
      <ul className="post-list">
        {posts.slice(0, 10).map((post) => (
          <li key={post.id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.body.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. 코드 예제: 클라이언트 컴포넌트로 상태 관리

```tsx
// components/TodoList.tsx
'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input, completed: false },
    ]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="새 할 일 입력..."
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 7. 동적 라우트 (App Router 방식)

대괄호 `[param]`으로 동적 세그먼트를 정의합니다.

```
app/
└── blog/
    └── [slug]/
        └── page.tsx    # /blog/hello-world, /blog/next-js-13 등
```

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

interface Post {
  slug: string;
  title: string;
  content: string;
}

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

// 정적 경로 생성 (빌드 시 사전 렌더링)
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/posts');
  const posts: Post[] = await res.json();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

**여러 세그먼트를 캐치하는 동적 라우트:**

```
app/
└── docs/
    └── [...slug]/
        └── page.tsx    # /docs/a, /docs/a/b, /docs/a/b/c 모두 매칭
```

---

## 8. Route Groups `(group)/`

괄호로 묶인 폴더는 **URL에 포함되지 않으면서** 파일을 논리적으로 그룹화합니다.

```
app/
├── (marketing)/
│   ├── layout.tsx      # 마케팅 페이지 전용 레이아웃
│   ├── about/
│   │   └── page.tsx    # /about (URL: /about)
│   └── blog/
│       └── page.tsx    # /blog (URL: /blog)
└── (shop)/
    ├── layout.tsx      # 쇼핑 페이지 전용 레이아웃
    ├── products/
    │   └── page.tsx    # /products
    └── cart/
        └── page.tsx    # /cart
```

활용 사례:
- 인증/비인증 사용자별 레이아웃 분리
- 마케팅 페이지와 앱 페이지 레이아웃 분리
- 코드베이스의 논리적 구성

---

## 9. Parallel Routes와 Intercepting Routes

### 9.1 Parallel Routes (병렬 라우트)

`@slot` 문법으로 동일한 레이아웃에서 여러 페이지를 동시에 렌더링합니다.

```
app/
└── dashboard/
    ├── layout.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @team/
        └── page.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="panels">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

### 9.2 Intercepting Routes (가로채기 라우트)

현재 레이아웃 내에서 다른 경로를 가로채 모달처럼 표시합니다. `(.)`, `(..)`, `(...)` 문법 사용.

```
app/
└── feed/
    ├── page.tsx
    └── (..)photo/
        └── [id]/
            └── page.tsx  # 피드에서 사진 클릭 시 모달로 표시
```

---

## 요약

- **App Router**는 `app/` 디렉터리를 기반으로 하며, React Server Components와 Streaming을 지원한다.
- 특수 파일(`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)은 각각 고유한 역할을 가진다.
- **서버 컴포넌트**는 기본값이며 데이터 페칭과 서버 로직에 적합하고, **클라이언트 컴포넌트**는 인터랙티브 UI에 적합하다.
- 동적 라우트는 `[param]`, 선택적 캐치올은 `[[...param]]`, 여러 세그먼트 캐치는 `[...param]`으로 정의한다.
- Route Groups `(group)/`는 URL에 영향 없이 파일을 논리적으로 구성한다.
- Parallel Routes와 Intercepting Routes로 복잡한 UI 패턴(대시보드, 모달)을 구현할 수 있다.

---

## 연습 문제

1. **레이아웃 구성**: 다음 구조를 가진 Next.js App Router 프로젝트를 만드세요.
   - `/` — 홈 페이지 (글로벌 헤더, 푸터 포함)
   - `/dashboard` — 대시보드 (사이드바 포함, 글로벌 헤더/푸터는 없음)
   - `/dashboard/settings` — 설정 페이지 (대시보드 레이아웃 상속)
   - 각 경로에 적절한 `layout.tsx`와 `page.tsx`를 생성하고, Route Groups로 레이아웃을 분리하세요.

2. **서버/클라이언트 컴포넌트 구분**: 아래 요구사항의 컴포넌트를 서버 컴포넌트와 클라이언트 컴포넌트로 올바르게 구현하세요.
   - `ProductsPage`: `https://fakestoreapi.com/products`에서 상품 목록을 페칭하여 표시
   - `AddToCartButton`: 클릭 시 장바구니에 상품을 추가하는 버튼 (로컬 상태 관리)
   - `ProductsPage`에서 `AddToCartButton`을 올바르게 조합하세요.

3. **동적 라우트와 에러 처리**: `app/users/[id]/page.tsx`를 구현하세요.
   - `https://jsonplaceholder.typicode.com/users/:id`에서 사용자 정보를 페칭
   - 존재하지 않는 ID(예: 999)에 접근하면 `notFound()`를 호출
   - `app/users/[id]/loading.tsx`로 로딩 UI를 구현
   - `app/users/[id]/error.tsx`로 에러 처리 UI를 구현
