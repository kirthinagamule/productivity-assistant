import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, Filter, Sparkles, CheckSquare, Clock, Tag } from 'lucide-react';

export const TasksPage = () => {
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Tasks & Sprints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize, prioritize with AI scoring, and track execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Filter}>
            Filter
          </Button>
          <Button variant="ai" size="sm" icon={Sparkles}>
            AI Prioritize
          </Button>
          <Button variant="primary" size="sm" icon={Plus}>
            New Task
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-sm">
        {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-brand-500 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task List Placeholder Ready for Phase 2 */}
      <div className="space-y-3">
        <Card hover className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Setup pgvector cosine distance index on Task embeddings
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 45 min</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> PostgreSQL, AI</span>
              </div>
            </div>
          </div>
          <Badge variant="high">HIGH (Score 8.9)</Badge>
        </Card>
      </div>
    </div>
  );
};
