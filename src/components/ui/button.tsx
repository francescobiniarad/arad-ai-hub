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
          'inline-flex items-center justify-center gap-2 rounded-sm font-sans font-semibold tracking-wider uppercase transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-gold/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-brand-gold text-white hover:bg-brand-gold/90 shadow-sm hover:shadow-md':
              variant === 'primary',
            'border border-brand-gold text-brand-gold bg-transparent hover:bg-brand-gold hover:text-white':
              variant === 'secondary',
            'bg-transparent text-brand-muted hover:text-brand-title hover:bg-brand-ice':
              variant === 'ghost',
            'border border-red-400 text-red-500 bg-transparent hover:bg-red-500 hover:text-white':
              variant === 'danger',
            'px-3 py-1.5 text-[10px]': size === 'sm',
            'px-4 py-2 text-xs': size === 'md',
            'px-6 py-3 text-sm': size === 'lg',
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
