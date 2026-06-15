import React from 'react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 p-6">
      <nav className="space-y-4">
        <Link href="/" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300">
          Dashboard
        </Link>
        <Link href="/services" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300">
          Services
        </Link>
        <Link href="/logs" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300">
          API Logs
        </Link>
        <Link href="/rate-limits" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300">
          Rate Limits
        </Link>
        <Link href="/auth-stats" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300">
          Auth Stats
        </Link>
      </nav>
    </aside>
  );
}
