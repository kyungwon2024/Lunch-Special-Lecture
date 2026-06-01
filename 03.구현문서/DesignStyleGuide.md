<style>
@media print {
    body, p, li { font-size: 13pt !important; line-height: 1.6 !important; }
    h1 { font-size: 22pt !important; margin-top: 22pt !important; margin-bottom: 14pt !important; }
    h2 { font-size: 18pt !important; margin-top: 18pt !important; margin-bottom: 12pt !important; }
    h3 { font-size: 16pt !important; margin-top: 16pt !important; margin-bottom: 10pt !important; }
    h4 { font-size: 14pt !important; margin-top: 12pt !important; margin-bottom: 8pt !important; }
    ul, ol { margin-top: 5pt !important; margin-bottom: 5pt !important; padding-left: 22pt !important; }
    pre, code { font-size: 10pt !important; }
}
</style>

# 디자인 스타일 가이드 (Design Style Guide) · 점심특강

**프로젝트명**: 점심특강 (Lunch Special Lecture)
**작성일**: 2026-06-01
**버전**: v1.0
**근거 문서**:
- [서비스기획서.md](../02.기획문서/서비스기획서.md) v1.0 §5 (브랜드 전략·비주얼 아이덴티티)
- [화면설계서.md](../02.기획문서/화면설계서.md) v1.0 §5 (공통 UI 원칙)
- [정보구조도.md](../02.기획문서/정보구조도.md) v1.0 §8 (컨텍스트 내비게이션 패턴)
- [요구사항정의서.md](../02.기획문서/요구사항정의서.md) v1.0 NFR-018·019 (접근성)

**타깃 환경**:
- 사용자 앱(SCR-USR): **모바일 100%** (iOS 14+/Android 9+, Safari·Chrome·Samsung Internet)
- 사장님 앱(SCR-OWN): **모바일 + 태블릿** (50대 사장님 가독성 대응)
- 어드민(SCR-ADM): **PC 데스크탑 우선**, 태블릿 보조

---

## 1. 디자인 원칙

| # | 원칙 | 설명 | 적용 화면 |
|---|------|------|----------|
| 1 | **카드 1개 = 1결정** | 점심특선 카드는 4요소(사진/메뉴/할인가/할인율)만 노출. 비교 요소를 카드 안에 모두 담아 5초 내 결정 가능 | SCR-USR-005, SCR-USR-006 |
| 2 | **5초 의사결정 동선** | 사용자 진입 → 메인 피드 → 카드 탭 → 쿠폰 발급까지 3 탭 이내. 모든 인터랙션은 200ms 이내 응답 | 전 화면 |
| 3 | **시니어·시각 약자 친화** | 큰 글씨 모드(1.0/1.25/1.5x) 전 화면 지원. WCAG 2.1 AA 준수, 색 대비 4.5:1+ | 모든 SCR |
| 4 | **친근하고 신뢰감 있는 톤** | 따뜻한 오렌지 + 그린 + 코랄 팔레트. 일러스트 + 음식 이모지 + 부담 없는 카피 | 전 브랜드 |
| 5 | **모바일 First, 데스크탑 Last** | 320px 모바일 기준 설계 후 점진적 확장. 어드민만 1024px+ 우선 | 전 화면 |
| 6 | **오프라인·약전파 폴백** | 네트워크 실패 시 캐시 데이터 + "오프라인" 배너. GPS 실패 시 수동 검색 | SCR-USR-001/002/005 |
| 7 | **다크 모드 동등 지원** | 점심 후 휴식·야간 사용 대응. 모든 컬러 토큰은 light/dark 쌍으로 정의 | 전 화면 |

---

## 2. 글로벌 레이아웃

### 2.1 사용자 앱 레이아웃 (모바일)

```
┌──────────────────────────┐
│  Header (56px)            │ ← 로고/알림/설정
├──────────────────────────┤
│  Sub Header (44px)        │ ← 검색바·필터바 (선택)
├──────────────────────────┤
│                          │
│   Content Area            │
│   (Safe Area + 16px H)    │
│                          │
│                          │
├──────────────────────────┤
│  Bottom Tab Bar (60px)    │ ← 홈/탐색/쿠폰함/알림/마이
└──────────────────────────┘
```

| 영역 | 크기 | 배경 | 비고 |
|------|------|------|------|
| Header | H: 56px, 100vw | Surface 1 | 로고(좌) · 알림+설정(우) |
| Sub Header | H: 44px (선택적) | Surface 0 | 검색·필터 컨테이너 |
| Content Area | flex: 1, 좌우 16px padding | Surface 0 | Safe Area inset 적용 |
| Bottom Tab Bar | H: 60px + Safe Area inset | Surface 1, 1px top border | 5탭, 아이콘+라벨 |

### 2.2 사장님 앱 레이아웃 (모바일 + 태블릿)

```
┌──────────────────────────────┐
│  Header (56px) + 매장명       │
├──────────────────────────────┤
│  Content Area                 │
│  (16px H, 태블릿 24px)        │
│                              [FAB]│ ← QR 스캐너 FAB
├──────────────────────────────┤
│  Bottom Nav (60px)            │ ← 홈/매장/쿠폰/통계/설정
└──────────────────────────────┘
```

### 2.3 어드민 레이아웃 (데스크탑 우선)

```
+--------+---------------------------------------------+
| SideNav|  Header (64px) + 검색 + 알림                 |
| 240px  +---------------------------------------------+
|        |                                             |
| 홈     |   Main Content (max-w 1280px, 32px padding) |
| 신고   |                                             |
| (Phase |                                             |
| 2+)    |                                             |
+--------+---------------------------------------------+
```

