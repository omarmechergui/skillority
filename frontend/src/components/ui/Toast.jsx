import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export function Toast({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) {
  const types = {
    info: {
      icon: Info,
      style: 'bg-surface border-border text-neutral-dark',
      iconStyle: 'text-primary',
    },
    success: {
      icon: CheckCircle2,
      style: 'bg-success-light border-success-border text-success',
      iconStyle: 'text-success',
    },
    warning: {
      icon: AlertCircle,
      style: 'bg-warning-light border-warning-border text-warning',
      iconStyle: 'text-warning',
    },
    error: {
      icon: AlertCircle,
      style: 'bg-danger-light border-danger-border text-danger',
      iconStyle: 'text-danger',
    },
  };

  const current = types[type] || types.info;
  const Icon = current.icon;

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 p-4 rounded-DEFAULT border shadow-sm max-w-sm w-full transition-all',
        current.style,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', current.iconStyle)} />
      <div className="flex-1 text-xs">
        {title && <h3 className="font-semibold">{title}</h3>}
        {message && <p className="mt-0.5 leading-relaxed text-neutral-slate">{message}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-slate hover:text-neutral-dark p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default Toast;
