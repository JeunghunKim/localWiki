# Chapter 1: Tailwind CSS 소개 및 설치

## 1.1 Tailwind CSS란 무엇인가?

Tailwind CSS는 **유틸리티 퍼스트(Utility-First)** CSS 프레임워크입니다. 2017년 Adam Wathan이 처음 공개한 이후 빠르게 성장하여, 현재 프론트엔드 개발 생태계에서 가장 인기 있는 CSS 도구 중 하나가 되었습니다.

전통적인 CSS 프레임워크(예: Bootstrap)는 미리 설계된 컴포넌트(버튼, 카드, 내비게이션 바 등)를 제공합니다. 개발자는 이 컴포넌트를 가져다 사용하면 됩니다. 반면 Tailwind CSS는 컴포넌트 대신 **저수준의 유틸리티 클래스**를 대량으로 제공하며, 개발자는 이 클래스들을 조합하여 원하는 디자인을 HTML 마크업 안에서 직접 만들어냅니다.

예를 들어, 파란 배경에 흰 글자를 가진 둥근 버튼을 만들고 싶다면:

```html
<!-- Tailwind CSS 방식 -->
<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
  클릭하세요
</button>
```

이처럼 별도의 CSS 파일을 작성하지 않고도 HTML 클래스만으로 완전한 스타일링이 가능합니다.

### Tailwind CSS의 핵심 특징

1. **유틸리티 퍼스트**: 각 클래스가 하나의 CSS 속성에 대응합니다.
2. **PurgeCSS 내장**: 실제로 사용된 클래스만 최종 빌드에 포함되어 CSS 파일 크기가 매우 작습니다.
3. **반응형 디자인 내장**: `sm:`, `md:`, `lg:` 등의 접두사로 브레이크포인트별 스타일을 쉽게 적용합니다.
4. **다크 모드 지원**: `dark:` 접두사로 다크 모드 스타일을 간편하게 정의합니다.
5. **커스터마이징 용이**: `tailwind.config.js`에서 색상, 폰트, 간격 등 모든 디자인 토큰을 커스터마이즈할 수 있습니다.
6. **JIT(Just-in-Time) 컴파일러**: 필요한 클래스를 실시간으로 생성하여 개발 속도를 높입니다.

---

## 1.2 기존 CSS 프레임워크와의 비교

### Bootstrap과 Tailwind CSS 비교

| 항목 | Bootstrap | Tailwind CSS |
|------|-----------|-------------|
| 접근 방식 | 컴포넌트 기반 | 유틸리티 기반 |
| 커스터마이징 | 제한적 (Sass 변수 오버라이드 필요) | 매우 유연 (config 파일 편집) |
| CSS 파일 크기 | 큰 편 (미사용 스타일 포함) | 작음 (사용된 클래스만 포함) |
| 학습 곡선 | 낮음 (컴포넌트 이름만 기억) | 중간 (유틸리티 클래스 숙지 필요) |
| 디자인 자유도 | 낮음 (Bootstrap 스타일에 종속) | 높음 (완전한 커스텀 디자인 가능) |
| HTML 가독성 | 높음 (짧은 클래스명) | 낮을 수 있음 (클래스가 길어짐) |
| 반응형 지원 | 그리드 시스템 기반 | 모든 유틸리티에 반응형 접두사 지원 |

### Bootstrap 방식 예시

```html
<!-- Bootstrap 방식 -->
<div class="card">
  <div class="card-body">
    <h5 class="card-title">카드 제목</h5>
    <p class="card-text">카드 내용입니다.</p>
    <a href="#" class="btn btn-primary">버튼</a>
  </div>
</div>
```

### Tailwind CSS 방식 예시

```html
<!-- Tailwind CSS 방식 -->
<div class="bg-white shadow-md rounded-lg p-6 max-w-sm">
  <h5 class="text-xl font-bold text-gray-800 mb-2">카드 제목</h5>
  <p class="text-gray-600 mb-4">카드 내용입니다.</p>
  <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">버튼</a>
</div>
```

Bootstrap 방식은 클래스가 짧고 직관적이지만, 실제 스타일이 어떻게 적용되는지 CSS를 알아야 파악할 수 있습니다. Tailwind CSS 방식은 클래스 이름 자체가 스타일을 설명하므로, HTML만 보고도 어떤 스타일이 적용되는지 즉시 알 수 있습니다.

### 다른 프레임워크와의 비교

