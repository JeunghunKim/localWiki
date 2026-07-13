# Chapter 4: 데이터 페칭

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. SSG, SSR, ISR, CSR의 차이점을 설명하고 각 전략에 적합한 상황을 판단할 수 있다.
2. Pages Router에서 `getStaticProps`, `getStaticPaths`, `getServerSideProps`를 올바르게 구현할 수 있다.
3. ISR의 `revalidate` 옵션을 사용하여 정적 페이지를 주기적으로 갱신할 수 있다.
4. App Router에서 서버 컴포넌트의 `fetch()`와 다양한 캐싱 옵션을 활용할 수 있다.
5. `Promise.all`을 사용하여 병렬 데이터 페칭으로 성능을 최적화할 수 있다.
6. SWR을 활용하여 클라이언트 사이드 데이터 페칭을 효율적으로 구현할 수 있다.

---

## 1. 데이터 페칭 전략 개요

Next.js는 다양한 데이터 페칭 전략을 지원합니다. 각 전략은 서로 다른 트레이드오프를 가집니다.

| 전략 | 렌더링 시점 | 데이터 최신성 | 성능 | 적합한 사용 사례 |
|---|---|---|---|---|
| **SSG** (Static Site Generation) | 빌드 시 | 낮음 (빌드 시 고정) | 매우 빠름 (CDN 캐싱) | 블로그, 마케팅 페이지, 문서 |
| **ISR** (Incremental Static Regeneration) | 빌드 시 + 주기적 갱신 | 중간 (revalidate 주기) | 빠름 | 자주 변경되지 않는 제품 목록 |
| **SSR** (Server-Side Rendering) | 요청마다 서버 | 높음 (항상 최신) | 보통 (서버 처리 필요) | 사용자별 맞춤 페이지, 실시간 데이터 |
| **CSR** (Client-Side Rendering) | 클라이언트 (브라우저) | 높음 | 초기 로딩 느림 | 대시보드, 사용자 인터랙션 많은 UI |

> **선택 기준**: 얼마나 자주 데이터가 변경되는가? 사용자별로 데이터가 다른가? SEO가 중요한가?

---

## 2. Pages Router 데이터 페칭

### 2.1 `getStaticProps` — 빌드 시 데이터 페칭 (SSG)

빌드 시 서버에서 실행되어 정적 HTML을 생성합니다. 결과는 CDN에 캐싱됩니다.

```tsx
// pages/blog/index.tsx
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Props {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');

  if (!res.ok) {
    return { notFound: true }; // 404 페이지 반환
  }

  const posts: Post[] = await res.json();

  return {
    props: {
      posts: posts.slice(0, 10),
    },
    // ISR: 60초마다 페이지를 재생성
    revalidate: 60,
  };
};

export default function BlogPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <h1>블로그</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body.substring(0, 100)}...</p>
        </article>
      ))}
    </div>
  );
}
```

`getStaticProps`가 반환할 수 있는 값:

```tsx
// 정상 반환
return { props: { data }, revalidate: 60 };

// 404 페이지
return { notFound: true };

// 다른 경로로 리디렉션
return { redirect: { destination: '/login', permanent: false } };
```

### 2.2 `getStaticPaths` — 동적 경로의 정적 생성

동적 라우트(`[slug]`)를 가진 페이지를 정적으로 생성할 때, 어떤 경로를 미리 생성할지 지정합니다.

```tsx
// pages/blog/[slug].tsx
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';

interface Post {
  id: number;
  title: string;
  body: string;
  slug: string;
}

// 생성할 경로 목록 반환
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts: Post[] = await res.json();

  const paths = posts.slice(0, 10).map((post) => ({
    params: { slug: String(post.id) },
  }));

  return {
    paths,
    // fallback 옵션:
    // false  — 목록에 없는 경로는 404
    // true   — 목록에 없는 경로도 요청 시 생성 (로딩 상태 처리 필요)
    // 'blocking' — 목록에 없는 경로도 생성하되 완료될 때까지 대기
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{ post: Post }, { slug: string }> =
  async ({ params }) => {
    const { slug } = params!;
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${slug}`
    );

    if (!res.ok) {
      return { notFound: true };
    }

    const post: Post = await res.json();

    return {
      props: { post },
      revalidate: 3600, // 1시간마다 재생성
    };
  };

export default function BlogPostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

### 2.3 `getServerSideProps` — 요청마다 서버에서 페칭 (SSR)

