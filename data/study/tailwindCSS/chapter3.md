# Chapter 3: 레이아웃

## 3.1 Flexbox 레이아웃

CSS Flexbox는 1차원 레이아웃 모델입니다. 행(row) 또는 열(column) 방향으로 아이템을 정렬하고 배치합니다. Tailwind CSS는 Flexbox의 모든 기능을 직관적인 유틸리티 클래스로 제공합니다.

### flex 컨테이너 활성화

```html
<!-- flex 클래스만으로 flex 컨테이너 생성 -->
<div class="flex">
  <div class="bg-blue-300 p-4">항목 1</div>
  <div class="bg-blue-400 p-4">항목 2</div>
  <div class="bg-blue-500 p-4 text-white">항목 3</div>
</div>
```

### flex-direction (방향)

```html
<!-- flex-row: 기본값, 가로 방향 -->
<div class="flex flex-row gap-4 p-4 bg-gray-100">
  <div class="bg-blue-400 p-4 text-white">1</div>
  <div class="bg-blue-500 p-4 text-white">2</div>
  <div class="bg-blue-600 p-4 text-white">3</div>
</div>

<!-- flex-col: 세로 방향 -->
<div class="flex flex-col gap-4 p-4 bg-gray-100 mt-4">
  <div class="bg-green-400 p-4 text-white">1</div>
  <div class="bg-green-500 p-4 text-white">2</div>
  <div class="bg-green-600 p-4 text-white">3</div>
</div>

<!-- flex-row-reverse: 가로 역방향 -->
<div class="flex flex-row-reverse gap-4 p-4 bg-gray-100 mt-4">
  <div class="bg-red-400 p-4 text-white">1</div>
  <div class="bg-red-500 p-4 text-white">2</div>
  <div class="bg-red-600 p-4 text-white">3</div>
</div>

<!-- flex-col-reverse: 세로 역방향 -->
<div class="flex flex-col-reverse gap-4 p-4 bg-gray-100 mt-4">
  <div class="bg-purple-400 p-4 text-white">1 (화면에서는 마지막)</div>
  <div class="bg-purple-500 p-4 text-white">2</div>
  <div class="bg-purple-600 p-4 text-white">3 (화면에서는 첫째)</div>
</div>
```

### justify-content (주축 정렬)

```html
<!-- justify-start: 주축 시작점 정렬 (기본값) -->
<div class="flex justify-start gap-2 p-4 bg-gray-100 mb-2">
  <div class="bg-blue-400 text-white p-3 w-20 text-center">1</div>
  <div class="bg-blue-500 text-white p-3 w-20 text-center">2</div>
  <div class="bg-blue-600 text-white p-3 w-20 text-center">3</div>
</div>

<!-- justify-center: 가운데 정렬 -->
<div class="flex justify-center gap-2 p-4 bg-gray-100 mb-2">
  <div class="bg-green-400 text-white p-3 w-20 text-center">1</div>
  <div class="bg-green-500 text-white p-3 w-20 text-center">2</div>
  <div class="bg-green-600 text-white p-3 w-20 text-center">3</div>
</div>

<!-- justify-end: 끝 정렬 -->
<div class="flex justify-end gap-2 p-4 bg-gray-100 mb-2">
  <div class="bg-red-400 text-white p-3 w-20 text-center">1</div>
  <div class="bg-red-500 text-white p-3 w-20 text-center">2</div>
  <div class="bg-red-600 text-white p-3 w-20 text-center">3</div>
</div>

<!-- justify-between: 양 끝에 배치, 나머지 균등 분배 -->
<div class="flex justify-between p-4 bg-gray-100 mb-2">
  <div class="bg-purple-400 text-white p-3 w-20 text-center">1</div>
  <div class="bg-purple-500 text-white p-3 w-20 text-center">2</div>
  <div class="bg-purple-600 text-white p-3 w-20 text-center">3</div>
</div>

<!-- justify-around: 각 아이템 주위에 동일한 간격 -->
<div class="flex justify-around p-4 bg-gray-100 mb-2">
  <div class="bg-indigo-400 text-white p-3 w-20 text-center">1</div>
  <div class="bg-indigo-500 text-white p-3 w-20 text-center">2</div>
  <div class="bg-indigo-600 text-white p-3 w-20 text-center">3</div>
</div>

<!-- justify-evenly: 모든 간격(양 끝 포함) 동일 -->
<div class="flex justify-evenly p-4 bg-gray-100">
  <div class="bg-teal-400 text-white p-3 w-20 text-center">1</div>
  <div class="bg-teal-500 text-white p-3 w-20 text-center">2</div>
  <div class="bg-teal-600 text-white p-3 w-20 text-center">3</div>
</div>
```

