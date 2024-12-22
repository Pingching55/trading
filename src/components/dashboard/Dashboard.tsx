import React from 'react';
import { BalanceChart } from '../charts/BalanceChart';
import { StatsCard } from './StatsCard';
import { DailyPnL } from '../../types';

interface DashboardProps {
  dailyPnL: DailyPnL[];
}

export function Dashboard({ dailyPnL }: DashboardProps) {
  const totalPnL = dailyPnL.reduce((sum, day) => sum + day.pnl, 0);
  const winningDays = dailyPnL.filter(day => day.pnl > 0).length;
  const totalDays = dailyPnL.length;
  const winRate = totalDays > 0 ? (winningDays / totalDays) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total P&L"
          value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}`}
          valueColor={totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <StatsCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          valueColor="text-blue-600"
        />
        <StatsCard
          title="Total Trades"
          value={totalDays}
        />
      </div>
      <BalanceChart dailyPnL={dailyPnL} />
    </div>
  );
}