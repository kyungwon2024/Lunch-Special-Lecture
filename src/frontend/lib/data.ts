export type CategoryKey = 'korean' | 'bunsik' | 'cafe' | 'western' | 'chinese' | 'japanese' | 'healthy';
export type SpecialStatus = 'open' | 'closing' | 'closed';
export type CouponStatus = 'available' | 'used' | 'expired';

export interface Category {
  label: string;
  emoji: string;
  hue: number;
}

export interface Special {
  id: string;
  store: string;
  cat: CategoryKey;
  rating: number;
  dist: number;
  menu: string;
  price: number;
  sale: number;
  remain: number;
  total: number;
  status: SpecialStatus;
  prep: string;
  solo: boolean;
  expire: string;
  addr: string;
  desc: string;
  promo?: boolean;
}

export interface Coupon {
  id: string;
  specialId: string;
  status: CouponStatus;
  issuedAt?: string;
  expireIn?: number;
  usedAt?: string;
  expiredAt?: string;
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  korean:   { label: '한식',   emoji: '🍚', hue: 28  },
  bunsik:   { label: '분식',   emoji: '🍜', hue: 8   },
  cafe:     { label: '카페',   emoji: '☕', hue: 35  },
  western:  { label: '양식',   emoji: '🍝', hue: 45  },
  chinese:  { label: '중식',   emoji: '🥟', hue: 14  },
  japanese: { label: '일식',   emoji: '🍱', hue: 200 },
  healthy:  { label: '건강식', emoji: '🥗', hue: 130 },
};

export const SPECIALS: Special[] = [
  {
    id: 'sp01', store: '진고개 한식당', cat: 'korean', rating: 4.8, dist: 0.1,
    menu: '제육볶음 쌈밥정식', price: 10000, sale: 7500,
    remain: 8, total: 30, status: 'open', prep: '15-25분', solo: true,
    expire: '14:00', addr: '서울 강남구 테헤란로 124',
    desc: '국산 한돈 + 유기농 쌈채소. 매일 아침 직접 담그는 강된장과 함께 드세요.',
    promo: true,
  },
  {
    id: 'sp02', store: '동백분식', cat: 'bunsik', rating: 4.6, dist: 0.2,
    menu: '김치제육 + 라면 세트', price: 8000, sale: 5900,
    remain: 12, total: 40, status: 'open', prep: '10-15분', solo: true,
    expire: '14:30', addr: '서울 강남구 역삼로 92',
    desc: '얼큰한 김치제육에 라면 사리까지. 혼밥러를 위한 1인 세트 구성입니다.',
  },
  {
    id: 'sp03', store: '그린보울', cat: 'healthy', rating: 4.9, dist: 0.3,
    menu: '닭가슴살 포케볼', price: 11000, sale: 8800,
    remain: 4, total: 20, status: 'closing', prep: '5-10분', solo: true,
    expire: '13:30', addr: '서울 강남구 봉은사로 318',
    desc: '저염 소스 · 단백질 32g. 점심 후 나른함 없는 가벼운 한 끼.',
  },
  {
    id: 'sp04', store: '미도리 라멘', cat: 'japanese', rating: 4.7, dist: 0.4,
    menu: '차슈 돈코츠 라멘', price: 12000, sale: 9600,
    remain: 6, total: 25, status: 'open', prep: '15-20분', solo: true,
    expire: '14:00', addr: '서울 강남구 선릉로 428',
    desc: '18시간 끓인 진한 돈코츠 육수와 직화 차슈 3장.',
  },
  {
    id: 'sp05', store: '파스타공방', cat: 'western', rating: 4.5, dist: 0.5,
    menu: '트러플 크림 파스타', price: 14000, sale: 9800,
    remain: 4, total: 18, status: 'open', prep: '20-25분', solo: false,
    expire: '14:00', addr: '서울 강남구 테헤란로 211',
    desc: '블랙 트러플 오일을 더한 생크림 파스타. 마늘빵 1조각 포함.',
  },
  {
    id: 'sp06', store: '황금성', cat: 'chinese', rating: 4.4, dist: 0.6,
    menu: '짜장 + 미니탕수육', price: 11000, sale: 7700,
    remain: 9, total: 35, status: 'open', prep: '15-20분', solo: true,
    expire: '14:30', addr: '서울 강남구 강남대로 358',
    desc: '춘장을 직접 볶아 만든 옛날식 짜장과 바삭한 미니 탕수육 구성.',
  },
  {
    id: 'sp07', store: '본죽 삼계', cat: 'korean', rating: 4.6, dist: 0.3,
    menu: '전복 삼계죽', price: 13000, sale: 9750,
    remain: 7, total: 24, status: 'open', prep: '10-15분', solo: true,
    expire: '14:00', addr: '서울 강남구 역삼로 145',
    desc: '국산 전복과 찹쌀로 끓인 보양 죽. 속이 편한 점심을 찾는 분께.',
  },
  {
    id: 'sp08', store: '버거랩', cat: 'western', rating: 4.3, dist: 0.7,
    menu: '더블 치즈버거 세트', price: 9900, sale: 6900,
    remain: 3, total: 22, status: 'closing', prep: '10-15분', solo: true,
    expire: '13:30', addr: '서울 강남구 테헤란로 87',
    desc: '100% 순쇠고기 패티 2장 + 감자튀김 + 콜라. 빠른 픽업 가능.',
  },
];

export const STATUS_META: Record<SpecialStatus, { label: string; token: 'success' | 'warning' | 'gray' }> = {
  open:    { label: '영업중', token: 'success' },
  closing: { label: '곧 마감', token: 'warning' },
  closed:  { label: '마감',   token: 'gray'    },
};

export const PRESET_COUPONS: Coupon[] = [
  { id: 'cp-pre1', specialId: 'sp07', status: 'available', issuedAt: '오늘 11:20', expireIn: 142 },
  { id: 'cp-pre2', specialId: 'sp04', status: 'used',      usedAt: '어제 12:34' },
  { id: 'cp-pre3', specialId: 'sp02', status: 'expired',   expiredAt: '5/29 만료' },
];

export function discountPct(s: Special): number {
  return Math.round((1 - s.sale / s.price) * 100);
}

export function won(n: number): string {
  return '₩' + n.toLocaleString('ko-KR');
}
