'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div
        className={cn(
          'relative w-full bg-surface border border-border rounded-DEFAULT shadow-md z-10 overflow-hidden flex flex-col max-h-[90vh]',
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-start justify-between p-5 border-b border-border">
            <div>
              {title && <h2 className="text-base font-semibold text-neutral-dark">{title}</h2>}
              {subtitle && <p className="text-xs text-neutral-slate mt-0.5">{subtitle}</p>}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-slate hover:text-neutral-dark p-1 rounded-md hover:bg-neutral-light transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
