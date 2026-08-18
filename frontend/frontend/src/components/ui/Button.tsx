import React from 'react';
import { cn } from '@/utils/cn';
import { Magnetic } from './Magnetic';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  magnetic?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', magnetic = false, children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors duration-300 rounded-lg overflow-hidden";
    
    const variants = {
      primary: "bg-golden-500 text-black hover:bg-golden-400 px-6 py-3",
      secondary: "bg-white/10 text-white hover:bg-white/20 px-6 py-3",
      outline: "border border-golden-500/50 text-golden-400 hover:bg-golden-500/10 px-6 py-3",
      ghost: "text-slate-300 hover:text-white px-4 py-2 hover:bg-white/5",
    };

    const buttonElement = (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );

    if (magnetic) {
      return <Magnetic>{buttonElement}</Magnetic>;
    }

    return buttonElement;
  }
);
Button.displayName = 'Button';