# Next.js 학습 로드맵

> React 기반의 풀스택 웹 프레임워크 Next.js를 처음부터 실무 수준까지 단계적으로 학습합니다.

---

## 전제 조건

- HTML / CSS 기초
- JavaScript ES6+ (화살표 함수, 모듈, 비동기 처리)
- React 기초 (컴포넌트, props, state, hooks)

---

## 챕터 구성

| 챕터 | 제목 | 핵심 키워드 |
|------|------|-------------|
| [Chapter 1](chapter1.md) | Next.js 소개 및 환경 설정 | create-next-app, 프로젝트 구조, 개발 서버 |
| [Chapter 2](chapter2.md) | 파일 기반 라우팅 (Pages Router) | pages/, 동적 라우트, Link, useRouter |
| [Chapter 3](chapter3.md) | App Router와 서버 컴포넌트 | app/, layout, page, Server/Client Component |
| [Chapter 4](chapter4.md) | 데이터 페칭 | getStaticProps, getServerSideProps, ISR, fetch |
| [Chapter 5](chapter5.md) | 스타일링 | CSS Modules, Global CSS, Tailwind CSS |
| [Chapter 6](chapter6.md) | API Routes & Route Handlers | API Routes, Route Handlers, 미들웨어 |
| [Chapter 7](chapter7.md) | 최적화 | Image, Font, Metadata, Script |
| [Chapter 8](chapter8.md) | 인증 (Authentication) | NextAuth.js, JWT, 세션, 보호된 라우트 |
| [Chapter 9](chapter9.md) | 데이터베이스 연동 | Prisma, PostgreSQL, Server Actions |
| [Chapter 10](chapter10.md) | 배포 및 성능 최적화 | Vercel, Docker, 환경변수, Core Web Vitals |

---

## 학습 경로

```
Chapter 1 (환경 설정)
    │
    ▼
Chapter 2 (Pages Router 라우팅)
    │
    ▼
Chapter 3 (App Router & 서버 컴포넌트)  ← 현대 Next.js의 핵심
    │
    ├──▶ Chapter 4 (데이터 페칭)
    │         │
    │         ▼
    │    Chapter 6 (API Routes)
    │         │
    │         ▼
    │    Chapter 9 (데이터베이스)
    │
    ├──▶ Chapter 5 (스타일링)
    │
    ├──▶ Chapter 7 (최적화)
    │
    ├──▶ Chapter 8 (인증)
    │
    └──▶ Chapter 10 (배포) ← 모든 챕터 완료 후
```

---

## 챕터별 요약

### Chapter 1 — Next.js 소개 및 환경 설정
Next.js가 무엇인지, 왜 사용하는지 이해하고, `create-next-app`으로 프로젝트를 생성하여 구조를 파악합니다.

### Chapter 2 — 파일 기반 라우팅 (Pages Router)
`pages/` 디렉터리 기반 라우팅 시스템을 학습하고, 동적 라우트와 `Link`, `useRouter`를 활용합니다.

### Chapter 3 — App Router와 서버 컴포넌트
Next.js 13+에서 도입된 App Router와 React Server Components의 개념과 사용법을 학습합니다.

### Chapter 4 — 데이터 페칭
`getStaticProps`, `getServerSideProps`, ISR, 그리고 App Router의 `fetch`를 이용한 다양한 데이터 페칭 전략을 학습합니다.

### Chapter 5 — 스타일링
CSS Modules, Global CSS, Tailwind CSS 등 Next.js에서 사용할 수 있는 스타일링 방법을 학습합니다.

### Chapter 6 — API Routes & Route Handlers
백엔드 API 엔드포인트를 Next.js 내부에서 구현하는 방법을 학습합니다.

### Chapter 7 — 최적화
`next/image`, `next/font`, Metadata API, `next/script`를 활용한 성능 최적화를 학습합니다.

### Chapter 8 — 인증 (Authentication)
NextAuth.js(Auth.js)를 이용한 소셜 로그인, JWT/세션 관리, 미들웨어를 통한 라우트 보호를 학습합니다.

### Chapter 9 — 데이터베이스 연동
Prisma ORM과 PostgreSQL을 연동하고, Server Actions를 이용한 풀스택 데이터 처리를 학습합니다.

### Chapter 10 — 배포 및 성능 최적화
Vercel 및 Docker를 이용한 프로덕션 배포, 환경변수 관리, Core Web Vitals 최적화를 학습합니다.

---

## 권장 학습 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Next.js 공식 튜토리얼](https://nextjs.org/learn)
- [React 공식 문서](https://react.dev)
- [Vercel 블로그](https://vercel.com/blog)

---

## 각 챕터 파일

| 형식 | 파일명 패턴 | 용도 |
|------|-------------|------|
| Markdown | `chapter#.md` | 온라인/에디터 학습 자료 |
| LaTeX (XeTeX) | `chapter#.tex` | 인쇄용 PDF 학습 자료 |

LaTeX 파일 컴파일:
```bash
xelatex chapter1.tex
```
