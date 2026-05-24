# Chapter 7: 커스터마이징

Tailwind CSS의 가장 큰 강점 중 하나는 강력한 커스터마이징 시스템입니다.
`tailwind.config.js` 파일을 통해 색상, 폰트, 브레이크포인트 등 모든 디자인 토큰을 프로젝트에 맞게 조정할 수 있습니다.
이 챕터에서는 Tailwind CSS를 프로젝트의 디자인 시스템에 맞게 커스터마이징하는 방법을 상세히 다룹니다.

---

## 7.1 tailwind.config.js 구조

`tailwind.config.js`는 Tailwind CSS의 중심 설정 파일입니다.
프로젝트 루트에 위치하며 다음 주요 섹션으로 구성됩니다.

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. content: Tailwind가 스캔할 파일 경로 (사용된 클래스를 파악하여 불필요한 CSS 제거)
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './public/index.html',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  // 2. darkMode: 다크모드 전략 ('media' 또는 'class')
  darkMode: 'class',

  // 3. theme: 디자인 토큰 설정
  theme: {
    // theme 직접 설정 → 기본값 완전히 대체
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    // theme.extend → 기본값을 유지하면서 추가
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a5f',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui'],
      },
    },
  },

  // 4. plugins: 플러그인 등록
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

### content 설정의 중요성

`content` 배열에 올바른 파일 경로가 지정되어야 Tailwind가 사용된 클래스를 파악하고 최종 CSS 번들을 최적화할 수 있습니다.

```js
content: [
  // HTML 파일
  './**/*.html',
  // JavaScript/TypeScript 파일
  './src/**/*.{js,ts}',
  // React/Next.js
  './src/**/*.{jsx,tsx}',
  // Vue
  './src/**/*.vue',
  // 동적으로 생성되는 클래스 (안전 목록)
  // safelist: ['bg-red-500', 'text-3xl'],
],
```

> **주의**: 동적으로 생성되는 클래스(예: `bg-${color}-500`)는 Tailwind가 감지할 수 없으므로 `safelist`에 명시적으로 추가해야 합니다.

---

## 7.2 theme.extend vs theme 직접 오버라이드

### theme.extend (권장)

기본 Tailwind 테마를 유지하면서 값을 추가합니다.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // 기본 색상 팔레트는 유지되고 brand 색상이 추가됨
      colors: {
        brand: '#3b82f6',
        'brand-dark': '#1d4ed8',
      },
      // 기본 spacing에 추가
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // 기본 border-radius에 추가
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
};
```

### theme 직접 오버라이드 (주의 필요)

`extend` 없이 `theme`에 직접 설정하면 Tailwind 기본값이 **완전히 대체**됩니다.

```js
// tailwind.config.js
module.exports = {
  theme: {
    // 경고: 이렇게 하면 Tailwind의 기본 색상이 모두 제거됨
    colors: {
      white: '#ffffff',
      black: '#000000',
      // 이 색상들만 사용 가능해짐
      primary: {
        DEFAULT: '#3b82f6',
        dark: '#1d4ed8',
      },
    },
  },
};
```

기본값을 참조하면서 수정하는 방법:

```js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // 기본 sans 폰트 앞에 Pretendard 추가
        sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
```

---

## 7.3 커스텀 색상 추가

### 단순 색상 추가

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 단일 값
        'brand': '#3b82f6',
        'brand-hover': '#2563eb',

        // 팔레트 형식 (권장)
        'primary': {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // DEFAULT
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          DEFAULT: '#3b82f6',
        },
      },
    },
  },
};
```

