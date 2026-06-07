import Image from 'next/image';
import styles from './page.module.css';

/**
 * 점심특강 전체 화면 페이지
 * 디자인은 클로드가 제공한 "점심특강 전체화면.html"을 기반으로 하였습니다.
 * 현재 디자인 파일을 직접 확인할 수 없으므로, 현대적인 풀스크린 레이아웃을 구현했습니다.
 * - 그라디언트 배경
 * - Glassmorphism 카드 UI
 * - 반응형 레이아웃 (mobile, tablet, desktop)
 */
export default function LunchSpecialFullScreen() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>점심특강</h1>
      </header>
      <section className={styles.hero}>
        {/* Placeholder image – replace with actual hero image later */}
        <Image
          src="/placeholder-hero.jpg"
          alt="점심특강 메인 이미지"
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay}>
          <h2 className={styles.heroText}>오늘의 특별한 점심, 지금 예약하세요!</h2>
        </div>
      </section>
      <section className={styles.content}>
        {/* Example list of specials – replace with real data from API */}
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.card}>
              <h3 className={styles.cardTitle}>특강 #{i}</h3>
              <p className={styles.cardDesc}>간단한 설명 텍스트를 여기에 넣으세요.</p>
              <button className={styles.cardBtn}>예약하기</button>
            </div>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <p>© 2026 Lunch Special Lecture. All rights reserved.</p>
      </footer>
    </main>
  );
}
