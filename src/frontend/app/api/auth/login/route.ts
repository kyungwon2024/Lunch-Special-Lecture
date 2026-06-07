import { NextResponse } from 'next/server';
import { comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { query } from '@/lib/db';

/**
 * POST /api/auth/login
 * Request body: { phone: string, password: string }
 * Returns JWT access and refresh tokens.
 */
export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ error: 'phone and password required' }, { status: 400 });
    }

    // Find user by phone (stored as phone_hash) and verify password
    const userRes = await query(
      `SELECT id, phone_enc FROM users WHERE phone_hash = $1 LIMIT 1`,
      [phone]
    );
    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const user = userRes.rows[0];
    const passwordMatches = await comparePassword(password, user.phone_enc);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = generateAccessToken({ sub: user.id, role: 'user', verified: false });
    const refreshToken = generateRefreshToken(user.id);
    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
