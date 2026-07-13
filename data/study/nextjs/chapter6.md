# Chapter 6: API Routes, Route Handlers & 미들웨어

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. Pages Router의 API Routes를 사용하여 서버사이드 API 엔드포인트를 작성할 수 있다.
2. App Router의 Route Handlers를 사용하여 REST API를 구현할 수 있다.
3. HTTP 메서드(GET, POST, PUT, DELETE)별 핸들러를 올바르게 분기 처리할 수 있다.
4. 동적 라우트를 활용하여 파라미터 기반 API를 설계할 수 있다.
5. `middleware.ts`를 작성하여 인증 확인, 리다이렉트, 헤더 추가 등의 공통 로직을 처리할 수 있다.
6. CORS 처리를 API Route / Route Handler에 적용할 수 있다.
7. Pages Router와 App Router 방식의 차이점을 설명하고 적절히 선택할 수 있다.

---

## 1. Pages Router - API Routes

Pages Router에서는 `pages/api/` 디렉터리 아래에 파일을 생성하면 자동으로 API 엔드포인트가 됩니다.

### 디렉터리 구조

```
pages/
└── api/
    ├── hello.ts           → GET /api/hello
    ├── users/
    │   ├── index.ts       → GET/POST /api/users
    │   └── [id].ts        → GET/PUT/DELETE /api/users/:id
    ├── posts/
    │   ├── index.ts       → GET/POST /api/posts
    │   └── [slug].ts      → GET /api/posts/:slug
    └── auth/
        ├── login.ts       → POST /api/auth/login
        └── logout.ts      → POST /api/auth/logout
```

### 기본 API 핸들러 작성

```ts
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/** API 응답 타입 정의 */
type HelloResponse = {
  message: string;
  timestamp: string;
};

type ErrorResponse = {
  error: string;
};

/**
 * /api/hello 엔드포인트 핸들러.
 * GET 요청에 환영 메시지를 반환합니다.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.status(200).json({
    message: 'Hello, Next.js API!',
    timestamp: new Date().toISOString(),
  });
}
```

### HTTP 메서드 처리

```ts
// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// 임시 인메모리 데이터 (실제 프로젝트에서는 DB 사용)
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const users: User[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', createdAt: '2024-01-01' },
  { id: 2, name: '김영희', email: 'kim@example.com', createdAt: '2024-01-02' },
];

/**
 * /api/users 엔드포인트 핸들러.
 * GET: 사용자 목록 조회
 * POST: 새 사용자 생성
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET': {
      // 쿼리 파라미터 처리
      const { page = '1', limit = '10', search } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      let filtered = users;
      if (search) {
        const q = (search as string).toLowerCase();
        filtered = users.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
      }

      const total = filtered.length;
      const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.status(200).json({
        data: paginated,
        meta: { total, page: pageNum, limit: limitNum },
      });
    }

    case 'POST': {
      // 요청 바디 파싱 (Next.js가 자동으로 JSON 파싱)
      const { name, email } = req.body;

      // 입력 유효성 검사
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'name 필드는 필수입니다.' });
      }
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: '유효한 이메일을 입력하세요.' });
      }

      // 이메일 중복 확인
      if (users.some((u) => u.email === email)) {
        return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
      }

      const newUser: User = {
        id: users.length + 1,
        name,
        email,
        createdAt: new Date().toISOString().split('T')[0],
      };
      users.push(newUser);

      return res.status(201).json({ data: newUser });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
```

### 동적 API 라우트

```ts
// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

const users = [
  { id: 1, name: '홍길동', email: 'hong@example.com' },
  { id: 2, name: '김영희', email: 'kim@example.com' },
];

/**
 * /api/users/:id 엔드포인트 핸들러.
 * GET: 특정 사용자 조회
 * PUT: 사용자 정보 수정
 * DELETE: 사용자 삭제
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 동적 파라미터 추출
  const { id } = req.query;
  const userId = parseInt(id as string, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  switch (req.method) {
    case 'GET': {
      if (userIndex === -1) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
      return res.status(200).json({ data: users[userIndex] });
    }

    case 'PUT': {
      if (userIndex === -1) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
      const { name, email } = req.body;
      users[userIndex] = { ...users[userIndex], ...(name && { name }), ...(email && { email }) };
      return res.status(200).json({ data: users[userIndex] });
    }

    case 'DELETE': {
      if (userIndex === -1) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
      users.splice(userIndex, 1);
      return res.status(204).end();
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
```

### 요청 바디 파싱 및 에러 응답

```ts
// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// 기본 바디 파서 비활성화 (멀티파트 폼 처리 시)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // 요청 크기 제한
    },
  },
};

/**
 * 공통 에러 응답 헬퍼 함수.
 */
function sendError(res: NextApiResponse, status: number, message: string, details?: unknown) {
  return res.status(status).json({
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  try {
    const { data } = req.body;

    if (!data) {
      return sendError(res, 400, '데이터가 없습니다.');
    }

    // 비즈니스 로직 처리 (예시)
    const result = await processData(data);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    // 운영 환경에서는 내부 오류 상세 정보를 노출하지 않음
    return sendError(res, 500, '서버 내부 오류가 발생했습니다.');
  }
}

async function processData(data: unknown) {
  // 데이터 처리 로직
  return { processed: true, input: data };
}
```

