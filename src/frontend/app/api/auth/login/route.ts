import { NextResponse } from 'next/server';
import { comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';
import crypto from 'crypto';

// POST /api/auth/login
// body: { phone: string, password: string }
export async function POST(req: Request) {
  // Vercel body escaping workaround
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
  const phoneHash = crypto.createHash('sha256').update(phone).digest('hex');

  const { data: user, error } = await sb
    .from('users')
    .select('id, phone_enc, role, verified')
    .eq('phone_hash', phoneHash)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
  }

  const ok = await comparePassword(password, user.phone_enc);
  if (!ok) {
    return NextResponse.json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
  }

  const accessToken = generateAccessToken({ sub: user.id, role: user.role ?? 'user', verified: user.verified ?? false });
  const refreshToken = generateRefreshToken(user.id);

  return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
}
