import { prisma } from '@/lib/db/client';
import { Prisma, type ReservationStatus } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReservationsTable, type ReservationRow } from './ReservationsTable';

export const dynamic = 'force-dynamic';

const VALID_STATUSES: ReservationStatus[] = [
  'DRAFT',
  'PENDING_PAYMENT',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'COMPLETED',
];

interface SearchParams {
  status?: string;
  from?: string;
  to?: string;
  q?: string;
  style?: string;
}

function parseFilters(params: SearchParams) {
  const statuses = params.status
    ? params.status
        .split(',')
        .filter((s): s is ReservationStatus =>
          VALID_STATUSES.includes(s as ReservationStatus),
        )
    : [];
  const from = params.from ? new Date(params.from) : undefined;
  const to = params.to ? new Date(params.to) : undefined;
  const q = params.q?.trim() || undefined;
  const style = params.style?.trim() || undefined;
  return { statuses, from, to, q, style };
}

async function getData(rawParams: SearchParams) {
  const { statuses, from, to, q, style } = parseFilters(rawParams);

  const where: Prisma.ReservationWhereInput = {};
  if (statuses.length > 0) where.status = { in: statuses };
  if (from || to) {
    where.startsAt = {};
    if (from) where.startsAt.gte = from;
    if (to) {
      const end = new Date(to);
      end.setDate(end.getDate() + 1);
      where.startsAt.lt = end;
    }
  }
  if (style) where.style = { slug: style };
  if (q) {
    where.user = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    };
  }

  const [reservations, styles] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy: { startsAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        style: { select: { name: true, slug: true } },
        styleSet: { select: { name: true } },
      },
    }),
    prisma.style.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const rows: ReservationRow[] = reservations.map((r) => ({
    id: r.id,
    customerName: r.user.name,
    customerEmail: r.user.email,
    styleName: r.style.name,
    setName: r.styleSet?.name ?? null,
    tier: r.tier,
    isExperienciaCompleta: r.isExperienciaCompleta,
    startsAt: r.startsAt.toISOString(),
    totalAmount: r.totalAmount.toNumber(),
    status: r.status,
  }));

  return { rows, styles };
}

export default async function AdminReservasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { rows, styles } = await getData(params);

  return (
    <>
      <PageHeader
        title="Reservas"
        description="Gestioná las reservas entrantes — filtrá, revisá detalle y cambiá estado."
      />
      <ReservationsTable rows={rows} styles={styles} />
    </>
  );
}
