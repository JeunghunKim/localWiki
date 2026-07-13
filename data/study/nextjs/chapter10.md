# Chapter 10: 배포 및 성능 최적화

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. Next.js 프로젝트의 환경변수를 목적에 맞게 분리하여 관리할 수 있다.
2. Vercel에 Next.js 애플리케이션을 배포하고 환경변수와 도메인을 설정할 수 있다.
3. 멀티스테이지 Dockerfile을 작성하여 최적화된 컨테이너 이미지를 빌드할 수 있다.
4. Core Web Vitals의 개념을 이해하고 Next.js 빌드 분석 도구로 성능 병목을 파악할 수 있다.
5. 코드 스플리팅, 지연 로딩, 캐싱 전략을 적용하여 애플리케이션 성능을 향상시킬 수 있다.
6. Vercel Analytics와 Sentry를 활용하여 프로덕션 환경을 모니터링할 수 있다.

---

## 1. 환경변수 관리

### 1.1 환경변수 파일 종류

Next.js는 목적에 따른 여러 환경변수 파일을 지원합니다. 우선순위는 더 구체적인 파일이 높습니다.

| 파일 | 로드 환경 | Git 커밋 |
|---|---|---|
| `.env` | 모든 환경 | O (공통 기본값) |
| `.env.local` | 모든 환경 (로컬 재정의) | X |
| `.env.development` | `next dev` 실행 시 | O |
| `.env.production` | `next build` / `next start` 시 | O |
| `.env.development.local` | `next dev` 실행 시 (로컬 재정의) | X |
| `.env.production.local` | `next build` / `next start` 시 (로컬 재정의) | X |

```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://user:password@localhost:5432/mydb_dev

# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://user:password@prod-db:5432/mydb_prod
```

### 1.2 서버 전용 변수 vs 클라이언트 변수

```bash
# 서버에서만 접근 가능 (클라이언트 번들에 포함되지 않음)
DATABASE_URL=postgresql://...
SECRET_KEY=super-secret-key
STRIPE_SECRET_KEY=sk_live_...

# NEXT_PUBLIC_ 접두사: 클라이언트 번들에 포함됨 (공개 정보만 사용)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> **보안 주의**: `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저에서 접근 가능하므로 비밀 정보를 절대 담지 마세요.

서버 전용 변수 노출을 방지하기 위해 `server-only` 패키지를 활용할 수 있습니다:

```tsx
// lib/db.ts
import 'server-only'; // 이 모듈이 클라이언트에서 import되면 빌드 에러 발생

import { prisma } from './prisma';
export { prisma };
```

### 1.3 `next.config.ts`에서 환경변수 접근

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 빌드 시 환경변수 유효성 검사
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY ?? '',
  },
  // 서버 전용 환경변수 검증 (런타임 에러 방지)
  serverRuntimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
  // 클라이언트·서버 공용 환경변수
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
```

환경변수 유효성 검사를 위해 `@t3-oss/env-nextjs` 또는 `zod`를 사용하는 것을 권장합니다:

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SECRET_KEY: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## 2. Vercel 배포

### 2.1 Vercel이란 무엇인가

Vercel은 Next.js를 만든 팀이 제공하는 클라우드 플랫폼으로, Next.js 애플리케이션에 최적화되어 있습니다.

**주요 특징:**

- Zero-config 배포: 별도 설정 없이 Next.js 프로젝트를 즉시 배포
- 글로벌 CDN: 전 세계 Edge Network를 통한 빠른 콘텐츠 전송
- 서버리스 함수: API Routes와 Server Actions를 자동으로 서버리스 함수로 변환
- 자동 HTTPS: 무료 SSL 인증서 자동 발급 및 갱신
- 프리뷰 배포: Pull Request마다 별도 배포 URL 생성

### 2.2 GitHub 리포지토리 연결 및 자동 배포

1. [vercel.com](https://vercel.com)에서 계정 생성 (GitHub 계정으로 로그인)
2. **"Add New Project"** 클릭
3. GitHub 리포지토리 선택 및 **"Import"**
4. 프레임워크 프리셋 **"Next.js"** 확인 (자동 감지)
5. **"Deploy"** 클릭

이후 `main` 브랜치에 `git push`할 때마다 자동으로 프로덕션 배포가 실행됩니다.

```bash
# Vercel CLI를 사용한 배포
npm install -g vercel
vercel login
vercel          # 개발/프리뷰 배포
vercel --prod   # 프로덕션 배포
```

### 2.3 환경변수 설정 (Vercel 대시보드)

1. 프로젝트 → **"Settings"** → **"Environment Variables"**
2. 변수명, 값 입력 후 적용할 환경 선택 (Production / Preview / Development)
3. **"Save"** 후 재배포 필요

```bash
# Vercel CLI로 환경변수 설정
vercel env add DATABASE_URL production
vercel env add SECRET_KEY production
vercel env pull .env.local  # Vercel 환경변수를 로컬에 동기화
```

### 2.4 도메인 연결

1. 프로젝트 → **"Settings"** → **"Domains"**
2. 커스텀 도메인 입력 (예: `myapp.com`)
3. 도메인 DNS 설정에 Vercel이 제공하는 CNAME 또는 A 레코드 추가
4. SSL 인증서 자동 발급 확인

### 2.5 프리뷰 배포

Pull Request를 열면 Vercel이 자동으로 해당 브랜치의 프리뷰 배포 URL을 생성합니다.

- 프리뷰 URL 형식: `https://project-name-git-branch-name-team.vercel.app`
- PR 댓글에 배포 URL 자동 게시
- 프리뷰 환경에서 별도 환경변수 적용 가능

