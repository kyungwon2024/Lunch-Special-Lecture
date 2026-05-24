# 참고자료 (NotebookLM 동기화)

> NotebookLM 프로젝트 노트북의 소스를 로컬에 동기화한 인덱스입니다.
> 마지막 동기화: **2026-05-24 (v2 - nlm CLI 본문 추출)**
> NotebookLM 노트북 ID: `9dbea701-7067-4881-afc0-97006b53b3ea`

## 동기화 통계

| 구분 | 수 |
|------|------|
| 전체 소스 | 13 |
| web_page | 7 (전체 본문 추출 완료) |
| pdf | 3 (PDF→텍스트 추출 완료) |
| generated_text | 3 (PRD.md 스냅샷 + AI 생성 보고서 2개) |

## v1 → v2 변경사항 (2026-05-24)

1. **신규 소스 2개 추가**: NotebookLM이 PRD 기반으로 생성한 분석 보고서 (NLM-12, NLM-13)
2. **PDF 3개 본문 완전 추출**: NLM-02 / 04 / 09 (placeholder → 실제 본문, 각 18k~219k chars)
3. **Atlassian 본문 완전 추출**: NLM-08 (WebFetch 실패본 → nlm CLI로 122k chars 추출)

## 소스 인덱스

| # | 파일 | 유형 | 제목 | 본문 |
|---|------|------|------|------|
| 01 | [NLM-01](NLM-01_2026기술트렌드_3대리포트비교.md) | web_page | 2026 기술 트렌드 총정리 - 3대 리포트(Gartner, IDC, McKinsey) 비교 분석 | ✅ |
| 02 | [NLM-02](NLM-02_AI_인간중심디자인_윤리고려사항.md) | pdf | AI In human-centered design: ethical considerations (DRS) | ✅ v2 |
| 03 | [NLM-03](NLM-03_SaaS_사용자여정맵핑_베스트프랙티스.md) | web_page | Best Practices for User Journey Mapping in SaaS | ✅ |
| 04 | [NLM-04](NLM-04_페르소나_화이트페이퍼_Brainmates.md) | pdf | Characters at work (Personas Whitepaper) - Brainmates | ✅ v2 |
| 05 | [NLM-05](NLM-05_PRD_작성과관리_AgileSeekers.md) | web_page | Creating and Managing Technical PRDs - Agile Seekers | ✅ |
| 06 | [NLM-06](NLM-06_경쟁사분석_완벽가이드.md) | web_page | Digital Product Competitor Analysis: The Ultimate Guide | ✅ |
| 07 | [NLM-07](NLM-07_PRD_본문복사.md) | generated_text | PRD.md (NotebookLM 업로드 스냅샷) | 📎 ref |
| 08 | [NLM-08](NLM-08_6가지제품우선순위프레임워크_Atlassian.md) | web_page | Six product prioritization frameworks - Atlassian | ✅ v2 |
| 09 | [NLM-09](NLM-09_TechTrends2026_Deloitte.md) | pdf | Tech Trends 2026 - Deloitte | ✅ v2 |
| 10 | [NLM-10](NLM-10_2026소비자트렌드_Escalent.md) | web_page | Top Consumer Trends 2026 - Escalent | ✅ |
| 11 | [NLM-11](NLM-11_제품요구문서_위키백과.md) | web_page | 제품 요구 문서 - 위키백과 | ✅ |
| 12 | [NLM-12](NLM-12_점심특강_5초완성_위치기반맛집솔루션전략.md) | generated_text | **신규**: 점심특강 5초 완성 위치 기반 맛집 솔루션 전략 | ✅ |
| 13 | [NLM-13](NLM-13_점심특강_위치기반점심솔루션_전략분석보고서.md) | generated_text | **신규**: 점심특강 위치 기반 점심 솔루션 전략 분석 보고서 (NLM-12와 중복) | ✅ |

> ℹ️ NLM-12와 NLM-13은 동일 PRD 기반으로 NotebookLM이 두 차례 생성한 보고서로 내용이 거의 동일합니다. 한 쪽 삭제 권장.

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

### 프로젝트 산출물 (양방향) / AI 생성 보고서
- [NLM-07](NLM-07_PRD_본문복사.md): PRD.md (로컬 ↔ NotebookLM 동기화)
- [NLM-12](NLM-12_점심특강_5초완성_위치기반맛집솔루션전략.md): NotebookLM AI 분석 보고서
- [NLM-13](NLM-13_점심특강_위치기반점심솔루션_전략분석보고서.md): NotebookLM AI 분석 보고서 (NLM-12와 중복)

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

### PDF 본문 확보 (선택)
v2부터는 `nlm source content`로 NotebookLM의 PDF 추출 텍스트를 직접 가져왔습니다. 원본 PDF 파일이 필요하면 각 파일 헤더의 다운로드 링크에서 받아 `참고자료/NLM-XX_원본.pdf`로 저장하세요.

### v2 추출 방식
```bash
# PDF/Atlassian 본문 일괄 추출 예시
for id in 776082a6-... bf17a981-... 7a875f32-... fc344c22-...; do
  nlm source content "$id" > /tmp/nlm_content/$id.txt
done
```
JSON 응답의 `value.content` 필드에 전체 텍스트가 들어있습니다 (PDF는 NotebookLM이 OCR/추출한 결과).
