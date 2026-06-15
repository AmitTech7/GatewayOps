import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface ServiceDistributionChartProps {
  data: any[];
  isLoading: boolean;
}

export function ServiceDistributionChart({ data, isLoading }: ServiceDistributionChartProps) {
  if (isLoading) return <Spinner />;

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">Service Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="request_count" nameKey="service" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
