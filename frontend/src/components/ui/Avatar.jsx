import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Avatar({
  src,
  alt = 'Avatar',
  fallback = 'U',
  size = 'md',
  status,
  className = '',
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-primary-light text-primary font-semibold flex items-center justify-center border border-border select-none relative',
          sizes[size]
        )}
      >
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" unoptimized />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-surface',
            status === 'online' && 'bg-success',
            status === 'busy' && 'bg-danger',
            status === 'away' && 'bg-warning',
            status === 'offline' && 'bg-neutral-muted',
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}

export default Avatar;