### 2.6 Vercel Analytics 및 Speed Insights

```bash
npm install @vercel/analytics @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 3. Docker 배포

### 3.1 멀티스테이지 Dockerfile 작성

멀티스테이지 빌드를 사용하면 최종 이미지에 빌드 도구가 포함되지 않아 이미지 크기를 크게 줄일 수 있습니다.

```dockerfile
# Dockerfile

# ---- 1단계: 의존성 설치 ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ---- 2단계: 빌드 ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 시 필요한 환경변수 (ARG로 전달)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ---- 3단계: 실행 이미지 ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안을 위해 전용 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# standalone 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 3.2 `.dockerignore` 설정

```dockerignore
# .dockerignore
.git
.gitignore
.next
node_modules
npm-debug.log
README.md
.env
.env.*
!.env.example
Dockerfile
.dockerignore
```

### 3.3 `next.config.ts`에서 `output: 'standalone'` 설정

`standalone` 출력 모드는 `node_modules` 없이 실행 가능한 최소한의 파일만 포함하여 Docker 이미지 크기를 줄입니다.

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

### 3.4 Docker Compose 설정

```yaml
# docker-compose.yml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 3.5 컨테이너 빌드 및 실행 명령

```bash
# 이미지 빌드
docker build -t my-nextjs-app .

# 단독 컨테이너 실행
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e SECRET_KEY="..." \
  my-nextjs-app

# Docker Compose로 전체 스택 실행
docker compose up --build -d

# 로그 확인
docker compose logs -f web

# 컨테이너 중지
docker compose down

# 데이터 볼륨 포함 삭제
docker compose down -v
```

---

## 4. 성능 최적화

### 4.1 Core Web Vitals 소개

Core Web Vitals는 Google이 사용자 경험을 측정하는 세 가지 핵심 지표입니다.

| 지표 | 설명 | 좋음 | 개선 필요 |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | 가장 큰 콘텐츠 요소가 렌더링되는 시간 | ≤ 2.5s | > 4s |
| **INP** (Interaction to Next Paint) | 사용자 입력에 대한 응답 시간 | ≤ 200ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | 예상치 못한 레이아웃 이동의 누적 점수 | ≤ 0.1 | > 0.25 |

**Next.js에서 Core Web Vitals 개선 전략:**

- **LCP**: `next/image` 컴포넌트의 `priority` 속성으로 중요 이미지 사전 로드
- **INP**: 무거운 연산을 Web Worker나 서버로 이동, 불필요한 리렌더링 방지
- **CLS**: 이미지에 `width`/`height` 명시, 동적 콘텐츠 영역에 최소 높이 지정

### 4.2 Next.js 빌드 분석

```bash
npm install @next/bundle-analyzer
```

```typescript
// next.config.ts
import type { NextConfig } from 'next';
import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ...
};

export default withBundleAnalyzer(nextConfig);
```

```bash
# 번들 분석 실행 (브라우저에서 시각화 열림)
ANALYZE=true npm run build
```

분석 결과에서 확인할 사항:
- 큰 용량을 차지하는 라이브러리 파악
- 중복으로 포함된 모듈 확인
- 클라이언트 번들에 불필요하게 포함된 서버 코드 제거

### 4.3 코드 스플리팅과 지연 로딩

Next.js는 페이지 단위로 자동 코드 스플리팅을 수행하지만, 컴포넌트 수준에서 추가 최적화가 가능합니다.

```tsx
// dynamic import로 지연 로딩
import dynamic from 'next/dynamic';

// 기본 지연 로딩
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>차트 로딩 중...</p>,
});

// SSR 비활성화 (브라우저 전용 라이브러리)
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div style={{ height: '400px' }}>지도 로딩 중...</div>,
});

export default function DashboardPage() {
  return (
    <main>
      <HeavyChart />
      <Map />
    </main>
  );
}
```

```tsx
// React.lazy와 Suspense (클라이언트 컴포넌트)
'use client';

import { lazy, Suspense } from 'react';

const Modal = lazy(() => import('@/components/Modal'));

export default function PageWithModal() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Modal />
    </Suspense>
  );
}
```

### 4.4 `next build` 출력 해석

```
Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB         87 kB
├ ○ /about                              1.2 kB         83 kB
├ ● /posts                              3.1 kB         85 kB
├ ● /posts/[id]                         2.8 kB         84 kB
└ ƒ /api/posts                          0 B            0 B

