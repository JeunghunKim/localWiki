# Chapter 2: 기본 유틸리티 클래스

## 2.1 색상 유틸리티

Tailwind CSS는 광범위한 색상 팔레트를 제공합니다. 각 색상은 50~950 사이의 숫자로 농도를 나타냅니다. 숫자가 낮을수록 밝고, 높을수록 어둡습니다.

### 기본 색상 팔레트

Tailwind CSS에는 다음 색상들이 기본으로 포함되어 있습니다:
`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

각 색상마다 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950의 11가지 농도가 있습니다.

### text-* (글자 색상)

```html
<!-- 텍스트 색상 예제 -->
<div class="space-y-2 p-4">
  <p class="text-gray-500">회색 텍스트 (gray-500)</p>
  <p class="text-blue-600">파란 텍스트 (blue-600)</p>
  <p class="text-red-500">빨간 텍스트 (red-500)</p>
  <p class="text-green-700">녹색 텍스트 (green-700)</p>
  <p class="text-yellow-500">노란 텍스트 (yellow-500)</p>
  <p class="text-purple-600">보라 텍스트 (purple-600)</p>
  <p class="text-pink-500">분홍 텍스트 (pink-500)</p>
  <p class="text-indigo-800">인디고 텍스트 (indigo-800)</p>
  <!-- 특수 색상 -->
  <p class="text-black">검정 텍스트</p>
  <p class="text-white bg-gray-800 inline-block px-2">흰 텍스트</p>
  <p class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
    그라디언트 텍스트
  </p>
</div>
```

### bg-* (배경 색상)

```html
<!-- 배경 색상 예제 -->
<div class="grid grid-cols-5 gap-2 p-4">
  <div class="bg-red-100 p-3 text-center text-sm text-red-800">red-100</div>
  <div class="bg-red-300 p-3 text-center text-sm text-red-900">red-300</div>
  <div class="bg-red-500 p-3 text-center text-sm text-white">red-500</div>
  <div class="bg-red-700 p-3 text-center text-sm text-white">red-700</div>
  <div class="bg-red-900 p-3 text-center text-sm text-white">red-900</div>

  <div class="bg-blue-100 p-3 text-center text-sm text-blue-800">blue-100</div>
  <div class="bg-blue-300 p-3 text-center text-sm text-blue-900">blue-300</div>
  <div class="bg-blue-500 p-3 text-center text-sm text-white">blue-500</div>
  <div class="bg-blue-700 p-3 text-center text-sm text-white">blue-700</div>
  <div class="bg-blue-900 p-3 text-center text-sm text-white">blue-900</div>
</div>

<!-- 그라디언트 배경 -->
<div class="p-4 space-y-2">
  <div class="h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
  <div class="h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg"></div>
  <div class="h-16 bg-gradient-to-br from-green-400 to-teal-600 rounded-lg"></div>
</div>
```

### border-* (테두리 색상)

```html
<!-- 테두리 색상 예제 -->
<div class="space-y-3 p-4">
  <!-- 기본 테두리 -->
  <div class="border border-gray-300 p-3 rounded">기본 회색 테두리</div>

  <!-- 색상 테두리 -->
  <div class="border-2 border-blue-500 p-3 rounded text-blue-700">파란 테두리</div>
  <div class="border-2 border-red-400 p-3 rounded text-red-700">빨간 테두리</div>
  <div class="border-2 border-green-500 p-3 rounded text-green-700">녹색 테두리</div>

  <!-- 방향별 테두리 -->
  <div class="border-t-4 border-indigo-500 pt-3 p-3">상단만 인디고 테두리</div>
  <div class="border-l-4 border-yellow-500 pl-3 p-3">왼쪽만 노란 테두리</div>
  <div class="border-b-2 border-pink-400 pb-3 p-3">하단만 핑크 테두리</div>

  <!-- 포커스 시 테두리 색상 변경 -->
  <input
    type="text"
    placeholder="클릭하면 파란 테두리"
    class="w-full border-2 border-gray-300 focus:border-blue-500 p-2 rounded outline-none transition-colors"
  >
