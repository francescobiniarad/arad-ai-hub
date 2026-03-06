import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
            'bg-primary-500/15 border border-primary-500/30 text-primary-300 hover:bg-primary-500/25':
              variant === 'secondary',
            'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50':
              variant === 'ghost',
            'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25':
              variant === 'danger',
            // Sizes
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
