import { Calendar, CreditCard, Users, Clock } from 'lucide-react';
import { prisma } from '@/lib/db/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    const [
      reservationsToday,
      reservationsMonth,
      pendingPayments,
      totalClients,
      approvedMonthAgg,
      upcoming,
    ] = await Promise.all([
      prisma.reservation.count({
        where: { startsAt: { gte: startOfDay, lt: endOfDay } },
      }),
      prisma.reservation.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.reservation.count({
        where: { status: 'PENDING_PAYMENT' },
      }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'APPROVED', paidAt: { gte: startOfMonth } },
      }),
      prisma.reservation.findMany({
        where: {
          startsAt: { gte: now },
          status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
        },
        orderBy: { startsAt: 'asc' },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          style: { select: { name: true } },
        },
      }),
    ]);

    const revenue = Number(approvedMonthAgg._sum.amount ?? 0);

    return {
      reservationsToday,
      reservationsMonth,
      pendingPayments,
      totalClients,
      revenue,
      upcoming,
    };
  } catch {
    return {
      reservationsToday: 0,
      reservationsMonth: 0,
      pendingPayments: 0,
      totalClients: 0,
      revenue: 0,
      upcoming: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen general del estudio — reservas, pagos y clientes."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Reservas hoy"
          value={stats.reservationsToday}
          icon={Calendar}
        />
        <StatCard
          label="Reservas del mes"
          value={stats.reservationsMonth}
          hint="creadas desde el día 1"
          icon={Clock}
        />
        <StatCard
          label="Ingresos del mes"
          value={formatCurrency(stats.revenue)}
          hint="pagos aprobados"
          icon={CreditCard}
        />
        <StatCard
          label="Clientes"
          value={stats.totalClients}
          icon={Users}
        />
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-serif text-xl italic font-semibold text-on-surface">
            Próximas reservas
          </h2>
          {stats.pendingPayments > 0 && (
            <span className="text-xs text-error">
              {stats.pendingPayments} con pago pendiente
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
          {stats.upcoming.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-on-surface-variant">
                No hay reservas próximas.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant/20 list-none">
              {stats.upcoming.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {r.user.name ?? r.user.email}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {r.style.name} · {formatDate(r.startsAt)}
                    </p>
                  </div>
                  <span
                    className={
                      r.status === 'CONFIRMED'
                        ? 'text-xs font-medium text-primary'
                        : 'text-xs font-medium text-error'
                    }
                  >
                    {r.status === 'CONFIRMED' ? 'Confirmada' : 'Pago pendiente'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
