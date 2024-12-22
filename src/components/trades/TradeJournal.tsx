import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Trade } from '../../types';
import { TradeForm } from './TradeForm';
import { TradeList } from './TradeList';
import { useAuth } from '../../context/AuthContext';

interface TradeJournalProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id' | 'userId'>) => void;
  onUpdateTrade?: (tradeId: string, pnl: number) => void;
}

export function TradeJournal({ trades, onAddTrade, onUpdateTrade }: TradeJournalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { user, updateUser } = useAuth();

  const handleAddTrade = async (trade: Omit<Trade, 'id' | 'userId'>) => {
    if (!user?.selectedAccountId) return;

    // Update account balance
    const selectedAccount = user.accounts.find(acc => acc.id === user.selectedAccountId);
    if (selectedAccount) {
      const updatedAccounts = user.accounts.map(acc => {
        if (acc.id === user.selectedAccountId) {
          return {
            ...acc,
            balance: acc.balance + trade.pnl
          };
        }
        return acc;
      });

      // Update user's accounts with new balance
      await updateUser({ accounts: updatedAccounts });
    }

    // Add the trade with the current account ID
    onAddTrade({
      ...trade,
      accountId: user.selectedAccountId
    });
    setIsAdding(false);
  };

  // Filter trades for current account
  const accountTrades = trades.filter(trade => trade.accountId === user?.selectedAccountId);

  // Get current account info
  const currentAccount = user?.accounts.find(acc => acc.id === user?.selectedAccountId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Trade Journal</h2>
          {currentAccount && (
            <p className="text-sm text-gray-600 mt-1">
              Account Balance: {currentAccount.currency}
              {currentAccount.balance.toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add Trade
        </button>
      </div>

      {isAdding && (
        <div className="mb-6">
          <TradeForm
            onSubmit={handleAddTrade}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      <TradeList trades={accountTrades} onUpdateTrade={onUpdateTrade} />
    </div>
  );
}