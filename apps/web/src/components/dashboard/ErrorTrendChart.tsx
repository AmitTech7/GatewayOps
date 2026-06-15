import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface ErrorTrendChartProps {
  data: any[];
  isLoading: boolean;
}

export function ErrorTrendChart({ data, isLoading }: ErrorTrendChartProps) {
  if (isLoading) return <Spinner />;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">Error Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#475569" />
          <XAxis stroke="#94a3b8" dataKey="timestamp" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px' }} />
          <Legend />
          <Area type="monotone" dataKey="value" fill="#ef4444" stroke="#dc2626" name="Errors" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
