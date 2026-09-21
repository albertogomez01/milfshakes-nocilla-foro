import React from 'react';
import { Scale, Shield } from 'lucide-react';

export default function Footer({ onOpenLegalModal }) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-card)',
        background: 'rgba(10, 6, 4, 0.95)',
        padding: '2rem 1.5rem',
        marginTop: '3rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Shield size={16} color="var(--accent-gold)" />
          <span style={{ fontWeight: 600 }}>El Milfterio del Picasso — Foro Independiente de la Comunidad</span>
        </div>

        <p style={{ maxWidth: '800px', lineHeight: '1.5', fontSize: '0.8rem' }}>
          Este sitio web es un foro no oficial creado de forma independiente por y para la comunidad de fans con fines informativos, de entretenimiento y debate. No está patrocinado, afiliado ni administrado por MILFSHAKES, S.L. ni IDILIA FOODS, S.L.U. (Nocilla). Todas las marcas pertenecen a sus respectivos titulares.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onOpenLegalModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-gold)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Scale size={14} />
            <span>Aviso Legal & Bases de la Comunidad</span>
          </button>
          <span>•</span>
          <span>© 2026 Comunidad El Milfterio</span>
        </div>
      </div>
    </footer>
  );
}
