import React from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';

interface ServiceTableProps {
  services: any[];
  isLoading: boolean;
}

export function ServiceTable({ services, isLoading }: ServiceTableProps) {
  if (isLoading) return <div>Loading...</div>;

  const getStatusVariant = (status: string) => {
    if (status === 'healthy') return 'success';
    if (status === 'degraded') return 'warning';
    return 'error';
  };

  return (
    <Table
      headers={['Service Name', 'Status', 'Description', 'Base URL']}
    >
      {services.map((service) => (
        <tr key={service.id} className="border-b border-slate-700 hover:bg-slate-800">
          <td className="px-6 py-4 font-semibold text-white">{service.name}</td>
          <td className="px-6 py-4">
            <Badge variant={getStatusVariant(service.status)}>{service.status}</Badge>
          </td>
          <td className="px-6 py-4 text-slate-400">{service.description || 'N/A'}</td>
          <td className="px-6 py-4 text-slate-400 text-sm truncate">{service.base_url || 'N/A'}</td>
        </tr>
      ))}
    </Table>
  );
}
