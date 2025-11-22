import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const result = await query(
    'SELECT code, target_url, total_clicks, last_clicked_at FROM links ORDER BY code ASC'
  );
  return NextResponse.json(result.rows);
}

export async function POST(request) {
  const body = await request.json();
  const { url, code } = body;

  if (!url || !isValidUrl(url)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let finalCode = code?.trim();

  if (finalCode) {
    if (!CODE_REGEX.test(finalCode)) {
      return NextResponse.json({ error: 'Code must match [A-Za-z0-9]{6,8}' }, { status: 400 });
    }
  } else {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = 6;
    finalCode = '';
    for (let i = 0; i < len; i++) {
      finalCode += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  try {
    await query(
      'INSERT INTO links (code, target_url) VALUES ($1, $2)',
      [finalCode, url]
    );
  } catch (e) {
    return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
  }

  const base = process.env.BASE_URL ?? '';
  return NextResponse.json({
    code: finalCode,
    target_url: url,
    short_url: `${base}/${finalCode}`,
  });
}
