import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-between text-xs text-neutral-slate py-3', className)}>
      <span>
        Page <span className="font-semibold text-neutral-dark">{currentPage}</span> of{' '}
        <span className="font-semibold text-neutral-dark">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-md border border-border bg-surface text-neutral-slate hover:text-neutral-dark hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-md border border-border bg-surface text-neutral-slate hover:text-neutral-dark hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