### align-items (교차축 정렬)

```html
<!-- items-start: 교차축 시작점 -->
<div class="flex items-start h-32 gap-2 p-4 bg-gray-100 mb-2">
  <div class="bg-blue-400 text-white p-2">짧은</div>
  <div class="bg-blue-500 text-white p-2 h-full">높은</div>
  <div class="bg-blue-600 text-white p-2">짧은</div>
</div>

<!-- items-center: 가운데 정렬 -->
<div class="flex items-center h-32 gap-2 p-4 bg-gray-100 mb-2">
  <div class="bg-green-400 text-white p-2">짧은</div>
  <div class="bg-green-500 text-white p-2 h-full">높은</div>
  <div class="bg-green-600 text-white p-2">짧은</div>
</div>

<!-- items-end: 끝 정렬 -->
<div class="flex items-end h-32 gap-2 p-4 bg-gray-100 mb-2">
  <div class="bg-red-400 text-white p-2">짧은</div>
  <div class="bg-red-500 text-white p-2 h-full">높은</div>
  <div class="bg-red-600 text-white p-2">짧은</div>
</div>

<!-- items-stretch: 교차축 방향으로 늘이기 (기본값) -->
<div class="flex items-stretch h-32 gap-2 p-4 bg-gray-100">
  <div class="bg-purple-400 text-white p-2 flex items-center">늘어남</div>
  <div class="bg-purple-500 text-white p-2 flex items-center">늘어남</div>
  <div class="bg-purple-600 text-white p-2 flex items-center">늘어남</div>
</div>
```

### flex-wrap (줄 바꿈)

```html
<!-- flex-nowrap: 줄 바꿈 없음 (기본값, 내용이 넘치면 압축됨) -->
<div class="flex flex-nowrap gap-2 p-4 bg-gray-100 overflow-hidden">
  <div class="bg-blue-400 text-white p-3 min-w-24 text-center">항목 1</div>
  <div class="bg-blue-400 text-white p-3 min-w-24 text-center">항목 2</div>
  <div class="bg-blue-400 text-white p-3 min-w-24 text-center">항목 3</div>
  <div class="bg-blue-400 text-white p-3 min-w-24 text-center">항목 4</div>
  <div class="bg-blue-400 text-white p-3 min-w-24 text-center">항목 5</div>
</div>

<!-- flex-wrap: 줄 바꿈 허용 -->
<div class="flex flex-wrap gap-2 p-4 bg-gray-100 mt-4 max-w-xs">
  <div class="bg-green-400 text-white p-3 min-w-24 text-center">항목 1</div>
  <div class="bg-green-400 text-white p-3 min-w-24 text-center">항목 2</div>
  <div class="bg-green-400 text-white p-3 min-w-24 text-center">항목 3</div>
  <div class="bg-green-400 text-white p-3 min-w-24 text-center">항목 4</div>
  <div class="bg-green-400 text-white p-3 min-w-24 text-center">항목 5</div>
</div>
```

### flex 아이템 속성

