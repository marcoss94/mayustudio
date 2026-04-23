'use server';

import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { auth, signIn, signOut } from '@/lib/auth';
import type { ActionResult } from '@/types';

// ─── Login ───────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: 'Credenciales inválidas' };
    }
    throw err;
  }

  // Redirect según role
  const session = await auth();
  const role = session?.user?.role;
  const dest =
    role === 'ADMIN' || role === 'SUPERADMIN' ? '/admin' : '/mis-reservas';
  redirect(dest);
}

// ─── Registro ────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nombre muy corto').max(80),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres').max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export async function registerAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { success: false, error: 'Ese email ya está registrado' };
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hash,
      role: 'CLIENT',
    },
  });

  // Auto-login después de registrar
  try {
    await signIn('credentials', {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch {
    // Si falla auto-login, redirige a /login
    redirect('/login');
  }

  redirect('/mis-reservas');
}

// ─── Logout ──────────────────────────────────────────────────────────

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect('/');
}

// ─── Google OAuth ────────────────────────────────────────────────────

export async function googleSignInAction() {
  await signIn('google', { redirectTo: '/mis-reservas' });
}
