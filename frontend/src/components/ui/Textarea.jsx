import { cn } from '@/lib/utils';

export function Textarea({
  label,
  error,
  id,
  className = '',
  required = false,
  helperText,
  rows = 4,
  ...props
}) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-neutral-slate">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        required={required}
        className={cn(
          'w-full px-3.5 py-2 text-sm bg-surface border border-border rounded-md text-neutral-dark placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs disabled:bg-neutral-light disabled:cursor-not-allowed resize-y',
          error && 'border-danger focus:ring-danger text-danger',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-slate">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Textarea;
