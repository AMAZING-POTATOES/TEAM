# OCR 비정형 데이터 정규화 기반의 재고 관리 및 LLM 능동형 레시피 생성 시스템
**Inventory Management based on OCR Normalization & LLM Proactive Recipe Generation System**

<div align="center">

![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)
[![Notion](https://img.shields.io/badge/Notion-Team%20Scrum-000000?style=flat-square&logo=notion&logoColor=white)](https://www.notion.so/2b9f823f8f7080cdb65ae05c820c1232?source=copy_link)

</div>

---

## 👥 팀 소개 - 냉장고를 부탁해 (AMAZING POTATOES)
**팀 번호**: 01팀

| 역할 | 이름 | 학번 | 담당 |
|------|------|------|------|
| 팀장 | 이예린 | 2024042008 | Google Vision API 연동 및 AI 레시피 생성 |
| 팀원 | 전성현 | 2022041053 | 백엔드 개발 및 프론트엔드와 API 연동 |
| 팀원 | 한정우 | 2024042084 | 디자인 총괄 및 프론트엔드 개발 |

---

## 📖 프로젝트 개요

냉장고 속 식재료를 효율적으로 관리하고 음식 낭비를 줄이기 위한 통합 서비스입니다.  
영수증 스캔으로 식품을 자동 등록하고, 소비기한 임박 시 알림을 제공합니다.  
또한 보유한 재료를 기반으로 레시피를 추천하며, 기존 레시피가 없을 경우 **생성형 AI로 새로운 레시피**를 제안합니다.  

### 개발 배경 및 목적

냉장고 속 식재료를 효율적으로 관리하지 못해 발생하는 **식품 폐기 증가·중복 구매·요리 고민** 등의 문제를 해결하고자 프로젝트를 시작하였습니다. 

실제 사용자들은 냉장고 재고를 직접 입력하는 과정이 번거롭고, 소비기한을 제때 확인하기 어렵다는 불편을 겪고 있으며, 현재 가지고 있는 재료를 기반으로 한 맞춤형 레시피 추천 서비스 역시 부족한 상황입니다. 

본 프로젝트의 목표는 **사용자의 식품 재고 입력 부담을 최소화하고, 식품 소비 효율을 높이며, 냉장고 재고 관리와 요리 추천 과정을 자동화·지능화된 흐름으로 제공하는 것**입니다.

---

## ✨ 주요 기능

<div align="center">
  <img src="./프로젝트 UI.png" alt="Project UI Screenshot" width="100%">
</div>

<br>

### 1. 구글 소셜 로그인
- 일반적인 회원가입 절차 없이 구글 계정을 통한 간편한 소셜 로그인 기능을 제공합니다.
- 사용자 인증 과정을 단순화하여 서비스 접근성을 높였습니다.

### 2. OCR 영수증 인식 기반 식재료 데이터 추출
- Google Vision API를 활용하여 영수증 이미지에서 식재료 정보를 자동으로 추출합니다.
- 추출된 데이터를 바탕으로 사용자의 냉장고에 식재료를 간편하게 추가할 수 있습니다.
- 정확한 식재료 정보 등록을 위해 수동 입력 기능을 제공함으로써 사용자 경험을 개선합니다.

### 3. 소비기한 기반 식재료 재고 관리
- 등록된 식재료의 소비기한을 추적하고 관리하는 기능을 제공합니다.
- 소비기한이 임박한 식재료를 우선적으로 확인할 수 있어 식재료 낭비를 방지합니다.

### 4. 보유 식재료 기반 레시피 추천
- 사용자가 현재 보유한 식재료 중 원하는 재료를 선택하면, 만개의레시피 API를 통해 적합한 레시피를 추천합니다.
- Jsoup 기반 크롤러를 활용하여 만개의 레시피에서 데이터 수집하고, 검증 로직을 거쳐 API에서 데이터를 반환합니다.

### 5. 생성형 AI 레시피 제공
- Gemini 2.0 Flash API를 활용하여 사용자의 식재료와 추가 요구사항을 바탕으로 맞춤형 레시피를 생성합니다.
- 기존 레시피 DB에 없는 창의적이고 예상치 못한 레시피를 경험할 수 있습니다.
- 사용자의 프롬프트에 따라 다양한 스타일의 요리를 제안받을 수 있습니다.

### 6. 레시피 게시판 작성
- 레시피 이름, 필요한 재료, 레시피 이미지, 조리 순서, 요리 카테고리, 난이도, 소요 시간, 식사 인원 수, 관련 태그 등 상세한 정보를 포함한 게시글을 작성할 수 있습니다.
- 사용자 간 레시피 공유를 통한 커뮤니티 형성을 지원합니다.

### 7. 게시판 댓글 기능
- 레시피 게시글에 댓글을 작성하고 삭제할 수 있는 기능을 제공합니다.
- 사용자 간 소통과 피드백 교환이 가능합니다.

### 🌟 특장점 및 차별화 요소

#### 1. 통합 서비스 제공
기존 서비스들이 레시피 제공 또는 재고 관리 중 하나에만 특화된 것과 달리, 본 서비스는 식재료 관리부터 레시피 추천, 커뮤니티 공유까지 통합적인 솔루션을 제공합니다.

#### 2. AI 기반 창의적 레시피 생성
단순히 데이터베이스에 저장된 레시피를 제공하는 것을 넘어, 생성형 AI를 활용하여 사용자가 예상하지 못한 독창적인 레시피를 제안합니다. 같은 식재료로도 매번 새로운 요리를 시도할 수 있는 재미를 제공합니다.

#### 3. OCR 기반 편의성 향상
영수증 이미지 업로드만으로 식재료를 자동 등록할 수 있어, 사용자가 일일이 입력해야 하는 불편함을 제거했습니다. 쇼핑 후 즉시 냉장고 재고를 업데이트할 수 있어 실시간 관리가 가능합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 17 | 백엔드 개발 언어 |
| Spring Boot | 3.3.4 | 백엔드 프레임워크 |
| Spring Security | 7.0.0 | 인증 및 요청 검증 |
| MySQL | 8.0 | 사용자·식재료·레시피 데이터 저장 |
| Jsoup | 1.21.2 | 만개의 레시피 HTML 파싱 및 데이터 추출 |

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| TypeScript | latest | 프론트엔드 개발 언어 |
| React | 19.1.1 | 프론트엔드 프레임워크 |
| Vite | 7.1.7 | 프론트엔드 빌드 및 개발 환경 |
| Local Storage | - | 영수증 이미지 및 클라이언트 임시 데이터 저장 |

### External APIs & Services
| 서비스 | 버전 | 용도 |
|--------|------|------|
| Google Cloud Vision API | 3.47.0 | 영수증 텍스트 인식 (OCR) |
| Google Gemini API | 2.0 Flash | 생성형 AI 기반 레시피 생성 |
| 만개의레시피 크롤링 | - | 레시피 데이터 크롤링 |

### Development Tools
| 도구 | 용도 |
|------|------|
| IntelliJ IDEA | 백엔드 IDE |
| Visual Studio Code | 프론트엔드 IDE |
| GitHub | 협업 및 버전 관리 |
| Notion | 스크럼 방식 프로젝트 관리 |

---

## 🏗️ 시스템 아키텍처 (System Architecture)

<div align="center">
  <img src="./시스템 아키텍처.png" alt="System Architecture" width="100%">
</div>

<br>
### 주요 데이터 흐름

#### 1. OCR 기반 식재료 등록 플로우
```
사용자 (영수증 업로드)
    ↓
React Frontend (이미지 전송)
    ↓
Spring Boot Backend
    ↓
Google Vision API (OCR 처리)
    ↓
텍스트 파싱 & 정규화 (Service Layer)
    ↓
MySQL DB 저장 (식재료 테이블)
    ↓
사용자 냉장고 업데이트
```

#### 2. AI 레시피 생성 플로우
```
사용자 (식재료 선택 + 요구사항 입력)
    ↓
React Frontend
    ↓
Spring Boot Backend (프롬프트 구성)
    ↓
Google Gemini API (레시피 생성)
    ↓
생성된 레시피 반환
    ↓
Frontend 화면 표시
```

#### 3. 레시피 추천 플로우
```
사용자 (보유 식재료 선택)
    ↓
Spring Boot Backend
    ↓
Jsoup 크롤러 (만개의레시피 검색)
    ↓
레시피 데이터 파싱 & 검증
    ↓
추천 레시피 목록 반환
    ↓
Frontend 화면 표시
```

---

## 📊 주요 성과 (Key Achievements)

### 개발 성과
- ✅ **개발 기간**: 3개월 (2025.09.15 ~ 2025.12.11)
- ✅ **개발 방법론**: 애자일 스크럼(Scrum) - 1주 단위 스프린트
- ✅ **총 스프린트**: 10회 (2주차 ~ 11주차)
- ✅ **핵심 모듈**: 4대 핵심 모듈 개발 완료 (목표 달성률 100%)
  - ① Google Vision API 기반 OCR 영수증 파싱 모듈
  - ② 사용자 냉장고 재고 관리 CRUD 시스템
  - ③ Gemini API 연동 맞춤형 레시피 생성기
  - ④ Jsoup 기반 외부 레시피 데이터 크롤러

### 성능 개선
- ⚡ **데이터 등록 시간 83% 단축**: 수기 입력 대비 (기존 3분 → 30초 이내)
- ⚡ **API 응답 속도**: 레시피 생성 요청 시 평균 5초 이내 결과 반환
- ⚡ **OCR 인식 정확도**: 전자 영수증 한정 품목명 및 수량 인식 정확도 **95% 이상**

### 스크럼 프로세스
| 이벤트 | 주기/방식 | 내용 |
|--------|-----------|------|
| **스프린트 플래닝** | 매주 월요일 오후 10시 | Discord 화상회의를 통한 주간 계획 수립 및 작업 분배 |
| **진행 상황 공유** | 2-3일 간격 | 카카오톡을 통한 진행 상황 보고 (부담 최소화) |
| **스프린트 리뷰** | 기능 개발 완료 시 | 카카오톡에 결과물 공유 후 팀원 피드백 (비동기 리뷰) |
| **백로그 관리** | 매 스프린트 | 필수 기능 우선순위화, 기능 단위 병렬 개발 |

> 🔗 **Team Amazing Potatoes의 상세한 협업 기록은 [Notion 스크럼 페이지](https://www.notion.so/2b9f823f8f7080cdb65ae05c820c1232?source=copy_link)에서 확인하실 수 있습니다.**
---

## 🚀 Quick Start

### 사전 요구사항 (Prerequisites)

```bash
# 필수 설치 항목
- Node.js (v18 이상)
- npm (v9 이상)
- Java 17
- MySQL 8.0
- IntelliJ IDEA (권장)
```

### ⚡ 빠른 시작 (3단계)

#### 1️⃣ 프로젝트 클론
```bash
git clone [repository-url]
cd [project-directory]
```

#### 2️⃣ Backend 실행
```bash
# MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE amazing_potatoes;

# IntelliJ IDEA에서 프로젝트 열기
# application.properties 설정 확인
# - spring.datasource.url
# - spring.datasource.username
# - spring.datasource.password

# MainApplication 클래스 실행
```

#### 3️⃣ Frontend 실행
```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 📝 환경 변수 설정

Backend (`application.properties` 또는 `application.yml`):
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/amazing_potatoes
spring.datasource.username=your_username
spring.datasource.password=your_password

# Google Vision API
google.vision.api.key=your_google_vision_api_key

# Google Gemini API
google.gemini.api.key=your_gemini_api_key

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

Frontend (`.env` 파일):
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### ✅ 실행 확인

- **Backend**: `http://localhost:8080`에서 API 정상 작동 확인
- **Frontend**: `http://localhost:5173`에서 웹 애플리케이션 접속

---

## 📖 상세 실행 가이드 (Detailed Setup Guide)

### 1. 개발 환경 구축

#### 1-1. Backend 환경 설정

```bash
# Java 17 설치 확인
java -version

# IntelliJ IDEA에서 프로젝트 열기
# File > Open > backend 디렉토리 선택

# Gradle/Maven 의존성 다운로드 (자동)
# Build > Build Project
```

**application.properties 설정:**
```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/amazing_potatoes?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Google Vision API
google.application.credentials=/path/to/your/service-account-key.json
google.vision.api.key=your_api_key

# Google Gemini API
google.gemini.api.key=your_gemini_api_key
google.gemini.model=gemini-2.0-flash

# JWT Configuration
jwt.secret=your_secret_key_min_256_bits
jwt.expiration=86400000

# OAuth2 Google
spring.security.oauth2.client.registration.google.client-id=your_client_id
spring.security.oauth2.client.registration.google.client-secret=your_client_secret
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/google

# File Upload
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

#### 1-2. Frontend 환경 설정

```bash
# Node.js 설치 확인
node -v
npm -v

# 프론트엔드 디렉토리로 이동
cd frontend

# package.json 확인
cat package.json
```

**.env 파일 생성:**
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8080

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# App Configuration
VITE_APP_NAME=냉장고를 부탁해
VITE_APP_VERSION=1.0.0
```

### 2. API 키 발급 가이드

#### 2-1. Google Cloud Vision API

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성
3. API 및 서비스 > 라이브러리 > Cloud Vision API 검색 및 활성화
4. 사용자 인증 정보 > API 키 생성
5. 서비스 계정 키 JSON 파일 다운로드
6. `application.properties`에 경로 설정

#### 2-2. Google Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. API 키 생성
3. `application.properties`에 키 설정

#### 2-3. Google OAuth 2.0

1. Google Cloud Console > API 및 서비스 > 사용자 인증 정보
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가:
   - `http://localhost:8080/login/oauth2/code/google`
   - `http://localhost:5173/oauth2/redirect` (프론트엔드)
4. 클라이언트 ID와 시크릿을 각각 설정

### 3. 단계별 실행

#### Step 1: Backend 실행
```bash
# IntelliJ에서 MainApplication.java 실행
# 또는 터미널에서:
cd backend
./gradlew clean bootRun

# 실행 확인
# 로그에서 "Started MainApplication in X seconds" 메시지 확인
```

#### Step 2: Frontend 실행
```bash
cd frontend
npm install
npm run dev

# 브라우저 자동 실행 또는 수동으로 http://localhost:5173 접속
```

#### Step 3: 기능 테스트
1. **로그인 테스트**: Google 계정으로 로그인
2. **OCR 테스트**: 영수증 이미지 업로드 및 식재료 추출 확인
3. **재고 관리**: 식재료 등록, 수정, 삭제 테스트
4. **레시피 추천**: 보유 식재료 기반 레시피 검색
5. **AI 레시피**: Gemini API를 통한 레시피 생성
6. **게시판**: 레시피 게시글 작성 및 댓글 테스트

---

## 📹 시연 영상 (Demo Video)

> 🎥 **YouTube 시연 영상**: [https://www.youtube.com/watch?v=AH4a1VvdAB8]
<div align="center">
  <a href="https://www.youtube.com/watch?v=AH4a1VvdAB8">
    <img src="https://img.youtube.com/vi/AH4a1VvdAB8/maxresdefault.jpg" alt="시연 영상 썸네일" width="80%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
  </a>
</div>
> 프로젝트의 주요 기능과 사용 방법을 영상으로 확인할 수 있습니다.

---

## 📂 프로젝트 구조 (Project Structure)

```
refrigerator-management/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/project/refrigerator/
│   │   │   │       ├── MainApplication.java
│   │   │   │       ├── config/          # 설정 파일
│   │   │   │       ├── controller/      # REST API 컨트롤러
│   │   │   │       ├── service/         # 비즈니스 로직
│   │   │   │       ├── repository/      # 데이터베이스 접근
│   │   │   │       ├── entity/          # JPA 엔티티
│   │   │   │       ├── dto/             # 데이터 전송 객체
│   │   │   │       └── util/            # 유틸리티
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   └── test/                        # 테스트 코드
│   ├── build.gradle (또는 pom.xml)
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/                  # React 컴포넌트
│   │   ├── pages/                       # 페이지 컴포넌트
│   │   ├── services/                    # API 호출 서비스
│   │   ├── hooks/                       # Custom Hooks
│   │   ├── utils/                       # 유틸리티 함수
│   │   ├── styles/                      # CSS/SCSS 파일
│   │   ├── assets/                      # 이미지, 폰트 등
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── docs/                                # 문서
│   ├── API.md                           # API 명세서
│   ├── DATABASE.md                      # DB 스키마
│   └── ARCHITECTURE.md                  # 아키텍처 설계
│
├── test-data/                           # 테스트 데이터
│   └── receipts/                        # 샘플 영수증
│
└── README.md                            # 메인 README
```

---

## ✍️ 팀원별 프로젝트 소감

### 이예린 (팀장 / AI)
팀장으로서 이번 프로젝트에서 가장 많이 신경 썼던 부분은 단순히 기술을 구현하는 일을 넘어, 팀 전체의 일정을 조율하고 체계적으로 개발 계획을 세우는 일이었습니다. 처음 팀장을 맡았던 터라, 기능 개발의 순서와 우선순위를 잡아주는 것, 그리고 팀원들이 혼란 없이 각자의 역할에 집중할 수 있는 환경을 만드는 것이 가장 큰 과제였습니다. 또한 개발적인 측면으로서는 이미지 인식 API와 생성형 AI API를 처음 다루다 보니, 기술 스택을 직접 고르고 모델도 직접 찾아봤는데, 예상치 못한 문제들이 계속 터졌습니다. 이럴 때마다 Notion에 작업 현황과 우선순위를 꼼꼼히 정리했고, Discord로 실시간으로 소통하면서 이슈를 신속하게 공유했습니다. 또, 매주 스크럼 회의를 열어 진행 상황을 투명하게 확인하고, 필요하면 바로 계획을 조정해가며 팀원들과 함께 문제를 해결해 나갔습니다. 이런 조율과 소통을 반복하다 보니, 프로젝트 전체의 흐름을 놓치지 않고 끝까지 이어갈 수 있었던 것 같습니다. 가장 기억에 남는 순간은 OCR로 식재료 정보를 추출한 뒤, 그 데이터를 활용해 자연스럽게 레시피를 만드는 기능을 직접 설계했던 일입니다. 이 과정을 통해 서비스 개발이라는 게 단순히 코드를 짜는 것에서 끝나는 게 아니라, 다양한 기술을 자연스럽게 연결하고 조율하는 설계 능력이 정말 중요하다는 걸 온몸으로 느꼈습니다. 쉽지 않은 순간들도 많았지만, 결국 팀원들과 끝까지 의지하며 프로젝트를 완성했고, 덕분에 큰 성취감을 맛볼 수 있었습니다. 무엇보다 서로 믿고 한마음으로 달려준 팀원들에게 진심으로 고마운 마음이 남아 있습니다.

### 전성현 (팀원 / 백엔드)
프로젝트를 진행하면서 백엔드 파트로서 API 설계부터 데이터베이스 구조 설계, CRUD 기능 구현, 프론트 엔드와 백엔드의 통합까지 전반적인 과정을 담당했다. 하나의 서비스가 안정적으로 동작하려면 백엔드 아키텍처를 체계적으로 설계하고, 각 기능의 구현 순서와 우선순위를 명확히 정하는 것이 얼마나 중요한지 실감할 수 있었다. Spring Boot 환경에서 CRUD를 구현하고 JPA, JDBC와 같은 데이터 베이스 관리 모듈을 사용해보는 것은 처음 이었다. 가장 어려웠던 부분은 아무래도 데이터 베이스 설계 부분이었다. CRUD 기능에서 어떤 데이터들이 오가는지를 명확하게 파악하고 그에 알맞게 데이터 베이스 구조를 설계하는 것이 생각보다 더 어려웠다. 그리고 프론트와 통신할 때 데이터 셋과 데이터 구조를 통일시키고, 이를 백엔드와 주고 받는 과정에서 많은 시간과 고민이 필요했다. 작업 중 막히는 부분이 생길 때마다 다시 한 번 문제 상황을 파악하여 논리적으로 생각해보고, 매주 회의를 통해 프론트엔드 팀원들과 API 명세를 맞춰가며 문제를 하나씩 해결해 나갔다. 이 과정에서 효율적인 프로젝트 관리 방식이 생각보다 더 유의미하다는 것을 체감했고, 이러한 스크럼 방식과 피드백 덕분에 안정적인 서비스를 구축할 수 있었다고 생각한다. 특히 마지막에 프론트 엔드와 병합할 때, 초기 기능 명세서의 구체적인 작성과 프론트 엔드와의 소통의 중요성을 깨달았다. 그래서 혼자서 다 개발할 수 있는 풀스택 개발이 얼마나 어려운 일인지 체감할 수 있었고, 현업에서 중요한 능력 중 하나인 커뮤니케이션 능력이 상당히 중요하다는 것을 깨달았다. 소규모니까 병합할 때 큰 어려움은 없었지만, 이제 실무에 투입하고 방대한 크기의 프로젝트를 관리하는 것을 생각해보니 괜히 파트를 나누어 작업하는 것이 아니라고 생각이 든다. 마지막으로, 복학해서 아직 서로서로 낮선 환경이었을 수도 있지만 적극적으로 소통해주고 다가와준 팀원들에게 정말로 감사하다. 먼저 다가와주고 친절하고 상냥하게 대해준 팀원들에게 다시 한번 감사하다.

### 한정우 (팀원 / 프론트엔드)
프로젝트를 진행하면서 프론트엔드 개발자로서 사용자 인터페이스 설계와 페이지 간 라우팅 구현을 주로 담당했다. 처음에는 단순히 디자인을 코드로 옮기는 작업이라고 생각했지만, 실제로는 사용자가 자연스럽게 서비스를 이용할 수 있도록 화면 전환 흐름을 설계하고, 각 페이지의 UI 컴포넌트를 구현하는 것이 생각보다 훨씬 복잡한 작업이었다는 것을 깨달았다. 가장 어려웠던 부분은 백엔드 개발이 완료되기 전까지 개발과 테스트를 진행해야 했던 점이었다. 실제 API가 없는 상황에서 목 데이터를 직접 만들어 화면이 제대로 동작하는지 확인하고, 라우팅이 매끄럽게 연결되는지 테스트하는 과정이 반복됐다. 나중에 실제 API와 연동할 때를 대비해서 데이터 구조를 미리 고민하고, 화면에 어떤 정보가 어떻게 표시될지 구체적으로 설계해두는 것이 중요했다. 이 과정에서 프론트엔드 개발이 단순히 보이는 부분을 만드는 것이 아니라, 전체 서비스 흐름을 이해하고 사용자 경험을 설계하는 작업이라는 것을 체감했다. 특히 OCR로 식재료를 인식하고 레시피를 생성하는 전체 플로우를 화면으로 구현하면서, 각 단계마다 사용자가 직관적으로 이해할 수 있도록 UI를 배치하고 페이지 전환을 자연스럽게 만드는 데 많은 고민을 했다. 막히는 부분이 생길 때마다 매주 회의를 통해 팀원들과 소통하며 문제를 해결해 나간 과정이 기억에 남는다. 마지막에 모든 파트가 하나로 합쳐져 서비스가 완성되는 순간의 성취감은 정말 컸고, 이번 프로젝트를 통해 기술적 능력뿐만 아니라 팀 협업의 중요성을 배울 수 있었다. 무엇보다 서로를 배려하고 적극적으로 소통해준 팀원들 덕분에 좋은 경험을 할 수 있었고, 함께 프로젝트를 완성할 수 있어서 정말 감사하다.

---

## 🚀 향후 발전 계획 (Future Development Plans)

### 1. OCR 처리 고도화 및 다양한 영수증 형식 지원
현재는 전자 영수증 중심으로 인식되지만, 향후에는 실물 영수증(사진), 쿠팡·마켓컬리 구매내역, PDF 영수증 등 다양한 문서 포맷을 처리할 수 있도록 OCR 성능을 개선할 계획입니다.

**주요 개선 사항:**
- 이미지 전처리 (OpenCV 기반 이진화, contrast 조정, noise 제거)
- OCR 결과에 대한 Regex 기반 품목 추출 규칙 강화
- 단위·수량·카테고리 파싱 자동화
- NLP(자연어 처리) 기반 오탈자 보정 로직 추가

### 2. 식재료 자동 구매 추천 및 이커머스 연동
사용자의 재고 기록과 소비 주기를 분석하여 실질적인 식재료 관리 기능으로 확장합니다.

**주요 기능:**
- 항상 구비해야 할 기본 재료 목록 자동 제안
- 소비 주기 기반 '예상 소진일' 계산
- 쿠팡·마켓컬리 등 이커머스 API 연동 자동 구매 추천
- 장기적으로 구매–소비–재고 분석을 연결하는 개인화된 식자재 관리 서비스 구현

### 3. 모바일 앱 개발 및 실사용 환경 개선
웹 기반 MVP 이후 실사용성을 고려한 모바일 플랫폼으로 전환합니다.

**주요 기능:**
- Android/iOS 앱 개발 (React Native/Flutter)
- FCM 기반 소비기한 임박 푸시 알림
- OCR 촬영 최적화 UI/UX
- 바코드 스캔 기반 식품 등록 보조 기능

### 4. AI 기반 맞춤형 식단 및 레시피 자동 구성
현재는 보유 재료 기반 레시피만 제공하지만, 향후에는 사용자의 건강 목표와 선호도를 반영한 개인화 서비스로 확장합니다.

**주요 기능:**
- 사용자 취향·건강 목표(다이어트, 알러지 등) 기반 레시피 개인화 모델
- 주간 식단 플래너 자동 생성 기능
- 영양 분석 리포트 제공
- 대체 조리법 자동 생성 기능

### 5. 재고 소비 예측 및 음식물 폐기율 감소 모델 연구
사용자의 실제 소비 패턴을 학습하여 음식물 쓰레기 감소라는 서비스의 본질적 목표를 강화합니다.

**주요 기능:**
- 특정 식재료의 '남은 기간 대비 실제 소비 가능성' 예측
- 폐기 가능성이 높은 식품 사전 안내
- 시계열 분석 기반 머신러닝 모델 도입
- 대체 활용 레시피 자동 제안

> 💡 **Note**: 초기에는 규칙 기반 모델로 시작하여, 데이터 축적에 따라 머신러닝 기반 모델로 점진적 확장 예정

---

## 📄 라이선스 (License)

이 프로젝트는 교육 목적으로 제작되었습니다.

---

<div align="center">

**Made with ❤️ by 냉장고를 부탁해 (AMAZING POTATOES)**

</div>
