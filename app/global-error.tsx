'use client';

import NextError from 'next/error';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error: _error, reset }: GlobalErrorProps): React.JSX.Element {
  return (
    <html lang="es">
      <body>
        <NextError statusCode={0} />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={reset} type="button">
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