- **Foundation**: Bootstrap과 유사한 컴포넌트 기반 프레임워크. 엔터프라이즈 환경에서 주로 사용.
- **Bulma**: Flexbox 기반 순수 CSS 프레임워크. JavaScript 없음.
- **Material UI**: Google Material Design 구현체. React 컴포넌트 라이브러리와 결합.
- **Tailwind CSS**: 순수 유틸리티 클래스. 어떤 JavaScript 프레임워크와도 자유롭게 결합 가능.

---

## 1.3 Utility-First CSS 철학

### "왜 클래스가 이렇게 많아야 하나요?"

Utility-First 접근 방식을 처음 접하면 HTML이 지저분해 보일 수 있습니다. `class="flex items-center justify-between p-4 bg-white shadow"` 같은 코드는 기존 CSS 개발자에게 낯설게 느껴집니다.

하지만 이 방식에는 강력한 장점이 있습니다.

### 전통적인 CSS의 문제점

1. **CSS 파일 비대화**: 프로젝트가 커질수록 CSS 파일이 계속 늘어나고 관리하기 어려워집니다.
2. **네이밍 어려움**: `.card-header-title-primary` 같은 클래스명을 만들어내는 것은 고통스럽습니다.
3. **글로벌 스코프 문제**: CSS는 기본적으로 전역이므로 한 곳에서의 변경이 예상치 못한 곳에 영향을 미칩니다.
4. **미사용 CSS 누적**: 오래된 컴포넌트의 CSS는 지우기 두렵습니다. 어디서 사용할지 모르기 때문입니다.

### Utility-First의 장점

1. **CSS 파일이 더 이상 늘어나지 않습니다**: 유틸리티 클래스는 재사용되므로 새 컴포넌트를 만들어도 CSS 양이 크게 증가하지 않습니다.
2. **안전하게 변경 가능**: HTML 클래스 변경은 해당 요소에만 영향을 미칩니다.
3. **컨텍스트 전환 없음**: HTML과 CSS를 왔다갔다 하지 않아도 됩니다.
4. **디자인 시스템 강제**: 정해진 스케일(4px, 8px, 16px...)에서만 값을 고르므로 일관된 디자인이 자연스럽게 유지됩니다.

### 컴포넌트 추상화

클래스가 너무 길어진다고 걱정된다면, 컴포넌트로 추상화하면 됩니다.

**React/Vue 컴포넌트 예시:**

```html
<!-- Button.jsx -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  {{ label }}
</button>
```

**Tailwind의 @apply 지시어 사용:**

```html
<!-- CSS 파일 -->
<style>
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
</style>

<!-- HTML -->
<button class="btn-primary">클릭</button>
```

---

## 1.4 설치 방법

Tailwind CSS를 프로젝트에 추가하는 방법은 크게 세 가지입니다. 각 방법의 장단점을 이해하고 상황에 맞는 방법을 선택하세요.

### 방법 1: CDN을 이용한 빠른 시작 (Play CDN)

학습이나 프로토타입 개발에 적합합니다. 빌드 과정 없이 바로 사용할 수 있습니다.

> **주의**: CDN 방식은 프로덕션 환경에는 권장하지 않습니다. 파일 크기가 크고 커스터마이징에 제한이 있습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS CDN 예제</title>
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
  <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">안녕하세요!</h1>
    <p class="text-gray-600 mb-6">Tailwind CSS CDN으로 빠르게 시작했습니다.</p>
    <button class="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
      시작하기
    </button>
  </div>
</body>
</html>
```

CDN을 사용할 때 `<script>` 태그 안에서 설정을 커스터마이즈할 수도 있습니다:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: '#ff6b6b',
        }
      }
    }
  }
</script>
```

### 방법 2: npm + PostCSS를 이용한 설치 (권장)

실제 프로젝트에서 사용하는 표준 방식입니다.

#### 2-1. 프로젝트 초기화 및 패키지 설치

```bash
# 새 프로젝트 폴더 생성
mkdir my-tailwind-project
cd my-tailwind-project

# npm 초기화
npm init -y

# Tailwind CSS, PostCSS, Autoprefixer 설치
npm install -D tailwindcss postcss autoprefixer

# tailwind.config.js 및 postcss.config.js 생성
npx tailwindcss init -p
```

