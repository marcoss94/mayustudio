'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { updateReservationNotes } from '@/actions/reservations.actions';

export function NotesBlock({
  reservationId,
  initialNotes,
}: {
  reservationId: string;
  initialNotes: string | null;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const dirty = (initialNotes ?? '') !== notes;

  async function handleSave() {
    setError(null);
    setSaving(true);
    const res = await updateReservationNotes(reservationId, notes || null);
    setSaving(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setSavedAt(new Date());
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <h2 className="font-serif text-lg italic text-on-surface mb-4">Notas internas</h2>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-lg bg-error-container text-on-error-container px-3 py-2 text-sm"
        >
          {error}
        </div>
      )}

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Anotá observaciones, pedidos especiales del cliente, etc."
        hint={`${notes.length} / 2000 caracteres`}
        maxLength={2000}
      />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">
          {savedAt && !dirty ? 'Guardado' : dirty ? 'Cambios sin guardar' : 'Sin cambios'}
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!dirty || saving}
          isLoading={saving}
        >
          Guardar notas
        </Button>
      </div>
    </section>
  );
}
