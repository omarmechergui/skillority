import { cn } from '@/lib/utils';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const base =
    'inline-flex items-center font-medium rounded-full tracking-wide select-none transition-colors';

  const variants = {
    default: 'bg-neutral-light text-neutral-slate border border-border',
    primary: 'bg-primary-light text-primary border border-blue-200',
    success: 'bg-success-light text-success border border-success-border',
    warning: 'bg-warning-light text-warning border border-warning-border',
    danger: 'bg-danger-light text-danger border border-danger-border',
    outline: 'bg-transparent text-neutral-dark border border-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-1.5',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;
