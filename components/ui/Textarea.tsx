import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, containerClassName, className, id, rows = 4, ...props },
    ref,
  ) {
    const autoId = React.useId();
    const fieldId = id ?? autoId;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label
            htmlFor={fieldId}
            className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
          >
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          rows={rows}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn(
            'w-full bg-transparent border py-2 px-3 text-base text-on-surface rounded-lg resize-y',
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
          <p id={`${fieldId}-error`} role="alert" className="text-xs text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={`${fieldId}-hint`} className="text-xs text-on-surface-variant">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
