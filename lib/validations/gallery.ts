import { z } from 'zod';

export const galleryImageSchema = z
  .object({
    url: z.string().url('URL inválida'),
    alt: z.string().trim().min(2, 'Alt requerido (mín 2 caracteres)').max(200),
    caption: z.string().trim().max(200).optional().or(z.literal('')),
    order: z.number().int().min(0, 'Orden debe ser ≥ 0').default(0),
    isVisible: z.boolean().default(true),
    styleSlug: z.string().trim().max(100).nullable().optional(),
    setSlug: z.string().trim().max(100).nullable().optional(),
  })
  .refine(
    (d) => !d.setSlug || Boolean(d.styleSlug),
    { path: ['setSlug'], message: 'setSlug requiere styleSlug' },
  );

export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
