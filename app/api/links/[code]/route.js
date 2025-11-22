import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/links/:code -> JSON stats
export async function GET(_req, ctx) {
  const { code } = await ctx.params;
  const trimmedCode = code.trim();

  const result = await query(
    `SELECT code, target_url, total_clicks, last_clicked_at FROM links WHERE code = '${trimmedCode}'`
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// DELETE /api/links/:code -> delete link
export async function DELETE(_req, ctx) {
  const { code } = await ctx.params;
  const trimmedCode = code.trim();

  // RETURNING tells us if anything was actually deleted
  const result = await query(
    `DELETE FROM links WHERE code = '${trimmedCode}' RETURNING code`
  );

  if (result.rowCount === 0) {
    // No row matched this code
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
