import React from 'react';
import { X, ShieldCheck, Scale, AlertCircle } from 'lucide-react';

export default function LegalNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale color="var(--accent-gold)" size={22} />
            <h2 className="modal-title">Aviso Legal y Términos de la Comunidad</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <div
            style={{
              background: 'rgba(229,168,59,0.1)',
              border: '1px solid rgba(229,168,59,0.3)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <ShieldCheck size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '0.2rem' }}>
                Foro Independiente No Oficial de Fans
              </strong>
              Este sitio web es un foro de discusión e investigación independiente creado por la comunidad de fans para el debate, la recopilación de teorías y el entretenimiento.
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              1. Desvinculación de las Marcas Organizadoras
            </h3>
            <p>
              Esta plataforma no está patrocinada, avalada, administrada ni vinculada oficialmente con <strong>MILFSHAKES, S.L.</strong> ni <strong>IDILIA FOODS, S.L.U. (Nocilla)</strong>. Todas las marcas registradas, nombres comerciales e imágenes mencionadas pertenecen a sus respectivos titulares conforme a la legislación aplicable.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              2. Requisitos para el Premio Oficial (Bases Legales Art. 5.1.c)
            </h3>
            <p style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              ⚠️ <strong>Recordatorio Legal:</strong> La resolución de pruebas en este foro tiene fines de debate comunitario. Conforme a las Bases Legales oficiales de la activación promocional, para poder optar a ser validado como ganador del premio oficial (la obra de arte valorada en 15.000 €), el participante debe haber adquirido legítimamente los <strong>tres (3) vasos coleccionables promocionales MILFSHAKES x Nocilla</strong> y conservar los correspondientes justificantes/tickets de compra.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              3. Ficción Publicitaria y Buen Uso
            </h3>
            <p>
              Toda la narrativa relativa a la investigación artística constituye una obra de ficción publicitaria de entretenimiento. Los usuarios se comprometen a utilizar el foro de manera respetuosa, sin realizar ataques técnicos automatizados ni suplantaciones de identidad.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button className="btn-primary" onClick={onClose}>
              Entendido y Aceptado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
