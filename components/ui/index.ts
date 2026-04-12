/**
 * components/ui/index.ts — Barrel export de componentes atómicos
 *
 * Importar desde '@/components/ui' en lugar de rutas individuales.
 *
 * @example
 * import { Button, Badge, SectionHeader, ServiceCard, GalleryItem } from '@/components/ui';
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { SectionHeader } from './SectionHeader';
export type { SectionHeaderProps } from './SectionHeader';

export { ServiceCard } from './ServiceCard';
export type { ServiceCardProps, ServiceCardService } from './ServiceCard';

export { GalleryItem } from './GalleryItem';
export type { GalleryItemProps, GalleryItemImage } from './GalleryItem';

export { ContactForm } from './ContactForm';
export type { ContactFormProps, ContactFormService } from './ContactForm';