매 요청마다 서버에서 실행됩니다. 항상 최신 데이터가 필요하거나 요청 컨텍스트(쿠키, 헤더)에 접근해야 할 때 사용합니다.

```tsx
// pages/dashboard/index.tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: UserProfile;
  stats: { posts: number; followers: number };
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { req, res, params, query } = context;

  // 쿠키에서 세션 토큰 읽기
  const token = req.cookies['session-token'];

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // 병렬로 API 요청
  const [userRes, statsRes] = await Promise.all([
    fetch('https://api.example.com/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch('https://api.example.com/me/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!userRes.ok) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const user: UserProfile = await userRes.json();
  const stats = await statsRes.json();

  // 캐시 헤더 설정
  res.setHeader(
    'Cache-Control',
    'private, no-cache, no-store, must-revalidate'
  );

  return {
    props: { user, stats },
  };
};

export default function DashboardPage({
  user,
  stats,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>안녕하세요, {user.name}님!</h1>
      <p>이메일: {user.email}</p>
      <p>작성한 포스트: {stats.posts}개</p>
      <p>팔로워: {stats.followers}명</p>
    </div>
  );
}
```

### 2.4 ISR (Incremental Static Regeneration)

`getStaticProps`에 `revalidate` 옵션을 추가하면 ISR이 활성화됩니다.

**ISR 동작 방식:**

1. 첫 요청 시 기존 정적 페이지를 즉시 제공
2. 백그라운드에서 페이지를 재생성 (revalidate 시간 경과 후)
3. 재생성 완료 후 다음 요청부터 새 페이지 제공

```tsx
// pages/products/index.tsx
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();

  return {
    props: { products },
    revalidate: 300, // 5분마다 재생성
  };
};
```

**On-Demand ISR (수동 갱신):**

```tsx
// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 보안 토큰 검증
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: '유효하지 않은 토큰' });
  }

  try {
    const path = req.query.path as string;
    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: '갱신 실패' });
  }
}
```

---

## 3. App Router 데이터 페칭

App Router에서는 서버 컴포넌트에서 `async/await`와 `fetch()`를 직접 사용합니다.

### 3.1 서버 컴포넌트에서 `fetch()` 사용

```tsx
// app/products/page.tsx
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    cache: 'force-cache', // 기본값: 빌드 시 캐싱 (SSG와 유사)
  });

  if (!res.ok) {
    throw new Error(`상품 로딩 실패: ${res.status}`);
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>상품 목록</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>₩{(product.price * 1300).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### 3.2 캐싱 옵션

Next.js는 `fetch()` API를 확장하여 세 가지 캐싱 전략을 제공합니다.

```tsx
// 1. 정적 캐싱 (SSG와 동일) — 빌드 시 캐싱, 변경 없음
const res1 = await fetch(url, { cache: 'force-cache' });

// 2. 동적 페칭 (SSR과 동일) — 캐싱 없음, 매 요청마다 새로 가져옴
const res2 = await fetch(url, { cache: 'no-store' });

// 3. ISR — N초마다 캐시 재검증
const res3 = await fetch(url, { next: { revalidate: 60 } });

// 4. 태그 기반 재검증 — 특정 태그로 캐시 무효화 가능
const res4 = await fetch(url, { next: { tags: ['products'] } });
```

**태그 기반 On-Demand Revalidation:**

```tsx
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  revalidateTag(tag); // 해당 태그의 캐시 무효화
  return NextResponse.json({ revalidated: true, tag });
}
```

**경로 기반 재검증:**

```tsx
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  revalidatePath(path);
  return NextResponse.json({ revalidated: true });
}
```

### 3.3 병렬 데이터 페칭

여러 데이터를 독립적으로 가져올 때 `Promise.all`을 사용하면 성능이 향상됩니다.

```tsx
// app/dashboard/page.tsx

interface User {
  id: string;
  name: string;
}

interface Stats {
  posts: number;
  views: number;
}

interface Notification {
  id: string;
  message: string;
}

// 각 데이터 페칭 함수
async function getUser(id: string): Promise<User> {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'no-store',
  });
  return res.json();
}

