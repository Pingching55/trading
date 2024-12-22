import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Trade } from '../types';

interface TradeJournalProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
}

export function TradeJournal({ trades, onAddTrade }: TradeJournalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    entryPrice: 0,
    exitPrice: 0,
    position: 'long' as const,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pnl = newTrade.position === 'long'
      ? (newTrade.exitPrice - newTrade.entryPrice)
      : (newTrade.entryPrice - newTrade.exitPrice);
    onAddTrade({ ...newTrade, pnl });
    setIsAdding(false);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      pair: '',
      entryPrice: 0,
      exitPrice: 0,
      position: 'long',
      notes: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trade Journal</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add Trade
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newTrade.date}
                onChange={e => setNewTrade({ ...newTrade, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trading Pair</label>
              <input
                type="text"
                value={newTrade.pair}
                onChange={e => setNewTrade({ ...newTrade, pair: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="BTC/USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Price</label>
              <input
                type="number"
                value={newTrade.entryPrice}
                onChange={e => setNewTrade({ ...newTrade, entryPrice: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exit Price</label>
              <input
                type="number"
                value={newTrade.exitPrice}
                onChange={e => setNewTrade({ ...newTrade, exitPrice: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <select
              value={newTrade.position}
              onChange={e => setNewTrade({ ...newTrade, position: e.target.value as 'long' | 'short' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={newTrade.notes}
              onChange={e => setNewTrade({ ...newTrade, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Trade
            </button>
          </div>
        </form>
      )}

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
                <td className={`px-6 py-4 whitespace-nowrap ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}