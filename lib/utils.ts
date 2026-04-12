/**
 * lib/utils.ts — Utilidades compartidas de la aplicación
 *
 * - cn()             Combina clases Tailwind con deduplicación inteligente
 * - formatCurrency() Formatea montos en ARS (pesos argentinos)
 * - formatDate()     Formatea fechas en español de Argentina
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases CSS con resolución de conflictos de Tailwind.
 * Usa clsx para condicionales y tailwind-merge para eliminar duplicados.
 *
 * @example
 * cn('px-4 py-2', condition && 'bg-primary', 'px-2') // → 'py-2 bg-primary px-2'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda argentina (ARS).
 *
 * @param amount   Monto numérico a formatear
 * @param currency Código ISO de moneda (default: 'ARS')
 * @returns        String formateado, e.g. "$ 1.500,00"
 *
 * @example
 * formatCurrency(1500)        // → '$ 1.500,00'
 * formatCurrency(99.9, 'USD') // → 'US$ 99,90'
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
 * Formatea una fecha en español de Argentina.
 *
 * @param date    Fecha a formatear (Date o string ISO)
 * @param options Opciones de Intl.DateTimeFormat (override)
 * @returns       String formateado, e.g. "11 de abril de 2026"
 *
 * @example
 * formatDate(new Date('2026-04-11')) // → '11 de abril de 2026'
 * formatDate('2026-04-11', { month: 'short' }) // → '11 abr 2026'
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
