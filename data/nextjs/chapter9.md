# Chapter 9: 데이터베이스 연동

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. Prisma ORM을 Next.js 프로젝트에 설치하고 설정할 수 있다.
2. `schema.prisma` 파일에 데이터 모델을 정의하고 마이그레이션을 실행할 수 있다.
3. Prisma Client를 사용하여 CRUD(생성·조회·수정·삭제) 작업을 구현할 수 있다.
4. App Router의 Server Actions를 활용하여 폼 데이터를 처리할 수 있다.
5. `revalidatePath`와 `revalidateTag`로 캐시를 무효화하여 최신 데이터를 반영할 수 있다.
6. Server Actions와 Route Handlers의 차이를 이해하고 적절히 선택할 수 있다.

---

## 1. 데이터베이스 연동 방법 개요

Next.js는 데이터베이스와 직접 통신하는 백엔드 로직을 서버 컴포넌트, Route Handlers, Server Actions 안에서 실행할 수 있습니다. 주요 접근 방식은 다음과 같습니다.

| 방식 | 설명 |
|---|---|
| Prisma ORM | 타입 안전한 ORM. 스키마 기반 마이그레이션 지원 |
| Drizzle ORM | 경량 ORM. SQL에 가까운 문법 |
| 네이티브 드라이버 | `pg`, `mysql2` 등 직접 사용. 세밀한 제어 가능 |
| Supabase / PlanetScale | 관리형 DB + 전용 SDK 제공 |

이 챕터에서는 가장 널리 사용되는 **Prisma ORM**을 중심으로 학습합니다.

---

## 2. Prisma ORM 설정

### 2.1 설치

```bash
npm install prisma @prisma/client
npx prisma init
```

`prisma init` 명령은 다음 파일을 생성합니다:

- `prisma/schema.prisma` — 데이터 모델 정의 파일
- `.env` — `DATABASE_URL` 환경변수가 포함된 파일

### 2.2 schema.prisma 작성

`prisma/schema.prisma` 파일에 데이터베이스 제공자(provider)와 모델을 정의합니다.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2.3 PostgreSQL 연결 설정

`.env` 파일에 데이터베이스 연결 문자열을 설정합니다.

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

> **주의**: `.env` 파일은 절대 Git에 커밋하지 않습니다. `.gitignore`에 반드시 포함하세요.

### 2.4 마이그레이션 실행

```bash
# 개발 환경에서 마이그레이션 파일 생성 및 적용
npx prisma migrate dev --name init

# 프로덕션 환경에서 마이그레이션 적용
npx prisma migrate deploy
```

### 2.5 Prisma Client 생성

```bash
npx prisma generate
```

스키마가 변경될 때마다 이 명령을 실행하여 타입을 최신 상태로 유지합니다.

### 2.6 싱글턴 패턴으로 Prisma Client 관리

Next.js의 Hot Module Replacement(HMR) 환경에서는 모듈이 반복적으로 재로드되어 데이터베이스 연결이 과도하게 생성될 수 있습니다. 싱글턴 패턴으로 이를 방지합니다.

```tsx
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

## 3. CRUD 작업 구현

### 3.1 데이터 조회

#### 여러 레코드 조회 (`findMany`)

```tsx
// app/posts/page.tsx
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

#### 단일 레코드 조회 (`findUnique`)

```tsx
// app/posts/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) notFound();

  return <article><h1>{post.title}</h1><p>{post.content}</p></article>;
}
```

### 3.2 데이터 생성 (`create`)

```tsx
// app/actions/post.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.post.create({
    data: {
      title,
      content,
      authorId: 1, // 실제로는 세션에서 사용자 ID를 가져옵니다
    },
  });

  revalidatePath('/posts');
}
```

### 3.3 데이터 수정 (`update`)

```tsx
// app/actions/post.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.post.update({
    where: { id },
    data: { title, content },
  });

  revalidatePath(`/posts/${id}`);
  revalidatePath('/posts');
}
```

### 3.4 데이터 삭제 (`delete`)

```tsx
// app/actions/post.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deletePost(id: number) {
  await prisma.post.delete({
    where: { id },
  });

  revalidatePath('/posts');
  redirect('/posts');
}
```

### 3.5 관계 데이터 포함 (`include`)

`include` 옵션을 사용하면 관련 모델의 데이터를 한 번에 조회할 수 있습니다.

