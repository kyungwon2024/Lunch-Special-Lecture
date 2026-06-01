<style>
@media print {
    body, p, li { font-size: 13pt !important; line-height: 1.6 !important; }
    h1 { font-size: 22pt !important; margin-top: 22pt !important; margin-bottom: 14pt !important; }
    h2 { font-size: 18pt !important; margin-top: 18pt !important; margin-bottom: 12pt !important; }
    h3 { font-size: 16pt !important; margin-top: 16pt !important; margin-bottom: 10pt !important; }
    h4 { font-size: 14pt !important; margin-top: 12pt !important; margin-bottom: 8pt !important; }
    ul, ol { margin-top: 5pt !important; margin-bottom: 5pt !important; padding-left: 22pt !important; }
}
</style>

# API 스펙 (RESTful API Specification) · 점심특강

> Week 3 산출물. `02.기획문서/기능명세서.md` v1.0의 기능 명세 및 API 요약 테이블을 바탕으로 설계된 RESTful API 상세 규격서입니다.

**프로젝트명**: 점심특강 (Lunch Special Lecture)
**작성일**: 2026-05-31
**버전**: v1.0
**작성자**: PM / AI Architect

**근거 문서**:
- [기능명세서.md](기능명세서.md) v1.0 (Master List 59건 + Must 47건 풀 명세)
- [요구사항정의서.md](요구사항정의서.md) v1.0 (REQ 61건 + NFR 25건 + US 15건)
- [서비스기획서.md](서비스기획서.md) v1.0
- [착수보고서.md](../01.관리문서/착수보고서.md) v1.2

**ID 체계**:
- API ID: `API-{METHOD}-{path-slug}` (예: `API-GET-restaurants`, `API-POST-coupons-issue`)
- 기능 ID 연계: `F-XXXX` (기능명세서.md)
- 요구사항 ID 연계: `REQ-XXX`, `NFR-XXX` (요구사항정의서.md)
- 화면 ID 연계: `SCR-{USR|OWN|ADM}-NNN` (정보구조도.md, 화면설계서.md)

---

## 1. API 공통 사항

### 1.1 기본 정보

| 항목 | 내용 |
|------|------|
| **Base URL (개발)** | `http://localhost:3000/api` |
| **Base URL (운영)** | `https://api.lunchspecial.kr` (예정) |
| **인증 방식** | HTTP Header `Authorization: Bearer <JWT_TOKEN>` |
| **응답 형식** | JSON (`Content-Type: application/json`) |
| **문자 인코딩** | UTF-8 |
| **API 버저닝** | URL Path 또는 Header (`Accept: application/vnd.lunch.v1+json`) — v1 기본 |
| **타임존** | KST (Asia/Seoul, `+09:00`) — 모든 datetime은 ISO 8601 형식 |
| **금액 단위** | KRW Zero-Decimal (예: `7500` = 7,500원, 100 곱하지 않음) |

### 1.2 응답 공통 규격 (Response Envelope)

```json
{
  "status": "success" | "error",
  "data": {},
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "상세한 에러 메시지"
  }
}
```

- 성공 응답: `status="success"`, `data` 객체 포함, `error` 필드 생략
- 에러 응답: `status="error"`, `error.code`/`error.message` 포함, `data` 필드 생략

### 1.3 JWT 인증 (Authentication)

#### 토큰 종류

| 토큰 | 만료 | 발급 시점 | 갱신 방법 |
|------|------|-----------|-----------|
| Access Token | 1시간 | 로그인/회원가입 성공 시 | Refresh Token으로 재발급 |
| Refresh Token | 30일 | 로그인/회원가입 성공 시 | 재로그인 |
| QR 1회용 토큰 | 60초 | 쿠폰 제시 시 (F-0303) | 만료 시 자동 재발급 |

#### JWT Payload 구조 (HS256)

```json
{
  "sub": "user_777",
  "role": "USR" | "OWN" | "ADM",
  "verified": true,
  "iat": 1748678400,
  "exp": 1748682000
}
```

| 클레임 | 타입 | 설명 |
|--------|------|------|
| `sub` | String | 사용자 식별자 (user_id / owner_id) |
| `role` | Enum | `USR` (사용자) / `OWN` (사장님) / `ADM` (어드민) |
| `verified` | Boolean | 본인 인증 완료 여부 (F-0302) |
| `iat` | Integer | 발급 시각 (Unix epoch, 초) |
| `exp` | Integer | 만료 시각 (Unix epoch, 초) |

### 1.4 권한 매트릭스 (Authorization Matrix)

| API 그룹 | USR (사용자) | OWN (사장님) | ADM (어드민) | 비고 |
|----------|:---:|:---:|:---:|------|
| **공개 조회** (restaurants, search, lunch-specials) | O | O | O | 인증 불필요 (게스트 가능) |
| **쿠폰 발급/조회** (coupons/issue, /me, /token) | O | X | O | `verified=true` 필수 |
| **쿠폰 사용 처리** (coupons/redeem) | X | O | X | 매장 소유주만 |
| **알림** (notifications, /read) | O | O | O | 본인 알림만 |
| **매장 등록·수정** (stores, /meta, /status) | X | O | O (감사용) | 본인 매장만 |
| **점심특선·쿠폰 발행** (lunch-specials, coupons) | X | O | X | 본인 매장만 |
| **통계·ROI** (metrics, roi, analytics) | X | O | O | 본인 매장만 |
| **회원 관리** (signup, signup-owner, users/me) | O | O | O | 본인 계정만 |
| **신고** (reports POST) | O | O | X | 신고자 |
| **신고 처리** (reports PATCH) | X | X | O | 어드민 전용 |
| **B2B** (b2b/...) | X | O (HR) | O | 회사 관리자 |
| **광고 캠페인** (ads/campaigns) | X | O | O | Phase 3 |
| **결제** (payments/...) | O | X | X | Phase 3 |

> 권한 미달 시 `403 FORBIDDEN` 응답. `verified=false` 사용자가 쿠폰 발급을 시도하면 `401 IDENTITY_VERIFICATION_REQUIRED` 응답.

---

## 2. 공통 에러 코드 (Common Error Codes)

| HTTP 상태 코드 | 에러 코드 | 설명 |
|----------------|-----------|------|
| **400** | `BAD_REQUEST` | 파라미터 유효성 검증 실패 등 잘못된 요청 |
| **400** | `VALIDATION_ERROR` | 필드 유효성 검증 실패 (필드명 동봉) |
| **401** | `UNAUTHORIZED` | 만료되거나 유효하지 않은 JWT 토큰 제시 |
| **401** | `IDENTITY_VERIFICATION_REQUIRED` | 본인 인증 미완료 상태에서 쿠폰 발급 시도 |
| **403** | `FORBIDDEN` | 권한 분리 미달 (예: 사장님 기능에 사용자가 접근) |
| **404** | `NOT_FOUND` | 리소스가 존재하지 않거나 잘못된 Endpoint |
| **409** | `CONFLICT` | 중복 리소스 또는 동시성 충돌 (ALREADY_ISSUED, ALREADY_REDEEMED 등) |
| **410** | `SOLD_OUT` | 한정 수량 매진 |
| **429** | `RATE_LIMIT_EXCEEDED` | 1일/1시간 호출 한도 초과 (NFR-011) |
| **500** | `INTERNAL_ERROR` | 서버 내부 로직 처리 실패 |
| **503** | `SERVICE_UNAVAILABLE` | 외부 의존 (PG, 본인인증, 카카오맵) 일시 장애 |

