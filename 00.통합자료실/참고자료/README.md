# 참고자료 (NotebookLM 동기화)

> NotebookLM 프로젝트 노트북의 소스를 로컬에 동기화한 인덱스입니다.
> 마지막 동기화: **2026-05-24 (v3 - 신규 19개 소스 추가)**
> NotebookLM 노트북 ID: `9dbea701-7067-4881-afc0-97006b53b3ea`

## 동기화 통계

| 구분 | 수 |
|------|------|
| NotebookLM 전체 소스 | 33 |
| 로컬 동기화 완료 | 31 (본문 추출 OK) |
| 본문 미확보 (placeholder) | 1 (NLM-32 / KREI NOT_FOUND) |
| 동기화 제외 | 1 (스팸 광고 소스, 아래 참고) |
| web_page | 22 |
| pdf | 6 |
| generated_text | 3 |

## v2 → v3 변경사항 (2026-05-24)

1. **신규 소스 19개 일괄 추출** (NLM-14 ~ NLM-32): 외식·점심·소상공인 도메인 자료 대거 추가
2. **점심특강 도메인 자료 집중 확보**: 런치플레이션, 가성비 도시락, 마감할인 앱, 노쇼 정책 등
3. **벤치마킹 케이스 추가**: Too Good To Go(마감할인), 럭키밀(국내 마감할인), 티몬(커머스), Razzoos(점심특선)
4. **PDF 3건 추가**: Too Good To Go Executive Summary, 소상공인 마중물 사례집, 푸드테크의 시대(PwC)
5. **NLM-32 placeholder 1건**: KREI R933 (NotebookLM NOT_FOUND 응답, 원본 PDF 별도 확보 필요)
6. **스팸 소스 1건 제외**: Instagram 1만계정 광고(TWAY010 텔레그램) 소스는 프로젝트와 무관해 동기화 제외

## v1 → v2 변경사항 (2026-05-24)

1. **신규 소스 2개 추가**: NotebookLM이 PRD 기반으로 생성한 분석 보고서 (NLM-12, NLM-13)
2. **PDF 3개 본문 완전 추출**: NLM-02 / 04 / 09 (placeholder → 실제 본문, 각 18k~219k chars)
3. **Atlassian 본문 완전 추출**: NLM-08 (WebFetch 실패본 → nlm CLI로 122k chars 추출)

## 소스 인덱스

