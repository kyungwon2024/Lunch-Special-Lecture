'use client';

import { useState } from 'react';
import Icon from './Icon';
import { CATEGORIES, STATUS_META, discountPct, won } from '@/lib/data';
import type { Special, CategoryKey, SpecialStatus } from '@/lib/data';

export function FoodPlaceholder({
  special, ratio = '4 / 3', rounded = 0, label = true, fill = false,
}: { special: Special; ratio?: string; rounded?: number; label?: boolean; fill?: boolean }) {
  const cat = CATEGORIES[special.cat];
  const h = cat.hue;
  const c1 = `hsl(${h} 72% 90%)`;
  const c2 = `hsl(${h} 70% 84%)`;
  const ink = `hsl(${h} 55% 32%)`;
  return (
    <div style={{
      position: 'relative', width: '100%',
      ...(fill ? { height: '100%' } : { aspectRatio: ratio }),
      borderRadius: rounded, overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${c1} 0 14px, ${c2} 14px 28px)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <div style={{ fontSize: 40, lineHeight: 1 }}>{cat.emoji}</div>
      {label && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.02em',
          color: ink, background: 'rgba(255,255,255,0.62)', padding: '3px 9px',
          borderRadius: 6, maxWidth: '78%', textAlign: 'center', fontWeight: 600,
        }}>{special.menu}</div>
      )}
    </div>
  );
}

export function StatusBadge({ status, size = 'md' }: { status: SpecialStatus; size?: 'sm' | 'md' }) {
  const m = STATUS_META[status];
  const map: Record<string, { dot: string; text: string; bg: string }> = {
    success: { dot: 'var(--success)', text: 'var(--success)', bg: 'var(--success-bg)' },
    warning: { dot: 'var(--warning)', text: 'var(--warning)', bg: 'var(--warning-bg)' },
    gray:    { dot: 'var(--gray-400)', text: 'var(--gray-500)', bg: 'var(--gray-100)' },
  };
  const c = map[m.token];
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.text, borderRadius: 'var(--radius-full)',
      padding: size === 'sm' ? '3px 8px' : '4px 10px', fontWeight: 600,
      fontSize: `calc(${fs}px * var(--font-scale))`, lineHeight: 1,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 9999, background: c.dot,
        boxShadow: status !== 'closed' ? `0 0 0 3px ${c.bg}` : 'none' }} />
      {m.label}
    </span>
  );
}

export function DiscountBadge({ pct, big = false }: { pct: number; big?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--brand-accent)', color: '#fff', fontWeight: 800,
      borderRadius: 'var(--radius-full)',
      padding: big ? '5px 12px' : '4px 9px',
      fontSize: `calc(${big ? 15 : 13}px * var(--font-scale))`,
      letterSpacing: '-0.01em', boxShadow: '0 2px 8px rgba(255,87,34,0.35)',
    }} className="tnum">-{pct}%</span>
  );
}

export function CategoryTag({ cat }: { cat: CategoryKey }) {
  const c = CATEGORIES[cat];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, whiteSpace: 'nowrap',
      background: 'var(--brand-primary-light)', color: 'var(--brand-primary-dark)',
      borderRadius: 'var(--radius-md)', padding: '3px 8px', fontWeight: 600,
      fontSize: 'calc(12px * var(--font-scale))', lineHeight: 1.1,
    }}><span>{c.emoji}</span><span>{c.label}</span></span>
  );
}

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  leadingIcon?: string;
  style?: React.CSSProperties;
}

