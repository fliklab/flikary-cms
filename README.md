# Git 기반 MDX CMS API

## Introduction

- MD/MDX 파일을 기반으로 하는 Headless CMS API 서버입니다.
- React, TypeScript, Vite, pnpm, Node.js, Vercel, Github API 등 사용
- MD/MDX 파일을 JSON, HTML, 원본 형태로 제공하는 REST API

## Features

- **MD/MDX 파싱**: Front matter와 본문 분리, 메타데이터 추출
- **REST API**: 포스트 목록 및 상세 조회 API
- **HTML 변환**: MD/MDX 파일을 HTML로 변환하여 제공
- **다양한 응답 형식**: JSON, HTML, 원본 MD/MDX 지원
- **서버리스 아키텍처**: Vercel Functions 기반
- **커스텀 컴포넌트 지원**: MDX 파일의 React 컴포넌트 처리
- **HTML 태그 지원**: MD 파일의 HTML 태그 렌더링

## API Endpoint

### Posts

- `GET /api/posts` - 모든 포스트 목록 (JSON)
- `GET /api/posts/:slug` - 특정 포스트 상세 (JSON)
- `GET /api/posts/:slug/html` - 특정 포스트 HTML 변환
- `GET /api/posts/:slug/raw` - 특정 포스트 원본 MD/MDX

### Format

- `?format=json` (기본): JSON 형태로 반환
- `?format=html`: HTML로 변환된 내용 반환
- `?format=raw`: 원본 MD/MDX 내용 반환

### 클라이언트 컴포넌트 옵션

- `?components=Alert,CodeBlock,Button`: 클라이언트에서 처리할 컴포넌트 목록 지정
- 기본값: `Alert,CodeBlock,Button,Card`
- 클라이언트 컴포넌트는 HTML 주석으로 변환되어 클라이언트 앱에서 처리

### API 문서

- `GET /api/openapi` - OpenAPI 3.0 명세 (YAML)
- `GET /api/docs` - Swagger UI 문서

## MD/MDX 처리 방식

### MDX 파일 (`.mdx`)

- **커스텀 React 컴포넌트** 지원 (클라이언트에서 처리)
- **HTML 태그** 직접 사용 가능
- **수학 공식** (KaTeX) 지원
- **GitHub Flavored Markdown** 지원
- **코드 하이라이팅** 지원

### MD 파일 (`.md`)

- **일반 Markdown** 문법 지원
- **HTML 태그** 직접 사용 가능
- **GitHub Flavored Markdown** 지원
- **코드 하이라이팅** 지원
- **수학 공식** (KaTeX) 지원

### Example

#### 포스트 목록 조회

```bash
curl http://localhost:3000/api/posts
```

**응답:**

```json
{
  "posts": [
    {
      "slug": "hello-world",
      "title": "Hello World",
      "description": "첫 번째 포스트입니다.",
      "date": "2024-01-01",
      "tags": ["intro", "getting-started"]
    },
    {
      "slug": "getting-started",
      "title": "시작하기",
      "description": "프로젝트 시작 가이드",
      "date": "2024-01-02",
      "tags": ["guide", "tutorial"]
    }
  ]
}
```

#### 특정 포스트 조회

```bash
curl http://localhost:3000/api/posts/hello-world
```

**응답:**

```json
{
  "slug": "hello-world",
  "title": "Hello World",
  "description": "첫 번째 포스트입니다.",
  "content": "# Hello World\n\n안녕하세요! 이것은 첫 번째 포스트입니다.",
  "date": "2024-01-01",
  "tags": ["intro", "getting-started"]
}
```

#### HTML 변환 조회

```bash
curl http://localhost:3000/api/posts/hello-world/html
```

**응답:**

```html
<h1>Hello World</h1>
<p>안녕하세요! 이것은 첫 번째 포스트입니다.</p>
```

#### 원본 MDX 조회

```bash
curl http://localhost:3000/api/posts/hello-world/raw
```

#### 클라이언트 컴포넌트 처리

```bash
# 기본 클라이언트 컴포넌트 처리
curl http://localhost:3000/api/posts/mdx-with-components/html

# 특정 컴포넌트만 클라이언트에서 처리
curl "http://localhost:3000/api/posts/mdx-with-components/html?components=Alert,CodeBlock"
```

**응답 예시:**

```html
<!-- CLIENT_COMPONENT:Alert -->
이것은 정보 알림입니다.
<!-- /CLIENT_COMPONENT:Alert -->

<!-- CLIENT_COMPONENT:CodeBlock -->
function example() { return "Hello World"; }
<!-- /CLIENT_COMPONENT:CodeBlock -->
```

**응답:**

```mdx
---
title: Hello World
description: 첫 번째 포스트입니다.
date: 2024-01-01
tags: [intro, getting-started]
---

# Hello World

안녕하세요! 이것은 첫 번째 포스트입니다.
```

## Tech Stack

### API 서버

- React, TypeScript, Vite, pnpm
- Node.js (Vercel Serverless Functions)
- mdx, gray-matter
- @mdx-js/mdx, remark, rehype (MDX → HTML 변환)
- Jest, Testing Library
- Github Actions, Vercel

### CMS 클라이언트

- React 18, TypeScript, Vite
- Lucide React (아이콘)
- 미니멀 브루탈리즘 디자인
- GitHub API 연동 (예정)

## Development

### 개발/빌드/테스트

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 실행 (vercel dev)
pnpm build        # 프로덕션 빌드
pnpm test         # 테스트 실행
```

### 개발 서버

```bash
# Vercel 개발 서버 실행
vercel dev

# API 테스트
curl http://localhost:3000/api/posts
curl http://localhost:3000/api/posts/hello-world
curl http://localhost:3000/api/posts/hello-world/html
curl http://localhost:3000/api/posts/hello-world/raw

# API 문서 확인
curl http://localhost:3000/api/openapi
# 브라우저에서 http://localhost:3000/api/docs 접속

# CMS 클라이언트 실행
cd client && pnpm dev
# 브라우저에서 http://localhost:3001 접속
# 도움말: 사이드바 하단의 도움말 버튼 클릭
```
