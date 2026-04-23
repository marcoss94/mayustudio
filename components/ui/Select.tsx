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
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label
            htmlFor={fieldId}
            className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold"
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
              'w-full bg-transparent border-0 border-b py-2 pr-8 text-base text-on-surface appearance-none',
              'focus:ring-0 focus:outline-none transition-colors cursor-pointer',
              hasError
                ? 'border-error focus:border-error'
                : 'border-outline-variant focus:border-secondary',
              props.disabled && 'opacity-60 cursor-not-allowed',
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
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
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
