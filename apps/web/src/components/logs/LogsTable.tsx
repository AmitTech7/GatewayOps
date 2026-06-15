import React from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';

interface LogsTableProps {
  logs: any[];
  isLoading: boolean;
}

export function LogsTable({ logs, isLoading }: LogsTableProps) {
  if (isLoading) return <div>Loading...</div>;

  const getStatusVariant = (code: number) => {
    if (code < 300) return 'success';
    if (code < 400) return 'info';
    if (code < 500) return 'warning';
    return 'error';
  };

  return (
    <Table
      headers={['Timestamp', 'Service', 'Method', 'Endpoint', 'Status', 'Latency (ms)']}
    >
      {logs.map((log) => (
        <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-800">
          <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
          <td className="px-6 py-4">{log.service_name || 'Unknown'}</td>
          <td className="px-6 py-4 font-mono text-sm">{log.method}</td>
          <td className="px-6 py-4 text-sm truncate">{log.endpoint}</td>
          <td className="px-6 py-4">
            <Badge variant={getStatusVariant(log.status_code)}>{log.status_code}</Badge>
          </td>
          <td className="px-6 py-4">{log.latency_ms}ms</td>
        </tr>
      ))}
    </Table>
  );
}
