import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      placeholder,
      options,
      containerClassName,
      className,
      id,
      ...props
    },
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
        <div className="relative">
          <select
            id={fieldId}
            ref={ref}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
            className={cn(
              'w-full appearance-none rounded-lg border bg-surface-container-lowest px-3 py-2.5 pr-9 text-sm text-on-surface',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer',
              hasError
                ? 'border-error focus:border-error'
                : 'border-outline-variant hover:border-outline focus:border-primary',
              props.disabled && 'opacity-60 cursor-not-allowed bg-surface-container',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
            strokeWidth={1.75}
          />
        </div>
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
