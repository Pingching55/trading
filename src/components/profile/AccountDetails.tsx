import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AccountSelector } from './AccountSelector';
import { AccountForm } from './AccountForm';
import { PlusCircle } from 'lucide-react';

export function AccountDetails() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUser(formData);
      setIsEditing(false);
    }
  };

  const handleAddAccount = async (accountData: { name: string; balance: number; currency: string }) => {
    if (user) {
      const newAccount = {
        id: Math.random().toString(36).substr(2, 9),
        ...accountData,
      };
      
      const updatedAccounts = [...(user.accounts || []), newAccount];
      await updateUser({
        accounts: updatedAccounts,
        selectedAccountId: user.selectedAccountId || newAccount.id,
      });
      setIsAddingAccount(false);
    }
  };

  const handleSelectAccount = async (accountId: string) => {
    if (user) {
      await updateUser({ selectedAccountId: accountId });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-lg">{user.phoneNumber || 'Not set'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Trading Accounts</h2>
          <button
            onClick={() => setIsAddingAccount(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <PlusCircle size={20} />
            Add Account
          </button>
        </div>

        {isAddingAccount ? (
          <AccountForm
            onSubmit={handleAddAccount}
            onCancel={() => setIsAddingAccount(false)}
          />
        ) : (
          <AccountSelector
            accounts={user.accounts || []}
            selectedAccountId={user.selectedAccountId || ''}
            onSelectAccount={handleSelectAccount}
          />
        )}
      </div>
    </div>
  );
}