/**
 * emails/contact-confirmation.tsx — Email de confirmación para el cliente
 *
 * Se envía al cliente que completó el formulario de contacto.
 */

interface ContactConfirmationProps {
  name: string;
  appUrl?: string;
}

export function ContactConfirmationEmail({
  name,
  appUrl = 'https://mayustudio.com',
}: ContactConfirmationProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Recibimos tu mensaje — MayuStudio</title>
      </head>
      <body
        style={{
          fontFamily: "'Inter', 'system-ui', sans-serif",
          backgroundColor: '#fcfaed',
          color: '#1b1c14',
          margin: 0,
          padding: '40px 16px',
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(63, 43, 34, 0.08)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #735640 0%, #8e6e57 100%)',
              padding: '32px 40px',
              textAlign: 'center' as const,
            }}
          >
            <p
              style={{
                color: '#ffffff',
                fontFamily: "'Georgia', serif",
                fontSize: '24px',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              MayuStudio
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '13px',
                margin: '4px 0 0',
              }}
            >
              Fotografía Infantil Boutique
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '40px', textAlign: 'center' as const }}>
            {/* Icono decorativo */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f6f4e7',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              ✓
            </div>

            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: '22px',
                fontWeight: 600,
                color: '#1b1c14',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              Recibimos tu mensaje, {name}
            </h1>

            <p
              style={{
                color: '#4f453e',
                fontSize: '15px',
                margin: '0 0 24px',
                maxWidth: '380px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Gracias por contactarte con MayuStudio. Te responderemos dentro de
              las próximas <strong>24 a 48 horas</strong> para coordinar todos
              los detalles de tu sesión.
            </p>

            <div
              style={{
                backgroundColor: '#f6f4e7',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '32px',
                textAlign: 'left' as const,
              }}
            >
              <p
                style={{
                  color: '#735640',
                  fontSize: '13px',
                  fontWeight: 600,
                  margin: '0 0 8px',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Mientras esperás
              </p>
              <p
                style={{
                  color: '#4f453e',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Podés explorar nuestra galería de trabajos y conocer todos los
                servicios disponibles para encontrar la sesión perfecta para tu
                familia.
              </p>
            </div>

            <a
              href={`${appUrl}/galeria`}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #735640 0%, #8e6e57 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Ver galería
            </a>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: '1px solid #e5e3d6',
              padding: '20px 40px',
              textAlign: 'center' as const,
            }}
          >
            <p style={{ color: '#81756d', fontSize: '12px', margin: 0 }}>
              MayuStudio — Fotografía Infantil Boutique
            </p>
            <p style={{ color: '#81756d', fontSize: '12px', margin: '4px 0 0' }}>
              Si no fuiste vos quien envió este mensaje, podés ignorar este
              correo.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

export default ContactConfirmationEmail;
