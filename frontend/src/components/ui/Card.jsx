import { cn } from '@/lib/utils';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-DEFAULT shadow-xs p-6 text-neutral-dark',
        hover && 'hover:border-neutral-slate/40 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4 pb-4 border-b border-border', className)}>
      <div>
        <h2 className="text-base font-semibold text-neutral-dark tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-slate mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-border flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

export default Card;
