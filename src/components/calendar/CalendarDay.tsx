import React from 'react';
import { format } from 'date-fns';

interface CalendarDayProps {
  date: Date;
  pnl: number;
  onClick: () => void;
}

export function CalendarDay({ date, pnl, onClick }: CalendarDayProps) {
  const getPnLColor = (pnl: number) => {
    if (pnl === 0) return 'bg-gray-100';
    return pnl > 0 ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <button
      onClick={onClick}
      className={`h-16 ${getPnLColor(pnl)} rounded-lg p-2 hover:opacity-75 transition-opacity`}
    >
      <div className="text-sm">{format(date, 'd')}</div>
      {pnl !== 0 && (
        <div className={`text-xs ${pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
        </div>
      )}
    </button>
  );
}