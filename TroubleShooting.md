# Troubleshooting Guide

## 프론트엔드 이슈

### 1. 레시피 상세 페이지 - 태그 렌더링 에러

**발생 시점**: 2025-01-XX

**문제 증상**:
```
Uncaught Error: Objects are not valid as a React child (found: object with keys {tagName}).
```

**원인**:
- 백엔드에서 태그를 `[{tagName: "태그1"}, {tagName: "태그2"}]` 형태의 객체 배열로 반환
- 프론트엔드에서 문자열 배열 `["태그1", "태그2"]`로 예상하고 렌더링 시도
- React는 객체를 직접 렌더링할 수 없어 에러 발생

**해결 방법**:

1. **타입 정의 수정** (`src/api/recipe.ts`):
```typescript
export interface RecipeDetail extends RecipeSummary {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: string[] | { tagName: string }[]; // 유니온 타입으로 수정
}
```

2. **렌더링 로직 수정** (`src/pages/recipes/RecipeDetail.tsx`):
```typescript
{!!data.tags?.length && (
  <div className="mt-2 flex flex-wrap gap-2">
    {data.tags.map((t, idx) => {
      const tagText = typeof t === 'string' ? t : t.tagName;
      return <Tag key={`${tagText}-${idx}`} text={tagText} />;
    })}
  </div>
)}
```

**교훈**:
- 백엔드와 프론트엔드 간 데이터 타입 불일치 확인 필요
- 타입스크립트 유니온 타입을 활용한 방어적 프로그래밍

---

### 2. API 응답 JSON 파싱 에러

**발생 시점**: 2025-01-XX

**문제 증상**:
```
SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

**발생 API**:
- `POST /api/recipes/{id}/view` (조회수 증가)
- `GET /api/recipes/{id}/ratings/me` (내 별점 조회)

**원인**:
- 백엔드가 200 OK 응답을 반환하지만 response body가 비어있음
- 프론트엔드에서 무조건 `response.json()` 호출하여 파싱 시도
- 빈 응답에 대한 JSON 파싱 실패

**해결 방법**:

**apiClient.ts 수정**:
```typescript
// 204 No Content 응답 처리
if (response.status === 204) {
  console.log('✅ 204 No Content');
  return undefined as T;
}

// Content-Length가 0이거나 응답 body가 비어있는 경우 처리
const contentLength = response.headers.get('Content-Length');
if (contentLength === '0') {
  console.log('✅ Empty response body (Content-Length: 0)');
  return undefined as T;
}

// JSON 응답 파싱
const text = await response.text();
if (!text || text.trim() === '') {
  console.log('✅ Empty response body');
  return undefined as T;
}

const data = JSON.parse(text);
console.log('✅ API Response Data:', data);
return data;
```

**교훈**:
- API 응답의 빈 body 처리 필요
- Content-Length 헤더 확인
- `response.text()` 먼저 읽은 후 JSON 파싱
- 백엔드와 프론트엔드 간 응답 스펙 명확히 정의 필요

---

### 3. React Key 중복 경고

**발생 시점**: 2025-01-XX

**문제 증상**:
```
Warning: Encountered two children with the same key, `[object Object]`.
```

**원인**:
- 태그 배열이 객체 형태로 되어있어 `key={t}` 사용 시 `[object Object]`로 평가됨
- 중복된 key 값으로 인한 React 렌더링 경고

**해결 방법**:
```typescript
// 이전 코드 (문제)
{data.tags.map((t) => <Tag key={t} text={t} />)}

// 수정 후
{data.tags.map((t, idx) => {
  const tagText = typeof t === 'string' ? t : t.tagName;
  return <Tag key={`${tagText}-${idx}`} text={tagText} />;
})}
```

**교훈**:
- React 리스트 렌더링 시 고유한 key 값 보장
- 객체를 key로 사용하지 않기
- 인덱스와 값을 조합한 key 생성

---

## 디버깅 팁

### Console 로그 확인
```javascript
// API 요청/응답 로그
console.log('🌐 API Request:', method, url);
console.log('📥 API Response:', response.status);
console.log('✅ API Response Data:', data);
console.error('💥 API Request failed:', error);

// 컴포넌트 렌더링 로그
console.log('🎯 RecipeDetail 컴포넌트 렌더링 - ID:', id);
```

### 네트워크 탭 확인 사항
1. Response Status: 200, 204 등
2. Response Headers: Content-Type, Content-Length
3. Response Body: 비어있는지 확인
4. Request Headers: Authorization 토큰 포함 여부

---

## 관련 파일

### 수정된 파일
- `src/api/apiClient.ts` - 빈 응답 처리 로직 추가
- `src/api/recipe.ts` - RecipeDetail 타입 수정
- `src/pages/recipes/RecipeDetail.tsx` - 태그 렌더링 로직 수정

### 관련 문서
- [React 리스트와 Key](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
- [Fetch API Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