| # | 파일 | 유형 | 제목 | 본문 |
|---|------|------|------|------|
| 01 | [NLM-01](NLM-01_2026기술트렌드_3대리포트비교.md) | web_page | 2026 기술 트렌드 총정리 - 3대 리포트(Gartner, IDC, McKinsey) 비교 분석 | OK |
| 02 | [NLM-02](NLM-02_AI_인간중심디자인_윤리고려사항.md) | pdf | AI In human-centered design: ethical considerations (DRS) | OK |
| 03 | [NLM-03](NLM-03_SaaS_사용자여정맵핑_베스트프랙티스.md) | web_page | Best Practices for User Journey Mapping in SaaS | OK |
| 04 | [NLM-04](NLM-04_페르소나_화이트페이퍼_Brainmates.md) | pdf | Characters at work (Personas Whitepaper) - Brainmates | OK |
| 05 | [NLM-05](NLM-05_PRD_작성과관리_AgileSeekers.md) | web_page | Creating and Managing Technical PRDs - Agile Seekers | OK |
| 06 | [NLM-06](NLM-06_경쟁사분석_완벽가이드.md) | web_page | Digital Product Competitor Analysis: The Ultimate Guide | OK |
| 07 | [NLM-07](NLM-07_PRD_본문복사.md) | generated_text | PRD.md (NotebookLM 업로드 스냅샷) | ref |
| 08 | [NLM-08](NLM-08_6가지제품우선순위프레임워크_Atlassian.md) | web_page | Six product prioritization frameworks - Atlassian | OK |
| 09 | [NLM-09](NLM-09_TechTrends2026_Deloitte.md) | pdf | Tech Trends 2026 - Deloitte | OK |
| 10 | [NLM-10](NLM-10_2026소비자트렌드_Escalent.md) | web_page | Top Consumer Trends 2026 - Escalent | OK |
| 11 | [NLM-11](NLM-11_제품요구문서_위키백과.md) | web_page | 제품 요구 문서 - 위키백과 | OK |
| 12 | [NLM-12](NLM-12_점심특강_5초완성_위치기반맛집솔루션전략.md) | generated_text | 점심특강 5초 완성 위치 기반 맛집 솔루션 전략 | OK |
| 13 | [NLM-13](NLM-13_점심특강_위치기반점심솔루션_전략분석보고서.md) | generated_text | 점심특강 위치 기반 점심 솔루션 전략 분석 보고서 (NLM-12와 중복) | OK |
| 14 | [NLM-14](NLM-14_런치플레이션_구내식당선호_트렌드모니터.md) | web_page | **신규**: 런치플레이션 속 구내식당 선호 증가 (트렌드모니터) | OK |
| 15 | [NLM-15](NLM-15_2026식품외식산업_7대키워드_FoodNews.md) | web_page | **신규**: 2026 식품·외식산업 7대 키워드 (FoodNews) | OK |
| 16 | [NLM-16](NLM-16_TooGoodToGo_ExecutiveSummary.md) | pdf | **신규**: Too Good To Go Business Case Executive Summary | OK |
| 17 | [NLM-17](NLM-17_TooGoodToGo_케이스스터디_FutureLearn.md) | web_page | **신규**: Too Good To Go Case Study (FutureLearn) | OK (요약) |
| 18 | [NLM-18](NLM-18_음식점마감세일앱_인터뷰_비즈한국.md) | web_page | **신규**: 음식점 마감 세일 앱 윈-윈-윈 인터뷰 (비즈한국) | OK |
| 19 | [NLM-19](NLM-19_고물가틀깬파격_초저가점심값_YTN.md) | web_page | **신규**: 고물가 틀 깬 초저가 점심값 대혁명 (YTN) | OK |
| 20 | [NLM-20](NLM-20_혼밥기본_2030점심조용한재정비_뉴시안.md) | web_page | **신규**: 혼밥이 새 기본, 20·30 점심 조용한 재정비 (뉴시안) | OK |
| 21 | [NLM-21](NLM-21_편의점가성비도시락전쟁_매일경제.md) | web_page | **신규**: 편의점 가성비 도시락 전쟁 점화 (매일경제) | OK |
| 22 | [NLM-22](NLM-22_럭키밀_마감할인_성공전략_티스토리.md) | web_page | **신규**: 럭키밀 마감할인 스타트업 성공 전략 | OK |
| 23 | [NLM-23](NLM-23_런치플레이션_가성비메뉴몰리는직장인_매일일보.md) | web_page | **신규**: 런치플레이션, 가성비 메뉴로 몰리는 직장인 (매일일보) | OK |
| 24 | [NLM-24](NLM-24_마중물_소상공인성공역량지원사례집_PDF.md) | pdf | **신규**: 마중물 - 소상공인 성공역량 지원 사례집 (소진공) | OK |
| 25 | [NLM-25](NLM-25_식당노쇼_예약부도피해예방지원_토스플레이스.md) | web_page | **신규**: 식당 노쇼 예약부도 피해 예방 정책 (토스플레이스) | OK |
| 26 | [NLM-26](NLM-26_소상공인_관련뉴스검색_더프레스1.md) | web_page | **신규**: 소상공인 관련 뉴스 검색 결과 (더 프레스 1) | OK |
| 27 | [NLM-27](NLM-27_직장인10명중7명_점심값많이올랐다_KSA.md) | web_page | **신규**: 직장인 10명 중 7명 점심값 인상 체감 (KSA) | OK |
| 28 | [NLM-28](NLM-28_카페비즈니스계획서작성방법_Lark.md) | web_page | **신규**: 카페 비즈니스 계획서 작성 방법 (Lark) | OK |
| 29 | [NLM-29](NLM-29_티몬_기업_위키백과.md) | web_page | **신규**: 티몬(기업) - 위키백과 | OK |
| 30 | [NLM-30](NLM-30_푸드테크의시대가온다_PwC.md) | pdf | **신규**: 푸드테크의 시대가 온다 (삼일PwC) | OK |
| 31 | [NLM-31](NLM-31_훌륭한점심특선메뉴_단골만들기_Razzoos.md) | web_page | **신규**: 훌륭한 점심 특선 메뉴로 단골 만드는 방법 (Razzoos) | OK |
| 32 | [NLM-32](NLM-32_KREI_R933_농촌경제연구원보고서_placeholder.md) | web_page | **신규**: KREI R933 (한국농촌경제연구원) | placeholder |

