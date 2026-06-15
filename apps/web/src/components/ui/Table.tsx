import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-3 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
