'use client';

import { useState, useEffect } from 'react';
import Icon from './Icon';
import { AppHeader, FoodPlaceholder, DiscountBadge, Button } from './shared';
import { discountPct, won } from '@/lib/data';
import type { Special, Coupon } from '@/lib/data';

const CP_TABS = [
  { id: 'available', label: '사용 가능' },
  { id: 'used',      label: '사용 완료' },
  { id: 'expired',   label: '만료' },
] as const;

function fmtCountdown(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

function CouponCard({ cp, special, onShowQR }: { cp: Coupon; special: Special; onShowQR: (cp: Coupon) => void }) {
  const pct = discountPct(special);
  const dim = cp.status !== 'available';
  return (
    <div style={{
      display: 'flex', background: 'var(--surface-2)', borderRadius: 'var(--radius-xl)',
      overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)',
      opacity: dim ? 0.62 : 1, position: 'relative',
    }}>
      <div style={{ width: 92, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <FoodPlaceholder special={special} fill rounded={0} label={false} />
        </div>
      </div>
      <div style={{ position: 'relative', width: 0 }}>
        <div style={{ position: 'absolute', top: -6, left: -6, width: 12, height: 12, borderRadius: 9999, background: 'var(--surface-0)' }} />
        <div style={{ position: 'absolute', bottom: -6, left: -6, width: 12, height: 12, borderRadius: 9999, background: 'var(--surface-0)' }} />
        <div style={{ position: 'absolute', top: 8, bottom: 8, left: -1, borderLeft: '2px dashed var(--gray-200)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: '13px 14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DiscountBadge pct={pct} />
          {cp.status === 'available' && cp.expireIn != null && cp.expireIn < 60 && (
            <span style={{ fontSize: 'calc(11px * var(--font-scale))', fontWeight: 700, color: 'var(--warning)' }}>곧 만료</span>
          )}
        </div>
        <div style={{ fontSize: 'calc(16px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{special.store}</div>
        <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-500)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{special.menu}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 9, gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <span className="tnum" style={{ fontSize: 'calc(18px * var(--font-scale))', fontWeight: 800, color: 'var(--brand-primary-dark)' }}>{won(special.sale)}</span>
            <div style={{ fontSize: 'calc(11px * var(--font-scale))', color: 'var(--gray-400)', marginTop: 2 }}>
              {cp.status === 'available' && cp.expireIn != null && `${fmtCountdown(cp.expireIn)} 후 만료`}
              {cp.status === 'used' && cp.usedAt && `${cp.usedAt} 사용`}
              {cp.status === 'expired' && cp.expiredAt}
            </div>
          </div>
          {cp.status === 'available' ? (
            <Button variant="primary" size="sm" leadingIcon="qr" onClick={() => onShowQR(cp)}>QR 제시</Button>
          ) : cp.status === 'used' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'calc(12px * var(--font-scale))', fontWeight: 700, color: 'var(--success)' }}><Icon name="check" size={15} color="var(--success)" /> 사용완료</span>
          ) : (
            <span style={{ fontSize: 'calc(12px * var(--font-scale))', fontWeight: 600, color: 'var(--gray-400)' }}>기간 만료</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface CouponsScreenProps {
  coupons: Coupon[];
  getSpecial: (id: string) => Special | undefined;
  onShowQR: (cp: Coupon) => void;
  onBrowse?: () => void;
  onBell?: () => void;
  onSettings?: () => void;
  notiCount?: number;
}

export function CouponsScreen({ coupons, getSpecial, onShowQR, onBrowse, onBell, onSettings, notiCount = 0 }: CouponsScreenProps) {
  const [tab, setTab] = useState<'available' | 'used' | 'expired'>('available');
  const list = coupons.filter(c => c.status === tab);
  const counts = {
    available: coupons.filter(c => c.status === 'available').length,
    used:      coupons.filter(c => c.status === 'used').length,
    expired:   coupons.filter(c => c.status === 'expired').length,
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)' }}>
      <AppHeader title="내 쿠폰함" subtitle={`사용 가능 ${counts.available}장`} onBell={onBell} onSettings={onSettings} badge={notiCount} />

      <div style={{ display: 'flex', background: 'var(--surface-1)', borderBottom: '1px solid var(--gray-100)', padding: '0 8px' }}>
        {CP_TABS.map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 0 11px', position: 'relative', fontFamily: 'var(--font-sans)' }}>
              <span style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: on ? 700 : 500, color: on ? 'var(--gray-900)' : 'var(--gray-400)' }}>
                {t.label} <span className="tnum" style={{ color: on ? 'var(--brand-primary-dark)' : 'var(--gray-400)' }}>{counts[t.id]}</span>
              </span>
              {on && <div style={{ position: 'absolute', bottom: 0, left: '22%', right: '22%', height: 2.5, borderRadius: 9999, background: 'var(--brand-primary)' }} />}
            </button>
          );
        })}
      </div>

      <div className="app-scroll" style={{ flex: 1, padding: '14px 16px 20px' }}>
        {list.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '56px 24px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 9999, background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="ticket" size={34} color="var(--gray-300)" />
            </div>
            <div style={{ fontSize: 'calc(16px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-700)' }}>
              {tab === 'available' ? '아직 발급받은 쿠폰이 없어요' : tab === 'used' ? '사용한 쿠폰이 없어요' : '만료된 쿠폰이 없어요'}
            </div>
            {tab === 'available' && (
              <>
                <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-400)', marginTop: 6 }}>지금 주변 점심특선을 둘러보세요</div>
                <div style={{ marginTop: 18 }}><Button variant="primary" size="md" leadingIcon="home" onClick={onBrowse}>점심특선 보러가기</Button></div>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map((cp, i) => {
              const sp = getSpecial(cp.specialId);
              if (!sp) return null;
              return (
                <div key={cp.id} style={{ animation: `floatUp 300ms ease-out ${i * 50}ms both` }}>
                  <CouponCard cp={cp} special={sp} onShowQR={onShowQR} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function QRMatrix({ seed, size = 220 }: { seed: string; size?: number }) {
  const N = 25;
  const cell = size / N;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  function rand(i: number) { const x = Math.sin(h + i * 12.9898) * 43758.5453; return x - Math.floor(x); }
  const cells: [number, number][] = [];
  function finder(ox: number, oy: number) {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const on = x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      if (on) cells.push([ox + x, oy + y]);
    }
  }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const inFinder = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    if (inFinder) continue;
    if (rand(y * N + x) > 0.55) cells.push([x, y]);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map(([x, y], i) => <rect key={i} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill="#111827" />)}
    </svg>
  );
}

interface QRScreenProps {
  cp: Coupon;
  special: Special;
  onClose: () => void;
  onRedeemed: () => void;
}

export function QRScreen({ cp, special, onClose, onRedeemed }: QRScreenProps) {
  const [secs, setSecs] = useState(60);
  const [seed, setSeed] = useState('LSL-' + cp.id + '-' + Date.now());
  const pct = discountPct(special);

  useEffect(() => {
    if (secs <= 0) { setSeed('LSL-' + cp.id + '-' + Date.now()); setSecs(60); return; }
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const R = 150, C = 2 * Math.PI * R, off = C * (1 - secs / 60);
  const low = secs <= 10;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 250, background: '#fff', display: 'flex', flexDirection: 'column', animation: 'sheetUp 300ms ease-out' }}>
      <div style={{ paddingTop: 52, paddingBottom: 8, paddingLeft: 8, paddingRight: 16, display: 'flex', alignItems: 'center' }}>
        <button onClick={onClose} aria-label="닫기" style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={24} color="#374151" />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF3E0', color: '#ED6C02', padding: '6px 13px', borderRadius: 9999, fontSize: 13, fontWeight: 700 }}>
          <Icon name="shield" size={15} color="#ED6C02" /> 매장 직원에게 제시하세요
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 16 }}>{special.store}</div>
        <div style={{ fontSize: 15, color: '#6B7280', marginTop: 3 }}>{special.menu}</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <span className="tnum" style={{ fontSize: 22, fontWeight: 800, color: '#F57C00' }}>{won(special.sale)}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FF5722' }}>-{pct}%</span>
        </div>

        <div style={{ position: 'relative', width: 320, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
          <svg width="320" height="320" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="160" cy="160" r={R} fill="none" stroke="#F3F4F6" strokeWidth="6" />
            <circle cx="160" cy="160" r={R} fill="none" stroke={low ? '#FF5722' : '#FFA726'} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 1s linear, stroke 200ms' }} />
          </svg>
          <div style={{ padding: 14, background: '#fff', borderRadius: 20, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
            <QRMatrix seed={seed} size={210} />
          </div>
        </div>

        <div className="tnum" style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: low ? '#D32F2F' : '#374151', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="clock" size={18} color={low ? '#D32F2F' : '#9CA3AF'} /> 0:{String(secs).padStart(2, '0')} 후 자동 갱신
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#9CA3AF' }}>스크린샷 도용 방지를 위해 60초마다 코드가 바뀝니다</div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, width: '100%', maxWidth: 320 }}>
          <button style={{ flex: 1, height: 46, borderRadius: 12, border: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Icon name="copy" size={17} color="#6B7280" /> 코드 복사
          </button>
        </div>
        <button onClick={onRedeemed} style={{ marginTop: 14, fontSize: 12.5, color: '#9CA3AF', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>
          (데모) 사장님이 스캔 완료 →
        </button>
      </div>
    </div>
  );
}

export function RedeemFlash({ special, onDone, enabled }: { special: Special; onDone: () => void; enabled?: boolean }) {
  useEffect(() => {
    const t = setTimeout(onDone, enabled ? 1700 : 500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 320, background: 'var(--brand-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', animation: 'fadeIn 250ms ease-out' }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        {enabled && <span style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: '#fff', opacity: 0.25, animation: 'pulseRing 1000ms ease-out infinite' }} />}
        <div style={{ width: 110, height: 110, borderRadius: 9999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop 500ms cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
          <Icon name="check" size={62} color="var(--brand-secondary)" strokeWidth={3.4} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 24 }}>쿠폰 사용 완료</div>
      <div style={{ fontSize: 15, opacity: 0.9, marginTop: 6 }}>{special.store}</div>
      <div className="tnum" style={{ fontSize: 40, fontWeight: 800, marginTop: 16, letterSpacing: '-0.02em' }}>{won(special.price - special.sale)}</div>
      <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2 }}>할인 적용</div>
    </div>
  );
}
