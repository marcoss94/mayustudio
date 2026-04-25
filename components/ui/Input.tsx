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
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-wider text-on-surface-variant"
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
            'w-full rounded-lg border bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface',
            'placeholder:text-on-surface-variant/50',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
            hasError
              ? 'border-error focus:border-error'
              : 'border-outline-variant hover:border-outline focus:border-primary',
            props.disabled && 'opacity-60 cursor-not-allowed bg-surface-container',
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
