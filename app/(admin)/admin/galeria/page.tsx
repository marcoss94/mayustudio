import { prisma } from '@/lib/db/client';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  GalleryGrid,
  type GalleryImageRow,
  type StyleWithSets,
} from './GalleryGrid';

export const dynamic = 'force-dynamic';

async function getData(): Promise<{
  images: GalleryImageRow[];
  styleSlugs: StyleWithSets[];
}> {
  const [images, styles] = await Promise.all([
    prisma.galleryImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        url: true,
        alt: true,
        caption: true,
        order: true,
        isVisible: true,
        styleSlug: true,
        setSlug: true,
      },
    }),
    prisma.style.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        name: true,
        sets: {
          where: { isActive: true },
          select: { slug: true, name: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return { images, styleSlugs: styles };
}

export default async function AdminGaleriaPage() {
  const { images, styleSlugs } = await getData();

  return (
    <>
      <PageHeader
        title="Galería"
        description="Portfolio central curado. Alimenta /galeria, home y páginas de estilos + sets."
      />
      <GalleryGrid images={images} styleSlugs={styleSlugs} />
    </>
  );
}
