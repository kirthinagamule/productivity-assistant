import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, Sparkles, Pin, FileText } from 'lucide-react';

export const NotesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Smart Notes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Capture thoughts, auto-summarize with AI, and extract action items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ai" size="sm" icon={Sparkles}>
            AI Summarize
          </Button>
          <Button variant="primary" size="sm" icon={Plus}>
            New Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card hover className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="primary">Architecture</Badge>
            <Pin className="w-4 h-4 text-brand-500 fill-brand-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Productivity Assistant Architecture RFC
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
            RFC document detailing the full architecture stack and real-time streaming pipeline. Full relational model with PostgreSQL pgvector embeddings.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Updated today at 3:12 PM
          </div>
        </Card>
      </div>
    </div>
  );
};
