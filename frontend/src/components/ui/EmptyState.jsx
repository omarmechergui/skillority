import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border rounded-DEFAULT',
        className
      )}
    >
      <div className="w-12 h-12 bg-neutral-light text-neutral-slate rounded-full flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-dark tracking-tight">{title}</h3>
      <p className="text-xs text-neutral-slate mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
