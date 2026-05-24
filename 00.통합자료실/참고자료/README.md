# 참고자료 (NotebookLM 동기화)

> NotebookLM 프로젝트 노트북의 소스를 로컬에 동기화한 인덱스입니다.
> 마지막 동기화: **2026-05-24**
> NotebookLM 노트북 ID: `9dbea701-7067-4881-afc0-97006b53b3ea`

## 동기화 통계

| 구분 | 수 |
|------|------|
| 전체 소스 | 11 |
| web_page | 7 (자동 수집 6 + 부분실패 1) |
| pdf | 3 (placeholder) |
| generated_text | 1 (PRD.md 스냅샷) |

## 소스 인덱스

| # | 파일 | 유형 | 제목 |
|---|------|------|------|
| 01 | [NLM-01](NLM-01_2026기술트렌드_3대리포트비교.md) | web_page | 2026 기술 트렌드 총정리 - 3대 리포트(Gartner, IDC, McKinsey) 비교 분석 |
| 02 | [NLM-02](NLM-02_AI_인간중심디자인_윤리고려사항.md) | pdf | AI In human-centered design: ethical considerations (DRS) |
| 03 | [NLM-03](NLM-03_SaaS_사용자여정맵핑_베스트프랙티스.md) | web_page | Best Practices for User Journey Mapping in SaaS |
| 04 | [NLM-04](NLM-04_페르소나_화이트페이퍼_Brainmates.md) | pdf | Characters at work (Personas Whitepaper) - Brainmates |
| 05 | [NLM-05](NLM-05_PRD_작성과관리_AgileSeekers.md) | web_page | Creating and Managing Technical PRDs - Agile Seekers |
| 06 | [NLM-06](NLM-06_경쟁사분석_완벽가이드.md) | web_page | Digital Product Competitor Analysis: The Ultimate Guide |
| 07 | [NLM-07](NLM-07_PRD_본문복사.md) | generated_text | PRD.md (NotebookLM 업로드 스냅샷) |
| 08 | [NLM-08](NLM-08_6가지제품우선순위프레임워크_Atlassian.md) | web_page | Six product prioritization frameworks - Atlassian ⚠️ |
| 09 | [NLM-09](NLM-09_TechTrends2026_Deloitte.md) | pdf | Tech Trends 2026 - Deloitte |
| 10 | [NLM-10](NLM-10_2026소비자트렌드_Escalent.md) | web_page | Top Consumer Trends 2026 - Escalent |
| 11 | [NLM-11](NLM-11_제품요구문서_위키백과.md) | web_page | 제품 요구 문서 - 위키백과 |

> ⚠️ NLM-08은 JavaScript 렌더링 페이지로 본문 자동 수집 실패. 일반 요약 포함, 원본 직접 확인 권장.

## 카테고리별 분류

### PRD 작성 가이드
- [NLM-05](NLM-05_PRD_작성과관리_AgileSeekers.md): Agile Seekers - 기술 PRD 작성/관리
- [NLM-11](NLM-11_제품요구문서_위키백과.md): 위키백과 - PRD 정의 및 What vs How 원칙

### 페르소나·사용자 여정
- [NLM-03](NLM-03_SaaS_사용자여정맵핑_베스트프랙티스.md): SaaS 사용자 여정 매핑
- [NLM-04](NLM-04_페르소나_화이트페이퍼_Brainmates.md): Brainmates 페르소나 화이트페이퍼

### 시장·경쟁사 분석
- [NLM-06](NLM-06_경쟁사분석_완벽가이드.md): 경쟁사 분석 4단계 프레임워크
- [NLM-08](NLM-08_6가지제품우선순위프레임워크_Atlassian.md): 6가지 우선순위 프레임워크
- [NLM-10](NLM-10_2026소비자트렌드_Escalent.md): 2026 소비자 트렌드

### 기술 트렌드
- [NLM-01](NLM-01_2026기술트렌드_3대리포트비교.md): 2026 기술 트렌드 (Gartner/IDC/McKinsey 비교)
- [NLM-09](NLM-09_TechTrends2026_Deloitte.md): Deloitte Tech Trends 2026
- [NLM-02](NLM-02_AI_인간중심디자인_윤리고려사항.md): AI 인간 중심 디자인 윤리

### 프로젝트 산출물 (양방향)
- [NLM-07](NLM-07_PRD_본문복사.md): PRD.md (로컬 ↔ NotebookLM 동기화)

## 재동기화 방법

### 전체 재동기화
```bash
# 1. NotebookLM의 현재 소스 목록 확인
nlm source list 9dbea701-7067-4881-afc0-97006b53b3ea

# 2. 새 소스가 추가되었다면 다음 번호(NLM-12부터)로 파일 생성
# 3. 본 README.md의 인덱스 갱신
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

### PDF 본문 확보
PDF 소스(NLM-02, 04, 09)는 placeholder만 생성되었습니다. 본문이 필요하면 각 파일에 명시된 다운로드 링크에서 직접 받아 `참고자료/NLM-XX_원본.pdf`로 저장하세요.