### CSS 변수 기반 색상 (다크모드 친화적)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
    },
  },
};
```

CSS 변수 정의 (글로벌 CSS):

```css
/* global.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
}
```

사용 예제:

```html
<div class="bg-background text-foreground">
  <button class="bg-primary text-primary-foreground px-4 py-2 rounded">
    커스텀 색상 버튼
  </button>
  <p class="text-muted-foreground">보조 텍스트</p>
</div>
```

---

## 7.4 커스텀 폰트 추가

### Google Fonts 사용

```html
<!-- HTML head에 폰트 링크 추가 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
```

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
        heading: ['"Playfair Display"', 'serif'],
        code: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
```

사용 예제:

```html
<h1 class="font-heading text-4xl font-bold">헤딩 폰트 적용</h1>
<p class="font-sans text-base">본문 폰트 적용 (Noto Sans KR)</p>
<code class="font-code text-sm bg-gray-100 px-2 py-1 rounded">코드 폰트 적용</code>
```

### 로컬 폰트 (@font-face)

```css
/* global.css */
@font-face {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 100 900;
  src: url('/fonts/PretendardVariable.woff2') format('woff2');
  font-display: swap;
}
```

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
```

---

## 7.5 커스텀 브레이크포인트 추가

### 기본 브레이크포인트

Tailwind는 기본적으로 다음 브레이크포인트를 제공합니다:

| 이름 | 최소 너비 |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### 커스텀 브레이크포인트 추가

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        // 새 브레이크포인트 추가
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
};
```

### 완전히 교체하는 경우 (extend 없이)

```js
module.exports = {
  theme: {
    screens: {
      'mobile': '375px',
      'tablet': '768px',
      'desktop': '1024px',
      'wide': '1440px',
    },
  },
};
```

사용 예제:

```html
<!-- xs 브레이크포인트 사용 -->
<div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 3xl:grid-cols-6 gap-4">
  <!-- 그리드 아이템 -->
</div>

<!-- 커스텀 브레이크포인트 -->
<div class="hidden tablet:block desktop:flex wide:grid">
  <!-- 반응형 요소 -->
</div>
```

### max-width 브레이크포인트 (max-*)

```js
module.exports = {
  theme: {
    extend: {
      screens: {
        // max-width 기반 미디어 쿼리
        'max-lg': { max: '1023px' },
        'max-md': { max: '767px' },
      },
    },
  },
};
```

---

## 7.6 @layer 디렉티브

`@layer`는 Tailwind의 세 가지 레이어(`base`, `components`, `utilities`)에 커스텀 스타일을 추가하는 방법입니다.

### @layer base

HTML 기본 요소에 스타일을 정의합니다 (CSS 리셋 또는 기본 타이포그래피).

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* HTML 요소 기본 스타일 */
  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-white text-gray-900 font-sans antialiased;
  }

  h1 {
    @apply text-4xl font-bold tracking-tight;
  }

  h2 {
    @apply text-3xl font-semibold tracking-tight;
  }

  h3 {
    @apply text-2xl font-semibold;
  }

  a {
    @apply text-blue-600 hover:text-blue-700 transition-colors;
  }

  /* 커스텀 CSS 변수 */
  :root {
    --color-primary: theme('colors.blue.600');
    --radius: 0.5rem;
  }
}
```

### @layer components

재사용 가능한 컴포넌트 클래스를 정의합니다.

