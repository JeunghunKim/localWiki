# Local Wiki 구현 로드맵

집 서버에서 구동되며 마크다운 파일을 기반으로 실시간 업데이트를 지원하는 로컬 위키 시스템 구현 계획입니다.

## 🎯 목표
- **파일 기반 저장소**: `.md` 파일을 직접 수정하여 위키 내용을 관리.
- **마크다운 렌더링**: 웹 브라우저에서 마크다운 문법이 적용된 깔끔한 문서 확인.
- **실시간 반영**: 서버의 파일 변경을 감지하여 웹 페이지에 즉시 반영.
- **심플한 UI**: 문서 간 이동이 편리한 내비게이션 및 가독성 높은 디자인.

## 🛠 기술 스택 (제안)
- **Backend**: Node.js + Express (파일 시스템 접근 및 API 제공)
- **Frontend**: React 또는 단순 HTML/JS + Tailwind CSS
- **Markdown Parser**: `marked` 또는 `markdown-it`
- **Real-time**: `chokidar` (파일 감지) + `Socket.io` (클라이언트 알림) 또는 SSE

## 🗺 단계별 구현 계획

### Phase 1: 기본 구조 및 파일 시스템 설정
- [x] 프로젝트 디렉토리 구조 설계 (`/data` 디렉토리를 위키 저장소로 사용)
- [x] 기본 서버 설정 (Express)
- [x] 파일 목록 읽기 API 구현 (위키 페이지 리스트 반환)
- [x] 특정 파일 내용 읽기 API 구현 (마크다운 텍스트 반환)

### Phase 2: 기본 웹 인터페이스 구현
- [x] 마크다운 렌더러 통합 (Client-side rendering)
- [x] 사이드바 내비게이션 구현 (파일 목록 기반)
- [x] 문서 보기 영역 구현 (마크다운 렌더링 결과 출력)
- [x] 기본 CSS 스타일링 (Typography 및 레이아웃)

### Phase 3: 실시간 업데이트 기능 구현
- [x] `chokidar`를 이용한 `/data` 폴더 파일 변경 감지 로직 구현
- [x] WebSocket (`Socket.io`)를 통한 변경 알림 시스템 구축
- [x] 클라이언트에서 알림 수신 시 콘텐츠 자동 갱신 기능 구현

### Phase 4: 위키 편의 기능 추가
- [x] **Wiki-links**: `[[문서명]]` 형태의 내부 링크 지원
- [x] **전체 텍스트 검색**: 파일 내용 기반의 키워드 검색 기능 구현
- [x] **코드 하이라이팅**: `highlight.js` 적용
- [x] **자동 인덱싱**: 메인 페이지(`index.md`) 렌더링

### Phase 5: 배포 및 최적화
- [x] Dockerfile 작성 (집 서버 배포용 컨테이너화)
- [x] `docker-compose.yml` 설정 (데이터 볼륨 마운트)
- [x] 성능 최적화 및 버그 수정

## ✨ Additional Features (추가 구현 기능)
- **Tree-structured Navigation**: `/data` 폴더의 하위 디렉토리 구조를 사이드바에 트리 형태로 표시.
- **Natural Sorting**: 파일 및 폴더 정렬 시 숫자 순서대로 정렬 (예: chapter1 $\rightarrow$ chapter2 $\rightarrow$ chapter10).
- **Network Access**: `0.0.0.0` 바인딩을 통해 내부망(192.168.x.x) 내 다른 기기 접속 허용.
- **Responsive Mobile UI**: 모바일 환경을 위한 햄버거 메뉴 및 슬라이드 사이드바 구현.
- **Full-text Search**: 단순 제목 필터링을 넘어 파일 내부 콘텐츠까지 검색하고 매칭된 문구를 미리보기로 제공.
