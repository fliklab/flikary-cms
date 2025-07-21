---
title: MD with HTML Tags
description: MD 파일에 HTML 태그 포함 테스트
date: 2024-01-15
tags: [markdown, html, test]
---

# MD with HTML Tags

이것은 **MD 파일**에 HTML 태그가 포함된 예시입니다.

## 일반 Markdown 문법

일반적인 Markdown 문법도 그대로 사용할 수 있습니다:

- **굵은 글씨**
- _기울임 글씨_
- `인라인 코드`

## HTML 태그 직접 사용

MD 파일에서도 HTML 태그를 직접 사용할 수 있습니다:

<div style="background: #e8f4fd; padding: 1rem; border-left: 4px solid #2196f3; margin: 1rem 0;">
  <h3>정보 박스</h3>
  <p>이것은 직접 작성한 HTML입니다.</p>
</div>

## 테이블

| 기능            | MD  | MDX |
| --------------- | --- | --- |
| HTML 태그       | ✅  | ✅  |
| 커스텀 컴포넌트 | ❌  | ✅  |
| Front matter    | ✅  | ✅  |

## 코드 블록

```javascript
function example() {
  return "Hello from MD!";
}
```

## 인용구

> 이것은 인용구입니다.
>
> 여러 줄로 작성할 수 있습니다.

## 목록

### 순서 있는 목록

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

### 순서 없는 목록

- 항목 1
- 항목 2
- 항목 3

## 강조 박스

<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
  <strong>⚠️ 주의사항</strong>
  <p>MD 파일에서는 HTML 태그를 사용할 수 있지만, 커스텀 React 컴포넌트는 사용할 수 없습니다.</p>
</div>

## 링크와 이미지

[Google](https://www.google.com)

![예시 이미지](https://via.placeholder.com/300x200)

---

_MD 파일도 HTML 태그를 통해 다양한 스타일링이 가능합니다!_
