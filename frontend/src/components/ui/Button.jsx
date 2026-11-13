import { cn } from '@/lib/utils';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-DEFAULT select-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-xs active:bg-primary-dark',
    secondary: 'bg-surface text-neutral-dark border border-border hover:bg-canvas focus:ring-neutral-slate shadow-xs active:bg-neutral-light',
    outline: 'border border-primary text-primary hover:bg-primary-light focus:ring-primary active:bg-blue-100',
    ghost: 'text-neutral-slate hover:text-neutral-dark hover:bg-neutral-light focus:ring-neutral-slate',
    danger: 'bg-danger text-white hover:bg-red-800 focus:ring-danger shadow-xs',
    success: 'bg-success text-white hover:bg-green-800 focus:ring-success shadow-xs',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    icon: 'p-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}

export default Button;