```css
@layer components {
  /* 버튼 컴포넌트 */
  .btn {
    @apply inline-flex items-center justify-center font-semibold
           rounded-lg transition-all duration-200 focus:outline-none
           focus-visible:ring-2 focus-visible:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-sm {
    @apply px-3 py-1.5 text-sm;
  }

  .btn-md {
    @apply px-4 py-2 text-sm;
  }

  .btn-lg {
    @apply px-6 py-3 text-base;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
           focus-visible:ring-blue-500;
  }

  .btn-secondary {
    @apply bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300
           focus-visible:ring-gray-500;
  }

  .btn-outline {
    @apply border-2 border-blue-600 text-blue-600 bg-transparent
           hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500;
  }

  .btn-ghost {
    @apply bg-transparent text-gray-700 hover:bg-gray-100
           focus-visible:ring-gray-400;
  }

  /* 카드 컴포넌트 */
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100;
  }

  .card-body {
    @apply p-6;
  }

  .card-header {
    @apply px-6 py-4 border-b border-gray-100;
  }

  .card-footer {
    @apply px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl;
  }

  /* 입력 필드 컴포넌트 */
  .input {
    @apply w-full px-3 py-2 text-sm text-gray-900 bg-white
           border border-gray-200 rounded-lg
           placeholder:text-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500/50
           focus:border-blue-500 transition-all
           disabled:bg-gray-50 disabled:text-gray-400
           disabled:cursor-not-allowed;
  }

  .input-error {
    @apply border-red-500 focus:ring-red-500/50 focus:border-red-500;
  }

  /* 배지 컴포넌트 */
  .badge {
    @apply inline-flex items-center gap-1 text-xs font-semibold
           px-2 py-0.5 rounded-full;
  }

  .badge-blue {
    @apply bg-blue-100 text-blue-700;
  }

  .badge-green {
    @apply bg-green-100 text-green-700;
  }

  .badge-red {
    @apply bg-red-100 text-red-700;
  }

  .badge-yellow {
    @apply bg-yellow-100 text-yellow-700;
  }
}
```

### @layer utilities

커스텀 유틸리티 클래스를 정의합니다.

```css
@layer utilities {
  /* 텍스트 그라디언트 */
  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent;
  }

  .text-gradient-warm {
    @apply bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent;
  }

  /* 스크롤바 숨기기 */
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }

  /* 글래스모피즘 */
  .glass {
    @apply bg-white/80 backdrop-blur-md border border-white/20 shadow-lg;
  }

  .glass-dark {
    @apply bg-gray-900/80 backdrop-blur-md border border-gray-700/50 shadow-lg;
  }

  /* 트런케이트 라인 수 제한 */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

사용 예제:

```html
<!-- 컴포넌트 클래스 활용 -->
<div class="card">
  <div class="card-header">
    <h2 class="text-lg font-semibold text-gray-900">카드 제목</h2>
  </div>
  <div class="card-body">
    <p class="text-gray-600">카드 내용입니다.</p>
    <div class="mt-4 flex gap-2">
      <button class="btn btn-md btn-primary">저장</button>
      <button class="btn btn-md btn-secondary">취소</button>
      <button class="btn btn-md btn-outline">더보기</button>
    </div>
  </div>
  <div class="card-footer">
    <span class="badge badge-blue">완료</span>
    <span class="badge badge-green ml-2">활성</span>
  </div>
</div>

<!-- 유틸리티 클래스 활용 -->
<h1 class="text-4xl font-black text-gradient">그라디언트 텍스트</h1>
<div class="glass rounded-2xl p-6">글래스모피즘 카드</div>
```

---

## 7.7 @apply 디렉티브

`@apply`는 Tailwind 유틸리티 클래스를 CSS 규칙에 인라인으로 적용하는 방법입니다.

### 기본 사용법

```css
/* components.css */
.primary-button {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold
         px-6 py-3 rounded-xl transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500
         focus:ring-offset-2 active:scale-95;
}

.danger-button {
  @apply bg-red-600 hover:bg-red-700 text-white font-semibold
         px-6 py-3 rounded-xl transition-colors duration-200;
}
```

HTML에서 사용:

```html
<button class="primary-button">저장</button>
<button class="danger-button">삭제</button>
```

### 컴포넌트 변형 패턴

```css
/* @apply를 이용한 버튼 시스템 */
.btn-base {
  @apply inline-flex items-center justify-center gap-2
         font-semibold rounded-lg transition-all duration-200
         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed
         active:scale-[0.98];
}

/* 크기 변형 */
.btn-xs  { @apply btn-base text-xs px-2.5 py-1.5; }
.btn-sm  { @apply btn-base text-sm px-3 py-2; }
.btn-md  { @apply btn-base text-sm px-4 py-2.5; }
.btn-lg  { @apply btn-base text-base px-5 py-3; }
.btn-xl  { @apply btn-base text-base px-7 py-3.5; }

