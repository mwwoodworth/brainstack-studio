'use client';

import { cloneElement, forwardRef, isValidElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90',
        secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
        ghost: 'text-slate-300 hover:text-white hover:bg-white/10',
        danger: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
        success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, asChild, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        className: cn(classes, (children.props as { className?: string })?.className),
        ...(disabled ? { 'aria-disabled': true } : {}),
        ...props,
      });
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
