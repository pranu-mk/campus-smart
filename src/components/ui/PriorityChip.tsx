import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Flame } from 'lucide-react';

interface PriorityChipProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

const priorityConfig = {
  low: {
    bg: 'bg-neon-green/10 border-neon-green/30',
    text: 'text-neon-green',
    icon: Info,
  },
  medium: {
    bg: 'bg-neon-yellow/10 border-neon-yellow/30',
    text: 'text-neon-yellow',
    icon: AlertCircle,
  },
  high: {
    bg: 'bg-neon-orange/10 border-neon-orange/30',
    text: 'text-neon-orange',
    icon: AlertTriangle,
  },
  critical: {
    bg: 'bg-destructive/10 border-destructive/30',
    text: 'text-destructive',
    icon: Flame,
  },
};

export function PriorityChip({ priority, className }: PriorityChipProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border',
        config.bg,
        config.text,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
