import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ProfileModal } from '../auth/ProfileModal';
import { Sun, Moon, Sparkles, Bell, Search, LogOut, User as UserIcon, Settings, KeyRound } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-6 flex items-center justify-between">
        {/* Left: Quick Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="AI Semantic Search (Press ⌘K or search tasks, notes)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 dark:text-brand-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Assistant Ready</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Icon */}
          <button
            aria-label="Notifications"
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-500 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:inline text-slate-800 dark:text-slate-200">
                {user?.name || 'My Account'}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-dropdown py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => { setProfileOpen(false); setModalOpen(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Account Settings & Profile
                </button>

                <button
                  onClick={() => { setProfileOpen(false); setModalOpen(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Change Password
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Account Settings & Change Password Modal */}
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