```html
<!-- flex-grow: 남은 공간을 채움 -->
<div class="flex gap-2 p-4 bg-gray-100">
  <div class="flex-none bg-blue-400 text-white p-3">고정 크기</div>
  <div class="flex-1 bg-blue-500 text-white p-3">flex-1 (남은 공간 채움)</div>
  <div class="flex-none bg-blue-400 text-white p-3">고정 크기</div>
</div>

<!-- 여러 flex-1 아이템: 균등 분배 -->
<div class="flex gap-2 p-4 bg-gray-100 mt-4">
  <div class="flex-1 bg-green-400 text-white p-3 text-center">1/3</div>
  <div class="flex-1 bg-green-500 text-white p-3 text-center">1/3</div>
  <div class="flex-1 bg-green-600 text-white p-3 text-center">1/3</div>
</div>

<!-- flex-2 아이템: 2배 크기 -->
<div class="flex gap-2 p-4 bg-gray-100 mt-4">
  <div class="flex-1 bg-red-400 text-white p-3 text-center">1</div>
  <div class="flex-[2] bg-red-500 text-white p-3 text-center">2 (2배 너비)</div>
  <div class="flex-1 bg-red-400 text-white p-3 text-center">1</div>
</div>

<!-- align-self: 개별 아이템의 교차축 정렬 -->
<div class="flex items-start h-32 gap-2 p-4 bg-gray-100 mt-4">
  <div class="bg-purple-400 text-white p-3 self-start">start</div>
  <div class="bg-purple-500 text-white p-3 self-center">center</div>
  <div class="bg-purple-600 text-white p-3 self-end">end</div>
  <div class="bg-purple-700 text-white p-3 self-stretch">stretch</div>
</div>

<!-- order: 아이템 순서 변경 -->
<div class="flex gap-2 p-4 bg-gray-100 mt-4">
  <div class="order-3 bg-yellow-400 p-3">HTML 순서 1, 화면 순서 3</div>
  <div class="order-1 bg-yellow-500 p-3">HTML 순서 2, 화면 순서 1</div>
  <div class="order-2 bg-yellow-600 p-3 text-white">HTML 순서 3, 화면 순서 2</div>
</div>
```

---

## 3.2 CSS Grid 레이아웃

CSS Grid는 2차원 레이아웃 모델입니다. 행(row)과 열(column)을 모두 제어할 수 있어 복잡한 레이아웃 구성에 적합합니다.

### 기본 그리드

```html
<!-- grid-cols-N: N열 그리드 -->
<div class="grid grid-cols-3 gap-4 p-4">
  <div class="bg-blue-400 text-white p-4 text-center">1</div>
  <div class="bg-blue-500 text-white p-4 text-center">2</div>
  <div class="bg-blue-600 text-white p-4 text-center">3</div>
  <div class="bg-blue-400 text-white p-4 text-center">4</div>
  <div class="bg-blue-500 text-white p-4 text-center">5</div>
  <div class="bg-blue-600 text-white p-4 text-center">6</div>
</div>

<!-- grid-cols-2: 2열 그리드 -->
<div class="grid grid-cols-2 gap-4 p-4 mt-4">
  <div class="bg-green-400 text-white p-4">열 1</div>
  <div class="bg-green-500 text-white p-4">열 2</div>
  <div class="bg-green-400 text-white p-4">열 1</div>
  <div class="bg-green-500 text-white p-4">열 2</div>
</div>
```

### col-span-* (열 병합)

```html
<!-- col-span으로 여러 열 차지 -->
<div class="grid grid-cols-4 gap-4 p-4">
  <!-- 4열 전체를 차지하는 헤더 -->
  <div class="col-span-4 bg-gray-800 text-white p-4 text-center font-bold">
    4열 전체 (col-span-4)
  </div>

  <!-- 왼쪽 3열 + 오른쪽 1열 -->
  <div class="col-span-3 bg-blue-500 text-white p-4">3열 (col-span-3)</div>
  <div class="col-span-1 bg-blue-700 text-white p-4">1열</div>

  <!-- 2열 + 2열 -->
  <div class="col-span-2 bg-green-500 text-white p-4">2열 (col-span-2)</div>
  <div class="col-span-2 bg-green-700 text-white p-4">2열 (col-span-2)</div>

  <!-- 개별 열 4개 -->
  <div class="bg-purple-400 text-white p-4 text-center">1</div>
  <div class="bg-purple-500 text-white p-4 text-center">2</div>
  <div class="bg-purple-600 text-white p-4 text-center">3</div>
  <div class="bg-purple-700 text-white p-4 text-center">4</div>
</div>
```

### row-span-* (행 병합)

