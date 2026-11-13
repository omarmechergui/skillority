import { cn } from '@/lib/utils';

export function Skeleton({ className = '', variant = 'text', ...props }) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn('animate-pulse bg-neutral-slate/15', variants[variant], className)}
      {...props}
    />
  );
}

export default Skeleton;
