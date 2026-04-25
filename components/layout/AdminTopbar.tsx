import Image from 'next/image';
import { auth } from '@/lib/auth';

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }
  return email?.[0]?.toUpperCase() ?? '?';
}

export async function AdminTopbar() {
  const session = await auth();
  const user = session?.user;
  const role = user?.role;

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-outline-variant/30 bg-surface-container-lowest px-6 pl-16 md:pl-6">
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-on-surface leading-tight">
            {user?.name ?? user?.email ?? 'Admin'}
          </p>
          {role && (
            <p className="text-[0.7rem] uppercase tracking-wider text-on-surface-variant leading-tight">
              {role}
            </p>
          )}
        </div>
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary-container text-primary flex items-center justify-center shadow-sm">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'Avatar'}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            <span className="text-sm font-semibold uppercase">
              {getInitials(user?.name, user?.email)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
