# 냉장고 재고 관리 및 레시피 공유 서비스 - 데이터베이스 설계서

## 📋 프로젝트 개요
- **서비스명**: 냉장고 재고 관리 및 레시피 공유 플랫폼
- **기술 스택**: Java Spring Boot, MySQL, React + Vite
- **인증 방식**: Google OAuth 2.0
- **개발 단계**: MVP (Minimum Viable Product)

---

## 🗂️ 데이터베이스 구조

### ERD 개요
```
Users (1) ─────< (N) Refrigerator_Items
  │
  ├──< (N) Recipes
  │      │
  │      ├──< (N) Recipe_Ingredients
  │      ├──< (N) Recipe_Steps
  │      ├──< (N) Recipe_Tags
  │      ├──< (N) Recipe_Comments
  │      ├──< (N) Recipe_Ratings
  │      └──< (N) Recipe_Likes
  │
  ├──< (N) Saved_Recipes ──> (N) Recipes
  ├──< (N) Recipe_Comments
  ├──< (N) Recipe_Ratings
  └──< (N) Recipe_Likes
```

---

## 📊 테이블 상세 설계

### 1. Users (회원)
사용자 기본 정보를 저장하는 테이블

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

**컬럼 설명:**
- `user_id`: 사용자 고유 식별자 (PK)
- `google_id`: 구글 계정 고유 ID (OAuth)
- `email`: 사용자 이메일 (구글에서 가져옴)
- `name`: 사용자 이름 (구글에서 가져옴)
- `created_at`: 회원가입 일시
- `updated_at`: 정보 수정 일시

---

### 2. Refrigerator_Items (냉장고 재료)
사용자의 냉장고에 보관 중인 재료 정보

```sql
CREATE TABLE refrigerator_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    purchase_date DATE,
    expiration_date DATE,
    storage_method ENUM('FRIDGE', 'FREEZER', 'ROOM_TEMP') NOT NULL,
    status ENUM('FRESH', 'NORMAL', 'WARNING', 'EXPIRED') DEFAULT 'FRESH',
    category VARCHAR(50),
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expiration_date (expiration_date)
);
```

**컬럼 설명:**
- `item_id`: 재료 항목 고유 식별자 (PK)
- `user_id`: 소유자 (FK → users)
- `ingredient_name`: 재료명 (예: 양파, 당근)
- `quantity`: 수량 + 단위 통합 (예: "500g", "2개", "1L")
- `purchase_date`: 구매 일자
- `expiration_date`: 소비기한
- `storage_method`: 보관 방법
  - `FRIDGE`: 냉장
  - `FREEZER`: 냉동
  - `ROOM_TEMP`: 실온
- `status`: 재료 상태
  - `FRESH`: 신선
  - `NORMAL`: 보통
  - `WARNING`: 주의 (소비기한 임박)
  - `EXPIRED`: 만료
- `category`: 재료 카테고리 (채소, 육류, 유제품, 조미료 등)
- `memo`: 메모

---

### 3. Recipes (레시피)
사용자가 작성한 레시피 정보

```sql
CREATE TABLE recipes (
    recipe_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    main_image_url VARCHAR(500),
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    cooking_time INT NOT NULL,
    servings INT,
    category VARCHAR(50),
    
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    
    rating_sum INT DEFAULT 0,
    rating_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_view_count (view_count),
    INDEX idx_like_count (like_count),
    INDEX idx_average_rating (average_rating),
    INDEX idx_created_at (created_at),
    INDEX idx_category (category)
);
```

**컬럼 설명:**
- `recipe_id`: 레시피 고유 식별자 (PK)
- `user_id`: 작성자 (FK → users)
- `title`: 레시피 제목
- `description`: 레시피 설명
- `main_image_url`: 대표 이미지 URL
- `difficulty`: 난이도 (쉬움/보통/어려움)
- `cooking_time`: 조리 시간 (분 단위)
- `servings`: 몇 인분
- `category`: 요리 종류 (한식, 양식, 중식, 일식, 디저트 등)
- `view_count`: 조회수
- `like_count`: 좋아요 수
- `comment_count`: 댓글 수
- `save_count`: 저장 횟수
- `rating_sum`: 별점 합계
- `rating_count`: 별점 참여자 수
- `average_rating`: 평균 별점 (0.00 ~ 5.00)
- `is_ai_generated`: AI 창작 레시피 여부

---