```html
<!-- row-span으로 여러 행 차지 -->
<div class="grid grid-cols-3 grid-rows-3 gap-4 p-4 h-64">
  <!-- 2행을 차지하는 사이드바 -->
  <div class="row-span-2 bg-indigo-500 text-white p-4 flex items-center justify-center">
    2행 (row-span-2)
  </div>

  <div class="bg-indigo-300 text-white p-4">일반</div>
  <div class="bg-indigo-300 text-white p-4">일반</div>
  <div class="bg-indigo-300 text-white p-4">일반</div>
  <div class="bg-indigo-300 text-white p-4">일반</div>

  <!-- 3열 전체 하단 -->
  <div class="col-span-3 bg-indigo-700 text-white p-4 text-center">
    하단 (col-span-3)
  </div>
</div>
```

### gap (간격)

```html
<!-- 간격 비교 -->
<div class="grid grid-cols-3 gap-1 p-4 bg-gray-200 mb-4">
  <div class="bg-blue-400 text-white p-3 text-center">gap-1</div>
  <div class="bg-blue-400 text-white p-3 text-center">gap-1</div>
  <div class="bg-blue-400 text-white p-3 text-center">gap-1</div>
</div>

<div class="grid grid-cols-3 gap-4 p-4 bg-gray-200 mb-4">
  <div class="bg-green-400 text-white p-3 text-center">gap-4</div>
  <div class="bg-green-400 text-white p-3 text-center">gap-4</div>
  <div class="bg-green-400 text-white p-3 text-center">gap-4</div>
</div>

<div class="grid grid-cols-3 gap-8 p-4 bg-gray-200 mb-4">
  <div class="bg-red-400 text-white p-3 text-center">gap-8</div>
  <div class="bg-red-400 text-white p-3 text-center">gap-8</div>
  <div class="bg-red-400 text-white p-3 text-center">gap-8</div>
</div>

<!-- gap-x와 gap-y: 가로/세로 간격 개별 설정 -->
<div class="grid grid-cols-3 gap-x-8 gap-y-2 p-4 bg-gray-200">
  <div class="bg-purple-400 text-white p-3 text-center">gap-x-8 gap-y-2</div>
  <div class="bg-purple-400 text-white p-3 text-center">gap-x-8 gap-y-2</div>
  <div class="bg-purple-400 text-white p-3 text-center">gap-x-8 gap-y-2</div>
  <div class="bg-purple-400 text-white p-3 text-center">gap-x-8 gap-y-2</div>
  <div class="bg-purple-400 text-white p-3 text-center">gap-x-8 gap-y-2</div>
  <div class="bg-purple-400 text-white p-3 text-center">gap-x-8 gap-y-2</div>
</div>
```

### grid-flow (아이템 흐름 방향)

```html
<!-- grid-flow-row: 행 방향으로 채움 (기본값) -->
<div class="grid grid-cols-3 grid-flow-row gap-4 p-4 bg-gray-100">
  <div class="bg-blue-400 text-white p-3 text-center">1</div>
  <div class="bg-blue-400 text-white p-3 text-center">2</div>
  <div class="bg-blue-400 text-white p-3 text-center">3</div>
  <div class="bg-blue-400 text-white p-3 text-center">4</div>
</div>

<!-- grid-flow-col: 열 방향으로 채움 -->
<div class="grid grid-rows-3 grid-flow-col gap-4 p-4 bg-gray-100 mt-4">
  <div class="bg-green-400 text-white p-3 text-center">1</div>
  <div class="bg-green-400 text-white p-3 text-center">2</div>
  <div class="bg-green-400 text-white p-3 text-center">3</div>
  <div class="bg-green-400 text-white p-3 text-center">4</div>
</div>
```

---

## 3.3 Container와 Box Sizing

### container

Tailwind의 `container` 클래스는 각 브레이크포인트에서 `max-width`를 설정합니다.

```html
<!-- container: 최대 너비 제한 + mx-auto로 중앙 정렬 -->
<div class="container mx-auto px-4">
  <h1 class="text-2xl font-bold">컨테이너 예제</h1>
  <p>이 콘텐츠는 각 브레이크포인트에 맞게 너비가 제한됩니다.</p>
</div>
```

`tailwind.config.js`에서 container 설정 커스터마이즈:

