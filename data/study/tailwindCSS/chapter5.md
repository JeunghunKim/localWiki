# Chapter 5: 타이포그래피 및 색상

Tailwind CSS는 텍스트와 색상을 세밀하게 제어할 수 있는 풍부한 유틸리티 클래스를 제공합니다.
이 챕터에서는 폰트 패밀리부터 색상 팔레트, 다크모드까지 타이포그래피와 색상 관련 기능을 상세히 다룹니다.

---

## 5.1 폰트 패밀리

Tailwind CSS는 세 가지 기본 폰트 패밀리 유틸리티를 제공합니다.

| 클래스 | CSS 속성 |
|---|---|
| `font-sans` | `font-family: ui-sans-serif, system-ui, -apple-system, ...` |
| `font-serif` | `font-family: ui-serif, Georgia, Cambria, ...` |
| `font-mono` | `font-family: ui-monospace, SFMono-Regular, Menlo, ...` |

### 실습 예제

```html
<p class="font-sans text-lg">산세리프(Sans-serif) 폰트로 표시됩니다.</p>
<p class="font-serif text-lg">세리프(Serif) 폰트로 표시됩니다.</p>
<p class="font-mono text-lg">모노스페이스(Mono) 폰트로 표시됩니다.</p>
```

- `font-sans`는 UI에 가장 적합한 시스템 폰트를 사용합니다.
- `font-serif`는 본문 기사나 문서에 적합합니다.
- `font-mono`는 코드 스니펫이나 터미널 텍스트에 사용합니다.

---

## 5.2 텍스트 크기

Tailwind는 다양한 텍스트 크기 클래스를 제공합니다. `text-{size}` 형식으로 사용합니다.

| 클래스 | 폰트 크기 | 줄 높이 |
|---|---|---|
| `text-xs` | 0.75rem (12px) | 1rem |
| `text-sm` | 0.875rem (14px) | 1.25rem |
| `text-base` | 1rem (16px) | 1.5rem |
| `text-lg` | 1.125rem (18px) | 1.75rem |
| `text-xl` | 1.25rem (20px) | 1.75rem |
| `text-2xl` | 1.5rem (24px) | 2rem |
| `text-3xl` | 1.875rem (30px) | 2.25rem |
| `text-4xl` | 2.25rem (36px) | 2.5rem |
| `text-5xl` | 3rem (48px) | 1 |
| `text-6xl` | 3.75rem (60px) | 1 |
| `text-7xl` | 4.5rem (72px) | 1 |
| `text-8xl` | 6rem (96px) | 1 |
| `text-9xl` | 8rem (128px) | 1 |

### 실습 예제

```html
<div class="space-y-2">
  <p class="text-xs">text-xs: 아주 작은 텍스트 (12px)</p>
  <p class="text-sm">text-sm: 작은 텍스트 (14px)</p>
  <p class="text-base">text-base: 기본 텍스트 (16px)</p>
  <p class="text-lg">text-lg: 큰 텍스트 (18px)</p>
  <p class="text-xl">text-xl: 더 큰 텍스트 (20px)</p>
  <p class="text-2xl">text-2xl: 제목용 텍스트 (24px)</p>
  <p class="text-4xl">text-4xl: 큰 제목 (36px)</p>
  <p class="text-6xl">text-6xl: 영웅 텍스트 (60px)</p>
  <p class="text-9xl">text-9xl: 초대형 텍스트 (128px)</p>
</div>
```

반응형 텍스트 크기 예제:

```html
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">
  반응형 제목 텍스트
</h1>
```

---

## 5.3 폰트 굵기

`font-{weight}` 클래스를 사용하여 폰트 굵기를 제어합니다.

| 클래스 | CSS 값 |
|---|---|
| `font-thin` | 100 |
| `font-extralight` | 200 |
| `font-light` | 300 |
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |
| `font-extrabold` | 800 |
| `font-black` | 900 |

### 실습 예제

