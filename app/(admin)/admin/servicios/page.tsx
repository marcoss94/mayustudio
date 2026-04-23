import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/db/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StylesTable, type StyleRow } from './StylesTable';

export const dynamic = 'force-dynamic';

async function getStyles(): Promise<StyleRow[]> {
  const styles = await prisma.style.findMany({
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      price: true,
      isActive: true,
      isVisible: true,
      displayOrder: true,
      _count: { select: { sets: true, extras: true } },
      sets: { select: { standardPrice: true, premiumPrice: true, customPrice: true, isCustom: true } },
    },
  });

  return styles.map((s) => {
    let priceLabel: string | null = null;
    if (s.type === 'SETS_AND_TIERS' && s.sets.length > 0) {
      const prices = s.sets.flatMap((set) =>
        set.isCustom && set.customPrice
          ? [set.customPrice.toNumber()]
          : [set.standardPrice.toNumber(), set.premiumPrice.toNumber()],
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      priceLabel = min === max ? String(min) : `${min} – ${max}`;
    } else if (s.price) {
      priceLabel = String(s.price.toNumber());
    }

    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      type: s.type,
      priceLabel,
      setsCount: s._count.sets,
      extrasCount: s._count.extras,
      isActive: s.isActive,
      isVisible: s.isVisible,
      displayOrder: s.displayOrder,
    };
  });
}

export default async function AdminServiciosPage() {
  const styles = await getStyles();

  return (
    <>
      <PageHeader
        title="Servicios"
        description="Estilos, sets, tiers y extras. Desde acá configurás el catálogo completo."
        actions={
          <Button asChild variant="primary" size="sm">
            <Link href="/admin/servicios/nuevo">
              <Plus className="w-4 h-4" strokeWidth={2} />
              Nuevo estilo
            </Link>
          </Button>
        }
      />

      <StylesTable data={styles} />
    </>
  );
}
