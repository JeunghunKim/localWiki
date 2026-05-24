# Chapter 5: 스타일링

## 학습 목표

이 챕터를 완료하면 다음을 할 수 있습니다:

1. Next.js에서 지원하는 다양한 스타일링 방법의 특징과 장단점을 비교·설명할 수 있다.
2. Global CSS를 설정하고 `layout.tsx`에서 올바르게 import할 수 있다.
3. CSS Modules를 사용하여 컴포넌트 범위의 스타일을 작성하고 클래스 충돌을 방지할 수 있다.
4. Tailwind CSS를 Next.js 프로젝트에 설정하고 유틸리티 클래스를 활용할 수 있다.
5. CSS-in-JS 라이브러리의 App Router 제약을 이해하고 올바르게 설정할 수 있다.
6. Sass/SCSS를 Next.js에 설치하고 활용할 수 있다.
7. 프로젝트 요구사항에 맞는 적절한 스타일링 방법을 선택할 수 있다.

---

## 스타일링 방법 개요

Next.js는 여러 스타일링 방법을 공식적으로 지원합니다.

| 방법 | 범위 | 빌드 필요 | 서버 컴포넌트 지원 | 적합한 용도 |
|---|---|---|---|---|
| Global CSS | 전역 | 불필요 | ✅ | 리셋, 타이포그래피, 공통 변수 |
| CSS Modules | 컴포넌트 | 불필요 | ✅ | 컴포넌트별 독립 스타일 |
| Tailwind CSS | 유틸리티 | 불필요 | ✅ | 빠른 UI 개발, 디자인 시스템 |
| Sass/SCSS | 컴포넌트/전역 | 불필요 | ✅ | 변수, 믹스인, 중첩 구조 |
| CSS-in-JS | 컴포넌트 | 필요 | ❌ (클라이언트만) | 동적 스타일, 테마 |

> **권장**: App Router 기반 프로젝트에서는 CSS Modules 또는 Tailwind CSS를 우선 고려하세요.

---

## 1. Global CSS

### `app/globals.css` 설명

Global CSS 파일은 애플리케이션 전체에 적용되는 스타일을 정의합니다. Next.js의 App Router에서는 `app/globals.css`가 기본 위치입니다.

```css
/* app/globals.css */

/* CSS 커스텀 속성 (변수) 정의 */
:root {
  --color-primary: #0070f3;
  --color-secondary: #ff4081;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

/* 기본 리셋 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 기본 타이포그래피 */
html {
  font-size: var(--font-size-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  background-color: #fff;
}

/* 링크 기본 스타일 */
a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 유틸리티 클래스 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 calc(var(--spacing-unit) * 2);
}
```

### `layout.tsx`에서 import 방법

Global CSS는 반드시 루트 레이아웃(`app/layout.tsx`)에서 한 번만 import 해야 합니다.

```tsx
// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Next.js 학습 프로젝트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

> **주의**: Global CSS 파일은 `_app.tsx` (Pages Router) 또는 루트 `layout.tsx` (App Router)에서만 import 가능합니다. 일반 컴포넌트에서 global CSS를 import하면 빌드 오류가 발생합니다.

### 언제 사용하는가

- CSS 리셋 및 기본 스타일 정규화
- CSS 커스텀 속성(변수) 정의
- 전역 폰트 설정
- 서드파티 라이브러리 스타일 오버라이드
- 공통 유틸리티 클래스

---

## 2. CSS Modules

CSS Modules는 CSS 클래스 이름을 자동으로 고유하게 변환하여 스타일의 범위를 컴포넌트 단위로 제한합니다.

### `.module.css` 파일 작성

```css
/* app/components/Button/Button.module.css */

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.button:active {
  transform: scale(0.98);
}

/* 변형(variants) */
.primary {
  background-color: #0070f3;
  color: #fff;
}

.primary:hover {
  background-color: #005bb5;
}

.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.secondary:hover {
  background-color: #e0e0e0;
}

/* 크기(sizes) */
.small {
  padding: 4px 12px;
  font-size: 12px;
}

.large {
  padding: 12px 24px;
  font-size: 16px;
}

/* 비활성화 상태 */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 컴포넌트에서 import 및 사용

```tsx
// app/components/Button/Button.tsx
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

/**
 * 재사용 가능한 버튼 컴포넌트.
 * CSS Modules를 사용하여 스타일을 캡슐화합니다.
 */
export default function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  // 조건부 클래스 이름 조합
  const classNames = [
    styles.button,
    styles[variant],
    size !== 'medium' ? styles[size] : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```tsx
// app/page.tsx - 사용 예시
import Button from './components/Button/Button';