○  (Static)   사전 렌더링된 정적 페이지
●  (SSG)      빌드 시 생성된 정적 페이지 (getStaticProps)
ƒ  (Dynamic)  서버에서 동적으로 렌더링
```

- **Size**: 해당 페이지 고유 자바스크립트 크기
- **First Load JS**: 페이지 접속 시 초기 로드되는 전체 JS 크기 (공유 청크 포함)
- First Load JS가 **130 kB** 이하면 양호, **250 kB** 이상이면 최적화 필요

### 4.5 캐싱 전략

Next.js App Router는 여러 계층의 캐싱을 제공합니다.

```tsx
// 1. fetch 캐싱 설정
// 정적 캐싱 (기본값, 빌드 시 캐시)
const data = await fetch('/api/data');

// 캐싱 비활성화 (매 요청마다 새로 가져옴)
const data = await fetch('/api/data', { cache: 'no-store' });

// 시간 기반 재검증 (60초마다 갱신)
const data = await fetch('/api/data', { next: { revalidate: 60 } });

// 태그 기반 재검증
const data = await fetch('/api/data', { next: { tags: ['posts'] } });
```

```tsx
// 2. 페이지 레벨 캐싱 설정
// app/posts/page.tsx

// 페이지 전체를 동적으로 렌더링
export const dynamic = 'force-dynamic';

// 특정 시간마다 재검증 (ISR)
export const revalidate = 3600; // 1시간

// 정적 생성
export const dynamic = 'force-static';
```

```tsx
// 3. 세그먼트 캐시 구성
// app/posts/[id]/page.tsx

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { id: true } });
  return posts.map((post) => ({ id: String(post.id) }));
}

// generateStaticParams가 있으면 빌드 시 정적 페이지 생성
```

---

## 5. 모니터링

### 5.1 Vercel Analytics

Vercel Analytics는 실제 사용자 데이터(RUM, Real User Monitoring)를 기반으로 Core Web Vitals를 측정합니다.

- Vercel 대시보드 → **"Analytics"** 탭에서 확인
- 페이지별 LCP, INP, CLS 지표 제공
- 시간별 트렌드와 디바이스/지역별 분석 지원

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 5.2 Sentry 에러 트래킹

Sentry는 프로덕션 환경에서 발생하는 에러를 실시간으로 수집하고 알림을 전송합니다.

```bash
npx @sentry/wizard@latest -i nextjs
```

위 명령은 자동으로 다음을 설정합니다:
- `sentry.client.config.ts` — 클라이언트 사이드 Sentry 초기화
- `sentry.server.config.ts` — 서버 사이드 Sentry 초기화
- `sentry.edge.config.ts` — Edge Runtime Sentry 초기화
- `next.config.ts` — Sentry 플러그인 적용

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10%의 트랜잭션 추적
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 세션 리플레이
  integrations: [
    Sentry.replayIntegration(),
  ],
});
```

**주요 Sentry 기능:**

- **에러 알림**: Slack, 이메일로 에러 발생 즉시 알림
- **에러 그룹핑**: 동일한 에러를 자동으로 그룹핑하여 중복 처리
- **Performance Tracing**: 느린 API 요청, DB 쿼리 추적
- **Source Maps**: 압축된 코드의 원본 위치 표시
- **Session Replay**: 에러 발생 직전 사용자 행동 녹화

---

## 요약

- **환경변수**는 `.env.local`, `.env.development`, `.env.production`으로 분리하고, 클라이언트에 노출되는 변수만 `NEXT_PUBLIC_` 접두사를 사용합니다.
- **Vercel 배포**는 GitHub 리포지토리를 연결하면 자동으로 설정되며, PR마다 프리뷰 배포 URL이 생성됩니다.
- **Docker 배포**는 멀티스테이지 빌드와 `output: 'standalone'` 설정으로 최소한의 이미지를 생성합니다.
- **Core Web Vitals**(LCP, INP, CLS)를 개선하기 위해 `next/image`, 동적 임포트, 레이아웃 안정화를 활용합니다.
- **번들 분석**으로 무거운 의존성을 파악하고, `dynamic import`와 코드 스플리팅으로 초기 로드 크기를 줄입니다.
- **Vercel Analytics**로 실사용자 성능 데이터를 모니터링하고, **Sentry**로 에러를 실시간으로 추적합니다.

---

## 연습 문제

1. 현재 프로젝트에 `@next/bundle-analyzer`를 설치하고 `ANALYZE=true npm run build`를 실행하세요. 가장 큰 용량을 차지하는 패키지 3가지를 확인하고, 그 중 하나를 `dynamic import`로 교체하세요.

2. 제공된 `Dockerfile` 템플릿을 기반으로 실제 프로젝트의 Dockerfile을 작성하고, `docker build`로 이미지를 빌드하세요. 빌드된 이미지 크기를 확인하고(`docker images`), `output: 'standalone'` 설정 전후의 크기를 비교하세요.

3. `.env.development`와 `.env.production`을 각각 만들고, API URL과 로그 레벨 환경변수를 다르게 설정하세요. 그런 다음 `next dev`와 `next build && next start` 실행 시 각 환경변수가 올바르게 적용되는지 확인하는 페이지를 만드세요.