</div>
```

### 색상 투명도 (opacity)

```html
<!-- 색상 투명도 예제 -->
<div class="flex gap-4 p-4">
  <!-- 배경 투명도 -->
  <div class="bg-blue-500/10 p-4 rounded">10%</div>
  <div class="bg-blue-500/25 p-4 rounded">25%</div>
  <div class="bg-blue-500/50 p-4 rounded">50%</div>
  <div class="bg-blue-500/75 p-4 rounded">75%</div>
  <div class="bg-blue-500 p-4 rounded text-white">100%</div>
</div>
```

---

## 2.2 크기 유틸리티

### w-* (너비)

Tailwind CSS의 너비 값은 고정 크기(rem 기반), 비율(분수), 뷰포트 기반 등 다양한 형태를 지원합니다.

```html
<!-- 고정 너비 -->
<div class="space-y-2 p-4">
  <div class="w-16 bg-blue-200 p-2">w-16 (4rem / 64px)</div>
  <div class="w-32 bg-blue-300 p-2">w-32 (8rem / 128px)</div>
  <div class="w-48 bg-blue-400 p-2">w-48 (12rem / 192px)</div>
  <div class="w-64 bg-blue-500 text-white p-2">w-64 (16rem / 256px)</div>
</div>

<!-- 비율 너비 -->
<div class="space-y-2 p-4 bg-gray-100">
  <div class="w-1/4 bg-red-300 p-2">w-1/4 (25%)</div>
  <div class="w-1/3 bg-red-400 p-2">w-1/3 (33.33%)</div>
  <div class="w-1/2 bg-red-500 text-white p-2">w-1/2 (50%)</div>
  <div class="w-2/3 bg-red-600 text-white p-2">w-2/3 (66.66%)</div>
  <div class="w-3/4 bg-red-700 text-white p-2">w-3/4 (75%)</div>
  <div class="w-full bg-red-800 text-white p-2">w-full (100%)</div>
</div>

<!-- 특수 너비 -->
<div class="space-y-2 p-4">
  <div class="w-auto bg-green-200 p-2 inline-block">w-auto (내용에 맞춤)</div>
  <div class="w-screen bg-green-300 p-2">w-screen (뷰포트 너비)</div>
  <div class="w-min bg-green-400 p-2">w-min (최소 너비)</div>
  <div class="w-max bg-green-500 p-2">w-max (최대 내용 너비)</div>
  <div class="w-fit bg-green-600 p-2">w-fit (내용에 맞춤)</div>
</div>
```

### h-* (높이)

```html
<!-- 고정 높이 -->
<div class="flex gap-2 items-end p-4 bg-gray-100" style="height: 200px">
  <div class="w-12 h-8 bg-purple-300">h-8</div>
  <div class="w-12 h-16 bg-purple-400">h-16</div>
  <div class="w-12 h-24 bg-purple-500 text-white text-xs">h-24</div>
  <div class="w-12 h-32 bg-purple-600 text-white text-xs">h-32</div>
  <div class="w-12 h-40 bg-purple-700 text-white text-xs">h-40</div>
</div>

<!-- 뷰포트 기반 높이 -->
<div class="h-screen bg-indigo-100 flex items-center justify-center">
  <p class="text-indigo-800 font-bold">h-screen: 화면 전체 높이</p>
</div>

<!-- 비율 높이 -->
<div class="h-64 bg-gray-200 p-4">
  <div class="h-1/4 bg-blue-400 mb-1">h-1/4</div>
  <div class="h-1/2 bg-blue-500">h-1/2</div>