> ℹ️ NLM-12와 NLM-13은 동일 PRD 기반으로 NotebookLM이 두 차례 생성한 보고서로 내용이 거의 동일합니다. 한 쪽 삭제 권장.
>
> ℹ️ NLM-32는 `nlm source content` 호출 시 NOT_FOUND 응답으로 본문 미확보. 원본 PDF는 [KREI Repository](https://repository.krei.re.kr/bitstream/2018.oak/27864/1/R933%20%281%29.pdf)에서 별도 다운로드 필요.

## 동기화 제외 소스

| ID | 제목 | 사유 |
|----|------|------|
| `e652eaa6-7d3d-4957-9062-3d10ed195e22` | 'Instagram 1만 계정 가격 [ 문의텔레 TWAY010 ] …' (ZDNet 검색 결과) | SEO 스팸/광고 페이지로 프로젝트 무관. NotebookLM에서 삭제 권장 |

## 카테고리별 분류

### PRD 작성 가이드
- [NLM-05](NLM-05_PRD_작성과관리_AgileSeekers.md): Agile Seekers - 기술 PRD 작성/관리
- [NLM-11](NLM-11_제품요구문서_위키백과.md): 위키백과 - PRD 정의 및 What vs How 원칙

### 페르소나·사용자 여정
- [NLM-03](NLM-03_SaaS_사용자여정맵핑_베스트프랙티스.md): SaaS 사용자 여정 매핑
- [NLM-04](NLM-04_페르소나_화이트페이퍼_Brainmates.md): Brainmates 페르소나 화이트페이퍼

### 시장·경쟁사 분석 (제품 일반)
- [NLM-06](NLM-06_경쟁사분석_완벽가이드.md): 경쟁사 분석 4단계 프레임워크
- [NLM-08](NLM-08_6가지제품우선순위프레임워크_Atlassian.md): 6가지 우선순위 프레임워크
- [NLM-10](NLM-10_2026소비자트렌드_Escalent.md): 2026 소비자 트렌드

### 기술·디자인 트렌드
- [NLM-01](NLM-01_2026기술트렌드_3대리포트비교.md): 2026 기술 트렌드 (Gartner/IDC/McKinsey 비교)
- [NLM-09](NLM-09_TechTrends2026_Deloitte.md): Deloitte Tech Trends 2026
- [NLM-02](NLM-02_AI_인간중심디자인_윤리고려사항.md): AI 인간 중심 디자인 윤리

### 점심특강 도메인 — 런치플레이션·직장인 점심
- [NLM-14](NLM-14_런치플레이션_구내식당선호_트렌드모니터.md): 런치플레이션 속 구내식당 선호 증가
- [NLM-19](NLM-19_고물가틀깬파격_초저가점심값_YTN.md): 초저가 점심값 대혁명 (YTN)
- [NLM-20](NLM-20_혼밥기본_2030점심조용한재정비_뉴시안.md): 혼밥이 새 기본, 점심 조용한 재정비
- [NLM-21](NLM-21_편의점가성비도시락전쟁_매일경제.md): 편의점 가성비 도시락 전쟁
- [NLM-23](NLM-23_런치플레이션_가성비메뉴몰리는직장인_매일일보.md): 가성비 메뉴로 몰리는 직장인
- [NLM-27](NLM-27_직장인10명중7명_점심값많이올랐다_KSA.md): 직장인 7/10 점심값 인상 체감

### 점심특강 도메인 — 마감할인·푸드 마케팅 벤치마크
- [NLM-16](NLM-16_TooGoodToGo_ExecutiveSummary.md): Too Good To Go Executive Summary (글로벌 마감할인 1위)
- [NLM-17](NLM-17_TooGoodToGo_케이스스터디_FutureLearn.md): Too Good To Go Case Study
- [NLM-18](NLM-18_음식점마감세일앱_인터뷰_비즈한국.md): 음식점 마감 세일 앱 윈-윈-윈
- [NLM-22](NLM-22_럭키밀_마감할인_성공전략_티스토리.md): 럭키밀 (국내 마감할인 스타트업)
- [NLM-31](NLM-31_훌륭한점심특선메뉴_단골만들기_Razzoos.md): 점심 특선으로 단골 만들기 (Razzoos)

### 점심특강 도메인 — 식품·외식 산업
- [NLM-15](NLM-15_2026식품외식산업_7대키워드_FoodNews.md): 2026 식품·외식산업 7대 키워드
- [NLM-30](NLM-30_푸드테크의시대가온다_PwC.md): 푸드테크의 시대 (삼일PwC)
- [NLM-32](NLM-32_KREI_R933_농촌경제연구원보고서_placeholder.md): KREI R933 (placeholder)

### 소상공인·사장님 측면
- [NLM-24](NLM-24_마중물_소상공인성공역량지원사례집_PDF.md): 소상공인 마중물 사례집 (소진공)
- [NLM-25](NLM-25_식당노쇼_예약부도피해예방지원_토스플레이스.md): 식당 노쇼 정책 (토스플레이스)
- [NLM-26](NLM-26_소상공인_관련뉴스검색_더프레스1.md): 소상공인 관련 뉴스 검색
- [NLM-28](NLM-28_카페비즈니스계획서작성방법_Lark.md): 카페 비즈니스 계획서 작성

### 커머스·O2O 사례
- [NLM-29](NLM-29_티몬_기업_위키백과.md): 티몬 - 한국 커머스 사례

### 프로젝트 산출물 / AI 생성 보고서
- [NLM-07](NLM-07_PRD_본문복사.md): PRD.md (로컬 ↔ NotebookLM 동기화)
- [NLM-12](NLM-12_점심특강_5초완성_위치기반맛집솔루션전략.md): NotebookLM AI 분석 보고서
- [NLM-13](NLM-13_점심특강_위치기반점심솔루션_전략분석보고서.md): NotebookLM AI 분석 보고서 (NLM-12와 중복)

## 재동기화 방법

### 전체 재동기화
```bash
# 1. NotebookLM의 현재 소스 목록 확인 (JSON 출력)
nlm source list 9dbea701-7067-4881-afc0-97006b53b3ea

# 2. 새 소스가 추가되었다면 다음 번호(NLM-33부터)로 파일 생성
# 3. 본 README.md의 인덱스 갱신
```

### 단일 소스 본문 가져오기 (v3 표준 방식)
```bash
# raw 텍스트만 받기 (파일로 저장)
nlm source content <source_id> -o /tmp/source.txt

# JSON 응답 받기
nlm source content <source_id> -j
```

### 로컬 PRD.md → NotebookLM 업데이트
```bash
# 기존 PRD 소스 삭제
nlm source delete 7565b74d-3534-491c-9b24-9d4bbfe25e7e

# 최신 PRD.md 재업로드
nlm source add 9dbea701-7067-4881-afc0-97006b53b3ea \
  --text "$(cat /Users/billy/자동화_경원/Lunch-Special-Lecture/PRD.md)" \
  --title "PRD.md"
```

### PDF 본문 확보 (선택)
v2부터 `nlm source content`로 NotebookLM의 PDF 추출 텍스트를 직접 가져왔습니다.
원본 PDF 파일이 필요하면 각 파일 헤더의 다운로드 링크에서 받아
`참고자료/NLM-XX_원본.pdf`로 저장하세요.

### v3 일괄 추출 방식 (참고)
```bash
# 신규 소스 ID 목록을 반복 처리
for id in 2982aded-... b20ec811-... ...; do
  nlm source content "$id" -o /tmp/nlm_sync/$id.txt
done
# 이후 Python 등으로 헤더 추가 + NLM-XX 파일명 매핑
```