| 영역 | 크기 | 배경 | 비고 |
|------|------|------|------|
| SideNav | W: 240px (확장) / 72px (축소) | Surface 3 (Dark) | 로고 + 메뉴 |
| Header | H: 64px, 전체 너비 | Surface 1 | 검색·알림·프로필 |
| Main Content | Max-W: 1280px, 32px padding | Surface 0 | 좌우 정렬 |

### 2.4 그리드 시스템

| 디바이스 | 컬럼 수 | Gutter | Margin | Max Width |
|---------|--------|--------|--------|-----------|
| Mobile (320~767px) | 4 | 16px | 16px | 100vw |
| Tablet (768~1023px) | 8 | 24px | 24px | 100vw |
| Desktop (1024px+) | 12 | 24px | 32px | 1280px (어드민), 480px (사용자/사장님 가운데 정렬) |

### 2.5 스페이싱 스케일 (4px 기본 단위)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `spacing/xxs` | 2px | 마이크로 간격 (아이콘 내부) |
| `spacing/xs` | 4px | 아이콘-텍스트 간격 |
| `spacing/sm` | 8px | 인접 요소 간격 |
| `spacing/md` | 12px | 폼 입력 padding-y |
| `spacing/base` | 16px | **기본** 컴포넌트 내부·외부 padding |
| `spacing/lg` | 24px | 카드 padding, 섹션 간 간격 |
| `spacing/xl` | 32px | 대형 섹션 간격 (어드민) |
| `spacing/2xl` | 48px | 페이지 상하 여백 (모바일) |
| `spacing/3xl` | 64px | 페이지 상하 여백 (데스크탑) |

---

## 3. 컬러 시스템

### 3.1 브랜드 컬러 (Brand Palette)

서비스기획서 §5.2 비주얼 아이덴티티 정의 컬러를 토큰화:

| 토큰 | Hex (Light) | Hex (Dark) | 의미 |
|------|-------------|------------|------|
| `color/brand/primary` | **#FFA726** | #FFB74D | 오렌지 옐로 — 식욕·점심시간 햇살 |
| `color/brand/primary-dark` | #F57C00 | #FF8F00 | 호버, 액티브 |
| `color/brand/primary-light` | #FFE0B2 | #FFA726 (30% alpha) | 배경 틴트, 카드 강조 |
| `color/brand/secondary` | **#43A047** | #66BB6A | 그린 — 가성비·신선함 |
| `color/brand/secondary-dark` | #2E7D32 | #43A047 | 호버, 활성 상태 |
| `color/brand/accent` | **#FF5722** | #FF7043 | 코랄 레드 — 할인·한정·긴급 |
| `color/brand/accent-dark` | #E64A19 | #FF5722 | 호버 |

### 3.2 뉴트럴 팔레트 (Gray Scale)

| 토큰 | Hex (Light) | Hex (Dark) | 용도 |
|------|-------------|------------|------|
| `color/gray/0` | #FFFFFF | #0F1419 | Surface 0 (페이지 배경) |
| `color/gray/50` | #FAFAFA | #1A2028 | Surface 1 (카드, 헤더 배경) |
| `color/gray/100` | #F3F4F6 | #242C36 | Hover, 미묘한 강조 |
| `color/gray/200` | #E5E7EB | #2F3742 | Border, 구분선 |
| `color/gray/300` | #D1D5DB | #3F4856 | 비활성 상태, 플레이스홀더 |
| `color/gray/400` | #9CA3AF | #6B7480 | 보조 텍스트, 캡션 |
| `color/gray/500` | #6B7280 | #95A0AE | 본문 보조 |
| `color/gray/600` | #4B5563 | #B8C2CC | 본문 |
| `color/gray/700` | #374151 | #D5DCE5 | 제목 |
| `color/gray/800` | #1F2937 | #E8EDF2 | 강조 텍스트 |
| `color/gray/900` | #111827 | #F5F7FA | 최대 대비 텍스트 |

### 3.3 시맨틱 컬러 (Status)

| 상태 | 토큰 | 텍스트/아이콘 | 배경 | 용도 |
|------|------|---------------|------|------|
| Success | `color/semantic/success` | #2E7D32 | #E8F5E9 | 영업중, 쿠폰 발급 성공, 사용 완료 |
| Warning | `color/semantic/warning` | #ED6C02 | #FFF3E0 | 곧 마감, 잔여 5개 이하, 만료 임박 |
| Danger | `color/semantic/danger` | #D32F2F | #FFEBEE | 매진, 위치 불일치, 쿠폰 만료, 오류 |
| Info | `color/semantic/info` | #1976D2 | #E3F2FD | 시스템 공지, 안내 메시지 |

### 3.4 차트 컬러 팔레트 (사장님 통계 대시보드)

SCR-OWN-008 4지표 + ROI 카드 + SCR-OWN-009 히트맵에 사용.

| 순서 | Hex | 용도 |
|------|-----|------|
| Series 1 | **#FFA726** (브랜드 Primary) | 주요 데이터 (신규 고객, 매출) |
| Series 2 | #43A047 (브랜드 Secondary) | 보조 데이터 (재방문율, 단골) |
| Series 3 | #1976D2 | 비교 데이터 (전 기간 대비) |
| Series 4 | #FF5722 (브랜드 Accent) | 강조 (사용률 < 20% 경고) |
| Series 5 | #9C27B0 | 추가 데이터 |
| Heatmap | #FFE0B2 → #FF8F00 | 시간대별 분포 (옅음→진함) |

### 3.5 표면 계층 (Surface Elevation)

