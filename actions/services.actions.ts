'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import {
  styleSchema,
  styleSetSchema,
  styleExtraSchema,
  type StyleInput,
  type StyleSetInput,
  type StyleExtraInput,
} from '@/lib/validations/services';
import type { ActionResult, Style, StyleSet, StyleExtra } from '@/types';

// ─── Guards ──────────────────────────────────────────────────────────

async function requireAdmin(): Promise<{ success: false; error: string } | null> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    return { success: false, error: 'No autorizado' };
  }
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function revalidateServices(slug?: string) {
  revalidatePath('/admin/servicios');
  revalidatePath('/servicios');
  if (slug) revalidatePath(`/servicios/${slug}`);
}

function emptyToUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const k in out) {
    if (out[k] === '') out[k] = undefined as T[Extract<keyof T, string>];
  }
  return out;
}

function mapPrismaError(err: unknown, fallback = 'Error en la operación'): string {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return 'Slug ya existe';
    if (err.code === 'P2003' || err.code === 'P2014')
      return 'Tiene reservas asociadas. Desactivalo en lugar de eliminar.';
    if (err.code === 'P2025') return 'Registro no encontrado';
  }
  return fallback;
}

// ─── Style: Create ───────────────────────────────────────────────────

export async function createStyle(
  raw: StyleInput,
): Promise<ActionResult<Style>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = styleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  try {
    const style = await prisma.style.create({
      data: emptyToUndefined(parsed.data),
    });
    revalidateServices(style.slug);
    return { success: true, data: style };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo crear el estilo') };
  }
}

// ─── Style: Update ───────────────────────────────────────────────────

export async function updateStyle(
  id: string,
  raw: StyleInput,
): Promise<ActionResult<Style>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = styleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  try {
    const existing = await prisma.style.findUnique({
      where: { id },
      include: { _count: { select: { sets: true } } },
    });
    if (!existing) return { success: false, error: 'Estilo no encontrado' };

    // Bloquear cambio de type SETS_AND_TIERS → otro si tiene sets
    if (
      existing.type === 'SETS_AND_TIERS' &&
      parsed.data.type !== 'SETS_AND_TIERS' &&
      existing._count.sets > 0
    ) {
      return {
        success: false,
        error: 'Eliminá los sets antes de cambiar el tipo',
      };
    }

    const style = await prisma.style.update({
      where: { id },
      data: emptyToUndefined(parsed.data),
    });
    revalidateServices(style.slug);
    if (existing.slug !== style.slug) revalidateServices(existing.slug);
    return { success: true, data: style };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo actualizar el estilo') };
  }
}

// ─── Style: Delete ───────────────────────────────────────────────────

export async function deleteStyle(id: string): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const style = await prisma.style.findUnique({ where: { id }, select: { slug: true } });
    await prisma.style.delete({ where: { id } });
    revalidateServices(style?.slug);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo eliminar el estilo') };
  }
}

// ─── Style: Toggles ──────────────────────────────────────────────────

export async function toggleStyleActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult<Style>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const style = await prisma.style.update({ where: { id }, data: { isActive } });
    revalidateServices(style.slug);
    return { success: true, data: style };
  } catch (err) {
    return { success: false, error: mapPrismaError(err) };
  }
}

export async function toggleStyleVisible(
  id: string,
  isVisible: boolean,
): Promise<ActionResult<Style>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const style = await prisma.style.update({ where: { id }, data: { isVisible } });
    revalidateServices(style.slug);
    return { success: true, data: style };
  } catch (err) {
    return { success: false, error: mapPrismaError(err) };
  }
}

// ─── StyleSet: Create ────────────────────────────────────────────────

export async function createStyleSet(
  styleId: string,
  raw: StyleSetInput,
): Promise<ActionResult<StyleSet>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = styleSetSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  try {
    const style = await prisma.style.findUnique({ where: { id: styleId }, select: { slug: true, type: true } });
    if (!style) return { success: false, error: 'Estilo no encontrado' };
    if (style.type !== 'SETS_AND_TIERS') {
      return { success: false, error: 'Solo estilos SETS_AND_TIERS pueden tener sets' };
    }

    const set = await prisma.styleSet.create({
      data: { ...emptyToUndefined(parsed.data), styleId },
    });
    revalidateServices(style.slug);
    return { success: true, data: set };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo crear el set') };
  }
}

// ─── StyleSet: Update ────────────────────────────────────────────────

export async function updateStyleSet(
  id: string,
  raw: StyleSetInput,
): Promise<ActionResult<StyleSet>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = styleSetSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  try {
    const set = await prisma.styleSet.update({
      where: { id },
      data: emptyToUndefined(parsed.data),
      include: { style: { select: { slug: true } } },
    });
    revalidateServices(set.style.slug);
    return { success: true, data: set };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo actualizar el set') };
  }
}

// ─── StyleSet: Delete ────────────────────────────────────────────────

export async function deleteStyleSet(id: string): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const set = await prisma.styleSet.findUnique({
      where: { id },
      include: { style: { select: { slug: true } } },
    });
    await prisma.styleSet.delete({ where: { id } });
    revalidateServices(set?.style.slug);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo eliminar el set') };
  }
}

// ─── StyleSet: Toggle ────────────────────────────────────────────────

export async function toggleStyleSetActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult<StyleSet>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const set = await prisma.styleSet.update({
      where: { id },
      data: { isActive },
      include: { style: { select: { slug: true } } },
    });
    revalidateServices(set.style.slug);
    return { success: true, data: set };
  } catch (err) {
    return { success: false, error: mapPrismaError(err) };
  }
}

// ─── StyleExtra: CRUD ────────────────────────────────────────────────

export async function createStyleExtra(
  styleId: string,
  raw: StyleExtraInput,
): Promise<ActionResult<StyleExtra>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = styleExtraSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  try {
    const style = await prisma.style.findUnique({ where: { id: styleId }, select: { slug: true } });
    if (!style) return { success: false, error: 'Estilo no encontrado' };

    const extra = await prisma.styleExtra.create({
      data: { ...parsed.data, styleId },
    });
    revalidateServices(style.slug);
    return { success: true, data: extra };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo crear el extra') };
  }
}

export async function updateStyleExtra(
  id: string,
  raw: StyleExtraInput,
): Promise<ActionResult<StyleExtra>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = styleExtraSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  try {
    const extra = await prisma.styleExtra.update({
      where: { id },
      data: parsed.data,
      include: { style: { select: { slug: true } } },
    });
    revalidateServices(extra.style.slug);
    return { success: true, data: extra };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo actualizar el extra') };
  }
}

export async function deleteStyleExtra(id: string): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const extra = await prisma.styleExtra.findUnique({
      where: { id },
      include: { style: { select: { slug: true } } },
    });
    await prisma.styleExtra.delete({ where: { id } });
    revalidateServices(extra?.style.slug);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo eliminar el extra') };
  }
}

export async function toggleStyleExtraActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult<StyleExtra>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const extra = await prisma.styleExtra.update({
      where: { id },
      data: { isActive },
      include: { style: { select: { slug: true } } },
    });
    revalidateServices(extra.style.slug);
    return { success: true, data: extra };
  } catch (err) {
    return { success: false, error: mapPrismaError(err) };
  }
}
