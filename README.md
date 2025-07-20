# Git 기반 MDX CMS API

## 소개

- git 저장소와 mdx 파일을 기반으로 하는 Headless CMS API 서버
- React, TypeScript, Vite, pnpm, Node.js, Vercel, Github API 등 사용
- MDX 파일을 JSON, HTML, 원본 MDX 형태로 제공하는 REST API

## 주요 기능

- **MDX 파싱**: Front matter와 본문 분리, 메타데이터 추출
- **REST API**: 포스트 목록 및 상세 조회 API
- **HTML 변환**: MDX 파일을 HTML로 변환하여 제공
- **다양한 응답 형식**: JSON, HTML, 원본 MDX 지원
- **서버리스 아키텍처**: Vercel Functions 기반

## API 엔드포인트

### 포스트 관련

- `GET /api/posts` - 모든 포스트 목록 (JSON)
- `GET /api/posts/:slug` - 특정 포스트 상세 (JSON)
- `GET /api/posts/:slug/html` - 특정 포스트 HTML 변환
- `GET /api/posts/:slug/raw` - 특정 포스트 원본 MDX

### 응답 형식 옵션

- `?format=json` (기본): JSON 형태로 반환
- `?format=html`: HTML로 변환된 내용 반환
- `?format=mdx`: 원본 MDX 내용 반환

## 아키텍쳐

```
/content/posts/         # mdx 콘텐츠 파일
/public/images/         # 이미지 파일
/src/
  api/                  # REST API 라우트 (서버리스 함수)
  components/           # 재사용 가능한 React 컴포넌트 (Atomic 설계)
  hooks/                # 커스텀 훅 (로직 분리)
  utils/                # 유틸리티 함수
  transformers/         # MDX → HTML 변환 로직
  types/                # 타입 정의
  styles/               # 스타일 파일 (CSS-in-JS 또는 모듈)
  config/               # 환경설정, 상수 등
/tests/                 # 테스트 코드
.github/                # Github Actions 등
.vite.config.ts         # Vite 설정
tsconfig.json           # TypeScript 설정
jest.config.js          # Jest 설정
```

## 기술 스택

- React, TypeScript, Vite, pnpm
- Node.js (Vercel Serverless Functions)
- mdx, gray-matter
- @mdx-js/mdx, remark, rehype (MDX → HTML 변환)
- Jest, Testing Library
- Github Actions, Vercel

## 개발/빌드/테스트

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 실행 (vercel dev)
pnpm build        # 프로덕션 빌드
pnpm test         # 테스트 실행
```

## 로컬 개발

```bash
# Vercel 개발 서버 실행
vercel dev

# API 테스트
curl http://localhost:3000/api/posts
curl http://localhost:3000/api/posts/hello-world
curl http://localhost:3000/api/posts/hello-world/html
curl http://localhost:3000/api/posts/hello-world/raw
```