| 레벨 | 토큰 | 배경 (Light/Dark) | 그림자 | 용도 |
|------|------|-------------------|--------|------|
| Surface 0 | `surface/0` | #FFFFFF / #0F1419 | 없음 | 페이지 배경 |
| Surface 1 | `surface/1` | #FAFAFA / #1A2028 | 없음 | 헤더, Bottom Tab, 평면 카드 |
| Surface 2 | `surface/2` | #FFFFFF / #1A2028 | `shadow/md` | 떠있는 카드 (점심특선), Toast |
| Surface 3 | `surface/3` | #FFFFFF / #242C36 | `shadow/lg` | 모달, Bottom Sheet, Drawer |
| Surface Dark | `surface/dark` | #1F2937 / #0F1419 | — | 어드민 SideNav |

---

## 4. 타이포그래피

### 4.1 폰트 패밀리

| 용도 | 폰트 | 대체 (Fallback) |
|------|------|-----------------|
| UI 본문·제목 (한글+영문) | **Pretendard Variable** | "Noto Sans KR", "Apple SD Gothic Neo", -apple-system, BlinkMacSystemFont, system-ui, sans-serif |
| 강조 숫자 (대시보드 KPI, 가격, 할인율) | **Pretendard Bold** + Tabular Numbers (`font-variant-numeric: tabular-nums`) | 동일 |
| 코드/모노스페이스 (어드민 로그, 토큰) | "JetBrains Mono", "D2Coding" | "SF Mono", Consolas, monospace |

> **선정 사유**: Pretendard는 한글·영문·숫자 균형이 우수하고 무료 가변 폰트로 9 굵기(Thin~Black) + Tabular Numbers 지원. 50대 사장님·주부 가독성에 우선 적합.

### 4.2 타입 스케일

| 토큰 | 크기 (모바일/데스크탑) | 행간 | 자간 | 굵기 | 용도 |
|------|----------------------|------|------|------|------|
| `type/display/lg` | 36 / 44px | 1.2 | -0.02em | 700 (Bold) | 대시보드 KPI 숫자 (사장님 4지표), 매출 카드 |
| `type/display/md` | 30 / 36px | 1.2 | -0.01em | 700 | 점심특선 할인가 (강조), 가입 환영 헤더 |
| `type/heading/1` | 24 / 28px | 1.3 | -0.01em | 700 | 페이지 제목, 모달 헤더 |
| `type/heading/2` | 20 / 24px | 1.3 | 0 | 600 (SemiBold) | 섹션 제목, 카드 제목 (매장명) |
| `type/heading/3` | 18 / 20px | 1.4 | 0 | 600 | 위젯·서브 카드 제목 |
| `type/body/lg` | 16 / 16px | 1.5 | 0 | 400 (Regular) | 본문 강조 (사장님 설명) |
| `type/body/md` | 14 / 14px | 1.5 | 0 | 400 | **기본 본문**, 테이블 셀, 폼 입력 |
| `type/body/sm` | 13 / 13px | 1.5 | 0.01em | 400 | 보조 정보, 거리·시간 메타 |
| `type/caption` | 12 / 12px | 1.4 | 0.02em | 500 (Medium) | 뱃지, 태그, 차트 축 |
| `type/overline` | 11 / 11px | 1.4 | 0.08em | 700 | 섹션 라벨, 그룹명 (UPPERCASE) |

### 4.3 큰 글씨 모드 스케일 (F-9007, NFR-019)

| 모드 | 배율 | 적용 토큰 | 대상 페르소나 |
|------|------|----------|-------------|
| 표준 | **1.0x** (디폴트) | `type/*` 그대로 | 김대리 (20·30대 직장인) |
| 큰 글씨 | **1.25x** | 모든 폰트 크기 ×1.25 | 이미경 (40·50대 주부) |
| 매우 큰 글씨 | **1.5x** | 모든 폰트 크기 ×1.5 | 박사장 (50대 사장님) |

> **구현 방식**: CSS root 변수 `--font-scale: 1.0 | 1.25 | 1.5` 동적 변경 + 모든 `type/*` 토큰을 `calc(N * var(--font-scale))`로 정의. LocalStorage 영속. 레이아웃 깨짐 방지를 위해 컨테이너 `max-width` 별도 적용.

### 4.4 사용 패턴

| 요소 | 적용 스타일 | 컬러 |
|------|-------------|------|
| 점심특선 카드 매장명 | `heading/2` SemiBold | `gray/900` |
| 점심특선 카드 메뉴명 | `body/lg` Medium | `gray/700` |
| 점심특선 카드 **할인가** | `display/md` Bold + tabular | `brand/primary-dark` |
| 점심특선 카드 정상가 | `body/sm` + line-through | `gray/400` |
| 점심특선 카드 **할인율%** | `heading/2` Bold + tabular | `brand/accent` |
| 거리·소요시간 메타 | `caption` Medium | `gray/500` |
| 영업중/곧 마감/휴무 뱃지 | `caption` SemiBold | Semantic color |
| 사장님 4지표 숫자 | `display/lg` Bold + tabular | `gray/900` |
| 사장님 4지표 ▲▼% | `caption` Medium | Semantic (Success/Danger) |
| 폼 라벨 | `body/sm` SemiBold | `gray/700` |
| 폼 입력 텍스트 | `body/md` Regular | `gray/900` |
| 버튼 텍스트 | `body/md` SemiBold + 0.02em | (Variant별) |
| 토스트 메시지 | `body/md` Medium | Surface 2 위 contrast |

---

## 5. 아이콘

### 5.1 아이콘 스타일

| 항목 | 값 |
|------|-----|
| 스타일 | **Outlined** (filled 아님, 점심특선·쿠폰 카테고리 아이콘만 filled 허용) |
| 라이브러리 | **Lucide Icons** (MIT, Pretendard와 시각적 조화) + 보조: **Phosphor Icons** |
| Stroke 너비 | 1.5px (≥24px), 2px (16~20px) |
| Corner radius | 2px |
| Filled 예외 | 한식·분식·카페·중식·일식·건강식 카테고리 (음식 이모지 보완) |

