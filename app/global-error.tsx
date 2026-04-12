'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        {/* Render the default Next.js error page */}
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
