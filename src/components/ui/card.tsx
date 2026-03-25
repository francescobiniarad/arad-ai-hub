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
          'relative overflow-hidden rounded-sm border border-gray-200 bg-brand-surface p-6',
          hoverable && 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-gold',
          className
        )}
        {...props}
      >
        {gradient && (
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: gradient }}
          />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