/* 색상 변형 */
.btn-blue   { @apply bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500; }
.btn-green  { @apply bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500; }
.btn-red    { @apply bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500; }
.btn-gray   { @apply bg-gray-100 hover:bg-gray-200 text-gray-900 focus-visible:ring-gray-400; }
```

> **참고**: `@apply`를 과도하게 사용하면 Tailwind의 핵심 장점(HTML에서 모든 스타일을 직접 볼 수 있음)이 감소합니다.
> 진짜 재사용되는 컴포넌트에만 `@apply`를 사용하고, 일반적인 경우에는 HTML에 직접 클래스를 나열하는 것을 권장합니다.

---

## 7.8 @tailwindcss/typography 플러그인

`@tailwindcss/typography` 플러그인은 마크다운이나 CMS에서 온 HTML 콘텐츠에 아름다운 타이포그래피 스타일을 적용합니다.

### 설치

```bash
npm install -D @tailwindcss/typography
```

### 설정

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### 기본 사용법

`prose` 클래스를 컨테이너에 추가합니다:

```html
<article class="prose prose-lg max-w-none">
  <h1>마크다운 스타일 제목</h1>
  <p>자동으로 아름답게 스타일링된 본문 텍스트입니다. 링크, 목록, 코드 블록 등을 포함합니다.</p>
  <h2>서브 제목</h2>
  <ul>
    <li>목록 아이템 1</li>
    <li>목록 아이템 2</li>
    <li>목록 아이템 3</li>
  </ul>
  <pre><code>const hello = "world";</code></pre>
  <blockquote>
    인용문 텍스트입니다.
  </blockquote>
</article>
```

### prose 크기 변형

| 클래스 | 설명 |
|---|---|
| `prose-sm` | 작은 크기 (font-size: 0.875rem) |
| `prose` | 기본 크기 (font-size: 1rem) |
| `prose-base` | 기본 크기 (font-size: 1rem) |
| `prose-lg` | 큰 크기 (font-size: 1.125rem) |
| `prose-xl` | 더 큰 크기 (font-size: 1.25rem) |
| `prose-2xl` | 가장 큰 크기 (font-size: 1.5rem) |

### 다크모드에서의 prose

```html
<article class="prose dark:prose-invert prose-lg">
  <!-- 다크모드에서 색상이 자동으로 반전됨 -->
</article>
```

### 커스텀 prose 색상

```html
<!-- 파란색 테마 prose -->
<article class="prose prose-blue">...</article>

<!-- 링크 색상만 커스텀 -->
<article class="prose prose-a:text-indigo-600 prose-a:no-underline
                hover:prose-a:underline">
  <!-- 인라인 변형으로 prose 요소별 커스텀 -->
</article>
```

### tailwind.config.js에서 prose 커스텀

```js
module.exports = {
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
            'h1, h2, h3': {
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

---

## 7.9 @tailwindcss/forms 플러그인

`@tailwindcss/forms` 플러그인은 폼 요소에 일관된 기본 스타일을 적용합니다.
브라우저별로 다른 기본 폼 스타일을 정규화합니다.

### 설치

```bash
npm install -D @tailwindcss/forms
```

### 설정

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    // 또는 전략 지정
    require('@tailwindcss/forms')({
      strategy: 'class', // 'base' 또는 'class'
    }),
  ],
};
```

**전략 종류:**
- `base` (기본값): 모든 폼 요소에 기본 스타일 적용 (글로벌 리셋)
- `class`: `form-input`, `form-select` 등의 클래스를 사용할 때만 적용

### 기본 사용법 (base 전략)

```html
<!-- 플러그인이 자동으로 기본 스타일 적용 -->
<form class="space-y-4 max-w-md">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
    <input
      type="text"
      class="w-full rounded-lg border-gray-300 shadow-sm
             focus:border-blue-500 focus:ring focus:ring-blue-500/20"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
    <input
      type="email"
      class="w-full rounded-lg border-gray-300 shadow-sm
             focus:border-blue-500 focus:ring focus:ring-blue-500/20"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">직업</label>
    <select
      class="w-full rounded-lg border-gray-300 shadow-sm
             focus:border-blue-500 focus:ring focus:ring-blue-500/20"
    >
      <option>개발자</option>
      <option>디자이너</option>
      <option>기획자</option>
    </select>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">메시지</label>
    <textarea
      rows="4"
      class="w-full rounded-lg border-gray-300 shadow-sm
             focus:border-blue-500 focus:ring focus:ring-blue-500/20"
    ></textarea>
  </div>

  <div class="flex items-center gap-2">
    <input
      type="checkbox"
      class="rounded border-gray-300 text-blue-600
             focus:ring focus:ring-blue-500/20"
    />
    <label class="text-sm text-gray-700">이용약관에 동의합니다</label>
  </div>
