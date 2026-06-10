import { NextResponse } from 'next/server';
import { hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import crypto from 'crypto';

// POST /api/auth/signup
// body: { phone: string, password: string }
export async function POST(req: Request) {
  // Vercel body escaping workaround: strip invalid escape sequences
  const raw = await req.text();
  const cleaned = raw.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
  let phone: string, password: string;
  try {
    ({ phone, password } = JSON.parse(cleaned));
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!phone || !password) {
    return NextResponse.json({ error: 'phone and password required' }, { status: 400 });
  }

  const sb = createServiceClient();

  // phone_hash: SHA-256(phone) for lookup without storing plaintext
  const phoneHash = crypto.createHash('sha256').update(phone).digest('hex');
  const phoneEnc = await hashPassword(phone);
  const passwordHash = await hashPassword(password);

  // upsert 방지: 중복 체크
  const { data: existing } = await sb
    .from('users')
    .select('id')
    .eq('phone_hash', phoneHash)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: '이미 가입된 번호입니다' }, { status: 409 });
  }

  const { data: user, error } = await sb
    .from('users')
    .insert({
      phone_hash: phoneHash,
      phone_enc: passwordHash,  // phone_enc 컬럼에 pw hash 저장 (스키마 활용)
      verified: false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[POST /api/auth/signup]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ userId: user.id }, { status: 201 });
}
