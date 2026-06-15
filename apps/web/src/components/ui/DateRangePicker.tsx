import React from 'react';

interface DateRangePickerProps {
  from: string;
  to: string;
  onRangeChange: (from: string, to: string) => void;
}

export function DateRangePicker({ from, to, onRangeChange }: DateRangePickerProps) {
  return (
    <div className="flex gap-4">
      <input
        type="datetime-local"
        value={from}
        onChange={(e) => onRangeChange(e.target.value, to)}
        className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
      />
      <input
        type="datetime-local"
        value={to}
        onChange={(e) => onRangeChange(from, e.target.value)}
        className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
      />
    </div>
  );
}