```html
<div class="space-y-1 text-xl">
  <p class="font-thin">font-thin (100): 가장 얇은 텍스트</p>
  <p class="font-extralight">font-extralight (200)</p>
  <p class="font-light">font-light (300): 얇은 텍스트</p>
  <p class="font-normal">font-normal (400): 기본 굵기</p>
  <p class="font-medium">font-medium (500): 중간 굵기</p>
  <p class="font-semibold">font-semibold (600): 세미볼드</p>
  <p class="font-bold">font-bold (700): 볼드</p>
  <p class="font-extrabold">font-extrabold (800): 엑스트라볼드</p>
  <p class="font-black">font-black (900): 가장 굵은 텍스트</p>
</div>
```

카드 컴포넌트에서의 활용:

```html
<div class="bg-white rounded-lg p-6 shadow">
  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">카테고리</p>
  <h2 class="text-2xl font-bold text-gray-900 mt-1">기사 제목</h2>
  <p class="text-base font-normal text-gray-600 mt-2">
    기사 본문 내용이 여기에 들어갑니다. 폰트 굵기를 통해 시각적 위계를 설정합니다.
  </p>
  <span class="text-sm font-semibold text-blue-600 mt-4 block">더 읽기 →</span>
</div>
```

---

## 5.4 줄 간격 (Line Height)

`leading-{size}` 클래스로 줄 간격을 조정합니다.

| 클래스 | CSS 값 | 설명 |
|---|---|---|
| `leading-none` | 1 | 줄 간격 없음 |
| `leading-tight` | 1.25 | 좁은 간격 |
| `leading-snug` | 1.375 | 약간 좁은 간격 |
| `leading-normal` | 1.5 | 기본 간격 |
| `leading-relaxed` | 1.625 | 약간 넓은 간격 |
| `leading-loose` | 2 | 넓은 간격 |
| `leading-3` ~ `leading-10` | 고정 rem 값 | 숫자 기반 간격 |

### 실습 예제

```html
<div class="grid grid-cols-2 gap-6">
  <div>
    <p class="text-sm text-gray-500 mb-1">leading-tight</p>
    <p class="leading-tight text-base bg-blue-50 p-3 rounded">
      좁은 줄 간격을 사용하면 텍스트가 밀집되어 보입니다.
      제목이나 간단한 레이블에 적합합니다.
    </p>
  </div>
  <div>
    <p class="text-sm text-gray-500 mb-1">leading-relaxed</p>
    <p class="leading-relaxed text-base bg-green-50 p-3 rounded">
      넓은 줄 간격을 사용하면 텍스트가 읽기 편해집니다.
      본문 텍스트에 적합합니다.
    </p>
  </div>
</div>
```

---

## 5.5 자간 (Letter Spacing)

`tracking-{size}` 클래스로 자간을 조정합니다.

| 클래스 | CSS 값 |
|---|---|
| `tracking-tighter` | -0.05em |
| `tracking-tight` | -0.025em |
| `tracking-normal` | 0em |
| `tracking-wide` | 0.025em |
| `tracking-wider` | 0.05em |
| `tracking-widest` | 0.1em |

### 실습 예제

```html
<div class="space-y-3">
  <p class="tracking-tighter text-xl">tracking-tighter: 자간이 매우 좁습니다</p>
  <p class="tracking-tight text-xl">tracking-tight: 자간이 좁습니다</p>
  <p class="tracking-normal text-xl">tracking-normal: 기본 자간입니다</p>
  <p class="tracking-wide text-xl">tracking-wide: 자간이 넓습니다</p>
  <p class="tracking-wider text-xl">tracking-wider: 자간이 더 넓습니다</p>
  <p class="tracking-widest text-xl">tracking-widest: 자간이 가장 넓습니다</p>
</div>

<!-- 실용적인 예: 버튼 레이블과 배지 -->
<button class="bg-blue-600 text-white px-6 py-2 rounded font-semibold tracking-wide uppercase text-sm">
  자간 넓은 버튼
</button>

<span class="text-xs font-bold tracking-widest uppercase text-gray-500">
  NEW ARRIVAL
</span>
```

---

## 5.6 텍스트 정렬

`text-{align}` 클래스로 텍스트 정렬을 설정합니다.

| 클래스 | CSS 속성 |
|---|---|
| `text-left` | `text-align: left` |
| `text-center` | `text-align: center` |
| `text-right` | `text-align: right` |
| `text-justify` | `text-align: justify` |
| `text-start` | `text-align: start` |
| `text-end` | `text-align: end` |

