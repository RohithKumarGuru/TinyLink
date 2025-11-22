import './globals.css';

export const metadata = {
  title: 'TinyLink',
  description: 'Simple URL shortener',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <header className="w-full bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="font-semibold text-lg">TinyLink</h1>
            <nav className="text-sm space-x-4">
              <a href="/" className="hover:underline">Dashboard</a>
              <a href="/healthz" className="hover:underline">Health</a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
