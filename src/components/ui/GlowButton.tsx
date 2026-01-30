import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variants = {
  cyan: 'bg-neon-cyan text-background hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.6)]',
  purple: 'bg-neon-purple text-white hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.6)]',
  pink: 'bg-neon-pink text-white hover:shadow-[0_0_30px_hsl(var(--neon-pink)/0.6)]',
  green: 'bg-neon-green text-background hover:shadow-[0_0_30px_hsl(var(--neon-green)/0.6)]',
  gradient: 'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.6)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export function GlowButton({ 
  children, 
  variant = 'cyan', 
  size = 'md',
  icon,
  onClick,
  disabled,
  type = 'button',
  className,
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 font-space',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
}
