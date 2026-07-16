import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  optional?: boolean;
}

const baseField =
  'w-full rounded-lg bg-forest-950/40 border px-4 py-3 font-body text-cream-50 placeholder-stone-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-moss-400/40';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, optional, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="flex items-baseline gap-2 mb-2 font-sans text-sm font-medium text-cream-100">
            <span>{label}</span>
            {optional && <span className="text-xs font-normal text-stone-400">— optional</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${baseField} ${icon ? 'pl-11' : ''} ${
              error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-forest-600/50 focus:border-moss-400/60'
            } ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-300 font-body">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-stone-400 font-body">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, optional, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="flex items-baseline gap-2 mb-2 font-sans text-sm font-medium text-cream-100">
            <span>{label}</span>
            {optional && <span className="text-xs font-normal text-stone-400">— optional</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`${baseField} resize-none ${
            error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-forest-600/50 focus:border-moss-400/60'
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-300 font-body">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-stone-400 font-body">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
