-- =====================================================
-- 냉장고 재고 관리 및 레시피 공유 서비스
-- 데이터베이스 초기화 스크립트
-- =====================================================

-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS amazing_potatoes
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE amazing_potatoes;

-- 기존 테이블 삭제 (순서 중요: 외래키 참조 관계 역순)
DROP TABLE IF EXISTS saved_recipes;
DROP TABLE IF EXISTS recipe_likes;
DROP TABLE IF EXISTS recipe_ratings;
DROP TABLE IF EXISTS recipe_comments;
DROP TABLE IF EXISTS recipe_tags;
DROP TABLE IF EXISTS recipe_steps;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS refrigerator_items;
DROP TABLE IF EXISTS users;

-- =====================================================
-- 1. Users (회원)
-- =====================================================
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_google_id (google_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. Refrigerator_Items (냉장고 재료)
-- =====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. Recipes (레시피)
-- =====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. Recipe_Ingredients (레시피 재료)
-- =====================================================
CREATE TABLE recipe_ingredients (
    recipe_ingredient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,

    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_ingredient_name (ingredient_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. Recipe_Steps (조리 순서)
-- =====================================================
CREATE TABLE recipe_steps (
    step_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    description TEXT NOT NULL,

    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    UNIQUE KEY unique_recipe_step (recipe_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. Recipe_Tags (레시피 태그)
-- =====================================================
CREATE TABLE recipe_tags (
    tag_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_tag_name (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. Recipe_Comments (레시피 댓글)
-- =====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. Recipe_Ratings (레시피 별점)
-- =====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. Recipe_Likes (레시피 좋아요)
-- =====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. Saved_Recipes (저장한 레시피)
-- =====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 초기 데이터 삽입
-- =====================================================

-- 테스트 사용자 생성
INSERT INTO users (google_id, email, name) VALUES
('google_test_001', 'user1@example.com', '김철수'),
('google_test_002', 'user2@example.com', '이영희'),
('google_test_003', 'user3@example.com', '박민수');

-- 냉장고 재료 샘플 데이터
INSERT INTO refrigerator_items (user_id, ingredient_name, quantity, purchase_date, expiration_date, storage_method, status, category) VALUES
(1, '양파', '2개', '2025-11-20', '2025-12-05', 'ROOM_TEMP', 'FRESH', '채소'),
(1, '당근', '500g', '2025-11-21', '2025-12-01', 'FRIDGE', 'NORMAL', '채소'),
(1, '달걀', '10개', '2025-11-22', '2025-11-30', 'FRIDGE', 'WARNING', '유제품'),
(1, '우유', '1L', '2025-11-23', '2025-11-29', 'FRIDGE', 'WARNING', '유제품'),
(1, '돼지고기', '300g', '2025-11-24', '2025-11-27', 'FRIDGE', 'FRESH', '육류'),
(2, '감자', '1kg', '2025-11-20', '2025-12-10', 'ROOM_TEMP', 'FRESH', '채소'),
(2, '토마토', '5개', '2025-11-22', '2025-11-28', 'FRIDGE', 'NORMAL', '채소'),
(2, '닭고기', '500g', '2025-11-24', '2025-11-27', 'FRIDGE', 'WARNING', '육류');

-- =====================================================
-- 완료 메시지
-- =====================================================
SELECT '데이터베이스 초기화가 완료되었습니다!' AS message;
