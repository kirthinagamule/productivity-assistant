import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart3, TrendingUp, Flame, Award, ShieldCheck, Clock } from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          Productivity Analytics & Velocity
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep telemetry on your focus habits, task completion velocity, and burnout prevention.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hover className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Weekly Efficiency Score</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            92.4 / 100
          </div>
          <Badge variant="success">Top 5% Productivity Tier</Badge>
        </Card>

        <Card hover className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Focus Time This Week</span>
            <Clock className="w-5 h-5 text-brand-500" />
          </div>
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            24h 15m
          </div>
          <p className="text-xs text-emerald-500 font-semibold">+18% vs last week</p>
        </Card>

        <Card hover className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Burnout Resistance Index</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-display font-bold text-emerald-500">
            Low Risk (Optimal)
          </div>
          <p className="text-xs text-slate-400">Regular micro-breaks detected</p>
        </Card>
      </div>
    </div>
  );
};
