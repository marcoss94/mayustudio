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
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={fieldId}
            className="text-xs font-medium uppercase tracking-wider text-on-surface-variant"
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
            'w-full rounded-lg border bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface resize-y',
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