```javascript
module.exports = {
  theme: {
    container: {
      center: true,       // 자동으로 mx-auto 적용
      padding: '1rem',    // 기본 패딩
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
}
```

### box-sizing

```html
<!-- box-border: border-box (기본값, Tailwind의 base 스타일) -->
<!-- 패딩과 테두리가 너비에 포함됨 -->
<div class="box-border w-48 border-4 border-blue-500 p-4 bg-blue-100">
  box-border: 전체 너비 = 지정한 너비 (192px)
</div>

<!-- box-content: content-box (기본 CSS 동작) -->
<!-- 패딩과 테두리가 너비에 추가됨 -->
<div class="box-content w-48 border-4 border-red-500 p-4 bg-red-100 mt-4">
  box-content: 전체 너비 = 지정 너비 + 패딩 + 테두리
</div>
```

---

## 3.4 overflow 유틸리티

요소 내용이 박스를 벗어날 때의 처리 방식을 제어합니다.

```html
<!-- overflow-auto: 내용이 넘칠 때만 스크롤바 표시 -->
<div class="overflow-auto h-32 bg-gray-100 p-4 rounded border">
  <p>overflow-auto 예제입니다.</p>
  <p>내용이 박스보다 길어질 때 스크롤바가 나타납니다.</p>
  <p>긴 텍스트를 추가하여 스크롤을 테스트합니다.</p>
  <p>줄 1</p>
  <p>줄 2</p>
  <p>줄 3</p>
  <p>줄 4</p>
  <p>줄 5 - 여기까지 왔습니다!</p>
</div>

<!-- overflow-hidden: 넘치는 내용 숨김 -->
<div class="overflow-hidden h-24 bg-blue-100 p-4 rounded border border-blue-300 mt-4">
  <p>overflow-hidden: 이 박스는 넘치는 내용을 잘라냅니다.</p>
  <p>이 줄은 잘릴 수 있습니다.</p>
  <p>이 줄도 잘릴 수 있습니다.</p>
  <p>이 줄도 잘릴 수 있습니다.</p>
</div>

<!-- overflow-scroll: 항상 스크롤바 표시 -->
<div class="overflow-scroll h-32 bg-green-100 p-4 rounded border border-green-300 mt-4">
  <p>overflow-scroll: 내용이 없어도 스크롤바가 항상 표시됩니다.</p>
</div>

<!-- overflow-x-auto: 가로 방향만 스크롤 -->
<div class="overflow-x-auto bg-yellow-100 p-4 rounded border mt-4">
  <div class="flex gap-4" style="width: 800px">
    <div class="flex-none w-40 bg-yellow-400 p-4">넓은 내용 1</div>
    <div class="flex-none w-40 bg-yellow-500 p-4">넓은 내용 2</div>
    <div class="flex-none w-40 bg-yellow-600 p-4 text-white">넓은 내용 3</div>
    <div class="flex-none w-40 bg-yellow-700 p-4 text-white">넓은 내용 4</div>
  </div>
</div>

<!-- truncate: 텍스트 한 줄로 자르고 ... 표시 -->
<div class="max-w-xs">
  <p class="truncate bg-gray-100 p-2">
    이 텍스트는 너무 길어서 줄임표(...)로 잘립니다. 계속 길게 씁니다.
  </p>
</div>
```

---

## 3.5 z-index 유틸리티

요소의 쌓임 순서(z축)를 제어합니다.

```html
<!-- z-index 레이어 시각화 -->
<div class="relative h-48 p-4">
  <!-- z-0: 가장 아래 레이어 -->
  <div class="absolute top-4 left-4 w-40 h-28 bg-gray-400 text-white p-3 rounded z-0">
    z-0 (가장 아래)
  </div>

  <!-- z-10: 중간 레이어 -->
  <div class="absolute top-8 left-12 w-40 h-28 bg-blue-500 text-white p-3 rounded z-10">
    z-10 (중간)
  </div>

  <!-- z-20: 위 레이어 -->
  <div class="absolute top-12 left-20 w-40 h-28 bg-red-500 text-white p-3 rounded z-20">
    z-20 (가장 위)
  </div>
</div>

<!-- 모달 오버레이: z-50 사용 -->
<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center hidden" id="modal">
  <div class="bg-white rounded-xl p-8 max-w-md w-full m-4 z-50">
    <h2 class="text-xl font-bold mb-4">모달 다이얼로그</h2>
    <p>z-50을 사용하여 다른 모든 요소 위에 표시됩니다.</p>
  </div>
</div>
```