export default function HomePage() {
  return (
    <main>
      <Button variant="primary" size="large">
        시작하기
      </Button>
      <Button variant="secondary" size="small" disabled>
        비활성화
      </Button>
    </main>
  );
}
```

### 클래스 이름 충돌 방지 원리

CSS Modules는 빌드 시점에 클래스 이름을 `[파일명]__[클래스명]__[해시]` 형태로 변환합니다.

```
.button → .Button__button__xyz123
.primary → .Button__primary__abc456
```

따라서 서로 다른 컴포넌트에서 동일한 클래스 이름을 사용해도 실제 DOM에 적용되는 이름은 고유합니다.

### `composes` 기능

CSS Modules의 `composes` 키워드를 사용하면 다른 클래스의 스타일을 재사용(조합)할 수 있습니다.

```css
/* app/components/Card/Card.module.css */

/* 기본 박스 스타일 */
.box {
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
}

/* box 스타일을 재사용하는 card */
.card {
  composes: box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

/* 다른 파일에서 composes */
.featuredCard {
  composes: card;
  border-color: #0070f3;
  border-width: 2px;
}

/* 전역 클래스 composes */
.utilityCard {
  composes: container from '../globals.module.css';
  padding: 24px;
}
```

---

## 3. Tailwind CSS

Tailwind CSS는 유틸리티 퍼스트(Utility-First) CSS 프레임워크로, 미리 정의된 클래스 이름을 조합하여 스타일을 작성합니다.

### Next.js에서 Tailwind 설정

**`create-next-app`으로 프로젝트 생성 시 포함:**

```bash
npx create-next-app@latest my-app --typescript --tailwind
```

**기존 프로젝트에 수동 설치:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### `tailwind.config.ts` 설명

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // Tailwind가 클래스를 스캔할 파일 경로
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 다크 모드 설정 ('media' | 'class')
  darkMode: 'class',
  theme: {
    // 기본 테마 완전 교체
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // 기본 테마 확장 (추가/덮어쓰기)
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};

export default config;
```

**`globals.css`에 Tailwind 지시어 추가:**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 유틸리티 클래스 사용 예제

```tsx
// app/components/ProductCard.tsx
interface Product {
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export default function ProductCard({ name, price, imageUrl, rating }: Product) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* 이미지 영역 */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4">
        <h3 className="truncate text-lg font-semibold text-gray-900">{name}</h3>

        {/* 별점 */}
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-sm text-gray-500">({rating}/5)</span>
        </div>

        {/* 가격 및 버튼 */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-brand-500">
            ₩{price.toLocaleString()}
          </span>
          <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 active:bg-brand-700">
            장바구니
          </button>
        </div>
      </div>
    </div>
  );
}
```

### `@apply` 지시어

반복되는 유틸리티 클래스 조합을 커스텀 CSS 클래스로 추출할 때 사용합니다.

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* 버튼 기본 스타일 */
  .btn {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }

  .btn-secondary {
    @apply btn bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500;
  }

  /* 입력 필드 기본 스타일 */
  .input {
    @apply block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500;
  }

  /* 카드 스타일 */
  .card {
    @apply rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200;
  }
}

@layer utilities {
  /* 커스텀 유틸리티 */
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 다크 모드 설정

**`tailwind.config.ts`에서 `darkMode: 'class'` 설정 후:**

```tsx
// app/components/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 테마 불러오기
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="테마 전환"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

```tsx
// 다크 모드 클래스 활용 예시
export default function DarkModeCard() {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        다크 모드 카드
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        다크 모드에서 자동으로 색상이 전환됩니다.
      </p>
      <button className="mt-4 btn-primary">
        자세히 보기
      </button>
    </div>
  );
}
```

---

## 4. CSS-in-JS

### App Router에서의 주의사항

CSS-in-JS 라이브러리(`styled-components`, `emotion` 등)는 런타임에 스타일을 생성하기 위해 React Context를 사용합니다. **Next.js App Router의 서버 컴포넌트는 React Context를 지원하지 않으므로**, CSS-in-JS는 클라이언트 컴포넌트에서만 사용 가능합니다.

> **권장**: App Router 프로젝트에서는 CSS-in-JS 대신 CSS Modules 또는 Tailwind CSS를 사용하는 것이 좋습니다.

### styled-components 설정 예제

```bash
npm install styled-components
npm install -D @types/styled-components babel-plugin-styled-components
```

**서버 사이드 렌더링을 위한 레지스트리 설정:**

```tsx
// app/lib/styled-components-registry.tsx
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