```tsx
// 작성자 정보를 포함한 게시글 조회
const postsWithAuthor = await prisma.post.findMany({
  include: {
    author: {
      select: { name: true, email: true },
    },
  },
  orderBy: { createdAt: 'desc' },
});

// 사용자와 게시글 수를 함께 조회
const usersWithPostCount = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
});
```

---

## 4. Server Actions (App Router)

### 4.1 Server Actions란 무엇인가

Server Actions는 서버에서 실행되는 비동기 함수입니다. 클라이언트 컴포넌트에서 직접 호출할 수 있어, 별도의 API 엔드포인트 없이 서버 로직을 실행할 수 있습니다.

**주요 특징:**

- 서버에서만 실행되므로 데이터베이스, 파일 시스템 등에 안전하게 접근 가능
- HTML `<form>` 의 `action` 속성과 직접 연결 가능
- JavaScript가 비활성화된 환경에서도 기본 동작 보장 (Progressive Enhancement)
- 자동으로 CSRF 보호 적용

### 4.2 `'use server'` 지시어

Server Actions는 두 가지 방법으로 정의할 수 있습니다.

```tsx
// 방법 1: 파일 단위 선언 (모든 export가 Server Action이 됨)
// app/actions/post.ts
'use server';

export async function createPost() { /* ... */ }
export async function deletePost() { /* ... */ }
```

```tsx
// 방법 2: 함수 단위 선언 (서버 컴포넌트 내부)
// app/posts/new/page.tsx
export default function NewPostPage() {
  async function handleCreate(formData: FormData) {
    'use server';
    // 이 함수는 서버에서 실행됩니다
    const title = formData.get('title');
    // ...
  }

  return <form action={handleCreate}>...</form>;
}
```

### 4.3 폼 데이터 처리

```tsx
// app/actions/post.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// 입력 유효성 검사 스키마
const CreatePostSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(100),
  content: z.string().optional(),
});

export type CreatePostState = {
  errors?: { title?: string[]; content?: string[] };
  message?: string;
};

export async function createPost(
  prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력값을 확인하세요.',
    };
  }

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        authorId: 1,
      },
    });
  } catch (error) {
    return { message: '게시글 생성에 실패했습니다.' };
  }

  revalidatePath('/posts');
  redirect('/posts');
}
```

```tsx
// app/posts/new/page.tsx
'use client';

import { useActionState } from 'react';
import { createPost, CreatePostState } from '@/app/actions/post';

const initialState: CreatePostState = {};

export default function NewPostPage() {
  const [state, formAction, isPending] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">제목</label>
        <input id="title" name="title" type="text" />
        {state.errors?.title && (
          <p className="text-red-500">{state.errors.title[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="content">내용</label>
        <textarea id="content" name="content" />
      </div>
      {state.message && <p>{state.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? '저장 중...' : '게시글 작성'}
      </button>
    </form>
  );
}
```

### 4.4 낙관적 업데이트

`useOptimistic` 훅을 사용하면 서버 응답을 기다리지 않고 UI를 즉시 업데이트할 수 있습니다.

```tsx
// app/posts/post-list.tsx
'use client';

import { useOptimistic, startTransition } from 'react';
import { togglePublish } from '@/app/actions/post';

interface Post {
  id: number;
  title: string;
  published: boolean;
}

export default function PostList({ posts }: { posts: Post[] }) {
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    posts,
    (state, { id, published }: { id: number; published: boolean }) =>
      state.map((post) => (post.id === id ? { ...post, published } : post)),
  );

  return (
    <ul>
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          {post.title}
          <button
            onClick={() => {
              startTransition(async () => {
                setOptimisticPosts({ id: post.id, published: !post.published });
                await togglePublish(post.id);
              });
            }}
          >
            {post.published ? '비공개' : '공개'}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### 4.5 `revalidatePath`와 `revalidateTag`

Server Actions 실행 후 Next.js 캐시를 무효화하여 최신 데이터가 표시되도록 합니다.

```tsx
import { revalidatePath, revalidateTag } from 'next/cache';

// 특정 경로의 캐시 무효화
revalidatePath('/posts');           // /posts 페이지
revalidatePath('/posts/[id]', 'page'); // 모든 게시글 상세 페이지