async function getStats(userId: string): Promise<Stats> {
  const res = await fetch(`https://api.example.com/users/${userId}/stats`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

async function getNotifications(userId: string): Promise<Notification[]> {
  const res = await fetch(
    `https://api.example.com/users/${userId}/notifications`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function DashboardPage() {
  const userId = 'current-user-id';

  // 병렬 페칭 — 세 요청이 동시에 시작됨
  const [user, stats, notifications] = await Promise.all([
    getUser(userId),
    getStats(userId),
    getNotifications(userId),
  ]);

  return (
    <div>
      <h1>안녕하세요, {user.name}님!</h1>
      <div>
        <p>포스트 수: {stats.posts}</p>
        <p>조회수: {stats.views}</p>
      </div>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 3.4 순차 데이터 페칭

한 요청의 결과가 다음 요청에 필요한 경우 순차적으로 페칭합니다.

```tsx
// app/blog/[slug]/page.tsx

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  return res.json();
}

async function getAuthor(authorId: string) {
  const res = await fetch(`https://api.example.com/users/${authorId}`);
  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  // 순차 페칭: post를 먼저 가져온 뒤 authorId로 author 가져옴
  const post = await getPost(params.slug);
  const author = await getAuthor(post.authorId); // post에 의존

  return (
    <article>
      <h1>{post.title}</h1>
      <p>작성자: {author.name}</p>
      <div>{post.content}</div>
    </article>
  );
}
```

> **성능 팁**: 가능하면 병렬 페칭을 사용하세요. 순차 페칭은 총 대기 시간이 각 요청 시간의 합이 됩니다.

---

## 4. 클라이언트 사이드 데이터 페칭

사용자 인터랙션에 의한 데이터 페칭이나 자주 업데이트되는 데이터에 사용합니다.

### 4.1 `useEffect` + `fetch`

```tsx
// components/UserProfile.tsx
'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export default function UserProfile({ userId }: { userId: number }) {
  const [state, setState] = useState<FetchState<User>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false; // 클린업 시 응답 무시

    async function fetchUser() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const user: User = await res.json();

        if (!cancelled) {
          setState({ data: user, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : '알 수 없는 오류',
          });
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true; // 컴포넌트 언마운트 시 클린업
    };
  }, [userId]); // userId가 바뀔 때마다 재실행

  if (state.loading) return <p>로딩 중...</p>;
  if (state.error) return <p>오류: {state.error}</p>;
  if (!state.data) return null;

  return (
    <div>
      <h2>{state.data.name}</h2>
      <p>{state.data.email}</p>
    </div>
  );
}
```

### 4.2 SWR 라이브러리

SWR(Stale-While-Revalidate)은 Vercel이 만든 데이터 페칭 라이브러리로, 캐싱, 재검증, 포커스 재검증 등을 자동으로 처리합니다.

```bash
npm install swr
```

**기본 사용법:**

```tsx
// components/PostList.tsx
'use client';

import useSWR from 'swr';

interface Post {
  id: number;
  title: string;
  body: string;
}

// fetcher 함수 (재사용 가능)
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostList() {
  const { data, error, isLoading } = useSWR<Post[]>(
    'https://jsonplaceholder.typicode.com/posts',
    fetcher
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다.</div>;

  return (
    <ul>
      {data?.slice(0, 5).map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**SWR 고급 옵션:**

```tsx
// components/LiveScore.tsx
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LiveScore({ matchId }: { matchId: string }) {
  const { data, error, mutate } = useSWR(
    `/api/matches/${matchId}`,
    fetcher,
    {
      refreshInterval: 5000,        // 5초마다 자동 갱신
      revalidateOnFocus: true,      // 탭 포커스 시 재검증
      revalidateOnReconnect: true,  // 네트워크 재연결 시 재검증
      dedupingInterval: 2000,       // 2초 내 중복 요청 방지
      onError: (err) => {
        console.error('점수 로딩 실패:', err);
      },
    }
  );

  const handleRefresh = () => {
    mutate(); // 수동으로 캐시 갱신
  };

  if (error) return <p>데이터를 불러올 수 없습니다.</p>;
  if (!data) return <p>로딩 중...</p>;

  return (
    <div>
      <p>{data.homeTeam} {data.homeScore} : {data.awayScore} {data.awayTeam}</p>
      <button onClick={handleRefresh}>새로고침</button>
    </div>
  );
}
```

**SWR Mutation (데이터 변경):**

```tsx
// components/LikeButton.tsx
'use client';

import useSWR, { useSWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LikeButton({ postId }: { postId: number }) {
  const { mutate } = useSWRConfig();
  const { data } = useSWR(`/api/posts/${postId}/likes`, fetcher);

  const handleLike = async () => {
    // 낙관적 업데이트 (UI를 먼저 변경)
    mutate(
      `/api/posts/${postId}/likes`,
      { ...data, count: data.count + 1 },
      false // 재검증 없이 즉시 반영
    );

    // 실제 API 요청
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });

    // 서버 데이터로 동기화
    mutate(`/api/posts/${postId}/likes`);
  };

  return (
    <button onClick={handleLike}>
      ❤️ {data?.count ?? 0}
    </button>
  );
}
```

---

## 5. 에러 처리 및 로딩 상태 관리

### 5.1 App Router에서 에러/로딩 처리

```tsx
// app/products/loading.tsx
export default function ProductsLoading() {
  return (
    <div className="loading-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-price" />
        </div>
      ))}
    </div>
  );
}
```

```tsx
// app/products/error.tsx
'use client';

import { useEffect } from 'react';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 모니터링 서비스에 전송 (예: Sentry)
    console.error('[Products Error]', error.message);
  }, [error]);

  return (
    <div className="error-container">
      <h2>상품을 불러오지 못했습니다</h2>
      <p>{error.message}</p>
      {error.digest && <p className="error-digest">코드: {error.digest}</p>}
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 5.2 Suspense를 활용한 세분화된 로딩 처리

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import UserStats from '@/components/UserStats';
import RecentPosts from '@/components/RecentPosts';
import Notifications from '@/components/Notifications';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      {/* 각 컴포넌트가 독립적으로 로딩됨 */}
      <Suspense fallback={<div>통계 로딩 중...</div>}>
        <UserStats />
      </Suspense>

      <Suspense fallback={<div>포스트 로딩 중...</div>}>
        <RecentPosts />
      </Suspense>

      <Suspense fallback={<div>알림 로딩 중...</div>}>
        <Notifications />
      </Suspense>
    </div>
  );
}
```

### 5.3 에러 바운더리와 함께 사용

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function DashboardPage() {
  return (
    <div>
      <ErrorBoundary fallback={<p>위젯을 불러오지 못했습니다.</p>}>
        <Suspense fallback={<p>로딩 중...</p>}>
          <WidgetComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

---

## 요약

- **SSG**는 `getStaticProps` (Pages Router) 또는 `cache: 'force-cache'` (App Router)로 구현하며, 자주 변경되지 않는 콘텐츠에 적합하다.
- **ISR**은 `revalidate` 옵션으로 정적 페이지를 주기적으로 갱신한다. App Router에서는 태그/경로 기반 On-Demand Revalidation도 지원한다.
- **SSR**은 `getServerSideProps` (Pages Router) 또는 `cache: 'no-store'` (App Router)로 구현하며, 매 요청마다 최신 데이터가 필요할 때 사용한다.
- **App Router**에서는 서버 컴포넌트에서 직접 `async/await fetch()`를 사용하며, 캐싱 옵션으로 SSG/ISR/SSR을 선택적으로 적용할 수 있다.
- 독립적인 데이터는 `Promise.all`로 **병렬 페칭**하여 성능을 높인다.
- **SWR**은 클라이언트 사이드 페칭에 캐싱, 자동 갱신, 낙관적 업데이트 등 강력한 기능을 제공한다.
- `loading.tsx`와 `error.tsx`, 그리고 `Suspense`를 조합하면 세분화된 로딩/에러 UI를 쉽게 구현할 수 있다.

---

## 연습 문제

1. **ISR 구현**: `https://fakestoreapi.com/products` API를 사용하여 다음을 구현하세요.
   - Pages Router: `getStaticProps` + `revalidate: 120`으로 상품 목록 페이지 구현
   - App Router: `next: { revalidate: 120 }` 캐싱으로 동일한 페이지 구현
   - 두 구현의 동작 방식 차이를 `README.md`에 정리하세요.

2. **병렬 vs 순차 페칭 비교**: App Router에서 다음 두 방식을 구현하고 성능을 비교하세요.
   - 순차 페칭: 사용자 ID → 사용자 정보 → 사용자의 포스트 목록 순서로 가져오기
   - 병렬 페칭: 사용자 정보와 포스트 목록을 `Promise.all`로 동시에 가져오기
   - 각 방식에서 `console.time()`으로 소요 시간을 측정하고 비교하세요.

3. **SWR로 무한 스크롤 구현**: `useSWRInfinite` 훅을 사용하여 `https://jsonplaceholder.typicode.com/posts`에서 데이터를 10개씩 가져오는 무한 스크롤 컴포넌트를 구현하세요.
   - "더 보기" 버튼 클릭 시 다음 페이지 로딩
   - 로딩 중일 때 버튼 비활성화
   - 마지막 페이지 도달 시 버튼 숨기기