### Rate Limit 정책 (NFR-011)

| 대상 | 제한 |
|------|------|
| 미인증 게스트 | 60 req/분 (IP 기준) |
| 인증 사용자 (USR) | 600 req/분 |
| 사장님 (OWN) | 1200 req/분 |
| 어드민 (ADM) | 무제한 |
| 쿠폰 발급 (POST /coupons/issue) | 사용자당 일 5회 (F-0306) |

> 초과 시 `429 RATE_LIMIT_EXCEEDED` + `Retry-After` 헤더 동봉.

---

## 3. API 엔드포인트 목록 (Master List)

> **총 37개 API** = MVP Must 28개 + Phase 2 Should 6개 + Phase 3 Could 3개

| API ID | Method | URL | 기능명 | 관련 기능 ID |
|--------|--------|-----|--------|-------------|
| **API-GET-restaurants** | `GET` | `/api/restaurants` | 위치 기반 식당 탐색 (지도/리스트) | F-0101~107 |
| **API-GET-search** | `GET` | `/api/search` | 매장·메뉴 검색 | F-0108 |
| **API-GET-lunch-specials** | `GET` | `/api/lunch-specials` | 오늘의 점심특선 메인 피드 | F-0201~205, 207 |
| **API-GET-lunch-specials-detail** | `GET` | `/api/lunch-specials/{id}` | 점심특선 상세 화면 | F-0206 |
| **API-POST-coupons-issue** | `POST` | `/api/coupons/issue` | 쿠폰 발급 | F-0301 |
| **API-POST-auth-verify-identity** | `POST` | `/api/auth/verify-identity` | 사용자 본인 인증 (KISA SMS) | F-0302 |
| **API-POST-coupons-token** | `POST` | `/api/coupons/{id}/token` | QR/바코드 토큰 생성 (1분 만료) | F-0303 |
| **API-POST-coupons-redeem** | `POST` | `/api/coupons/redeem` | 사장님 QR 스캔 처리 | F-0304, F-0305 |
| **API-GET-coupons-me** | `GET` | `/api/coupons/me` | 내 쿠폰함 화면 | F-0307, F-0309 |
| **API-GET-notifications** | `GET` | `/api/notifications` | 인앱 알림 센터 (조회) | F-0308, F-9006 |
| **API-PATCH-notifications-read** | `PATCH` | `/api/notifications/{id}/read` | 인앱 알림 읽음 처리 | F-9006 |
| **API-POST-owners-verify-business** | `POST` | `/api/owners/verify-business` | 사장님 사업자 인증 | F-0401 |
| **API-POST-stores** | `POST` | `/api/stores` | 매장 등록 | F-0402 |
| **API-PATCH-stores-meta** | `PATCH` | `/api/stores/{id}/meta` | 매장 메타데이터 입력 | F-0403 |
| **API-POST-lunch-specials** | `POST` | `/api/stores/{id}/lunch-specials` | 일별 점심특선 등록 | F-0404 |
| **API-POST-recurring-specials** | `POST` | `/api/stores/{id}/recurring-specials` | 요일별 점심특선 반복 등록 | F-0405 |
| **API-PATCH-lunch-specials-status** | `PATCH` | `/api/lunch-specials/{id}/status` | 즉시/예약 발행 상태 수정 | F-0406 |
| **API-PATCH-stores-status** | `PATCH` | `/api/stores/{id}/status` | 실시간 영업 상태 토글 | F-0407 |
| **API-PATCH-stores** | `PATCH` | `/api/stores/{id}` | 매장 정보·메뉴 수정 | F-0408 |
| **API-GET-stores-audit** | `GET` | `/api/stores/{id}/audit` | 매장 수정 이력 (30일 감사 로그) | F-0408 |
| **API-POST-coupons** | `POST` | `/api/stores/{id}/coupons` | 쿠폰 발행 (정액/정률) | F-0501~503 |
| **API-GET-metrics** | `GET` | `/api/stores/{id}/metrics` | 핵심 4지표 대시보드 | F-0504, F-0505 |
| **API-GET-roi** | `GET` | `/api/stores/{id}/roi` | ROI 카드 | F-0506 |
| **API-GET-coupons-analytics** | `GET` | `/api/stores/{id}/coupons/analytics` | 쿠폰별 성과 분석 + 가이드 | F-0507 |
| **API-POST-auth-signup** | `POST` | `/api/auth/signup` | 사용자 회원가입 (소셜 + 본인 인증) | F-9001 |
| **API-POST-auth-signup-owner** | `POST` | `/api/auth/signup-owner` | 사장님 회원가입 | F-9002 |
| **API-POST-reports** | `POST` | `/api/reports` | 신고·이의제기 처리 | F-9004 |
| **API-DELETE-users-me** | `DELETE` | `/api/users/me` | 회원 탈퇴 | F-9005 |
| **API-GET-metrics-export** | `GET` | `/api/stores/{id}/metrics/export` | [Should] 통계 CSV/Excel 내보내기 | F-0508 |
| **API-POST-reviews** | `POST` | `/api/stores/{id}/reviews` | [Should] 사용자 리뷰·별점 작성 | F-7001 |
| **API-POST-favorites** | `POST` | `/api/users/me/favorites` | [Should] 즐겨찾기 매장 등록 | F-7002 |
| **API-POST-b2b-employees** | `POST` | `/api/b2b/{companyId}/employees/bulk` | [Should] B2B 임직원 대량 등록 | F-7005 |
| **API-POST-meal-tickets-issue** | `POST` | `/api/b2b/{companyId}/meal-tickets/issue` | [Should] B2B 식권 일괄 발행 | F-7005 |
| **API-GET-b2b-settlements** | `GET` | `/api/b2b/{companyId}/settlements` | [Should] B2B 정산 대시보드 | F-7006 |
| **API-POST-ads** | `POST` | `/api/ads/campaigns` | [Could] 광고 상품 정식 운영 | F-8001 |
| **API-POST-payments** | `POST` | `/api/payments/intent` | [Could] 결제 인텐트 생성 (토스페이) | F-8002/3 |
| **API-POST-invitations** | `POST` | `/api/invitations` | [Could] 친구 초대·공유 링크 생성 | F-8004 |

---

## 4. API 상세 (API Specification Details)

---

