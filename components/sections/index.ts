/**
 * components/sections/index.ts — Barrel export de componentes de sección
 *
 * Importar desde '@/components/sections' en lugar de rutas individuales.
 *
 * @example
 * import { HeroSection, FeaturedServices, GalleryGrid } from '@/components/sections';
 */

export { HeroSection } from './HeroSection';
export type { HeroSectionProps, HeroCTA } from './HeroSection';

export { FeaturedServices } from './FeaturedServices';

export { GalleryPreview } from './GalleryPreview';

export { TestimonialsSection } from './TestimonialsSection';

export { GalleryGrid } from './GalleryGrid';
export type { GalleryGridProps, GalleryImage, GalleryService } from './GalleryGrid';

export { HowItWorks } from './HowItWorks';
export type { HowItWorksProps, HowItWorksStep } from './HowItWorks';

export { FAQ } from './FAQ';
export type { FAQProps, FAQItem } from './FAQ';

export { ExperienciaConfigurator } from './ExperienciaConfigurator';
export type { ExperienciaConfiguratorProps, ConfigStyle, ConfigSet } from './ExperienciaConfigurator';

export { SpecialsBanner } from './SpecialsBanner';
export type { SpecialsBannerProps, BannerSpecial } from './SpecialsBanner';
