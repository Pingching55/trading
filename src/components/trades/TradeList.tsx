import React, { useState } from 'react';
import { Trade } from '../../types';

interface TradeListProps {
  trades: Trade[];
  onUpdateTrade?: (tradeId: string, pnl: number) => void;
}

export function TradeList({ trades, onUpdateTrade }: TradeListProps) {
  const [editingPnL, setEditingPnL] = useState<string | null>(null);
  const [tempPnL, setTempPnL] = useState<number>(0);

  const handlePnLEdit = (trade: Trade) => {
    setEditingPnL(trade.id);
    setTempPnL(trade.pnl);
  };

  const handlePnLSave = (tradeId: string) => {
    if (onUpdateTrade) {
      onUpdateTrade(tradeId, tempPnL);
    }
    setEditingPnL(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trades.map(trade => (
            <tr key={trade.id}>
              <td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{trade.pair}</td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">{trade.position}</td>
              <td className="px-6 py-4 whitespace-nowrap">{trade.entryPrice}</td>
              <td className="px-6 py-4 whitespace-nowrap">{trade.exitPrice}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingPnL === trade.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tempPnL}
                      onChange={(e) => setTempPnL(Number(e.target.value))}
                      className="w-24 px-2 py-1 border rounded"
                      step="0.01"
                    />
                    <button
                      onClick={() => handlePnLSave(trade.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePnLEdit(trade)}
                    className={`${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'} hover:opacity-75`}
                  >
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}