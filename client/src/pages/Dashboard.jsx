import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  ArrowUpRight,
  Plus,
  BrainCircuit,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [naturalInput, setNaturalInput] = useState('');

  const stats = [
    { label: 'Productivity Score', value: '92.4', change: '+4.2%', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Tasks Completed', value: '18/22', change: '82%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Deep Focus Time', value: '3h 45m', change: 'On track', icon: Clock, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Burnout Risk', value: 'Low (12%)', change: 'Optimal', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const upcomingTasks = [
    { id: '1', title: 'Benchmark pgvector similarity search performance', priority: 'HIGH', due: 'Today, 4:00 PM', category: 'AI Research', duration: '60m' },
    { id: '2', title: 'Implement WebSocket real-time task sync', priority: 'URGENT', due: 'Tomorrow, 11:00 AM', category: 'Core Engineering', duration: '45m' },
    { id: '3', title: 'Review weekly productivity analytics & burn-down', priority: 'MEDIUM', due: 'Friday, 2:00 PM', category: 'Strategy', duration: '30m' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & AI Natural Language Quick Capture */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Innovator'} ✨
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your daily cognitive briefing and optimized execution path.
          </p>
        </div>

        <Button variant="ai" icon={Sparkles}>
          Generate Daily Plan
        </Button>
      </div>

      {/* AI Smart Command Bar */}
      <Card className="border-brand-500/30 bg-gradient-to-r from-brand-950/20 via-purple-950/10 to-transparent">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            placeholder="Type anything naturally, e.g. 'Prepare investor deck on Thursday at 3pm with high priority'..."
            className="flex-1 w-full bg-transparent border-0 text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <Button size="sm" variant="ai" icon={Plus}>
            AI Quick Add
          </Button>
        </div>
      </Card>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} hover className="flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-display font-bold text-slate-900 dark:text-white">{stat.value}</span>
                <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 flex items-center">
                  {stat.change}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout: Active Focus Schedule & High-Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-500" />
              <span>Prioritized Focus Tasks</span>
            </h2>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View All Tasks <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <Card key={task.id} hover className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                        {task.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.duration}
                      </span>
                      <span>•</span>
                      <span>{task.due}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Badge variant={task.priority === 'URGENT' ? 'urgent' : task.priority === 'HIGH' ? 'high' : 'default'}>
                    {task.priority}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: AI Daily Schedule Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-500" />
            <span>AI Time-Blocked Schedule</span>
          </h2>

          <Card className="space-y-4 bg-slate-900/40">
            <div className="border-l-2 border-brand-500/40 pl-3.5 space-y-4">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-slate-900" />
                <span className="text-[11px] font-bold text-brand-400">09:30 - 11:30 AM (NOW)</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">Deep Work: pgvector Benchmarking</p>
                <span className="text-[10px] text-slate-400">Peak cognitive window</span>
              </div>

              <div className="relative opacity-75">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-900" />
                <span className="text-[11px] font-medium text-slate-400">11:30 - 12:30 PM</span>
                <p className="text-xs font-semibold text-slate-300 mt-0.5">Async Team PR Reviews</p>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-700 ring-4 ring-slate-900" />
                <span className="text-[11px] font-medium text-slate-400">12:30 - 01:30 PM</span>
                <p className="text-xs font-semibold text-slate-300 mt-0.5">Lunch & Cognitive Recovery</p>
              </div>
            </div>

            <div className="pt-2">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Adjust In Daily Planner
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
