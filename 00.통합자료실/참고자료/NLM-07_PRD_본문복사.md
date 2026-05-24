# NLM-07: PRD.md (NotebookLM 등록 본문)

> 원본 경로: /Users/billy/자동화_경원/Lunch-Special-Lecture/PRD.md
> 출처: 로컬 프로젝트 루트
> 수집일: 2026-05-24
> NotebookLM 소스 유형: generated_text
> NotebookLM Source ID: 7565b74d-3534-491c-9b24-9d4bbfe25e7e

---

> ℹ️ **로컬 산출물 (Generated Text)**
>
> 이 자료는 프로젝트 PRD.md를 NotebookLM에 텍스트로 업로드한 소스입니다.
> 원본은 항상 [PRD.md](../../PRD.md)를 참조하세요.
>
> **주의**: NotebookLM에 등록된 본문은 업로드 시점의 스냅샷이며, 현재 로컬 PRD.md와 다를 수 있습니다.
> PRD.md를 수정한 후에는 `nlm source add`로 재업로드해야 NotebookLM의 답변이 최신 상태를 반영합니다.

## 동기화 명령

```bash
# 현재 NotebookLM의 PRD.md 본문 다운로드
nlm source content 7565b74d-3534-491c-9b24-9d4bbfe25e7e > /tmp/nlm_prd_snapshot.md

# 로컬과 비교
diff /tmp/nlm_prd_snapshot.md /Users/billy/자동화_경원/Lunch-Special-Lecture/PRD.md

# 차이가 있으면 재업로드 (기존 소스 삭제 후 신규 등록)
nlm source delete 7565b74d-3534-491c-9b24-9d4bbfe25e7e
nlm source add 9dbea701-7067-4881-afc0-97006b53b3ea \
  --text "$(cat /Users/billy/자동화_경원/Lunch-Special-Lecture/PRD.md)" \
  --title "PRD.md"
```

## 현재 로컬 PRD.md 요약 (2026-05-24 시점)

- **프로젝트명**: 점심특강 (Lunch Special Lecture)
- **타겟**: 직장인 + 주부 + 식당 사장님
- **핵심 가치**: 위치 기반 점심특선·할인 정보 + 제휴 쿠폰
- **기술 스택**: Next.js + Tailwind / Express.js / PostgreSQL / Vercel
- **6개월 KPI**: MAU 50,000 / 등록 매장 3,000 / 광고 매출 월 5,000만원

전체 본문은 [PRD.md](../../PRD.md) 참조.