</form>
```

---

## 7.10 @tailwindcss/aspect-ratio 플러그인

`@tailwindcss/aspect-ratio` 플러그인은 종횡비(aspect ratio) 유틸리티를 추가합니다.

> **참고**: Tailwind CSS v3부터 `aspect-ratio` 유틸리티가 기본 내장되어 있습니다 (`aspect-video`, `aspect-square`, `aspect-[4/3]`). 이 플러그인은 구버전 브라우저 지원이 필요한 경우 사용합니다.

### 설치

```bash
npm install -D @tailwindcss/aspect-ratio
```

### 기본 내장 aspect-ratio (Tailwind v3)

```html
<!-- 16:9 비율 (유튜브 영상 등) -->
<div class="aspect-video">
  <iframe src="..." class="w-full h-full"></iframe>
</div>

<!-- 1:1 정사각형 -->
<div class="aspect-square">
  <img src="avatar.jpg" class="w-full h-full object-cover rounded-full" />
</div>

<!-- 임의 비율 -->
<div class="aspect-[4/3]">
  <img src="image.jpg" class="w-full h-full object-cover" />
</div>

<!-- 반응형 aspect ratio -->
<div class="aspect-square md:aspect-video lg:aspect-[21/9]">
  <img src="hero.jpg" class="w-full h-full object-cover" />
</div>
```

---

## 7.11 JIT 모드 및 임의값 (Arbitrary Values)

Tailwind CSS v3부터 JIT(Just-In-Time) 컴파일러가 기본으로 사용됩니다.
JIT는 HTML에서 사용된 클래스만 실시간으로 생성하므로 빌드 속도가 빠르고 CSS 파일이 작습니다.

### JIT의 장점

1. **빠른 빌드**: 사용된 클래스만 생성
2. **모든 변형 지원**: 어떤 변형 조합도 사용 가능 (예: `hover:lg:dark:focus:text-blue-500`)
3. **임의값 지원**: `[value]` 구문으로 어떤 값이든 사용 가능

### 임의값 (Arbitrary Values)

디자인 요구사항에 딱 맞는 임의의 값을 사용할 때 대괄호 `[value]` 구문을 사용합니다.

```html
<!-- 임의의 크기 -->
<div class="w-[37px] h-[42px]">
  특정 픽셀 크기
</div>

<!-- 임의의 색상 -->
<p class="text-[#1da1f2]">트위터 파란색 텍스트</p>
<div class="bg-[#ff6b6b]">커스텀 배경색</div>

<!-- 임의의 폰트 크기 -->
<h1 class="text-[2.5rem]">임의 폰트 크기</h1>

<!-- 임의의 spacing -->
<div class="mt-[72px] pb-[100px]">임의의 여백</div>

<!-- 임의의 border-radius -->
<div class="rounded-[20px]">임의의 모서리 둥글기</div>

<!-- 임의의 grid columns -->
<div class="grid grid-cols-[1fr_2fr_1fr]">
  <div>1fr</div>
  <div>2fr</div>
  <div>1fr</div>
</div>

<!-- CSS 변수 참조 -->
<div class="bg-[var(--primary-color)]">CSS 변수 참조</div>

<!-- calc() 사용 -->
<div class="w-[calc(100%-2rem)]">calc 값</div>

