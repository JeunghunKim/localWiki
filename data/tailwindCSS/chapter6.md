# Chapter 6: 상태 변형 및 애니메이션

Tailwind CSS는 CSS의 의사 클래스(pseudo-class)와 의사 요소(pseudo-element)를 유틸리티 클래스 앞에 붙이는 **변형(variant)** 방식으로 제공합니다.
이를 통해 사용자 인터랙션에 따른 스타일 변경, 트랜지션, 애니메이션을 간편하게 구현할 수 있습니다.

---

## 6.1 기본 상태 변형

### hover: 변형

마우스를 요소 위에 올렸을 때 스타일을 적용합니다.

```html
<!-- 배경색 호버 효과 -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  호버 버튼
</button>

<!-- 텍스트 색상 호버 -->
<a href="#" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
  호버 링크
</a>

<!-- 스케일 호버 -->
<div class="w-32 h-32 bg-emerald-500 rounded-xl hover:scale-110 transition-transform cursor-pointer">
</div>

<!-- 그림자 호버 -->
<div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow cursor-pointer">
  <h3 class="font-semibold text-gray-900">카드 제목</h3>
  <p class="text-gray-500 text-sm mt-1">마우스를 올리면 그림자가 깊어집니다.</p>
</div>
```

### focus: 변형

요소가 포커스를 받았을 때(키보드 탭, 클릭) 스타일을 적용합니다.

```html
<!-- 포커스 시 링 표시 -->
<input
  type="text"
  placeholder="이름 입력"
  class="border border-gray-300 rounded-lg px-3 py-2 text-sm
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
         transition-all"
/>

<!-- 포커스 시 배경색 변경 -->
<textarea
  class="w-full border border-gray-200 rounded-lg p-3 text-sm
         focus:outline-none focus:border-indigo-500 focus:bg-indigo-50
         transition-all resize-none"
  rows="3"
  placeholder="내용 입력..."
></textarea>
```

### active: 변형

요소를 클릭하거나 누를 때 스타일을 적용합니다.

```html
<!-- 클릭 시 스케일 축소 효과 -->
<button class="bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800
               text-white font-semibold px-6 py-3 rounded-xl transition-all">
  클릭하세요
</button>

<!-- 클릭 시 색상 변경 -->
<button class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
               text-white px-4 py-2 rounded-lg transition-colors">
  액션 버튼
</button>
```

### disabled: 변형

폼 요소가 비활성화 상태일 때 스타일을 적용합니다.

```html
<!-- 비활성화 버튼 -->
<button
  disabled
  class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold
         disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
>
  비활성화 버튼
</button>

<!-- 비활성화 입력 필드 -->
<input
  disabled
  type="text"
  value="읽기 전용"
  class="border border-gray-200 rounded-lg px-3 py-2 text-sm
         disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
/>
```

---

## 6.2 고급 포커스 변형

### focus-within: 변형

자식 요소가 포커스를 받았을 때 부모 요소에 스타일을 적용합니다.

```html
<!-- 검색창 컨테이너 포커스 효과 -->
<div class="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2
            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20
            transition-all bg-white">
  <svg class="w-4 h-4 text-gray-400 focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
  <input
    type="search"
    placeholder="검색..."
    class="flex-1 text-sm outline-none bg-transparent"
  />
</div>
```

### focus-visible: 변형

키보드 탐색 시에만 포커스 링을 표시합니다. 마우스 클릭으로 포커스된 경우에는 적용되지 않습니다.

```html
<!-- 접근성을 위한 키보드 포커스 링 -->
<button
  class="bg-blue-600 text-white px-4 py-2 rounded-lg
         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
>
  키보드 탐색 시 포커스 링 표시
</button>
```

---

## 6.3 의사 요소 변형

### before: 및 after: 변형

CSS `::before`와 `::after` 의사 요소에 스타일을 적용합니다.
`content-['']` 클래스로 `content` 속성을 설정해야 합니다.

```html
<!-- 필수 입력 표시 별표 -->
<label class="text-sm font-medium text-gray-700 flex items-center gap-1">
  이름
  <span class="text-red-500">*</span>
</label>

<!-- before/after로 장식 요소 추가 -->
<div class="relative before:content-[''] before:absolute before:top-0 before:left-0
            before:w-1 before:h-full before:bg-blue-500 before:rounded-full
            pl-4 py-2">
  <p class="text-gray-800 font-medium">인용문 제목</p>
  <p class="text-gray-500 text-sm">인용문 내용이 여기에 들어갑니다.</p>
</div>

<!-- 구분선 with before/after -->
<div class="flex items-center gap-3">
  <span class="flex-1 h-px bg-gray-200 before:content-none"></span>
  <span class="text-sm text-gray-400 font-medium">또는</span>
  <span class="flex-1 h-px bg-gray-200"></span>
</div>
```

