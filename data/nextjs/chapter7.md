# Chapter 7: 최적화 (Image, Font, Metadata, Script)

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. `next/image`의 `<Image>` 컴포넌트를 사용하여 이미지를 자동 최적화한다.
2. `next/font`로 Google Fonts 및 로컬 폰트를 레이아웃 시프트 없이 적용한다.
3. Metadata API를 활용하여 정적·동적 SEO 메타데이터를 설정한다.
4. Open Graph 및 Twitter 카드 메타데이터를 구성한다.
5. `next/script`의 `strategy` 옵션으로 서드파티 스크립트 로딩을 최적화한다.
6. 동적 임포트(`next/dynamic`)로 번들 크기를 줄이고 초기 로딩 성능을 향상시킨다.

---

## 1. `next/image` - 이미지 최적화

### 1.1 `<Image>` 컴포넌트 기본 사용법

Next.js의 `<Image>` 컴포넌트는 HTML `<img>` 태그를 대체하며, 자동 크기 조정·포맷 변환(WebP/AVIF)·지연 로딩 등을 제공합니다.

```tsx
// app/components/ProfileImage.tsx
import Image from 'next/image';

export default function ProfileImage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="프로필 사진"
      width={300}
      height={300}
    />
  );
}
```

### 1.2 `width`, `height`, `fill` 속성

- **`width` / `height`**: 픽셀 단위로 렌더링 크기를 지정합니다. 레이아웃 시프트(CLS)를 방지합니다.
- **`fill`**: 부모 컨테이너를 채우는 모드입니다. 부모에 `position: relative`가 필요합니다.

```tsx
// fill 모드 - 부모 컨테이너 크기에 맞게 채움
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Image
        src="/images/hero.jpg"
        alt="히어로 배너"
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
```

### 1.3 `priority` 속성 (LCP 최적화)

LCP(Largest Contentful Paint) 대상 이미지에는 `priority` 속성을 추가합니다.  
이 속성이 있으면 지연 로딩을 비활성화하고 `<link rel="preload">`를 자동 추가합니다.

```tsx
// 히어로 이미지 등 Above-the-fold 이미지에 priority 사용
<Image
  src="/images/hero.jpg"
  alt="메인 히어로"
  width={1200}
  height={600}
  priority
/>
```

### 1.4 `placeholder="blur"` 사용

로딩 중 흐릿한 플레이스홀더를 표시합니다.  
로컬 이미지는 자동 생성되고, 원격 이미지는 `blurDataURL`을 직접 제공해야 합니다.

```tsx
import Image from 'next/image';
import profileImg from '/public/images/profile.jpg'; // 로컬 이미지 임포트

export default function BlurExample() {
  return (
    // 로컬 이미지: blurDataURL 자동 생성
    <Image
      src={profileImg}
      alt="프로필"
      placeholder="blur"
    />
  );
}
```

```tsx
// 원격 이미지: blurDataURL 직접 제공
<Image
  src="https://example.com/photo.jpg"
  alt="원격 이미지"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
/>
```

### 1.5 외부 이미지 도메인 설정

외부 URL 이미지를 사용하려면 `next.config.ts`에서 허용 도메인을 등록해야 합니다.

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
};

export default nextConfig;
```

### 1.6 일반 `<img>` 태그 대비 장점

| 기능 | `<img>` 태그 | `<Image>` 컴포넌트 |
|------|-------------|-------------------|
| 자동 WebP/AVIF 변환 | ❌ | ✅ |
| 지연 로딩 (lazy loading) | 수동 설정 | ✅ 기본 제공 |
| 레이아웃 시프트 방지 (CLS) | ❌ | ✅ |
| 이미지 크기 자동 조정 | ❌ | ✅ |
| CDN 최적화 | ❌ | ✅ |
| 뷰포트별 `srcset` 생성 | 수동 설정 | ✅ 자동 |

---

## 2. `next/font` - 폰트 최적화

Next.js의 폰트 최적화는 폰트 파일을 빌드 시 다운로드하여 외부 네트워크 요청을 없애고, 레이아웃 시프트(CLS)를 방지합니다.

### 2.1 Google Fonts 사용

```tsx
// app/layout.tsx
import { Inter, Noto_Sans_KR } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKr.variable}`}>
      <body className={notoSansKr.className}>{children}</body>
    </html>
  );
}
```

