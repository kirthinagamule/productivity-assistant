import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border p-5',
          hover ? 'glass-card-hover' : 'glass-card',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
