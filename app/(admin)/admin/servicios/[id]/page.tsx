import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { prisma } from '@/lib/db/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { DetailTabs } from './DetailTabs';

export const dynamic = 'force-dynamic';

export default async function StyleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const style = await prisma.style.findUnique({
    where: { id },
    include: {
      sets: { orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] },
      extras: { orderBy: { name: 'asc' } },
    },
  });

  if (!style) notFound();

  const serialized = {
    id: style.id,
    name: style.name,
    slug: style.slug,
    type: style.type,
    description: style.description,
    shortDescription: style.shortDescription,
    coverImage: style.coverImage,
    badge: style.badge,
    label: style.label,
    highlights: style.highlights,
    duration: style.duration,
    price: style.price?.toNumber() ?? null,
    tierStandardHighlights: style.tierStandardHighlights,
    tierPremiumHighlights: style.tierPremiumHighlights,
    tierStandardDuration: style.tierStandardDuration,
    tierPremiumDuration: style.tierPremiumDuration,
    tierStandardTagline: style.tierStandardTagline,
    tierPremiumTagline: style.tierPremiumTagline,
    isActive: style.isActive,
    isVisible: style.isVisible,
    displayOrder: style.displayOrder,
    seasonStart: style.seasonStart,
    seasonEnd: style.seasonEnd,
    sets: style.sets.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      coverImage: s.coverImage,
      images: s.images,
      standardPrice: s.standardPrice.toNumber(),
      premiumPrice: s.premiumPrice.toNumber(),
      customPrice: s.customPrice?.toNumber() ?? null,
      isCustom: s.isCustom,
      isActive: s.isActive,
      displayOrder: s.displayOrder,
    })),
    extras: style.extras.map((e) => ({
      id: e.id,
      name: e.name,
      price: e.price.toNumber(),
      isActive: e.isActive,
    })),
  };

  return (
    <>
      <Link
        href="/admin/servicios"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface mb-4"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
        Volver a servicios
      </Link>

      <PageHeader
        title={style.name}
        description={`/${style.slug} · ${style.type}`}
      />

      <DetailTabs style={serialized} />
    </>
  );
}
