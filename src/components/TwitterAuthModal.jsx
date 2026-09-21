import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export default function TwitterAuthModal({ isOpen, onClose, onTwitterLoginSuccess }) {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const handleAuthorize = (e) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace(/^@/, '') || 'X_User';
    const cleanName = displayName.trim() || cleanHandle;

    setIsAuthorizing(true);

    setTimeout(() => {
      onTwitterLoginSuccess({
        id: 'twitter_' + Date.now(),
        username: cleanHandle,
        displayName: cleanName,
        badge: 'Twitter / X Verificado',
        isTwitterAuth: true,
        avatarColor: '#1DA1F2',
        bio: `Cuenta oficial verificada en X (@${cleanHandle}).`,
        reputation: 250,
      });

      setIsAuthorizing(false);
      setHandle('');
      setDisplayName('');
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', background: '#0F1419', border: '1px solid #1DA1F2' }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* SVG Logo oficial de X / Twitter */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <h2 className="modal-title" style={{ color: '#F7F9F9', fontSize: '1.25rem' }}>
              Iniciar sesión con X (Twitter)
            </h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0.5rem 0' }}>
          <div
            style={{
              background: 'rgba(29, 161, 242, 0.1)',
              border: '1px solid rgba(29, 161, 242, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              color: '#D9D9D9',
            }}
          >
            <div style={{ fontWeight: 700, color: '#1DA1F2', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} />
              <span>Solicitud de Autorización OAuth 2.0</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              <strong>Milfshakes x Nocilla Foro</strong> solicita acceso para verificar tu identidad mediante tu perfil público de X.
            </p>
          </div>

          <form onSubmit={handleAuthorize} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#A0A0A0' }}>Nombre de usuario en X (@username) *</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#161E27', borderColor: 'rgba(29,161,242,0.4)', color: '#FFF' }}
                placeholder="Ej: @IbaiLlanos o @tu_usuario"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#A0A0A0' }}>Nombre público a mostrar</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#161E27', borderColor: 'rgba(29,161,242,0.4)', color: '#FFF' }}
                placeholder="Ej: Ibai Llanos"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#8899A6', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: '#161E27', padding: '0.75rem', borderRadius: '8px' }}>
              <span style={{ fontWeight: 600 }}>Permisos que concederás a este foro:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#1DA1F2" /> Leer información básica del perfil e imagen de usuario.
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#1DA1F2" /> Otorgar insignia de usuario verificado con Check Azul.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isAuthorizing}
                style={{
                  background: 'linear-gradient(135deg, #1DA1F2, #0C7ABF)',
                  color: '#FFF',
                  boxShadow: '0 4px 15px rgba(29,161,242,0.4)',
                }}
              >
                {isAuthorizing ? 'Conectando con X...' : 'Autorización OAuth con X'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
