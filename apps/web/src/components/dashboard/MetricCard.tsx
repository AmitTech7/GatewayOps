import React from 'react';
import { Card } from '../ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
}

export function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {trend !== undefined && (
          <div className={`text-xl font-bold ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );
}