### 5.2 아이콘 크기

| 크기 | 토큰 | 용도 |
|------|------|------|
| 16px | `icon/xs` | 인라인 텍스트 옆, 테이블 셀 |
| 20px | `icon/sm` | 헤더 아이콘, 폼 leading |
| 24px | `icon/md` | **기본**, Bottom Tab, 카드 아이콘 |
| 32px | `icon/lg` | 빈 상태 일러스트 보조, FAB |
| 48px | `icon/xl` | 페이지 헤드 (회원가입 환영, 페르소나 아바타) |
| 64px+ | `icon/2xl` | 빈 상태 메인 일러스트 |

### 5.3 주요 아이콘 목록 (Lucide 기준)

| 카테고리 | 기능 | 아이콘 | 크기 |
|---------|------|--------|------|
| **시스템** | 검색 | `search` | 20px |
| | 알림 (배지 포함) | `bell` | 24px |
| | 설정 | `settings` | 24px |
| | 닫기 | `x` | 24px |
| | 뒤로 | `chevron-left` | 24px |
| | 더보기 | `more-vertical` | 24px |
| **탐색** | 지도 | `map` | 24px |
| | 리스트 | `list` | 24px |
| | 필터 | `sliders-horizontal` | 20px |
| | 위치 | `map-pin` | 24px |
| | 반경 (확대) | `target` | 20px |
| **점심특선·쿠폰** | 쿠폰 | `ticket-percent` | 24px |
| | QR 코드 | `qr-code` | 24px |
| | 시계 (소요시간) | `clock` | 16px |
| | 1인 좌석 | `user` | 16px |
| | 영업중 (점) | `circle` (filled) | 12px |
| | 즐겨찾기 (Phase 2) | `heart` / `heart-fill` | 24px |
| **카테고리 (이모지+아이콘 병용)** | 한식 | 🍚 + `utensils` | 24px |
| | 분식 | 🍜 + `utensils` | 24px |
| | 카페 | ☕ + `coffee` | 24px |
| | 양식 | 🍝 + `utensils` | 24px |
| | 건강식·샐러드 | 🥗 + `salad` | 24px |
| **사장님 통계** | 신규 고객 | `user-plus` | 24px |
| | 재방문율 | `repeat-2` | 24px |
| | 사용률 | `percent` | 24px |
| | 객단가 | `wallet` | 24px |
| | ROI 추세 ▲ | `trending-up` | 16px |
| | ROI 추세 ▼ | `trending-down` | 16px |
| **사장님 매장 관리** | 매장 추가 | `plus-circle` | 24px |
| | 점심특선 등록 | `chef-hat` | 24px |
| | QR 스캐너 (FAB) | `scan-line` | 32px (FAB) |
| **어드민** | 신고 (긴급) | `alert-triangle` | 24px |
| | 처리 완료 | `check-circle` | 24px |
| | 시스템 상태 | `activity` | 20px |

---

## 6. 핵심 UI 컴포넌트

### 6.1 버튼 (Button)

