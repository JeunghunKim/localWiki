# Chapter 4: 반응형 디자인

## 4.1 브레이크포인트 시스템

Tailwind CSS는 모바일 퍼스트(Mobile First) 철학을 기반으로 한 반응형 브레이크포인트 시스템을 제공합니다. 브레이크포인트 접두사가 없는 클래스는 모든 화면 크기에 적용되고, 브레이크포인트 접두사가 있는 클래스는 해당 크기 **이상**의 화면에 적용됩니다.

### 기본 브레이크포인트

| 접두사 | 최소 너비 | 대응 기기 |
|--------|-----------|----------|
| (없음) | 0px | 모든 기기 (모바일 포함) |
| `sm:` | 640px | 작은 태블릿 이상 |
| `md:` | 768px | 태블릿 이상 |
| `lg:` | 1024px | 노트북/데스크탑 이상 |
| `xl:` | 1280px | 큰 데스크탑 이상 |
| `2xl:` | 1536px | 매우 큰 화면 이상 |

### 브레이크포인트 작동 원리

```html
<!-- 예시: 텍스트 크기 반응형 적용 -->
<h1 class="text-xl md:text-2xl lg:text-4xl xl:text-5xl">
  반응형 제목
</h1>

<!-- 모바일(기본): text-xl
     md(768px 이상): text-2xl
     lg(1024px 이상): text-4xl
     xl(1280px 이상): text-5xl -->
```

이 코드를 CSS로 나타내면 다음과 같습니다:

```css
/* Tailwind가 생성하는 CSS */
.text-xl { font-size: 1.25rem; }

@media (min-width: 768px) {
  .md\:text-2xl { font-size: 1.5rem; }
}

@media (min-width: 1024px) {
  .lg\:text-4xl { font-size: 2.25rem; }
}

@media (min-width: 1280px) {
  .xl\:text-5xl { font-size: 3rem; }
}
```

### 커스텀 브레이크포인트 설정

`tailwind.config.js`에서 브레이크포인트를 커스터마이즈할 수 있습니다:

```javascript
module.exports = {
  theme: {
    screens: {
      // 기존 브레이크포인트 완전 교체
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1400px',
    },
    // 또는 extend로 추가 브레이크포인트 등록
    extend: {
      screens: {
        'xs': '475px',   // 매우 작은 화면
        '3xl': '1920px', // 매우 큰 화면
      }
    }
  }
}
```

---

## 4.2 모바일 퍼스트 방법론

### 모바일 퍼스트란?

모바일 퍼스트는 가장 작은 화면(모바일)을 기준으로 스타일을 설계하고, 점차 큰 화면에 맞게 확장해 나가는 접근 방식입니다. Tailwind CSS의 반응형 접두사는 모두 "이 너비 **이상**일 때"를 의미하므로, 자연스럽게 모바일 퍼스트가 됩니다.

### 올바른 모바일 퍼스트 방식

```html
<!-- 모바일 퍼스트: 작은 것부터 큰 것으로 -->
<div class="
  flex-col      <!-- 모바일: 세로 스택 -->
  md:flex-row   <!-- 태블릿 이상: 가로 배치 -->
  flex gap-4
">
  <aside class="w-full md:w-64">사이드바</aside>
  <main class="flex-1">메인 콘텐츠</main>
</div>
```

### 잘못된 방식 (데스크탑 퍼스트)

```html
<!-- 잘못된 예: 큰 것부터 작은 것으로 (Tailwind와 맞지 않음) -->
<!-- Tailwind는 max-width 변형을 지원하지 않음 -->
<div class="flex-row sm:flex-col"> <!-- 이렇게 하면 안 됨 -->
  ...
</div>
```

> **참고**: Tailwind CSS는 `max-md:`, `max-lg:` 같은 최대 너비 변형도 지원합니다 (v3.2+). 하지만 모바일 퍼스트 사고방식을 권장합니다.

---

## 4.3 반응형 레이아웃 패턴

### 패턴 1: 1열 → 2열 → 3열 그리드

