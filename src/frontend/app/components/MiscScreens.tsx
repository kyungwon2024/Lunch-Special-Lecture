'use client';

import { useState } from 'react';
import Icon from './Icon';
import { AppHeader, FoodPlaceholder, StatusBadge, DiscountBadge, Button } from './shared';
import { discountPct, won } from '@/lib/data';
import type { Special } from '@/lib/data';

export function ExploreScreen({
  specials, onTapSpecial, onBell, onSettings, notiCount = 0,
}: {
  specials: Special[];
  onTapSpecial: (s: Special) => void;
  onBell?: () => void;
  onSettings?: () => void;
  notiCount?: number;
}) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const live = specials.filter(s => s.status !== 'closed');
  const pos = [[28,30],[58,22],[44,48],[72,40],[20,58],[64,64],[38,70],[80,62]];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)' }}>
      <AppHeader title="탐색" subtitle="강남 테헤란로 반경 500m" onBell={onBell} onSettings={onSettings} badge={notiCount} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--surface-1)', borderBottom: '1px solid var(--gray-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, height: 38, padding: '0 12px', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', color: 'var(--gray-400)', fontSize: 'calc(13px * var(--font-scale))' }}>
          <Icon name="search" size={16} color="var(--gray-400)" /> 매장·메뉴 검색
        </div>
        <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', padding: 3 }}>
          {(['map', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} aria-label={v}
              style={{ width: 40, height: 32, border: 'none', borderRadius: 9999, cursor: 'pointer', background: view === v ? 'var(--surface-2)' : 'transparent', boxShadow: view === v ? 'var(--shadow-sm)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={v} size={18} color={view === v ? 'var(--brand-primary-dark)' : 'var(--gray-400)'} />
            </button>
          ))}
        </div>
      </div>

      {view === 'map' ? (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--gray-100)',
          backgroundImage: 'linear-gradient(var(--gray-200) 1px, transparent 1px), linear-gradient(90deg, var(--gray-200) 1px, transparent 1px)', backgroundSize: '34px 34px' }}>
          <div style={{ position: 'absolute', top: '46%', left: 0, right: 0, height: 12, background: 'var(--gray-0)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 10, background: 'var(--gray-0)', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 230, height: 230, transform: 'translate(-50%,-50%)', borderRadius: 9999, border: '1.5px solid rgba(255,167,38,0.5)', background: 'rgba(255,167,38,0.07)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: 9999, background: 'var(--info)', border: '3px solid #fff', boxShadow: '0 0 0 5px rgba(25,118,210,0.22)', zIndex: 2 }} />
          {live.map((s, i) => {
            const p = pos[i % pos.length];
            const pct = discountPct(s);
            return (
              <button key={s.id} onClick={() => onTapSpecial(s)} style={{ position: 'absolute', top: `${p[1]}%`, left: `${p[0]}%`, transform: 'translate(-50%,-100%)', border: 'none', background: 'transparent', cursor: 'pointer', zIndex: 3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: s.status === 'closing' ? 'var(--warning)' : 'var(--brand-primary)', color: '#fff', padding: '4px 9px', borderRadius: 9, fontSize: 12, fontWeight: 800, boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap' }} className="tnum">{won(s.sale)}</div>
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `7px solid ${s.status === 'closing' ? 'var(--warning)' : 'var(--brand-primary)'}` }} />
                </div>
              </button>
            );
          })}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', padding: '8px 14px', borderRadius: 9999, fontSize: 'calc(13px * var(--font-scale))', fontWeight: 600, color: 'var(--gray-700)', boxShadow: 'var(--shadow-md)' }} className="tnum">📍 주변 점심특선 {live.length}곳</div>
        </div>
      ) : (
        <div className="app-scroll" style={{ flex: 1, padding: '14px 16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {live.map(s => (
              <div key={s.id} onClick={() => onTapSpecial(s)} style={{ display: 'flex', gap: 12, padding: 10, background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', cursor: 'pointer', alignItems: 'center' }}>
                <div style={{ width: 64, flexShrink: 0 }}><FoodPlaceholder special={s} ratio="1 / 1" rounded={10} label={false} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <StatusBadge status={s.status} size="sm" />
                    <span style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)' }}>{s.dist}km</span>
                  </div>
                  <div style={{ fontSize: 'calc(15px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)', marginTop: 3 }}>{s.store}</div>
                  <div style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)' }}>{s.menu}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="tnum" style={{ fontSize: 'calc(17px * var(--font-scale))', fontWeight: 800, color: 'var(--brand-primary-dark)' }}>{won(s.sale)}</div>
                  <div style={{ marginTop: 3 }}><DiscountBadge pct={discountPct(s)} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const NOTIS = [
  { id: 'n1', icon: 'pin', tone: 'brand', title: '근처 점심특선 알림', body: '진고개 한식당이 500m 이내에 점심특선을 등록했어요.', time: '방금 전', unread: true },
  { id: 'n2', icon: 'flame', tone: 'accent', title: '곧 마감!', body: '그린보울 닭가슴살 포케볼 잔여 4개. 서두르세요.', time: '12분 전', unread: true },
  { id: 'n3', icon: 'ticket', tone: 'success', title: '쿠폰 발급 완료', body: '본죽 삼계 전복 삼계죽 쿠폰이 쿠폰함에 담겼어요.', time: '40분 전', unread: false },
  { id: 'n4', icon: 'check', tone: 'success', title: '쿠폰 사용 완료', body: '미도리 라멘에서 2,400원 할인받았어요.', time: '어제', unread: false },
  { id: 'n5', icon: 'bell', tone: 'info', title: '점심특강 공지', body: '6월 한 달간 신규 매장 등록 수수료가 면제됩니다.', time: '2일 전', unread: false },
];

export function NotiScreen({ onBell, onSettings }: { onBell?: () => void; onSettings?: () => void }) {
  const [notis, setNotis] = useState(NOTIS);
  const toneMap: Record<string, { bg: string; fg: string }> = {
    brand:   { bg: 'var(--brand-primary-light)', fg: 'var(--brand-primary-dark)' },
    accent:  { bg: 'var(--danger-bg)', fg: 'var(--brand-accent)' },
    success: { bg: 'var(--success-bg)', fg: 'var(--success)' },
    info:    { bg: 'var(--info-bg)', fg: 'var(--info)' },
  };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)' }}>
      <AppHeader title="알림" onBell={onBell} onSettings={onSettings} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px 0' }}>
        <button onClick={() => setNotis(notis.map(n => ({ ...n, unread: false })))} style={{ border: 'none', background: 'transparent', color: 'var(--brand-primary-dark)', fontWeight: 600, fontSize: 'calc(13px * var(--font-scale))', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>모두 읽음</button>
      </div>
      <div className="app-scroll" style={{ flex: 1, padding: '6px 16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notis.map(n => {
            const tm = toneMap[n.tone];
            return (
              <div key={n.id} onClick={() => setNotis(notis.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                style={{ display: 'flex', gap: 12, padding: 13, background: n.unread ? 'var(--brand-primary-light)' : 'var(--surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', cursor: 'pointer', position: 'relative' }}>
                {n.unread && <span style={{ position: 'absolute', top: 14, left: 4, width: 6, height: 6, borderRadius: 9999, background: 'var(--brand-accent)' }} />}
                <div style={{ width: 38, height: 38, borderRadius: 10, background: tm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={n.icon} size={20} color={tm.fg} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)' }}>{n.title}</span>
                    <span style={{ fontSize: 'calc(11px * var(--font-scale))', color: 'var(--gray-400)', flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-600)', marginTop: 3, lineHeight: 1.45 }}>{n.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface Tweaks {
  cardLayout: string;
  fontScale: number;
  dark: boolean;
  push: boolean;
}

export function MyScreen({
  tweaks, setTweak, onBell, onSettings, couponCount,
}: {
  tweaks: Tweaks;
  setTweak: (k: keyof Tweaks, v: boolean | number | string) => void;
  onBell?: () => void;
  onSettings?: () => void;
  couponCount?: number;
}) {
  const scales: [string, number][] = [['표준', 1], ['큰 글씨', 1.25], ['매우 큼', 1.5]];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)' }}>
      <AppHeader title="마이" onBell={onBell} onSettings={onSettings} />
      <div className="app-scroll" style={{ flex: 1, padding: '16px 16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
          <div style={{ width: 54, height: 54, borderRadius: 9999, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🧑‍💼</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'calc(17px * var(--font-scale))', fontWeight: 800, color: 'var(--gray-900)' }}>김대리</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'calc(12px * var(--font-scale))', color: 'var(--success)', fontWeight: 600, marginTop: 3 }}>
              <Icon name="shield" size={13} color="var(--success)" /> 본인 인증 완료
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {([['보유 쿠폰', (couponCount ?? 0) + '장'], ['이번 달 절약', '14,200원'], ['방문 매장', '7곳']] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ flex: 1, padding: 13, background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', textAlign: 'center' }}>
              <div className="tnum" style={{ fontSize: 'calc(18px * var(--font-scale))', fontWeight: 800, color: 'var(--brand-primary-dark)' }}>{v}</div>
              <div style={{ fontSize: 'calc(11px * var(--font-scale))', color: 'var(--gray-500)', marginTop: 3 }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 'calc(12px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '22px 6px 8px' }}>화면 설정</div>
        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gray-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 11 }}>
              <Icon name="user" size={20} color="var(--gray-500)" />
              <span style={{ fontSize: 'calc(15px * var(--font-scale))', color: 'var(--gray-800)', fontWeight: 500 }}>큰 글씨 모드</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {scales.map(([lbl, val]) => {
                const on = tweaks.fontScale === val;
                return (
                  <button key={val} onClick={() => setTweak('fontScale', val)}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 'var(--radius-md)', border: on ? '1.5px solid var(--brand-primary)' : '1px solid var(--gray-200)', background: on ? 'var(--brand-primary-light)' : 'var(--surface-2)', color: on ? 'var(--brand-primary-dark)' : 'var(--gray-600)', fontWeight: on ? 700 : 500, fontSize: 'calc(13px * var(--font-scale))', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{lbl}</button>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--gray-100)' }}>
            <Icon name="settings" size={20} color="var(--gray-500)" />
            <span style={{ flex: 1, fontSize: 'calc(15px * var(--font-scale))', color: 'var(--gray-800)', fontWeight: 500 }}>다크 모드</span>
            <Switch on={tweaks.dark} onToggle={() => setTweak('dark', !tweaks.dark)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
            <Icon name="bell" size={20} color="var(--gray-500)" />
            <span style={{ flex: 1, fontSize: 'calc(15px * var(--font-scale))', color: 'var(--gray-800)', fontWeight: 500 }}>점심시간 푸시 알림</span>
            <Switch on={tweaks.push} onToggle={() => setTweak('push', !tweaks.push)} />
          </div>
        </div>

        <div style={{ fontSize: 'calc(12px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '22px 6px 8px' }}>계정</div>
        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
          {[['ticket', '쿠폰 사용 내역'], ['heart', '즐겨찾기'], ['shield', '개인정보 · 약관']].map(([icon, label], i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
              <Icon name={icon} size={20} color="var(--gray-500)" />
              <span style={{ flex: 1, fontSize: 'calc(15px * var(--font-scale))', color: 'var(--gray-800)', fontWeight: 500 }}>{label}</span>
              <Icon name="chevRight" size={18} color="var(--gray-300)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label="toggle" style={{ width: 48, height: 28, borderRadius: 9999, border: 'none', cursor: 'pointer', background: on ? 'var(--brand-primary)' : 'var(--gray-300)', position: 'relative', transition: 'background var(--motion-normal)', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: 9999, background: '#fff', transition: 'left var(--motion-normal)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>
  );
}