| Variant | 배경 (Light) | 텍스트 | 보더 | 용도 |
|---------|-------------|--------|------|------|
| **Primary** | `brand/primary` (#FFA726) | #FFFFFF | 없음 | "쿠폰 받기", "발행", "다음 →" (주요 액션) |
| **Secondary** | 투명 | `brand/primary` | 1px `brand/primary` | "이전", "취소" (보조 액션) |
| **Tertiary** | `gray/100` | `gray/700` | 없음 | "내보내기", "필터" (중립 액션) |
| **Danger** | `semantic/danger` (#D32F2F) | #FFFFFF | 없음 | "탈퇴", "삭제", "정지" |
| **Success** | `semantic/success` (#2E7D32) | #FFFFFF | 없음 | "사용 완료", "처리" |
| **Ghost** | 투명 | `brand/primary` | 없음 | 텍스트 링크형 |
| **Disabled** | `gray/200` | `gray/400` | 없음 | 매진, 미인증 (CTA 비활성) |

**크기 (모바일 우선)**:

| 크기 | 토큰 | 높이 | Padding X | 폰트 | 용도 |
|------|------|------|-----------|------|------|
| sm | `button/sm` | 32px | 12px | `body/sm` SemiBold | 인라인, 카드 내부 |
| md | `button/md` | 44px | 16px | `body/md` SemiBold | **기본**, 폼 내부 |
| lg | `button/lg` | 56px | 24px | `body/lg` SemiBold | **CTA 하단 고정** (쿠폰 받기, 발행), 터치 우선 |

**기타 속성**:
- Border-radius: **12px** (`radius/lg`)
- Hover: 배경 10% 어둡게 (150ms ease-out)
- Active: scale(0.98) (50ms)
- Loading: 좌측 스피너 + 텍스트 유지
- 터치 타겟 최소 44×44px (NFR-018, WCAG 2.1 AA)

### 6.2 입력 필드 (Input)

| 속성 | 값 |
|------|-----|
| 높이 | **44px** (모바일 터치 우선) / 40px (어드민) |
| Border-radius | **12px** |
| 기본 보더 | 1px `gray/200` |
| 포커스 보더 | 2px `brand/primary` |
| 에러 보더 | 2px `semantic/danger` + 우측 alert-circle 아이콘 |
| 비활성 | 배경 `gray/50`, 보더 `gray/200`, 텍스트 `gray/400` |
| 라벨 | 위치: 상단, `body/sm` SemiBold, 8px 간격 |
| Placeholder | `gray/400` |
| Helper text | `body/sm` `gray/500`, 4px 간격 |
| 에러 메시지 | `body/sm` `semantic/danger`, leading icon |
| **단위 표시** | 우측 `gray/500` (예: "원", "분", "%") |

### 6.3 카드 — 점심특선 카드 (CRITICAL · F-0202)

**점심특선 카드 = 본 서비스의 핵심 컴포넌트**. 카드 1개 = 1결정 원칙의 시각적 구현.

| 속성 | 값 |
|------|-----|
| 배경 | Surface 2 (#FFFFFF) |
| Border-radius | **16px** (`radius/xl`) |
| 그림자 | `shadow/sm` (호버 시 `shadow/md`) |
| 패딩 | 0 (사진 풀블리드) / 정보 영역 16px |
| 사진 비율 | **4:3** (lazy load, blur placeholder) |
| 카드 크기 | 모바일: `100% - 32px` (좌우 16px gutter) |
| 호버 | translateY(-2px) + `shadow/md` (200ms) |

**구조**:
```
┌─────────────────────────────┐
│ [영업중 ●]   📷 4:3 사진     │ ← 사진 60%
│             [-25% 뱃지]      │
├─────────────────────────────┤
│ 진고개 한식당   ⭐ 4.8 · 0.1km│ ← heading/2 + caption
│ 제육볶음 쌈밥정식              │ ← body/lg
│ ₩10,000 → ₩7,500    🕐 15-25분│ ← display/md (가격) + caption
│ -25%                          │ ← heading/2 (할인율, brand/accent)
└─────────────────────────────┘
```

### 6.4 카드 — 일반·KPI 카드

| 속성 | 값 |
|------|-----|
| 배경 | Surface 1 / Surface 2 |
| Border-radius | 12px (`radius/lg`) |
| 보더 | 1px `gray/200` (또는 그림자만) |
| 패딩 | 16px (모바일) / 24px (데스크탑) |
| 그림자 | `shadow/sm` |

**KPI 카드 (사장님 4지표)**:
```
┌──────────────────┐
│ 신규 고객  user-plus│ ← caption + icon
│                    │
│   42 ▲12%         │ ← display/lg + caption (semantic)
└──────────────────┘
```

### 6.5 뱃지 & 태그

| 유형 | 스타일 | 용도 |
|------|--------|------|
| **Status Dot Badge** | 8px filled circle + caption | 영업 상태 (Success/Warning/Gray) |
| **Discount Badge** | rounded-full, `brand/accent` bg, white text, "-25%" | 할인율 표기 (점심특선 카드 우상단) |
| **Limit Badge** | 코랄 텍스트 + 🔥, "잔여 5개" | 한정 수량 마감 임박 |
| **Category Tag** | rounded-md, `brand/primary-light` bg, `brand/primary-dark` text | 한식·분식 등 카테고리 |
| **Count Badge** | 16px 원형, `semantic/danger`, white | 알림 카운트 (Tab Bar 알림 아이콘 위) |
| **Phase 2/3 Badge** | rounded-full, `gray/100`, `gray/600` | "Phase 2" 표기 (P1/P2 화면) |

### 6.6 영업 상태 뱃지 (3종, F-0203)

| 상태 | Dot 컬러 | 텍스트 | 배경 |
|------|---------|--------|------|
| 영업중 | `semantic/success` (#2E7D32) | "영업중" | `semantic/success/bg` (#E8F5E9) |
| 곧 마감 | `semantic/warning` (#ED6C02) | "곧 마감" | `semantic/warning/bg` (#FFF3E0) |
| 휴무·마감 | `gray/400` | "휴무" / "마감" | `gray/100` |

### 6.7 데이터 테이블 (어드민, 사장님 통계)

| 속성 | 값 |
|------|-----|
| 헤더 스타일 | `overline` UPPERCASE / `gray/400` / `gray/50` 배경 |
| 셀 스타일 | `body/md` / `gray/700` / 48px 높이 |
| 행 호버 | `gray/50` 배경 (150ms) |
| 행 보더 | 1px bottom `gray/100` |
| 페이지네이션 | 하단, 10/20/50/100 선택, prev/next 화살표 |
| 정렬 표시 | 헤더 우측 chevron 아이콘 (asc/desc) |
| 모바일 대응 | 수직 카드형으로 자동 변환 (1행 = 1카드) |

### 6.8 모달 · Bottom Sheet · Toast (정보구조도 §8 참조)

| 패턴 | 크기 | Border-radius | 사용 사례 |
|------|------|--------------|----------|
| **Bottom Sheet** | 50% 또는 가변 높이 | 16px top corners | SCR-USR-003 카테고리 필터, 정렬 드롭다운 |
| **Center Modal Small** | 320px (모바일 90vw) | 16px | 확인 다이얼로그, 스캔 결과 |
| **Center Modal Medium** | 480px | 16px | 신고·이의제기 폼, 신규 매장 알림 |
| **Center Modal Large** | 640px (모바일 풀스크린) | 16px (데스크탑) / 0 (모바일) | 어드민 신고 상세 |
| **Full Modal (모바일)** | 100vw × 100vh | 0 | SCR-USR-004 검색, SCR-USR-008 본인 인증 |
| **Toast** | 자동 너비, max 360px | 8px | 발급 성공, 권한 안내 (3초 자동 닫힘) |
| **Drawer (Phase 2)** | W: 280px | 0 (slide-in from left) | 즐겨찾기 빠른 보기 |

**오버레이**: `rgba(0, 0, 0, 0.4)` (Light), `rgba(0, 0, 0, 0.6)` (Dark)

### 6.9 Bottom Tab Bar (사용자 앱) · Bottom Nav (사장님 앱)

| 속성 | 값 |
|------|-----|
| 높이 | **60px** + Safe Area inset |
| 배경 | Surface 1 (#FAFAFA) + 1px top border `gray/200` |
| 탭 개수 | 5개 (사용자: 홈/탐색/쿠폰함/알림/마이 · 사장님: 홈/매장/쿠폰/통계/설정) |
| 활성 아이콘 | 24px `brand/primary` (filled 또는 stroke 강조) |
| 비활성 아이콘 | 24px `gray/400` |
| 라벨 | `caption` Medium, 활성 `brand/primary-dark`, 비활성 `gray/500` |
| 알림 뱃지 | Count Badge (탭 아이콘 우상단) |
| 터치 영역 | 각 탭 최소 60×60px |

### 6.10 Floating Action Button (FAB)

사장님 앱 SCR-OWN-005 홈 대시보드 우하단 QR 스캐너 진입.

| 속성 | 값 |
|------|-----|
| 크기 | 56×56px (모바일) / 64×64px (태블릿) |
| 위치 | 우하단, Bottom Nav 위 16px |
| 배경 | `brand/primary` 그라데이션 |
| 그림자 | `shadow/lg` |
| 아이콘 | `scan-line` 32px, white |
| 호버 | scale(1.05) + `shadow/xl` (200ms) |

---

## 7. 데이터 시각화 (사장님 통계 대시보드)

### 7.1 차트 공통 스타일

| 속성 | 값 |
|------|-----|
| 컨테이너 Border-radius | 12px |
| 컨테이너 배경 | Surface 2 |
| 그리드 라인 | `gray/100`, 1px, value axis만 노출 |
| 카테고리 축 | 라인 없음, `gray/400` 라벨 |
| 축 라벨 | `caption` `gray/400` |
| 툴팁 | Surface 3 (Dark), white 텍스트, 8px padding |
| 애니메이션 | 600ms ease-out (진입), 200ms (인터랙션) |

### 7.2 차트 유형 매핑

| 유형 | 사용 화면 | 비고 |
|------|----------|------|
| **Number Card (KPI)** | SCR-OWN-008 4지표 | `display/lg` 숫자 + 전 기간 대비 ▲▼% |
| **Line Chart** | SCR-OWN-008 추세 (7일/12주/12개월) | gradient fill 10% opacity, lineSmooth true |
| **Bar Chart** | SCR-OWN-009 쿠폰별 사용 | rounded top corners (4px) |
| **Donut Chart** | 서비스기획서 슬라이드 수익원 60/25/10/5% | inner radius 60% |
| **Heatmap** | SCR-OWN-009 시간대별 사용 분포 (11~14시) | 5단계 그라데이션 (`#FFE0B2` → `#FF8F00`) |
| **Sparkline** | KPI 카드 내부 미니 추세 | 80×24px, 축 없음, 마지막 점만 강조 |
| **Progress Bar** | 한정 수량 잔여 (예: 잔여 8/50) | `brand/primary`, `gray/200` 배경 |
| **Gauge** | (Phase 2+) 월 광고 예산 소진율 | 색상 구간 (Green/Amber/Red) |

### 7.3 ROI 카드 (F-0506 · 사장님 락인 핵심)

```
┌────────────────────────────────────────┐
│ 이번 주 ROI                  📊        │
│                                          │
│ 비용 N원 → 신규 N명 → 매출 N원         │
│  └─ 쿠폰 1장 = 단골 3명 환산            │
└────────────────────────────────────────┘
```

| 요소 | 스타일 |
|------|--------|
| 비용·매출 숫자 | `display/md` Bold + tabular, `gray/900` |
| 화살표 → | `body/lg` `gray/400` |
| 환산 메시지 | `body/sm` `brand/primary-dark` |
| 카드 배경 | `brand/primary-light` (#FFE0B2 25% alpha) |

---

## 8. 인터랙션 & 모션

### 8.1 트랜지션 원칙

| 토큰 | 값 | 용도 |
|------|-----|------|
| `motion/micro` | 100ms ease-out | 색상 변화, 미세 상태 |
| `motion/fast` | 150ms ease-out | 버튼 hover/active |
| `motion/normal` | 200ms ease-out | **기본**, 토글, 탭 전환 |
| `motion/slow` | 300ms ease-out | 모달, Bottom Sheet 열기 |
| `motion/celebration` | 500ms cubic-bezier(0.4, 0, 0.2, 1) | 쿠폰 발급 성공, 사용 완료 (성취감) |

### 8.2 주요 인터랙션 패턴

| 요소 | 트리거 | 효과 | 시간 |
|------|--------|------|------|
| 점심특선 카드 호버 | hover | translateY(-2px) + `shadow/md` | 200ms |
| 카드 탭 (모바일) | tap | scale(0.98) + 상세 진입 | 50ms + 0.5s 페이드 |
| 버튼 호버 | hover | 배경 10% 어둡게 | 150ms |
| 버튼 active | active | scale(0.98) | 50ms |
| 모달·Bottom Sheet 열기 | trigger | fade + slide-in (모바일: bottom, 데스크탑: scale 0.95→1) | 300ms |
| Toast 알림 | trigger | slide-in (모바일: top, 데스크탑: bottom-right) | 300ms |
| **쿠폰 발급 성공** | API 200 | 카드 펄스 + 체크 아이콘 + "내 쿠폰함" 토스트 | 500ms (celebration) |
| **쿠폰 사용 완료** (사장님 QR 스캔) | API 200 | 풀스크린 그린 플래시 + 할인 금액 카운터 업 | 500ms (celebration) |
| QR 만료 카운터 (60→0초) | tick | 원형 stroke-dashoffset 애니메이션 | 1s linear |
| 영업 상태 토글 | toggle | 뱃지 컬러 트랜지션 + 사용자 피드 1분 이내 반영 | 200ms |
| Tab Bar 전환 | tap | 인디케이터 슬라이드 + 아이콘 컬러 트랜지션 | 200ms |
| 무한 스크롤 로드 | scroll bottom | 하단 스피너 → 신규 카드 페이드 인 | 300ms |
| Skeleton Loader | API 로딩 | shimmer 애니메이션 (1.5s loop) | — |

### 8.3 햅틱 피드백 (모바일 only)

| 이벤트 | 햅틱 |
|--------|------|
| 쿠폰 발급 성공 | Light Impact |
| 쿠폰 사용 완료 (스캔) | Success Notification |
| 위치 검증 실패 (100m 초과) | Warning Notification |
| 만료·매진 | Error Notification |
| 버튼 long-press | Light Impact |

### 8.4 `prefers-reduced-motion` 지원 (NFR-018)

모든 애니메이션은 `@media (prefers-reduced-motion: reduce)` 시 instant 또는 최소 100ms로 단축. 펄스·바운스·shimmer는 비활성화.

---

## 9. 반응형 & 접근성

### 9.1 브레이크포인트 (NFR-017)

| 이름 | 토큰 | 크기 | 용도 |
|------|------|------|------|
| Mobile S | `bp/xs` | 320px+ | iPhone SE, 갤럭시 폴드 |
| Mobile M | `bp/sm` | 375px+ | iPhone 12/13/14 (**기본**) |
| Mobile L | `bp/md` | 414px+ | iPhone Pro Max |
| Tablet | `bp/lg` | 768px+ | iPad Mini, 사장님 앱 확장 |
| Desktop | `bp/xl` | 1024px+ | 어드민 우선 진입 지점 |
| Wide | `bp/2xl` | 1280px+ | 어드민 max width |

### 9.2 접근성 기준 (WCAG 2.1 AA · NFR-018·019)

| 항목 | 기준 | 검증 도구 |
|------|------|----------|
| **포커스 상태** | 2px solid outline, `brand/primary`, 2px offset | Lighthouse, axe-core |
| **텍스트 대비** | **최소 4.5:1** (본문), 3:1 (대형 텍스트 18pt+) | WebAIM Contrast Checker |
| **터치 타겟** | **최소 44×44px** (Bottom Tab은 60×60px) | 수동 검증 |
| **상태 표시** | 색상 + 아이콘 (색맹 대응, 색상만 사용 금지) | 수동 검증 |
| **에러 표시** | 아이콘 + 텍스트 + 보더 (3중 코딩) | 수동 검증 |
| **alt 텍스트** | 모든 `<img>` 필수 (장식용은 `alt=""`) | axe-core 자동 |
| **ARIA 라벨** | 모든 아이콘 버튼에 `aria-label` | axe-core 자동 |
| **키보드 내비게이션** | Tab 순서 논리적, Skip Link 제공 | 수동 (Tab만으로 전체 조작) |
| **스크린리더** | VoiceOver(iOS) / TalkBack(Android) 호환 | 수동 검증 |
| **모션 감소** | `prefers-reduced-motion: reduce` 대응 | 시스템 설정 토글 |
| **다크 모드** | `prefers-color-scheme` 대응 + 사용자 설정 우선 | 시스템 설정 토글 |
| **다국어** | Phase 4 검토 (외국인 직장인) | i18n 키 분리 |
| **Lighthouse Accessibility** | **90+** (CI 자동 검증) | Lighthouse CI |

### 9.3 다크 모드 토큰 매핑

| Light 토큰 | Dark 토큰 | 비고 |
|------------|----------|------|
| `surface/0` #FFFFFF | #0F1419 | 페이지 배경 |
| `surface/1` #FAFAFA | #1A2028 | 카드 |
| `surface/2` #FFFFFF | #1A2028 + shadow | 떠있는 카드 |
| `brand/primary` #FFA726 | #FFB74D | 살짝 밝게 (어두운 배경 가독성) |
| `brand/accent` #FF5722 | #FF7043 | 동일 |
| `gray/900` (텍스트) | `gray/0` 역전 #F5F7FA | — |
| `gray/700` | `gray/300` 역전 #D5DCE5 | — |

---

## 10. 디자인 토큰 네이밍 규칙

### 10.1 명명 컨벤션

```
{category}/{subcategory}/{variant}/{state}

예시:
color/brand/primary/default
color/brand/primary/hover
color/semantic/danger/text
color/semantic/danger/bg
color/gray/700
surface/2
typography/heading/1
typography/body/md
spacing/base                  -- 16px
spacing/lg                    -- 24px
radius/sm                     -- 4px
radius/md                     -- 8px
radius/lg                     -- 12px
radius/xl                     -- 16px
radius/full                   -- 9999px
shadow/sm                     -- 0 1px 2px rgba(0,0,0,0.05)
shadow/md                     -- 0 4px 12px rgba(0,0,0,0.08)
shadow/lg                     -- 0 8px 30px rgba(0,0,0,0.12)
shadow/xl                     -- 0 20px 60px rgba(0,0,0,0.15)
motion/normal                 -- 200ms ease-out
icon/md                       -- 24px
breakpoint/sm                 -- 375px
```

### 10.2 컴포넌트 토큰 예시 (Tailwind CSS 매핑)

```css
:root {
  --color-brand-primary: #FFA726;
  --color-brand-primary-dark: #F57C00;
  --color-brand-primary-light: #FFE0B2;
  --color-brand-secondary: #43A047;
  --color-brand-accent: #FF5722;

  --color-gray-50: #FAFAFA;
  --color-gray-100: #F3F4F6;
  /* ... */

  --color-semantic-success: #2E7D32;
  --color-semantic-success-bg: #E8F5E9;
  --color-semantic-warning: #ED6C02;
  --color-semantic-warning-bg: #FFF3E0;
  --color-semantic-danger: #D32F2F;
  --color-semantic-danger-bg: #FFEBEE;
  --color-semantic-info: #1976D2;
  --color-semantic-info-bg: #E3F2FD;

  --font-scale: 1.0;
  --font-sans: 'Pretendard Variable', 'Noto Sans KR', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'D2Coding', monospace;

  --type-display-lg: calc(36px * var(--font-scale));
  --type-heading-1: calc(24px * var(--font-scale));
  --type-body-md: calc(14px * var(--font-scale));
  /* ... */

  --spacing-base: 16px;
  --spacing-lg: 24px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);

  --motion-normal: 200ms ease-out;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-brand-primary: #FFB74D;
    --color-gray-50: #1A2028;
    /* ... */
  }
}
```

### 10.3 Tailwind 설정 매핑 (참고)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FFA726',
          'primary-dark': '#F57C00',
          'primary-light': '#FFE0B2',
          secondary: '#43A047',
          accent: '#FF5722',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 12px rgba(0,0,0,0.08)',
        'lg': '0 8px 30px rgba(0,0,0,0.12)',
      },
    },
  },
};
```

---

## 11. 핵심 화면별 디자인 적용 예시

### 11.1 SCR-USR-005 메인 피드 — 디자인 토큰 매핑

| 요소 | 토큰 |
|------|------|
| 배경 | `surface/0` |
| 헤더 | `surface/1` + `shadow/sm` |
| 카드 | `surface/2` + `radius/xl` (16px) + `shadow/sm` |
| 정렬·필터 칩 | `gray/100` 배경, `body/sm` Medium, `radius/full` |
| 카드 매장명 | `type/heading/2` `gray/900` |
| 카드 할인가 | `type/display/md` Bold tabular `brand/primary-dark` |
| 할인율 % 뱃지 | `brand/accent` 배경, white text, `radius/full`, 12px padding |
| Bottom Tab | `surface/1`, 활성 `brand/primary` |

### 11.2 SCR-OWN-005 사장님 홈 대시보드 — 디자인 토큰 매핑

| 요소 | 토큰 |
|------|------|
| 영업중 토글 | `semantic/success/bg` + `semantic/success` dot |
| 4지표 카드 | 4-column grid (모바일 2×2), `surface/2`, `radius/lg`, 16px padding |
| KPI 숫자 | `display/lg` Bold tabular `gray/900` |
| 추세 ▲% | `caption` `semantic/success` |
| FAB QR 스캐너 | `brand/primary` 그라데이션 + `shadow/lg`, 56×56 |

### 11.3 SCR-USR-009 QR 제시 — 디자인 토큰 매핑

| 요소 | 토큰 |
|------|------|
| 배경 | `surface/0` + 화면 밝기 자동 100% |
| 매장명 | `heading/1` `gray/900` |
| 메뉴명 | `body/lg` `gray/700` |
| 할인가 | `display/md` Bold `brand/primary-dark` |
| QR 코드 | 280×280px, 중앙 정렬 |
| 카운터 (60→0초) | 원형 progress, `brand/primary` stroke 4px |
| 카운터 텍스트 | `heading/1` Bold tabular `brand/accent` (10초 이하) |

---

## 12. 구현 가이드 (개발자용)

### 12.1 컴포넌트 라이브러리 구조 (Next.js + Tailwind)

```
src/frontend/components/
├── ui/                     # 디자인 시스템 컴포넌트
│   ├── Button.tsx          # Primary/Secondary/Danger 등
│   ├── Input.tsx
│   ├── Card.tsx            # KPI/일반 카드
│   ├── LunchSpecialCard.tsx # 점심특선 4요소 카드
│   ├── Badge.tsx           # Status/Discount/Limit/Category
│   ├── Modal.tsx
│   ├── BottomSheet.tsx
│   ├── Toast.tsx
│   ├── TabBar.tsx
│   ├── BottomNav.tsx
│   └── FAB.tsx
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── motion.ts
└── icons/                  # Lucide wrapper
    └── index.tsx
```

### 12.2 컴포넌트 명세 예시 (Button)

```tsx
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
};
```

### 12.3 CI 자동 검증

| 항목 | 도구 | 임계값 |
|------|------|--------|
| Lighthouse Accessibility | Lighthouse CI | ≥ 90 |
| Visual Regression | Chromatic / Percy | 차이 0px |
| Contrast Ratio | axe-core | 0 Critical |
| 토큰 일관성 | Stylelint custom rule | 0 Warning |

---

## 13. 변경 이력

| 버전 | 일자 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| v1.0 | 2026-06-01 | 최초 작성. 서비스기획서 v1.0 §5 브랜드(오렌지 옐로 #FFA726 + 그린 #43A047 + 코랄 #FF5722) + 화면설계서 v1.0 §5 공통 UI 원칙 기반. 모바일 우선 컴포넌트 라이브러리 정의 (점심특선 카드, KPI 카드, 영업 상태 뱃지, FAB QR 스캐너 등). 큰 글씨 모드 1.0/1.25/1.5x, 다크 모드, WCAG 2.1 AA 풀 매핑. Pretendard Variable + Lucide Icons 채택. Tailwind CSS 매핑 예시 포함. | PM |

---

**작성 완료 여부**: [x] 디자인 원칙 + 레이아웃 + 컬러·타입·아이콘 시스템 + 핵심 컴포넌트 10종 + 데이터 시각화 + 인터랙션 + 접근성 + 토큰 매핑 + 구현 가이드

**다음 산출물**:
- **#10 인프라아키텍처** + **#12 데이터베이스설계서** (Group B 동시 진행 중)
- Phase 3 진입 — W4 구현 셋업: Tailwind 설정, 컴포넌트 라이브러리 스캐폴딩, Storybook 도입 검토