가장 흔한 반응형 레이아웃 패턴입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>반응형 그리드</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">
  <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
    반응형 카드 그리드
  </h1>

  <!--
    모바일 (기본): 1열
    sm (640px+): 2열
    lg (1024px+): 3열
    xl (1280px+): 4열
  -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <!-- 카드 1 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div class="h-40 bg-gradient-to-br from-blue-400 to-blue-600"></div>
      <div class="p-5">
        <h3 class="font-bold text-gray-900 text-lg mb-2">카드 제목 1</h3>
        <p class="text-gray-500 text-sm leading-relaxed">카드 설명입니다. 반응형으로 열 수가 바뀝니다.</p>
        <button class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          자세히 보기
        </button>
      </div>
    </div>

    <!-- 카드 2 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div class="h-40 bg-gradient-to-br from-green-400 to-emerald-600"></div>
      <div class="p-5">
        <h3 class="font-bold text-gray-900 text-lg mb-2">카드 제목 2</h3>
        <p class="text-gray-500 text-sm leading-relaxed">카드 설명입니다. 반응형으로 열 수가 바뀝니다.</p>
        <button class="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          자세히 보기
        </button>
      </div>
    </div>

    <!-- 카드 3 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div class="h-40 bg-gradient-to-br from-purple-400 to-violet-600"></div>
      <div class="p-5">
        <h3 class="font-bold text-gray-900 text-lg mb-2">카드 제목 3</h3>
        <p class="text-gray-500 text-sm leading-relaxed">카드 설명입니다. 반응형으로 열 수가 바뀝니다.</p>
        <button class="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          자세히 보기
        </button>
      </div>
    </div>

    <!-- 카드 4 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div class="h-40 bg-gradient-to-br from-orange-400 to-red-600"></div>
      <div class="p-5">
        <h3 class="font-bold text-gray-900 text-lg mb-2">카드 제목 4</h3>
        <p class="text-gray-500 text-sm leading-relaxed">카드 설명입니다. 반응형으로 열 수가 바뀝니다.</p>
        <button class="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          자세히 보기
        </button>
      </div>
    </div>
  </div>
</body>
</html>
```

### 패턴 2: 반응형 사이드바 레이아웃

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>반응형 사이드바</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="max-w-6xl mx-auto px-4 py-8">

    <!--
      모바일: 세로 스택 (콘텐츠 → 사이드바)
      lg: 3:1 비율 가로 배치
    -->
    <div class="flex flex-col lg:flex-row gap-8">

      <!-- 메인 콘텐츠 (3/4) -->
      <main class="flex-1 order-1">
        <article class="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">기술</span>
            <span class="text-gray-400 text-sm">2024년 1월 15일</span>
          </div>

          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Tailwind CSS로 배우는 반응형 디자인 완전 가이드
          </h1>

          <p class="text-gray-500 text-lg mb-6 leading-relaxed">
            모바일부터 데스크탑까지, 모든 화면에서 완벽하게 보이는 UI를 만드는 방법을 알아봅니다.
          </p>

          <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-700 font-bold text-sm">홍</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">홍길동</p>
              <p class="text-gray-400 text-xs">프론트엔드 개발자</p>
            </div>
          </div>

          <div class="prose max-w-none">
            <p class="text-gray-700 leading-relaxed mb-4">
              반응형 디자인은 현대 웹 개발에서 필수적인 기술입니다. 사용자들은 다양한 기기로 웹 사이트에 접근하므로, 모든 화면 크기에서 최적화된 경험을 제공해야 합니다.
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              Tailwind CSS는 모바일 퍼스트 접근 방식을 채택하여, 가장 작은 화면에서의 스타일을 기본으로 설정하고 더 큰 화면에서 점진적으로 스타일을 추가하는 방식으로 작동합니다.
            </p>
          </div>
        </article>
      </main>

      <!-- 사이드바 (1/4) -->
      <aside class="w-full lg:w-72 order-2 flex flex-col gap-6">
        <!-- 작성자 정보 -->
        <div class="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
            <span class="text-indigo-700 font-bold text-xl">홍</span>
          </div>
          <h3 class="font-bold text-gray-900 mb-1">홍길동</h3>
          <p class="text-gray-500 text-sm mb-4">프론트엔드 개발자</p>
          <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            팔로우
          </button>
        </div>

        <!-- 태그 목록 -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="font-bold text-gray-900 mb-4">태그</h3>
          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">Tailwind CSS</span>
            <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">반응형</span>
            <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">CSS</span>
            <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">프론트엔드</span>
            <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">디자인</span>
          </div>
        </div>

        <!-- 관련 글 -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="font-bold text-gray-900 mb-4">관련 글</h3>
          <div class="space-y-4">
            <a href="#" class="flex gap-3 group">
              <div class="w-16 h-16 rounded-lg bg-blue-100 flex-shrink-0"></div>
              <div>
                <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">Flexbox vs Grid 언제 무엇을 쓸까?</p>
                <p class="text-xs text-gray-400 mt-1">5분 읽기</p>
              </div>
            </a>
            <a href="#" class="flex gap-3 group">
              <div class="w-16 h-16 rounded-lg bg-green-100 flex-shrink-0"></div>
              <div>
                <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">Tailwind CSS 커스터마이징 가이드</p>
                <p class="text-xs text-gray-400 mt-1">8분 읽기</p>
              </div>
            </a>
          </div>
        </div>
      </aside>

    </div>
  </div>
</body>
</html>
```