### API-GET-restaurants. 위치 기반 식당 탐색

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/restaurants` |
| **권한** | 게스트 가능 (USR/OWN/ADM 가능) |
| **설명** | 사용자의 현재 위치 반경 내에 존재하는 매장 목록을 지도 또는 리스트 용으로 조회합니다. 반경, 카테고리, 1인석 유무, 즉시 입장 여부 필터를 적용합니다. PostGIS `ST_DWithin` 쿼리로 200ms 이내 응답 (NFR-003). |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `lat` | Float | **Yes** | 사용자의 현재 위도 좌표 (예: `37.4979`) |
| `lng` | Float | **Yes** | 사용자의 현재 경도 좌표 (예: `127.0276`) |
| `radius` | Integer | No | 탐색 반경 (m 단위: `500`, `1000`, `2000`, 기본값: `500`) |
| `category` | Array[String] | No | 다중 선택 카테고리 (예: `한식`, `분식`, `샐러드`) |
| `solo_seating` | Boolean | No | 1인석 전용 여부 필터 (기본값: `false`) |
| `available_now` | Boolean | No | 대기 없는 즉시 입장 매장만 필터 (기본값: `false`) |
| `price_range` | String | No | 할인가 구간 (`lt8k`, `8k-10k`, `10k-15k`, `gt15k`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "restaurants": [
      {
        "id": "store_01",
        "name": "진고개 한식당",
        "category": "한식",
        "latitude": 37.4975,
        "longitude": 127.0281,
        "distance_m": 120,
        "solo_seating": true,
        "seats_available": 12,
        "available_now": true,
        "lunch_special_active": true,
        "meal_duration_enum": "15-25",
        "specials": [
          {
            "id": "special_99",
            "menu_name": "가성비 제육볶음 쌈밥정식",
            "normal_price": 10000,
            "discount_price": 7500,
            "discount_rate": 25,
            "available_quantity": 8
          }
        ]
      }
    ]
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `BAD_REQUEST` | 필수 파라미터 `lat`, `lng` 누락 또는 잘못된 데이터 형식 |
| 429 | `RATE_LIMIT_EXCEEDED` | IP 또는 사용자당 호출 한도 초과 |

---

### API-GET-search. 매장·메뉴 검색

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/search` |
| **권한** | 게스트 가능 |
| **설명** | 식당명 또는 메뉴명에 부분 일치하는 매장들을 텍스트로 검색합니다. 자모 분리 매칭을 지원합니다 (한글 `tsvector` + `hangul-js`). |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `q` | String | **Yes** | 검색 키워드 (1자 이상) |
| `lat` | Float | **Yes** | 정렬용 기준 위도 |
| `lng` | Float | **Yes** | 정렬용 기준 경도 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "store_01",
        "name": "진고개 한식당",
        "matched_type": "menu",
        "matched_name": "제육볶음",
        "distance_m": 120,
        "discount_price": 7500
      }
    ]
  }
}
```

---

### API-GET-lunch-specials. 오늘의 점심특선 메인 피드

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/lunch-specials` |
| **권한** | 게스트 가능 |
| **설명** | 사용자 위치 기반의 점심특선 카드를 피드형으로 노출합니다. 점심시간(11:00~14:00) 영업 매장을 가중 정렬하며, 페이지네이션(20건)을 지원합니다. |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `lat` | Float | **Yes** | 사용자의 현재 위도 |
| `lng` | Float | **Yes** | 사용자의 현재 경도 |
| `radius` | Integer | No | 기본 500m |
| `sort_by` | String | No | 정렬 기준 (`distance`(기본값), `discount`, `popularity`, `available`) |
| `page` | Integer | No | 페이지 번호 (기본값: `1`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "specials": [
      {
        "id": "special_99",
        "store_id": "store_01",
        "store_name": "진고개 한식당",
        "menu_name": "가성비 제육볶음 쌈밥정식",
        "image_url": "https://cdn.lunchspecial.com/images/store_01_jeyuk.jpg",
        "normal_price": 10000,
        "discount_price": 7500,
        "discount_rate": 25,
        "meal_duration_enum": "15-25",
        "status_badge": "OPEN",
        "distance_m": 120,
        "available_quantity": 8
      }
    ],
    "pagination": {
      "current_page": 1,
      "has_more": true
    }
  }
}
```

---

### API-GET-lunch-specials-detail. 점심특선 상세 화면

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/lunch-specials/{id}` |
| **권한** | 게스트 가능 (쿠폰 받기는 USR 인증 필요) |
| **설명** | 선택한 점심특선 상품의 풀 갤러리 이미지, 사장님의 상세 설명, 식탁 메타데이터 및 실시간 잔여시간을 상세 조회합니다. |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "id": "special_99",
    "store": {
      "id": "store_01",
      "name": "진고개 한식당",
      "phone": "02-1234-5678",
      "address": "서울시 강남구 역삼동 123-45",
      "latitude": 37.4975,
      "longitude": 127.0281
    },
    "menu_name": "가성비 제육볶음 쌈밥정식",
    "description": "국산 한돈 돼지고기를 매콤한 비법 양념에 볶아 신선한 유기농 모둠 쌈채소와 뚝배기 된장찌개를 든든한 1인용 밥상으로 제공합니다. 매일 30인분 한정 판매합니다.",
    "gallery_images": [
      "https://cdn.lunchspecial.com/images/special_99_main.jpg",
      "https://cdn.lunchspecial.com/images/special_99_sub1.jpg"
    ],
    "normal_price": 10000,
    "discount_price": 7500,
    "discount_rate": 25,
    "available_quantity": 8,
    "total_quantity": 30,
    "expires_at": "2026-05-31T14:00:00+09:00",
    "meal_duration_enum": "15-25",
    "solo_seating": true,
    "kakaomap_mini_url": "https://map.kakao.com/link/map/store_01,37.4975,127.0281"
  }
}
```

---

### API-POST-coupons-issue. 쿠폰 발급

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/coupons/issue` |
| **권한** | USR (`verified=true` 필수) |
| **설명** | 사용자가 특정 점심특선 쿠폰을 발급받습니다. 본인 인증 여부, 일일 계정당 1일 5회 제한, 매장당 1회 제한 및 Redis 한정 수량 잔여 여부를 검증합니다. |

**Request Body**

```json
{
  "lunch_special_id": "special_99"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "issued_coupon_id": "coupon_abc123",
    "lunch_special_id": "special_99",
    "status": "ISSUED",
    "issued_at": "2026-05-31T11:45:12+09:00",
    "expires_at": "2026-05-31T14:00:00+09:00"
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 401 | `IDENTITY_VERIFICATION_REQUIRED` | 휴대폰 본인 인증(`verified = false`) 상태가 아님 |
| 400 | `DAILY_LIMIT_EXCEEDED` | 1일 5회 발급 제한을 초과한 상태 |
| 409 | `ALREADY_ISSUED` | 동일 매장 점심 쿠폰을 이미 당일 발급받았거나 사용 전임 |
| 410 | `SOLD_OUT` | Redis 트랜잭션 검증 결과 한정 수량이 이미 매진됨 |

---

### API-POST-auth-verify-identity. 사용자 본인 인증 (SMS)

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/auth/verify-identity` |
| **권한** | USR (인증 전 사용자) |
| **설명** | KISA 규격의 NICE/KCB 연동 휴대폰 본인 인증 절차를 완료하고 사용자 권한을 검증 상태로 업그레이드합니다. |

**Request Body**

```json
{
  "phone_number": "01012345678",
  "verification_code": "123456"
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "user_id": "user_777",
    "verified": true,
    "verified_at": "2026-05-31T11:43:00+09:00"
  }
}
```

---