#### 2-2. tailwind.config.js 설정

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: Tailwind가 클래스를 스캔할 파일 경로 지정
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,vue}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      // 기본 테마를 확장합니다
    },
  },
  plugins: [],
}
```

#### 2-3. CSS 파일 생성

`src/input.css` 파일을 생성하고 Tailwind 지시어를 추가합니다:

```css
/* src/input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 2-4. 빌드 명령어 설정

`package.json`에 빌드 스크립트를 추가합니다:

```json
{
  "scripts": {
    "build": "tailwindcss -i ./src/input.css -o ./dist/output.css --minify",
    "dev": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch"
  }
}
```

#### 2-5. HTML에서 빌드된 CSS 사용

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tailwind Project</title>
  <link rel="stylesheet" href="/dist/output.css">
</head>
<body>
  <h1 class="text-3xl font-bold text-blue-600">Hello Tailwind!</h1>
</body>
</html>
```

### 방법 3: Vite와 함께 설치

최신 프론트엔드 개발 환경에서 많이 사용하는 방식입니다.

```bash
# Vite 프로젝트 생성
npm create vite@latest my-vite-app -- --template vanilla

cd my-vite-app
npm install

# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js` 수정:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`src/style.css` 수정:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 1.5 tailwind.config.js 기본 설정

`tailwind.config.js`는 Tailwind CSS의 핵심 설정 파일입니다. 이 파일에서 색상, 폰트, 간격, 반응형 브레이크포인트 등 모든 디자인 토큰을 커스터마이즈할 수 있습니다.

### 기본 구조

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. content: 클래스 스캔 경로
  content: ["./src/**/*.{html,js}"],

  // 2. darkMode: 다크 모드 전략
  darkMode: 'class', // 또는 'media'

  // 3. theme: 디자인 토큰 설정
  theme: {
    // screens: 반응형 브레이크포인트
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    // extend: 기본 테마를 유지하면서 확장
    extend: {
      // 커스텀 색상 추가
      colors: {
        'brand-primary': '#4F46E5',
        'brand-secondary': '#7C3AED',
        'custom-gray': {
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
        }
      },

      // 커스텀 폰트 패밀리
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },

      // 커스텀 간격
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      // 커스텀 보더 반지름
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },

      // 커스텀 박스 섀도우
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.15)',
      },

      // 커스텀 애니메이션
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
    },
  },

  // 4. plugins: 추가 플러그인
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### theme vs theme.extend

- `theme`: 기본 테마 전체를 **덮어씁니다**. 기존 값이 모두 사라집니다.
- `theme.extend`: 기본 테마를 유지하면서 **추가/확장**합니다. 대부분의 경우 `extend`를 사용하세요.

```javascript
// 잘못된 예: theme.colors를 직접 설정하면 기본 색상이 모두 사라짐
theme: {
  colors: {
    'brand': '#4F46E5', // gray, blue, red 등 기본 색상이 모두 사라짐!
  }
}

// 올바른 예: extend를 사용하여 기본 색상을 유지하면서 추가
theme: {
  extend: {
    colors: {
      'brand': '#4F46E5', // 기본 색상은 그대로 유지
    }
  }
}
```

---

## 1.6 첫 번째 예제

설치가 완료되었으면 실제 컴포넌트를 만들어 봅시다.

### 예제 1: 다양한 버튼 스타일

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS 버튼 예제</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen p-8">
  <h1 class="text-2xl font-bold text-gray-800 mb-6">버튼 컴포넌트</h1>

  <div class="flex flex-wrap gap-4 mb-8">
    <!-- 기본 버튼 -->
    <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
      기본 버튼
    </button>

    <!-- 아웃라인 버튼 -->
    <button class="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
      아웃라인 버튼
    </button>

    <!-- 위험 버튼 -->
    <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
      삭제
    </button>

    <!-- 성공 버튼 -->
    <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
      확인
    </button>

    <!-- 비활성화 버튼 -->
    <button class="bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed" disabled>
      비활성화
    </button>

    <!-- 크기 변형: 작은 버튼 -->
    <button class="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-1 px-3 rounded transition-colors duration-200">
      작은 버튼
    </button>

    <!-- 크기 변형: 큰 버튼 -->
    <button class="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
      큰 버튼
    </button>

    <!-- 아이콘 버튼 -->
    <button class="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
      </svg>
      업로드
    </button>
  </div>
