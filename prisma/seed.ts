import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes en orden correcto (FK constraints)
  await prisma.galleryImage.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();

  // ─── Categorías ───────────────────────────────────────────────────────────────

  const [clasicas, artisticas, experiencias] = await Promise.all([
    prisma.serviceCategory.create({
      data: {
        name: 'Sesiones Clásicas',
        slug: 'clasicas',
        description: 'Las sesiones más pedidas del estudio',
        order: 1,
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Sesiones Artísticas',
        slug: 'artisticas',
        description: 'Para quienes buscan algo único',
        order: 2,
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Experiencias',
        slug: 'experiencias',
        description: 'La experiencia completa MayuStudio',
        order: 3,
      },
    }),
  ]);

  // ─── Servicios ────────────────────────────────────────────────────────────────

  await prisma.service.createMany({
    data: [
      {
        name: 'Cake Smash',
        slug: 'cake-smash',
        description:
          'La sesión más divertida para celebrar el primer añito de tu bebé. Incluye torta artesanal decorada, escenografía temática personalizada, y 20 fotos profesionalmente editadas. La sesión dura aproximadamente 60 minutos, con tiempo para que el bebé explore, juegue y disfrute de su torta. Ideal para capturar esas expresiones únicas e irrepetibles.',
        shortDescription: 'Celebrá el primer añito con torta artesanal y escenografía temática',
        price: 45000,
        duration: 60,
        coverImage: 'https://picsum.photos/seed/cakesmash-cover/800/600',
        images: [
          'https://picsum.photos/seed/cakesmash1/800/600',
          'https://picsum.photos/seed/cakesmash2/800/600',
          'https://picsum.photos/seed/cakesmash3/800/600',
        ],
        highlights: [
          'Torta artesanal incluida',
          '20 fotos editadas',
          'Escenografía personalizada',
          'Outfit para el bebé',
        ],
        badge: 'Más popular',
        minChildAge: 11,
        maxChildAge: 13,
        categoryId: clasicas.id,
        isActive: true,
        isVisible: true,
      },
      {
        name: 'Fine Art',
        slug: 'fine-art',
        description:
          'Sesiones artísticas con iluminación de estudio profesional, fondos pintados a mano y una estética cuidada hasta el último detalle. Creamos retratos de autor que se convierten en obras de arte para tu hogar. Incluye 15 fotos con edición artística avanzada.',
        shortDescription: 'Retratos de autor con fondos pintados a mano y edición artística',
        price: 55000,
        duration: 45,
        coverImage: 'https://picsum.photos/seed/fineart-cover/800/600',
        images: [
          'https://picsum.photos/seed/fineart1/800/600',
          'https://picsum.photos/seed/fineart2/800/600',
        ],
        highlights: [
          'Fondos pintados a mano',
          '15 fotos con edición artística',
          'Iluminación profesional de estudio',
          'Dirección artística personalizada',
        ],
        badge: null,
        minChildAge: 0,
        maxChildAge: null,
        categoryId: artisticas.id,
        isActive: true,
        isVisible: true,
      },
      {
        name: 'Minimalista',
        slug: 'minimalista',
        description:
          'Menos es más. Fondos neutros, luz natural y la belleza pura de tu bebé como protagonista. Sin distracciones, sin excesos — solo momentos genuinos capturados con sensibilidad. Incluye 12 fotos editadas con un estilo limpio y atemporal.',
        shortDescription: 'Fondos neutros, luz natural y la belleza pura de tu bebé',
        price: 38000,
        duration: 40,
        coverImage: 'https://picsum.photos/seed/minimal-cover/800/600',
        images: [
          'https://picsum.photos/seed/minimal1/800/600',
          'https://picsum.photos/seed/minimal2/800/600',
        ],
        highlights: [
          'Luz natural',
          '12 fotos editadas',
          'Estética atemporal',
          'Fondos neutros premium',
        ],
        badge: null,
        minChildAge: 0,
        maxChildAge: null,
        categoryId: artisticas.id,
        isActive: true,
        isVisible: true,
      },
      {
        name: 'Especiales y Estacionales',
        slug: 'especiales-estacionales',
        description:
          'Sesiones temáticas que cambian con las estaciones y fechas especiales: Navidad, Pascua, Día de la Madre, Halloween, y más. Escenografías únicas diseñadas especialmente para cada temporada. Consultá la temática disponible del mes.',
        shortDescription: 'Sesiones temáticas por temporada: Navidad, Pascua, Halloween y más',
        price: 35000,
        duration: 45,
        coverImage: 'https://picsum.photos/seed/seasonal-cover/800/600',
        images: ['https://picsum.photos/seed/seasonal1/800/600'],
        highlights: [
          'Escenografía temática exclusiva',
          '15 fotos editadas',
          'Props de temporada',
          'Disponibilidad limitada',
        ],
        badge: 'Estacional',
        minChildAge: 0,
        maxChildAge: null,
        categoryId: clasicas.id,
        isActive: true,
        isVisible: true,
      },
      {
        name: 'Experiencia Completa',
        slug: 'experiencia-completa',
        description:
          'La experiencia premium de MayuStudio. Combina lo mejor de todas nuestras sesiones en una jornada completa: cambios de escenografía, múltiples looks, y hasta 40 fotos editadas. Incluye sesión de Cake Smash + Fine Art + outfit personalizado. El recuerdo definitivo del primer año.',
        shortDescription: 'Jornada completa premium: Cake Smash + Fine Art + 40 fotos editadas',
        price: 85000,
        duration: 120,
        coverImage: 'https://picsum.photos/seed/complete-cover/800/600',
        images: [
          'https://picsum.photos/seed/complete1/800/600',
          'https://picsum.photos/seed/complete2/800/600',
          'https://picsum.photos/seed/complete3/800/600',
        ],
        highlights: [
          'Cake Smash + Fine Art combinados',
          '40 fotos editadas',
          'Múltiples cambios de escenografía',
          'Outfit personalizado incluido',
          'Jornada completa de 2 horas',
        ],
        badge: 'Premium',
        minChildAge: 11,
        maxChildAge: 13,
        categoryId: experiencias.id,
        isActive: true,
        isVisible: true,
      },
    ],
  });

  // ─── Galería ──────────────────────────────────────────────────────────────────

  await prisma.galleryImage.createMany({
    data: [
      // Cake Smash (5 imágenes)
      {
        url: 'https://picsum.photos/seed/gal-cs1/800/1000',
        alt: 'Bebé sonriendo con torta rosa',
        caption: 'Cake Smash — Valentina, 1 año',
        serviceSlug: 'cake-smash',
        order: 1,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-cs2/800/600',
        alt: 'Bebé con torta celeste y globos',
        caption: 'Cake Smash — Mateo, 1 año',
        serviceSlug: 'cake-smash',
        order: 2,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-cs3/600/800',
        alt: 'Primer mordisco de torta',
        caption: null,
        serviceSlug: 'cake-smash',
        order: 3,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-cs4/800/800',
        alt: 'Escenografía floral con bebé',
        caption: 'Cake Smash temático jardín',
        serviceSlug: 'cake-smash',
        order: 4,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-cs5/800/600',
        alt: 'Bebé cubierto de crema sonriendo',
        caption: null,
        serviceSlug: 'cake-smash',
        order: 5,
        isVisible: true,
      },
      // Fine Art (4 imágenes)
      {
        url: 'https://picsum.photos/seed/gal-fa1/800/1000',
        alt: 'Retrato artístico con fondo pintado',
        caption: 'Fine Art — Emma',
        serviceSlug: 'fine-art',
        order: 6,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-fa2/800/600',
        alt: 'Bebé con luz lateral suave',
        caption: 'Iluminación de estudio',
        serviceSlug: 'fine-art',
        order: 7,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-fa3/600/800',
        alt: 'Retrato clásico blanco y negro',
        caption: null,
        serviceSlug: 'fine-art',
        order: 8,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-fa4/800/800',
        alt: 'Fine Art con props vintage',
        caption: 'Fine Art — colección otoño',
        serviceSlug: 'fine-art',
        order: 9,
        isVisible: true,
      },
      // Minimalista (3 imágenes)
      {
        url: 'https://picsum.photos/seed/gal-mn1/800/600',
        alt: 'Bebé en fondo blanco puro',
        caption: 'Minimalista — Sofía',
        serviceSlug: 'minimalista',
        order: 10,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-mn2/800/1000',
        alt: 'Retrato minimalista luz natural',
        caption: null,
        serviceSlug: 'minimalista',
        order: 11,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-mn3/800/800',
        alt: 'Bebé sentado fondo neutro',
        caption: 'La simpleza como arte',
        serviceSlug: 'minimalista',
        order: 12,
        isVisible: true,
      },
      // Especiales y Estacionales (3 imágenes)
      {
        url: 'https://picsum.photos/seed/gal-se1/800/600',
        alt: 'Sesión navideña con luces',
        caption: 'Navidad 2025',
        serviceSlug: 'especiales-estacionales',
        order: 13,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-se2/600/800',
        alt: 'Bebé con orejas de conejo Pascua',
        caption: 'Pascua 2025',
        serviceSlug: 'especiales-estacionales',
        order: 14,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-se3/800/800',
        alt: 'Halloween bebé calabaza',
        caption: null,
        serviceSlug: 'especiales-estacionales',
        order: 15,
        isVisible: true,
      },
      // Experiencia Completa (3 imágenes)
      {
        url: 'https://picsum.photos/seed/gal-ex1/800/1000',
        alt: 'Jornada completa cambio de look',
        caption: 'Experiencia Completa — Luca',
        serviceSlug: 'experiencia-completa',
        order: 16,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-ex2/800/600',
        alt: 'Múltiples escenografías en un día',
        caption: null,
        serviceSlug: 'experiencia-completa',
        order: 17,
        isVisible: true,
      },
      {
        url: 'https://picsum.photos/seed/gal-ex3/800/800',
        alt: 'La experiencia premium MayuStudio',
        caption: 'Lo mejor de cada sesión',
        serviceSlug: 'experiencia-completa',
        order: 18,
        isVisible: true,
      },
    ],
  });

  console.log('Seed completado: 3 categorías, 5 servicios, 18 imágenes de galería');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
