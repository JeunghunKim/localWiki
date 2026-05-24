# 📚 Local Wiki

집 서버에서 구동되는 마크다운 기반의 심플한 로컬 위키 시스템입니다. 데이터베이스 없이 `.md` 파일만으로 내용을 관리하며, 파일 수정 시 웹 페이지에 실시간으로 반영됩니다.

## ✨ 주요 기능

- **파일 기반 저장소**: `/data` 디렉토리 내의 마크다운(`.md`) 파일을 그대로 사용합니다. 별도의 DB 설정이 필요 없습니다.
- **실시간 업데이트**: 서버에서 파일이 수정, 추가, 삭제되면 `Socket.io`를 통해 웹 브라우저에 즉시 반영됩니다.
- **마크다운 렌더링**: `marked`와 `highlight.js`를 사용하여 가독성 높은 문서와 코드 하이라이팅을 제공합니다.
- **위키 링크 지원**: `[[페이지명]]` 문법을 통해 문서 간의 쉽고 빠른 이동이 가능합니다.
- **페이지 검색**: 사이드바의 검색창을 통해 위키 페이지를 빠르게 찾을 수 있습니다.
- **Docker 지원**: 컨테이너화를 통해 어떤 환경에서든 쉽게 배포하고 실행할 수 있습니다.

## 🛠 기술 스택

- **Backend**: Node.js, Express
- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Real-time**: Socket.io, Chokidar (File Watcher)
- **Markdown**: Marked, Highlight.js
- **Infrastructure**: Docker, Docker Compose

## 🚀 실행 및 배포 방법

### 1. 로컬에서 즉시 실행 (개발 환경)

Node.js가 설치되어 있어야 합니다.

```bash
# 의존성 설치
npm install

# 서버 실행
node index.js
```

실행 후 브라우저에서 `http://localhost:3000`에 접속하세요.

### 2. Docker로 배포 (추천)

Docker와 Docker Compose가 설치되어 있어야 합니다.

```bash
# 빌드 및 백그라운드 실행
docker-compose up -d --build
```

- **포트**: `3000`
- **데이터 저장소**: 호스트의 `./data` 폴더가 컨테이너의 `/usr/src/app/data`와 연결되어 있어, 호스트에서 파일을 수정하면 즉시 반영됩니다.

## 📁 프로젝트 구조

```text
.
├── data/               # 위키 마크다운 파일 저장소 (.md)
├── public/             # 프론트엔드 정적 파일
│   ├── index.html      # 메인 페이지
│   └── app.js          # 클라이언트 로직 (렌더링, 소켓 통신)
├── index.js            # Express 서버 및 파일 감시 로직
├── Dockerfile          # Docker 이미지 빌드 설정
├── docker-compose.yml  # Docker Compose 설정
├── .env.example        # 환경 변수 예시
└── ROADMAP.md          # 구현 로드맵
```

## ✍️ 사용법

1. `/data` 폴더에 `MyPage.md` 파일을 생성합니다.
2. 파일 내부에 마크다운 문법으로 내용을 작성합니다.
3. 웹 페이지 사이드바에서 `MyPage`를 클릭하여 확인합니다.
4. 다른 문서로 연결하고 싶다면 `[[OtherPage]]`와 같이 작성하세요.

## 📄 라이선스

ISC License
