# Chapter 8: 인증 (Authentication)

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. JWT와 세션 기반 인증의 차이를 이해하고 적절한 방식을 선택한다.
2. NextAuth.js(Auth.js) v5를 설치하고 기본 설정을 구성한다.
3. GitHub, Google OAuth 소셜 로그인을 구현한다.
4. `CredentialsProvider`를 사용하여 이메일/비밀번호 로그인을 구현한다.
5. `useSession`, `getServerSession`으로 클라이언트·서버에서 세션 상태를 관리한다.
6. 미들웨어를 활용하여 인증이 필요한 라우트를 보호한다.

---

## 1. 인증 개요

### 1.1 JWT vs 세션 기반 인증 비교

| 구분 | JWT (JSON Web Token) | 세션 (Session) |
|------|---------------------|----------------|
| **저장 위치** | 클라이언트 (쿠키/localStorage) | 서버 메모리/DB |
| **상태** | Stateless (무상태) | Stateful (상태 유지) |
| **확장성** | 높음 (서버 간 공유 불필요) | 낮음 (서버 간 세션 공유 필요) |
| **토큰 무효화** | 어려움 (만료 전까지 유효) | 쉬움 (서버에서 즉시 삭제) |
| **크기** | 상대적으로 큼 | 작음 (세션 ID만 전달) |
| **보안 위험** | XSS, 토큰 탈취 | CSRF, 세션 하이재킹 |
| **적합한 경우** | MSA, 모바일 API | 전통적 웹앱, 강력한 로그아웃 필요 시 |

### 1.2 Next.js 인증 전략

Next.js App Router에서는 **NextAuth.js(Auth.js) v5**가 공식 권장 솔루션입니다.
미들웨어, 서버 컴포넌트, Server Actions와 자연스럽게 통합됩니다.

---

## 2. NextAuth.js (Auth.js) v5 설정

### 2.1 설치

```bash
npm install next-auth@beta
```

```bash
# AUTH_SECRET 자동 생성 (권장)
npx auth secret
```

### 2.2 기본 설정 (`auth.ts`)

프로젝트 루트에 `auth.ts` 파일을 생성합니다.

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        // 사용자 검증 로직 (데이터베이스 조회)
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserFromDB(credentials.email as string);
        if (!user) return null;

        const isValid = await verifyPassword(
          credentials.password as string,
          user.hashedPassword
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: '/login',           // 커스텀 로그인 페이지
    error: '/auth/error',       // 오류 페이지
  },
  callbacks: {
    // JWT 콜백: 토큰에 추가 데이터 저장
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // 세션 콜백: 클라이언트에 노출할 세션 데이터 정의
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

// 타입 선언 예시 (실제 DB 함수는 별도 구현)
async function getUserFromDB(email: string) {
  // DB에서 사용자 조회
  return null;
}

async function verifyPassword(password: string, hash: string) {
  // bcrypt 비교
  return false;
}
```

### 2.3 API 라우트 핸들러 설정

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

### 2.4 `SessionProvider` 설정

클라이언트 컴포넌트에서 `useSession`을 사용하려면 `SessionProvider`로 감싸야 합니다.

```tsx
// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2.5 `next.config.ts` 설정

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // NextAuth.js v5는 별도 next.config 설정 불필요
  // 필요 시 아래 옵션 추가
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'myapp.com'],
    },
  },
};

export default nextConfig;
```

---

## 3. OAuth 소셜 로그인

### 3.1 GitHub OAuth 설정

**GitHub OAuth App 생성:**

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Application name: `My App`
3. Homepage URL: `http://localhost:3000`
4. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

```typescript
// auth.ts - GitHub 프로바이더
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // 추가 스코프 요청
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
});
```

### 3.2 Google OAuth 설정

**Google OAuth 설정:**

1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`

```typescript
// auth.ts - Google 프로바이더
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
```

### 3.3 환경변수 설정

```bash
# .env.local
AUTH_SECRET="your-secret-key-here"  # npx auth secret으로 생성

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# 프로덕션 URL (배포 시 필수)
AUTH_URL="https://myapp.com"
```

```bash
# .env.example - 키 목록만 공개
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_URL=
```

---

## 4. Credentials 로그인 (이메일/비밀번호)

### 4.1 `CredentialsProvider` 설정

```typescript
// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: '이메일/비밀번호',
      credentials: {
        email: {
          label: '이메일',
          type: 'email',
          placeholder: 'name@example.com',
        },
        password: {
          label: '비밀번호',
          type: 'password',
        },
      },
      async authorize(credentials) {
        // 입력값 검증
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 데이터베이스에서 사용자 조회
        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            role: true,
          },
        });

        if (!user || !user.hashedPassword) return null;

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
```

### 4.2 비밀번호 해싱 (bcrypt)

```typescript
// lib/auth-utils.ts
import bcrypt from 'bcryptjs';

/** 비밀번호를 해싱합니다. saltRounds는 10을 권장합니다. */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/** 평문 비밀번호와 해시를 비교합니다. */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

```typescript
// app/api/register/route.ts - 회원가입 API 예시
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth-utils';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: { email, name, hashedPassword },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
```

---

## 5. 세션 관리

### 5.1 `useSession` 훅 (클라이언트 컴포넌트)