### 2.2 로컬 폰트 사용

```tsx
// app/layout.tsx
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}
```

### 2.3 CSS 변수로 폰트 적용

CSS 변수를 통해 Tailwind CSS나 글로벌 스타일에서 폰트를 사용할 수 있습니다.

```css
/* app/globals.css */
body {
  font-family: var(--font-pretendard), sans-serif;
}

h1, h2, h3 {
  font-family: var(--font-inter), var(--font-pretendard), serif;
}
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)', 'sans-serif'],
        heading: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
};
```

### 2.4 폰트 서브셋 지정

서브셋을 지정하면 필요한 문자만 포함하여 폰트 파일 크기를 줄입니다.

```tsx
const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],      // 라틴 문자만 포함
  display: 'swap',
  preload: true,           // 기본값 true, 크리티컬 폰트에 preload
  fallback: ['system-ui', 'arial'],  // 폴백 폰트
});
```

---

## 3. Metadata API - SEO 최적화

### 3.1 정적 메타데이터

레이아웃이나 페이지 파일에서 `metadata` 객체를 내보내면 됩니다.

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My App',  // 하위 페이지 제목 템플릿
    default: 'My App',
  },
  description: 'Next.js로 구축된 최신 웹 애플리케이션',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: '홍길동', url: 'https://example.com' }],
  creator: '홍길동',
  robots: {
    index: true,
    follow: true,
  },
};
```

```tsx
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회사 소개',       // 결과: "회사 소개 | My App"
  description: '우리 팀과 미션에 대해 알아보세요.',
};

export default function AboutPage() {
  return <h1>회사 소개</h1>;
}
```

### 3.2 동적 메타데이터

라우트 파라미터나 외부 데이터를 기반으로 메타데이터를 동적으로 생성합니다.

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // 데이터 페칭
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(
    (res) => res.json()
  );

  // 부모 메타데이터 상속
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage, ...previousImages],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(
    (res) => res.json()
  );
  return <article>{post.content}</article>;
}
```

### 3.3 Open Graph 메타데이터

```tsx
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: {
    title: 'My Next.js App',
    description: '최신 Next.js 기술로 만든 웹 앱',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [
      {
        url: 'https://myapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My App OG Image',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};
```

### 3.4 Twitter 카드 메타데이터

```tsx
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'My Next.js App',
    description: '최신 Next.js 기술로 만든 웹 앱',
    siteId: '1234567890',
    creator: '@myhandle',
    images: ['https://myapp.com/twitter-image.png'],
  },
};
```

### 3.5 `<head>` 태그 커스터마이징

특수한 태그가 필요할 때는 `app/layout.tsx`에서 직접 추가합니다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 커스텀 태그는 Next.js가 자동으로 중복 제거 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 4. `next/script` - 스크립트 최적화

### 4.1 `<Script>` 컴포넌트 기본 사용법

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

### 4.2 `strategy` 옵션

| 전략 | 로딩 시점 | 용도 |
|------|-----------|------|
| `beforeInteractive` | 페이지가 인터랙티브해지기 전 | 폴리필, 크리티컬 스크립트 |
| `afterInteractive` | 페이지가 인터랙티브해진 후 (기본값) | 태그 매니저, 분석 도구 |
| `lazyOnload` | 브라우저 유휴 시간에 로딩 | 채팅 위젯, 낮은 우선순위 스크립트 |
| `worker` | 웹 워커에서 실행 (실험적) | 메인 스레드 오프로딩 |

```tsx
// beforeInteractive - HTML에 직접 삽입, 가장 먼저 실행
<Script
  src="/scripts/polyfill.js"
  strategy="beforeInteractive"
/>

// afterInteractive - 클라이언트 수화 후 실행
<Script
  src="https://cdn.example.com/analytics.js"
  strategy="afterInteractive"
  onLoad={() => console.log('분석 스크립트 로드 완료')}
/>

// lazyOnload - 브라우저가 한가할 때 실행
<Script
  src="https://cdn.example.com/chat-widget.js"
  strategy="lazyOnload"
/>
```

