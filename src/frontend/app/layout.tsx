import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "점심특강 — 강남 테헤란로 점심 할인 쿠폰",
  description: "강남 테헤란로 직장인을 위한 점심 할인 쿠폰 앱. 반경 500m 점심특선을 한눈에.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, background: '#E9EAEE', minHeight: '100dvh', fontFamily: 'var(--font-sans)' }}>
        {children}
      </body>
    </html>
  );
}
