'use client';

import { useRouter } from 'next/navigation';
import { StyleForm } from '../StyleForm';
import { createStyle } from '@/actions/services.actions';
import type { StyleInput } from '@/lib/validations/services';

export function StyleCreateForm() {
  const router = useRouter();

  async function handleSubmit(data: StyleInput) {
    const res = await createStyle(data);
    if (!res.success) return { success: false, error: res.error };
    router.push(`/admin/servicios/${res.data.id}`);
    router.refresh();
    return { success: true };
  }

  return <StyleForm mode="create" onSubmit={handleSubmit} />;
}
