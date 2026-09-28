import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Clock, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account & Security Settings" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('profile'); setMessage(null); setError(null); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-brand-500 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => { setActiveTab('password'); setMessage(null); setError(null); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ml-2 ${
              activeTab === 'password'
                ? 'bg-brand-500 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</h3>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary" size="sm">{user?.role || 'USER'}</Badge>
                  <span className="text-[11px] text-slate-400">Timezone: {user?.timezone || 'UTC'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Account ID:</span>
                <span className="font-mono text-[11px] text-slate-500">{user?.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Member Since:</span>
                <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Active Workload:</span>
                <span className="font-semibold text-brand-500">{user?.stats?.tasks || 0} Tasks • {user?.stats?.notes || 0} Notes</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="secondary" className="w-full text-xs" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-3.5 pt-1">
            {message && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              required
              icon={KeyRound}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type="password"
              required
              icon={KeyRound}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 characters (with uppercase & number)"
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              icon={KeyRound}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="secondary" className="flex-1 text-xs" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={loading} className="flex-1 text-xs">
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