Tailwind CSS의 기본 z-index 값:

| 클래스 | z-index 값 |
|--------|-----------|
| `z-0` | 0 |
| `z-10` | 10 |
| `z-20` | 20 |
| `z-30` | 30 |
| `z-40` | 40 |
| `z-50` | 50 |
| `z-auto` | auto |

---

## 3.6 실전 레이아웃 예제

### 예제 1: 클래식 헤더-사이드바-메인 레이아웃

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 대시보드 레이아웃</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">

  <!-- 고정 헤더 -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 flex items-center px-6">
    <div class="flex items-center gap-4 flex-1">
      <!-- 로고 -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">T</span>
        </div>
        <span class="font-bold text-gray-900 text-lg">TailwindAdmin</span>
      </div>

      <!-- 검색 바 -->
      <div class="flex-1 max-w-md ml-4 hidden md:block">
        <div class="relative">
          <input
            type="text"
            placeholder="검색..."
            class="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          >
          <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 오른쪽 메뉴 -->
    <div class="flex items-center gap-4">
      <!-- 알림 아이콘 -->
      <button class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- 사용자 아바타 -->
      <div class="flex items-center gap-2 cursor-pointer">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
          <span class="text-white text-xs font-bold">홍</span>
        </div>
        <span class="text-sm font-medium text-gray-700 hidden md:block">홍길동</span>
      </div>
    </div>
  </header>

  <!-- 메인 레이아웃: 사이드바 + 콘텐츠 -->
  <div class="flex pt-16">

    <!-- 고정 사이드바 -->
    <aside class="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-sm overflow-y-auto hidden md:block">
      <nav class="p-4 space-y-1">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">메인 메뉴</p>

        <!-- 활성화된 메뉴 항목 -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          대시보드
        </a>

        <!-- 일반 메뉴 항목들 -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          사용자 관리
        </a>

        <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          주문 목록
        </a>

        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">설정</p>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          환경설정
        </a>
      </nav>
    </aside>

    <!-- 메인 콘텐츠 영역 -->
    <main class="flex-1 md:ml-64 p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>

      <!-- 통계 그리드 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">총 매출</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">₩128,450,000</p>
          <p class="text-sm text-green-600 mt-2">↑ 12.5% 전월 대비</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">신규 주문</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">2,845</p>
          <p class="text-sm text-green-600 mt-2">↑ 8.2% 전월 대비</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">신규 사용자</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">1,294</p>
          <p class="text-sm text-red-500 mt-2">↓ 3.1% 전월 대비</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <p class="text-sm text-gray-500">전환율</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">5.24%</p>
          <p class="text-sm text-green-600 mt-2">↑ 0.8% 전월 대비</p>
        </div>
      </div>

      <!-- 2열 레이아웃: 테이블 + 정보 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 최근 주문 테이블 (2/3) -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">최근 주문</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">주문번호</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">고객</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">금액</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">상태</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr class="hover:bg-gray-50">
                  <td class="p-4 text-sm text-gray-900">#ORD-001</td>
                  <td class="p-4 text-sm text-gray-600">홍길동</td>
                  <td class="p-4 text-sm text-gray-900 font-medium">₩45,000</td>
                  <td class="p-4"><span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">완료</span></td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="p-4 text-sm text-gray-900">#ORD-002</td>
                  <td class="p-4 text-sm text-gray-600">김철수</td>
                  <td class="p-4 text-sm text-gray-900 font-medium">₩128,000</td>
                  <td class="p-4"><span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">처리중</span></td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="p-4 text-sm text-gray-900">#ORD-003</td>
                  <td class="p-4 text-sm text-gray-600">이영희</td>
                  <td class="p-4 text-sm text-gray-900 font-medium">₩67,500</td>
                  <td class="p-4"><span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">배송중</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 빠른 통계 (1/3) -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">카테고리별 매출</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">전자제품</span>
                <span class="font-medium">42%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full w-[42%] bg-indigo-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">패션</span>
                <span class="font-medium">28%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full w-[28%] bg-pink-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">식품</span>
                <span class="font-medium">18%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full w-[18%] bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">기타</span>
                <span class="font-medium">12%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full w-[12%] bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