### API-POST-coupons-token. QR/바코드 토큰 생성 (1분 만료)

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/coupons/{id}/token` |
| **권한** | USR (쿠폰 소유자 본인) |
| **설명** | 스크린샷 캡처 도용 방지를 위해 매장에 오프라인 제시할 60초 만료형 JWT QR 토큰 정보를 획득합니다 (NFR-010). |

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "coupon_id": "coupon_abc123",
    "qr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vwb25JZCI6ImNvdXBvbl9hYmMxMjMiLCJ1c2VySWQiOiJ1c2VyXzc3NyIsImV4cCI6MTc3MTI3OTEyOH0...",
    "expires_in_seconds": 60
  }
}
```

---

### API-POST-coupons-redeem. 사장님 QR 스캔 처리

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/coupons/redeem` |
| **권한** | OWN (매장 소유주 본인) |
| **설명** | 사장님이 모바일 카메라로 고객의 QR을 스캔했을 때 처리하는 API입니다. JWT 토큰을 해독하고 발급자 위치와 매장 위치 간 반경 100m 검증을 수행합니다 (NFR-010, F-0305). |

**Request Body**

```json
{
  "qr_token": "eyJhbGciOiJIUzI1Ni...",
  "owner_latitude": 37.4975,
  "owner_longitude": 127.0281
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "redeemed_coupon_id": "coupon_abc123",
    "menu_name": "가성비 제육볶음 쌈밥정식",
    "normal_price": 10000,
    "discount_price": 7500,
    "saved_amount": 2500,
    "redeemed_at": "2026-05-31T12:01:10+09:00"
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `TOKEN_EXPIRED` | 60초 만료 시간이 초과된 QR 토큰 제시 |
| 400 | `OUT_OF_RANGE` | 매장 위치와 사장님(또는 기기) GPS 간 거리가 100m를 초과함 |
| 409 | `ALREADY_REDEEMED` | 이미 사용 완료 처리된 쿠폰 토큰 검출 |

---

### API-GET-coupons-me. 내 쿠폰함 화면

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/coupons/me` |
| **권한** | USR |
| **설명** | 로그인한 사용자가 보유한 쿠폰을 탭별(사용가능, 완료, 만료) 및 임박순으로 조회합니다. |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `status` | String | No | 쿠폰 상태 필터 (`ISSUED` (기본값), `USED`, `EXPIRED`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "coupons": [
      {
        "id": "coupon_abc123",
        "store_name": "진고개 한식당",
        "menu_name": "가성비 제육볶음 쌈밥정식",
        "discount_price": 7500,
        "expires_at": "2026-05-31T14:00:00+09:00",
        "status": "ISSUED"
      }
    ]
  }
}
```

---

### API-GET-notifications. 인앱 알림 센터

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/notifications` |
| **권한** | USR, OWN, ADM (본인 알림만) |
| **설명** | 사용자의 시스템 공지, 쿠폰 사용/만료 임박 알림 내역을 조회합니다. 30일 이상 경과한 알림은 자동 정리(크론). |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `unread_only` | Boolean | No | 읽지 않은 알림만 조회 (기본값: `false`) |
| `page` | Integer | No | 페이지 번호 (기본값: `1`, 페이지당 20건) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "noti_001",
        "title": "쿠폰 만료 임박 알림",
        "message": "진고개 한식당 제육볶음 쿠폰 만료 1시간 전입니다. 늦지 않게 이용해 주세요!",
        "category": "COUPON_EXPIRY",
        "read": false,
        "created_at": "2026-05-31T13:00:00+09:00"
      }
    ],
    "unread_count": 3,
    "pagination": {
      "current_page": 1,
      "has_more": false
    }
  }
}
```

---

### API-PATCH-notifications-read. 인앱 알림 읽음 처리

| 항목 | 내용 |
|------|------|
| **Method** | `PATCH` |
| **URL** | `/api/notifications/{id}/read` |
| **권한** | USR, OWN, ADM (본인 알림만) |
| **설명** | 인앱 알림 단건을 "읽음" 상태로 갱신합니다 (F-9006). 알림 센터 진입 또는 알림 카드 탭 시 호출됩니다. 모든 알림을 일괄 읽음 처리하려면 `id=all` 사용. |

**Path Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `id` | String | **Yes** | 알림 ID (예: `noti_001`) 또는 `all` (전체 일괄 읽음) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "notification_id": "noti_001",
    "read": true,
    "read_at": "2026-05-31T13:15:00+09:00",
    "unread_count": 2
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 403 | `FORBIDDEN` | 본인의 알림이 아닌 알림 ID에 대한 읽음 처리 시도 |
| 404 | `NOT_FOUND` | 존재하지 않는 알림 ID |

---

### API-POST-owners-verify-business. 사장님 사업자 인증

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/owners/verify-business` |
| **권한** | OWN (인증 전 사장님) |
| **설명** | 대표자명 및 사업자등록번호를 받아 국세청 공공 API를 거쳐 실제 활성 소상공인 사업체 정보인지 검증합니다. |

**Request Body**

```json
{
  "business_number": "120-86-80349",
  "representative_name": "홍길동",
  "opening_date": "2020-03-01"
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "business_number": "120-86-80349",
    "verified": true,
    "company_name": "홍길동 제육마을",
    "verified_at": "2026-05-31T11:35:10+09:00"
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `BUSINESS_NOT_FOUND` | 국세청 진위 확인 결과 미확인 사업자 |
| 400 | `BUSINESS_CLOSED` | 폐업 사업자 |
| 503 | `SERVICE_UNAVAILABLE` | 국세청 API 일시 장애 |

---

### API-POST-stores. 매장 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/stores` |
| **권한** | OWN (사업자 인증 완료) |
| **설명** | 사장님이 매장 신규 생성을 처리하는 3단계 API 중 최종 Publish 처리 단계입니다. `draft_mode=true` 시 임시 저장(24시간 보관). |

**Request Body**

```json
{
  "name": "홍길동 제육마을",
  "business_number": "120-86-80349",
  "phone": "02-987-6543",
  "address": "서울시 강남구 테헤란로 123",
  "latitude": 37.4981,
  "longitude": 127.0289,
  "categories": ["한식", "도시락"],
  "draft_mode": false
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "store_id": "store_888",
    "name": "홍길동 제육마을",
    "status": "ACTIVE",
    "created_at": "2026-05-31T11:38:00+09:00"
  }
}
```

---

### API-PATCH-stores-meta. 매장 메타데이터 입력

| 항목 | 내용 |
|------|------|
| **Method** | `PATCH` |
| **URL** | `/api/stores/{id}/meta` |
| **권한** | OWN (매장 소유주) |
| **설명** | 1인 좌석 수, 예상 식사 시간 등 페르소나 매칭 메타데이터를 추가 입력합니다. |

**Request Body**

```json
{
  "solo_seating": true,
  "total_seats": 24,
  "meal_duration_enum": "15-25"
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "store_id": "store_888",
    "solo_seating": true,
    "meal_duration_enum": "15-25"
  }
}
```

---

### API-POST-lunch-specials. 일별 점심특선 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/stores/{id}/lunch-specials` |
| **권한** | OWN (매장 소유주) |
| **설명** | 사장님이 특정 일자에 제공할 가성비 한정 점심 메뉴를 등록합니다. 정상가/할인가, 수량을 정의합니다. 등록 30초 내 완료 (F-0404). |

**Request Body**

```json
{
  "menu_name": "수제 매콤 돈까스 특선",
  "normal_price": 12000,
  "discount_price": 8000,
  "total_quantity": 40,
  "image_url": "https://cdn.lunchspecial.com/temp/upload_123.jpg",
  "expires_at": "2026-05-31T14:00:00+09:00"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "lunch_special_id": "special_101",
    "menu_name": "수제 매콤 돈까스 특선",
    "discount_rate": 33,
    "status": "PUBLISHED",
    "created_at": "2026-05-31T11:40:22+09:00"
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `INVALID_PRICE` | `discount_price` >= `normal_price` |
| 413 | `PAYLOAD_TOO_LARGE` | 사진 5MB 초과 (서버 자동 리사이즈 실패) |

---

### API-POST-recurring-specials. 요일별 점심특선 반복 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/stores/{id}/recurring-specials` |
| **권한** | OWN (매장 소유주) |
| **설명** | 요일 단위로 점심특선을 고정 루틴 발행하도록 반복 등록합니다. (예: 매주 월/수/금 작동). 휴무일은 자동 제외. |

**Request Body**

```json
{
  "menu_name": "수제 매콤 돈까스 특선",
  "normal_price": 12000,
  "discount_price": 8000,
  "total_quantity": 40,
  "recurring_days": ["MON", "WED", "FRI"],
  "start_time": "11:00",
  "end_time": "14:00"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "recurring_schedule_id": "recur_55",
    "recurring_days": ["MON", "WED", "FRI"],
    "active": true
  }
}
```

---

### API-PATCH-lunch-specials-status. 즉시/예약 발행 상태 수정

| 항목 | 내용 |
|------|------|
| **Method** | `PATCH` |
| **URL** | `/api/lunch-specials/{id}/status` |
| **권한** | OWN (매장 소유주) |
| **설명** | 발행 완료 이전의 예약 상태 점심특선을 강제 즉시 취소 또는 활성화합니다. 이미 사용 처리된 상태에서는 취소가 불가합니다. |

**Request Body**

```json
{
  "status": "CANCELLED"
}
```

> `status` 허용값: `CANCELLED`, `PUBLISHED`

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "lunch_special_id": "special_101",
    "status": "CANCELLED"
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 409 | `CANNOT_CANCEL_USED` | 이미 사용이 시작된 특선은 취소 불가 |

---

### API-PATCH-stores-status. 실시간 영업 상태 토글

| 항목 | 내용 |
|------|------|
| **Method** | `PATCH` |
| **URL** | `/api/stores/{id}/status` |
| **권한** | OWN (매장 소유주) |
| **설명** | 사장님이 바쁜 상황 시 임시로 매장 입장/영업 상태를 업데이트합니다. `PAUSED` 설정 시 30분 뒤 배치 크론에 의해 자동으로 `OPEN` 복귀됩니다. |

**Request Body**

```json
{
  "status_badge": "PAUSED"
}
```

> `status_badge` 허용값: `OPEN`, `PAUSED`, `CLOSED`

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "store_id": "store_888",
    "status_badge": "PAUSED",
    "paused_until": "2026-05-31T12:30:00+09:00"
  }
}
```

---

### API-PATCH-stores. 매장 정보·메뉴 수정

| 항목 | 내용 |
|------|------|
| **Method** | `PATCH` |
| **URL** | `/api/stores/{id}` |
| **권한** | OWN (매장 소유주) |
| **설명** | 매장의 기본 정보, 대표메뉴를 수정하며 법적/분쟁 대비 감사 로그(Audit Log)를 30일 보관 테이블에 기록합니다 (F-0408). |

**Request Body**

```json
{
  "phone": "02-555-1234",
  "categories": ["한식", "도시락", "건강식"]
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "store_id": "store_888",
    "updated_fields": ["phone", "categories"],
    "audit_logged": true,
    "audit_id": "audit_4582"
  }
}
```

---

### API-GET-stores-audit. 매장 수정 이력 조회 (감사 로그)

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/stores/{id}/audit` |
| **권한** | OWN (매장 소유주), ADM |
| **설명** | 매장 정보 수정 이력을 30일 보관 감사 로그에서 조회합니다 (F-0408). 분쟁·이의제기 대응을 위해 변경 전후 diff와 수정 주체를 함께 반환합니다. |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `from` | String | No | 조회 시작일 (ISO 8601, 기본값: 30일 전) |
| `to` | String | No | 조회 종료일 (ISO 8601, 기본값: 현재) |
| `field` | String | No | 특정 필드만 필터링 (예: `phone`, `categories`) |
| `page` | Integer | No | 페이지 번호 (기본값: `1`, 페이지당 50건) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "store_id": "store_888",
    "audit_logs": [
      {
        "audit_id": "audit_4582",
        "field": "phone",
        "old_value": "02-987-6543",
        "new_value": "02-555-1234",
        "changed_by": "owner_999",
        "changed_at": "2026-05-31T11:50:00+09:00"
      },
      {
        "audit_id": "audit_4581",
        "field": "categories",
        "old_value": ["한식", "도시락"],
        "new_value": ["한식", "도시락", "건강식"],
        "changed_by": "owner_999",
        "changed_at": "2026-05-31T11:50:00+09:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "has_more": false
    }
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 403 | `FORBIDDEN` | 본인 매장이 아닌 매장의 감사 로그 조회 시도 (어드민 제외) |

---

### API-POST-coupons. 쿠폰 발행

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/stores/{id}/coupons` |
| **권한** | OWN (매장 소유주) |
| **설명** | 사장님이 직접 할인 쿠폰을 설계 및 발행합니다. 타겟 사용자군 설정 및 한정 발행이 연동됩니다. |

**Request Body**

```json
{
  "discount_type": "percent",
  "discount_value": 30,
  "applied_menus": ["special_101"],
  "target_user_group": "NEW",
  "limit_quantity": 50,
  "expires_at": "2026-05-31T14:00:00+09:00"
}
```

> `discount_type` 허용값: `percent` (정률%), `amount` (정액 원)
> `target_user_group` 허용값: `NEW`, `LOYAL`, `ALL`

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "coupon_template_id": "temp_xyz456",
    "limit_quantity": 50,
    "target_user_group": "NEW",
    "status": "ACTIVE"
  }
}
```

---

### API-GET-metrics. 핵심 4지표 대시보드

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/stores/{id}/metrics` |
| **권한** | OWN (매장 소유주), ADM |
| **설명** | 소상공인의 단골 확보를 체크할 핵심 지표 4종(신규 고객 수, 30일 재방문율, 쿠폰 사용률, 평균 객단가)을 조회합니다. |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `period` | String | No | 집계 범위 (`day`, `week`(기본값), `month`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "metrics": {
      "new_customers": 42,
      "revisit_rate_30d": 18.5,
      "coupon_conversion_rate": 42.1,
      "average_order_value": 9200
    },
    "comparison_percentage": {
      "new_customers": 12.0,
      "revisit_rate_30d": -2.3
    }
  }
}
```

---

### API-GET-roi. ROI 카드 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/stores/{id}/roi` |
| **권한** | OWN (매장 소유주), ADM |
| **설명** | "쿠폰 발행비용 대비 신규 유입 및 실제 점심 매출"을 한 눈에 대시할 ROI 분석 결과를 가져옵니다. |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "period": "week",
    "investment_cost": 45000,
    "new_customer_count": 42,
    "derived_revenue": 386400,
    "roi_multiplier": 8.5,
    "regular_customer_estimate": 4
  }
}
```

---

### API-GET-coupons-analytics. 쿠폰별 성과 분석 + 가이드

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/stores/{id}/coupons/analytics` |
| **권한** | OWN (매장 소유주), ADM |
| **설명** | 발행된 개별 쿠폰 형상별 사용 추세와 저성과 쿠폰에 대한 기계 학습 기반 보완 가이드를 제공합니다. |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "coupon_analytics": [
      {
        "template_id": "temp_xyz456",
        "issued_count": 50,
        "used_count": 8,
        "conversion_rate": 16.0,
        "peak_time_window": "11:30-12:15",
        "recommendation": {
          "status": "LOW_PERFORMANCE",
          "action_message": "사용률이 20% 미만입니다. 할인 폭을 +10% 추가(또는 할인가 8,000원대 조절) 시 유입 전환이 2.5배 증가할 것으로 예측됩니다."
        }
      }
    ]
  }
}
```

---

### API-POST-auth-signup. 사용자 회원가입

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/auth/signup` |
| **권한** | 게스트 |
| **설명** | 소셜 로그인 기반의 신규 사용자 가입 및 본인인증 JWT 교환을 완료합니다. |

