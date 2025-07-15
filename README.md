# Git 기반 MDX CMS API

## 소개

- git 저장소와 mdx 파일을 기반으로 하는 Headless CMS API 서버
- React, TypeScript, Vite, pnpm, Node.js, Vercel, Github API 등 사용

## 아키텍쳐

```
/content/posts/         # mdx 콘텐츠 파일
/public/images/         # 이미지 파일
/src/
  api/                  # REST API 라우트 (서버리스 함수)
  components/           # 재사용 가능한 React 컴포넌트 (Atomic 설계)
  hooks/                # 커스텀 훅 (로직 분리)
  utils/                # 유틸리티 함수
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
- Node.js (Express or Vercel Serverless Functions)
- mdx, gray-matter
- Jest, Testing Library
- Github Actions, Vercel

## 개발/빌드/테스트

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm test         # 테스트 실행
```
