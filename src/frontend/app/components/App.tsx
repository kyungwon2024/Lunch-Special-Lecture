'use client';

import { useState, useMemo } from 'react';
import { SPECIALS, PRESET_COUPONS, discountPct } from '@/lib/data';
import type { Special, Coupon } from '@/lib/data';
import FeedScreen from './FeedScreen';
import DetailScreen from './DetailScreen';
import { VerifyScreen, CouponCelebration } from './FlowScreens';
import { CouponsScreen, QRScreen, RedeemFlash } from './CouponScreens';
import { ExploreScreen, NotiScreen, MyScreen } from './MiscScreens';
import { BottomTab, Toast } from './shared';
import type { TabId } from './shared';

type CardLayout = 'standard' | 'compact' | 'magazine';

interface Tweaks {
  cardLayout: string;
  fontScale: number;
  dark: boolean;
  push: boolean;
  celebration: boolean;
}

const LAYOUT_KEY: Record<string, CardLayout> = { '표준': 'standard', '컴팩트': 'compact', '매거진': 'magazine' };

export default function App() {
  const [tweaks, setTweaks] = useState<Tweaks>({ cardLayout: '표준', fontScale: 1, dark: false, push: true, celebration: true });
  const setTweak = (k: keyof Tweaks, v: boolean | number | string) => setTweaks(t => ({ ...t, [k]: v }));

  const [tab, setTab] = useState<TabId>('feed');
  const [sort, setSort] = useState('거리순');
  const [coupons, setCoupons] = useState<Coupon[]>(PRESET_COUPONS);
  const [verified, setVerified] = useState(false);

  const [detail, setDetail] = useState<Special | null>(null);
  const [verify, setVerify] = useState<Special | null>(null);
  const [celebrate, setCelebrate] = useState<Special | null>(null);
  const [qr, setQR] = useState<Coupon | null>(null);
  const [redeem, setRedeem] = useState<Special | null>(null);
  const [toast, setToast] = useState<{ msg: string; tone?: string } | null>(null);

  const getSpecial = (id: string) => SPECIALS.find(s => s.id === id);
  const availCount = coupons.filter(c => c.status === 'available').length;
  const notiCount = 2;

  function showToast(msg: string, tone = 'info') {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2600);
  }

  const sortedSpecials = useMemo(() => {
    const arr = [...SPECIALS];
    if (sort === '거리순') arr.sort((a, b) => a.dist - b.dist);
    else if (sort === '할인율순') arr.sort((a, b) => discountPct(b) - discountPct(a));
    else if (sort === '인기순') arr.sort((a, b) => b.rating - a.rating);
    else if (sort === '즉시입장') arr.sort((a, b) => parseInt(a.prep) - parseInt(b.prep));
    return arr;
  }, [sort]);

  function handleGetCoupon(s: Special) {
    if (!verified) { setVerify(s); return; }
    issueCoupon(s);
  }
  function handleVerified() {
    const s = verify;
    setVerified(true);
    setVerify(null);
    if (s) issueCoupon(s);
  }
  function issueCoupon(s: Special) {
    setDetail(null);
    setCelebrate(s);
  }
  function handleCelebrateDone() {
    const s = celebrate;
    if (s) {
      const newCp: Coupon = { id: 'cp-' + Date.now(), specialId: s.id, status: 'available', issuedAt: '방금', expireIn: 168 };
      setCoupons(prev => [newCp, ...prev]);
    }
    setCelebrate(null);
    setTab('coupons');
  }
  function handleRedeemed() {
    if (!qr) return;
    const sp = getSpecial(qr.specialId);
    if (sp) setRedeem(sp);
    setQR(null);
  }
  function handleRedeemDone() {
    const sp = redeem;
    if (sp) {
      setCoupons(prev => prev.map(c => (c.specialId === sp.id && c.status === 'available') ? { ...c, status: 'used', usedAt: '방금' } : c));
    }
    setRedeem(null);
    showToast('쿠폰을 사용했어요. 맛있게 드세요!', 'success');
  }

  const cardLayout = LAYOUT_KEY[tweaks.cardLayout] || 'standard';

  return (
    <div
      className="app-screen"
      data-theme={tweaks.dark ? 'dark' : 'light'}
      style={{ '--font-scale': tweaks.fontScale } as React.CSSProperties}
    >
      <div style={{ position: 'absolute', inset: 0, bottom: 82, overflow: 'hidden' }}>
        {tab === 'feed' && (
          <FeedScreen specials={sortedSpecials} cardLayout={cardLayout} sort={sort} onSort={setSort}
            onTapSpecial={setDetail} onBell={() => setTab('noti')} onSettings={() => setTab('my')} notiCount={notiCount} />
        )}
        {tab === 'explore' && (
          <ExploreScreen specials={sortedSpecials} onTapSpecial={setDetail}
            onBell={() => setTab('noti')} onSettings={() => setTab('my')} notiCount={notiCount} />
        )}
        {tab === 'coupons' && (
          <CouponsScreen coupons={coupons} getSpecial={(id) => getSpecial(id)!} onShowQR={setQR}
            onBrowse={() => setTab('feed')} onBell={() => setTab('noti')} onSettings={() => setTab('my')} notiCount={notiCount} />
        )}
        {tab === 'noti' && <NotiScreen onBell={() => {}} onSettings={() => setTab('my')} />}
        {tab === 'my' && <MyScreen tweaks={tweaks} setTweak={setTweak} onBell={() => setTab('noti')} onSettings={() => {}} couponCount={availCount} />}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 35 }}>
        <BottomTab active={tab} onChange={setTab} couponCount={availCount} notiCount={notiCount} />
      </div>

      {detail && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'screenIn 300ms ease-out' }}>
          <DetailScreen s={detail} onBack={() => setDetail(null)} onGetCoupon={handleGetCoupon}
            soldOut={detail.status === 'closed' || detail.remain <= 0} />
        </div>
      )}
      {verify && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 42 }}>
          <VerifyScreen s={verify} onClose={() => setVerify(null)} onVerified={handleVerified} />
        </div>
      )}
      {celebrate && <CouponCelebration s={celebrate} enabled={tweaks.celebration} onDone={handleCelebrateDone} />}
      {qr && (() => {
        const sp = getSpecial(qr.specialId);
        return sp ? (
          <div style={{ position: 'absolute', inset: 0, zIndex: 44 }}>
            <QRScreen cp={qr} special={sp} onClose={() => setQR(null)} onRedeemed={handleRedeemed} />
          </div>
        ) : null;
      })()}
      {redeem && <RedeemFlash special={redeem} enabled={tweaks.celebration} onDone={handleRedeemDone} />}

      <Toast toast={toast} />
    </div>
  );
}