</div>
```

### min-* 및 max-* (최소/최대 크기)

```html
<!-- 최소/최대 너비 -->
<div class="p-4 space-y-4">
  <!-- 최대 너비 제한: 반응형 컨테이너 패턴 -->
  <div class="max-w-sm bg-blue-100 p-4 mx-auto">
    max-w-sm: 최대 너비 24rem (384px)
  </div>
  <div class="max-w-md bg-blue-200 p-4 mx-auto">
    max-w-md: 최대 너비 28rem (448px)
  </div>
  <div class="max-w-lg bg-blue-300 p-4 mx-auto">
    max-w-lg: 최대 너비 32rem (512px)
  </div>
  <div class="max-w-xl bg-blue-400 p-4 mx-auto text-white">
    max-w-xl: 최대 너비 36rem (576px)
  </div>
  <div class="max-w-2xl bg-blue-500 p-4 mx-auto text-white">
    max-w-2xl: 최대 너비 42rem (672px)
  </div>
  <div class="max-w-prose bg-green-100 p-4 mx-auto">
    max-w-prose: 최적 읽기 너비 (65ch)
  </div>

  <!-- 최소 너비 -->
  <button class="min-w-24 bg-orange-500 text-white px-4 py-2 rounded">
    최소 너비 6rem
  </button>
</div>

<!-- 최소/최대 높이 -->
<div class="min-h-32 max-h-64 overflow-auto bg-gray-100 p-4 rounded">
  <p>이 박스는 최소 8rem, 최대 16rem 높이를 가집니다.</p>
  <p>내용이 많아지면 스크롤이 생깁니다.</p>
</div>
```

---

## 2.3 여백 유틸리티

여백은 Tailwind CSS에서 가장 자주 사용하는 유틸리티 중 하나입니다.

### m-* (마진 - 외부 여백)

```html
<!-- 마진 예제 -->
<div class="bg-gray-100 p-1">
  <!-- 사방향 동일 마진 -->
  <div class="m-4 bg-blue-200 p-2">m-4: 모든 방향 1rem 마진</div>

  <!-- 개별 방향 마진 -->
  <div class="mt-8 bg-red-200 p-2">mt-8: 상단 2rem 마진</div>
  <div class="mb-6 bg-red-300 p-2">mb-6: 하단 1.5rem 마진</div>
  <div class="ml-12 bg-red-400 p-2">ml-12: 좌측 3rem 마진</div>
  <div class="mr-12 bg-red-500 text-white p-2">mr-12: 우측 3rem 마진</div>

  <!-- 축 마진 -->
  <div class="mx-8 bg-green-200 p-2">mx-8: 좌우 2rem 마진</div>
  <div class="my-6 bg-green-300 p-2">my-6: 상하 1.5rem 마진</div>

  <!-- 자동 마진 (가운데 정렬) -->
  <div class="mx-auto max-w-xs bg-purple-200 p-2 text-center">
    mx-auto: 가운데 정렬
  </div>

  <!-- 음수 마진 -->
  <div class="relative bg-yellow-100 p-4 mt-4">
    <div class="-mt-4 bg-yellow-400 p-2">-mt-4: 음수 마진 (위로 당김)</div>
  </div>
</div>
```

### p-* (패딩 - 내부 여백)

```html
<!-- 패딩 예제 -->
<div class="space-y-4 p-4 bg-gray-50">
  <!-- 사방향 동일 패딩 -->
  <div class="p-0 bg-blue-100 border">p-0: 패딩 없음</div>
  <div class="p-2 bg-blue-200 border">p-2: 0.5rem 패딩</div>
  <div class="p-4 bg-blue-300 border">p-4: 1rem 패딩</div>
  <div class="p-8 bg-blue-400 border text-white">p-8: 2rem 패딩</div>

  <!-- 개별 방향 패딩 -->
  <div class="pt-6 pb-2 px-4 bg-green-200 border">
    pt-6 pb-2 px-4: 비대칭 패딩
  </div>

  <!-- 패딩으로 버튼 크기 조절 -->
  <div class="flex gap-2">
    <button class="py-1 px-2 bg-indigo-500 text-white text-xs rounded">작은 버튼</button>
    <button class="py-2 px-4 bg-indigo-500 text-white text-sm rounded">중간 버튼</button>
    <button class="py-3 px-6 bg-indigo-500 text-white text-base rounded">큰 버튼</button>
    <button class="py-4 px-8 bg-indigo-500 text-white text-lg rounded">아주 큰 버튼</button>
  </div>
