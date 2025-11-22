import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_req, ctx) {
  const { code } = await ctx.params;

  if (!code) {
    return new NextResponse('Not found', { status: 404 });
  }

  const trimmedCode = code.trim();


  const result = await query(
    `SELECT target_url FROM links WHERE code = '${trimmedCode}'`
  );

  if (result.rows.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  const target = result.rows[0].target_url;


  await query(
    `UPDATE links SET total_clicks = total_clicks + 1, last_clicked_at = NOW() WHERE code = '${trimmedCode}'`
  );

  return NextResponse.redirect(target, 302);
}