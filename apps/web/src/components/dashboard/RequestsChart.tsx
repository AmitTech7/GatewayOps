import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface RequestsChartProps {
  data: any[];
  isLoading: boolean;
}

export function RequestsChart({ data, isLoading }: RequestsChartProps) {
  if (isLoading) return <Spinner />;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">Requests Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#475569" />
          <XAxis stroke="#94a3b8" dataKey="timestamp" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px' }} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Requests" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
