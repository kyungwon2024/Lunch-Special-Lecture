'use client';

import { useState } from 'react';
import Icon from './Icon';
import { AppHeader, FoodPlaceholder, StatusBadge, DiscountBadge, CategoryTag } from './shared';
import { discountPct, won } from '@/lib/data';
import type { Special } from '@/lib/data';

const SORTS = ['거리순', '할인율순', '인기순', '즉시입장'] as const;

function CardStandard({ s, onTap }: { s: Special; onTap: (s: Special) => void }) {
  const pct = discountPct(s);
  const [press, setPress] = useState(false);
  return (
    <div onClick={() => onTap(s)}
      onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
      style={{
        background: 'var(--surface-2)', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        boxShadow: 'var(--shadow-md)', cursor: 'pointer',
        transform: press ? 'scale(0.985)' : 'scale(1)', transition: 'transform var(--motion-fast)',
        border: '1px solid var(--gray-100)',
      }}>
      <div style={{ position: 'relative' }}>
        <FoodPlaceholder special={s} ratio="4 / 3" />
        <div style={{ position: 'absolute', top: 10, left: 10 }}><StatusBadge status={s.status} /></div>
        <div style={{ position: 'absolute', top: 10, right: 10 }}><DiscountBadge pct={pct} /></div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 'calc(18px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)', letterSpacing: '-0.01em' }}>{s.store}</span>
          <span style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-500)', flexShrink: 0 }}>⭐ {s.rating} · {s.dist}km</span>
        </div>
        <div style={{ fontSize: 'calc(15px * var(--font-scale))', color: 'var(--gray-600)', marginTop: 4, fontWeight: 500 }}>{s.menu}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="tnum" style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-400)', textDecoration: 'line-through' }}>{won(s.price)}</span>
            <span className="tnum" style={{ fontSize: 'calc(24px * var(--font-scale))', fontWeight: 800, color: 'var(--brand-primary-dark)', letterSpacing: '-0.02em' }}>{won(s.sale)}</span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)', fontWeight: 500 }}>
            <Icon name="clock" size={14} color="var(--gray-400)" />{s.prep}
          </span>
        </div>
        {s.remain <= 5 && (
          <div style={{ marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--brand-accent)', fontWeight: 700, fontSize: 'calc(12px * var(--font-scale))' }}>
            <Icon name="flame" size={14} fill="var(--brand-accent)" color="var(--brand-accent)" /> 잔여 {s.remain}개 · 마감 임박
          </div>
        )}
      </div>
    </div>
  );
}

function CardCompact({ s, onTap }: { s: Special; onTap: (s: Special) => void }) {
  const pct = discountPct(s);
  const [press, setPress] = useState(false);
  return (
    <div onClick={() => onTap(s)}
      onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
      style={{
        background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)', cursor: 'pointer', display: 'flex', gap: 12, padding: 10,
        transform: press ? 'scale(0.985)' : 'scale(1)', transition: 'transform var(--motion-fast)',
        border: '1px solid var(--gray-100)',
      }}>
      <div style={{ width: 96, flexShrink: 0, position: 'relative' }}>
        <FoodPlaceholder special={s} ratio="1 / 1" rounded={10} label={false} />
        <div style={{ position: 'absolute', bottom: 5, left: 5 }}><DiscountBadge pct={pct} /></div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, whiteSpace: 'nowrap' }}>
          <StatusBadge status={s.status} size="sm" />
          <span style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)', flexShrink: 0 }}>{s.dist}km · ⭐{s.rating}</span>
        </div>
        <div style={{ fontSize: 'calc(16px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.store}</div>
        <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-600)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.menu}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 6 }}>
          <span className="tnum" style={{ fontSize: 'calc(19px * var(--font-scale))', fontWeight: 800, color: 'var(--brand-primary-dark)' }}>{won(s.sale)}</span>
          <span className="tnum" style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-400)', textDecoration: 'line-through' }}>{won(s.price)}</span>
        </div>
      </div>
    </div>
  );
}

