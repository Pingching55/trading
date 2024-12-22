import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  valueColor?: string;
}

export function StatsCard({ title, value, valueColor = 'text-gray-900' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className={`text-3xl font-bold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}