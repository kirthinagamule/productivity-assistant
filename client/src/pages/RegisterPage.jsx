import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, User, Mail, Lock, AlertCircle, Check, X, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isStrong = hasMinLength && hasUpper && hasLower && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isStrong) {
      setErrorMsg('Please ensure your password meets all complexity requirements.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-background-dark relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-indigo-500 text-white shadow-xl shadow-brand-500/25 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Supercharge your workflow with your AI productivity assistant
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xl border-slate-200/80 dark:border-slate-800/80">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Connor"
            />

            <Input
              label="Email Address"
              type="email"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@work.com"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="custom-input pl-10 pr-10 text-xs sm:text-sm"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Complexity Checklist */}
            {password.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-[11px] animate-fadeIn">
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>At least 1 uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>At least 1 lowercase letter (a-z)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>At least 1 number (0-9)</span>
                </div>
              </div>
            )}

            <Button type="submit" isLoading={loading} className="w-full text-xs sm:text-sm py-3 font-semibold shadow-lg shadow-brand-500/25">
              Create Account
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