<!-- min/max 값 -->
<div class="w-[min(100%,800px)]">min 함수</div>
```

### 임의값과 변형 조합

```html
<!-- 임의값 + hover 변형 -->
<div class="bg-[#1a1a2e] hover:bg-[#16213e] transition-colors">
  임의색 호버 효과
</div>

<!-- 반응형 + 임의값 -->
<div class="w-full md:w-[480px] lg:w-[640px]">
  반응형 임의 너비
</div>

<!-- 다크모드 + 임의값 -->
<p class="text-[#2d3748] dark:text-[#e2e8f0]">
  다크모드 임의 색상
</p>
```

### 임의 속성 (Arbitrary Properties)

Tailwind에 없는 CSS 속성도 사용할 수 있습니다:

```html
<!-- 임의의 CSS 속성 -->
<div class="[mask-image:linear-gradient(to_bottom,black,transparent)]">
  마스크 이미지 적용
</div>

<div class="[clip-path:polygon(50%_0%,100%_100%,0%_100%)]">
  클리핑 패스 적용 (삼각형)
</div>

<p class="[text-indent:2rem]">
  텍스트 들여쓰기
</p>

<!-- CSS Grid 레이아웃 -->
<div class="grid [grid-template-areas:'header_header''sidebar_main''footer_footer']
            grid-cols-[200px_1fr]">
  <header class="[grid-area:header]">헤더</header>
  <aside class="[grid-area:sidebar]">사이드바</aside>
  <main class="[grid-area:main]">메인</main>
  <footer class="[grid-area:footer]">푸터</footer>
</div>
```

### safelist로 동적 클래스 보호

동적으로 생성되는 클래스는 Tailwind의 JIT 스캐너가 감지하지 못합니다.
`safelist`에 추가하거나 완전한 클래스 이름을 사용해야 합니다.

```js
// tailwind.config.js
module.exports = {
  safelist: [
    // 단순 목록
    'bg-red-500',
    'text-3xl',

    // 패턴 (정규표현식)
    {
      pattern: /bg-(red|green|blue)-(100|200|300|400|500)/,
      variants: ['hover', 'focus', 'dark'],
    },
    {
      pattern: /text-(sm|base|lg|xl|2xl)/,
    },
  ],
};
```

올바른 동적 클래스 사용:

```js
// 잘못된 방법 (Tailwind가 감지 불가)
const color = 'red';
const className = `bg-${color}-500`; // ❌

// 올바른 방법 (완전한 클래스 이름 사용)
const colorMap = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
};
const className = colorMap[color]; // ✅
```

---

## 7.12 종합 실습: 커스텀 디자인 시스템

커스터마이징 기능을 모두 활용한 프로젝트 예제입니다.

### tailwind.config.js 설정

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      // 커스텀 색상
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
          DEFAULT: '#0ea5e9',
        },
      },

      // 커스텀 폰트
      fontFamily: {
        sans:    ['Pretendard', ...defaultTheme.fontFamily.sans],
        heading: ['Pretendard', ...defaultTheme.fontFamily.sans],
        mono:    ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },

      // 커스텀 spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // 커스텀 border-radius
      borderRadius: {
        '4xl': '2rem',
      },

      // 커스텀 브레이크포인트
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

### global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply scroll-smooth; }
  body { @apply bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-sans antialiased; }
  h1   { @apply text-4xl font-bold tracking-tight; }
  h2   { @apply text-3xl font-semibold tracking-tight; }
  h3   { @apply text-2xl font-semibold; }
  a    { @apply text-brand-600 hover:text-brand-700 transition-colors; }
}

@layer components {
  .btn { @apply inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]; }
  .btn-sm { @apply btn px-3 py-1.5 text-sm; }
  .btn-md { @apply btn px-4 py-2.5 text-sm; }
  .btn-lg { @apply btn px-6 py-3 text-base; }
  .btn-primary   { @apply bg-brand-600 hover:bg-brand-700 text-white focus-visible:ring-brand-500; }
  .btn-secondary { @apply bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100; }

  .card { @apply bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm; }
  .input { @apply w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all; }
}

@layer utilities {
  .text-gradient { @apply bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent; }
  .glass { @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/50; }
}
```

