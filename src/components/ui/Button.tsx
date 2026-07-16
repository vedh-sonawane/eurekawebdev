import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-moss-500 text-forest-950 hover:bg-moss-400 active:bg-moss-600 shadow-lg shadow-moss-500/20 border border-moss-400/50',
  secondary:
    'bg-forest-700 text-cream-50 hover:bg-forest-600 active:bg-forest-800 border border-forest-500/40',
  ghost:
    'bg-transparent text-cream-100 hover:bg-cream-50/10 border border-transparent',
  outline:
    'bg-transparent text-cream-50 border border-cream-50/30 hover:border-cream-50/60 hover:bg-cream-50/5',
  danger:
    'bg-red-800/80 text-red-50 hover:bg-red-700 border border-red-600/40',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', children, icon, iconRight, fullWidth, className = '', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
