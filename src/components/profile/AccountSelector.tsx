import React from 'react';
import { TradingAccount } from '../../types';

interface AccountSelectorProps {
  accounts: TradingAccount[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
}

export function AccountSelector({ accounts, selectedAccountId, onSelectAccount }: AccountSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Trading Accounts</h3>
      <div className="grid gap-4">
        {accounts.map(account => (
          <button
            key={account.id}
            onClick={() => onSelectAccount(account.id)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              account.id === selectedAccountId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">{account.name}</h4>
                <p className="text-sm text-gray-500">
                  Balance: {account.currency}{account.balance.toLocaleString()}
                </p>
              </div>
              {account.id === selectedAccountId && (
                <span className="text-blue-500 text-sm font-medium">Active</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}