### 실습 예제

```html
<div class="space-y-4 max-w-md mx-auto">
  <p class="text-left bg-gray-100 p-3 rounded">
    text-left: 텍스트를 왼쪽으로 정렬합니다. 기본값입니다.
  </p>
  <p class="text-center bg-gray-100 p-3 rounded">
    text-center: 텍스트를 가운데로 정렬합니다.
  </p>
  <p class="text-right bg-gray-100 p-3 rounded">
    text-right: 텍스트를 오른쪽으로 정렬합니다.
  </p>
  <p class="text-justify bg-gray-100 p-3 rounded">
    text-justify: 텍스트를 양쪽 정렬합니다. 긴 문단에서 사용하면
    좌우 여백이 일정하게 맞춰집니다.
  </p>
</div>
```

---

## 5.7 텍스트 변환

`text-transform` 관련 유틸리티 클래스입니다.

| 클래스 | CSS 속성 |
|---|---|
| `uppercase` | `text-transform: uppercase` |
| `lowercase` | `text-transform: lowercase` |
| `capitalize` | `text-transform: capitalize` |
| `normal-case` | `text-transform: none` |

### 실습 예제

```html
<div class="space-y-2">
  <p class="uppercase text-blue-600 font-bold tracking-widest text-sm">
    uppercase: 모든 글자를 대문자로
  </p>
  <p class="lowercase text-red-600">
    LOWERCASE: 모든 글자를 소문자로 변환합니다
  </p>
  <p class="capitalize text-green-600">
    capitalize: 각 단어의 첫 글자를 대문자로
  </p>
  <p class="normal-case text-gray-600">
    normal-case: 기본 대소문자 유지
  </p>
</div>

<!-- 네비게이션 링크에서의 활용 -->
<nav class="flex gap-6">
  <a href="#" class="uppercase text-xs font-semibold tracking-wider text-gray-700 hover:text-blue-600">
    홈
  </a>
  <a href="#" class="uppercase text-xs font-semibold tracking-wider text-gray-700 hover:text-blue-600">
    서비스
  </a>
  <a href="#" class="uppercase text-xs font-semibold tracking-wider text-gray-700 hover:text-blue-600">
    연락처
  </a>
</nav>
```

---

## 5.8 텍스트 장식

텍스트에 밑줄이나 취소선을 추가하거나 제거합니다.

| 클래스 | CSS 속성 |
|---|---|
| `underline` | `text-decoration-line: underline` |
| `overline` | `text-decoration-line: overline` |
| `line-through` | `text-decoration-line: line-through` |
| `no-underline` | `text-decoration-line: none` |

추가적으로 장식 색상, 스타일, 두께, 오프셋도 제어할 수 있습니다:

| 클래스 예시 | 설명 |
|---|---|
| `decoration-blue-500` | 밑줄 색상 지정 |
| `decoration-wavy` | 물결 밑줄 |
| `decoration-dashed` | 점선 밑줄 |
| `decoration-2` | 밑줄 두께 2px |
| `underline-offset-4` | 밑줄 오프셋 |

### 실습 예제

```html
<div class="space-y-3 text-lg">
  <p class="underline">기본 밑줄 텍스트</p>
  <p class="underline decoration-blue-500 decoration-2 underline-offset-4">
    파란색 두꺼운 밑줄 (오프셋 포함)
  </p>
  <p class="underline decoration-wavy decoration-red-500">
    물결 모양 빨간 밑줄
  </p>
  <p class="line-through text-gray-400">취소선 텍스트</p>
  <p class="overline">윗줄 텍스트</p>
</div>

<!-- 쇼핑몰 가격 표시 -->
<div class="flex items-center gap-3">
  <span class="text-2xl font-bold text-red-600">₩39,000</span>
  <span class="text-lg text-gray-400 line-through">₩59,000</span>
  <span class="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
    34% 할인
  </span>
</div>
```

---

## 5.9 Tailwind 색상 팔레트 시스템

Tailwind CSS v3는 22개의 색상과 각 색상마다 11단계(50~950)의 음영을 제공합니다.

### 색상 목록

