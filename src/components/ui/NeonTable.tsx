import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface NeonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function NeonTable<T extends { id: string }>({ 
  data, 
  columns, 
  onRowClick,
  className 
}: NeonTableProps<T>) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border/50 glass', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className={cn(
                    'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-border/30 transition-all duration-200',
                  'hover:bg-neon-cyan/5 hover:border-neon-cyan/20',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
                    className={cn(
                      'px-6 py-4 text-sm',
                      column.className
                    )}
                  >
                    {column.render 
                      ? column.render(item) 
                      : String(item[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
