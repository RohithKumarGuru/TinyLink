import { query } from '@/lib/db';

export default async function CodeStatsPage({ params }) {
  const { code } = params;

  const result = await query(
    'SELECT code, target_url, total_clicks, last_clicked_at FROM links WHERE code = $1',
    [code]
  );

  if (result.rows.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Not found</h2>
        <p className="text-sm text-gray-600">
          No link found for code <strong>{code}</strong>.
        </p>
        <a href="/" className="text-blue-600 hover:underline text-sm">
          Back to dashboard
        </a>
      </div>
    );
  }

  const link = result.rows[0];

  return (
    <div className="space-y-3 bg-white border rounded-md p-4 max-w-2xl mx-auto">
      <h2 className="font-semibold text-lg">Stats for {link.code}</h2>

      <div className="space-y-1 text-sm">
        <p>
          <strong>Target URL: </strong>
          <a
            href={link.target_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {link.target_url}
          </a>
        </p>
        <p>
          <strong>Total clicks: </strong>
          {link.total_clicks}
        </p>
        <p>
          <strong>Last clicked: </strong>
          {link.last_clicked_at ? new Date(link.last_clicked_at).toLocaleString() : 'Never'}
        </p>
        <p>
          <strong>Redirect URL: </strong>
          <code>/{link.code}</code>
        </p>
      </div>

      <a href="/" className="text-blue-600 hover:underline text-sm">
        Back to dashboard
      </a>
    </div>
  );
}
