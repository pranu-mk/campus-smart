import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50',
  assigned: 'bg-neon-blue/20 text-neon-blue border-neon-blue/50',
  in_progress: 'bg-neon-purple/20 text-neon-purple border-neon-purple/50',
  resolved: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  escalated: 'bg-destructive/20 text-destructive border-destructive/50',
  closed: 'bg-muted text-muted-foreground border-border',
  active: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  blocked: 'bg-destructive/20 text-destructive border-destructive/50',
  inactive: 'bg-muted text-muted-foreground border-border',
  upcoming: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
  ongoing: 'bg-neon-purple/20 text-neon-purple border-neon-purple/50',
  completed: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/50',
  lost: 'bg-destructive/20 text-destructive border-destructive/50',
  found: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  claimed: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(' ', '_');
  const style = statusStyles[normalizedStatus] || statusStyles.pending;
  
  return (
    <span
      className={cn(
        'px-3 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider',
        style,
        className
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
