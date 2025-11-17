##/src/app

AuthProvider.tsx : 전역 인증 상태(Context) + 로그인 팝업 열기/닫기 상태.

ProtectedRoute.tsx : 보호 라우트(로그인 필요) 구성요소.

---
##/src/assets

logo.png : 네비바 로고.

---
##/src/components

Navbar.tsx : 상단 네비게이션 + 로그인 버튼 + 탭 링크. 필수 (App.tsx에서만 렌더!)

LoginModal.tsx : 로그인 팝업(포털+fixed).

StatCard.tsx : 대시보드 상단 통계 카드(총 품목/3일내 만료).

UploadDialog.tsx : 대시보드 → “영수증 업로드” 버튼 클릭 시 모달(라우팅 이동형이면 이 컴포넌트는 안써도 됨—지금은 /upload 페이지 사용).

UploadDropzone.tsx : /upload의 드래그&드롭 박스.

RecipeCard.tsx : 대시보드 하단 “인기 레시피” 카드 템플릿.

TagPill.tsx : 태그/칩 UI.

Avatar.tsx : 사용자 아바타 UI.

---
##/src/lib

api.ts : 목 API(영수증 파싱/분류, CRUD 스텁) + 타입 정의(Category, FridgeItemDTO 등).

useFridge.ts : 전역 냉장고 상태(샘플 데이터, CRUD, 대시보드 연동).

---
##/src/pages

Dashboard.tsx : 대시보드(통계, 레시피 섹션, “영수증 업로드” 이동).

UploadReceipt.tsx : 영수증 업로드/분류 페이지(인식된 카테고리만 노출).

Fridge.tsx : “나의 냉장고” 리스트 + 필터/정렬 + 상태(신선/임박/만료) 표시.

FridgeEdit.tsx : 품목 수정/추가 폼.

Recipes.tsx : 레시피 목록(목업/플레이스홀더).

---
##루트 (src)

App.tsx : 라우터/레이아웃(여기서만 Navbar 렌더!)

main.tsx : React/Vite 엔트리.

index.css : Tailwind import + 전역 스타일.

index.html : Vite 템플릿.

---
##환경/도구

.env : VITE_USE_MOCK, VITE_API_BASE_URL 등 환경변수.

eslint.config.js : 린트.

postcss.config.js : Tailwind v4 postcss 플러그인 접속.

tailwind.config.js : 테마 커스터마이즈.

tsconfig.json : TS 기본 설정.

tsconfig.node.json : Vite/툴링용(일반적으로 있음)

tsconfig.app.json : tsconfig.json에서 extends

vite.config.ts : Vite 설정
