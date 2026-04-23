import { describe, it, expect } from 'vitest';
import {
  styleSchema,
  styleSetSchema,
  styleExtraSchema,
} from '@/lib/validations/services';

describe('styleSchema', () => {
  const baseValid = {
    name: 'Fine Art',
    slug: 'fine-art',
    highlights: [],
    isActive: true,
    isVisible: true,
    displayOrder: 0,
  };

  describe('STANDARD', () => {
    it('acepta datos válidos', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'STANDARD',
        price: 50000,
        duration: 60,
      });
      expect(res.success).toBe(true);
    });

    it('rechaza sin price', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'STANDARD',
        duration: 60,
      });
      expect(res.success).toBe(false);
    });

    it('rechaza price negativo', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'STANDARD',
        price: -100,
        duration: 60,
      });
      expect(res.success).toBe(false);
    });
  });

  describe('SETS_AND_TIERS', () => {
    it('acepta sin price base', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'SETS_AND_TIERS',
        tierStandardDuration: 30,
        tierPremiumDuration: 45,
        tierStandardHighlights: [],
        tierPremiumHighlights: [],
      });
      expect(res.success).toBe(true);
    });

    it('rechaza sin tierStandardDuration', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'SETS_AND_TIERS',
        tierPremiumDuration: 45,
      });
      expect(res.success).toBe(false);
    });
  });

  describe('SEASONAL', () => {
    it('acepta fechas válidas', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'SEASONAL',
        price: 40000,
        duration: 60,
        seasonStart: new Date('2026-05-01'),
        seasonEnd: new Date('2026-05-31'),
      });
      expect(res.success).toBe(true);
    });

    it('rechaza si seasonEnd ≤ seasonStart', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        type: 'SEASONAL',
        price: 40000,
        duration: 60,
        seasonStart: new Date('2026-05-31'),
        seasonEnd: new Date('2026-05-01'),
      });
      expect(res.success).toBe(false);
    });
  });

  describe('slug', () => {
    it('rechaza mayúsculas', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        slug: 'Fine-Art',
        type: 'STANDARD',
        price: 1,
        duration: 1,
      });
      expect(res.success).toBe(false);
    });

    it('rechaza con espacios', () => {
      const res = styleSchema.safeParse({
        ...baseValid,
        slug: 'fine art',
        type: 'STANDARD',
        price: 1,
        duration: 1,
      });
      expect(res.success).toBe(false);
    });
  });
});

describe('styleSetSchema', () => {
  const base = {
    name: 'Jungla',
    slug: 'jungla',
    images: [],
    standardPrice: 80000,
    premiumPrice: 120000,
    isActive: true,
    displayOrder: 0,
  };

  it('acepta set normal no-custom', () => {
    const res = styleSetSchema.safeParse({ ...base, isCustom: false });
    expect(res.success).toBe(true);
  });

  it('rechaza custom sin customPrice', () => {
    const res = styleSetSchema.safeParse({ ...base, isCustom: true });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some((i) => i.path.includes('customPrice'))).toBe(true);
    }
  });

  it('acepta custom con customPrice', () => {
    const res = styleSetSchema.safeParse({
      ...base,
      isCustom: true,
      customPrice: 150000,
    });
    expect(res.success).toBe(true);
  });

  it('rechaza más de 10 images', () => {
    const res = styleSetSchema.safeParse({
      ...base,
      images: Array.from({ length: 11 }, () => 'https://picsum.photos/200'),
    });
    expect(res.success).toBe(false);
  });
});

describe('styleExtraSchema', () => {
  it('acepta extra válido', () => {
    const res = styleExtraSchema.safeParse({
      name: 'Marco adicional',
      price: 5000,
      isActive: true,
    });
    expect(res.success).toBe(true);
  });

  it('rechaza precio negativo', () => {
    const res = styleExtraSchema.safeParse({
      name: 'X',
      price: -1,
      isActive: true,
    });
    expect(res.success).toBe(false);
  });

  it('rechaza nombre muy corto', () => {
    const res = styleExtraSchema.safeParse({
      name: 'A',
      price: 100,
      isActive: true,
    });
    expect(res.success).toBe(false);
  });
});