</div>
```

### space-* (자식 요소 간격)

`space-x-*`와 `space-y-*`는 flex/block 컨테이너의 자식 요소들 사이에 여백을 추가합니다.

```html
<!-- space-x: 가로 간격 -->
<div class="flex space-x-4 p-4 bg-gray-100">
  <div class="bg-blue-400 text-white p-3 rounded">항목 1</div>
  <div class="bg-blue-400 text-white p-3 rounded">항목 2</div>
  <div class="bg-blue-400 text-white p-3 rounded">항목 3</div>
  <div class="bg-blue-400 text-white p-3 rounded">항목 4</div>
</div>

<!-- space-y: 세로 간격 -->
<div class="space-y-4 p-4 bg-gray-100 mt-4">
  <div class="bg-red-400 text-white p-3 rounded">항목 1</div>
  <div class="bg-red-400 text-white p-3 rounded">항목 2</div>
  <div class="bg-red-400 text-white p-3 rounded">항목 3</div>
</div>

<!-- divide: 구분선 추가 (space 대신 사용 가능) -->
<div class="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden mt-4">
  <div class="p-4 bg-white hover:bg-gray-50">목록 항목 1</div>
  <div class="p-4 bg-white hover:bg-gray-50">목록 항목 2</div>
  <div class="p-4 bg-white hover:bg-gray-50">목록 항목 3</div>
</div>
```

---

## 2.4 표시(Display) 유틸리티

HTML 요소가 어떻게 렌더링될지 제어합니다.

### 기본 display 값들

```html
<!-- block: 블록 레벨 요소 (줄 차지) -->
<span class="block bg-blue-100 p-2 mb-2">
  span이지만 block으로 표시 (전체 너비)
</span>

<!-- inline: 인라인 요소 -->
<div class="inline bg-green-100 p-2 mr-2">div이지만 inline</div>
<div class="inline bg-green-100 p-2">줄에 함께 표시</div>

<!-- inline-block: 인라인이지만 박스 속성 가짐 -->
<div class="mt-2">
  <div class="inline-block bg-yellow-100 p-2 mr-2 w-24">인라인블록 1</div>
  <div class="inline-block bg-yellow-200 p-2 mr-2 w-32">인라인블록 2</div>
  <div class="inline-block bg-yellow-300 p-2 w-16">인라인블록 3</div>
</div>

<!-- hidden: 요소 숨기기 (display: none) -->
<div class="hidden">이 요소는 보이지 않습니다</div>

<!-- invisible: 공간은 차지하지만 보이지 않음 (visibility: hidden) -->
<div class="invisible bg-red-100 p-2 mt-2">이 요소는 공간은 차지하지만 보이지 않습니다</div>
<div class="bg-gray-200 p-2">위 요소의 공간이 보이시나요?</div>
```

### flex와 grid display

```html
<!-- flex 컨테이너 -->
<div class="flex gap-4 p-4 bg-gray-100">
  <div class="bg-blue-400 p-4 text-white">flex 항목 1</div>
  <div class="bg-blue-500 p-4 text-white">flex 항목 2</div>
  <div class="bg-blue-600 p-4 text-white">flex 항목 3</div>
</div>

<!-- inline-flex -->
<div class="mt-4">
  <button class="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
    </svg>
    inline-flex 버튼
  </button>
</div>

<!-- grid 컨테이너 -->
<div class="grid grid-cols-3 gap-4 p-4 bg-gray-100 mt-4">
  <div class="bg-green-400 p-4 text-white text-center">그리드 1</div>
  <div class="bg-green-500 p-4 text-white text-center">그리드 2</div>
  <div class="bg-green-600 p-4 text-white text-center">그리드 3</div>
