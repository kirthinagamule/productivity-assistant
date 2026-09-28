import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-7xl font-display font-black text-brand-500 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The page you are looking for might have been moved or does not exist in this productivity orbit.
      </p>
      <Link to="/">
        <Button icon={Home}>Back to Dashboard</Button>
      </Link>
    </div>
  );
};
