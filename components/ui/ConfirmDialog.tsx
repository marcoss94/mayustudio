'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const isDanger = variant === 'danger';

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex gap-4">
        {isDanger && (
          <div className="shrink-0 w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
          </div>
        )}
        <div className="flex-1">
          <h2 className="font-serif text-lg italic font-semibold text-on-surface">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button
          type="button"
          variant="soft"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={isDanger ? 'primary' : 'primary'}
          onClick={handleConfirm}
          isLoading={loading}
          className={isDanger ? 'bg-error text-on-error' : ''}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