### placeholder: 변형

입력 필드의 플레이스홀더 텍스트에 스타일을 적용합니다.

```html
<!-- 플레이스홀더 스타일링 -->
<input
  type="text"
  placeholder="이름을 입력하세요"
  class="border border-gray-200 rounded-lg px-4 py-2.5 text-base
         placeholder:text-gray-300 placeholder:font-light placeholder:italic
         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
/>

<!-- 다크모드에서의 플레이스홀더 -->
<input
  type="email"
  placeholder="이메일 주소"
  class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white
         border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2
         placeholder:text-gray-400 dark:placeholder:text-gray-500
         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
/>
```

---

## 6.4 group 및 group-hover: 패턴

`group` 클래스를 부모 요소에 추가하면, 자식 요소에서 `group-hover:`, `group-focus:` 등의 변형을 사용할 수 있습니다.

### 기본 group-hover 예제

```html
<!-- 카드 호버 시 자식 요소 스타일 변경 -->
<div class="group relative bg-white rounded-2xl overflow-hidden shadow-sm
            hover:shadow-xl transition-all duration-300 cursor-pointer">
  <!-- 이미지 영역 -->
  <div class="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
    <div class="w-full h-full flex items-center justify-center
                group-hover:scale-110 transition-transform duration-500">
      <span class="text-white text-5xl">🎨</span>
    </div>
  </div>
  <!-- 텍스트 영역 -->
  <div class="p-5">
    <h3 class="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
      디자인 프로젝트
    </h3>
    <p class="text-gray-500 text-sm mt-1 leading-relaxed">
      Tailwind CSS를 활용한 모던 UI 디자인
    </p>
    <!-- 호버 시에만 보이는 버튼 -->
    <div class="mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                transition-all duration-300">
      <button class="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg">
        자세히 보기
      </button>
    </div>
  </div>
</div>
```

### 복잡한 group 예제: 사이드바 메뉴

```html
<nav class="w-64 bg-gray-900 h-screen p-4 space-y-1">
  <a href="#"
     class="group flex items-center gap-3 px-3 py-2.5 rounded-xl
            hover:bg-gray-800 transition-colors">
    <!-- 아이콘 (호버 시 색상 변경) -->
    <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
    <!-- 텍스트 (호버 시 색상 변경) -->
    <span class="text-gray-400 group-hover:text-white text-sm font-medium transition-colors">
      대시보드
    </span>
    <!-- 화살표 (호버 시 표시) -->
    <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-400 ml-auto opacity-0
                group-hover:opacity-100 transition-all"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5l7 7-7 7"/>
    </svg>
  </a>
</nav>
```

### group-{modifier} 변형

그룹에 이름을 붙여 중첩된 그룹을 다룰 수 있습니다:

```html
<!-- 중첩 그룹: group/card와 group/button -->
<div class="group/card bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
  <h3 class="font-bold text-gray-900 group-hover/card:text-blue-600 transition-colors">
    카드 제목
  </h3>
  <div class="mt-4 flex gap-2">
    <button class="group/button bg-gray-100 hover:bg-blue-600 rounded-lg px-4 py-2
                   transition-colors">
      <span class="text-gray-700 group-hover/button:text-white text-sm font-medium transition-colors">
        버튼 1
      </span>
    </button>
  </div>
</div>
```

---

## 6.5 peer 및 peer-*: 패턴

`peer` 클래스를 형제 요소에 추가하면, 그 다음 형제 요소에서 `peer-hover:`, `peer-focus:`, `peer-checked:` 등의 변형을 사용할 수 있습니다.

### 폼 유효성 검사 UI 예제

```html
<!-- peer를 활용한 실시간 유효성 검사 UI -->
<div class="space-y-4 max-w-sm">

  <!-- 이메일 입력 -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
    <input
      type="email"
      id="email"
      required
      class="peer w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
             invalid:border-red-500 invalid:focus:ring-red-500/50
             transition-all"
      placeholder="example@email.com"
    />
    <!-- peer-invalid: peer 요소가 invalid 상태일 때 표시 -->
    <p class="mt-1 text-sm text-red-500 hidden peer-invalid:block">
      올바른 이메일 형식을 입력하세요.
    </p>
  </div>

  <!-- 비밀번호 입력 -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
    <input
      type="password"
      minlength="8"
      required
      class="peer w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500/50
             invalid:border-red-500
             transition-all"
      placeholder="8자 이상"
    />
    <p class="mt-1 text-sm text-red-500 hidden peer-invalid:block">
      비밀번호는 8자 이상이어야 합니다.
    </p>
  </div>

</div>
```

