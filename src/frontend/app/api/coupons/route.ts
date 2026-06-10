import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { verifyAccessToken } from '@/lib/auth';

// GET /api/coupons — 로그인 사용자의 쿠폰 목록
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let payload: { sub: string };
  try {
    payload = verifyAccessToken(token) as { sub: string };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const sb = createServiceClient();
  const { data, error } = await sb
    .from('coupons')
    .select(`
      id,
      status,
      issued_at,
      used_at,
      expires_at,
      lunch_special:lunch_specials (
        id,
        menu_name,
        discount_price,
        normal_price,
        discount_rate,
        store:stores ( id, name, categories )
      )
    `)
    .eq('user_id', payload.sub)
    .order('issued_at', { ascending: false });

  if (error) {
    console.error('[GET /api/coupons]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/coupons — 쿠폰 발급
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let payload: { sub: string };
  try {
    payload = verifyAccessToken(token) as { sub: string };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { specialId } = await req.json();
  if (!specialId) return NextResponse.json({ error: 'specialId required' }, { status: 400 });

  const sb = createServiceClient();

  // 특선 잔여 수량 확인
  const { data: special, error: spErr } = await sb
    .from('lunch_specials')
    .select('id, total_quantity, status, expires_at')
    .eq('id', specialId)
    .single();

  if (spErr || !special) return NextResponse.json({ error: '특선을 찾을 수 없습니다' }, { status: 404 });
  if (special.status !== 'PUBLISHED') return NextResponse.json({ error: '이미 마감된 특선입니다' }, { status: 409 });
  if (new Date(special.expires_at) < new Date()) return NextResponse.json({ error: '만료된 특선입니다' }, { status: 409 });

  // 이미 발급 여부 확인
  const { data: existing } = await sb
    .from('coupons')
    .select('id')
    .eq('user_id', payload.sub)
    .eq('lunch_special_id', specialId)
    .eq('status', 'ISSUED')
    .maybeSingle();

  if (existing) return NextResponse.json({ error: '이미 발급된 쿠폰입니다' }, { status: 409 });

  // 발급 (expires_at = 특선 만료 + 7일)
  const expiresAt = new Date(special.expires_at);
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: coupon, error: cpErr } = await sb
    .from('coupons')
    .insert({
      user_id: payload.sub,
      lunch_special_id: specialId,
      status: 'ISSUED',
      issued_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select('id, status, issued_at, expires_at')
    .single();

  if (cpErr) {
    console.error('[POST /api/coupons]', cpErr.message);
    return NextResponse.json({ error: cpErr.message }, { status: 500 });
  }

  return NextResponse.json(coupon, { status: 201 });
}