// 태그 기반 캐시 무효화
revalidateTag('posts');             // 'posts' 태그가 붙은 모든 fetch 캐시 무효화
```

태그를 사용한 데이터 페칭:

```tsx
// 태그를 지정하여 fetch
const posts = await fetch('/api/posts', {
  next: { tags: ['posts'] },
});
```

### 4.6 Server Actions vs Route Handlers

| 항목 | Server Actions | Route Handlers |
|---|---|---|
| 주요 용도 | 폼 제출, 데이터 변경 | REST API, 외부 서비스 연동 |
| 호출 방법 | 컴포넌트에서 직접 호출 | HTTP 요청 (`fetch`, `axios`) |
| CSRF 보호 | 자동 적용 | 직접 구현 필요 |
| Progressive Enhancement | 지원 | 미지원 |
| 외부 접근 | 불가 | 가능 (URL로 접근) |
| 캐시 무효화 | `revalidatePath` 바로 사용 | 응답 내에서 처리 |

---

## 5. 실전 예제: 간단한 블로그 CRUD API 구현

아래는 Prisma와 Server Actions를 활용한 블로그 CRUD의 전체 예제입니다.

### 디렉터리 구조

```
app/
├── actions/
│   └── post.ts          # Server Actions
├── posts/
│   ├── page.tsx         # 게시글 목록
│   ├── new/
│   │   └── page.tsx     # 새 게시글 작성
│   └── [id]/
│       ├── page.tsx     # 게시글 상세
│       └── edit/
│           └── page.tsx # 게시글 수정
lib/
└── prisma.ts            # Prisma Client 싱글턴
```

### Server Actions 전체 코드

```tsx
// app/actions/post.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/** 게시글 목록 조회 */
export async function getPosts() {
  return prisma.post.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

/** 게시글 생성 */
export async function createPost(formData: FormData) {
  const title = (formData.get('title') as string).trim();
  const content = (formData.get('content') as string | null)?.trim();

  if (!title) throw new Error('제목은 필수입니다.');

  await prisma.post.create({
    data: { title, content, authorId: 1 },
  });

  revalidatePath('/posts');
  redirect('/posts');
}

/** 게시글 수정 */
export async function updatePost(id: number, formData: FormData) {
  const title = (formData.get('title') as string).trim();
  const content = (formData.get('content') as string | null)?.trim();

  await prisma.post.update({
    where: { id },
    data: { title, content },
  });

  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

/** 게시글 삭제 */
export async function deletePost(id: number) {
  await prisma.post.delete({ where: { id } });

  revalidatePath('/posts');
  redirect('/posts');
}
```

### 게시글 목록 페이지

```tsx
// app/posts/page.tsx
import Link from 'next/link';
import { getPosts } from '@/app/actions/post';
import { deletePost } from '@/app/actions/post';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>게시글 목록</h1>
      <Link href="/posts/new">새 게시글 작성</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
            <span> — {post.author.name}</span>
            <form action={deletePost.bind(null, post.id)} style={{ display: 'inline' }}>
              <button type="submit">삭제</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

---

## 요약

- **Prisma ORM**은 타입 안전한 데이터베이스 접근을 제공하며, `schema.prisma`로 모델을 정의하고 마이그레이션으로 DB 구조를 관리합니다.
- 개발 환경에서는 **싱글턴 패턴**으로 Prisma Client를 관리하여 연결 과다 생성을 방지합니다.
- `findMany`, `findUnique`, `create`, `update`, `delete` 메서드로 기본 **CRUD** 작업을 수행하고, `include`로 관계 데이터를 함께 조회합니다.
- **Server Actions**는 `'use server'` 지시어로 선언하며, 폼과 직접 연결할 수 있고 CSRF 보호가 자동 적용됩니다.
- `revalidatePath`와 `revalidateTag`로 데이터 변경 후 캐시를 무효화하여 최신 데이터를 반영합니다.
- Server Actions는 컴포넌트 내부에서 직접 호출하는 데 적합하고, Route Handlers는 외부에서 접근 가능한 REST API를 만드는 데 적합합니다.

---

## 연습 문제

1. `schema.prisma`에 `Comment` 모델을 추가하고, `Post`와 1:N 관계를 설정하세요. 그런 다음 게시글 상세 페이지에서 댓글 목록을 함께 표시하는 코드를 작성하세요.

2. 게시글 목록 페이지에 페이지네이션을 구현하세요. Prisma의 `skip`과 `take` 옵션을 활용하고, URL의 `?page=2` 쿼리 파라미터를 읽어 현재 페이지를 결정하세요.

3. 게시글 생성 Server Action에 Zod 유효성 검사를 추가하고, `useActionState`로 에러 메시지를 폼에 표시하세요. 제목은 최소 2자, 최대 100자로 제한하세요.