### 4.3 인라인 스크립트 및 이벤트 핸들러

```tsx
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* 인라인 스크립트 */}
      <Script id="analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_TRACKING_ID');
        `}
      </Script>

      {/* 이벤트 핸들러 */}
      <Script
        src="https://example.com/script.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('스크립트 로드 성공');
        }}
        onError={(e) => {
          console.error('스크립트 로드 실패:', e);
        }}
      />
    </>
  );
}
```

---

## 5. 번들 크기 최적화

### 5.1 동적 임포트 (`next/dynamic`)

클라이언트 사이드에서만 필요하거나 초기 로딩이 불필요한 컴포넌트는 동적 임포트를 사용합니다.

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

// 기본 동적 임포트 - 클라이언트에서 필요할 때 로딩
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>차트 로딩 중...</p>,
});

// NamedExport 사용 시
const { DynamicComponent } = dynamic(
  () => import('@/components/MultiExport').then((mod) => mod.DynamicComponent)
);

export default function DashboardPage() {
  return (
    <main>
      <h1>대시보드</h1>
      <HeavyChart />
    </main>
  );
}
```

### 5.2 SSR 비활성화 옵션

브라우저 전용 API를 사용하는 컴포넌트는 SSR을 비활성화합니다.

```tsx
import dynamic from 'next/dynamic';

// SSR 비활성화 - 브라우저 전용 컴포넌트 (window, document 사용)
const BrowserOnlyMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="map-skeleton">지도 로딩 중...</div>,
});

// 리치 텍스트 에디터 (브라우저 의존성이 높은 라이브러리)
const RichEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
});

export default function EditorPage() {
  return (
    <div>
      <RichEditor />
      <BrowserOnlyMap center={[37.5665, 126.978]} zoom={13} />
    </div>
  );
}
```

### 5.3 번들 분석

```bash
# @next/bundle-analyzer 설치
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // next.js 설정
});
```

```bash
# 번들 분석 실행
ANALYZE=true npm run build
```

---

## 요약

| 최적화 영역 | 도구 | 주요 효과 |
|------------|------|----------|
| 이미지 | `next/image` | WebP 변환, 지연 로딩, CLS 방지 |
| 폰트 | `next/font` | 외부 요청 제거, CLS 방지, FOUT 방지 |
| SEO | Metadata API | 정적·동적 메타데이터, OG, Twitter 카드 |
| 스크립트 | `next/script` | 로딩 전략 제어, 파싱 블로킹 방지 |
| 번들 | `next/dynamic` | 코드 분할, 초기 JS 크기 감소 |

- `priority` 속성은 LCP 이미지에만 사용하고, 남용하지 않는다.
- 폰트는 레이아웃 파일에서 한 번만 정의하고 CSS 변수로 공유한다.
- Metadata API는 레이아웃 계층 구조를 따라 자동 병합된다.
- `beforeInteractive`는 꼭 필요한 경우에만 사용한다 (페이지 로딩 지연 유발).
- 동적 임포트는 실제로 코드 분할이 필요한 컴포넌트에만 적용한다.

---

## 연습 문제

1. **이미지 최적화 실습**: 기존 프로젝트의 `<img>` 태그를 모두 `<Image>` 컴포넌트로 교체하고, LCP 이미지에는 `priority`를 추가하세요. `next.config.ts`에서 외부 이미지 도메인(`images.unsplash.com`)을 허용하고, 해당 도메인의 이미지를 `placeholder="blur"`와 함께 표시해보세요.

2. **SEO 메타데이터 구성**: 블로그 플랫폼을 구현한다고 가정하고, 루트 레이아웃에 사이트 전체 메타데이터(title template, description, OG 이미지)를 설정하세요. 그리고 `/blog/[slug]` 페이지에서 `generateMetadata`를 사용하여 각 포스트의 제목, 설명, OG 이미지를 동적으로 생성하세요.

3. **성능 최적화 조합**: Google Analytics 4 스크립트를 `afterInteractive` 전략으로 추가하고, 대용량 차트 라이브러리(예: Chart.js 래퍼 컴포넌트)를 `next/dynamic`으로 지연 로딩하세요. `@next/bundle-analyzer`로 최적화 전후의 번들 크기 변화를 확인해보세요.
