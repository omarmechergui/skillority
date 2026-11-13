import { cn } from '@/lib/utils';

export function Checkbox({
  label,
  description,
  id,
  className = '',
  disabled = false,
  checked,
  onChange,
  ...props
}) {
  return (
    <div className={cn('flex items-start gap-2.5 text-left', className)}>
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      />
      {(label || description) && (
        <div className="text-xs">
          {label && (
            <label
              htmlFor={id}
              className="font-medium text-neutral-dark cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && <p className="text-neutral-slate mt-0.5">{description}</p>}
        </div>
      )}
    </div>
  );
}

export default Checkbox;
