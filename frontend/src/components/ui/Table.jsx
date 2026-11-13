import { cn } from '@/lib/utils';

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto rounded-DEFAULT border border-border bg-surface">
      <table className={cn('w-full text-left border-collapse text-xs', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <thead className={cn('bg-canvas border-b border-border text-neutral-slate uppercase font-semibold text-[11px] tracking-wider', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return <tbody className={cn('divide-y divide-border text-neutral-dark', className)}>{children}</tbody>;
}

export function TableRow({ children, className = '', hover = true }) {
  return (
    <tr className={cn(hover && 'hover:bg-neutral-light/50 transition-colors', className)}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', header = false }) {
  if (header) {
    return <th className={cn('px-4 py-3 font-semibold text-neutral-slate', className)}>{children}</th>;
  }
  return <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>;
}

export default Table;
