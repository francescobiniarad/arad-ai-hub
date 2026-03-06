import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border border-primary-500/15 bg-slate-900/70 px-3 py-2',
          'text-sm text-slate-200 placeholder:text-slate-500',
          'focus:outline-none focus:border-primary-500/50',
          'transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-lg border border-primary-500/15 bg-slate-900/70 px-3 py-2',
          'text-sm text-slate-200 placeholder:text-slate-500',
          'focus:outline-none focus:border-primary-500/50',
          'transition-colors resize-vertical',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'w-full rounded-lg border border-primary-500/15 bg-slate-900/70 px-3 py-2',
          'text-sm text-slate-200',
          'focus:outline-none focus:border-primary-500/50',
          'transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
