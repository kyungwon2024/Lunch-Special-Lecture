'use client';

import { useState } from 'react';
import Icon from './Icon';
import { FoodPlaceholder, StatusBadge, DiscountBadge, CategoryTag, Button } from './shared';
import { discountPct, won } from '@/lib/data';
import type { Special } from '@/lib/data';

function MiniMap({ s }: { s: Special }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: 130, borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', background: 'var(--gray-100)',
      backgroundImage: `linear-gradient(var(--gray-200) 1px, transparent 1px), linear-gradient(90deg, var(--gray-200) 1px, transparent 1px)`,
      backgroundSize: '28px 28px',
      border: '1px solid var(--gray-200)',
    }}>
      <div style={{ position: 'absolute', top: '52%', left: 0, right: 0, height: 9, background: 'var(--gray-0)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '38%', width: 7, background: 'var(--gray-0)', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)' }} />
      <div style={{ position: 'absolute', top: '52%', left: '20%', transform: 'translate(-50%,-50%)' }}>
        <div style={{ width: 12, height: 12, borderRadius: 9999, background: 'var(--info)', border: '2px solid #fff', boxShadow: '0 0 0 4px rgba(25,118,210,0.25)' }} />
      </div>
      <div style={{ position: 'absolute', top: '38%', left: '62%', transform: 'translate(-50%,-100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: 'var(--brand-primary)', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap' }}>{s.store}</div>
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid var(--brand-primary)' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-600)', background: 'rgba(255,255,255,0.85)', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>도보 2분 · {s.dist}km</div>
    </div>
  );
}

function MetaPill({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-700)', fontWeight: 500 }}>
      <Icon name={icon} size={15} color="var(--gray-500)" />{children}
    </div>
  );
}

const glassBtn: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 9999, border: 'none', cursor: 'pointer',
  background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)',
};

interface DetailScreenProps {
  s: Special;
  onBack: () => void;
  onGetCoupon: (s: Special) => void;
  soldOut?: boolean;
}

export default function DetailScreen({ s, onBack, onGetCoupon, soldOut = false }: DetailScreenProps) {
  const pct = discountPct(s);
  const [fav, setFav] = useState(false);
  const remainPct = Math.round((s.remain / s.total) * 100);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)' }}>
      <div className="app-scroll" style={{ flex: 1 }}>
        <div style={{ position: 'relative' }}>
          <FoodPlaceholder special={s} ratio="1 / 1" />
          <div style={{ position: 'absolute', top: 50, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={onBack} aria-label="뒤로" style={glassBtn}>
              <Icon name="back" size={22} color="var(--gray-800)" />
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setFav(v => !v)} aria-label="찜" style={glassBtn}>
                <Icon name="heart" size={21} color={fav ? 'var(--brand-accent)' : 'var(--gray-800)'} fill={fav ? 'var(--brand-accent)' : 'none'} />
              </button>
              <button aria-label="공유" style={glassBtn}><Icon name="share" size={20} color="var(--gray-800)" /></button>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {[0,1,2,3].map(i => <span key={i} style={{ width: i===0?16:6, height: 6, borderRadius: 9999, background: i===0 ? '#fff' : 'rgba(255,255,255,0.55)' }} />)}
          </div>
        </div>

        <div style={{ padding: '18px 18px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CategoryTag cat={s.cat} />
            <StatusBadge status={s.status} />
          </div>
          <div style={{ fontSize: 'calc(24px * var(--font-scale))', fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{s.store}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-500)' }}>
            <span style={{ color: 'var(--brand-primary-dark)', fontWeight: 700 }}>⭐ {s.rating}</span>
            <span>·</span><Icon name="pin" size={14} color="var(--gray-400)" />{s.addr}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 13 }}>
            {s.solo && <MetaPill icon="seat">1인좌석 OK</MetaPill>}
            <MetaPill icon="clock">예상 {s.prep}</MetaPill>
            <MetaPill icon="pin">{s.dist}km · 도보 2분</MetaPill>
          </div>

          <div style={{ marginTop: 18, padding: 16, background: 'var(--brand-primary-light)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, color: 'var(--gray-800)' }}>{s.menu}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                <span className="tnum" style={{ fontSize: 'calc(30px * var(--font-scale))', fontWeight: 800, color: 'var(--brand-primary-dark)', letterSpacing: '-0.02em' }}>{won(s.sale)}</span>
                <span className="tnum" style={{ fontSize: 'calc(15px * var(--font-scale))', color: 'var(--gray-400)', textDecoration: 'line-through' }}>{won(s.price)}</span>
              </div>
              <DiscountBadge pct={pct} big />
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: 13, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)', fontWeight: 600 }}>
                <Icon name="flame" size={14} color="var(--brand-accent)" fill="var(--brand-accent)" /> 잔여 수량
              </div>
              <div className="tnum" style={{ fontSize: 'calc(20px * var(--font-scale))', fontWeight: 800, color: s.remain <= 5 ? 'var(--brand-accent)' : 'var(--gray-900)', marginTop: 4 }}>
                {s.remain}<span style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-400)', fontWeight: 600 }}> / {s.total}개</span>
              </div>
              <div style={{ height: 5, borderRadius: 9999, background: 'var(--gray-200)', marginTop: 7, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${remainPct}%`, background: s.remain <= 5 ? 'var(--brand-accent)' : 'var(--brand-primary)', borderRadius: 9999 }} />
              </div>
            </div>
            <div style={{ flex: 1, padding: 13, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)', fontWeight: 600 }}>
                <Icon name="clock" size={14} color="var(--warning)" /> 특선 만료
              </div>
              <div className="tnum" style={{ fontSize: 'calc(20px * var(--font-scale))', fontWeight: 800, color: 'var(--gray-900)', marginTop: 4 }}>{s.expire}</div>
              <div style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-400)', marginTop: 7 }}>까지 발급 가능</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-800)', marginBottom: 7 }}>사장님 한마디</div>
            <div style={{ fontSize: 'calc(14px * var(--font-scale))', lineHeight: 1.6, color: 'var(--gray-600)', padding: 14, background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--brand-secondary)' }}>"{s.desc}"</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-800)', marginBottom: 7 }}>오시는 길</div>
            <MiniMap s={s} />
          </div>
          <div style={{ height: 12 }} />
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 26px', borderTop: '1px solid var(--gray-100)', background: 'var(--surface-1)', boxShadow: '0 -4px 16px rgba(0,0,0,0.04)' }}>
        {soldOut ? (
          <Button variant="primary" size="lg" fullWidth disabled>마감되었습니다</Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth leadingIcon="ticket" onClick={() => onGetCoupon(s)}>
            쿠폰 받기 · {won(s.price - s.sale)} 할인
          </Button>
        )}
      </div>
    </div>
  );
}
