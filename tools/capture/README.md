# 증적 캡처 도구 (Playwright)

점심특강 테스트 증적 스크린샷을 **Playwright**로 캡처한다. 이후 모든 시각 증적은 이 도구로 생성한다(과거 Chrome `--screenshot` 방식 대체).

## 설치 (최초 1회)

```bash
export PATH="$(git rev-parse --show-toplevel)/.node/bin:$PATH"   # Node 20
cd tools/capture
npm install            # playwright 라이브러리
npx playwright install chromium
```

## 사용

### 1) 케이스 파일 일괄 캡처

```bash
node capture.mjs --cases cases.json \
  --outdir ../../04.검수문서/증적_스크린샷 \
  --base https://lunch-special-lecture.vercel.app
```

- `kind:"url"` — 페이지 캡처. `mobile:true`(iPhone 13 에뮬레이션), `full:true`(풀페이지)
- `kind:"api"` — 실제 HTTP 요청 후 **요청/응답을 렌더한 증적 카드** 캡처(JSON API는 화면이 없으므로)
  - 토큰 체인: `saveFrom:true`(응답 객체를 토큰맵에 병합) → 이후 `useToken:true`가 `Bearer`로 사용
  - `token:"..."` 고정 토큰(위변조 테스트), `body:{...}` 요청 바디(`password`는 카드에서 자동 마스킹)
  - `expect:"201 ..."` 의 상태코드로 Pass/Fail 자동 판정

`cases.json`의 동적 값(신규 phone, specialId)은 실행 전 생성 스크립트로 주입한다(상위 보고 절차 참조).

### 2) 단일 URL 캡처

```bash
node capture.mjs --url https://lunch-special-lecture.vercel.app/ --out home.png --mobile --full
```

## 출력

- 케이스 ID당 PNG 1장 → `--outdir`
- `04.검수문서/테스트결과증적_*.xlsx`에 행별 임베드(별도 임베드 스크립트)

## 비고

- Chromium은 `~/Library/Caches/ms-playwright`에 설치된다(저장소 미포함).
- `node_modules/`는 커밋하지 않는다(.gitignore).