| 색상 이름 | 설명 |
|---|---|
| `slate` | 슬레이트 회색 (파란빛) |
| `gray` | 일반 회색 |
| `zinc` | 아연 회색 |
| `neutral` | 중립 회색 |
| `stone` | 돌 회색 (갈색빛) |
| `red` | 빨강 |
| `orange` | 주황 |
| `amber` | 호박색 |
| `yellow` | 노랑 |
| `lime` | 라임 |
| `green` | 초록 |
| `emerald` | 에메랄드 |
| `teal` | 청록 |
| `cyan` | 시안 |
| `sky` | 하늘색 |
| `blue` | 파랑 |
| `indigo` | 남색 |
| `violet` | 보라 |
| `purple` | 자주 |
| `fuchsia` | 자홍 |
| `pink` | 분홍 |
| `rose` | 장미색 |

### 색상 음영 단계

각 색상은 다음 음영을 가집니다:

| 숫자 | 설명 |
|---|---|
| 50 | 가장 밝은 색상 (거의 흰색) |
| 100 | 매우 밝은 색상 |
| 200 | 밝은 색상 |
| 300 | 중간 밝은 색상 |
| 400 | 중간 색상 |
| 500 | 기본 색상 |
| 600 | 약간 어두운 색상 |
| 700 | 어두운 색상 |
| 800 | 매우 어두운 색상 |
| 900 | 가장 어두운 색상 |
| 950 | 극도로 어두운 색상 |

### 색상 적용 방법

색상은 `{property}-{color}-{shade}` 형식으로 사용합니다:

| 프리픽스 | 적용 대상 |
|---|---|
| `text-` | 텍스트 색상 |
| `bg-` | 배경 색상 |
| `border-` | 테두리 색상 |
| `ring-` | 링(focus ring) 색상 |
| `divide-` | 구분선 색상 |
| `placeholder-` | 플레이스홀더 색상 |
| `shadow-` | 그림자 색상 |
| `accent-` | 강조 색상 |

### 실습 예제: 색상 팔레트 쇼케이스

```html
<!-- 파란색 팔레트 예시 -->
<div class="grid grid-cols-11 gap-1">
  <div class="bg-blue-50 h-12 rounded"></div>
  <div class="bg-blue-100 h-12 rounded"></div>
  <div class="bg-blue-200 h-12 rounded"></div>
  <div class="bg-blue-300 h-12 rounded"></div>
  <div class="bg-blue-400 h-12 rounded"></div>
  <div class="bg-blue-500 h-12 rounded"></div>
  <div class="bg-blue-600 h-12 rounded"></div>
  <div class="bg-blue-700 h-12 rounded"></div>
  <div class="bg-blue-800 h-12 rounded"></div>
  <div class="bg-blue-900 h-12 rounded"></div>
  <div class="bg-blue-950 h-12 rounded"></div>
</div>

<!-- 알림 컴포넌트 (여러 색상 활용) -->
<div class="space-y-3">
  <!-- 정보 알림 -->
  <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-3">
    <span class="text-blue-500 font-bold">ℹ</span>
    <p>이것은 정보 알림입니다.</p>
  </div>

  <!-- 성공 알림 -->
  <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-3">
    <span class="text-green-500 font-bold">✓</span>
    <p>작업이 성공적으로 완료되었습니다.</p>
  </div>

  <!-- 경고 알림 -->
  <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-3">
    <span class="text-yellow-500 font-bold">⚠</span>
    <p>주의가 필요한 항목이 있습니다.</p>
  </div>

  <!-- 오류 알림 -->
  <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3">
    <span class="text-red-500 font-bold">✕</span>
    <p>오류가 발생했습니다. 다시 시도해주세요.</p>
  </div>
</div>
```

### 실습 예제: 버튼 색상 변형

```html
<div class="flex flex-wrap gap-3">
  <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
    기본 파랑
  </button>
  <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
    에메랄드
  </button>
  <button class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
    바이올렛
  </button>
  <button class="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
    로즈
  </button>
  <button class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
    앰버
  </button>
</div>
```

---

## 5.10 불투명도 (Opacity)

Tailwind는 불투명도를 다양한 방식으로 제어할 수 있습니다.

### 전체 요소 불투명도

`opacity-{amount}` 클래스로 요소 전체의 불투명도를 설정합니다.