**Request Body**

```json
{
  "provider": "kakao",
  "access_token": "oauth_token_123...",
  "phone_verified_token": "kisa_token_777"
}
```

> `provider` 허용값: `kakao`, `naver`, `apple`

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "user_id": "user_777",
    "access_token": "jwt_access_token_foo...",
    "refresh_token": "jwt_refresh_token_bar..."
  }
}
```

---

### API-POST-auth-signup-owner. 사장님 회원가입

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/auth/signup-owner` |
| **권한** | 게스트 |
| **설명** | 사업자 번호 인증 정보를 결합한 소상공인 전용 계정 회원가입 절차입니다. |

**Request Body**

```json
{
  "phone_verified_token": "kisa_token_888",
  "business_number": "120-86-80349",
  "password": "hashed_password..."
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "owner_id": "owner_999",
    "access_token": "jwt_access_token_owner..."
  }
}
```

---

### API-POST-reports. 신고·이의제기 처리

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/reports` |
| **권한** | USR, OWN |
| **설명** | 매장 쿠폰 거부, 부정 사용 등 노쇼 및 오사용 관련 분쟁 신고를 24시간 내 1차 자동 접수 처리합니다 (F-9004 SLA). |

**Request Body**

```json
{
  "coupon_id": "coupon_abc123",
  "report_type": "STORE_REJECTION",
  "content": "가게에 갔으나 쿠폰 사용이 불가능하다고 거부하였습니다."
}
```

> `report_type` 허용값: `STORE_REJECTION`, `ABUSE_USER`, `OTHER`

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "report_id": "report_88",
    "status": "RECEIVED",
    "created_at": "2026-05-31T12:05:00+09:00"
  }
}
```

