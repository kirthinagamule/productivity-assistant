import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  Sparkles,
  BarChart3,
  Bot,
  Layers
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Tasks & Sprints', path: '/tasks', icon: CheckSquare },
    { label: 'Smart Notes', path: '/notes', icon: FileText },
    { label: 'Calendar & Time', path: '/calendar', icon: Calendar },
    { label: 'AI Daily Planner', path: '/ai-planner', icon: Sparkles, badge: 'AI' },
    { label: 'Analytics & Score', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-screen sticky top-0 flex flex-col justify-between p-4">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              FlowState <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">AI</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Personal Productivity</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={clsx(
                          'text-[10px] px-1.5 py-0.5 font-bold uppercase rounded-md',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Quick Card in Sidebar Footer */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-900/30 to-purple-900/20 border border-brand-500/20">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
          <Bot className="w-3.5 h-3.5" />
          <span>AI Copilot Active</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">
          Type naturally in any input or speak commands to plan your day.
        </p>
      </div>
    </aside>
  );
};
