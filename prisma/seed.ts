import path from 'node:path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar en orden correcto (FK constraints)
  await prisma.galleryImage.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.styleExtra.deleteMany();
  await prisma.styleSet.deleteMany();
  await prisma.experienciaCompletaConfig.deleteMany();
  await prisma.style.deleteMany();

  // ─── Estilos base ───────────────────────────────────────────────────

  const cakeSmash = await prisma.style.create({
    data: {
      name: 'Cake Smash',
      slug: 'cake-smash',
      type: 'SETS_AND_TIERS',
      description:
        'Celebramos el primer año con una sesión divertida, llena de texturas y mucha espontaneidad. Cada set está diseñado para crear un mundo mágico alrededor de tu bebé.',
      shortDescription:
        'Celebramos el primer año con sets temáticos únicos y mucha espontaneidad.',
      label: 'Celebración Vibrante',      coverImage: 'https://picsum.photos/seed/cake-smash-cover/800/600',      highlights: [
        'Torta artesanal incluida',
        'Decoración temática completa',
        'Vestuario a elección',
        '20+ fotos editadas (Standard) / 40+ (Premium)',
      ],
      badge: 'Más popular',
      duration: 60,
      displayOrder: 1,
      tierStandardDuration: 45,
      tierPremiumDuration: 90,
      tierStandardTagline: 'Minimalismo Orgánico',
      tierPremiumTagline: 'Inmersión Editorial Total',
      tierStandardHighlights: [
        'Set a elegir de catálogo',
        '15 fotos digitales editadas',
        'Galería online privada',
        'Torta artesanal incluida',
      ],
      tierPremiumHighlights: [
        'Set premium o personalizado',
        '30 fotos digitales editadas',
        'Sesión "Splash" (baño en tina)',
        'Álbum impreso + USB de madera',
        'Galería online privada',
      ],
    },
  });

  const fineArt = await prisma.style.create({
    data: {
      name: 'Fine Art',
      slug: 'fine-art',
      type: 'STANDARD',
      description:
        'Retratos de inspiración pictórica donde cada luz y sombra es cuidadosamente esculpida. Una experiencia artística que transforma momentos en obras de arte.',
      shortDescription:
        'Retratos de inspiración pictórica con luz y sombra esculpida.',
      label: 'Legado Artístico',      coverImage: 'https://picsum.photos/seed/fine-art-cover/800/600',      highlights: [
        'Dirección artística completa',
        'Iluminación de estudio profesional',
        'Edición fine art detallada',
        '15 fotos editadas',
      ],
      duration: 45,
      price: 55000,
      displayOrder: 2,
    },
  });

  const minimalista = await prisma.style.create({
    data: {
      name: 'Minimalista',
      slug: 'minimalista',
      type: 'STANDARD',
      description:
        'La belleza de lo simple. Fondos neutros que permiten que la personalidad sea la protagonista. Ideal para capturar la esencia pura de tu hijo.',
      shortDescription:
        'La belleza de lo simple. Fondos neutros, protagonismo total.',
      label: 'Menos es Más',      coverImage: 'https://picsum.photos/seed/minimalista-cover/800/600',      highlights: [
        'Fondo neutro profesional',
        'Vestuario en tonos naturales',
        'Edición limpia y elegante',
        '12 fotos editadas',
      ],
      duration: 30,
      price: 38000,
      displayOrder: 3,
    },
  });

  // ─── Sets de Cake Smash ─────────────────────────────────────────────

  await prisma.styleSet.createMany({
    data: [
      {
        styleId: cakeSmash.id,
        name: 'Jungla',
        slug: 'jungla',
        description: 'Set tropical con plantas, animales y colores vibrantes.',
        coverImage: 'https://picsum.photos/seed/set-jungla/800/600',
        standardPrice: 40000,
        premiumPrice: 55000,
        displayOrder: 1,
      },
      {
        styleId: cakeSmash.id,
        name: 'Princesa',
        slug: 'princesa',
        description: 'Set de fantasía con coronas, tules y tonos pastel.',
        coverImage: 'https://picsum.photos/seed/set-princesa/800/600',
        standardPrice: 42000,
        premiumPrice: 58000,
        displayOrder: 2,
      },
      {
        styleId: cakeSmash.id,
        name: 'Aventurero',
        slug: 'aventurero',
        description: 'Set rústico con elementos de exploración y naturaleza.',
        coverImage: 'https://picsum.photos/seed/set-aventurero/800/600',
        standardPrice: 40000,
        premiumPrice: 55000,
        displayOrder: 3,
      },
      {
        styleId: cakeSmash.id,
        name: 'Set Personalizado',
        slug: 'personalizado',
        description:
          'Diseñamos un set único según tu visión. Describí lo que imaginás y nosotros lo hacemos realidad.',
        coverImage: 'https://picsum.photos/seed/set-custom/800/600',
        standardPrice: 0, // no aplica
        premiumPrice: 0, // no aplica
        customPrice: 50000,
        isCustom: true,
        displayOrder: 99,
      },
    ],
  });

  // ─── Extras de Minimalista ──────────────────────────────────────────

  await prisma.styleExtra.createMany({
    data: [
      { styleId: minimalista.id, name: 'Foto impresa 20x30', price: 5000 },
      { styleId: minimalista.id, name: 'Álbum digital premium', price: 8000 },
      { styleId: minimalista.id, name: '5 fotos adicionales editadas', price: 6000 },
    ],
  });

  // ─── Estilo estacional ──────────────────────────────────────────────

  await prisma.style.create({
    data: {
      name: 'Día de las Madres',
      slug: 'dia-de-las-madres',
      type: 'SEASONAL',
      description:
        'Una sesión especial para celebrar el vínculo único entre mamá e hijo. Disponible solo en temporada.',
      shortDescription: 'Celebrá el vínculo mamá e hijo con una sesión única.',
      label: 'Temporada Especial',      coverImage: 'https://picsum.photos/seed/dia-madres/800/600',
      highlights: [
        'Sesión mamá + hijo/a',
        'Set temático especial',
        '15 fotos editadas',
      ],
      badge: 'Estacional',
      duration: 40,
      price: 35000,
      seasonStart: new Date('2026-04-15'),
      seasonEnd: new Date('2026-05-15'),
      displayOrder: 10,
    },
  });

  // ─── Experiencia Completa ───────────────────────────────────────────

  await prisma.experienciaCompletaConfig.create({
    data: {
      description:
        'Ofrecemos un servicio integral que combina la precisión artística de una sesión de estudio con la cobertura documental de tu evento. El resultado es un relato visual cohesivo, elegante y profundamente emotivo.',
      coverImage: 'https://picsum.photos/seed/exp-completa/800/600',      highlights: [
        'Sesión de pre-cumpleaños personalizada',
        'Cobertura fotográfica premium del evento',
        'Álbum editorial de diseño exclusivo',
      ],
      eventPrice3h: 80000,
      eventPrice4h: 100000,
      comboDiscount: 20000,
    },
  });

  // ─── Galería ────────────────────────────────────────────────────────

  await prisma.galleryImage.createMany({
    data: [
      { url: 'https://picsum.photos/seed/g1/800/600', alt: 'Sesión Cake Smash Jungla', styleSlug: 'cake-smash', order: 1 },
      { url: 'https://picsum.photos/seed/g2/800/1000', alt: 'Retrato Fine Art', styleSlug: 'fine-art', order: 2 },
      { url: 'https://picsum.photos/seed/g3/800/800', alt: 'Sesión minimalista', styleSlug: 'minimalista', order: 3 },
      { url: 'https://picsum.photos/seed/g4/800/600', alt: 'Cake Smash Princesa', styleSlug: 'cake-smash', order: 4 },
      { url: 'https://picsum.photos/seed/g5/800/1000', alt: 'Retrato editorial infantil', styleSlug: 'fine-art', order: 5 },
      { url: 'https://picsum.photos/seed/g6/800/800', alt: 'Sesión en fondo neutro', styleSlug: 'minimalista', order: 6 },
      { url: 'https://picsum.photos/seed/g7/800/600', alt: 'Cake Smash Aventurero', styleSlug: 'cake-smash', order: 7 },
      { url: 'https://picsum.photos/seed/g8/800/1200', alt: 'Fine Art con luz natural', styleSlug: 'fine-art', order: 8 },
      { url: 'https://picsum.photos/seed/g9/800/600', alt: 'Sesión temática de primavera', order: 9 },
      { url: 'https://picsum.photos/seed/g10/800/800', alt: 'Retrato espontáneo', order: 10 },
      { url: 'https://picsum.photos/seed/g11/800/1000', alt: 'Bebé con torta artesanal', styleSlug: 'cake-smash', order: 11 },
      { url: 'https://picsum.photos/seed/g12/800/600', alt: 'Sesión familiar completa', order: 12 },
      { url: 'https://picsum.photos/seed/g13/800/800', alt: 'Retrato minimalista blanco', styleSlug: 'minimalista', order: 13 },
      { url: 'https://picsum.photos/seed/g14/800/1000', alt: 'Fine Art oscuro dramático', styleSlug: 'fine-art', order: 14 },
      { url: 'https://picsum.photos/seed/g15/800/600', alt: 'Set personalizado marinero', styleSlug: 'cake-smash', order: 15 },
      { url: 'https://picsum.photos/seed/g16/800/800', alt: 'Sesión al aire libre', order: 16 },
      { url: 'https://picsum.photos/seed/g17/800/1200', alt: 'Cobertura de evento cumpleaños', order: 17 },
      { url: 'https://picsum.photos/seed/g18/800/600', alt: 'Día de las madres especial', styleSlug: 'dia-de-las-madres', order: 18 },
      // Fotos de sets Cake Smash (antes en StyleSet.images[])
      { url: 'https://picsum.photos/seed/jungla-1/600/750', alt: 'Jungla escena 1', styleSlug: 'cake-smash', setSlug: 'jungla', order: 1 },
      { url: 'https://picsum.photos/seed/jungla-2/600/750', alt: 'Jungla escena 2', styleSlug: 'cake-smash', setSlug: 'jungla', order: 2 },
      { url: 'https://picsum.photos/seed/jungla-3/600/750', alt: 'Jungla escena 3', styleSlug: 'cake-smash', setSlug: 'jungla', order: 3 },
      { url: 'https://picsum.photos/seed/jungla-4/600/750', alt: 'Jungla escena 4', styleSlug: 'cake-smash', setSlug: 'jungla', order: 4 },
      { url: 'https://picsum.photos/seed/jungla-5/600/750', alt: 'Jungla escena 5', styleSlug: 'cake-smash', setSlug: 'jungla', order: 5 },
      { url: 'https://picsum.photos/seed/jungla-6/600/750', alt: 'Jungla escena 6', styleSlug: 'cake-smash', setSlug: 'jungla', order: 6 },
      { url: 'https://picsum.photos/seed/princesa-1/600/750', alt: 'Princesa escena 1', styleSlug: 'cake-smash', setSlug: 'princesa', order: 1 },
      { url: 'https://picsum.photos/seed/princesa-2/600/750', alt: 'Princesa escena 2', styleSlug: 'cake-smash', setSlug: 'princesa', order: 2 },
      { url: 'https://picsum.photos/seed/princesa-3/600/750', alt: 'Princesa escena 3', styleSlug: 'cake-smash', setSlug: 'princesa', order: 3 },
      { url: 'https://picsum.photos/seed/princesa-4/600/750', alt: 'Princesa escena 4', styleSlug: 'cake-smash', setSlug: 'princesa', order: 4 },
      { url: 'https://picsum.photos/seed/princesa-5/600/750', alt: 'Princesa escena 5', styleSlug: 'cake-smash', setSlug: 'princesa', order: 5 },
      { url: 'https://picsum.photos/seed/princesa-6/600/750', alt: 'Princesa escena 6', styleSlug: 'cake-smash', setSlug: 'princesa', order: 6 },
      { url: 'https://picsum.photos/seed/aventurero-1/600/750', alt: 'Aventurero escena 1', styleSlug: 'cake-smash', setSlug: 'aventurero', order: 1 },
      { url: 'https://picsum.photos/seed/aventurero-2/600/750', alt: 'Aventurero escena 2', styleSlug: 'cake-smash', setSlug: 'aventurero', order: 2 },
      { url: 'https://picsum.photos/seed/aventurero-3/600/750', alt: 'Aventurero escena 3', styleSlug: 'cake-smash', setSlug: 'aventurero', order: 3 },
      { url: 'https://picsum.photos/seed/aventurero-4/600/750', alt: 'Aventurero escena 4', styleSlug: 'cake-smash', setSlug: 'aventurero', order: 4 },
      { url: 'https://picsum.photos/seed/aventurero-5/600/750', alt: 'Aventurero escena 5', styleSlug: 'cake-smash', setSlug: 'aventurero', order: 5 },
      { url: 'https://picsum.photos/seed/aventurero-6/600/750', alt: 'Aventurero escena 6', styleSlug: 'cake-smash', setSlug: 'aventurero', order: 6 },
    ],
  });

  // ─── Super-admin ────────────────────────────────────────────────────

  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD;
  const superAdminName = process.env.SUPERADMIN_NAME ?? 'Super Admin';

  if (superAdminEmail && superAdminPassword) {
    const hash = await bcrypt.hash(superAdminPassword, 10);
    await prisma.user.upsert({
      where: { email: superAdminEmail.toLowerCase() },
      update: {
        password: hash,
        role: 'SUPERADMIN',
        name: superAdminName,
      },
      create: {
        email: superAdminEmail.toLowerCase(),
        password: hash,
        role: 'SUPERADMIN',
        name: superAdminName,
      },
    });
    console.log(`Super-admin upserted: ${superAdminEmail}`);
  } else {
    console.warn(
      'SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD no definidos — super-admin omitido',
    );
  }

  // ─── Reservas test (M5 QA) ───────────────────────────────────────────

  const cakeSmashId = (await prisma.style.findUniqueOrThrow({ where: { slug: 'cake-smash' }, select: { id: true } })).id;
  const fineArtId = (await prisma.style.findUniqueOrThrow({ where: { slug: 'fine-art' }, select: { id: true } })).id;
  const minimalistaId = (await prisma.style.findUniqueOrThrow({ where: { slug: 'minimalista' }, select: { id: true } })).id;
  const junglaId = (await prisma.styleSet.findFirstOrThrow({ where: { slug: 'jungla' }, select: { id: true } })).id;
  const princesaId = (await prisma.styleSet.findFirstOrThrow({ where: { slug: 'princesa' }, select: { id: true } })).id;

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const clientUsers = await Promise.all(
    [
      { email: 'ana.garcia@demo.com', name: 'Ana García' },
      { email: 'maria.lopez@demo.com', name: 'María López' },
      { email: 'lucia.ferrari@demo.com', name: 'Lucía Ferrari' },
      { email: 'sofia.benitez@demo.com', name: 'Sofía Benítez' },
      { email: 'camila.silva@demo.com', name: 'Camila Silva' },
    ].map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, password: passwordHash, role: 'CLIENT' },
      }),
    ),
  );

  const now = new Date();
  const day = (offset: number, h = 10) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    d.setHours(h, 0, 0, 0);
    return d;
  };

  await prisma.reservation.createMany({
    data: [
      {
        userId: clientUsers[0]!.id, status: 'DRAFT',
        startsAt: day(7, 11), endsAt: day(7, 12),
        childName: 'Mateo', childAge: 12, totalAmount: 40000,
        styleId: cakeSmashId, styleSetId: junglaId, tier: 'standard',
      },
      {
        userId: clientUsers[1]!.id, status: 'PENDING_PAYMENT',
        startsAt: day(3, 15), endsAt: day(3, 16),
        childName: 'Olivia', childAge: 12, totalAmount: 58000,
        styleId: cakeSmashId, styleSetId: princesaId, tier: 'premium',
        expiresAt: new Date(now.getTime() + 8 * 60 * 1000),
      },
      {
        userId: clientUsers[2]!.id, status: 'CONFIRMED',
        startsAt: day(14, 10), endsAt: day(14, 11),
        childName: 'Joaquín', childAge: 6, totalAmount: 55000,
        styleId: fineArtId,
      },
      {
        userId: clientUsers[3]!.id, status: 'CONFIRMED',
        startsAt: day(10, 16), endsAt: day(10, 17),
        childName: 'Emma', childAge: 18, totalAmount: 100000,
        styleId: cakeSmashId, styleSetId: junglaId, tier: 'premium',
        isExperienciaCompleta: true, eventDurationHours: 4, eventPrice: 100000, comboDiscount: 20000,
      },
      {
        userId: clientUsers[4]!.id, status: 'EXPIRED',
        startsAt: day(-5, 11), endsAt: day(-5, 12),
        childName: 'Tomás', childAge: 12, totalAmount: 40000,
        styleId: cakeSmashId, styleSetId: princesaId, tier: 'standard',
        expiresAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: clientUsers[0]!.id, status: 'COMPLETED',
        startsAt: day(-30, 10), endsAt: day(-30, 11),
        childName: 'Mateo', childAge: 11, totalAmount: 38000,
        styleId: minimalistaId, notes: 'Sesión perfecta. Cliente muy contenta.',
      },
      {
        userId: clientUsers[1]!.id, status: 'CANCELLED',
        startsAt: day(-2, 14), endsAt: day(-2, 15),
        childName: 'Olivia', childAge: 11, totalAmount: 55000,
        styleId: fineArtId, notes: 'Cliente canceló por enfermedad del bebé.',
      },
    ],
  });

  console.log(
    `Seed completado: 4 estilos, 4 sets, 3 extras, 1 config Experiencia, 36 imágenes, 5 clientes test, 7 reservas test`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
