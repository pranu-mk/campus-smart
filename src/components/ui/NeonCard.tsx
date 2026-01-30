import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  hover?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

const glowColors = {
  cyan: 'border-2 border-neon-cyan/50 bg-slate-900/60 shadow-[0_0_15px_rgba(0,255,255,0.2),inset_0_0_15px_rgba(0,255,255,0.05)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4),inset_0_0_30px_rgba(0,255,255,0.1),0_0_60px_rgba(0,255,255,0.2)] text-white',
  purple: 'border-2 border-neon-purple/50 bg-slate-900/60 shadow-[0_0_15px_rgba(187,0,255,0.2),inset_0_0_15px_rgba(187,0,255,0.05)] hover:shadow-[0_0_30px_rgba(187,0,255,0.4),inset_0_0_30px_rgba(187,0,255,0.1),0_0_60px_rgba(187,0,255,0.2)] text-white',
  pink: 'border-2 border-neon-pink/50 bg-slate-900/60 shadow-[0_0_15px_rgba(255,20,147,0.2),inset_0_0_15px_rgba(255,20,147,0.05)] hover:shadow-[0_0_30px_rgba(255,20,147,0.4),inset_0_0_30px_rgba(255,20,147,0.1),0_0_60px_rgba(255,20,147,0.2)] text-white',
  green: 'border-2 border-neon-green/50 bg-slate-900/60 shadow-[0_0_15px_rgba(57,255,20,0.2),inset_0_0_15px_rgba(57,255,20,0.05)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4),inset_0_0_30px_rgba(57,255,20,0.1),0_0_60px_rgba(57,255,20,0.2)] text-white',
  orange: 'border-2 border-orange-500/50 bg-slate-900/60 shadow-[0_0_15px_rgba(255,140,0,0.2),inset_0_0_15px_rgba(255,140,0,0.05)] hover:shadow-[0_0_30px_rgba(255,140,0,0.4),inset_0_0_30px_rgba(255,140,0,0.1),0_0_60px_rgba(255,140,0,0.2)] text-white',
};

export function NeonCard({ 
  children, 
  className, 
  glowColor = 'cyan',
  hover = true,
  animate = true,
  onClick 
}: NeonCardProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.02, y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-xl p-6 backdrop-blur-xl transition-all duration-300',
        glowColors[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