### 사용 예제

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="output.css" />
  <title>커스텀 디자인 시스템</title>
</head>
<body>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">

    <!-- 헤딩 섹션 -->
    <section class="text-center mb-12">
      <h1 class="text-gradient text-5xl font-black mb-4">
        커스텀 디자인 시스템
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
        tailwind.config.js 커스터마이징으로 브랜드에 맞는 UI를 구축합니다.
      </p>
    </section>

    <!-- 버튼 그룹 -->
    <section class="card p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        버튼 컴포넌트
      </h2>
      <div class="flex flex-wrap gap-3">
        <button class="btn-lg btn-primary">기본 버튼</button>
        <button class="btn-lg btn-secondary">보조 버튼</button>
        <button class="btn-md btn-primary">중간 버튼</button>
        <button class="btn-sm btn-secondary">작은 버튼</button>
      </div>
    </section>

    <!-- 입력 필드 -->
    <section class="card p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        폼 컴포넌트
      </h2>
      <div class="space-y-3 max-w-sm">
        <input type="text" placeholder="이름" class="input" />
        <input type="email" placeholder="이메일" class="input" />
        <button class="btn-md btn-primary w-full">제출</button>
      </div>
    </section>

    <!-- 임의값 예제 -->
    <section class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        임의값 (Arbitrary Values) 사용
      </h2>
      <div class="flex flex-wrap gap-4">
        <div class="w-[120px] h-[80px] bg-[#1da1f2] rounded-[16px] flex items-center justify-center text-white font-bold text-sm">
          임의 크기
        </div>
        <div class="w-[120px] h-[80px] bg-[oklch(70%_0.2_250)] rounded-xl flex items-center justify-center text-white font-bold text-sm">
          oklch 색상
        </div>
        <div class="w-[calc(100%-248px)] min-w-[120px] h-[80px] bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center text-white font-bold text-sm">
          calc + 임의 그라디언트
        </div>
      </div>
    </section>

  </div>
</body>
</html>
```

---

## 7.13 요약

이번 챕터에서 다룬 주요 내용을 정리합니다:

| 주제 | 핵심 내용 |
|---|---|
| `tailwind.config.js` | `content`, `theme`, `plugins` 주요 섹션 구성 |
| `theme.extend` | 기본값 유지하며 추가 (권장) |
| `theme` 직접 수정 | 기본값 완전 대체 (주의 필요) |
| 커스텀 색상 | 팔레트 형식, CSS 변수 기반 동적 색상 |
| 커스텀 폰트 | `fontFamily` 확장, 시스템 폰트 폴백 |
| 커스텀 브레이크포인트 | `screens` 확장 (`xs`, `3xl` 등) |
| `@layer base` | HTML 기본 요소 스타일 |
| `@layer components` | 재사용 컴포넌트 클래스 정의 |
| `@layer utilities` | 커스텀 유틸리티 클래스 정의 |
| `@apply` | 유틸리티 클래스를 CSS 규칙으로 추출 |
| `@tailwindcss/typography` | `prose` 클래스로 아름다운 콘텐츠 스타일링 |
| `@tailwindcss/forms` | 폼 요소 정규화 및 스타일링 |
| `@tailwindcss/aspect-ratio` | 종횡비 유틸리티 |
| JIT 모드 | 실시간 컴파일, 사용된 클래스만 생성 |
| 임의값 | `[value]` 구문으로 어떤 값이든 사용 |
| 임의 속성 | `[property:value]` 구문으로 CSS 속성 직접 사용 |

이로써 Tailwind CSS의 핵심 기능을 모두 학습했습니다. 공식 문서(\url{https://tailwindcss.com/docs})를 참고하여 더 깊이 있는 내용을 학습하세요.
