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

  // I-002: DB 오류와 자격증명 불일치를 구분 (인프라 장애를 401로 마스킹하지 않음)
  if (error) {
    console.error('[POST /api/auth/login]', error.message);
    return NextResponse.json({ error: '일시적인 오류로 로그인할 수 없습니다' }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
  }

  // I-004: 비밀번호 bcrypt 해시는 phone_enc(BYTEA) 컬럼에 저장되며, PostgREST가
  // 이를 '\x<hex>' 문자열로 반환하므로 원문 bcrypt 문자열로 복원한 뒤 비교한다.
  // (정석 해법은 password_hash TEXT 컬럼 분리 — migrations/002 참조)
  let storedHash = user.phone_enc as string;
  if (typeof storedHash === 'string' && storedHash.startsWith('\\x')) {
    storedHash = Buffer.from(storedHash.slice(2), 'hex').toString('utf8');
  }

  const ok = await comparePassword(password, storedHash);
  if (!ok) {
    return NextResponse.json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
  }

  const accessToken = generateAccessToken({ sub: user.id, role: user.role ?? 'user', verified: user.verified ?? false });
  const refreshToken = generateRefreshToken(user.id);

  return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
}