</body>
</html>
```

### 예제 2: 카드 컴포넌트

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS 카드 예제</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
  <h1 class="text-2xl font-bold text-gray-800 mb-6">카드 컴포넌트</h1>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">

    <!-- 기본 카드 -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div class="h-48 bg-gradient-to-br from-blue-400 to-indigo-600"></div>
      <div class="p-6">
        <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">카테고리</span>
        <h2 class="text-xl font-bold text-gray-900 mt-1 mb-2">카드 제목</h2>
        <p class="text-gray-500 text-sm leading-relaxed">
          카드의 내용을 여기에 작성합니다. Tailwind CSS로 쉽게 스타일링할 수 있습니다.
        </p>
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 text-xs font-bold">AB</span>
            </div>
            <span class="text-gray-700 text-sm font-medium">작성자</span>
          </div>
          <span class="text-gray-400 text-xs">2024.01.01</span>
        </div>
      </div>
    </div>

    <!-- 가격 카드 -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-green-500">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-1">스탠다드 플랜</h2>
        <div class="flex items-baseline gap-1 mb-4">
          <span class="text-4xl font-extrabold text-gray-900">₩29,000</span>
          <span class="text-gray-500">/월</span>
        </div>
        <ul class="space-y-2 mb-6">
          <li class="flex items-center gap-2 text-gray-600 text-sm">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            기능 1 사용 가능
          </li>
          <li class="flex items-center gap-2 text-gray-600 text-sm">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            기능 2 사용 가능
          </li>
          <li class="flex items-center gap-2 text-gray-400 text-sm">
            <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            프리미엄 기능 불가
          </li>
        </ul>
        <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          시작하기
        </button>
      </div>
    </div>

    <!-- 알림 카드 -->
    <div class="space-y-3">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-blue-800">정보</h3>
          <p class="text-sm text-blue-700 mt-1">이것은 정보 알림입니다.</p>
        </div>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-yellow-800">경고</h3>
          <p class="text-sm text-yellow-700 mt-1">이것은 경고 알림입니다.</p>
        </div>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-red-800">오류</h3>
          <p class="text-sm text-red-700 mt-1">이것은 오류 알림입니다.</p>
        </div>
      </div>
    </div>

  </div>
</body>
</html>
```

### 예제 3: 로그인 폼

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>로그인 폼</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">로그인</h2>
      <p class="text-gray-500 text-sm mt-1">계정에 로그인하세요</p>
    </div>

    <form class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@email.com"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        >
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="w-4 h-4 text-indigo-600 rounded border-gray-300">
          <span class="text-sm text-gray-600">로그인 상태 유지</span>
        </label>
        <a href="#" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          비밀번호 찾기
        </a>
      </div>

      <button
        type="submit"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        로그인
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      계정이 없으신가요?
      <a href="#" class="text-indigo-600 hover:text-indigo-700 font-semibold">회원가입</a>
    </p>
  </div>
</body>
</html>
```

---

## 1.7 Tailwind CSS 핵심 개념 정리

### 유틸리티 클래스 네이밍 패턴

Tailwind CSS의 클래스명은 일관된 패턴을 따르므로, 패턴을 이해하면 문서 없이도 클래스명을 유추할 수 있습니다.

| 패턴 | 예시 | 설명 |
|------|------|------|
| `속성-값` | `text-lg`, `bg-red-500` | 기본 패턴 |
| `속성-방향-값` | `pt-4`, `mx-auto`, `border-t-2` | 방향 포함 |
| `접두사:클래스` | `hover:bg-blue-600`, `sm:text-xl` | 상태/반응형 변형 |

### 자주 사용하는 숫자 스케일

Tailwind CSS의 기본 스케일은 4px 기반입니다:

- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `4` = 1rem (16px)
- `8` = 2rem (32px)
- `16` = 4rem (64px)

### 개발 도구 추천

- **VS Code 확장 프로그램**: [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - 클래스 자동완성, 미리보기, 오류 감지 기능 제공
- **Tailwind CSS Playground**: [https://play.tailwindcss.com](https://play.tailwindcss.com)
  - 설치 없이 브라우저에서 바로 실습 가능

---

## 1.8 정리

이번 챕터에서 배운 내용을 정리합니다:

1. **Tailwind CSS**는 유틸리티 퍼스트 CSS 프레임워크로, 저수준 클래스를 조합해 디자인을 만듭니다.
2. **Bootstrap과의 차이**: Bootstrap은 미리 만들어진 컴포넌트를 제공하고, Tailwind는 유틸리티 클래스를 조합해 직접 만듭니다.
3. **Utility-First 철학**: CSS 파일 비대화, 네이밍 문제, 글로벌 스코프 문제를 해결합니다.
4. **설치**: CDN(빠른 프로토타입), npm+PostCSS(실제 프로젝트), Vite 통합 등 다양한 방법을 지원합니다.
5. **tailwind.config.js**: 색상, 폰트, 간격 등 모든 디자인 토큰을 커스터마이즈할 수 있습니다.

다음 챕터에서는 Tailwind CSS의 핵심인 **기본 유틸리티 클래스**들을 체계적으로 학습합니다.
