'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  async function loadLinks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch {
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create link');
      } else {
        setUrl('');
        setCode('');
        await loadLinks();
      }
    } catch {
      setError('Failed to create link');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(code) {
    if (!confirm(`Delete link ${code}?`)) return;

    try {
      await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });
      await loadLinks();
    } catch {
      setError('Failed to delete link');
    }
  }

  function filteredLinks() {
    if (!search.trim()) return links;
    const s = search.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(s) ||
        l.target_url.toLowerCase().includes(s)
    );
  }

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-md border p-4 space-y-3">
        <h2 className="font-semibold text-lg">Create short link</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Target URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Custom code (optional, 6-8 chars A-Za-z0-9)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="docs123"
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="px-4 py-1.5 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </form>
      </section>

      <section className="bg-white rounded-md border p-4 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-lg">Links</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code or URL"
            className="border rounded px-2 py-1 w-full sm:w-60"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredLinks().length === 0 ? (
          <p className="text-sm text-gray-500">
            No links yet. Create one above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Short code</th>
                  <th>Target URL</th>
                  <th>Total clicks</th>
                  <th>Last clicked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks().map((link) => (
                  <tr key={link.code}>
                    <td>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/${link.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link.code}
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${baseUrl}/${link.code}`
                            )
                          }
                          className="text-xs px-2 py-0.5 border rounded"
                        >
                          Copy
                        </button>
                      </div>
                      <a
                        href={`/code/${link.code}`}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Stats
                      </a>
                    </td>
                    <td style={{ maxWidth: '260px' }}>
                      <span
                        title={link.target_url}
                        style={{
                          display: 'inline-block',
                          maxWidth: '260px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {link.target_url}
                      </span>
                    </td>
                    <td>{link.total_clicks}</td>
                    <td>
                      {link.last_clicked_at
                        ? new Date(link.last_clicked_at).toLocaleString()
                        : 'Never'}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(link.code)}
                        className="text-sm px-2 py-0.5 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
