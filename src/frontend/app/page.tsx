import App from "./components/App";

export default function Page() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      padding: '24px 16px',
      background: 'radial-gradient(circle at 20% 15%, rgba(255,167,38,0.10), transparent 42%), radial-gradient(circle at 85% 80%, rgba(67,160,71,0.08), transparent 45%), #E9EAEE',
    }}>
      <div style={{
        width: 402,
        height: 874,
        borderRadius: 48,
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.12)',
        position: 'relative',
        background: '#000',
        flexShrink: 0,
      }}>
        {/* status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 100,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 24px 6px', pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111', fontFamily: 'var(--font-sans)' }}>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="3" width="3" height="9" rx="1" fill="#111" opacity="0.35"/>
              <rect x="4.5" y="2" width="3" height="10" rx="1" fill="#111" opacity="0.55"/>
              <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#111" opacity="0.75"/>
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="#111">
              <path d="M8 2.4C10.5 2.4 12.7 3.4 14.3 5L15.7 3.6C13.7 1.7 11 0.5 8 0.5C5 0.5 2.3 1.7 0.3 3.6L1.7 5C3.3 3.4 5.5 2.4 8 2.4Z"/>
              <path d="M8 5.2C9.7 5.2 11.2 5.9 12.3 7L13.7 5.6C12.2 4.2 10.2 3.3 8 3.3C5.8 3.3 3.8 4.2 2.3 5.6L3.7 7C4.8 5.9 6.3 5.2 8 5.2Z"/>
              <circle cx="8" cy="10" r="2"/>
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#111" strokeOpacity="0.35"/>
              <rect x="2" y="2" width="18" height="8" rx="2" fill="#111"/>
              <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="#111" opacity="0.4"/>
            </svg>
          </div>
        </div>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 20, background: '#000', zIndex: 101,
          pointerEvents: 'none',
        }} />
        <App />
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 9999, background: 'rgba(0,0,0,0.22)', zIndex: 102,
          pointerEvents: 'none',
        }} />
      </div>
    </main>
  );
}
