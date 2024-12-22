import React from 'react';
import { CalendarDay } from './CalendarDay';
import { getMonthDays, formatMonthYear, formatDate } from '../../utils/date';
import { DailyPnL } from '../../types';

interface CalendarProps {
  dailyPnL: DailyPnL[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function Calendar({ dailyPnL, selectedDate, onSelectDate }: CalendarProps) {
  const days = getMonthDays(selectedDate);

  const getPnLForDate = (date: Date) => {
    return dailyPnL.find(d => d.date === formatDate(date))?.pnl || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-2xl font-bold mb-4">
        {formatMonthYear(selectedDate)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map(day => (
          <CalendarDay
            key={day.toString()}
            date={day}
            pnl={getPnLForDate(day)}
            onClick={() => onSelectDate(day)}
          />
        ))}
      </div>
    </div>
  );
}