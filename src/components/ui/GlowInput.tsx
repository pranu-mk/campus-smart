import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-background/50 border border-border',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20',
            'transition-all duration-300',
            'hover:border-neon-cyan/50',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

GlowInput.displayName = 'GlowInput';