</div>
```

---

## 2.5 위치(Position) 유틸리티

요소의 포지셔닝 방식을 제어합니다.

### relative와 absolute

```html
<!-- relative + absolute 패턴 -->
<div class="relative bg-gray-200 h-48 w-full rounded-lg overflow-hidden">
  <p class="p-4">부모 요소 (relative)</p>

  <!-- 우상단 배지 -->
  <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
    NEW
  </div>

  <!-- 중앙 배치 -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded">
    중앙 배치
  </div>

  <!-- 하단 전체 너비 오버레이 -->
  <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
    하단 오버레이
  </div>
</div>
```

### fixed (뷰포트 고정)

```html
<!-- 고정 네비게이션 바 -->
<nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-4">
  <div class="flex items-center justify-between max-w-6xl mx-auto">
    <span class="font-bold text-xl text-indigo-600">Logo</span>
    <div class="flex gap-6">
      <a href="#" class="text-gray-600 hover:text-indigo-600">홈</a>
      <a href="#" class="text-gray-600 hover:text-indigo-600">소개</a>
      <a href="#" class="text-gray-600 hover:text-indigo-600">연락처</a>
    </div>
  </div>
</nav>

<!-- fixed nav 때문에 상단 여백 필요 -->
<main class="mt-16 p-8">
  <p>Fixed nav 아래 콘텐츠</p>
</main>

<!-- 고정 스크롤 탑 버튼 -->
<button class="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center">
  ↑
</button>
```

### sticky (스크롤 시 고정)

```html
<!-- 스티키 헤더 테이블 -->
<div class="max-h-64 overflow-auto border rounded-lg">
  <table class="w-full">
    <thead>
      <tr>
        <th class="sticky top-0 bg-gray-800 text-white p-3 text-left">이름</th>
        <th class="sticky top-0 bg-gray-800 text-white p-3 text-left">이메일</th>
        <th class="sticky top-0 bg-gray-800 text-white p-3 text-left">역할</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr class="hover:bg-gray-50">
        <td class="p-3">홍길동</td>
        <td class="p-3">hong@example.com</td>
        <td class="p-3">관리자</td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="p-3">김철수</td>
        <td class="p-3">kim@example.com</td>
        <td class="p-3">사용자</td>
      </tr>
      <tr class="hover:bg-gray-50">
        <td class="p-3">이영희</td>
        <td class="p-3">lee@example.com</td>
        <td class="p-3">편집자</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 2.6 타이포그래피 유틸리티

텍스트와 관련된 모든 스타일을 제어하는 유틸리티들입니다.

### 폰트 크기 (text-*)

```html
<div class="space-y-2 p-4">
  <p class="text-xs text-gray-600">text-xs: 0.75rem (12px)</p>
  <p class="text-sm text-gray-600">text-sm: 0.875rem (14px)</p>
  <p class="text-base text-gray-600">text-base: 1rem (16px) - 기본값</p>
  <p class="text-lg text-gray-700">text-lg: 1.125rem (18px)</p>
  <p class="text-xl text-gray-700">text-xl: 1.25rem (20px)</p>
  <p class="text-2xl text-gray-800">text-2xl: 1.5rem (24px)</p>
  <p class="text-3xl text-gray-800">text-3xl: 1.875rem (30px)</p>
  <p class="text-4xl text-gray-900">text-4xl: 2.25rem (36px)</p>
  <p class="text-5xl text-gray-900">text-5xl: 3rem (48px)</p>
  <p class="text-6xl text-gray-900">text-6xl: 3.75rem (60px)</p>
</div>
```

### 폰트 굵기 (font-*)

```html
<div class="space-y-1 p-4">
  <p class="font-thin">font-thin: 100</p>
  <p class="font-extralight">font-extralight: 200</p>
  <p class="font-light">font-light: 300</p>
  <p class="font-normal">font-normal: 400 (기본)</p>
  <p class="font-medium">font-medium: 500</p>
  <p class="font-semibold">font-semibold: 600</p>
  <p class="font-bold">font-bold: 700</p>
  <p class="font-extrabold">font-extrabold: 800</p>
  <p class="font-black">font-black: 900</p>
</div>
```