---

### API-DELETE-users-me. 회원 탈퇴

| 항목 | 내용 |
|------|------|
| **Method** | `DELETE` |
| **URL** | `/api/users/me` |
| **권한** | USR, OWN |
| **설명** | 회원 탈퇴를 처리합니다. 30일 유예 후 개인정보 데이터는 영구 파기/난독화 처리되며, 세무 및 거래 통계를 위해 거래 트랜잭션만 5년 익명 보관됩니다 (F-9005, 개인정보보호법). |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "user_id": "user_777",
    "grace_period_days": 30,
    "scheduled_deletion_at": "2026-06-30T16:19:00+09:00"
  }
}
```

---

### API-GET-metrics-export. [Should] 통계 CSV/Excel 내보내기

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/stores/{id}/metrics/export` |
| **권한** | OWN (매장 소유주) |
| **설명** | 매장의 회계 및 정산 처리를 위해 월별 통계 데이터를 파일 다운로드 링크로 변환합니다. |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `format` | String | **Yes** | 파일 형식 (`csv` \| `xlsx`) |
| `month` | String | **Yes** | 연월 포맷 (예: `2026-05`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "download_url": "https://cdn.lunchspecial.com/exports/store_888_202605.xlsx",
    "expires_at": "2026-05-31T17:19:00+09:00"
  }
}
```

---

### API-POST-reviews. [Should] 사용자 리뷰·별점 작성

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/stores/{id}/reviews` |
| **권한** | USR (`verified=true` + 24h 내 쿠폰 사용자) |
| **설명** | 쿠폰 스캔 완료 후 24시간 이내의 실사용자만 별점 및 다이닝 리뷰를 남길 수 있도록 처리합니다. |

**Request Body**

```json
{
  "coupon_id": "coupon_abc123",
  "rating": 5,
  "comment": "혼밥하기에 조용하고 음식도 바로 나와 15분 만에 깔끔히 먹었어요. 제육볶음 양도 풍부합니다!"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "review_id": "rev_77",
    "verified_purchase": true,
    "created_at": "2026-05-31T12:30:00+09:00"
  }
}
```

---

### API-POST-favorites. [Should] 즐겨찾기 매장 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/users/me/favorites` |
| **권한** | USR |
| **설명** | 사용자가 특정 매장을 즐겨찾기 목록에 등록하거나 해제(Toggle) 처리합니다. |

**Request Body**

```json
{
  "store_id": "store_888",
  "is_favorite": true
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "store_id": "store_888",
    "is_favorite": true
  }
}
```

---

### API-POST-b2b-employees. [Should] B2B 임직원 bulk 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/b2b/{companyId}/employees/bulk` |
| **권한** | OWN (HR 관리자), ADM |
| **설명** | 중소기업 법인 고객 관리자가 임직원을 대량 등록 처리합니다. CSV 업로드 또는 JSON 배열 지원. |

**Request Body**

```json
{
  "employees": [
    { "name": "김개발", "phone": "01011112222", "department": "개발팀" },
    { "name": "이마케", "phone": "01033334444", "department": "마케팅" }
  ]
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "company_id": "company_nexon",
    "imported_count": 82,
    "failed_count": 0
  }
}
```

---

### API-POST-meal-tickets-issue. [Should] B2B 임직원 식권 일괄 발행

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/b2b/{companyId}/meal-tickets/issue` |
| **권한** | OWN (HR 관리자), ADM |
| **설명** | 등록된 임직원 전체 또는 부서별 필터에 대해 월별 식권을 일괄 자동 발행합니다 (F-7005). 84.6% 임직원 식비 지원 선호 트렌드 대응. |

**Request Body**

```json
{
  "target": "ALL",
  "department": null,
  "ticket_value": 9000,
  "monthly_limit": 20,
  "valid_from": "2026-06-01",
  "valid_to": "2026-06-30"
}
```

> `target` 허용값: `ALL` (전체), `DEPARTMENT` (부서 지정), `EMPLOYEE_IDS` (개별 지정)

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "company_id": "company_nexon",
    "batch_id": "ticket_batch_2026_06",
    "issued_tickets_count": 82,
    "total_face_value": 14760000,
    "valid_from": "2026-06-01",
    "valid_to": "2026-06-30"
  }
}
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `INSUFFICIENT_BALANCE` | 회사 선결제 잔고가 발행 총액 미달 |
| 409 | `ALREADY_ISSUED_THIS_MONTH` | 동일 월에 이미 발행 완료된 식권 배치 존재 |

---

### API-GET-b2b-settlements. [Should] B2B 정산 대시보드 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/b2b/{companyId}/settlements` |
| **권한** | OWN (HR 관리자), ADM |
| **설명** | 임직원이 점심특강 매장에서 사용한 B2B 모바일 식대 정산 명세를 월별로 집계 조회합니다. |