---

## 4.4 반응형 타이포그래피

화면 크기에 따라 폰트 크기와 관련 속성을 조절합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>반응형 타이포그래피</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="max-w-4xl mx-auto px-4 py-12">

  <!-- 반응형 영웅 텍스트 -->
  <div class="text-center mb-16">
    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 leading-none">
      Tailwind CSS
    </h1>
    <p class="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
      모든 화면 크기에서 아름다운 반응형 UI를 빠르게 만드세요.
    </p>
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <button class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                     py-3 px-8 rounded-xl text-base md:text-lg transition-colors">
        시작하기
      </button>
      <button class="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400
                     text-gray-700 font-semibold py-3 px-8 rounded-xl text-base md:text-lg transition-colors">
        문서 보기
      </button>
    </div>
  </div>

  <!-- 반응형 글 레이아웃 -->
  <article class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none">
    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      섹션 제목
    </h2>
    <p class="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6">
      본문 텍스트입니다. 화면 크기에 따라 폰트 크기가 자동으로 조절됩니다.
      모바일에서는 작게, 데스크탑에서는 크게 표시됩니다.
    </p>

    <!-- 인용구 -->
    <blockquote class="border-l-4 border-indigo-500 pl-4 md:pl-6 py-2 my-6">
      <p class="text-base md:text-lg lg:text-xl italic text-gray-700 leading-relaxed">
        "Utility-first CSS를 사용하면 HTML에서 떠나지 않고도 완전히 커스텀 디자인을 만들 수 있습니다."
      </p>
      <cite class="text-sm text-gray-500 mt-2 block">— Adam Wathan, Tailwind CSS 창시자</cite>
    </blockquote>
  </article>

  <!-- 반응형 정보 카드 -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
    <div class="text-center p-6">
      <div class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-indigo-600 mb-2">50K+</div>
      <div class="text-sm md:text-base text-gray-500">GitHub Stars</div>
    </div>
    <div class="text-center p-6">
      <div class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-indigo-600 mb-2">10M+</div>
      <div class="text-sm md:text-base text-gray-500">주간 npm 다운로드</div>
    </div>
    <div class="text-center p-6">
      <div class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-indigo-600 mb-2">3,500+</div>
      <div class="text-sm md:text-base text-gray-500">내장 유틸리티 클래스</div>
    </div>
  </div>
