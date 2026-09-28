import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Calendar & Time Blocking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual schedule with AI-optimized focus windows and deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={ChevronLeft} />
          <Button variant="outline" size="sm" icon={ChevronRight} />
          <Button variant="primary" size="sm">Today</Button>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-12">
        <div className="max-w-md space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Interactive Calendar View</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calendar grid and reminder sync modules initialized. Full event synchronization will activate in Phase 2.
          </p>
        </div>
      </Card>
    </div>
  );
};
