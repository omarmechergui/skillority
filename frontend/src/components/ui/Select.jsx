import { cn } from '@/lib/utils';

export function Select({
  label,
  error,
  id,
  options = [],
  className = '',
  required = false,
  helperText,
  placeholder = 'Select an option...',
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
        <select
          id={id}
          required={required}
          className={cn(
            'w-full px-3.5 py-2 text-sm bg-surface border border-border rounded-md text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs disabled:bg-neutral-light disabled:cursor-not-allowed appearance-none pr-9',
            error && 'border-danger focus:ring-danger text-danger',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-neutral-slate">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-slate">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Select;