### 체크박스 커스텀 스타일

```html
<!-- peer-checked: 체크박스 상태에 따른 UI 변경 -->
<label class="flex items-center gap-3 cursor-pointer group">
  <input
    type="checkbox"
    class="peer sr-only"
  />
  <!-- 커스텀 체크박스 -->
  <div class="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center
              peer-checked:bg-blue-600 peer-checked:border-blue-600
              group-hover:border-blue-400 transition-all">
    <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
            d="M5 13l4 4L19 7"/>
    </svg>
  </div>
  <span class="text-sm text-gray-700 peer-checked:text-blue-600 peer-checked:font-medium transition-colors">
    이용약관에 동의합니다
  </span>
</label>
```

### 토글 스위치 구현

```html
<!-- peer를 이용한 토글 스위치 -->
<label class="flex items-center gap-3 cursor-pointer">
  <input type="checkbox" class="peer sr-only" />
  <!-- 트랙 -->
  <div class="relative w-11 h-6 bg-gray-200 rounded-full
              peer-checked:bg-blue-600 transition-colors duration-200">
    <!-- 썸 -->
    <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                peer-checked:translate-x-5 transition-transform duration-200"></div>
  </div>
  <span class="text-sm font-medium text-gray-900">알림 활성화</span>
</label>
```

> **주의**: `peer` 클래스는 HTML 소스 순서상 `peer-*` 변형보다 앞에 있어야 합니다.

---

## 6.6 트랜지션

Tailwind는 CSS 트랜지션을 위한 유틸리티 클래스를 제공합니다.

### transition 클래스

| 클래스 | 적용되는 CSS 속성 |
|---|---|
| `transition` | color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter |
| `transition-all` | 모든 속성 |
| `transition-colors` | color, background-color, border-color 등 색상 관련 속성 |
| `transition-opacity` | opacity |
| `transition-shadow` | box-shadow |
| `transition-transform` | transform |
| `transition-none` | 트랜지션 없음 |

### 지속 시간 (Duration)

`duration-{time}` 클래스로 트랜지션 지속 시간을 설정합니다.

| 클래스 | 값 |
|---|---|
| `duration-75` | 75ms |
| `duration-100` | 100ms |
| `duration-150` | 150ms (기본값) |
| `duration-200` | 200ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |
| `duration-700` | 700ms |
| `duration-1000` | 1000ms |

### 타이밍 함수 (Easing)

`ease-{type}` 클래스로 트랜지션의 가속 곡선을 설정합니다.

| 클래스 | CSS 값 |
|---|---|
| `ease-linear` | `cubic-bezier(0, 0, 1, 1)` |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### 딜레이 (Delay)

`delay-{time}` 클래스로 트랜지션 시작 전 대기 시간을 설정합니다.

```html
<div class="flex gap-4">
  <div class="w-12 h-12 bg-blue-500 rounded hover:scale-125 transition-transform duration-300 delay-0"></div>
  <div class="w-12 h-12 bg-blue-500 rounded hover:scale-125 transition-transform duration-300 delay-75"></div>
  <div class="w-12 h-12 bg-blue-500 rounded hover:scale-125 transition-transform duration-300 delay-150"></div>
  <div class="w-12 h-12 bg-blue-500 rounded hover:scale-125 transition-transform duration-300 delay-300"></div>
</div>
```

### 실습 예제: 풍부한 버튼 트랜지션

```html
<div class="flex flex-wrap gap-4">

  <!-- 색상 트랜지션 버튼 -->
  <button class="bg-blue-600 hover:bg-purple-600 text-white font-semibold
                 px-6 py-3 rounded-xl transition-colors duration-500">
    색상 전환 (500ms)
  </button>

  <!-- 그림자 + 스케일 버튼 -->
  <button class="bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl
                 border border-gray-200 shadow-sm
                 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:shadow-sm
                 transition-all duration-200 ease-out">
    리프트 버튼
  </button>

  <!-- 테두리 슬라이드 효과 -->
  <button class="relative overflow-hidden bg-transparent border-2 border-blue-600
                 text-blue-600 hover:text-white font-semibold px-6 py-3 rounded-xl
                 before:absolute before:inset-0 before:bg-blue-600
                 before:translate-x-[-100%] hover:before:translate-x-0
                 before:transition-transform before:duration-300 before:ease-out
                 transition-colors duration-300">
    <span class="relative z-10">슬라이드 효과</span>
  </button>

</div>
```

---

## 6.7 내장 애니메이션

