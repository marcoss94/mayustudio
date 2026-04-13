/**
 * ServiceCard.tsx — Tarjeta de servicio con imagen dominante
 *
 * Server Component. Sin interactividad — el card entero es un Link.
 *
 * Design system "The Timeless Curator":
 * - glass-card: glassmorphism, rounded-xl, sin borders
 * - Imagen aspect-[4/3] arriba, texto overlapping abajo
 * - Badge absoluto top-right si existe
 * - CTA: Link envuelve el card completo (touch target = card completa)
 * - Precio: formatCurrency() (ARS)
 * - Sombra ambient ultra-difusa
 */

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Badge } from './Badge';

/**
 * Subconjunto de campos de Service necesarios para la card.
 * Usamos Pick explícito para no importar Decimal de Prisma en el cliente.
 * El precio debe venir ya convertido a number (via .toNumber() en el query helper).
 */
export interface ServiceCardService {
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
  duration: number | null;
  coverImage: string | null;
  badge: string | null;
}

export interface ServiceCardProps {
  service: ServiceCardService;
  /** true para la primera card above-the-fold (loading="eager"). */
  priority?: boolean;
  className?: string;
}

/** Imagen placeholder cuando no hay coverImage configurada. */
const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/mayustudio-default/800/600';

export function ServiceCard({ service, priority = false, className }: ServiceCardProps) {
  const {
    name,
    slug,
    shortDescription,
    price,
    duration,
    coverImage,
    badge,
  } = service;

  const href = `/servicios/${slug}`;
  const imageSrc = coverImage ?? PLACEHOLDER_IMAGE;

  // Mapear badge text a variante del Badge component
  function getBadgeVariant(text: string): 'default' | 'popular' | 'new' | 'seasonal' {
    const lower = text.toLowerCase();
    if (lower.includes('popular')) return 'popular';
    if (lower.includes('nuevo') || lower.includes('new')) return 'new';
    if (lower.includes('estacional') || lower.includes('seasonal')) return 'seasonal';
    return 'default';
  }

  return (
    <Link
      href={href}
      className={cn(
        'group block glass-card overflow-hidden',
        // Hover: elevación suave
        'transition-all duration-300 hover:shadow-[var(--shadow-glass-hover)] hover:-translate-y-1',
        // Touch target: el card completo (min-h implícito por contenido)
        className,
      )}
      aria-label={`Ver detalles de ${name}`}
    >
      {/* ── Imagen con aspect ratio fijo ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={`Sesión ${name} de MayuStudio`}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />

        {/* Gradient overlay inferior para legibilidad del texto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgba(27,28,20,0.4)] via-transparent to-transparent"
        />

        {/* Badge absoluto — top right, solo si existe */}
        {badge && (
          <div className="absolute top-3 right-3">
            <Badge variant={getBadgeVariant(badge)}>{badge}</Badge>
          </div>
        )}

        {/* Badge — bottom left de la imagen */}
        {badge && (
          <div className="absolute bottom-3 left-3">
            <span className="label-caps text-[var(--color-inverse-on-surface)] opacity-90">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* ── Contenido textual ── */}
      <div className="p-5 flex flex-col gap-3">
        {/* Nombre del servicio */}
        <h3 className="font-serif text-headline-md text-on-surface leading-tight group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>

        {/* Descripción corta */}
        {shortDescription && (
          <p className="font-sans text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        )}

        {/* Precio + duración en fila */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {price !== null && (
            <span className="font-serif text-headline-sm text-primary font-semibold">
              {formatCurrency(price)}
            </span>
          )}
          {duration !== null && (
            <span className="label-caps text-[var(--color-on-surface-variant)]">
              {duration} min
            </span>
          )}
        </div>

        {/* CTA inline — accesible, aunque el card completo es clickable */}
        <span
          aria-hidden="true"
          className="label-caps text-primary flex items-center gap-1 mt-1"
        >
          Ver detalle
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default ServiceCard;