</body>
</html>
```

---

## 4.5 반응형 숨김/표시 패턴

특정 화면 크기에서 요소를 보이거나 숨기는 패턴입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>반응형 표시/숨김</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8 space-y-8">

  <!-- 패턴 1: 모바일에서 숨기고 데스크탑에서 표시 -->
  <div class="bg-white border rounded-xl p-6">
    <h2 class="font-bold text-gray-900 mb-4">반응형 표시/숨김 예제</h2>

    <!-- 모바일에서만 보임 (md 이상에서 숨겨짐) -->
    <div class="block md:hidden bg-blue-100 text-blue-800 p-3 rounded-lg mb-3 text-sm">
      📱 모바일 전용 메시지: 이것은 768px 미만에서만 보입니다.
    </div>

    <!-- 태블릿 이상에서만 보임 -->
    <div class="hidden md:block lg:hidden bg-green-100 text-green-800 p-3 rounded-lg mb-3 text-sm">
      💻 태블릿 전용 메시지: 이것은 768px~1023px에서만 보입니다.
    </div>

    <!-- 데스크탑 이상에서만 보임 -->
    <div class="hidden lg:block bg-purple-100 text-purple-800 p-3 rounded-lg mb-3 text-sm">
      🖥️ 데스크탑 전용 메시지: 이것은 1024px 이상에서만 보입니다.
    </div>

    <!-- 모바일에서 표, 데스크탑에서 그리드 -->
    <div class="mt-4">
      <p class="text-sm text-gray-600">
        현재 보이는 메시지를 통해 화면 크기를 확인할 수 있습니다.
      </p>
    </div>
  </div>

  <!-- 패턴 2: 반응형 내비게이션 (모바일 햄버거 메뉴) -->
  <div class="bg-white border rounded-xl overflow-hidden">
    <nav class="px-6 py-4 flex items-center justify-between bg-gray-900">
      <!-- 로고 -->
      <span class="text-white font-bold text-lg">MyBrand</span>

      <!-- 데스크탑 메뉴 (모바일에서 숨겨짐) -->
      <div class="hidden md:flex items-center gap-6">
        <a href="#" class="text-gray-300 hover:text-white text-sm transition-colors">홈</a>
        <a href="#" class="text-gray-300 hover:text-white text-sm transition-colors">서비스</a>
        <a href="#" class="text-gray-300 hover:text-white text-sm transition-colors">포트폴리오</a>
        <a href="#" class="text-gray-300 hover:text-white text-sm transition-colors">블로그</a>
        <a href="#" class="text-gray-300 hover:text-white text-sm transition-colors">연락처</a>
        <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          무료 시작
        </button>
      </div>

      <!-- 모바일 햄버거 메뉴 버튼 (데스크탑에서 숨겨짐) -->
      <button class="md:hidden p-2 text-gray-300 hover:text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </nav>
  </div>

  <!-- 패턴 3: 반응형 테이블 (모바일에서 카드 형태) -->
  <div class="bg-white border rounded-xl overflow-hidden">
    <div class="p-4 bg-gray-50 border-b">
      <h2 class="font-bold text-gray-900">사용자 목록</h2>
      <p class="text-xs text-gray-500 mt-1">모바일: 카드 형태 / 데스크탑: 테이블 형태</p>
    </div>

    <!-- 모바일: 카드 형태 (md 이상에서 숨겨짐) -->
    <div class="block md:hidden divide-y divide-gray-100">
      <div class="p-4 hover:bg-gray-50">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-700 font-bold text-sm">홍</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">홍길동</p>
              <p class="text-gray-400 text-xs">hong@example.com</p>
            </div>
          </div>
          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">활성</span>
        </div>
        <div class="flex gap-4 text-xs text-gray-500 ml-13">
          <span>관리자</span>
          <span>2024-01-15 가입</span>
        </div>
      </div>

      <div class="p-4 hover:bg-gray-50">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <span class="text-pink-700 font-bold text-sm">김</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">김철수</p>
              <p class="text-gray-400 text-xs">kim@example.com</p>
            </div>
          </div>
          <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">대기</span>
        </div>
      </div>
    </div>

    <!-- 데스크탑: 테이블 형태 (md 미만에서 숨겨짐) -->
    <table class="hidden md:table w-full">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-100">
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">사용자</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">이메일</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">역할</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">가입일</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">상태</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr class="hover:bg-gray-50">
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-700 font-bold text-xs">홍</span>
              </div>
              <span class="font-medium text-gray-900 text-sm">홍길동</span>
            </div>
          </td>
          <td class="p-4 text-sm text-gray-600">hong@example.com</td>
          <td class="p-4 text-sm text-gray-600">관리자</td>
          <td class="p-4 text-sm text-gray-600">2024-01-15</td>
          <td class="p-4"><span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">활성</span></td>
        </tr>
        <tr class="hover:bg-gray-50">
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                <span class="text-pink-700 font-bold text-xs">김</span>
              </div>
              <span class="font-medium text-gray-900 text-sm">김철수</span>
            </div>
          </td>
          <td class="p-4 text-sm text-gray-600">kim@example.com</td>
          <td class="p-4 text-sm text-gray-600">사용자</td>
          <td class="p-4 text-sm text-gray-600">2024-01-20</td>
          <td class="p-4"><span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">대기</span></td>
        </tr>
      </tbody>
    </table>
  </div>

</body>
</html>
```

