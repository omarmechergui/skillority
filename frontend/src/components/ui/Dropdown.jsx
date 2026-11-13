'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Dropdown({
  trigger,
  items = [],
  align = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-30 mt-1.5 w-48 rounded-DEFAULT bg-surface border border-border shadow-md py-1.5 focus:outline-none text-xs animate-in fade-in-50 zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="my-1 border-t border-border" />;
            }

            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-left font-medium text-neutral-dark hover:bg-neutral-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  item.danger && 'text-danger hover:bg-danger-light hover:text-danger'
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
