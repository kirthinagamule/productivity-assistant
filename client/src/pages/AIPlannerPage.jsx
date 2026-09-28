import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Bot, Clock, Send, Lightbulb, Zap } from 'lucide-react';

export const AIPlannerPage = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-brand-500" />
            <span>AI Daily Planner & Assistant</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let the AI model orchestrate your focus hours, meetings, and energy peaks.
          </p>
        </div>

        <Button variant="ai" size="sm" icon={Zap}>
          Generate Optimized Day
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat / Prompt interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="min-h-[420px] flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed max-w-lg">
                  Hello! I analyzed your pending workload. You have 3 high-priority tasks and 2 meetings scheduled. I recommend scheduling 90 minutes of uninterrupted focus work before lunch. How would you like to structure today?
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI: 'Move my deep work block after 2pm and reschedule minor tasks'..."
                className="custom-input text-xs sm:text-sm"
              />
              <Button variant="ai" icon={Send} />
            </div>
          </Card>
        </div>

        {/* Right: AI Insights */}
        <div className="space-y-4">
          <Card className="space-y-4 bg-purple-950/10 border-purple-500/20">
            <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>AI Cognitive Recommendations</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Peak energy window predicted between <strong>09:30 - 11:30 AM</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Current workload density is <strong>72% (Optimal)</strong>.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
