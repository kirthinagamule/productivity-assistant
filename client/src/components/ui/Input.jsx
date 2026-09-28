import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          id={id}
          ref={ref}
          className={twMerge(
            clsx(
              'custom-input text-xs sm:text-sm',
              Icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/40',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