---

## 2. App Router - Route Handlers

App Router에서는 `app/` 디렉터리 내에 `route.ts` 파일을 생성하여 API를 구현합니다. Web API 표준 `Request`/`Response` 객체를 사용합니다.

### 디렉터리 구조

```
app/
└── api/
    ├── hello/
    │   └── route.ts       → GET /api/hello
    ├── users/
    │   ├── route.ts       → GET/POST /api/users
    │   └── [id]/
    │       └── route.ts   → GET/PUT/DELETE /api/users/:id
    └── posts/
        ├── route.ts
        └── [slug]/
            └── route.ts
```

> **규칙**: `route.ts`와 `page.tsx`는 같은 경로 세그먼트에 공존할 수 없습니다.

### GET, POST 핸들러 작성

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com' },
  { id: 2, name: '김영희', email: 'kim@example.com' },
];

/**
 * GET /api/users
 * 사용자 목록을 반환합니다.
 */
export async function GET(request: NextRequest) {
  // URL 쿼리 파라미터 접근
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const search = searchParams.get('search');

  let filtered = users;
  if (search) {
    const q = search.toLowerCase();
    filtered = users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json(
    { data: paginated, meta: { total, page, limit } },
    { status: 200 }
  );
}

/**
 * POST /api/users
 * 새 사용자를 생성합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name과 email은 필수입니다.' },
        { status: 400 }
      );
    }

    const newUser: User = { id: users.length + 1, name, email };
    users.push(newUser);

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  }
}
```

### 동적 라우트 핸들러

```ts
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const users = [
  { id: 1, name: '홍길동', email: 'hong@example.com' },
  { id: 2, name: '김영희', email: 'kim@example.com' },
];

/** 동적 파라미터 타입 */
interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/:id
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({ data: user });
}

/**
 * PUT /api/users/:id
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  const body = await request.json();
  users[index] = { ...users[index], ...body, id: userId };

  return NextResponse.json({ data: users[index] });
}

/**
 * DELETE /api/users/:id
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  }

  users.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
```

### 쿠키 및 헤더 접근

```ts
// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

/**
 * GET /api/profile
 * 쿠키와 헤더에서 인증 정보를 읽습니다.
 */
export async function GET(request: NextRequest) {
  // 방법 1: request 객체에서 직접 접근
  const tokenFromRequest = request.cookies.get('auth-token')?.value;
  const authHeader = request.headers.get('Authorization');

  // 방법 2: next/headers 헬퍼 사용 (서버 컴포넌트와 동일한 방식)
  const cookieStore = await cookies();
  const tokenFromStore = cookieStore.get('auth-token')?.value;

  const headersList = await headers();
  const userAgent = headersList.get('user-agent');

  if (!tokenFromRequest && !tokenFromStore) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  // 응답에 헤더 추가
  const response = NextResponse.json({
    user: { name: '홍길동' },
    userAgent,
  });

  // 쿠키 설정
  response.cookies.set('last-visit', new Date().toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7일
  });

  response.headers.set('X-Custom-Header', 'my-value');

  return response;
}
```

### 스트리밍 응답

```ts
// app/api/stream/route.ts
import { NextRequest } from 'next/server';

/**
 * GET /api/stream
 * 서버-센트 이벤트(SSE) 방식으로 스트리밍 응답을 반환합니다.
 */
export async function GET(_request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const messages = ['안녕하세요', '스트리밍', '응답', '예제입니다'];

      for (const message of messages) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ message })}\n\n`)
        );
        // 인위적인 딜레이 (실제 환경에서는 DB 쿼리, LLM API 등)
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

---

## 3. 미들웨어 (Middleware)

미들웨어는 요청이 완료되기 전에 실행되는 코드로, 인증, 리다이렉트, 로깅, 헤더 조작 등에 사용합니다.

### 파일 위치와 역할

```
my-app/
├── app/
├── pages/
├── middleware.ts   ← 프로젝트 루트 (src 디렉터리 사용 시 src/middleware.ts)
└── next.config.ts
```

미들웨어는 **Edge Runtime**에서 실행되므로 Node.js API를 사용할 수 없습니다. `fetch`, Web Crypto API, `NextRequest`, `NextResponse`를 사용하세요.

### `NextRequest`, `NextResponse` 기본 사용

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * 전역 미들웨어.
 * 모든 요청에 공통 헤더를 추가하고 기본 처리를 수행합니다.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 보안 헤더 추가
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 요청 경로 로깅 (개발 환경)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);
  }

  return response;
}
```