### 4. Recipe_Ingredients (레시피 재료)
레시피에 필요한 재료 목록

```sql
CREATE TABLE recipe_ingredients (
    recipe_ingredient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_ingredient_name (ingredient_name)
);
```

**컬럼 설명:**
- `recipe_ingredient_id`: 재료 항목 고유 식별자 (PK)
- `recipe_id`: 레시피 (FK → recipes)
- `ingredient_name`: 재료명
- `quantity`: 수량 + 단위 통합 (예: "500g", "2개", "1큰술")

---

### 5. Recipe_Steps (조리 순서)
레시피의 단계별 조리 방법

```sql
CREATE TABLE recipe_steps (
    step_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    description TEXT NOT NULL,
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    UNIQUE KEY unique_recipe_step (recipe_id, step_number)
);
```

**컬럼 설명:**
- `step_id`: 단계 고유 식별자 (PK)
- `recipe_id`: 레시피 (FK → recipes)
- `step_number`: 단계 순서 (1, 2, 3...)
- `description`: 조리 방법 설명 (텍스트만)

**제약조건:**
- `unique_recipe_step`: 같은 레시피 내에서 step_number 중복 불가

---

### 6. Recipe_Tags (레시피 태그)
레시피 분류를 위한 태그

```sql
CREATE TABLE recipe_tags (
    tag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_tag_name (tag_name)
);
```

**컬럼 설명:**
- `tag_id`: 태그 고유 식별자 (PK)
- `recipe_id`: 레시피 (FK → recipes)
- `tag_name`: 태그명 (비건, 다이어트, 간편식, 아침 등)

---

### 7. Recipe_Comments (레시피 댓글)
레시피에 달린 댓글

