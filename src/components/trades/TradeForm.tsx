import React, { useState, useEffect } from 'react';
import { Trade } from '../../types';

interface TradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

export function TradeForm({ onSubmit, onCancel }: TradeFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    entryPrice: 0,
    exitPrice: 0,
    position: 'long' as const,
    pnl: 0,
    notes: ''
  });

  // Determine if the trade is profitable based on position and prices
  const isLoss = () => {
    const { entryPrice, exitPrice, position } = formData;
    return position === 'long' 
      ? exitPrice < entryPrice 
      : exitPrice > entryPrice;
  };

  // Update PNL with correct sign when user enters absolute value
  const handlePnLChange = (value: number) => {
    const adjustedPnL = isLoss() ? -Math.abs(value) : Math.abs(value);
    setFormData(prev => ({ ...prev, pnl: adjustedPnL }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trading Pair</label>
          <input
            type="text"
            value={formData.pair}
            onChange={e => setFormData({ ...formData, pair: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="XAUUSD"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <select
            value={formData.position}
            onChange={e => setFormData({ ...formData, position: e.target.value as 'long' | 'short' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Entry Price</label>
          <input
            type="number"
            value={formData.entryPrice}
            onChange={e => setFormData({ ...formData, entryPrice: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Exit Price</label>
          <input
            type="number"
            value={formData.exitPrice}
            onChange={e => setFormData({ ...formData, exitPrice: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">P&L</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={Math.abs(formData.pnl)}
              onChange={e => handlePnLChange(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
              placeholder="Enter P&L value"
            />
            <span className={`text-lg font-semibold ${formData.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formData.pnl >= 0 ? '+' : '-'}
            </span>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
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
  );
}