---

## 4.6 실전 반응형 내비게이션

완전한 반응형 내비게이션 바를 구현합니다. 모바일에서는 햄버거 메뉴로 펼쳐지고, 데스크탑에서는 가로 메뉴로 표시됩니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>반응형 내비게이션</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">

  <!-- 내비게이션 바 -->
  <nav class="bg-white shadow-sm sticky top-0 z-50" x-data="{ open: false }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- 왼쪽: 로고 -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <span class="text-white font-bold">T</span>
          </div>
          <span class="font-bold text-gray-900 text-lg">TailwindApp</span>
        </div>

        <!-- 가운데: 데스크탑 네비 링크 (모바일 숨김) -->
        <div class="hidden md:flex items-center gap-1">
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50">
            홈
          </a>
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            서비스
          </a>
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            가격
          </a>
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            블로그
          </a>
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            연락처
          </a>
        </div>

        <!-- 오른쪽 -->
        <div class="flex items-center gap-3">
          <!-- 데스크탑 버튼 (모바일 숨김) -->
          <div class="hidden md:flex items-center gap-3">
            <a href="#" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </a>
            <a href="#" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              무료 시작
            </a>
          </div>

          <!-- 모바일 햄버거 버튼 (데스크탑 숨김) -->
          <button
            id="mobile-menu-toggle"
            onclick="toggleMenu()"
            class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <svg id="hamburger-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg id="close-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- 모바일 드롭다운 메뉴 -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <a href="#" class="block px-4 py-3 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50">
          홈
        </a>
        <a href="#" class="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          서비스
        </a>
        <a href="#" class="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          가격
        </a>
        <a href="#" class="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          블로그
        </a>
        <a href="#" class="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          연락처
        </a>
        <!-- 모바일 로그인/회원가입 버튼 -->
        <div class="pt-2 space-y-2">
          <a href="#" class="block w-full text-center border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors">
            로그인
          </a>
          <a href="#" class="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors">
            무료 시작
          </a>
        </div>
      </div>
    </div>
  </nav>

  <script>
    function toggleMenu() {
      const menu = document.getElementById('mobile-menu');
      const hamburger = document.getElementById('hamburger-icon');
      const close = document.getElementById('close-icon');

      menu.classList.toggle('hidden');
      hamburger.classList.toggle('hidden');
      close.classList.toggle('hidden');
    }
  </script>

  <!-- 메인 콘텐츠 -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 영웅 섹션 -->
    <div class="text-center mb-16">
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
        더 빠르게
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          아름다운 UI
        </span>
        를 만드세요
      </h1>
      <p class="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
        Tailwind CSS로 반응형 디자인을 빠르고 쉽게 구현하세요. 별도의 CSS 파일 없이 HTML만으로 완전한 스타일링이 가능합니다.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-sm sm:text-base transition-colors shadow-lg shadow-indigo-200">
          무료로 시작하기 →
        </button>
        <button class="border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-sm sm:text-base transition-colors">
          데모 보기
        </button>
      </div>
    </div>

    <!-- 반응형 기능 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
      <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-2">빠른 개발</h3>
        <p class="text-gray-500 text-sm leading-relaxed">유틸리티 클래스를 조합해 CSS 파일을 별도로 작성하지 않고 빠르게 UI를 구현합니다.</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-2">완벽한 반응형</h3>
        <p class="text-gray-500 text-sm leading-relaxed">모바일 퍼스트 브레이크포인트로 모든 화면 크기에 최적화된 레이아웃을 쉽게 만듭니다.</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
          </svg>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-2">자유로운 커스터마이징</h3>
        <p class="text-gray-500 text-sm leading-relaxed">tailwind.config.js에서 모든 디자인 토큰을 커스터마이즈하여 브랜드에 맞는 디자인을 만듭니다.</p>
      </div>
    </div>
  </main>