export function Button({ variant = 'primary', size = 'md', children, onClick, disabled, fullWidth, leadingIcon, style = {} }: ButtonProps) {
  const [press, setPress] = useState(false);
  const variants: Record<string, { bg: string; color: string; border: string; shadow: string }> = {
    primary:   { bg: 'var(--brand-primary)', color: '#fff', border: 'none', shadow: '0 4px 14px rgba(255,167,38,0.36)' },
    secondary: { bg: 'transparent', color: 'var(--brand-primary-dark)', border: '1.5px solid var(--brand-primary)', shadow: 'none' },
    tertiary:  { bg: 'var(--gray-100)', color: 'var(--gray-700)', border: 'none', shadow: 'none' },
    danger:    { bg: 'var(--danger)', color: '#fff', border: 'none', shadow: 'none' },
    ghost:     { bg: 'transparent', color: 'var(--brand-primary-dark)', border: 'none', shadow: 'none' },
  };
  const sizes: Record<string, { h: number; px: number; fs: number }> = {
    sm: { h: 36, px: 14, fs: 13 },
    md: { h: 46, px: 18, fs: 15 },
    lg: { h: 56, px: 24, fs: 17 },
  };
  const v = variants[variant];
  const s = sizes[size];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{
        height: s.h, padding: `0 ${s.px}px`, width: fullWidth ? '100%' : undefined,
        background: disabled ? 'var(--gray-200)' : v.bg,
        color: disabled ? 'var(--gray-400)' : v.color,
        border: disabled ? 'none' : v.border,
        borderRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.01em',
        fontSize: `calc(${s.fs}px * var(--font-scale))`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : v.shadow,
        transform: press && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform var(--motion-fast), background var(--motion-fast)',
        ...style,
      }}
    >
      {leadingIcon && <Icon name={leadingIcon} size={size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
}

export function Toast({ toast }: { toast: { msg: string; tone?: string } | null }) {
  if (!toast) return null;
  const tones: Record<string, { bg: string; icon: string }> = {
    success: { bg: 'var(--success)', icon: 'check' },
    info:    { bg: 'var(--gray-800)', icon: 'bell' },
    warning: { bg: 'var(--warning)', icon: 'flame' },
    danger:  { bg: 'var(--danger)', icon: 'x' },
  };
  const tone = tones[toast.tone || 'info'];
  return (
    <div style={{
      position: 'absolute', top: 64, left: '50%', transform: 'translateX(-50%)',
      zIndex: 400, width: 'calc(100% - 32px)', maxWidth: 360,
      background: tone.bg, color: '#fff', borderRadius: 'var(--radius-lg)',
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: 'var(--shadow-lg)', animation: 'toastIn 300ms ease-out',
      fontSize: 'calc(14px * var(--font-scale))', fontWeight: 500,
    }}>
      <Icon name={tone.icon} size={18} />
      <span style={{ flex: 1 }}>{toast.msg}</span>
    </div>
  );
}

export function AppHeader({
  title, subtitle, onBell, onSettings, badge = 0,
}: {
  title: string;
  subtitle?: string;
  onBell?: () => void;
  onSettings?: () => void;
  badge?: number;
}) {
  return (
    <div style={{
      paddingTop: 52, paddingBottom: 10, paddingLeft: 18, paddingRight: 14,
      background: 'var(--surface-1)', position: 'relative', zIndex: 5,
      borderBottom: '1px solid var(--gray-100)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 'calc(21px * var(--font-scale))', fontWeight: 800,
          color: 'var(--gray-900)', letterSpacing: '-0.02em',
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: 8, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 15,
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))',
            boxShadow: '0 3px 8px rgba(255,167,38,0.4)',
          }}>🍱</span>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-500)', marginTop: 3, paddingLeft: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={onBell} aria-label="알림" style={iconBtnStyle}>
          <Icon name="bell" size={22} color="var(--gray-700)" />
          {badge > 0 && <span style={badgeDotStyle} className="tnum">{badge}</span>}
        </button>
        <button onClick={onSettings} aria-label="설정" style={iconBtnStyle}>
          <Icon name="settings" size={22} color="var(--gray-700)" />
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  position: 'relative', width: 40, height: 40, borderRadius: 10, border: 'none',
  background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};
const badgeDotStyle: React.CSSProperties = {
  position: 'absolute', top: 5, right: 5, minWidth: 16, height: 16, padding: '0 4px',
  borderRadius: 9999, background: 'var(--danger)', color: '#fff', fontSize: 10,
  fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1.5px solid var(--surface-1)',
};

const TABS = [
  { id: 'feed',    label: '홈',    icon: 'home' },
  { id: 'explore', label: '탐색',  icon: 'map' },
  { id: 'coupons', label: '쿠폰함', icon: 'ticket' },
  { id: 'noti',    label: '알림',  icon: 'bell' },
  { id: 'my',      label: '마이',  icon: 'user' },
] as const;

export type TabId = typeof TABS[number]['id'];

export function BottomTab({
  active, onChange, couponCount = 0, notiCount = 0,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
  couponCount?: number;
  notiCount?: number;
}) {
  return (
    <div style={{
      flexShrink: 0, height: 60, paddingBottom: 22,
      background: 'var(--surface-1)', borderTop: '1px solid var(--gray-200)',
      display: 'flex', alignItems: 'stretch', position: 'relative', zIndex: 30,
    }}>
      {TABS.map(t => {
        const on = active === t.id;
        const count = t.id === 'coupons' ? couponCount : t.id === 'noti' ? notiCount : 0;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} aria-label={t.label}
            style={{
              flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, paddingTop: 7, position: 'relative',
            }}>
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} size={24}
                color={on ? 'var(--brand-primary-dark)' : 'var(--gray-400)'}
                fill={on ? 'var(--brand-primary-light)' : 'none'}
                strokeWidth={on ? 1.9 : 1.6} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -7, minWidth: 15, height: 15, padding: '0 3px',
                  borderRadius: 9999, background: 'var(--danger)', color: '#fff', fontSize: 9.5,
                  fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid var(--surface-1)',
                }} className="tnum">{count}</span>
              )}
            </div>
            <span style={{
              fontSize: 'calc(11px * var(--font-scale))', fontWeight: on ? 700 : 500,
              color: on ? 'var(--brand-primary-dark)' : 'var(--gray-500)',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
