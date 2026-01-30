import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  delay?: number;
}

const glowStyles = {
  cyan: 'border-neon-cyan/50 bg-gradient-to-br from-slate-900/60 to-slate-950/40 shadow-[0_0_20px_rgba(0,255,255,0.2),inset_0_0_20px_rgba(0,255,255,0.05)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4),inset_0_0_30px_rgba(0,255,255,0.1),0_0_60px_rgba(0,255,255,0.2)]',
  purple: 'border-neon-purple/50 bg-gradient-to-br from-slate-900/60 to-slate-950/40 shadow-[0_0_20px_rgba(187,0,255,0.2),inset_0_0_20px_rgba(187,0,255,0.05)] hover:shadow-[0_0_30px_rgba(187,0,255,0.4),inset_0_0_30px_rgba(187,0,255,0.1),0_0_60px_rgba(187,0,255,0.2)]',
  pink: 'border-neon-pink/50 bg-gradient-to-br from-slate-900/60 to-slate-950/40 shadow-[0_0_20px_rgba(255,20,147,0.2),inset_0_0_20px_rgba(255,20,147,0.05)] hover:shadow-[0_0_30px_rgba(255,20,147,0.4),inset_0_0_30px_rgba(255,20,147,0.1),0_0_60px_rgba(255,20,147,0.2)]',
  green: 'border-neon-green/50 bg-gradient-to-br from-slate-900/60 to-slate-950/40 shadow-[0_0_20px_rgba(57,255,20,0.2),inset_0_0_20px_rgba(57,255,20,0.05)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4),inset_0_0_30px_rgba(57,255,20,0.1),0_0_60px_rgba(57,255,20,0.2)]',
  orange: 'border-orange-500/50 bg-gradient-to-br from-slate-900/60 to-slate-950/40 shadow-[0_0_20px_rgba(255,140,0,0.2),inset_0_0_20px_rgba(255,140,0,0.05)] hover:shadow-[0_0_30px_rgba(255,140,0,0.4),inset_0_0_30px_rgba(255,140,0,0.1),0_0_60px_rgba(255,140,0,0.2)]',
};

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon, 
  glowColor = 'cyan',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-xl border-2 p-6 backdrop-blur-xl transition-all duration-300',
        glowStyles[glowColor]
      )}
    >
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-current to-transparent opacity-30 blur-3xl" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-4xl font-bold font-orbitron text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <p className={cn(
              'text-sm font-medium',
              changeType === 'positive' && 'text-neon-green',
              changeType === 'negative' && 'text-neon-pink',
              changeType === 'neutral' && 'text-muted-foreground'
            )}>
              {change}
            </p>
          )}
        </div>
        <motion.div 
          className={cn(
            'icon-wrapper p-3 rounded-xl border transition-all duration-300',
            glowColor === 'cyan' && 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)]',
            glowColor === 'purple' && 'border-neon-purple/50 bg-neon-purple/10 text-neon-purple shadow-[0_0_15px_rgba(187,0,255,0.3)]',
            glowColor === 'pink' && 'border-neon-pink/50 bg-neon-pink/10 text-neon-pink shadow-[0_0_15px_rgba(255,20,147,0.3)]',
            glowColor === 'green' && 'border-neon-green/50 bg-neon-green/10 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]',
            glowColor === 'orange' && 'border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(255,140,0,0.3)]'
          )}
          whileHover={{ 
            scale: 1.15,
            boxShadow: glowColor === 'cyan' ? '0 0 30px rgba(0,255,255,0.6)' : 
                       glowColor === 'purple' ? '0 0 30px rgba(187,0,255,0.6)' :
                       glowColor === 'pink' ? '0 0 30px rgba(255,20,147,0.6)' :
                       glowColor === 'green' ? '0 0 30px rgba(57,255,20,0.6)' :
                       '0 0 30px rgba(255,140,0,0.6)'
          }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}
