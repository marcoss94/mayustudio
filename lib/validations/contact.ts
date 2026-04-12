/**
 * lib/validations/contact.ts — Schema Zod para el formulario de contacto
 */

import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  email: z.string().email('Ingresá un email válido'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]{7,20}$/.test(val),
      'Ingresá un número de teléfono válido',
    ),

  serviceSlug: z.string().optional(),

  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres'),
});

export type ContactInput = z.infer<typeof contactSchema>;