</body>
</html>
```

---

## 4.7 반응형 이미지와 비디오

```html
<!-- 반응형 이미지 -->
<div class="max-w-4xl mx-auto p-4">
  <!-- aspect-ratio로 비율 유지 -->
  <div class="aspect-video bg-gray-200 rounded-xl overflow-hidden">
    <img
      src="https://via.placeholder.com/1280x720"
      alt="예제 이미지"
      class="w-full h-full object-cover"
    >
  </div>

  <!-- 다양한 aspect-ratio -->
  <div class="grid grid-cols-3 gap-4 mt-4">
    <div class="aspect-square bg-blue-200 rounded-xl flex items-center justify-center">
      <span class="text-blue-700 text-sm font-medium">aspect-square</span>
    </div>
    <div class="aspect-video bg-green-200 rounded-xl flex items-center justify-center">
      <span class="text-green-700 text-sm font-medium">aspect-video (16:9)</span>
    </div>
    <div class="aspect-[4/3] bg-purple-200 rounded-xl flex items-center justify-center">
      <span class="text-purple-700 text-sm font-medium">aspect-[4/3]</span>
    </div>
  </div>
</div>

<!-- object-fit 제어 -->
<div class="grid grid-cols-3 gap-4 p-4 max-w-3xl mx-auto mt-4">
  <div class="h-32 overflow-hidden rounded-lg border">
    <div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 object-cover">
      <p class="text-white text-xs p-2">object-cover</p>
    </div>
  </div>
  <div class="h-32 overflow-hidden rounded-lg border bg-gray-100">
    <div class="w-auto h-full bg-gradient-to-br from-green-400 to-green-600 object-contain mx-auto"
         style="width: 60%">
      <p class="text-white text-xs p-2">object-contain</p>
    </div>
  </div>
  <div class="h-32 overflow-hidden rounded-lg border">
    <div class="w-full h-full bg-gradient-to-br from-red-400 to-red-600 object-fill">
      <p class="text-white text-xs p-2">object-fill</p>
    </div>
  </div>
</div>
```

---

## 4.8 정리

이번 챕터에서 배운 내용을 정리합니다:

1. **브레이크포인트**: Tailwind CSS는 `sm`(640px), `md`(768px), `lg`(1024px), `xl`(1280px), `2xl`(1536px) 5가지 브레이크포인트를 제공합니다.
2. **모바일 퍼스트**: 접두사 없는 클래스는 모든 화면에 적용, 브레이크포인트 접두사는 해당 너비 이상에서 적용됩니다.
3. **반응형 그리드**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`처럼 열 수를 단계적으로 늘립니다.
4. **반응형 타이포그래피**: `text-lg md:text-xl lg:text-2xl`처럼 화면 크기에 맞게 폰트 크기를 조절합니다.
5. **반응형 숨김/표시**: `hidden md:block`(모바일 숨김, 태블릿 이상 표시), `block md:hidden`(모바일 표시, 태블릿 이상 숨김) 패턴을 활용합니다.
6. **반응형 내비게이션**: 모바일에서 햄버거 메뉴, 데스크탑에서 가로 메뉴로 전환하는 패턴을 구현합니다.

이것으로 Tailwind CSS의 핵심 기능을 모두 학습했습니다. 소개 및 설치, 기본 유틸리티 클래스, 레이아웃, 반응형 디자인을 마스터했으니, 이제 실제 프로젝트에 적용해보세요!
