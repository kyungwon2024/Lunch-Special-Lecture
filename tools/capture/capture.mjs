// 점심특강 테스트 증적 캡처 도구 (Playwright)
// 사용법:
//   node capture.mjs --cases cases.json --outdir <dir> [--base <url>]
//   node capture.mjs --url <url> --out <png> [--mobile] [--full]
//
// cases.json 항목:
//   { "id":"TC-UI-HOME", "kind":"url", "path":"/", "mobile":true, "full":true }
//   { "id":"TC-COUPON-201", "kind":"api", "method":"POST", "path":"/api/coupons",
//     "body":{...}, "useToken":true, "label":"쿠폰 발급", "tc":"TC-F3-001", "expect":"201 ISSUED" }
//   토큰 체인: kind:"api" 에 "saveToken":"accessToken" 이 있으면 응답에서 토큰 저장,
//             이후 "useToken":true 케이스가 Bearer 로 사용.
import { chromium, devices } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1]?.startsWith('--') || arr[i + 1] === undefined ? true : arr[i + 1]]);
  return a;
}, []));

const BASE = args.base || 'https://lunch-special-lecture.vercel.app';
const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function cardHtml({ tc, label, method, path, body, expect, status, resp }) {
  const pill = status >= 200 && status < 300 ? '#16a34a' : status >= 400 && status < 500 ? '#d97706' : status >= 500 ? '#dc2626' : '#6b7280';
  const verdict = passed(expect, status) ? 'Pass' : 'Fail';
  const vcol = verdict === 'Pass' ? '#16a34a' : '#dc2626';
  return `<!doctype html><meta charset=utf-8><style>
*{margin:0;box-sizing:border-box;font-family:-apple-system,'Apple SD Gothic Neo',sans-serif}
body{padding:28px;background:#f8fafc;width:900px}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.hd{display:flex;align-items:center;gap:12px;padding:16px 20px;background:#0f172a;color:#fff}
.tc{font-weight:700;font-size:18px}.label{color:#94a3b8;font-size:14px}
.pill{margin-left:auto;background:${vcol};color:#fff;padding:5px 14px;border-radius:999px;font-weight:700}
.method{background:#FF5722;color:#fff;padding:3px 10px;border-radius:6px;font-weight:700;font-size:13px}
.body{padding:18px 20px}.row{display:flex;gap:10px;margin-bottom:10px;font-size:14px}
.k{color:#64748b;width:90px;flex:none;font-weight:600}.v{color:#0f172a;word-break:break-all}
.mono{font-family:ui-monospace,Menlo,monospace}.code{font-weight:800;color:${pill}}
.resp{background:#0f172a;color:#e2e8f0;font-family:ui-monospace,Menlo,monospace;font-size:13px;padding:14px 16px;border-radius:8px;white-space:pre-wrap;word-break:break-all;margin-top:6px;line-height:1.5}
.foot{padding:10px 20px;background:#f1f5f9;color:#64748b;font-size:12px}</style>
<div class=card><div class=hd><span class=tc>${esc(tc)}</span><span class=label>${esc(label || '')}</span>
<span class=pill>${verdict}</span></div><div class=body>
<div class=row><span class=k>요청</span><span class=v><span class=method>${method}</span> <span class="v mono">${esc(path)}</span></span></div>
${body ? `<div class=row><span class=k>바디</span><span class="v mono">${esc(body)}</span></div>` : ''}
<div class=row><span class=k>기대</span><span class=v>${esc(expect || '')}</span></div>
<div class=row><span class=k>실제</span><span class="v code">HTTP ${status}</span></div>
<div class=resp>${esc(resp)}</div></div>
<div class=foot>점심특강 · Production 라이브 · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · ${esc(BASE)} · Playwright</div></div>`;
}

function passed(expect, status) {
  const m = String(expect).match(/\b([1-5]\d\d)\b/);
  return m ? Number(m[1]) === status : status >= 200 && status < 400;
}

const run = async () => {
  const browser = await chromium.launch();
  let exit = 0;
  try {
    // 단일 URL 모드
    if (args.url) {
      const ctx = await browser.newContext(args.mobile ? devices['iPhone 13'] : {});
      const page = await ctx.newPage();
      await page.goto(args.url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.screenshot({ path: args.out, fullPage: !!args.full });
      console.log('saved', args.out);
      await ctx.close();
      return;
    }
    // 케이스 파일 모드
    const cases = JSON.parse(readFileSync(resolve(args.cases), 'utf8'));
    const outdir = resolve(args.outdir || '.');
    mkdirSync(outdir, { recursive: true });
    const tokens = {};
    const api = await browser.newContext();
    const results = [];
    for (const c of cases) {
      const out = `${outdir}/${c.id}.png`;
      if (c.kind === 'url') {
        const ctx = await browser.newContext(c.mobile ? devices['iPhone 13'] : { viewport: { width: 1280, height: 1600 } });
        const page = await ctx.newPage();
        await page.goto(BASE + (c.path || '/'), { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
        await page.waitForTimeout(c.wait || 900);
        await page.screenshot({ path: out, fullPage: !!c.full });
        await ctx.close();
        results.push({ id: c.id, ok: true });
        console.log('url ', c.id, '->', out);
      } else if (c.kind === 'api') {
        const headers = {};
        if (c.useToken && tokens.accessToken) headers['Authorization'] = 'Bearer ' + tokens.accessToken;
        if (c.token) headers['Authorization'] = 'Bearer ' + c.token;
        let body = c.body;
        if (c.bodyTemplate) body = JSON.parse(JSON.stringify(c.bodyTemplate).replace(/\{\{(\w+)\}\}/g, (_, k) => tokens[k] || ''));
        const resp = await api.request.fetch(BASE + c.path, {
          method: c.method || 'GET',
          headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
          data: body ? JSON.stringify(body) : undefined,
          failOnStatusCode: false, timeout: 30000,
        });
        const status = resp.status();
        const text = (await resp.text()).slice(0, 500);
        if (c.saveToken) { try { tokens[c.saveToken] = JSON.parse(text)[c.saveToken]; } catch {} }
        if (c.saveFrom) { try { Object.assign(tokens, JSON.parse(text)); } catch {} }
        const reqBodyShown = c.show === false ? '' : (body ? JSON.stringify(maskPw(body)) : '');
        const page = await api.newPage();
        await page.setContent(cardHtml({ tc: c.tc || c.id, label: c.label, method: c.method || 'GET', path: c.path, body: reqBodyShown, expect: c.expect, status, resp: text }));
        await page.locator('.card').screenshot({ path: out });
        await page.close();
        const ok = passed(c.expect, status);
        results.push({ id: c.id, ok, status });
        if (!ok) exit = 1;
        console.log('api ', c.id, status, ok ? 'Pass' : 'FAIL', '->', out);
      }
    }
    console.log('\n총', results.length, '건 · Pass', results.filter(r => r.ok).length, '· Fail', results.filter(r => !r.ok).length);
  } finally {
    await browser.close();
  }
  process.exit(exit);
};
function maskPw(o) { const x = { ...o }; if ('password' in x) x.password = '****'; return x; }
run();
