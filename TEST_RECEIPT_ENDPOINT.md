# 영수증 업로드 엔드포인트 테스트 가이드

## 백엔드 확인사항

### 1. 서버 재시작
```bash
# Gradle을 사용하는 경우
./gradlew bootRun

# 또는 IDE에서 MainApplication 실행
```

### 2. 엔드포인트 확인
- URL: `http://localhost:8080/receipt/upload`
- Method: POST
- Content-Type: multipart/form-data
- Parameter: file (이미지 파일)

### 3. Postman/cURL로 직접 테스트

```bash
curl -X POST http://localhost:8080/receipt/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/receipt.jpg"
```

### 4. 백엔드 콘솔 로그 확인
다음과 같은 로그가 순서대로 출력되어야 합니다:

```
🔵 [START] Receipt upload processing started
🧾 [DEBUG] OCR 재구성 결과:
[OCR 텍스트...]
🔵 [OCR] Text extracted, receipt date: 2025-05-19
🔵 [PARSE] Parsed 8 items
=== [DEBUG] Merged Items ===
컷팅 양배추 ( 국산 ) x 1
...
============================
=== [DEBUG] Final Classified Items ===
Total items to return: 5
{name=컷팅 양배추 ( 국산 ), quantity=1, category=채소, purchaseDate=2025-05-19, expireDate=2025-06-02}
...
=====================================
✅ [SUCCESS] Returning 5 items to frontend
```

## 프론트엔드 확인사항

### 1. 환경변수 확인
`.env` 파일에서:
```
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK=false
```

### 2. 브라우저 개발자 도구 (F12) 확인

#### Network 탭
- 요청 URL: `http://localhost:8080/receipt/upload`
- Status: 200 OK
- Response 탭에서 JSON 배열 확인:
```json
[
  {
    "name": "컷팅 양배추 ( 국산 )",
    "quantity": 1,
    "category": "채소",
    "purchaseDate": "2025-05-19",
    "expireDate": "2025-06-02"
  }
]
```

#### Console 탭
```
📤 Uploading receipt for OCR: receipt.jpg
✅ Upload complete, starting OCR recognition...
✅ OCR processing complete
✅ API Response Data: [...]
```

## 문제 해결

### 데이터가 프론트로 전달되지 않는 경우

1. **CORS 오류**
   - 브라우저 콘솔에 CORS 관련 에러가 있는지 확인
   - 백엔드 WebConfig.java에서 프론트엔드 포트 확인

2. **인증 오류 (401)**
   - JWT 토큰이 유효한지 확인
   - localStorage에 토큰이 저장되어 있는지 확인

3. **응답이 비어있는 경우**
   - 백엔드 콘솔에서 "Total items to return: 0" 확인
   - 모든 항목이 비식품으로 필터링되었을 가능성
   - FoodClassifierService의 NON_FOOD_KEYWORDS 확인

4. **네트워크 오류**
   - 백엔드 서버가 8080 포트에서 실행 중인지 확인
   - 방화벽 설정 확인

### 직접 API 테스트 (인증 없이)

SecurityConfig에서 임시로 `/receipt/**` 경로를 허용하려면:

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/receipt/**").permitAll()
    // ...
);
```

이렇게 하면 JWT 토큰 없이도 테스트할 수 있습니다.
