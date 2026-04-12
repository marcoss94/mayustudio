/**
 * emails/contact-notification.tsx — Email de notificación para la fotógrafa
 *
 * Se envía a CONTACT_EMAIL cuando alguien completa el formulario de contacto.
 */

import type { ContactInput } from '@/lib/validations/contact';

interface ContactNotificationProps {
  data: ContactInput;
}

const SERVICE_LABELS: Record<string, string> = {
  'cake-smash': 'Cake Smash',
  'fine-art': 'Fine Art',
  minimalista: 'Minimalista',
  'especiales-estacionales': 'Especiales y Estacionales',
  'experiencia-completa': 'Experiencia Completa',
};

export function ContactNotificationEmail({ data }: ContactNotificationProps) {
  const serviceName = data.serviceSlug
    ? (SERVICE_LABELS[data.serviceSlug] ?? data.serviceSlug)
    : 'No especificado';

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nuevo mensaje de contacto — MayuStudio</title>
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
            }}
          >
            <p
              style={{
                color: '#ffffff',
                fontFamily: "'Georgia', serif",
                fontSize: '22px',
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
          <div style={{ padding: '40px' }}>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#1b1c14',
                margin: '0 0 8px',
              }}
            >
              Nuevo mensaje de contacto
            </h1>
            <p
              style={{
                color: '#4f453e',
                fontSize: '14px',
                margin: '0 0 32px',
              }}
            >
              Alguien completó el formulario de tu sitio web.
            </p>

            {/* Datos */}
            <table
              cellPadding={0}
              cellSpacing={0}
              style={{ width: '100%', borderCollapse: 'collapse' }}
            >
              <tbody>
                <DataRow label="Nombre" value={data.name} />
                <DataRow label="Email" value={data.email} />
                {data.phone && <DataRow label="Teléfono" value={data.phone} />}
                <DataRow label="Sesión de interés" value={serviceName} />
              </tbody>
            </table>

            {/* Mensaje */}
            <div
              style={{
                marginTop: '24px',
                padding: '20px',
                backgroundColor: '#f6f4e7',
                borderRadius: '12px',
                borderLeft: '3px solid #735640',
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#735640',
                  margin: '0 0 12px',
                }}
              >
                Mensaje
              </p>
              <p
                style={{
                  color: '#1b1c14',
                  fontSize: '15px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {data.message}
              </p>
            </div>

            {/* CTA */}
            <div style={{ marginTop: '32px', textAlign: 'center' as const }}>
              <a
                href={`mailto:${data.email}`}
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
                Responder a {data.name}
              </a>
            </div>
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
          </div>
        </div>
      </body>
    </html>
  );
}

/**
 * Fila de datos para la tabla del email
 */
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          padding: '12px 0',
          borderBottom: '1px solid #e5e3d6',
          width: '40%',
          verticalAlign: 'top',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            color: '#81756d',
          }}
        >
          {label}
        </span>
      </td>
      <td
        style={{
          padding: '12px 0',
          borderBottom: '1px solid #e5e3d6',
          verticalAlign: 'top',
        }}
      >
        <span style={{ fontSize: '15px', color: '#1b1c14' }}>{value}</span>
      </td>
    </tr>
  );
}

export default ContactNotificationEmail;