/**
 * SSR 환경에서 styled-components 스타일을 올바르게 주입하는 레지스트리.
 */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
```

```tsx
// app/layout.tsx
import StyledComponentsRegistry from './lib/styled-components-registry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

```tsx
// app/components/StyledButton.tsx
'use client'; // 클라이언트 컴포넌트 선언 필수

import styled from 'styled-components';

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  background-color: ${({ $variant }) =>
    $variant === 'secondary' ? '#f0f0f0' : '#0070f3'};
  color: ${({ $variant }) =>
    $variant === 'secondary' ? '#333' : '#fff'};

  &:hover {
    opacity: 0.9;
  }
`;

export default StyledButton;
```

---

## 5. Sass/SCSS

### 설치

```bash
npm install -D sass
```

설치만 하면 Next.js가 자동으로 `.scss`, `.sass` 파일을 처리합니다.

### 사용 방법

```scss
// app/styles/_variables.scss
$color-primary: #0070f3;
$color-secondary: #ff4081;
$spacing-base: 8px;
$border-radius-default: 4px;
$font-size-base: 16px;

$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
);
```

```scss
// app/styles/_mixins.scss
@use 'variables' as *;

// 반응형 미디어 쿼리 믹스인
@mixin respond-to($breakpoint) {
  $value: map-get($breakpoints, $breakpoint);
  @if $value {
    @media (min-width: $value) {
      @content;
    }
  }
}

// 플렉스 센터링 믹스인
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}

// 텍스트 말줄임 믹스인
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

```scss
// app/components/Hero/Hero.module.scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.hero {
  @include flex-center(column);
  min-height: 80vh;
  padding: $spacing-base * 4;
  background: linear-gradient(135deg, $color-primary 0%, darken($color-primary, 20%) 100%);
  color: #fff;

  @include respond-to('md') {
    padding: $spacing-base * 8;
  }
}

.title {
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  @include truncate(2);

  @include respond-to('lg') {
    font-size: 3.5rem;
  }
}

.subtitle {
  margin-top: $spacing-base * 2;
  font-size: 1.125rem;
  opacity: 0.85;
  text-align: center;
  max-width: 600px;
}

.ctaGroup {
  @include flex-center;
  gap: $spacing-base * 2;
  margin-top: $spacing-base * 4;
  flex-wrap: wrap;
}
```

```tsx
// app/components/Hero/Hero.tsx
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Next.js로 현대적인 웹을 만들어보세요</h1>
      <p className={styles.subtitle}>
        빠르고 확장 가능한 풀스택 React 프레임워크
      </p>
      <div className={styles.ctaGroup}>
        <button className="btn-primary">시작하기</button>
        <button className="btn-secondary">문서 보기</button>
      </div>
    </section>
  );
}
```

---

## 요약

| 방법 | 장점 | 단점 |
|---|---|---|
| Global CSS | 간단, 모든 곳에서 접근 가능 | 클래스 충돌 위험 |
| CSS Modules | 스코프 격리, 타입 안전 가능 | 동적 스타일 불편 |
| Tailwind CSS | 빠른 개발, 디자인 일관성 | 클래스 이름이 길어짐 |
| Sass/SCSS | 강력한 기능(변수, 믹스인) | 별도 설치, 빌드 복잡도 |
| CSS-in-JS | 동적 스타일, Props 연동 | SSR 설정 복잡, 서버 컴포넌트 제한 |

- **소규모 프로젝트**: Global CSS + CSS Modules
- **빠른 프로토타이핑**: Tailwind CSS
- **디자인 시스템**: Tailwind CSS + CSS Modules 조합
- **복잡한 동적 UI**: CSS-in-JS (단, App Router에서는 주의)

---

## 연습 문제

1. **CSS Modules 실습**: 헤더 컴포넌트(`Header`)를 CSS Modules로 스타일링하세요. 로고, 내비게이션 링크(활성 링크 강조), 반응형 햄버거 메뉴를 포함해야 합니다. `composes`를 최소 한 곳에 활용하세요.

2. **Tailwind 다크 모드**: `darkMode: 'class'`를 사용하는 대시보드 레이아웃을 구현하세요. 사이드바, 메인 콘텐츠 영역, 상단 헤더를 포함하며, 라이트/다크 모드 전환 버튼을 구현하고 `localStorage`에 선택을 저장하세요.

3. **스타일링 방법 혼합 사용**: 동일한 `Card` 컴포넌트를 (a) CSS Modules, (b) Tailwind CSS, (c) Sass/SCSS 세 가지 방법으로 각각 구현하고, 각 방법의 개발 경험과 코드 양을 비교하는 간단한 문서를 작성하세요.
