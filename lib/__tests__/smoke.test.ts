/**
 * Smoke test — verifica que el entorno Vitest + jsdom + jest-dom está configurado.
 * No depende de lógica de la app; confirma que el setup funciona antes de M8+.
 */
import { describe, it, expect } from 'vitest';

describe('Vitest setup', () => {
  it('ejecuta en entorno jsdom', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  it('globals de vitest disponibles', () => {
    expect(1 + 1).toBe(2);
  });

  it('jest-dom: toBeInTheDocument funciona', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});
