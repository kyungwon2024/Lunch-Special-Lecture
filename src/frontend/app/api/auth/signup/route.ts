import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

/**
 * POST /api/auth/signup
 * Request body: { phone: string, password: string }
 * Creates a new user record.
 */
export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ error: 'phone and password required' }, { status: 400 });
    }

    const phoneHash = phone; // store plain phone as hash for lookup
    const passwordHash = await hashPassword(password);
    const insertText = `
      INSERT INTO users (phone_hash, phone_enc, verified)
      VALUES ($1, $2, false)
      RETURNING id;
    `;
    const result = await query(insertText, [phoneHash, passwordHash]);
    const userId = result.rows[0].id;

    return NextResponse.json({ userId }, { status: 201 });
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
