import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, hint, error, containerClassName, className, id, ...props },
    ref,
  ) {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'w-full bg-transparent border-0 border-b py-2 text-base text-on-surface',
            'focus:ring-0 focus:outline-none transition-colors',
            hasError
              ? 'border-error focus:border-error'
              : 'border-outline-variant focus:border-secondary',
            props.disabled && 'opacity-60 cursor-not-allowed',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-on-surface-variant">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
