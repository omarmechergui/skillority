import { cn } from '@/lib/utils';

export function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-medium text-neutral-slate">{message}</p>
    </div>
  );
}

export default LoadingState;
