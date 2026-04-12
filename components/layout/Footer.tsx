import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/galeria', label: 'Galería' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/contacto', label: 'Contacto' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-inverse-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Grid: 3 columnas desktop, stack mobile */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Col 1: Logo + tagline */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="font-serif text-2xl font-semibold text-inverse-primary transition-opacity hover:opacity-80"
            >
              MayuStudio
            </Link>
            <p className="text-sm leading-relaxed text-inverse-on-surface/80">
              Fotografía Infantil Boutique.
              <br />
              Capturamos los momentos únicos e irrepetibles de tu bebé con sensibilidad y arte.
            </p>
          </div>

          {/* Col 2: Links de navegación */}
          <div>
            <p className="label-caps mb-4 text-inverse-primary">Navegación</p>
            <ul className="flex flex-col gap-2" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-on-surface/80 transition-colors hover:text-inverse-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Redes sociales + contacto */}
          <div>
            <p className="label-caps mb-4 text-inverse-primary">Contacto</p>
            <div className="flex flex-col gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com/mayustudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguinos en Instagram"
                className="flex min-h-[44px] items-center gap-3 text-sm text-inverse-on-surface/80 transition-colors hover:text-inverse-primary"
              >
                {/* Icono Instagram */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                <span>@mayustudio</span>
              </a>

              {/* Email */}
              <a
                href="mailto:hola@mayustudio.com"
                className="flex min-h-[44px] items-center gap-3 text-sm text-inverse-on-surface/80 transition-colors hover:text-inverse-primary"
              >
                {/* Icono Email */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 8l10 6 10-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>hola@mayustudio.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="mt-10 border-t border-inverse-on-surface/10 pt-6">
          <p className="text-center text-sm text-inverse-on-surface/60">
            © {year} MayuStudio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
