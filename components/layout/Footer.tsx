import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Estilos' },
  { href: '/especiales', label: 'Especiales' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low w-full pt-20 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 md:px-12 max-w-7xl mx-auto text-center md:text-left">
        {/* Logo + tagline */}
        <div>
          <span className="font-serif text-3xl text-[#3f2b22] mb-4 block italic">
            MayuStudio
          </span>
          <p className="font-sans leading-relaxed text-sm tracking-wide text-[#3f2b22]/70">
            Capturando la esencia de la infancia a través de una lente artística
            y delicada.
          </p>
        </div>

        {/* Navegación */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-primary mb-2 uppercase text-xs tracking-[0.2em]">
            Navegación
          </h4>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#3f2b22]/70 hover:underline decoration-1 underline-offset-4 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contacto */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-primary mb-2 uppercase text-xs tracking-[0.2em]">
            Contacto
          </h4>
          <p className="text-[#3f2b22]/70 text-sm">hola@mayustudio.com</p>
          <p className="text-[#3f2b22]/70 text-sm">+54 11 1234 5678</p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a
              href="https://instagram.com/mayustudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-70 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Instagram de MayuStudio"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3f2b22]/10 mt-16 pt-8 text-center px-8">
        <p className="font-sans text-xs text-[#3f2b22]/50">
          &copy; {new Date().getFullYear()} MayuStudio. Capturando la esencia de
          la infancia.
        </p>
      </div>
    </footer>
  );
}
