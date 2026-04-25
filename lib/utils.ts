/**
 * lib/utils.ts — Utilidades compartidas de la aplicación
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases CSS con resolución de conflictos de Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda argentina (ARS por default).
 */
export function formatCurrency(amount: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Genera un slug URL-safe desde texto.
 * Normaliza acentos, lowercase, espacios/símbolos → guiones, colapsa duplicados.
 *
 * @example
 * slugify('Cake Smash Premium')    // 'cake-smash-premium'
 * slugify('Día de las Madres')     // 'dia-de-las-madres'
 * slugify('Set #1 — ¡Especial!')   // 'set-1-especial'
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formatea una fecha en español de Argentina.
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('es-AR', { ...defaultOptions, ...options }).format(dateObj);
}
