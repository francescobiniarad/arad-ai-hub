import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  gradient?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, gradient, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-primary-500/15 bg-slate-800/60 p-6',
          hoverable && 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30',
          className
        )}
        {...props}
      >
        {gradient && (
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: gradient }}
          />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