### 예제 2: Pinterest 스타일 그리드 카드 레이아웃

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>그리드 카드 레이아웃</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">블로그 포스트</h1>

  <!-- Masonry 스타일 그리드 (CSS columns 사용) -->
  <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">

    <!-- 높은 카드 -->
    <div class="break-inside-avoid bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-6">
      <div class="h-64 bg-gradient-to-br from-pink-400 to-rose-600"></div>
      <div class="p-5">
        <span class="text-xs text-pink-600 font-semibold">디자인</span>
        <h3 class="text-lg font-bold text-gray-900 mt-1 mb-2">Tailwind CSS로 아름다운 UI 만들기</h3>
        <p class="text-sm text-gray-500 leading-relaxed">
          Tailwind CSS의 유틸리티 클래스를 사용하여 복잡한 UI 컴포넌트를 빠르게 구현하는 방법을 알아봅니다.
        </p>
        <div class="flex items-center gap-2 mt-4">
          <div class="w-7 h-7 rounded-full bg-pink-200 flex items-center justify-center">
            <span class="text-pink-700 text-xs font-bold">김</span>
          </div>
          <span class="text-xs text-gray-500">5분 읽기</span>
        </div>
      </div>
    </div>

    <!-- 짧은 카드 -->
    <div class="break-inside-avoid bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 mb-6">
      <span class="text-xs text-purple-200 font-semibold">튜토리얼</span>
      <h3 class="text-lg font-bold text-white mt-1 mb-2">CSS Grid 완벽 가이드</h3>
      <p class="text-sm text-purple-100 leading-relaxed">
        CSS Grid를 마스터하면 복잡한 레이아웃도 쉽게 만들 수 있습니다.
      </p>
      <div class="mt-4">
        <span class="text-xs text-purple-200">3분 읽기</span>
      </div>
    </div>

    <!-- 일반 카드 -->
    <div class="break-inside-avoid bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-6">
      <div class="h-40 bg-gradient-to-br from-cyan-400 to-blue-600"></div>
      <div class="p-5">
        <span class="text-xs text-cyan-600 font-semibold">팁</span>
        <h3 class="text-lg font-bold text-gray-900 mt-1 mb-2">반응형 디자인 10가지 핵심 패턴</h3>
        <p class="text-sm text-gray-500 leading-relaxed">
          모바일 퍼스트 접근 방식으로 반응형 레이아웃을 구현하는 핵심 패턴들을 소개합니다.
        </p>
        <div class="flex flex-wrap gap-2 mt-3">
          <span class="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">반응형</span>
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">CSS</span>
          <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Tailwind</span>
        </div>
      </div>
    </div>

  </div>
</body>
</html>
```

---

## 3.7 정리

이번 챕터에서 배운 내용을 정리합니다:

1. **Flexbox**: `flex`, `flex-row/col`, `justify-*`, `items-*`, `flex-wrap`, `flex-1` 등으로 1차원 레이아웃을 구성합니다.
2. **CSS Grid**: `grid`, `grid-cols-*`, `col-span-*`, `row-span-*`, `gap-*` 등으로 2차원 레이아웃을 구성합니다.
3. **Container**: `container mx-auto px-4` 패턴으로 반응형 컨테이너를 만듭니다.
4. **Box Sizing**: Tailwind는 기본적으로 `box-border`(border-box)를 사용합니다.
5. **Overflow**: `overflow-auto`, `overflow-hidden`, `truncate` 등으로 내용 넘침을 처리합니다.
6. **Z-index**: `z-10`, `z-50` 등으로 요소의 쌓임 순서를 제어합니다.

다음 챕터에서는 **반응형 디자인**을 학습하여 다양한 화면 크기에 최적화된 레이아웃을 만드는 방법을 배웁니다.