| 클래스 | CSS 값 |
|---|---|
| `opacity-0` | opacity: 0 |
| `opacity-5` | opacity: 0.05 |
| `opacity-10` | opacity: 0.1 |
| `opacity-20` | opacity: 0.2 |
| `opacity-25` | opacity: 0.25 |
| `opacity-30` | opacity: 0.3 |
| `opacity-40` | opacity: 0.4 |
| `opacity-50` | opacity: 0.5 |
| `opacity-60` | opacity: 0.6 |
| `opacity-70` | opacity: 0.7 |
| `opacity-75` | opacity: 0.75 |
| `opacity-80` | opacity: 0.8 |
| `opacity-90` | opacity: 0.9 |
| `opacity-95` | opacity: 0.95 |
| `opacity-100` | opacity: 1 |

### 색상별 불투명도 슬래시 구문

Tailwind v3부터는 색상 값에 슬래시(`/`)를 사용하여 불투명도를 직접 지정할 수 있습니다:

```html
<!-- 배경 불투명도 -->
<div class="bg-blue-500/20">20% 불투명도의 파란 배경</div>
<div class="bg-blue-500/50">50% 불투명도의 파란 배경</div>
<div class="bg-blue-500/75">75% 불투명도의 파란 배경</div>

<!-- 텍스트 불투명도 -->
<p class="text-black/60">60% 불투명도의 검은 텍스트</p>

<!-- 테두리 불투명도 -->
<div class="border-2 border-blue-500/40">40% 불투명도의 파란 테두리</div>

<!-- 링 불투명도 -->
<button class="ring-2 ring-blue-500/30 focus:ring-blue-500">포커스 링</button>
```

### 실습 예제: 이미지 오버레이

```html
<div class="relative w-full h-64 rounded-xl overflow-hidden">
  <img
    src="https://source.unsplash.com/random/800x400"
    class="w-full h-full object-cover"
    alt="배경 이미지"
  />
  <!-- 그라디언트 오버레이 -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
  <!-- 텍스트 -->
  <div class="absolute bottom-0 left-0 p-6">
    <h2 class="text-white text-2xl font-bold">카드 제목</h2>
    <p class="text-white/75 text-sm mt-1">카드 설명 텍스트입니다.</p>
  </div>
</div>
```

---

## 5.11 다크모드

Tailwind CSS는 `dark:` 변형을 사용하여 다크모드를 지원합니다.

### 다크모드 설정 방법

`tailwind.config.js`에서 다크모드 전략을 설정합니다:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 'media' 또는 'class'
  // ...
}
```

**두 가지 전략:**

1. **`media`** (기본값): 사용자의 시스템 설정(`prefers-color-scheme`)에 따라 자동으로 다크모드 적용
2. **`class`**: HTML 요소에 `dark` 클래스가 있을 때 다크모드 적용 (수동 제어 가능)

### Class 전략 사용 예제

```html
<!-- HTML에 dark 클래스 추가/제거로 제어 -->
<html class="dark">
  <body class="bg-white dark:bg-gray-900">
    <h1 class="text-gray-900 dark:text-white">제목</h1>
    <p class="text-gray-600 dark:text-gray-300">본문 텍스트</p>
  </body>
</html>
```

JavaScript로 다크모드 토글:

```js
// 다크모드 토글
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};