```sql
CREATE TABLE recipe_comments (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

**컬럼 설명:**
- `comment_id`: 댓글 고유 식별자 (PK)
- `recipe_id`: 레시피 (FK → recipes)
- `user_id`: 작성자 (FK → users)
- `content`: 댓글 내용
- `created_at`: 작성 일시
- `updated_at`: 수정 일시

---

### 8. Recipe_Ratings (레시피 별점)
레시피에 대한 별점 평가

```sql
CREATE TABLE recipe_ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_rating (user_id, recipe_id),
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_user_id (user_id)
);
```

**컬럼 설명:**
- `rating_id`: 별점 고유 식별자 (PK)
- `recipe_id`: 레시피 (FK → recipes)
- `user_id`: 평가자 (FK → users)
- `rating`: 별점 (1~5점)
- `created_at`: 평가 일시
- `updated_at`: 수정 일시

**제약조건:**
- `unique_user_rating`: 한 사용자당 레시피 하나에 별점 1개만 가능
- `CHECK (rating >= 1 AND rating <= 5)`: 별점은 1~5점만 가능

**별점 계산 로직:**
- 새 별점 등록 시: `recipes.rating_sum`에 추가, `rating_count` 증가
- 별점 수정 시: `rating_sum` 조정
- `average_rating` = `rating_sum` / `rating_count`

---

### 9. Recipe_Likes (레시피 좋아요)
레시피에 대한 좋아요

```sql
CREATE TABLE recipe_likes (
    like_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_like (user_id, recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_recipe_id (recipe_id)
);
```

**컬럼 설명:**
- `like_id`: 좋아요 고유 식별자 (PK)
- `user_id`: 좋아요 한 사용자 (FK → users)
- `recipe_id`: 레시피 (FK → recipes)
- `created_at`: 좋아요 일시

**제약조건:**
- `unique_user_like`: 한 사용자당 레시피 하나에 좋아요 1개만 가능

**좋아요 개수 관리:**
- 좋아요 추가 시: `Recipe_Likes` 테이블에 레코드 추가 + `recipes.like_count` 증가
- 좋아요 취소 시: `Recipe_Likes` 테이블에서 레코드 삭제 + `recipes.like_count` 감소
- 조회 시: `recipes.like_count` 컬럼 사용 (별도 COUNT 쿼리 불필요)

---

### 10. Saved_Recipes (저장한 레시피)
사용자가 북마크한 레시피

```sql
CREATE TABLE saved_recipes (
    saved_recipe_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe (user_id, recipe_id),
    INDEX idx_user_id (user_id),
    INDEX idx_recipe_id (recipe_id)
);
```

**컬럼 설명:**
- `saved_recipe_id`: 저장 고유 식별자 (PK)
- `user_id`: 저장한 사용자 (FK → users)
- `recipe_id`: 저장된 레시피 (FK → recipes)
- `saved_at`: 저장 일시

**제약조건:**
- `unique_user_recipe`: 한 사용자가 같은 레시피를 중복 저장할 수 없음

**저장 횟수 관리:**
- 레시피 저장 시: `Saved_Recipes` 테이블에 레코드 추가 + `recipes.save_count` 증가
- 저장 취소 시: `Saved_Recipes` 테이블에서 레코드 삭제 + `recipes.save_count` 감소

---

## 🔄 주요 비즈니스 로직

### 1. 냉장고 재료 상태 자동 업데이트
```java
// 소비기한 기준 상태 자동 계산
LocalDate today = LocalDate.now();
LocalDate expirationDate = item.getExpirationDate();

if (expirationDate.isBefore(today)) {
    item.setStatus(ItemStatus.EXPIRED);
} else if (expirationDate.minusDays(3).isBefore(today)) {
    item.setStatus(ItemStatus.WARNING);
} else if (expirationDate.minusDays(7).isBefore(today)) {
    item.setStatus(ItemStatus.NORMAL);
} else {
    item.setStatus(ItemStatus.FRESH);
}
```

### 2. 레시피 별점 평균 계산
```java
@Transactional
public void updateRating(Long recipeId, Long userId, int newRating) {
    Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
    RecipeRating existingRating = ratingRepository.findByUserIdAndRecipeId(userId, recipeId);
    
    if (existingRating == null) {
        // 새 별점 등록
        recipe.setRatingSum(recipe.getRatingSum() + newRating);
        recipe.setRatingCount(recipe.getRatingCount() + 1);
    } else {
        // 기존 별점 수정
        int oldRating = existingRating.getRating();
        recipe.setRatingSum(recipe.getRatingSum() - oldRating + newRating);
    }
    
    // 평균 계산
    BigDecimal average = BigDecimal.valueOf((double) recipe.getRatingSum() / recipe.getRatingCount())
            .setScale(2, RoundingMode.HALF_UP);
    recipe.setAverageRating(average);
}
```

### 3. 재료 기반 레시피 추천 알고리즘 (간단 버전)
```java
// 사용자의 냉장고 재료로 만들 수 있는 레시피 찾기
public List<Recipe> recommendRecipesByIngredients(Long userId) {
    List<String> userIngredients = refrigeratorItemRepository
            .findByUserId(userId)
            .stream()
            .map(RefrigeratorItem::getIngredientName)
            .collect(Collectors.toList());
    
    // 레시피의 필수 재료와 매칭
    return recipeRepository.findAll().stream()
            .filter(recipe -> {
                List<String> requiredIngredients = recipe.getIngredients()
                        .stream()
                        .map(RecipeIngredient::getIngredientName)
                        .collect(Collectors.toList());
                
                // 사용자가 가진 재료로 만들 수 있는 비율 계산
                long matchCount = requiredIngredients.stream()
                        .filter(userIngredients::contains)
                        .count();
                
                double matchRate = (double) matchCount / requiredIngredients.size();
                return matchRate >= 0.7; // 70% 이상 매칭
            })
            .sorted(Comparator.comparing(Recipe::getAverageRating).reversed())
            .collect(Collectors.toList());
}
```

---

## 📝 주요 쿼리 예시

### 1. 3일 내 만료 예정 재료 조회
```sql
SELECT * FROM refrigerator_items
WHERE user_id = ?
  AND expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
ORDER BY expiration_date ASC;
```

### 2. 인기 레시피 조회 (좋아요 + 별점 기준)
```sql
SELECT * FROM recipes
WHERE is_deleted = false
ORDER BY like_count DESC, average_rating DESC, view_count DESC
LIMIT 10;
```

### 3. 특정 재료를 포함한 레시피 검색
```sql
SELECT DISTINCT r.*
FROM recipes r
JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
WHERE ri.ingredient_name LIKE '%양파%'
ORDER BY r.average_rating DESC;
```

### 4. 사용자가 저장한 레시피 목록
```sql
SELECT r.* FROM recipes r
JOIN saved_recipes sr ON r.recipe_id = sr.recipe_id
WHERE sr.user_id = ?
ORDER BY sr.saved_at DESC;
```

### 5. 레시피 상세 조회 (재료, 단계, 태그 포함)
```sql
-- 레시피 기본 정보
SELECT * FROM recipes WHERE recipe_id = ?;

-- 재료 목록
SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY recipe_ingredient_id;

-- 조리 단계
SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number;

-- 태그
SELECT tag_name FROM recipe_tags WHERE recipe_id = ?;

-- 댓글 (페이징)
SELECT c.*, u.name as user_name
FROM recipe_comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.recipe_id = ?
ORDER BY c.created_at DESC
LIMIT ? OFFSET ?;
```

---

## 🎯 대시보드 데이터 조회

### 메인 대시보드에 필요한 정보
1. **인기 레시피 TOP 5**
```sql
SELECT * FROM recipes
ORDER BY view_count DESC, like_count DESC
LIMIT 5;
```

2. **냉장고 총 품목 수**
```sql
SELECT COUNT(*) FROM refrigerator_items WHERE user_id = ?;
```

3. **3일 내 만료 예정 아이템**
```sql
SELECT * FROM refrigerator_items
WHERE user_id = ?
  AND expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
ORDER BY expiration_date ASC;
```

---

## 🔐 인덱스 전략

### 성능 최적화를 위한 주요 인덱스
1. **Users**: `google_id`, `email` (UNIQUE 제약조건으로 자동 인덱스)
2. **Refrigerator_Items**: `user_id`, `expiration_date` (만료일 기준 조회 빈번)
3. **Recipes**: `user_id`, `view_count`, `like_count`, `average_rating`, `created_at`, `category`
4. **Recipe_Ingredients**: `recipe_id`, `ingredient_name` (재료 검색 시 사용)
5. **Recipe_Steps**: `recipe_id`
6. **Recipe_Tags**: `recipe_id`, `tag_name` (태그 검색 시 사용)
7. **Recipe_Comments**: `recipe_id`, `user_id`, `created_at`
8. **Recipe_Ratings**: `recipe_id`, `user_id`
9. **Recipe_Likes**: `user_id`, `recipe_id`
10. **Saved_Recipes**: `user_id`, `recipe_id`

---

## 📌 데이터 무결성 규칙

### Foreign Key Cascade 정책
- `ON DELETE CASCADE`: 부모 레코드 삭제 시 자식 레코드 자동 삭제
  - Users 삭제 → 해당 사용자의 모든 데이터 삭제
  - Recipes 삭제 → 해당 레시피의 재료, 단계, 태그, 댓글, 좋아요, 별점 모두 삭제

### UNIQUE 제약조건
- `users.google_id`, `users.email`: 중복 불가
- `recipe_steps (recipe_id, step_number)`: 같은 레시피 내 단계 번호 중복 불가
- `recipe_ratings (user_id, recipe_id)`: 한 사용자당 레시피 1개만 별점 등록 가능
- `recipe_likes (user_id, recipe_id)`: 한 사용자당 레시피 1개만 좋아요 가능
- `saved_recipes (user_id, recipe_id)`: 한 사용자당 레시피 1개만 저장 가능

### CHECK 제약조건
- `recipe_ratings.rating`: 1~5 범위만 허용

---

## 🚀 다음 단계

### 1. Spring Boot Entity 작성
- JPA Entity 클래스 생성
- Entity 간 연관관계 매핑

### 2. Repository 계층
- JpaRepository 인터페이스 작성
- Custom Query 메서드 정의

### 3. Service 계층
- 비즈니스 로직 구현
- 트랜잭션 관리

### 4. Controller 계층
- RESTful API 엔드포인트 구현
- DTO 설계

### 5. 보안
- Spring Security + JWT 설정
- OAuth 2.0 Google Login 통합

---

## 📚 참고사항

### MVP 범위 확인
- ✅ 구글 소셜 로그인
- ✅ 냉장고 재료 관리 (CRUD)
- ✅ 레시피 게시판 (작성, 조회, 수정, 삭제)
- ✅ 레시피 상호작용 (좋아요, 댓글, 별점, 저장)
- ✅ 재료 기반 레시피 추천
- ✅ 메인 대시보드
- ⏳ OCR 기능 (개발 중)
- ⏳ AI 창작 레시피 (향후 구현)

### MVP에서 제외된 기능
- ❌ 회원 탈퇴
- ❌ 활동 통계
- ❌ 권한 관리 (Admin)
- ❌ 알림 기능
- ❌ 프로필 사진
- ❌ Refresh Token 관리

---

**작성일**: 2025-11-14  
**버전**: 1.0 (MVP)