### 특정 경로에만 미들웨어 적용 (`matcher`)

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 미들웨어 로직
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 특정 경로 포함
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    // 조건부 매칭 (정규식)
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
```

### 인증 확인 및 리다이렉트

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

/** 인증 없이 접근 가능한 공개 경로 */
const PUBLIC_PATHS = ['/', '/login', '/register', '/about', '/api/auth/login'];

/** 관리자 전용 경로 */
const ADMIN_PATHS = ['/admin'];

/**
 * JWT 토큰을 검증합니다. (Edge 환경 호환)
 * 실제 구현에서는 jose 등의 라이브러리를 사용하세요.
 */
async function verifyToken(token: string): Promise<{ role: string; userId: string } | null> {
  try {
    // 예시: jose 라이브러리로 JWT 검증
    // const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    // return payload as { role: string; userId: string };

    // 간단한 시뮬레이션 (실제 사용 금지)
    if (token === 'valid-token') return { role: 'user', userId: '1' };
    if (token === 'admin-token') return { role: 'admin', userId: '0' };
    return null;
  } catch {
    return null;
  }
}

/**
 * 인증 미들웨어.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로는 통과
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // 토큰 추출 (쿠키 또는 Authorization 헤더)
  const token =
    request.cookies.get('auth-token')?.value ??
    request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // API 요청인 경우 401 반환
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }
    // 일반 페이지는 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    // 유효하지 않은 토큰: 쿠키 삭제 후 리다이렉트
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // 관리자 전용 경로 접근 권한 확인
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  if (isAdminPath && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  // 인증 정보를 요청 헤더에 추가 (서버 컴포넌트/Route Handler에서 사용)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 헤더 추가 예제

```ts
// middleware.ts - 보안 헤더 + CSP 설정
import { NextRequest, NextResponse } from 'next/server';

/** Content Security Policy 설정 */
function buildCSP(): string {
  const policies: Record<string, string> = {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-eval' 'unsafe-inline'",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'img-src': "'self' data: https:",
    'connect-src': "'self' https://api.example.com",
    'frame-ancestors': "'none'",
  };

  return Object.entries(policies)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ');
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 보안 헤더
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', buildCSP());
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}
```

---

## 4. CORS 처리

```ts
// app/api/public/route.ts
import { NextRequest, NextResponse } from 'next/server';

/** 허용할 오리진 목록 */
const ALLOWED_ORIGINS = [
  'https://example.com',
  'https://app.example.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean);

/**
 * CORS 헤더를 설정합니다.
 */
function setCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

/** Preflight 요청 처리 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response, origin);
}

/** 실제 API 핸들러 */
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  const response = NextResponse.json({
    data: { message: '공개 API 응답' },
  });

  return setCorsHeaders(response, origin);
}
```

**미들웨어에서 전역 CORS 처리:**

```ts
// middleware.ts - CORS를 전역으로 처리
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = ['https://example.com', 'http://localhost:3000'];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  // Preflight 요청
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    return response;
  }

  const response = NextResponse.next();
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## 요약

| 항목 | Pages Router (API Routes) | App Router (Route Handlers) |
|---|---|---|
| 파일 위치 | `pages/api/*.ts` | `app/api/*/route.ts` |
| 요청 객체 | `NextApiRequest` | `NextRequest` (Web API) |
| 응답 객체 | `NextApiResponse` | `NextResponse` (Web API) |
| 메서드 분기 | `req.method` switch | 함수명으로 분리 (GET, POST…) |
| 쿠키/헤더 | `req.cookies`, `req.headers` | `request.cookies`, `cookies()` |
| 바디 파싱 | 자동 (JSON) | `await request.json()` |
| 스트리밍 | 제한적 | `ReadableStream` 완벽 지원 |
| Edge 런타임 | ❌ | ✅ (`export const runtime = 'edge'`) |

**미들웨어 핵심 정리:**
- `middleware.ts`는 프로젝트 루트(또는 `src/`)에 위치
- Edge Runtime에서 실행 → Node.js API 사용 불가
- `matcher`로 적용 경로를 세밀하게 제어
- 인증, 리다이렉트, 헤더 추가, CORS 등에 활용

---

## 연습 문제

1. **CRUD API 구현**: App Router의 Route Handlers를 사용하여 할 일(Todo) 관리 API를 구현하세요. `GET /api/todos`, `POST /api/todos`, `GET /api/todos/:id`, `PUT /api/todos/:id`, `DELETE /api/todos/:id` 엔드포인트를 모두 포함해야 하며, 입력 유효성 검사와 적절한 HTTP 상태 코드를 사용하세요.

2. **인증 미들웨어 구현**: JWT 기반 인증 미들웨어를 구현하세요. `/dashboard`와 `/api/private` 경로를 보호하고, 유효하지 않은 토큰은 `/login`으로 리다이렉트(페이지) 또는 401 응답(API)을 반환해야 합니다. `jose` 라이브러리를 사용하여 실제 JWT 검증 로직을 구현하세요.

3. **Rate Limiting**: 미들웨어를 사용하여 API Rate Limiting을 구현하세요. IP 주소별로 분당 최대 60회 요청을 허용하고, 초과 시 429 응답을 반환하세요. `Map`을 사용한 인메모리 구현 후, Redis를 이용한 분산 환경 적용 방법도 설계해보세요.