// 사용자 설정 저장
if (localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

### 실습 예제: 다크모드 지원 카드

```html
<!-- tailwind.config.js에서 darkMode: 'class' 설정 필요 -->
<div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
  <!-- 다크모드 토글 버튼 -->
  <div class="flex justify-end p-4">
    <button
      onclick="document.documentElement.classList.toggle('dark')"
      class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
             rounded-full px-4 py-2 text-sm font-medium transition-colors"
    >
      🌙 다크모드 토글
    </button>
  </div>

  <!-- 카드 컴포넌트 -->
  <div class="max-w-md mx-auto mt-8">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          A
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">사용자 이름</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">@username</p>
        </div>
      </div>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        다크모드를 지원하는 카드 컴포넌트입니다.
        dark: 접두사를 사용하면 간편하게 다크모드 스타일을 추가할 수 있습니다.
      </p>
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
        <span class="text-sm text-gray-500 dark:text-gray-400">2시간 전</span>
        <button class="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
          자세히 보기
        </button>
      </div>
    </div>
  </div>
</div>
```

### 다크모드 색상 조합 권장 사항

```html
<!-- 배경색 계층 구조 -->
<div class="bg-gray-50 dark:bg-gray-950">           <!-- 최외곽 배경 -->
  <div class="bg-white dark:bg-gray-900">            <!-- 페이지 배경 -->
    <div class="bg-gray-100 dark:bg-gray-800">       <!-- 섹션 배경 -->
      <div class="bg-white dark:bg-gray-700">        <!-- 카드 배경 -->
        <!-- 텍스트 계층 구조 -->
        <h1 class="text-gray-900 dark:text-gray-50">    기본 제목</h1>
        <p class="text-gray-600 dark:text-gray-300">    본문 텍스트</p>
        <span class="text-gray-400 dark:text-gray-500"> 보조 텍스트</span>
      </div>
    </div>
  </div>
</div>
```

---

## 5.12 종합 실습: 뉴스레터 구독 섹션

앞서 배운 타이포그래피와 색상 유틸리티를 종합적으로 활용한 실습입니다.

```html
<!DOCTYPE html>
<html lang="ko" class="">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <title>뉴스레터 구독</title>
</head>
<body class="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-2xl w-full">

    <!-- 배지 -->
    <div class="flex justify-center mb-6">
      <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                   text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
        Newsletter
      </span>
    </div>

    <!-- 헤딩 -->
    <h1 class="text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white
               leading-tight mb-4">
      최신 소식을 놓치지<br/>
      <span class="text-blue-600 dark:text-blue-400">마세요</span>
    </h1>

    <!-- 설명 -->
    <p class="text-center text-lg text-gray-500 dark:text-gray-400 font-normal
              leading-relaxed max-w-lg mx-auto mb-8">
      매주 월요일, 개발 트렌드와 유용한 팁을 정리해서 보내드립니다.
      언제든지 구독 취소 가능합니다.
    </p>

    <!-- 구독 폼 -->
    <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
      <input
        type="email"
        placeholder="이메일 주소를 입력하세요"
        class="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base
               placeholder:text-gray-400 dark:placeholder:text-gray-500
               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
               transition-all"
      />
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold
               px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
      >
        구독하기
      </button>
    </form>

    <!-- 통계 -->
    <div class="flex justify-center gap-8 text-center">
      <div>
        <p class="text-2xl font-black text-gray-900 dark:text-white">12K+</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">구독자</p>
      </div>
      <div class="w-px bg-gray-200 dark:bg-gray-700"></div>
      <div>
        <p class="text-2xl font-black text-gray-900 dark:text-white">98%</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">만족도</p>
      </div>
      <div class="w-px bg-gray-200 dark:bg-gray-700"></div>
      <div>
        <p class="text-2xl font-black text-gray-900 dark:text-white">3년</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">발행 이력</p>
      </div>
    </div>

  </div>
</body>
</html>
```

---

## 5.13 요약

이번 챕터에서 다룬 주요 내용을 정리합니다:

| 카테고리 | 주요 클래스 |
|---|---|
| 폰트 패밀리 | `font-sans`, `font-serif`, `font-mono` |
| 텍스트 크기 | `text-xs` ~ `text-9xl` |
| 폰트 굵기 | `font-thin` ~ `font-black` |
| 줄 간격 | `leading-none` ~ `leading-loose` |
| 자간 | `tracking-tighter` ~ `tracking-widest` |
| 텍스트 정렬 | `text-left`, `text-center`, `text-right`, `text-justify` |
| 텍스트 변환 | `uppercase`, `lowercase`, `capitalize`, `normal-case` |
| 텍스트 장식 | `underline`, `line-through`, `no-underline` |
| 색상 | `text-{color}-{shade}`, `bg-{color}-{shade}` |
| 불투명도 | `opacity-*`, `bg-blue-500/50` (슬래시 구문) |
| 다크모드 | `dark:*` 변형 |

다음 챕터에서는 호버, 포커스, 애니메이션 등 상태 변형과 관련된 유틸리티를 학습합니다.
