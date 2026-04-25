'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import {
  galleryImageSchema,
  type GalleryImageInput,
} from '@/lib/validations/gallery';
import type { ActionResult, GalleryImage } from '@/types';

async function requireAdmin(): Promise<{ success: false; error: string } | null> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    return { success: false, error: 'No autorizado' };
  }
  return null;
}

async function validateStyleSlug(slug: string | null | undefined): Promise<boolean> {
  if (!slug) return true;
  const exists = await prisma.style.findUnique({
    where: { slug },
    select: { id: true },
  });
  return exists !== null;
}

async function validateSetSlug(
  setSlug: string | null | undefined,
  styleSlug: string | null | undefined,
): Promise<boolean> {
  if (!setSlug) return true;
  if (!styleSlug) return false;
  const exists = await prisma.styleSet.findFirst({
    where: { slug: setSlug, style: { slug: styleSlug } },
    select: { id: true },
  });
  return exists !== null;
}

function revalidateGallery(styleSlug?: string | null, setSlug?: string | null) {
  revalidatePath('/admin/galeria');
  revalidatePath('/galeria');
  revalidatePath('/');
  revalidatePath('/experiencia-completa');
  if (styleSlug) {
    revalidatePath(`/servicios/${styleSlug}`);
    if (setSlug) revalidatePath(`/servicios/${styleSlug}/${setSlug}`);
  }
}

function mapPrismaError(err: unknown, fallback = 'Error en la operación'): string {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return 'Imagen no encontrada';
  }
  return fallback;
}

function normalize(raw: GalleryImageInput): GalleryImageInput {
  return {
    ...raw,
    caption: raw.caption === '' ? undefined : raw.caption,
    styleSlug:
      raw.styleSlug === '' || raw.styleSlug === null ? null : raw.styleSlug,
    setSlug:
      raw.setSlug === '' || raw.setSlug === null ? null : raw.setSlug,
  };
}

export async function createGalleryImage(
  raw: GalleryImageInput,
): Promise<ActionResult<GalleryImage>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = galleryImageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const data = normalize(parsed.data);

  if (!(await validateStyleSlug(data.styleSlug))) {
    return { success: false, error: 'Estilo no válido' };
  }
  if (!(await validateSetSlug(data.setSlug, data.styleSlug))) {
    return { success: false, error: 'Set no válido para este estilo' };
  }

  try {
    const image = await prisma.galleryImage.create({
      data: {
        url: data.url,
        alt: data.alt,
        caption: data.caption,
        order: data.order,
        isVisible: data.isVisible,
        styleSlug: data.styleSlug,
        setSlug: data.setSlug,
      },
    });
    revalidateGallery(image.styleSlug, image.setSlug);
    return { success: true, data: image };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo crear la imagen') };
  }
}

export async function updateGalleryImage(
  id: string,
  raw: GalleryImageInput,
): Promise<ActionResult<GalleryImage>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = galleryImageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const data = normalize(parsed.data);

  if (!(await validateStyleSlug(data.styleSlug))) {
    return { success: false, error: 'Estilo no válido' };
  }
  if (!(await validateSetSlug(data.setSlug, data.styleSlug))) {
    return { success: false, error: 'Set no válido para este estilo' };
  }

  try {
    const existing = await prisma.galleryImage.findUnique({
      where: { id },
      select: { styleSlug: true, setSlug: true },
    });

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        url: data.url,
        alt: data.alt,
        caption: data.caption,
        order: data.order,
        isVisible: data.isVisible,
        styleSlug: data.styleSlug,
        setSlug: data.setSlug,
      },
    });
    revalidateGallery(image.styleSlug, image.setSlug);
    if (existing?.styleSlug && existing.styleSlug !== image.styleSlug) {
      revalidateGallery(existing.styleSlug, existing.setSlug);
    }
    return { success: true, data: image };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo actualizar la imagen') };
  }
}

export async function deleteGalleryImage(id: string): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const existing = await prisma.galleryImage.findUnique({
      where: { id },
      select: { styleSlug: true, setSlug: true },
    });
    await prisma.galleryImage.delete({ where: { id } });
    revalidateGallery(existing?.styleSlug, existing?.setSlug);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo eliminar la imagen') };
  }
}

export async function toggleGalleryVisible(
  id: string,
  isVisible: boolean,
): Promise<ActionResult<GalleryImage>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const image = await prisma.galleryImage.update({
      where: { id },
      data: { isVisible },
    });
    revalidateGallery(image.styleSlug, image.setSlug);
    return { success: true, data: image };
  } catch (err) {
    return { success: false, error: mapPrismaError(err) };
  }
}
