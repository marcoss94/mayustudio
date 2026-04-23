import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slug = z
  .string()
  .min(2, 'Slug muy corto')
  .max(80, 'Slug muy largo')
  .regex(slugRegex, 'Usar minúsculas, números y guiones');

const price = z
  .number({ error: 'Precio requerido' })
  .nonnegative('El precio debe ser ≥ 0');

const optionalPrice = price.optional().nullable();

const positiveInt = z
  .number({ error: 'Valor requerido' })
  .int('Debe ser entero')
  .positive('Debe ser > 0');

const optionalString = z
  .string()
  .trim()
  .max(10_000)
  .optional()
  .transform((v) => (v === '' ? undefined : v));

const stringArray = z.array(z.string().trim().min(1)).max(20);

const baseStyleFields = {
  name: z.string().trim().min(2, 'Nombre muy corto').max(80),
  slug,
  shortDescription: z.string().trim().max(200).optional().or(z.literal('')),
  description: optionalString,
  coverImage: z.string().url('URL inválida').optional().or(z.literal('')),
  badge: z.string().trim().max(30).optional().or(z.literal('')),
  label: z.string().trim().max(50).optional().or(z.literal('')),
  highlights: stringArray.default([]),
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
};

const standardStyleSchema = z.object({
  type: z.literal('STANDARD'),
  ...baseStyleFields,
  price,
  duration: positiveInt,
});

const setsAndTiersStyleSchema = z.object({
  type: z.literal('SETS_AND_TIERS'),
  ...baseStyleFields,
  tierStandardDuration: positiveInt,
  tierPremiumDuration: positiveInt,
  tierStandardTagline: z.string().trim().max(80).optional().or(z.literal('')),
  tierPremiumTagline: z.string().trim().max(80).optional().or(z.literal('')),
  tierStandardHighlights: stringArray.default([]),
  tierPremiumHighlights: stringArray.default([]),
});

const seasonalStyleSchema = z
  .object({
    type: z.literal('SEASONAL'),
    ...baseStyleFields,
    price,
    duration: positiveInt,
    seasonStart: z.coerce.date({ error: 'Fecha de inicio requerida' }),
    seasonEnd: z.coerce.date({ error: 'Fecha de fin requerida' }),
  })
  .refine((d) => d.seasonEnd > d.seasonStart, {
    path: ['seasonEnd'],
    message: 'La fecha de fin debe ser posterior al inicio',
  });

export const styleSchema = z.discriminatedUnion('type', [
  standardStyleSchema,
  setsAndTiersStyleSchema,
  seasonalStyleSchema,
]);

export type StyleInput = z.infer<typeof styleSchema>;

export const styleSetSchema = z
  .object({
    name: z.string().trim().min(2, 'Nombre muy corto').max(80),
    slug,
    description: optionalString,
    coverImage: z.string().url('URL inválida').optional().or(z.literal('')),
    images: z.array(z.string().url('URL inválida')).max(10, 'Máximo 10 imágenes').default([]),
    standardPrice: price,
    premiumPrice: price,
    isCustom: z.boolean().default(false),
    customPrice: optionalPrice,
    isActive: z.boolean().default(true),
    displayOrder: z.number().int().min(0).default(0),
  })
  .refine(
    (d) => !d.isCustom || (d.customPrice !== undefined && d.customPrice !== null),
    { path: ['customPrice'], message: 'Requerido si el set es personalizado' },
  );

export type StyleSetInput = z.infer<typeof styleSetSchema>;

export const styleExtraSchema = z.object({
  name: z.string().trim().min(2, 'Nombre muy corto').max(80),
  price,
  isActive: z.boolean().default(true),
});

export type StyleExtraInput = z.infer<typeof styleExtraSchema>;
