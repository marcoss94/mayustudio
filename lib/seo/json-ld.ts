/**
 * lib/seo/json-ld.ts — Helpers para JSON-LD estructurado (schema.org)
 *
 * Server-only. Usar en Server Components con:
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
 */

/** WebSite schema — para usar en el root o en la home */
export function websiteJsonLd(baseUrl?: string) {
  const url = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: 'MayuStudio',
    url,
    description: 'Estudio de fotografía infantil boutique en Argentina. Cake Smash, Fine Art, sesiones minimalistas y experiencias completas.',
    inLanguage: 'es-AR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/servicios?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Datos del negocio para LocalBusiness */
export function localBusinessJsonLd(baseUrl?: string) {
  const url = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}/#business`,
    name: 'MayuStudio',
    description: 'Estudio de fotografía infantil boutique en Argentina',
    url,
    image: `${url}/opengraph-image.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
    },
    sameAs: [],
  };
}

/** Schema.org Service para una sesión fotográfica */
export function serviceJsonLd(
  service: {
    name: string;
    description: string | null;
    shortDescription: string | null;
    price: number;
    slug: string;
    coverImage: string | null;
  },
  baseUrl?: string,
) {
  const url = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description ?? service.shortDescription ?? undefined,
    url: `${url}/servicios/${service.slug}`,
    image: service.coverImage ?? undefined,
    provider: {
      '@type': 'LocalBusiness',
      name: 'MayuStudio',
      url,
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'ARS',
      url: `${url}/servicios/${service.slug}`,
    },
  };
}

/** ItemList schema para la lista de servicios */
export function itemListJsonLd(
  services: Array<{ name: string; slug: string }>,
  baseUrl?: string,
) {
  const url = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Servicios — MayuStudio',
    url: `${url}/servicios`,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      url: `${url}/servicios/${service.slug}`,
    })),
  };
}