Tailwind는 네 가지 기본 애니메이션을 제공합니다.

### animate-spin

요소를 360도 회전시킵니다. 로딩 스피너에 사용합니다.

```html
<!-- 로딩 스피너 -->
<div class="flex items-center gap-2">
  <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
    <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  <span class="text-sm text-gray-600">로딩 중...</span>
</div>

<!-- 버튼 내 스피너 -->
<button disabled class="flex items-center gap-2 bg-blue-600 text-white
                        font-semibold px-6 py-3 rounded-xl disabled:opacity-75">
  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
    <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  처리 중...
</button>
```

### animate-ping

요소가 바깥쪽으로 퍼졌다가 사라지는 효과입니다. 알림 뱃지나 온라인 상태 표시에 사용합니다.

```html
<!-- 알림 뱃지 -->
<div class="relative inline-block">
  <button class="bg-gray-200 text-gray-700 rounded-full p-3">
    🔔
  </button>
  <span class="absolute top-0 right-0 flex h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full
                 bg-red-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
  </span>
</div>

<!-- 온라인 상태 표시 -->
<div class="flex items-center gap-2">
  <div class="relative flex h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full
                 bg-green-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  </div>
  <span class="text-sm text-gray-600">온라인</span>
</div>
```

### animate-pulse

요소의 불투명도가 천천히 변화하는 효과입니다. 스켈레톤 로딩 UI에 사용합니다.

```html
<!-- 스켈레톤 카드 -->
<div class="bg-white rounded-xl p-6 shadow max-w-sm">
  <!-- 아바타 -->
  <div class="flex items-center gap-3 mb-4">
    <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
    <div class="flex-1 space-y-2">
      <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div class="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
  </div>
  <!-- 본문 -->
  <div class="space-y-2">
    <div class="h-3 bg-gray-200 rounded animate-pulse"></div>
    <div class="h-3 bg-gray-200 rounded animate-pulse"></div>
    <div class="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
  </div>
  <!-- 이미지 영역 -->
  <div class="mt-4 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
</div>
```

### animate-bounce

요소가 위아래로 튀는 효과입니다. 스크롤 유도 화살표 등에 사용합니다.

```html
<!-- 스크롤 다운 화살표 -->
<div class="flex flex-col items-center gap-2 text-gray-500">
  <span class="text-sm">스크롤하세요</span>
  <svg class="animate-bounce w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 9l-7 7-7-7"/>
  </svg>
</div>
```

---

## 6.8 Transform 유틸리티

CSS `transform` 속성과 관련된 다양한 유틸리티 클래스를 제공합니다.

### scale-* (크기 조절)

| 클래스 | 값 |
|---|---|
| `scale-0` | 0 |
| `scale-50` | 0.5 |
| `scale-75` | 0.75 |
| `scale-90` | 0.9 |
| `scale-95` | 0.95 |
| `scale-100` | 1 (기본값) |
| `scale-105` | 1.05 |
| `scale-110` | 1.1 |
| `scale-125` | 1.25 |
| `scale-150` | 1.5 |

축별로 제어: `scale-x-*`, `scale-y-*`

### rotate-* (회전)

```html
<div class="flex gap-4 items-center">
  <div class="w-10 h-10 bg-blue-500 rounded rotate-0">0°</div>
  <div class="w-10 h-10 bg-blue-500 rounded rotate-12">12°</div>
  <div class="w-10 h-10 bg-blue-500 rounded rotate-45">45°</div>
  <div class="w-10 h-10 bg-blue-500 rounded rotate-90">90°</div>
  <div class="w-10 h-10 bg-blue-500 rounded rotate-180">180°</div>
  <div class="w-10 h-10 bg-blue-500 rounded -rotate-45">-45°</div>
</div>
```

### translate-* (이동)

```html
<!-- 상하좌우 이동 -->
<div class="relative w-20 h-20 bg-gray-100 rounded">
  <div class="absolute w-8 h-8 bg-blue-500 rounded translate-x-2 translate-y-2"></div>
</div>

<!-- 중앙 정렬에 활용 -->
<div class="relative w-full h-32">
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-blue-500 text-white px-4 py-2 rounded">
    완벽하게 가운데 정렬
  </div>
</div>
```

### skew-* (기울이기)

```html
<div class="flex gap-6">
  <div class="w-20 h-20 bg-purple-500 skew-x-6 rounded">skew-x</div>
  <div class="w-20 h-20 bg-pink-500 skew-y-6 rounded">skew-y</div>
  <div class="w-20 h-20 bg-indigo-500 skew-x-6 skew-y-3 rounded">skew-xy</div>
</div>
```

