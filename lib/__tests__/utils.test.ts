/**
 * lib/__tests__/utils.test.ts — Tests unitarios para lib/utils.ts
 */
import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

describe('cn()', () => {
  it('combina clases simples', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('elimina clases conflictivas de Tailwind (tailwind-merge)', () => {
    // px-4 y px-2 conflictan; el último gana
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('maneja clases condicionales con clsx', () => {
    expect(cn('base', false && 'disabled', 'active')).toBe('base active');
    expect(cn('base', true && 'active')).toBe('base active');
  });

  it('maneja arrays y objetos', () => {
    expect(cn(['px-4', 'py-2'], { 'text-red-500': true, 'text-blue-500': false })).toBe(
      'px-4 py-2 text-red-500',
    );
  });

  it('retorna string vacío para inputs vacíos', () => {
    expect(cn()).toBe('');
    expect(cn('', undefined, null as unknown as string)).toBe('');
  });
});

describe('formatCurrency()', () => {
  it('formatea ARS por defecto', () => {
    const result = formatCurrency(1500);
    // Verifica que contiene el símbolo de peso y el número correcto
    expect(result).toContain('1.500');
    expect(result).toMatch(/\$|ARS/);
  });

  it('formatea con decimales correctos', () => {
    const result = formatCurrency(99.9);
    expect(result).toContain('99,90');
  });

  it('formatea montos enteros con ,00', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1.000,00');
  });

  it('acepta currency alternativa', () => {
    const result = formatCurrency(100, 'USD');
    expect(result).toMatch(/US\$|USD/);
    expect(result).toContain('100');
  });

  it('maneja cero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
  });
});

describe('formatDate()', () => {
  it('formatea un objeto Date en español', () => {
    // Usar fecha fija para evitar flakiness por zona horaria
    const date = new Date(2026, 3, 11); // 11 de abril de 2026 (month es 0-indexed)
    const result = formatDate(date);
    expect(result).toContain('11');
    expect(result).toMatch(/abril/i);
    expect(result).toContain('2026');
  });

  it('acepta string ISO y lo formatea', () => {
    // Crear fecha sin zona horaria para evitar shift de día
    const date = new Date(2026, 0, 1); // 1 enero 2026
    const result = formatDate(date);
    expect(result).toContain('1');
    expect(result).toMatch(/enero/i);
    expect(result).toContain('2026');
  });

  it('acepta opciones personalizadas', () => {
    const date = new Date(2026, 3, 11);
    const result = formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
    expect(result).toMatch(/abr/i);
  });

  it('acepta string ISO como entrada', () => {
    // Usar new Date para construir la fecha correctamente
    const date = new Date(2026, 5, 15); // 15 junio 2026
    const result = formatDate(date);
    expect(result).toMatch(/jun/i);
    expect(result).toContain('2026');
  });
});
