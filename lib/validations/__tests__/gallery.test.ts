import { describe, it, expect } from 'vitest';
import { galleryImageSchema } from '@/lib/validations/gallery';

describe('galleryImageSchema', () => {
  const baseValid = {
    url: 'https://picsum.photos/800',
    alt: 'Retrato editorial',
    order: 0,
    isVisible: true,
  };

  it('acepta datos válidos completos', () => {
    const res = galleryImageSchema.safeParse({
      ...baseValid,
      caption: 'Sesión en estudio',
      styleSlug: 'cake-smash',
    });
    expect(res.success).toBe(true);
  });

  it('acepta sin styleSlug (portfolio general)', () => {
    const res = galleryImageSchema.safeParse(baseValid);
    expect(res.success).toBe(true);
  });

  it('acepta styleSlug null', () => {
    const res = galleryImageSchema.safeParse({ ...baseValid, styleSlug: null });
    expect(res.success).toBe(true);
  });

  it('rechaza URL inválida', () => {
    const res = galleryImageSchema.safeParse({ ...baseValid, url: 'not-a-url' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toContain('URL');
    }
  });

  it('rechaza alt muy corto', () => {
    const res = galleryImageSchema.safeParse({ ...baseValid, alt: 'a' });
    expect(res.success).toBe(false);
  });

  it('rechaza alt vacío', () => {
    const res = galleryImageSchema.safeParse({ ...baseValid, alt: '' });
    expect(res.success).toBe(false);
  });

  it('rechaza order negativo', () => {
    const res = galleryImageSchema.safeParse({ ...baseValid, order: -1 });
    expect(res.success).toBe(false);
  });

  it('rechaza styleSlug muy largo', () => {
    const res = galleryImageSchema.safeParse({
      ...baseValid,
      styleSlug: 'x'.repeat(101),
    });
    expect(res.success).toBe(false);
  });

  it('acepta caption vacío', () => {
    const res = galleryImageSchema.safeParse({ ...baseValid, caption: '' });
    expect(res.success).toBe(true);
  });

  // ─── setSlug compound ──────────────────────────────────────────────────

  describe('setSlug (compound)', () => {
    it('acepta setSlug con styleSlug válido', () => {
      const res = galleryImageSchema.safeParse({
        ...baseValid,
        styleSlug: 'cake-smash',
        setSlug: 'jungla',
      });
      expect(res.success).toBe(true);
    });

    it('rechaza setSlug sin styleSlug', () => {
      const res = galleryImageSchema.safeParse({
        ...baseValid,
        setSlug: 'jungla',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.some((i) => i.path.includes('setSlug'))).toBe(true);
      }
    });

    it('rechaza setSlug con styleSlug null', () => {
      const res = galleryImageSchema.safeParse({
        ...baseValid,
        styleSlug: null,
        setSlug: 'jungla',
      });
      expect(res.success).toBe(false);
    });

    it('acepta ambos null', () => {
      const res = galleryImageSchema.safeParse({
        ...baseValid,
        styleSlug: null,
        setSlug: null,
      });
      expect(res.success).toBe(true);
    });

    it('acepta styleSlug sin setSlug', () => {
      const res = galleryImageSchema.safeParse({
        ...baseValid,
        styleSlug: 'cake-smash',
      });
      expect(res.success).toBe(true);
    });
  });
});
