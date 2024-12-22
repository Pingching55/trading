import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { DailyPnL } from '../types';

interface CalendarProps {
  dailyPnL: DailyPnL[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function Calendar({ dailyPnL, selectedDate, onSelectDate }: CalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPnLForDate = (date: Date) => {
    return dailyPnL.find(d => d.date === format(date, 'yyyy-MM-dd'))?.pnl || 0;
  };

  const getPnLColor = (pnl: number) => {
    if (pnl === 0) return 'bg-gray-100';
    return pnl > 0 ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-2xl font-bold mb-4">
        {format(selectedDate, 'MMMM yyyy')}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map(day => {
          const pnl = getPnLForDate(day);
          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`h-16 ${getPnLColor(pnl)} rounded-lg p-2 hover:opacity-75 transition-opacity`}
            >
              <div className="text-sm">{format(day, 'd')}</div>
              {pnl !== 0 && (
                <div className={`text-xs ${pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}