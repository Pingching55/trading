import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyPnL } from '../../types';

interface BalanceChartProps {
  dailyPnL: DailyPnL[];
}

export function BalanceChart({ dailyPnL }: BalanceChartProps) {
  const data = dailyPnL.reduce((acc: { date: string; balance: number }[], curr) => {
    const prevBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    return [...acc, { date: curr.date, balance: prevBalance + curr.pnl }];
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Account Balance</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}