**Request Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `month` | String | **Yes** | 연월 (예: `2026-05`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "company_id": "company_nexon",
    "target_month": "2026-05",
    "total_employee_used": 76,
    "total_settlement_amount": 1824000,
    "due_payment_date": "2026-06-10"
  }
}
```

---

### API-POST-ads. [Could] 광고 캠페인 생성

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/ads/campaigns` |
| **권한** | OWN (매장 소유주) |
| **설명** | Phase 3 비즈니스 핵심 — 메인 피드 상단 고정 슬롯 노출용 자가 광고 캠페인을 개설합니다. |

**Request Body**

```json
{
  "store_id": "store_888",
  "special_id": "special_101",
  "daily_budget": 10000,
  "start_date": "2026-06-01",
  "end_date": "2026-06-07"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "campaign_id": "camp_901",
    "status": "PENDING_PAYMENT",
    "daily_budget": 10000
  }
}
```

---

### API-POST-payments. [Could] 토스페이 선결제 승인

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/payments/intent` |
| **권한** | USR |
| **설명** | 선결제 후 방문 픽업 흐름을 위한 토스페이먼츠(Toss Payments) 결제 인텐트(Intent)를 생성하고 승인 처리를 처리합니다. KRW Zero-Decimal. |

**Request Body**

```json
{
  "coupon_id": "coupon_abc123",
  "payment_method": "TOSS_PAY",
  "amount": 7500
}
```

> `payment_method` 허용값: `TOSS_PAY`, `NAVER_PAY`, `KAKAO_PAY`

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "payment_id": "pay_toss_20260531_xxxx",
    "payment_token": "confirm_token_abc...",
    "amount": 7500,
    "status": "PENDING"
  }
}
```

---

### API-POST-invitations. [Could] 친구 초대 링크 생성

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/invitations` |
| **권한** | USR |
| **설명** | 사용자가 지인을 앱으로 초대해 추천 보상금을 획득할 카카오톡/링크 공유용 다이내믹 고유 주소를 생성합니다. |

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "inviter_id": "user_777",
    "invitation_code": "INV-LUNCH-555",
    "dynamic_link_url": "https://lunchspecial.page.link/INV-LUNCH-555"
  }
}
```

---

## 5. NFR 정합성 매트릭스 (Non-Functional Requirements Mapping)

요구사항정의서 v1.0의 핵심 NFR(비기능 요구사항)이 어떤 API/처리에서 충족되는지를 정합성 매트릭스로 정리합니다. W4 구현 단계에서 이 표를 기준으로 SLA·성능·보안 테스트를 설계합니다.

| NFR ID | NFR 내용 | 충족 API/처리 | 검증 방법 |
|--------|----------|---------------|-----------|
| **NFR-001** | 리스트 응답 1초 이내 | `API-GET-restaurants`, `API-GET-lunch-specials`, `API-GET-search` | k6 부하 테스트 (p95 < 1s) |
| **NFR-002** | 상세 화면 진입 0.5초 이내 | `API-GET-lunch-specials-detail` | 클라이언트 RUM + 서버 응답 시간 측정 |
| **NFR-003** | PostGIS 위치 쿼리 200ms 이내 | `ST_DWithin` (restaurants, lunch-specials) | DB EXPLAIN ANALYZE, 인덱스 사용 검증 |
| **NFR-004** | 검색 디바운스 300ms + 결과 1초 | `API-GET-search` | 프론트 디바운스 + API 응답 시간 |
| **NFR-005** | 무한 스크롤 페이지 로드 < 1.5s | `API-GET-lunch-specials?page=` | 페이지네이션 응답 시간 |
| **NFR-006** | 가용성 99.5% (월 다운 3.6시간 이하) | 전 API + Vercel/Supabase SLA | UptimeRobot 모니터링 |
| **NFR-007** | RTO 4시간 / RPO 1시간 | DB 백업 (Supabase PITR) | 분기 1회 복구 훈련 |
| **NFR-008** | TLS 1.2+ HTTPS 강제 | 전 API (HSTS 헤더) | SSL Labs A+ 인증 |
| **NFR-009** | 개인정보 암호화 저장 (AES-256) | 사용자/사장님 프로필 컬럼 (Supabase Vault) | DB 직접 SELECT 시 암호화 확인 |
| **NFR-010** | 쿠폰 JWT 60초 만료 + 100m 위치 검증 | `API-POST-coupons-token`, `API-POST-coupons-redeem` | 단위 테스트 + 위치 시뮬레이션 E2E |
| **NFR-011** | Rate Limit (사용자별 호출 한도) | 전 API (게이트웨이 미들웨어) | Artillery 부하 테스트 → 429 응답 |
| **NFR-012** | 본인 인증 KISA 적합 (NICE/KCB) | `API-POST-auth-verify-identity` | PG/KISA 인증 사업자 SDK 통과 |
| **NFR-013** | 회원 탈퇴 30일 유예 + 5년 거래 익명 보관 | `API-DELETE-users-me` + 크론잡 | DB 만료 행 검사 |
| **NFR-014** | 신고 SLA 24시간 1차 응답 | `API-POST-reports` + 어드민 알림 | 어드민 대시보드 SLA 모니터링 |
| **NFR-015** | WCAG 2.1 AA 접근성 (Lighthouse 90+) | 프론트 전체 | CI에서 Lighthouse 자동 검증 |
| **NFR-016** | 큰 글씨 모드 (1.25x / 1.5x) | 클라이언트 토글 | E2E 폰트 크기 검증 |
| **NFR-017** | 다국어 (한국어 우선, 영어 Phase 2) | 응답 필드 다국어화 | i18n 키 누락 검사 |
| **NFR-018** | 매장 등록 5분 이내 완료 (3단계 위저드) | `API-POST-stores` + drafts | 시나리오 테스트 (TC-401) |
| **NFR-019** | 점심특선 등록 30초 이내 완료 | `API-POST-lunch-specials` | E2E 시간 측정 |
| **NFR-020** | 쿠폰 발급 race condition 방지 (Redis atomic) | `API-POST-coupons-issue` (DECR) | 동시 100건 동시 발급 부하 테스트 |
| **NFR-021** | 동시 사용자 1만명 (M3 베타) | 전 API | k6 1만 VUser 부하 테스트 |
| **NFR-022** | 푸시 알림 1분 이내 도달 | F-0307 크론잡 + FCM/APNs | 메시지 큐 지연 시간 측정 |
| **NFR-023** | 감사 로그 30일 보관 | `API-PATCH-stores` + `API-GET-stores-audit` | 만료 행 자동 삭제 검증 |
| **NFR-024** | 정산 데이터 정확도 99.99% | `API-GET-b2b-settlements` | 회계 대조 검증 |
| **NFR-025** | 본인 인증 5분 타임아웃 | `API-POST-auth-verify-identity` | E2E 만료 시나리오 |