```tsx
// components/UserMenu.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;
  }

  if (status === 'unauthenticated') {
    return (
      <button
        onClick={() => signIn()}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        로그인
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {session?.user?.image && (
        <Image
          src={session.user.image}
          alt="프로필"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <span>{session?.user?.name}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="rounded bg-gray-200 px-3 py-1 text-sm"
      >
        로그아웃
      </button>
    </div>
  );
}
```

### 5.2 `getServerSession` (서버 컴포넌트)

```tsx
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>대시보드</h1>
      <p>환영합니다, {session.user?.name}님!</p>
      <p>역할: {session.user?.role}</p>
    </div>
  );
}
```

### 5.3 세션 데이터 타입 확장

```typescript
// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'user' | 'moderator';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'admin' | 'user' | 'moderator';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'admin' | 'user' | 'moderator';
  }
}
```

---

## 6. 보호된 라우트 (Route Protection)

### 6.1 미들웨어를 이용한 인증 확인

```typescript
// middleware.ts (프로젝트 루트)
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호할 경로 패턴
const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // 이미 로그인한 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 미인증 사용자가 보호된 경로 접근 시 로그인으로 리다이렉트
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 관리자 권한 확인
  if (isAdminRoute && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  return NextResponse.next();
});

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 6.2 클라이언트 사이드 보호

```tsx
// components/ProtectedRoute.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      router.push('/403');
    }
  }, [session, status, router, requiredRole]);

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (!session) return null;

  return <>{children}</>;
}
```

### 6.3 서버 컴포넌트에서 보호

```tsx
// app/admin/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role !== 'admin') {
    redirect('/403');
  }

  return (
    <div className="admin-layout">
      <nav>관리자 네비게이션</nav>
      <main>{children}</main>
    </div>
  );
}
```

---

## 7. 로그인/로그아웃 UI 구현

### 7.1 커스텀 로그인 페이지

```tsx
// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg p-8 shadow-md">
        <h1 className="text-2xl font-bold">로그인</h1>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => signIn('github', { callbackUrl })}
            className="flex w-full items-center justify-center gap-2 rounded border p-2"
          >
            GitHub으로 계속하기
          </button>
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="flex w-full items-center justify-center gap-2 rounded border p-2"
          >
            Google로 계속하기
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">또는</span>
          </div>
        </div>

        {/* 이메일/비밀번호 폼 */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          {error && (
            <p className="rounded bg-red-50 p-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border p-2"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border p-2"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-500 p-2 text-white disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 7.2 Server Actions를 이용한 로그아웃

```tsx
// components/SignOutButton.tsx
import { signOut } from '@/auth';

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button
        type="submit"
        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        로그아웃
      </button>
    </form>
  );
}
```

---

## 요약

| 구성 요소 | 역할 | 파일 위치 |
|----------|------|----------|
| `auth.ts` | NextAuth 설정, 프로바이더, 콜백 | 프로젝트 루트 |
| `app/api/auth/[...nextauth]/route.ts` | API 라우트 핸들러 | `app/api/auth/` |
| `middleware.ts` | 서버 수준 라우트 보호 | 프로젝트 루트 |
| `SessionProvider` | 클라이언트 세션 컨텍스트 | `app/providers.tsx` |
| `useSession` | 클라이언트 세션 접근 | 클라이언트 컴포넌트 |
| `auth()` | 서버 세션 접근 | 서버 컴포넌트/라우트 |

- **OAuth vs Credentials**: 사용자 편의를 위해 OAuth를 우선 제공하되, 내부 시스템에는 Credentials도 지원한다.
- **미들웨어**: 서버 수준에서 가장 이른 시점에 인증을 확인하므로 성능상 유리하다.
- **비밀번호 해싱**: 반드시 bcrypt 등 단방향 해시를 사용한다. 평문이나 가역 암호화는 절대 사용하지 않는다.
- **환경변수**: `AUTH_SECRET`은 32바이트 이상의 랜덤 문자열이어야 한다. `npx auth secret`으로 생성한다.
- **타입 확장**: `next-auth.d.ts`로 세션 타입을 확장하면 타입 안전성이 높아진다.

---

## 연습 문제

1. **GitHub OAuth + 사용자 프로필 페이지**: GitHub OAuth 로그인을 구현하고, 로그인 후 `/profile` 페이지에서 세션 정보(이름, 이메일, 아바타)를 표시하세요. 미들웨어를 설정하여 비로그인 상태에서 `/profile` 접근 시 `/login`으로 리다이렉트하게 하세요.

2. **역할 기반 접근 제어(RBAC)**: `auth.ts`의 JWT/세션 콜백을 수정하여 `role` 필드를 세션에 추가하세요. `/admin` 경로는 `role === 'admin'`인 사용자만 접근 가능하도록 미들웨어와 서버 컴포넌트 레이아웃 두 가지 방법으로 보호를 구현하세요.

3. **Credentials 회원가입/로그인 플로우**: 회원가입 API(`/api/register`)를 만들고 bcrypt로 비밀번호를 해싱하여 저장하세요. `CredentialsProvider`로 로그인을 구현하고, zod를 이용한 입력값 검증과 오류 메시지 표시까지 포함한 완성된 인증 플로우를 구현하세요.
