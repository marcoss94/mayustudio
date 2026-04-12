/**
 * lib/__tests__/seo.test.ts
 * Tests de los JSON-LD helpers (schema.org)
 */

import { describe, it, expect } from 'vitest';
import {
  localBusinessJsonLd,
  serviceJsonLd,
  itemListJsonLd,
  websiteJsonLd,
} from '@/lib/seo/json-ld';

// ─── localBusinessJsonLd ─────────────────────────────────────────────────────

describe('localBusinessJsonLd', () => {
  it('retorna @context y @type correctos', () => {
    const ld = localBusinessJsonLd('https://mayustudio.com');

    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('LocalBusiness');
  });

  it('incluye @id con el patrón #business', () => {
    const ld = localBusinessJsonLd('https://mayustudio.com');

    expect(ld['@id']).toBe('https://mayustudio.com/#business');
  });

  it('incluye name "MayuStudio"', () => {
    const ld = localBusinessJsonLd('https://mayustudio.com');

    expect(ld.name).toBe('MayuStudio');
  });

  it('usa baseUrl para construir url e image', () => {
    const base = 'https://mayustudio.com';
    const ld = localBusinessJsonLd(base);

    expect(ld.url).toBe(base);
    expect(ld.image).toBe(`${base}/opengraph-image.png`);
  });

  it('usa fallback localhost cuando no se pasa baseUrl y no hay env var', () => {
    // En vitest no hay NEXT_PUBLIC_APP_URL salvo que se configure explícitamente
    const ld = localBusinessJsonLd();

    // Debe ser una URL válida (no undefined, no vacía)
    expect(typeof ld.url).toBe('string');
    expect(ld.url.length).toBeGreaterThan(0);
  });

  it('incluye address con addressCountry AR', () => {
    const ld = localBusinessJsonLd('https://mayustudio.com');

    expect(ld.address).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'AR',
    });
  });

  it('incluye priceRange $$', () => {
    const ld = localBusinessJsonLd('https://mayustudio.com');

    expect(ld.priceRange).toBe('$$');
  });

  it('retorna sameAs como array', () => {
    const ld = localBusinessJsonLd('https://mayustudio.com');

    expect(Array.isArray(ld.sameAs)).toBe(true);
  });
});

// ─── serviceJsonLd ───────────────────────────────────────────────────────────

describe('serviceJsonLd', () => {
  const mockService = {
    name: 'Cake Smash',
    description: 'Sesión divertida con torta para el primer año.',
    shortDescription: 'Cake Smash corto',
    price: 150000,
    slug: 'cake-smash',
    coverImage: '/images/cake-smash.jpg',
  };

  it('retorna @context y @type Service', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Service');
  });

  it('incluye el nombre del servicio', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld.name).toBe('Cake Smash');
  });

  it('usa description cuando está disponible', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld.description).toBe(mockService.description);
  });

  it('cae en shortDescription cuando description es null', () => {
    const service = { ...mockService, description: null };
    const ld = serviceJsonLd(service, 'https://mayustudio.com');

    expect(ld.description).toBe(mockService.shortDescription);
  });

  it('retorna undefined en description cuando ambas son null', () => {
    const service = { ...mockService, description: null, shortDescription: null };
    const ld = serviceJsonLd(service, 'https://mayustudio.com');

    expect(ld.description).toBeUndefined();
  });

  it('construye url correctamente usando slug y baseUrl', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld.url).toBe('https://mayustudio.com/servicios/cake-smash');
  });

  it('incluye image cuando coverImage existe', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld.image).toBe('/images/cake-smash.jpg');
  });

  it('retorna undefined en image cuando coverImage es null', () => {
    const service = { ...mockService, coverImage: null };
    const ld = serviceJsonLd(service, 'https://mayustudio.com');

    expect(ld.image).toBeUndefined();
  });

  it('incluye provider con @type LocalBusiness y name MayuStudio', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld.provider).toMatchObject({
      '@type': 'LocalBusiness',
      name: 'MayuStudio',
    });
  });

  it('incluye offers con precio y moneda ARS', () => {
    const ld = serviceJsonLd(mockService, 'https://mayustudio.com');

    expect(ld.offers).toMatchObject({
      '@type': 'Offer',
      price: 150000,
      priceCurrency: 'ARS',
    });
  });
});

// ─── itemListJsonLd ───────────────────────────────────────────────────────────

describe('itemListJsonLd', () => {
  const services = [
    { name: 'Cake Smash', slug: 'cake-smash' },
    { name: 'Fine Art', slug: 'fine-art' },
    { name: 'Recién Nacido', slug: 'recien-nacido' },
  ];

  it('retorna @context y @type ItemList', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('ItemList');
  });

  it('incluye name "Servicios — MayuStudio"', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    expect(ld.name).toBe('Servicios — MayuStudio');
  });

  it('incluye url de la página de servicios', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    expect(ld.url).toBe('https://mayustudio.com/servicios');
  });

  it('genera itemListElement con la misma cantidad de servicios', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    expect(ld.itemListElement).toHaveLength(3);
  });

  it('asigna posición incremental desde 1', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
    expect(ld.itemListElement[2].position).toBe(3);
  });

  it('cada item tiene @type ListItem', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    ld.itemListElement.forEach((item) => {
      expect(item['@type']).toBe('ListItem');
    });
  });

  it('cada item construye url correctamente', () => {
    const ld = itemListJsonLd(services, 'https://mayustudio.com');

    expect(ld.itemListElement[0].url).toBe('https://mayustudio.com/servicios/cake-smash');
    expect(ld.itemListElement[1].url).toBe('https://mayustudio.com/servicios/fine-art');
  });

  it('retorna ItemList vacío cuando services es []', () => {
    const ld = itemListJsonLd([], 'https://mayustudio.com');

    expect(ld.itemListElement).toHaveLength(0);
  });
});

// ─── websiteJsonLd ────────────────────────────────────────────────────────────

describe('websiteJsonLd', () => {
  it('retorna @context y @type WebSite', () => {
    const ld = websiteJsonLd('https://mayustudio.com');

    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('WebSite');
  });

  it('incluye @id con patrón #website', () => {
    const ld = websiteJsonLd('https://mayustudio.com');

    expect(ld['@id']).toBe('https://mayustudio.com/#website');
  });

  it('incluye potentialAction de tipo SearchAction', () => {
    const ld = websiteJsonLd('https://mayustudio.com');

    expect(ld.potentialAction['@type']).toBe('SearchAction');
  });

  it('el urlTemplate de SearchAction incluye el baseUrl', () => {
    const ld = websiteJsonLd('https://mayustudio.com');

    expect(ld.potentialAction.target.urlTemplate).toContain('https://mayustudio.com');
  });
});