### 텍스트 정렬 및 기타

```html
<div class="space-y-4 p-4 max-w-lg">
  <p class="text-left bg-gray-100 p-2">text-left: 왼쪽 정렬</p>
  <p class="text-center bg-gray-100 p-2">text-center: 가운데 정렬</p>
  <p class="text-right bg-gray-100 p-2">text-right: 오른쪽 정렬</p>
  <p class="text-justify bg-gray-100 p-2">text-justify: 양쪽 정렬. 이 텍스트는 양쪽 맞춤 정렬을 보여주기 위해 충분히 길어야 합니다.</p>

  <!-- 텍스트 변환 -->
  <p class="uppercase">uppercase: 대문자 변환</p>
  <p class="lowercase">LOWERCASE: 소문자 변환</p>
  <p class="capitalize">capitalize: 첫글자 대문자</p>
  <p class="normal-case">Normal Case: 원래대로</p>

  <!-- 텍스트 장식 -->
  <p class="underline">underline: 밑줄</p>
  <p class="line-through">line-through: 취소선</p>
  <p class="no-underline underline">no-underline: 밑줄 제거</p>

  <!-- 줄 높이 -->
  <p class="leading-tight bg-blue-50 p-2">leading-tight: 줄간격 좁게. 여러 줄의 텍스트가 있을 때 줄간격이 좁아집니다.</p>
  <p class="leading-normal bg-blue-100 p-2">leading-normal: 기본 줄간격. 여러 줄의 텍스트가 있을 때 기본 줄간격입니다.</p>
  <p class="leading-loose bg-blue-200 p-2">leading-loose: 줄간격 넓게. 여러 줄의 텍스트가 있을 때 줄간격이 넓어집니다.</p>

  <!-- 글자 간격 -->
  <p class="tracking-tight">tracking-tight: 글자 간격 좁게</p>
  <p class="tracking-normal">tracking-normal: 기본 글자 간격</p>
  <p class="tracking-wide">tracking-wide: 글자 간격 넓게</p>
  <p class="tracking-widest">tracking-widest: 글자 간격 매우 넓게</p>
</div>
```

---

## 2.7 종합 실습 예제

위에서 배운 유틸리티들을 조합하여 완성된 UI 컴포넌트를 만들어봅시다.

### 실습 예제 1: 사용자 프로필 카드

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>프로필 카드</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
    <!-- 헤더 배경 -->
    <div class="h-32 bg-gradient-to-r from-violet-500 to-fuchsia-500 relative">
      <!-- 뱃지 -->
      <span class="absolute top-4 right-4 bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
        프리미엄 회원
      </span>
    </div>

    <!-- 아바타 -->
    <div class="relative px-6 pb-6">
      <div class="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
        <span class="text-white text-3xl font-bold">홍</span>
      </div>

      <!-- 이름 및 정보 -->
      <div class="pt-14">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">홍길동</h2>
            <p class="text-sm text-gray-500 mt-0.5">프론트엔드 개발자</p>
          </div>
          <button class="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            팔로우
          </button>
        </div>

        <!-- 소개 -->
        <p class="text-sm text-gray-600 mt-3 leading-relaxed">
          Tailwind CSS를 사랑하는 개발자입니다. React와 Vue.js로 아름다운 UI를 만들고 있습니다.
        </p>

        <!-- 태그 -->
        <div class="flex flex-wrap gap-2 mt-4">
          <span class="bg-violet-100 text-violet-700 text-xs px-3 py-1 rounded-full font-medium">React</span>
          <span class="bg-fuchsia-100 text-fuchsia-700 text-xs px-3 py-1 rounded-full font-medium">Vue.js</span>
          <span class="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-medium">Tailwind CSS</span>
          <span class="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">TypeScript</span>
        </div>

        <!-- 통계 -->
        <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div class="text-center">
            <p class="text-xl font-bold text-gray-900">248</p>
            <p class="text-xs text-gray-500 mt-0.5">게시물</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-gray-900">12.5k</p>
            <p class="text-xs text-gray-500 mt-0.5">팔로워</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-gray-900">891</p>
            <p class="text-xs text-gray-500 mt-0.5">팔로잉</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