---

## 6.9 종합 실습: 인터랙티브 카드 그리드

앞서 배운 상태 변형, 트랜지션, 애니메이션을 종합 활용한 예제입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <title>인터랙티브 카드</title>
</head>
<body class="bg-gray-50 min-h-screen p-8">

  <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">
    프로젝트 갤러리
  </h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">

    <!-- 카드 1 -->
    <div class="group bg-white rounded-2xl overflow-hidden shadow-sm
                hover:shadow-xl transition-all duration-300 ease-out
                hover:-translate-y-1 cursor-pointer">
      <!-- 이미지/아이콘 영역 -->
      <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600
                  flex items-center justify-center overflow-hidden">
        <span class="text-6xl transform group-hover:scale-110
                     transition-transform duration-500 ease-out">
          🚀
        </span>
      </div>
      <!-- 컨텐츠 -->
      <div class="p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-widest
                       bg-blue-50 px-2 py-1 rounded">
            개발
          </span>
          <!-- 온라인 표시 -->
          <div class="flex items-center gap-1.5">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full
                           bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-xs text-gray-400">활성</span>
          </div>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mt-2
                   group-hover:text-blue-600 transition-colors">
          웹 애플리케이션
        </h3>
        <p class="text-gray-500 text-sm mt-1 leading-relaxed">
          Tailwind CSS와 JavaScript로 만든 인터랙티브 웹앱
        </p>
        <!-- 호버 시 나타나는 버튼 -->
        <div class="mt-4 flex gap-2 opacity-0 translate-y-3
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300 ease-out">
          <button class="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95
                         text-white text-sm font-semibold py-2 rounded-lg transition-all">
            보기
          </button>
          <button class="flex-1 bg-gray-100 hover:bg-gray-200 active:scale-95
                         text-gray-700 text-sm font-semibold py-2 rounded-lg transition-all">
            코드
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 중인 카드 (스켈레톤) -->
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div class="h-48 bg-gray-200 animate-pulse"></div>
      <div class="p-5 space-y-3">
        <div class="flex gap-2">
          <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div class="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- 카드 3 -->
    <div class="group bg-white rounded-2xl overflow-hidden shadow-sm
                hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div class="h-48 bg-gradient-to-br from-emerald-400 to-teal-600
                  flex items-center justify-center overflow-hidden">
        <span class="text-6xl group-hover:scale-110
                     transition-transform duration-500 ease-out">
          🎨
        </span>
      </div>
      <div class="p-5">
        <span class="text-xs font-semibold text-emerald-600 uppercase tracking-widest
                     bg-emerald-50 px-2 py-1 rounded">
          디자인
        </span>
        <h3 class="font-bold text-gray-900 text-lg mt-2
                   group-hover:text-emerald-600 transition-colors">
          UI 디자인 시스템
        </h3>
        <p class="text-gray-500 text-sm mt-1 leading-relaxed">
          재사용 가능한 컴포넌트로 구성된 디자인 시스템
        </p>
        <div class="mt-4 flex gap-2 opacity-0 translate-y-3
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300">
          <button class="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95
                         text-white text-sm font-semibold py-2 rounded-lg transition-all">
            보기
          </button>
          <button class="flex-1 bg-gray-100 hover:bg-gray-200 active:scale-95
                         text-gray-700 text-sm font-semibold py-2 rounded-lg transition-all">
            코드
          </button>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
```

---

## 6.10 요약

이번 챕터에서 다룬 주요 내용을 정리합니다:

| 카테고리 | 주요 클래스/패턴 |
|---|---|
| 기본 상태 변형 | `hover:*`, `focus:*`, `active:*`, `disabled:*` |
| 포커스 변형 | `focus-within:*`, `focus-visible:*` |
| 의사 요소 | `before:*`, `after:*` |
| 플레이스홀더 | `placeholder:*` |
| 그룹 변형 | `group`, `group-hover:*`, `group-focus:*` |
| 피어 변형 | `peer`, `peer-hover:*`, `peer-checked:*` |
| 트랜지션 | `transition`, `transition-colors`, `transition-all` |
| 지속 시간 | `duration-75` ~ `duration-1000` |
| 타이밍 함수 | `ease-linear`, `ease-in`, `ease-out`, `ease-in-out` |
| 딜레이 | `delay-75` ~ `delay-1000` |
| 애니메이션 | `animate-spin`, `animate-ping`, `animate-pulse`, `animate-bounce` |
| 변형 | `scale-*`, `rotate-*`, `translate-*`, `skew-*` |

다음 챕터에서는 `tailwind.config.js`를 통한 커스터마이징 방법을 학습합니다.