function CardMagazine({ s, onTap }: { s: Special; onTap: (s: Special) => void }) {
  const pct = discountPct(s);
  const [press, setPress] = useState(false);
  return (
    <div onClick={() => onTap(s)}
      onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
      style={{
        position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        boxShadow: 'var(--shadow-md)', cursor: 'pointer', aspectRatio: '3 / 2.2',
        transform: press ? 'scale(0.985)' : 'scale(1)', transition: 'transform var(--motion-fast)',
      }}>
      <FoodPlaceholder special={s} ratio="3 / 2.2" rounded={0} label={false} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,24,39,0.82) 0%, rgba(17,24,39,0.28) 42%, transparent 70%)' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
        <StatusBadge status={s.status} />
        <DiscountBadge pct={pct} big />
      </div>
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 13, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <CategoryTag cat={s.cat} />
          {s.remain <= 5 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 'calc(11px * var(--font-scale))', fontWeight: 700, color: '#FFD0BE' }}><Icon name="flame" size={13} fill="#FF7043" color="#FF7043" /> 잔여 {s.remain}</span>}
        </div>
        <div style={{ fontSize: 'calc(20px * var(--font-scale))', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>{s.store}</div>
        <div style={{ fontSize: 'calc(13px * var(--font-scale))', opacity: 0.92, marginTop: 1 }}>{s.menu} · {s.dist}km</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 7 }}>
          <span className="tnum" style={{ fontSize: 'calc(25px * var(--font-scale))', fontWeight: 800, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>{won(s.sale)}</span>
          <span className="tnum" style={{ fontSize: 'calc(13px * var(--font-scale))', opacity: 0.75, textDecoration: 'line-through' }}>{won(s.price)}</span>
        </div>
      </div>
    </div>
  );
}

const CARD_VARIANTS = { standard: CardStandard, compact: CardCompact, magazine: CardMagazine };

interface FeedScreenProps {
  specials: Special[];
  cardLayout?: keyof typeof CARD_VARIANTS;
  sort: string;
  onSort: (s: string) => void;
  onTapSpecial: (s: Special) => void;
  onBell?: () => void;
  onSettings?: () => void;
  notiCount?: number;
}

export default function FeedScreen({ specials, cardLayout = 'standard', sort, onSort, onTapSpecial, onBell, onSettings, notiCount = 0 }: FeedScreenProps) {
  const Card = CARD_VARIANTS[cardLayout];
  const [showSort, setShowSort] = useState(false);
  const live = specials.filter(s => s.status !== 'closed');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)' }}>
      <AppHeader title="점심특강" subtitle="강남 테헤란로 · 점심특선 26곳" onBell={onBell} onSettings={onSettings} badge={notiCount} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        background: 'var(--surface-1)', borderBottom: '1px solid var(--gray-100)', position: 'relative', zIndex: 4,
      }}>
        <button onClick={() => setShowSort(v => !v)} style={chipStyle(true)}>
          <Icon name="chevDown" size={15} color="var(--gray-600)" />{sort}
        </button>
        <button style={chipStyle(false)}><Icon name="sliders" size={15} color="var(--gray-600)" />필터</button>
        <button style={chipStyle(false)}><Icon name="seat" size={15} color="var(--gray-600)" />1인좌석</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-400)' }} className="tnum">{live.length}곳</span>
      </div>

      {showSort && (
        <div style={{ position: 'absolute', top: 150, left: 16, zIndex: 60, background: 'var(--surface-3)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', minWidth: 140, animation: 'floatUp 150ms ease-out', border: '1px solid var(--gray-100)' }}>
          {SORTS.map(opt => (
            <button key={opt} onClick={() => { onSort(opt); setShowSort(false); }}
              style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 'calc(14px * var(--font-scale))', color: opt === sort ? 'var(--brand-primary-dark)' : 'var(--gray-700)', fontWeight: opt === sort ? 700 : 500, fontFamily: 'var(--font-sans)' }}>
              {opt}{opt === sort && <Icon name="check" size={16} color="var(--brand-primary-dark)" />}
            </button>
          ))}
        </div>
      )}

      <div className="app-scroll" style={{ flex: 1, padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: cardLayout === 'compact' ? 10 : 14 }}>
          {live.map((s, i) => (
            <div key={s.id} style={{ animation: `floatUp 320ms ease-out ${i * 45}ms both` }}>
              <Card s={s} onTap={onTapSpecial} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0 8px', color: 'var(--gray-400)', fontSize: 'calc(12px * var(--font-scale))' }}>
          11:00~14:00 점심특선만 노출 중 · 반경 500m
        </div>
      </div>
    </div>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    height: 34, padding: '0 12px', borderRadius: 'var(--radius-full)',
    border: active ? '1px solid var(--brand-primary)' : '1px solid var(--gray-200)',
    background: active ? 'var(--brand-primary-light)' : 'var(--surface-2)',
    color: active ? 'var(--brand-primary-dark)' : 'var(--gray-700)',
    fontSize: 'calc(13px * var(--font-scale))', fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
  };
}