### 실습 예제 2: 상품 카드 목록

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>상품 카드</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">인기 상품</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- 상품 카드 -->
    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <!-- 상품 이미지 영역 -->
      <div class="relative h-48 bg-gradient-to-br from-orange-100 to-amber-200 overflow-hidden">
        <!-- 할인 뱃지 -->
        <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -20%
        </span>
        <!-- 위시리스트 버튼 -->
        <button class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors">
          <svg class="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <!-- 이미지 플레이스홀더 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-6xl">🧢</span>
        </div>
      </div>

      <!-- 상품 정보 -->
      <div class="p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">패션</p>
        <h3 class="font-semibold text-gray-900 text-sm leading-tight mb-2">
          프리미엄 캐주얼 모자
        </h3>
        <!-- 별점 -->
        <div class="flex items-center gap-1 mb-2">
          <div class="flex text-yellow-400 text-xs">★★★★☆</div>
          <span class="text-xs text-gray-400">(128)</span>
        </div>
        <!-- 가격 -->
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold text-gray-900">₩32,000</span>
          <span class="text-sm text-gray-400 line-through">₩40,000</span>
        </div>
        <!-- 구매 버튼 -->
        <button class="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
          장바구니 담기
        </button>
      </div>
    </div>
  </div>
</body>
</html>
```

### 실습 예제 3: 통계 대시보드 위젯

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>대시보드 위젯</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>

  <!-- 통계 카드 그리드 -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- 매출 카드 -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12.5%</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">₩48,295,000</p>
      <p class="text-sm text-gray-500 mt-1">이번 달 매출</p>
    </div>

    <!-- 주문 카드 -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <span class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+8.2%</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">1,284</p>
      <p class="text-sm text-gray-500 mt-1">총 주문 수</p>
    </div>

    <!-- 방문자 카드 -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <span class="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">-2.1%</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">24,589</p>
      <p class="text-sm text-gray-500 mt-1">월간 방문자</p>
    </div>

    <!-- 전환율 카드 -->
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <span class="text-xs font-semibold text-white/80 bg-white/20 px-2 py-1 rounded-full">+3.7%</span>
      </div>
      <p class="text-2xl font-bold">5.24%</p>
      <p class="text-sm text-white/70 mt-1">구매 전환율</p>
    </div>
  </div>
</body>
</html>
```

---

## 2.8 정리

이번 챕터에서 배운 내용을 정리합니다:

1. **색상 유틸리티**: `text-*`, `bg-*`, `border-*`로 텍스트, 배경, 테두리 색상을 제어합니다. 색상 투명도는 `/` 슬래시로 지정합니다.
2. **크기 유틸리티**: `w-*`, `h-*`는 고정값, 비율, 뷰포트 크기를 지원합니다. `max-w-*`, `min-h-*`로 최대/최소 크기를 제한합니다.
3. **여백 유틸리티**: `m-*`(외부 마진), `p-*`(내부 패딩), `space-*`(자식 간격)으로 여백을 제어합니다.
4. **표시 유틸리티**: `block`, `inline`, `inline-block`, `flex`, `grid`, `hidden`으로 요소의 표시 방식을 결정합니다.
5. **위치 유틸리티**: `relative`, `absolute`, `fixed`, `sticky`로 요소의 포지셔닝을 제어합니다.
6. **타이포그래피**: `text-*` 크기, `font-*` 굵기, `leading-*` 줄 높이, `tracking-*` 글자 간격 등으로 텍스트를 세밀하게 조절합니다.

다음 챕터에서는 Tailwind CSS를 이용한 **레이아웃 시스템**인 Flexbox와 Grid를 심층적으로 학습합니다.
