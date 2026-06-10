import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// GET /api/specials — 오늘 PUBLISHED 상태인 점심특선 목록
export async function GET() {
  const sb = createServiceClient();

  const { data, error } = await sb
    .from('lunch_specials')
    .select(`
      id,
      menu_name,
      description,
      normal_price,
      discount_price,
      discount_rate,
      total_quantity,
      expires_at,
      status,
      store:stores (
        id,
        name,
        categories,
        address,
        location,
        status
      )
    `)
    .eq('status', 'PUBLISHED')
    .order('discount_rate', { ascending: false });

  if (error) {
    console.error('[GET /api/specials]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
