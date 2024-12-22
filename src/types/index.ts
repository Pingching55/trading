export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  joinedDate: string;
  accounts: TradingAccount[];
  selectedAccountId: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface Trade {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  pair: string;
  entryPrice: number;
  exitPrice: number;
  position: 'long' | 'short';
  pnl: number;
  notes: string;
}

export interface DailyPnL {
  date: string;
  pnl: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}