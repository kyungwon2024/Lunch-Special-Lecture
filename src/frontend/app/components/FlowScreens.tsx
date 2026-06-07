'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { FoodPlaceholder, Button } from './shared';
import { discountPct, won } from '@/lib/data';
import type { Special } from '@/lib/data';

const labelStyle: React.CSSProperties = { fontSize: 'calc(13px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-700)' };
const inputStyle: React.CSSProperties = {
  width: '100%', height: 46, padding: '0 14px', borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--gray-200)', background: 'var(--surface-2)', color: 'var(--gray-900)',
  fontSize: 'calc(15px * var(--font-scale))', fontFamily: 'var(--font-sans)', outline: 'none', fontWeight: 600,
};

interface VerifyScreenProps {
  s: Special;
  onClose: () => void;
  onVerified: () => void;
}

export function VerifyScreen({ s, onClose, onVerified }: VerifyScreenProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('010-1234-5678');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [secs, setSecs] = useState(180);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (step !== 2 || secs <= 0) return;
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [step, secs]);

  const mm = String(Math.floor(secs / 60)).padStart(1, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const filled = code.every(c => c !== '');

  function setDigit(i: number, v: string) {
    v = v.replace(/\D/g, '').slice(-1);
    const next = [...code]; next[i] = v; setCode(next);
    if (v && i < 5) refs[i + 1].current?.focus();
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'var(--surface-0)', display: 'flex', flexDirection: 'column', animation: 'sheetUp 300ms ease-out' }}>
      <div style={{ paddingTop: 52, paddingBottom: 12, paddingLeft: 8, paddingRight: 16, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--gray-100)' }}>
        <button onClick={onClose} aria-label="닫기" style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={24} color="var(--gray-700)" />
        </button>
        <div style={{ fontSize: 'calc(17px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)' }}>본인 인증</div>
      </div>

      <div className="app-scroll" style={{ flex: 1, padding: '24px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="shield" size={36} color="var(--brand-primary-dark)" />
          </div>
          <div style={{ fontSize: 'calc(20px * var(--font-scale))', fontWeight: 800, color: 'var(--gray-900)' }}>쿠폰 발급 전 본인 인증</div>
          <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--gray-500)', marginTop: 6, lineHeight: 1.5 }}>쿠폰 악용 방지를 위해 최초 1회<br/>휴대폰 본인 인증이 필요합니다.</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', marginBottom: 22 }}>
          <div style={{ width: 46, flexShrink: 0 }}><FoodPlaceholder special={s} ratio="1 / 1" rounded={8} label={false} /></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'calc(14px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)' }}>{s.store}</div>
            <div style={{ fontSize: 'calc(13px * var(--font-scale))', color: 'var(--gray-500)' }}>{s.menu} · <span style={{ color: 'var(--brand-primary-dark)', fontWeight: 700 }}>{won(s.sale)}</span></div>
          </div>
        </div>

        <label style={labelStyle}>휴대폰 번호</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Icon name="phone" size={18} color="var(--gray-400)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={phone} onChange={e => setPhone(e.target.value)} disabled={step === 2} inputMode="numeric"
              style={{ ...inputStyle, paddingLeft: 40, opacity: step === 2 ? 0.55 : 1 }} />
          </div>
          {step === 1 && <Button variant="secondary" size="md" onClick={() => { setStep(2); setSecs(180); }}>인증번호 받기</Button>}
        </div>

        {step === 2 && (
          <div style={{ marginTop: 22, animation: 'floatUp 250ms ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={labelStyle}>인증번호 6자리</label>
              <span className="tnum" style={{ fontSize: 'calc(13px * var(--font-scale))', fontWeight: 700, color: secs <= 30 ? 'var(--danger)' : 'var(--brand-primary-dark)' }}>{mm}:{ss}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {code.map((d, i) => (
                <input key={i} ref={refs[i]} value={d} onChange={e => setDigit(i, e.target.value)} inputMode="numeric" maxLength={1}
                  style={{ flex: 1, minWidth: 0, width: 0, height: 54, textAlign: 'center', fontSize: 'calc(22px * var(--font-scale))', fontWeight: 700, color: 'var(--gray-900)', border: d ? '2px solid var(--brand-primary)' : '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-2)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 'calc(12px * var(--font-scale))', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="check" size={14} color="var(--gray-400)" /> 데모: 아무 숫자나 6자리를 입력하세요
            </div>
          </div>
        )}
      </div>

      {step === 2 && (
        <div style={{ flexShrink: 0, padding: '12px 16px 26px', borderTop: '1px solid var(--gray-100)', background: 'var(--surface-1)' }}>
          <Button variant="primary" size="lg" fullWidth disabled={!filled} onClick={onVerified}>인증 완료하고 쿠폰 받기</Button>
        </div>
      )}
    </div>
  );
}

const CONFETTI = ['#FFA726', '#43A047', '#FF5722', '#FFB74D', '#66BB6A', '#1976D2'];

export function CouponCelebration({ s, onDone, enabled }: { s: Special; onDone: () => void; enabled?: boolean }) {
  useEffect(() => {
    const t = setTimeout(onDone, enabled ? 1900 : 600);
    return () => clearTimeout(t);
  }, []);
  const pct = discountPct(s);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 300, background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 200ms ease-out' }}>
      {enabled && Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{
          position: 'absolute', top: '38%', left: `${10 + (i * 6) % 80}%`,
          width: 8, height: 8, borderRadius: i % 2 ? 9999 : 2,
          background: CONFETTI[i % CONFETTI.length],
          animation: `confettiFall ${900 + (i % 5) * 160}ms cubic-bezier(0.3,0.7,0.5,1) ${i * 40}ms both`,
        }} />
      ))}
      <div style={{ position: 'relative', width: 280, background: 'var(--surface-2)', borderRadius: 'var(--radius-xl)', padding: '30px 22px 24px', textAlign: 'center', boxShadow: 'var(--shadow-xl)', animation: 'checkPop 500ms cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 16px' }}>
          {enabled && <span style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'var(--brand-secondary)', opacity: 0.3, animation: 'pulseRing 900ms ease-out infinite' }} />}
          <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 9999, background: 'var(--brand-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(67,160,71,0.45)' }}>
            <Icon name="check" size={42} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontSize: 'calc(20px * var(--font-scale))', fontWeight: 800, color: 'var(--gray-900)' }}>쿠폰 발급 완료!</div>
        <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--gray-500)', marginTop: 6 }}>{s.store} · {won(s.sale)} <span style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>(-{pct}%)</span></div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'calc(13px * var(--font-scale))', fontWeight: 600, color: 'var(--brand-primary-dark)', background: 'var(--brand-primary-light)', padding: '7px 13px', borderRadius: 'var(--radius-full)' }}>
          <Icon name="ticket" size={15} color="var(--brand-primary-dark)" /> 내 쿠폰함으로 이동합니다
        </div>
      </div>
    </div>
  );
}
