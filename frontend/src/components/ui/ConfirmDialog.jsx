'use client';

import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-3.5">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            danger ? 'bg-danger-light text-danger' : 'bg-primary-light text-primary'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-dark">{title}</h2>
          <p className="text-xs text-neutral-slate mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2.5">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
