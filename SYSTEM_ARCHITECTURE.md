# 시스템 아키텍처 문서
## AI 기반 식재료 재고 관리 및 맞춤형 레시피 추천 서비스

---

## 목차
1. [시스템 개요](#1-시스템-개요)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처 다이어그램](#3-시스템-아키텍처-다이어그램)
4. [프로젝트 구조](#4-프로젝트-구조)
5. [데이터베이스 설계](#5-데이터베이스-설계)
6. [API 설계](#6-api-설계)
7. [인증 및 보안](#7-인증-및-보안)
8. [외부 서비스 통합](#8-외부-서비스-통합)
9. [주요 기능 플로우](#9-주요-기능-플로우)
10. [배포 및 환경 설정](#10-배포-및-환경-설정)

---

## 1. 시스템 개요

### 1.1 아키텍처 패턴
- **패턴**: 3-Tier Architecture (Presentation - Business Logic - Data)
- **통신**: RESTful API (JSON over HTTP/HTTPS)
- **인증**: JWT (JSON Web Token) 기반 Stateless 인증
- **배포**: Frontend-Backend 분리 배포

### 1.2 시스템 구성 요소

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite + TypeScript)                       │   │
│  │  - React Router DOM (라우팅)                         │   │
│  │  - Zustand (상태 관리)                               │   │
│  │  - Tailwind CSS (스타일링)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS (REST API)
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Spring Boot 3.3.4 (Java 17)                         │   │
│  │  - Spring Security + JWT Filter                      │   │
│  │  - Spring Data JPA                                   │   │
│  │  - Spring WebFlux (비동기 HTTP 클라이언트)          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ JDBC
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MySQL 8.0+                                          │   │
│  │  - JPA/Hibernate ORM                                 │   │
│  │  - Database: amazing_potatoes                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌────────────────┬──────────────────┬──────────────────┐   │
│  │ Google OAuth   │ Google Vision API│ Google Gemini API│   │
│  │ (소셜 로그인)  │ (영수증 OCR)     │ (AI 레시피 생성) │   │
│  └────────────────┴──────────────────┴──────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  만개의레시피 (Web Crawling - Jsoup)                │   │
│  │  - 외부 레시피 데이터 수집                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 기술 스택

### 2.1 Frontend
| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Framework | React | 19.1.1 | UI 라이브러리 |
| Build Tool | Vite | 7.1.7 | 빌드 및 개발 서버 |
| Language | TypeScript | 5.9.3 | 타입 안정성 |
| Router | React Router DOM | 7.9.5 | 라우팅 |
| State | Zustand | 5.0.8 | 전역 상태 관리 |
| Styling | Tailwind CSS | 4.1.16 | CSS 프레임워크 |
| Styling | Styled Components | 6.1.19 | CSS-in-JS |
| Auth | @react-oauth/google | 0.12.2 | Google 소셜 로그인 |
| Utils | jwt-decode | 4.0.0 | JWT 디코딩 |
| UI | Lucide React | 0.552.0 | 아이콘 라이브러리 |

### 2.2 Backend
| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Framework | Spring Boot | 3.3.4 | Java 웹 프레임워크 |
| Language | Java | 17 | 프로그래밍 언어 |
| Security | Spring Security | 6.x | 인증/인가 |
| JWT | jjwt | 0.11.5 | JWT 생성/검증 |
| ORM | Spring Data JPA | 3.x | 데이터베이스 ORM |
| Database | MySQL | 8.0+ | 관계형 데이터베이스 |
| HTTP Client | Spring WebFlux | 6.x | 비동기 HTTP 클라이언트 |
| OCR | Google Cloud Vision | 3.47.0 | 영수증 광학 문자 인식 |
| AI | Google Gemini API | - | AI 레시피 생성 |
| Crawling | Jsoup | 1.17.2 | HTML 파싱 및 크롤링 |
| JSON | Gson | 2.10.1 | JSON 직렬화/역직렬화 |

### 2.3 Infrastructure
| 분류 | 기술 | 용도 |
|------|------|------|
| 인증 | Google OAuth 2.0 | 소셜 로그인 |
| API | Google Gemini API | AI 레시피 생성 |
| API | Google Cloud Vision API | 영수증 OCR |
| 크롤링 | 만개의레시피 | 외부 레시피 데이터 |

---

## 3. 시스템 아키텍처 다이어그램

### 3.1 전체 시스템 플로우

```
┌──────────────┐
│   사용자      │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│              Frontend (React SPA)                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Pages                                             │  │
│  │  - Dashboard, Fridge, Recipes, Upload, MyPage     │  │
│  └────────────┬───────────────────────────────────────┘  │
│               ↓                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Auth Provider (React Context)                     │  │
│  │  - JWT 관리, 인증 상태 전역 공유                  │  │
│  └────────────┬───────────────────────────────────────┘  │
│               ↓                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Client Layer                                  │  │
│  │  - apiRequest() → JWT 자동 포함                   │  │
│  │  - 401 처리 → 자동 로그아웃                       │  │
│  └────────────┬───────────────────────────────────────┘  │
└───────────────┼───────────────────────────────────────────┘
                │
                ↓ HTTPS (REST API)
                │
┌───────────────┼───────────────────────────────────────────┐
│               ↓                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Spring Security Filter Chain                      │  │
│  │  - JwtAuthenticationFilter (JWT 검증)             │  │
│  │  - SecurityContext 설정                           │  │
│  └────────────┬───────────────────────────────────────┘  │
│               ↓                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Controllers (@RestController)                     │  │
│  │  - AuthController, RecipeController,              │  │
│  │    RefrigeratorController, ReceiptController      │  │
│  └────────────┬───────────────────────────────────────┘  │
│               ↓                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Services (@Service)                               │  │
│  │  - GoogleAuthService, RecipeService,              │  │
│  │    ReceiptOcrService, GeminiRecipeGenerator,      │  │
│  │    RecipeCrawlerService                           │  │
│  └────────────┬───────────────────────────────────────┘  │
│               ↓                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Repositories (@Repository)                        │  │
│  │  - JPA Repository (CRUD)                          │  │
│  └────────────┬───────────────────────────────────────┘  │
│               ↓                                           │
└───────────────┼───────────────────────────────────────────┘
                │
                ↓ JDBC
                │
┌───────────────┼───────────────────────────────────────────┐
│  ┌────────────▼───────────────────────────────────────┐  │
│  │  MySQL Database (amazing_potatoes)                 │  │
│  │  - users, recipes, refrigerator_items,            │  │
│  │    recipe_ingredients, recipe_steps, comments...  │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
                │
                ↓ HTTPS
                │
┌───────────────┼───────────────────────────────────────────┐
│  ┌────────────▼───────────────────────────────────────┐  │
│  │  External APIs                                     │  │
│  │  1. Google OAuth (idToken 검증)                   │  │
│  │  2. Google Vision API (OCR)                       │  │
│  │  3. Google Gemini API (AI 레시피)                 │  │
│  │  4. 만개의레시피 (크롤링)                          │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 3.2 데이터 흐름 (Data Flow)

#### 3.2.1 사용자 인증 플로우
```
사용자
  ↓ 클릭 "Google 로그인"
Google OAuth Popup
  ↓ 인증 완료 → ID Token 발급
Frontend
  ↓ POST /api/auth/google (idToken)
Backend (GoogleAuthService)
  ↓ Google ID Token 검증
  ↓ 사용자 정보 추출 (email, name)
  ↓ DB에서 사용자 조회/생성
  ↓ JWT 생성 (유효기간 10일)
Frontend
  ↓ JWT → localStorage 저장
  ↓ Authorization: Bearer {JWT} 헤더 포함
모든 이후 API 요청에 자동 포함
```

#### 3.2.2 영수증 업로드 플로우
```
사용자
  ↓ 영수증 이미지 업로드
Frontend
  ↓ FormData → POST /receipt/upload
  ↓ Progress: 0-33% (업로드)
Backend (ReceiptController)
  ↓ 임시 파일 저장
  ↓ Progress: 33-66% (OCR 진행)
Google Cloud Vision API
  ↓ TEXT_DETECTION 수행
  ↓ 텍스트 좌표 반환
Backend (ReceiptOcrService)
  ↓ 좌표 기반 줄 단위 재구성
  ↓ 영수증 날짜 추출 (정규식)
Backend (ReceiptTextParser)
  ↓ 품목명/수량 파싱
Backend (FoodClassifierService)
  ↓ Progress: 66-100% (분류 진행)
  ↓ 카테고리 분류 (키워드 기반)
  ↓ 소비기한 계산 (카테고리별 기본값)
Frontend
  ↓ JSON 결과 수신
  ↓ 카테고리별 그룹화 표시
  ↓ 사용자 수정 가능
사용자
  ↓ "냉장고에 추가" 클릭
Backend
  ↓ RefrigeratorItem 대량 생성
  ↓ MySQL INSERT
완료
```

#### 3.2.3 AI 레시피 생성 플로우
```
사용자
  ↓ 냉장고 재료 선택 + 추가 요구사항 입력
Frontend
  ↓ POST /api/recipes/generate/ai
  ↓ Body: { ingredients, userPreferences, additionalRequirements }
Backend (GeminiRecipeGeneratorService)
  ↓ Rate Limiting 체크 (사용자당 5초 간격)
  ↓ 중복 요청 방지 (동일 재료 조합)
  ↓ 구조화된 프롬프트 생성
Google Gemini API
  ↓ POST /generateContent (gemini-2.0-flash-exp)
  ↓ responseMimeType: application/json
  ↓ AI 레시피 생성
Backend
  ↓ JSON 파싱 및 검증
  ↓ RecipeDetail 형식 변환
Frontend
  ↓ 레시피 표시
  ↓ 재료 목록 (냉장고 vs 추가 재료 구분)
  ↓ 조리 순서
사용자
  ↓ "레시피 저장" (선택)
Backend
  ↓ Recipe 엔티티 생성 (is_ai_generated=true)
  ↓ MySQL INSERT
완료
```

#### 3.2.4 레시피 추천 플로우 (Unified)
```
사용자
  ↓ 대시보드 접속 또는 "재료 기반 추천" 클릭
Frontend
  ↓ GET /api/recipes/recommendations/unified
Backend (UnifiedRecipeRecommendationService)
  ↓ 사용자 냉장고 재료 조회
  ↓ 병렬 처리 시작
  ┌────────────────┬────────────────┐
  │ 로컬 DB 검색   │ 크롤링 검색    │
  │ (3초 타임아웃) │ (12초 타임아웃)│
  ↓                ↓                ↓
RecipeRecommendationService   RecipeCrawlerService
  ↓ 재료 매칭      ↓ 만개의레시피 검색
  ↓ 정렬 (매칭률)  ↓ 동영상 필터링
  ↓ 상위 결과      ↓ 재료 추출
  └────────────────┴────────────────┘
                   ↓
Backend (RecipeSourceMerger)
  ↓ 로컬 + 크롤링 결과 병합
  ↓ 우선순위 정렬 (MIXED)
  ↓ 매칭률 계산 (0-100%)
  ↓ minMatchRate 필터링
  ↓ 중복 제거
Frontend
  ↓ UnifiedRecipeResponse[] 수신
  ↓ 매칭된 재료 / 부족한 재료 표시
  ↓ 매칭률 퍼센티지 표시
완료
```

---

## 4. 프로젝트 구조

### 4.1 Frontend 디렉토리 구조

```
frontend/
├── public/                  # 정적 파일
├── src/
│   ├── api/                 # API 통신 레이어
│   │   ├── apiClient.ts     # 공통 HTTP 클라이언트
│   │   ├── auth.ts          # 인증 API
│   │   ├── dashboard.ts     # 대시보드 API
│   │   ├── recipe.ts        # 레시피 API
│   │   └── refrigerator.ts  # 냉장고 API
│   │
│   ├── app/                 # 앱 설정
│   │   ├── AuthProvider.tsx # 인증 컨텍스트 (전역 상태)
│   │   └── ProtectedRoute.tsx # 인증 라우트 가드
│   │
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── layout/          # 레이아웃
│   │   └── recipe/          # 레시피 관련 컴포넌트
│   │
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── recipes/
│   │   │   ├── RecipeHome.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── RecipeCreate.tsx
│   │   │   └── RecipeAI.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Fridge.tsx
│   │   ├── UploadReceipt.tsx
│   │   ├── MyPage.tsx
│   │   └── LoginPage.tsx
│   │
│   ├── services/            # 비즈니스 로직
│   │   └── ai.ts            # AI 레시피 생성 서비스
│   │
│   ├── lib/                 # 유틸리티 & 어댑터
│   ├── assets/              # 이미지, 폰트 등
│   ├── App.tsx              # 앱 루트
│   ├── main.tsx             # 엔트리 포인트
│   └── vite-env.d.ts        # Vite 타입 정의
│
├── .env                     # 환경 변수
├── vite.config.ts           # Vite 설정
├── tailwind.config.js       # Tailwind 설정
├── tsconfig.json            # TypeScript 설정
└── package.json             # 의존성 관리
```

### 4.2 Backend 디렉토리 구조

```
backend/
├── src/main/java/org/example/
│   ├── auth/                    # 인증 시스템
│   │   ├── AuthController.java  # OAuth 엔드포인트
│   │   └── GoogleAuthService.java
│   │
│   ├── config/                  # 설정
│   │   ├── SecurityConfig.java  # Spring Security + JWT
│   │   ├── WebConfig.java       # CORS 설정
│   │   └── JwtAuthenticationFilter.java
│   │
│   ├── controller/              # REST API 컨트롤러
│   │   ├── DashboardController.java
│   │   ├── RecipeController.java
│   │   ├── ReceiptController.java
│   │   ├── RefrigeratorController.java
│   │   └── FileUploadController.java
│   │
│   ├── service/                 # 비즈니스 로직
│   │   ├── RecipeService.java
│   │   ├── RefrigeratorService.java
│   │   ├── ReceiptOcrService.java
│   │   ├── GeminiRecipeGeneratorService.java
│   │   ├── RecipeCrawlerService.java
│   │   ├── RecipeRecommendationService.java
│   │   ├── UnifiedRecipeRecommendationService.java
│   │   ├── RecipeSourceMerger.java
│   │   ├── FoodClassifierService.java
│   │   └── ReceiptTextParser.java
│   │
│   ├── repository/              # JPA Repository
│   │   ├── UserRepository.java
│   │   ├── RecipeRepository.java
│   │   ├── RefrigeratorItemRepository.java
│   │   ├── RecipeCommentRepository.java
│   │   └── RecipeLikeRepository.java (등)
│   │
│   ├── entity/                  # JPA 엔티티
│   │   ├── User.java
│   │   ├── Recipe.java
│   │   ├── RefrigeratorItem.java
│   │   ├── RecipeIngredient.java
│   │   ├── RecipeStep.java
│   │   ├── RecipeTag.java
│   │   ├── RecipeLike.java
│   │   ├── RecipeComment.java
│   │   ├── RecipeRating.java
│   │   └── SavedRecipe.java
│   │
│   ├── dto/                     # 데이터 전송 객체
│   │   ├── request/
│   │   └── response/
│   │
│   └── util/                    # 유틸리티
│
├── src/main/resources/
│   ├── application.properties   # 환경 설정
│   ├── keys/                    # Google Cloud Vision API 키
│   └── img/                     # 업로드된 이미지
│
├── src/test/                    # 테스트 코드
├── pom.xml                      # Maven 의존성
└── README.md
```

---

## 5. 데이터베이스 설계

### 5.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ user_id (PK)    │
│ google_id (UQ)  │
│ email (UQ)      │
│ name            │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼──────────────────┐
│  refrigerator_items       │
├───────────────────────────┤
│ item_id (PK)              │
│ user_id (FK)              │
│ ingredient_name           │
│ quantity                  │
│ purchase_date             │
│ expiration_date           │
│ storage_method (ENUM)     │
│ status (ENUM)             │
│ category                  │
│ memo                      │
└───────────────────────────┘

┌─────────────────┐
│     users       │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────────────────┐
│         recipes             │
├─────────────────────────────┤
│ recipe_id (PK)              │
│ user_id (FK)                │
│ title                       │
│ description                 │
│ main_image_url              │
│ difficulty (ENUM)           │
│ cooking_time                │
│ servings                    │
│ category                    │
│ view_count                  │
│ like_count                  │
│ comment_count               │
│ save_count                  │
│ rating_sum                  │
│ rating_count                │
│ average_rating              │
│ is_ai_generated (boolean)   │
│ created_at                  │
│ updated_at                  │
└────────┬────────────────────┘
         │ 1
         ├─────────────────────────┐
         │                         │
         │ N                       │ N
┌────────▼─────────────┐  ┌────────▼─────────────┐
│ recipe_ingredients   │  │   recipe_steps       │
├──────────────────────┤  ├──────────────────────┤
│ ingredient_id (PK)   │  │ step_id (PK)         │
│ recipe_id (FK)       │  │ recipe_id (FK)       │
│ ingredient_name      │  │ step_number          │
│ quantity             │  │ description          │
│ sequence             │  │                      │
└──────────────────────┘  └──────────────────────┘

         │ 1
         ├─────────────────────────┐
         │                         │
         │ N                       │ N
┌────────▼─────────────┐  ┌────────▼─────────────┐
│   recipe_tags        │  │  recipe_likes        │
├──────────────────────┤  ├──────────────────────┤
│ tag_id (PK)          │  │ like_id (PK)         │
│ recipe_id (FK)       │  │ recipe_id (FK)       │
│ tag_name             │  │ user_id (FK)         │
│                      │  │ created_at           │
└──────────────────────┘  └──────────────────────┘

         │ 1
         ├─────────────────────────┐
         │                         │
         │ N                       │ N
┌────────▼─────────────┐  ┌────────▼─────────────┐
│  recipe_comments     │  │  recipe_ratings      │
├──────────────────────┤  ├──────────────────────┤
│ comment_id (PK)      │  │ rating_id (PK)       │
│ recipe_id (FK)       │  │ recipe_id (FK)       │
│ user_id (FK)         │  │ user_id (FK)         │
│ content              │  │ rating (1-5)         │
│ created_at           │  │ created_at           │
│ updated_at           │  │ updated_at           │
└──────────────────────┘  └──────────────────────┘

         │ 1
         │
         │ N
┌────────▼─────────────┐
│   saved_recipes      │
├──────────────────────┤
│ save_id (PK)         │
│ recipe_id (FK)       │
│ user_id (FK)         │
│ created_at           │
└──────────────────────┘
```

### 5.2 주요 테이블 상세 설명

#### users (사용자)
```sql
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_google_id (google_id),
    INDEX idx_email (email)
);
```

#### refrigerator_items (냉장고 재료)
```sql
CREATE TABLE refrigerator_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    purchase_date DATE,
    expiration_date DATE,
    storage_method ENUM('FRIDGE', 'FREEZER', 'ROOM_TEMP') DEFAULT 'FRIDGE',
    status ENUM('FRESH', 'NORMAL', 'WARNING', 'EXPIRED') DEFAULT 'FRESH',
    category VARCHAR(50),
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expiration_date (expiration_date),
    INDEX idx_status (status)
);
```

#### recipes (레시피)
```sql
CREATE TABLE recipes (
    recipe_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    main_image_url VARCHAR(500),
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    cooking_time INT,
    servings INT,
    category VARCHAR(50),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    rating_sum INT DEFAULT 0,
    rating_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_view_count (view_count),
    INDEX idx_like_count (like_count),
    INDEX idx_average_rating (average_rating)
);
```

---

## 6. API 설계

### 6.1 API 엔드포인트 목록

#### 6.1.1 인증 API (`/api/auth`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/auth/google` | Google OAuth 로그인 | 불필요 |

**Request Body**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "picture": "https://lh3.googleusercontent.com/..."
}
```

#### 6.1.2 냉장고 API (`/api/refrigerator`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/refrigerator/items` | 냉장고 재료 목록 조회 | 필요 |
| GET | `/api/refrigerator/items/expiring` | 3일 내 만료 재료 조회 | 필요 |
| GET | `/api/refrigerator/items/:id` | 재료 상세 조회 | 필요 |
| POST | `/api/refrigerator/items` | 재료 추가 | 필요 |
| PUT | `/api/refrigerator/items/:id` | 재료 수정 | 필요 |
| DELETE | `/api/refrigerator/items/:id` | 재료 삭제 | 필요 |
| GET | `/api/refrigerator/items/category/:category` | 카테고리별 조회 | 필요 |
| GET | `/api/refrigerator/items/count` | 재료 개수 조회 | 필요 |

**POST Request Body**:
```json
{
  "ingredientName": "소고기",
  "quantity": 2,
  "purchaseDate": "2025-11-28",
  "expirationDate": "2025-12-05",
  "storageMethod": "FRIDGE",
  "category": "육류",
  "memo": "등심"
}
```

#### 6.1.3 레시피 API (`/api/recipes`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/recipes` | 레시피 목록 (페이징) | 선택 |
| GET | `/api/recipes/popular` | 인기 레시피 TOP5 | 선택 |
| GET | `/api/recipes/user/:userId` | 사용자별 레시피 | 선택 |
| GET | `/api/recipes/category/:category` | 카테고리별 레시피 | 선택 |
| GET | `/api/recipes/search/ingredient` | 재료 검색 | 선택 |
| GET | `/api/recipes/search/keyword` | 키워드 검색 | 선택 |
| GET | `/api/recipes/search/tag` | 태그 검색 | 선택 |
| GET | `/api/recipes/:id` | 레시피 상세 조회 | 선택 |
| POST | `/api/recipes` | 레시피 생성 | 필요 |
| PUT | `/api/recipes/:id` | 레시피 수정 | 필요 |
| DELETE | `/api/recipes/:id` | 레시피 삭제 | 필요 |
| POST | `/api/recipes/:id/view` | 조회수 증가 | 선택 |

**Query Parameters (목록 조회)**:
```
?page=0&size=12&sort=createdAt,desc
```

#### 6.1.4 레시피 추천 API
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/recipes/recommendations/unified` | 냉장고 재료 기반 통합 추천 | 필요 |
| POST | `/api/recipes/recommendations/unified` | 특정 재료 기반 통합 추천 | 필요 |

**POST Request Body**:
```json
{
  "ingredients": ["양파", "감자", "당근", "소고기"],
  "prioritization": "MIXED",
  "minMatchRate": 0
}
```

**Response**:
```json
[
  {
    "recipeId": 123,
    "title": "소고기 카레",
    "mainImageUrl": "/api/images/curry.jpg",
    "difficulty": "MEDIUM",
    "cookingTime": 40,
    "source": "LOCAL_DB",
    "matchedIngredients": ["양파", "감자", "당근", "소고기"],
    "missingIngredients": ["카레가루"],
    "matchRate": 80
  },
  {
    "title": "비프 스튜",
    "mainImageUrl": "https://recipe1.ezmember.co.kr/...",
    "source": "EXTERNAL_CRAWL",
    "url": "https://www.10000recipe.com/recipe/6841234",
    "matchedIngredients": ["소고기", "양파", "당근"],
    "missingIngredients": ["토마토", "와인"],
    "matchRate": 60
  }
]
```

#### 6.1.5 AI 레시피 생성 API
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/recipes/generate/ai` | Gemini AI 레시피 생성 | 필요 |

**Request Body**:
```json
{
  "ingredients": [
    {
      "name": "소고기",
      "quantity": "300g",
      "priorityScore": 5,
      "daysUntilExpiry": 2
    },
    {
      "name": "양파",
      "quantity": "1개",
      "priorityScore": 3,
      "daysUntilExpiry": 5
    }
  ],
  "userPreferences": {},
  "additionalRequirements": "매운 맛으로 해주세요"
}
```

**Response**:
```json
{
  "success": true,
  "recipe": {
    "menu_name": "소고기 매운 볶음",
    "ingredients_used": [
      { "name": "소고기", "quantity": "300g" },
      { "name": "양파", "quantity": "1개" }
    ],
    "additional_ingredients": [
      { "name": "고추장", "quantity": "2스푼" },
      { "name": "마늘", "quantity": "3쪽" }
    ],
    "cooking_steps": [
      "소고기를 먹기 좋은 크기로 자릅니다.",
      "양파는 채 썰어 준비합니다.",
      "..."
    ],
    "estimated_cooking_time": "20분",
    "difficulty_level": "쉬움",
    "servings": 2,
    "nutritional_info": {
      "calories": "약 450kcal",
      "protein": "35g",
      "carbohydrates": "15g",
      "fat": "28g"
    }
  },
  "message": "레시피가 생성되었습니다."
}
```

#### 6.1.6 영수증 OCR API (`/receipt`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/receipt/upload` | 영수증 이미지 OCR | 불필요 |

**Request**: `multipart/form-data`
- Field: `file` (이미지 파일)

**Response**:
```json
[
  {
    "name": "소고기",
    "category": "육류",
    "quantity": 1,
    "purchaseDate": "2025-11-28",
    "expireDate": "2025-12-05"
  },
  {
    "name": "양파",
    "category": "채소",
    "quantity": 3,
    "purchaseDate": "2025-11-28",
    "expireDate": "2025-12-05"
  }
]
```

#### 6.1.7 레시피 상호작용 API
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/recipes/:id/like` | 좋아요 | 필요 |
| DELETE | `/api/recipes/:id/like` | 좋아요 취소 | 필요 |
| POST | `/api/recipes/:id/save` | 저장 | 필요 |
| DELETE | `/api/recipes/:id/save` | 저장 취소 | 필요 |
| POST | `/api/recipes/:id/ratings` | 별점 등록 | 필요 |
| GET | `/api/recipes/:id/ratings/me` | 내 별점 조회 | 필요 |
| GET | `/api/recipes/:id/comments` | 댓글 목록 | 선택 |
| POST | `/api/recipes/:id/comments` | 댓글 작성 | 필요 |
| PUT | `/api/recipes/:id/comments/:commentId` | 댓글 수정 | 필요 |
| DELETE | `/api/recipes/:id/comments/:commentId` | 댓글 삭제 | 필요 |

#### 6.1.8 대시보드 API
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/dashboard` | 대시보드 통합 데이터 | 필요 |

**Response**:
```json
{
  "popularRecipes": [...],
  "recommendedRecipes": [...],
  "savedRecipes": [...],
  "expiringItems": [
    {
      "itemId": 10,
      "ingredientName": "우유",
      "expirationDate": "2025-11-30",
      "daysRemaining": 2
    }
  ],
  "refrigeratorItemCount": 15
}
```

---

## 7. 인증 및 보안

### 7.1 JWT (JSON Web Token) 인증

#### 7.1.1 JWT 구조
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user@example.com",
  "userId": 1,
  "name": "홍길동",
  "iat": 1732838400,
  "exp": 1733702400  // 10일 후
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

#### 7.1.2 JWT 생성 (Backend)
```java
// GoogleAuthService.java
String jwt = Jwts.builder()
    .setSubject(email)
    .claim("userId", user.getUserId())
    .claim("name", user.getName())
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 864_000_000)) // 10일
    .signWith(SignatureAlgorithm.HS256, jwtSecret)
    .compact();
```

#### 7.1.3 JWT 검증 (Backend)
```java
// JwtAuthenticationFilter.java
String token = request.getHeader("Authorization").substring(7); // "Bearer " 제거

Claims claims = Jwts.parser()
    .setSigningKey(jwtSecret)
    .parseClaimsJws(token)
    .getBody();

Long userId = claims.get("userId", Long.class);
String email = claims.getSubject();

JwtUserDetails userDetails = new JwtUserDetails(userId, email);
Authentication authentication = new UsernamePasswordAuthenticationToken(
    userDetails, null, userDetails.getAuthorities()
);
SecurityContextHolder.getContext().setAuthentication(authentication);
```

#### 7.1.4 JWT 사용 (Frontend)
```typescript
// apiClient.ts
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // 401 Unauthorized → 자동 로그아웃
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('인증이 만료되었습니다.');
  }

  return await response.json();
}
```

### 7.2 Spring Security 설정

```java
// SecurityConfig.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/receipt/**").permitAll()
            .requestMatchers("/api/images/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

### 7.3 CORS 설정

```java
// WebConfig.java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174"
        )
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
}
```

### 7.4 보안 고려사항

1. **SQL Injection 방지**: JPA/Hibernate의 Prepared Statement 사용
2. **XSS 방지**: 프론트엔드에서 사용자 입력 이스케이프 처리
3. **CSRF 방지**: JWT 기반 인증으로 자동 방지 (Stateless)
4. **파일 업로드 보안**:
   - 파일 크기 제한: 5MB
   - 파일 확장자 검증 (이미지만)
   - UUID 기반 파일명 생성
5. **Rate Limiting**: AI 레시피 생성 시 사용자당 5초 간격 제한

---

## 8. 외부 서비스 통합

### 8.1 Google OAuth 2.0

#### 8.1.1 클라이언트 ID
```
47749527109-okb4qnrbp3tm7ov26sl77j64stm8jkue.apps.googleusercontent.com
```

#### 8.1.2 인증 플로우
```
1. 사용자 클릭: "Google 로그인" 버튼
   ↓
2. Google OAuth Popup 열림
   ↓
3. 사용자 Google 계정 선택 + 권한 승인
   ↓
4. Google → Frontend: ID Token 발급
   ↓
5. Frontend → Backend: POST /api/auth/google (idToken)
   ↓
6. Backend: Google ID Token 검증
   - https://oauth2.googleapis.com/tokeninfo?id_token={idToken}
   ↓
7. Backend: 사용자 정보 추출 (email, name, picture)
   ↓
8. Backend: DB에서 google_id로 사용자 조회
   - 없으면 신규 생성 (INSERT)
   - 있으면 정보 업데이트 (UPDATE)
   ↓
9. Backend: JWT 생성 (유효기간 10일)
   ↓
10. Backend → Frontend: { accessToken, userId, email, name, picture }
   ↓
11. Frontend: localStorage에 저장
   - accessToken
   - user (JSON 직렬화)
   ↓
12. 이후 모든 API 요청에 Authorization: Bearer {JWT} 포함
```

### 8.2 Google Cloud Vision API

#### 8.2.1 설정
```properties
# application.properties
google.cloud.vision.key-path=src/main/resources/keys/pure-episode-473612-k9-b755b5c694a9.json
```

#### 8.2.2 OCR 처리 로직
```java
// ReceiptOcrService.java
public Map<String, Object> detectReceiptText(String imagePath) {
    // 1. Vision API 클라이언트 생성
    ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
        .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
        .build();
    ImageAnnotatorClient vision = ImageAnnotatorClient.create(settings);

    // 2. 이미지 로드
    ByteString imgBytes = ByteString.readFrom(new FileInputStream(imagePath));
    Image img = Image.newBuilder().setContent(imgBytes).build();

    // 3. TEXT_DETECTION 요청
    Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
    AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
        .addFeatures(feat)
        .setImage(img)
        .build();

    // 4. API 호출
    BatchAnnotateImagesResponse response = vision.batchAnnotateImages(
        List.of(request)
    );

    // 5. 텍스트 추출
    TextAnnotation annotation = response.getResponses(0).getFullTextAnnotation();

    // 6. 좌표 기반 줄 단위 재구성
    Map<Integer, List<TextBlock>> lineMap = new TreeMap<>();
    for (Page page : annotation.getPagesList()) {
        for (Block block : page.getBlocksList()) {
            for (Paragraph paragraph : block.getParagraphsList()) {
                for (Word word : paragraph.getWordsList()) {
                    int y = word.getBoundingBox().getVertices(0).getY();
                    int lineKey = y / 25 * 25; // ±25px 범위로 그룹화
                    lineMap.computeIfAbsent(lineKey, k -> new ArrayList<>()).add(word);
                }
            }
        }
    }

    // 7. 각 줄 내에서 x좌표 정렬
    List<String> lines = new ArrayList<>();
    for (List<TextBlock> line : lineMap.values()) {
        line.sort(Comparator.comparingInt(w -> w.getBoundingBox().getVertices(0).getX()));
        String lineText = line.stream()
            .map(w -> w.getText())
            .collect(Collectors.joining(" "));
        lines.add(lineText);
    }

    // 8. 영수증 날짜 추출 (정규식)
    String receiptDate = extractReceiptDate(lines); // yyyy.MM.dd, yyyy/MM/dd, yyyy-MM-dd

    return Map.of("text", lines, "date", receiptDate);
}
```

#### 8.2.3 텍스트 파싱
```java
// ReceiptTextParser.java
public static List<Map<String, Object>> parseReceipt(List<String> lines) {
    Map<String, Integer> itemMap = new LinkedHashMap<>();

    for (String line : lines) {
        // 품목명 추출 (한글 2자 이상 또는 영문 3자 이상)
        String itemName = extractItemName(line);
        if (itemName == null) continue;

        // 수량 추출 (x숫자, 숫자개, 숫자봉 패턴)
        int quantity = extractQuantity(line);

        // 중복 품목 수량 합산
        itemMap.merge(itemName, quantity, Integer::sum);
    }

    // Map → List 변환
    return itemMap.entrySet().stream()
        .map(e -> Map.of("name", e.getKey(), "quantity", e.getValue()))
        .collect(Collectors.toList());
}
```

### 8.3 Google Gemini API

#### 8.3.1 설정
```properties
# application.properties
google.gemini.api-key=AIzaSyA1rU7KBElRN8qCfeijBvVDOY2xQFK-gso
google.gemini.model=gemini-2.0-flash-exp
```

#### 8.3.2 AI 레시피 생성 로직
```java
// GeminiRecipeGeneratorService.java
public GeminiRecipeResponse generateRecipe(GeminiRecipeRequest request) {
    Long userId = getCurrentUserId();

    // 1. Rate Limiting (사용자당 5초 간격)
    Instant lastRequest = userLastRequestMap.get(userId);
    if (lastRequest != null &&
        Duration.between(lastRequest, Instant.now()).getSeconds() < 5) {
        throw new RuntimeException("요청이 너무 빈번합니다. 5초 후 다시 시도해주세요.");
    }

    // 2. 중복 요청 방지 (동일 재료 조합)
    String ingredientHash = generateIngredientHash(request.getIngredients());
    if (recentRequests.containsKey(ingredientHash)) {
        throw new RuntimeException("동일한 재료로 이미 레시피를 생성 중입니다.");
    }

    // 3. 프롬프트 생성
    String prompt = buildPrompt(request);

    // 4. Gemini API 요청 (WebClient)
    String apiUrl = String.format(
        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
        modelName, apiKey
    );

    Map<String, Object> requestBody = Map.of(
        "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
        "generationConfig", Map.of(
            "responseMimeType", "application/json",
            "temperature", 0.7
        )
    );

    String response = webClient.post()
        .uri(apiUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(requestBody)
        .retrieve()
        .bodyToMono(String.class)
        .block(Duration.ofSeconds(30));

    // 5. JSON 파싱
    JsonObject json = JsonParser.parseString(response).getAsJsonObject();
    String recipeJson = json
        .getAsJsonArray("candidates").get(0).getAsJsonObject()
        .get("content").getAsJsonObject()
        .getAsJsonArray("parts").get(0).getAsJsonObject()
        .get("text").getAsString();

    // 6. RecipeDetail 변환
    RecipeDetail recipe = gson.fromJson(recipeJson, RecipeDetail.class);

    // 7. 요청 기록 업데이트
    userLastRequestMap.put(userId, Instant.now());
    recentRequests.put(ingredientHash, Instant.now());

    return new GeminiRecipeResponse(true, recipe, "레시피가 생성되었습니다.");
}
```

#### 8.3.3 프롬프트 구조
```java
private String buildPrompt(GeminiRecipeRequest request) {
    StringBuilder prompt = new StringBuilder();
    prompt.append("다음 조건에 맞는 레시피를 JSON 형식으로 생성해주세요:\n\n");

    prompt.append("사용할 재료:\n");
    for (IngredientInfo ingredient : request.getIngredients()) {
        prompt.append(String.format("- %s (%s)",
            ingredient.getName(), ingredient.getQuantity()));
        if (ingredient.getDaysUntilExpiry() != null && ingredient.getDaysUntilExpiry() <= 3) {
            prompt.append(" [소비기한 임박]");
        }
        prompt.append("\n");
    }

    if (request.getAdditionalRequirements() != null) {
        prompt.append("\n추가 요구사항: " + request.getAdditionalRequirements());
    }

    prompt.append("\n\n응답 JSON 형식:\n");
    prompt.append("{\n");
    prompt.append("  \"menu_name\": \"레시피 이름\",\n");
    prompt.append("  \"ingredients_used\": [{\"name\": \"재료명\", \"quantity\": \"양\"}],\n");
    prompt.append("  \"additional_ingredients\": [{\"name\": \"재료명\", \"quantity\": \"양\"}],\n");
    prompt.append("  \"cooking_steps\": [\"단계1\", \"단계2\", ...],\n");
    prompt.append("  \"estimated_cooking_time\": \"조리 시간\",\n");
    prompt.append("  \"difficulty_level\": \"난이도\",\n");
    prompt.append("  \"servings\": 인원수,\n");
    prompt.append("  \"nutritional_info\": {\"calories\": \"칼로리\", ...}\n");
    prompt.append("}\n");

    return prompt.toString();
}
```

### 8.4 만개의레시피 크롤링

#### 8.4.1 레시피 검색
```java
// RecipeCrawlerService.java
public List<RecipeSummary> searchRecipesByIngredients(List<String> ingredients) {
    String keyword = String.join(" ", ingredients);
    String searchUrl = "https://www.10000recipe.com/recipe/list.html?q=" +
        URLEncoder.encode(keyword, StandardCharsets.UTF_8);

    try {
        // 1. 검색 페이지 요청
        Document doc = Jsoup.connect(searchUrl)
            .timeout(8000)
            .userAgent("Mozilla/5.0")
            .get();

        // 2. 레시피 카드 추출
        Elements recipeCards = doc.select(".common_sp_list_ul li");

        // 3. 동영상 레시피 필터링 (이미지 레시피만)
        List<RecipeSummary> recipes = recipeCards.stream()
            .filter(card -> !card.select(".icon_vod").isEmpty() == false) // 동영상 제외
            .limit(5)
            .map(card -> {
                String title = card.select(".common_sp_caption_tit").text();
                String imageUrl = card.select("img").attr("src");
                String recipeUrl = "https://www.10000recipe.com" +
                    card.select("a").attr("href");

                return new RecipeSummary(title, imageUrl, recipeUrl);
            })
            .collect(Collectors.toList());

        return recipes;
    } catch (IOException e) {
        return Collections.emptyList();
    }
}
```

#### 8.4.2 레시피 상세 크롤링
```java
public RecipeDetail getRecipeDetail(String url) {
    try {
        Document doc = Jsoup.connect(url)
            .timeout(5000)
            .userAgent("Mozilla/5.0")
            .get();

        // 재료 추출
        List<String> ingredients = doc.select(".ready_ingre3 li")
            .stream()
            .map(Element::text)
            .collect(Collectors.toList());

        // 조리 순서 추출
        List<String> steps = doc.select(".view_step_cont")
            .stream()
            .map(Element::text)
            .collect(Collectors.toList());

        return new RecipeDetail(ingredients, steps);
    } catch (IOException e) {
        return null;
    }
}
```

---

## 9. 주요 기능 플로우

### 9.1 사용자 등록 및 로그인

```
┌─────────┐
│  사용자  │
└────┬────┘
     │ 1. "Google 로그인" 클릭
     ↓
┌────────────────────┐
│  Google OAuth      │
│  Popup             │
└────┬───────────────┘
     │ 2. 계정 선택 + 권한 승인
     ↓
┌────────────────────┐
│  Google            │
│  Authorization     │
│  Server            │
└────┬───────────────┘
     │ 3. ID Token 발급
     ↓
┌────────────────────┐
│  Frontend          │
│  (React)           │
└────┬───────────────┘
     │ 4. POST /api/auth/google
     │    Body: { idToken }
     ↓
┌────────────────────┐
│  Backend           │
│  (Spring Boot)     │
└────┬───────────────┘
     │ 5. Google ID Token 검증
     │    GET https://oauth2.googleapis.com/tokeninfo?id_token={idToken}
     ↓
┌────────────────────┐
│  Google            │
│  Token Info API    │
└────┬───────────────┘
     │ 6. 사용자 정보 반환
     │    { email, name, picture }
     ↓
┌────────────────────┐
│  Backend           │
│  (GoogleAuthService)│
└────┬───────────────┘
     │ 7. DB에서 google_id로 사용자 조회
     │    - 없으면: INSERT INTO users
     │    - 있으면: UPDATE users (name, email)
     ↓
┌────────────────────┐
│  MySQL             │
│  (users 테이블)    │
└────┬───────────────┘
     │ 8. user_id 반환
     ↓
┌────────────────────┐
│  Backend           │
│  (GoogleAuthService)│
└────┬───────────────┘
     │ 9. JWT 생성
     │    Payload: { sub: email, userId, name, exp: 10일 후 }
     │    Signature: HS256(secret)
     ↓
     │ 10. Response
     │     { accessToken, userId, email, name, picture }
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 11. localStorage 저장
     │     - accessToken
     │     - user (JSON)
     ↓
┌────────────────────┐
│  AuthProvider      │
│  (React Context)   │
└────┬───────────────┘
     │ 12. 전역 상태 업데이트
     │     isAuthenticated = true
     │     user = { userId, email, name, picture }
     ↓
     │ 13. 리다이렉트 → /dashboard
     ↓
┌────────────────────┐
│  Dashboard 페이지  │
└────────────────────┘
```

### 9.2 영수증 업로드 및 재료 등록

```
┌─────────┐
│  사용자  │
└────┬────┘
     │ 1. 영수증 이미지 선택 (드래그 앤 드롭 or 파일 선택)
     ↓
┌────────────────────┐
│  UploadReceipt.tsx │
└────┬───────────────┘
     │ 2. FormData 생성
     │    formData.append('file', file)
     ↓
     │ 3. XMLHttpRequest 업로드
     │    POST /receipt/upload
     │    Progress Event: 0-33% (업로드)
     ↓
┌────────────────────┐
│  ReceiptController │
└────┬───────────────┘
     │ 4. MultipartFile 수신
     │    임시 파일 저장 (File.createTempFile)
     ↓
     │ 5. ReceiptOcrService.detectReceiptText() 호출
     │    Progress: 33-66% (OCR 진행)
     ↓
┌────────────────────┐
│  Google Cloud      │
│  Vision API        │
└────┬───────────────┘
     │ 6. TEXT_DETECTION 수행
     │    - 텍스트 추출
     │    - 각 단어의 좌표 (x, y) 반환
     ↓
┌────────────────────┐
│  ReceiptOcrService │
└────┬───────────────┘
     │ 7. 좌표 기반 줄 단위 재구성
     │    - y좌표 ±25px 범위 = 같은 줄
     │    - 각 줄 내에서 x좌표로 정렬
     ↓
     │ 8. 영수증 날짜 추출
     │    정규식: yyyy.MM.dd, yyyy/MM/dd, yyyy-MM-dd
     │    실패 시 현재 날짜 사용
     ↓
     │ 9. ReceiptTextParser.parseReceipt() 호출
     ↓
┌────────────────────┐
│  ReceiptTextParser │
└────┬───────────────┘
     │ 10. 줄 단위 파싱
     │     - 품목명 추출 (한글 2자 이상, 영문 3자 이상)
     │     - 수량 추출 (x숫자, 숫자개, 숫자봉 패턴)
     │     - 중복 품목 자동 병합 (수량 합산)
     ↓
     │ 11. FoodClassifierService.classifyItems() 호출
     │     Progress: 66-100% (분류 진행)
     ↓
┌────────────────────┐
│ FoodClassifierService │
└────┬───────────────┘
     │ 12. 비식품 필터링
     │     제외: "봉투", "배송비", "쿠폰", "할인" 등
     ↓
     │ 13. 카테고리 분류 (키워드 기반)
     │     - 육류: "소고기", "돼지고기", "닭고기"...
     │     - 해산물: "새우", "고등어", "연어"...
     │     - 채소: "양파", "감자", "당근"...
     │     - 과일: "사과", "바나나", "딸기"...
     │     - 유제품: "우유", "치즈", "계란"...
     │     - 가공식품: "두부", "햄", "소시지"...
     │     - 기타: 분류 안 되는 품목
     ↓
     │ 14. 소비기한 계산
     │     만료일 = 구매일 + 카테고리별 기본 일수
     │     - 육류: +7일
     │     - 해산물: +3일
     │     - 채소: +7일
     │     - 과일: +10일
     │     - 유제품: +14일
     │     - 가공식품: +30일
     ↓
     │ 15. JSON 응답 생성
     │     [
     │       { name: "소고기", category: "육류", quantity: 1,
     │         purchaseDate: "2025-11-28", expireDate: "2025-12-05" },
     │       ...
     │     ]
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 16. 카테고리별 그룹화 표시
     │     { "육류": [...], "채소": [...] }
     ↓
┌─────────┐
│  사용자  │
└────┬────┘
     │ 17. 수량/카테고리 수정 (선택)
     ↓
     │ 18. "냉장고에 추가" 클릭
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 19. POST /api/refrigerator/items (배치)
     │     Body: [{ ingredientName, quantity, ... }, ...]
     ↓
┌────────────────────┐
│ RefrigeratorController │
└────┬───────────────┘
     │ 20. RefrigeratorItem 엔티티 생성
     │     status 자동 계산:
     │     - 만료일 - 오늘 > 7일: FRESH
     │     - 4-7일: NORMAL
     │     - 1-3일: WARNING
     │     - 만료: EXPIRED
     ↓
┌────────────────────┐
│  MySQL             │
│  (refrigerator_items)│
└────┬───────────────┘
     │ 21. INSERT 완료
     ↓
     │ 22. 성공 응답
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 23. 성공 메시지 + 냉장고 페이지로 이동
     ↓
┌─────────┐
│  사용자  │
└─────────┘
```

### 9.3 AI 레시피 생성

```
┌─────────┐
│  사용자  │
└────┬────┘
     │ 1. "AI 레시피 생성" 메뉴 클릭
     ↓
┌────────────────────┐
│  RecipeAI.tsx      │
└────┬───────────────┘
     │ 2. GET /api/refrigerator/items (냉장고 재료 목록 로드)
     ↓
┌─────────┐
│  사용자  │
└────┬────┘
     │ 3. 재료 선택 (체크박스)
     │    - 소비기한 임박 재료는 자동 선택
     │    - 우선순위 점수 자동 계산
     ↓
     │ 4. 추가 요구사항 입력 (선택)
     │    예: "매운 맛으로 해주세요"
     ↓
     │ 5. "레시피 생성" 버튼 클릭
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 6. POST /api/recipes/generate/ai
     │    Body: {
     │      ingredients: [
     │        { name: "소고기", quantity: "300g", priorityScore: 5, daysUntilExpiry: 2 }
     │      ],
     │      additionalRequirements: "매운 맛으로 해주세요"
     │    }
     ↓
┌────────────────────┐
│ GeminiRecipeGeneratorService │
└────┬───────────────┘
     │ 7. Rate Limiting 체크
     │    - 사용자당 5초 간격 제한
     │    - 위반 시: 에러 반환
     ↓
     │ 8. 중복 요청 방지
     │    - 재료 조합 해시 생성
     │    - 동일 해시 존재 시: 에러 반환
     ↓
     │ 9. 구조화된 프롬프트 생성
     │    - 사용할 재료 목록
     │    - 소비기한 임박 재료 강조
     │    - 추가 요구사항
     │    - 응답 JSON 스키마 명시
     ↓
     │ 10. WebClient → POST Gemini API
     │     URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
     │     Body: {
     │       contents: [{ parts: [{ text: prompt }] }],
     │       generationConfig: {
     │         responseMimeType: "application/json",
     │         temperature: 0.7
     │       }
     │     }
     ↓
┌────────────────────┐
│  Google Gemini API │
└────┬───────────────┘
     │ 11. AI 레시피 생성 (약 5-15초)
     │     - 재료 기반 메뉴 결정
     │     - 조리 순서 생성
     │     - 영양 정보 계산
     ↓
     │ 12. JSON 응답
     │     {
     │       candidates: [{
     │         content: {
     │           parts: [{
     │             text: "{\"menu_name\": \"소고기 매운 볶음\", ...}"
     │           }]
     │         }
     │       }]
     │     }
     ↓
┌────────────────────┐
│ GeminiRecipeGeneratorService │
└────┬───────────────┘
     │ 13. JSON 파싱 및 검증
     │     - Gson → RecipeDetail 객체 변환
     │     - 필수 필드 검증 (menu_name, cooking_steps)
     ↓
     │ 14. 요청 기록 업데이트
     │     - userLastRequestMap 업데이트
     │     - recentRequests 업데이트
     ↓
     │ 15. GeminiRecipeResponse 반환
     │     { success: true, recipe: {...}, message: "레시피가 생성되었습니다." }
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 16. 레시피 표시
     │     - 메뉴 이름
     │     - 사용된 재료 (냉장고에 있는 재료)
     │     - 추가 재료 (구매 필요)
     │     - 조리 순서 (단계별)
     │     - 예상 조리 시간
     │     - 난이도
     │     - 영양 정보
     ↓
┌─────────┐
│  사용자  │
└────┬────┘
     │ 17. "레시피 저장" 클릭 (선택)
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 18. POST /api/recipes
     │     Body: {
     │       title: "소고기 매운 볶음",
     │       description: "...",
     │       ingredients: [...],
     │       steps: [...],
     │       isAiGenerated: true
     │     }
     ↓
┌────────────────────┐
│  RecipeController  │
└────┬───────────────┘
     │ 19. Recipe 엔티티 생성
     │     - user_id: 현재 사용자
     │     - is_ai_generated: true
     │     - RecipeIngredient, RecipeStep 자동 생성 (Cascade)
     ↓
┌────────────────────┐
│  MySQL             │
│  (recipes 테이블)  │
└────┬───────────────┘
     │ 20. INSERT 완료 (recipe_id 반환)
     ↓
     │ 21. 성공 응답
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 22. 레시피 상세 페이지로 이동
     │     /recipes/:id
     ↓
┌─────────┐
│  사용자  │
└─────────┘
```

### 9.4 레시피 추천 (Unified)

```
┌─────────┐
│  사용자  │
└────┬────┘
     │ 1. 대시보드 접속 OR "재료 기반 추천" 클릭
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 2. GET /api/recipes/recommendations/unified
     ↓
┌────────────────────┐
│ UnifiedRecipeRecommendationService │
└────┬───────────────┘
     │ 3. 사용자 냉장고 재료 조회
     │    SELECT * FROM refrigerator_items WHERE user_id = ?
     ↓
     │ 4. 병렬 처리 시작
     │    CompletableFuture.allOf(localFuture, crawlFuture)
     ┌─────────────────┬─────────────────┐
     │ 로컬 DB 검색    │ 크롤링 검색     │
     │ (3초 타임아웃) │ (12초 타임아웃) │
     ↓                 ↓                 ↓
┌────────────────┐ ┌────────────────┐
│ RecipeRecommendationService │ │ RecipeCrawlerService │
└────┬───────────┘ └────┬───────────┘
     │                   │
     │ 5-A. 모든 레시피 조회    │ 5-B. 만개의레시피 검색
     │ SELECT * FROM recipes    │ GET https://www.10000recipe.com/recipe/list.html?q={ingredients}
     ↓                   ↓
     │ 6-A. 재료 매칭           │ 6-B. HTML 파싱 (Jsoup)
     │ - 각 레시피의 재료 추출  │ - 레시피 카드 추출
     │ - 냉장고 재료와 교집합   │ - 동영상 레시피 필터링 (이미지만)
     │ - 최소 1개 이상 매칭     │ - 상위 5개 선택
     ↓                   ↓
     │ 7-A. 정렬               │ 7-B. 재료 정보 추출
     │ - 1순위: 매칭률         │ - 레시피 상세 페이지 크롤링
     │ - 2순위: 조회수         │ - 재료 목록 파싱
     │ - 3순위: 좋아요         │
     │ - 4순위: 평점           │
     ↓                   ↓
     │ 8-A. LocalRecipeDTO[] 반환 │ 8-B. ExternalRecipeDTO[] 반환
     └─────────────────┴─────────────────┘
                   ↓
┌────────────────────┐
│ RecipeSourceMerger │
└────┬───────────────┘
     │ 9. 로컬 + 크롤링 결과 병합
     ↓
     │ 10. 우선순위 정렬
     │     - PRIORITIZATION.EXPIRY_FIRST: 소비기한 임박 재료 포함 우선
     │     - PRIORITIZATION.MATCH_RATE: 매칭률 높은 순
     │     - PRIORITIZATION.MIXED: 혼합 (기본값)
     ↓
     │ 11. 매칭률 계산
     │     matchRate = (매칭된 재료 수) / (레시피 전체 재료 수) * 100
     ↓
     │ 12. minMatchRate 필터링
     │     - 기본값: 0% (모든 레시피)
     │     - 사용자 지정 가능 (예: 50% 이상만)
     ↓
     │ 13. 중복 제거
     │     - URL 기준으로 중복 제거
     │     - 동일 제목 + 출처가 다른 경우는 유지
     ↓
     │ 14. UnifiedRecipeResponse[] 생성
     │     [
     │       {
     │         recipeId: 123,
     │         title: "소고기 카레",
     │         source: "LOCAL_DB",
     │         matchedIngredients: ["소고기", "양파", "당근"],
     │         missingIngredients: ["카레가루"],
     │         matchRate: 75
     │       },
     │       {
     │         title: "비프 스튜",
     │         source: "EXTERNAL_CRAWL",
     │         url: "https://www.10000recipe.com/...",
     │         matchedIngredients: ["소고기", "양파"],
     │         missingIngredients: ["토마토", "와인"],
     │         matchRate: 50
     │       }
     │     ]
     ↓
┌────────────────────┐
│  Frontend          │
└────┬───────────────┘
     │ 15. 레시피 카드 표시
     │     - 매칭률 퍼센티지 (프로그레스 바)
     │     - 매칭된 재료 (초록색)
     │     - 부족한 재료 (회색)
     │     - 출처 배지 (로컬 DB / 외부 크롤링)
     ↓
┌─────────┐
│  사용자  │
└────┬────┘
     │ 16. 레시피 클릭
     ↓
     │ - 로컬 DB 레시피: /recipes/:id (상세 페이지)
     │ - 외부 크롤링: 새 탭으로 원본 URL 열기
     ↓
┌─────────┐
│  사용자  │
└─────────┘
```

---

## 10. 배포 및 환경 설정

### 10.1 Frontend 환경 변수 (.env)

```env
# API 서버 URL
VITE_API_BASE_URL=http://localhost:8080

# Google OAuth Client ID
VITE_CLIENT_ID=47749527109-okb4qnrbp3tm7ov26sl77j64stm8jkue.apps.googleusercontent.com

# Mock 데이터 사용 여부 (개발용)
VITE_USE_MOCK=false
```

### 10.2 Backend 환경 변수 (application.properties)

```properties
# Server
server.port=8080

# Google OAuth
google.oauth.client-id=47749527109-okb4qnrbp3tm7ov26sl77j64stm8jkue.apps.googleusercontent.com

# JWT Secret (프로덕션에서 반드시 변경!)
security.jwt.secret=please-change-this-in-production-and-keep-it-long-and-secure

# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/amazing_potatoes?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul
spring.datasource.username=root
spring.datasource.password=your-password-here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Google Gemini API
google.gemini.api-key=AIzaSyA1rU7KBElRN8qCfeijBvVDOY2xQFK-gso
google.gemini.model=gemini-2.0-flash-exp
google.gemini.api-url=https://generativelanguage.googleapis.com/v1beta/models/

# Google Cloud Vision API
google.cloud.vision.key-path=src/main/resources/keys/pure-episode-473612-k9-b755b5c694a9.json

# File Upload
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
file.upload.dir=src/main/resources/img
file.upload.url-prefix=/api/images
```

### 10.3 배포 시 체크리스트

#### 보안
- [ ] JWT Secret 변경 (긴 랜덤 문자열)
- [ ] MySQL 비밀번호 강화
- [ ] Google API 키 환경변수로 분리
- [ ] CORS allowedOrigins 프로덕션 도메인으로 변경
- [ ] application.properties를 .gitignore에 추가
- [ ] Google Cloud Vision 키 파일 보안 관리

#### 데이터베이스
- [ ] MySQL 8.0+ 설치 및 설정
- [ ] 데이터베이스 `amazing_potatoes` 생성
- [ ] 인덱스 최적화 (expiration_date, user_id, category 등)
- [ ] 백업 정책 수립

#### API 제한
- [ ] Rate Limiting 강화 (현재 Gemini만 5초 제한)
- [ ] 파일 업로드 크기 제한 검증
- [ ] API 응답 페이징 설정 (기본 size=12)

#### 외부 서비스
- [ ] Google OAuth 리다이렉트 URI 등록
- [ ] Google Cloud Vision API 할당량 확인
- [ ] Google Gemini API 사용량 모니터링
- [ ] 만개의레시피 크롤링 robots.txt 준수

#### 성능
- [ ] 프론트엔드 빌드 최적화 (`npm run build`)
- [ ] 정적 파일 CDN 연동 (선택)
- [ ] 데이터베이스 커넥션 풀 설정
- [ ] 크롤링 타임아웃 조정 (현재 8초)

### 10.4 실행 방법

#### Frontend
```bash
cd frontend
npm install
npm run dev  # 개발 서버 (http://localhost:5173)
npm run build  # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

#### Backend
```bash
cd backend
mvn clean install  # 의존성 설치
mvn spring-boot:run  # 개발 서버 (http://localhost:8080)
```

#### Database
```sql
-- MySQL 데이터베이스 생성
CREATE DATABASE amazing_potatoes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- JPA가 자동으로 테이블 생성 (spring.jpa.hibernate.ddl-auto=update)
-- 또는 수동으로 스키마 실행
```

---

## 부록: 주요 기술 결정 사항

### A. 왜 JWT 기반 인증을 선택했나?
- Stateless: 서버 확장성 우수 (세션 불필요)
- 프론트엔드-백엔드 분리 아키텍처에 적합
- Google OAuth와 자연스러운 통합

### B. 왜 Unified 추천 시스템을 사용했나?
- 로컬 DB만으로는 레시피 데이터 부족
- 외부 크롤링으로 다양성 확보
- 병렬 처리로 응답 속도 개선 (로컬 3초 + 크롤링 12초)

### C. 왜 Google Gemini API를 선택했나?
- 구조화된 JSON 응답 지원 (responseMimeType)
- 무료 할당량 제공 (실험적 모델)
- 한국어 레시피 생성 품질 우수

### D. 왜 Spring Data JPA를 사용했나?
- 보일러플레이트 코드 감소
- N+1 문제 자동 최적화 (LAZY 로딩)
- 복잡한 쿼리는 @Query로 커스터마이징 가능

### E. 왜 React + TypeScript를 선택했나?
- 타입 안정성으로 런타임 에러 감소
- 컴포넌트 재사용성 우수
- Vite로 빠른 개발 경험

---

## 문서 버전
- **작성일**: 2025-11-28
- **버전**: 1.0
- **프로젝트**: AMAZING POTATOES - AI 기반 식재료 재고 관리 서비스
