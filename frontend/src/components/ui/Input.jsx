import { cn } from '@/lib/utils';

export function Input({
  label,
  error,
  id,
  type = 'text',
  className = '',
  required = false,
  helperText,
  icon: Icon,
  ...props
}) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-neutral-slate">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          required={required}
          className={cn(
            'w-full px-3.5 py-2 text-sm bg-surface border border-border rounded-md text-neutral-dark placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs disabled:bg-neutral-light disabled:cursor-not-allowed',
            Icon && 'pl-9',
            error && 'border-danger focus:ring-danger text-danger',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-slate">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
