'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Tooltip({ children, content, position = 'top', className = '' }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-40 px-2 py-1 text-[11px] font-medium text-white bg-neutral-dark rounded shadow-xs whitespace-nowrap pointer-events-none transition-opacity',
            positions[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