---

## 6. 응답 코드 정책 (HTTP Status Code Policy)

| Method | 성공 시 상태 코드 | 설명 |
|--------|------------------|------|
| `GET` | **200 OK** | 조회 성공 |
| `POST` (리소스 생성) | **201 Created** | 신규 리소스 생성 성공 — issue, redeem(X, 처리), stores, lunch-specials, coupons, reports, reviews, favorites, ads, payments, invitations, signup, signup-owner, recurring-specials, meal-tickets/issue |
| `POST` (액션 처리) | **200 OK** | 검증/인증/사용처리 등 비리소스 생성 액션 — verify-identity, verify-business, coupons/redeem |
| `PATCH` | **200 OK** | 부분 수정 성공 |
| `DELETE` | **200 OK** 또는 **204 No Content** | 삭제 성공 (탈퇴는 200 + 유예 정보) |

> 일관성을 위해 본 문서는 모든 신규 리소스 생성 POST에 **201 Created**, 액션형 POST에 **200 OK**를 적용합니다.

---

## 7. 보안 정책 요약 (Security Policy)

| 영역 | 정책 |
|------|------|
| **전송 구간** | TLS 1.2+ 강제, HSTS 헤더, 인증서 자동 갱신 (Vercel 관리) |
| **인증 토큰** | JWT HS256 서명, Access 1h / Refresh 30d, Refresh Rotation |
| **저장 구간** | 사용자 PII는 AES-256 컬럼 암호화 (Supabase Vault) |
| **비밀번호** | bcryptjs (서버리스 호환), salt rounds 10 |
| **QR 토큰** | 60초 단명 JWT, 위치 검증 100m, 1회 사용 (멱등성) |
| **Rate Limit** | NFR-011 정책 적용 (Section 2) |
| **CORS** | `https://lunchspecial.kr`, `https://*.vercel.app` 화이트리스트 |
| **CSRF** | SameSite=Lax 쿠키 + Origin 검증 |
| **개인정보** | 회원 탈퇴 30일 유예 → 익명화 → 5년 거래 기록 보관 (개인정보보호법) |
| **감사 로그** | 매장 수정 30일 보관 (`API-GET-stores-audit`) |

---

## 8. 외부 의존 API (External Dependencies)

| 외부 시스템 | 용도 | 연동 API | SLA |
|------------|------|----------|------|
| KISA 본인 인증 (NICE/KCB) | 사용자/사장님 휴대폰 본인 인증 | `auth/verify-identity`, `owners/verify-business` | 99% (사업자 SLA) |
| 국세청 진위 확인 | 사업자등록번호 진위 확인 | `owners/verify-business` | 95% (공공 API) |
| 카카오맵 SDK | 지도 마커, 미니맵 | 클라이언트 SDK | 99.9% |
| Supabase Storage | 매장/메뉴 사진 업로드·CDN | `lunch-specials`, `stores` | 99.9% |
| FCM / APNs | 푸시 알림 | F-0307, F-0308 (서버 내부) | 99.5% |
| 토스페이먼츠 | Phase 3 선결제 | `payments/intent`, `/confirm`, `/refund` | 99.9% |
| 카카오·네이버 OAuth | 소셜 로그인 | `auth/signup`, `auth/oauth/callback` | 99.5% |

> 외부 API 장애 시 `503 SERVICE_UNAVAILABLE` 응답. 우회 가능한 경우 대체 흐름 제공 (예: 본인 인증 실패 시 이메일 인증 폴백 검토).

---

## 9. API 페이지네이션 정책

| 항목 | 정책 |
|------|------|
| 쿼리 파라미터 | `page` (1-based), `per_page` (기본 20, 최대 100) |
| 응답 필드 | `pagination.current_page`, `pagination.has_more`, `pagination.total_count` (선택) |
| 정렬 | `sort_by`, `order` (`asc` / `desc`) |
| 무한 스크롤 | IntersectionObserver + `has_more=true` 동안 자동 요청 (F-0207) |

---

## 10. API 명명 규칙 (Naming Convention)

| 항목 | 규칙 |
|------|------|
| URL Path | `kebab-case` (예: `/lunch-specials`, `/coupons/me`) |
| 쿼리 파라미터 | `snake_case` (예: `solo_seating`, `price_range`) |
| Request/Response 필드 | `snake_case` (예: `discount_rate`, `meal_duration_enum`) |
| Enum 값 | `UPPER_SNAKE_CASE` (예: `ISSUED`, `STORE_REJECTION`) |
| API ID (내부) | `API-{METHOD}-{kebab-case-slug}` |

---

## 11. 마일스톤별 우선 구현 API

| 마일스톤 | 우선 구현 API | 비고 |
|---------|--------------|------|
| **M1 (W1~W5 셋업)** | `auth/signup`, `auth/verify-identity` | 인증 인프라 |
| **M2 (W6~W12 알파)** | restaurants, search, stores, stores/meta, stores PATCH, audit, owners/verify-business | 사장님 매장 등록 + 사용자 탐색 |
| **M3 (W13~W20 베타)** | lunch-specials (4종), coupons (5종), notifications (2종), metrics, roi, analytics, reports | 핵심 거래·통계 |
| **M4+ (Phase 2)** | metrics/export, reviews, favorites, b2b (3종) | 부가 서비스 |
| **M7+ (Phase 3)** | ads/campaigns, payments, invitations | 수익화 |

---

## 12. 변경 이력 (Change Log)

| 버전 | 일자 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| v1.0 | 2026-05-31 | 최초 작성. 기능명세서 v1.0의 API ID 34종을 풀 스펙(Method/URL/권한/Request/Response/Error)으로 확장. 누락 API 3종 추가 (`notifications/{id}/read`, `stores/{id}/audit`, `b2b/{companyId}/meal-tickets/issue`) → **총 37개 API**. Authentication 권한 매트릭스(USR/OWN/ADM) + JWT 페이로드(sub/role/verified/exp/iat) 구조 명시. NFR 정합성 매트릭스 25종 매핑. 신규 리소스 생성 POST 상태 코드 200 → **201 Created** 정정. Rate Limit·보안 정책·외부 의존 API·페이지네이션·명명 규칙·마일스톤별 우선 구현 섹션 추가. | PM |

---

**작성 완료 여부**: [x] 마스터 리스트 37건 + 풀 스펙 (Request/Response/Error) + 권한 매트릭스 + NFR 매핑 + 보안 정책

**다음 산출물**:
- #8 정보구조도 — 본 API의 화면 ID 매핑을 IA 트리·플로우로 구조화
- #11 시스템정의서 — 본 API의 처리 로직을 컴포넌트·서비스 단위로 분리
- #12 데이터베이스설계서 — 본 API의 Request/Response 필드를 ERD·테이블 스키마로 변환 (의존: #6, #7 완료)
- #15 테스트시나리오 — 본 API의 Error Response를 TC로 변환
