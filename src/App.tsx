import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/layout/Navigation';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { Calendar } from './components/calendar/Calendar';
import { TradeJournal } from './components/trades/TradeJournal';
import { AccountDetails } from './components/profile/AccountDetails';
import { Trade } from './types';

function MainApp() {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleAddTrade = (trade: Omit<Trade, 'id' | 'userId'>) => {
    const newTrade: Trade = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || '1',
    };
    setTrades(prev => [...prev, newTrade]);
  };

  const handleUpdateTrade = async (tradeId: string, newPnl: number) => {
    if (!user?.selectedAccountId) return;

    // Find the trade and calculate PNL difference
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    const pnlDifference = newPnl - trade.pnl;

    // Update account balance
    const updatedAccounts = user.accounts.map(acc => {
      if (acc.id === user.selectedAccountId) {
        return {
          ...acc,
          balance: acc.balance + pnlDifference
        };
      }
      return acc;
    });

    // Update user's accounts with new balance
    await updateUser({ accounts: updatedAccounts });

    // Update trade PNL
    setTrades(prevTrades =>
      prevTrades.map(trade =>
        trade.id === tradeId ? { ...trade, pnl: newPnl } : trade
      )
    );
  };

  // Filter trades for current account
  const accountTrades = trades.filter(trade => trade.accountId === user?.selectedAccountId);

  // Calculate daily PNL for current account
  const dailyPnL = accountTrades.reduce((acc, trade) => {
    const existingDay = acc.find(day => day.date === trade.date);
    if (existingDay) {
      existingDay.pnl += trade.pnl;
      return acc;
    }
    return [...acc, { date: trade.date, pnl: trade.pnl }];
  }, [] as { date: string; pnl: number }[]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {showLogin ? (
            <div>
              <LoginForm />
              <p className="mt-4 text-center">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Register
                </button>
              </p>
            </div>
          ) : (
            <div>
              <RegisterForm />
              <p className="mt-4 text-center">
                Already have an account?{' '}
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <Dashboard dailyPnL={dailyPnL} />}
        {activeTab === 'journal' && (
          <TradeJournal
            trades={trades}
            onAddTrade={handleAddTrade}
            onUpdateTrade={handleUpdateTrade}
          />
        )}
        {activeTab === 'calendar' && (
          <Calendar
            dailyPnL={dailyPnL}
            selectedDate={new Date()}
            onSelectDate={() => {}}
          />
        )}
        {activeTab === 'account' && <AccountDetails />}
      </main>
    </div>
  );
}

// Default export wrapper component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}