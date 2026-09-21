import React from 'react';
import { Search, PlusCircle, Sparkles, CheckCircle2, LogOut, Compass, MapPin } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
  activeProfile,
  onOpenProfileModal,
  onOpenTwitterAuthModal,
  onLogout,
  onOpenMapModal,
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#" className="brand-logo">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Compass size={28} color="#FF3366" />
            <Sparkles size={16} color="#E5A83B" style={{ position: 'absolute', top: -4, right: -6 }} />
          </div>
          <div>
            <span>MILFTERIO</span>
            <span style={{ color: 'var(--accent-gold)', marginLeft: '4px' }}>DEL PICASSO</span>
          </div>
          <span className="logo-badge" style={{ background: 'linear-gradient(135deg, #FF3366, #E5A83B)', color: '#000', fontWeight: 800 }}>
            FORO NO OFICIAL
          </span>
        </a>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar en el terminal del foro no oficial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-actions">
          {/* Botón Mapa de España */}
          <button
            className="btn-secondary"
            onClick={onOpenMapModal}
            style={{
              background: 'rgba(225, 29, 72, 0.15)',
              borderColor: 'rgba(225, 29, 72, 0.4)',
              color: '#FF3366',
              fontWeight: 700,
              padding: '0.6rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MapPin size={18} />
            <span>Mapa España</span>
          </button>

          {/* Botón de inicio de sesión con Twitter / X */}
          {!activeProfile?.isTwitterAuth && (
            <button
              className="btn-secondary"
              onClick={onOpenTwitterAuthModal}
              style={{
                background: 'rgba(29, 161, 242, 0.12)',
                borderColor: 'rgba(29, 161, 242, 0.4)',
                color: '#1DA1F2',
                fontWeight: 700,
                padding: '0.6rem 0.95rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Conectar X</span>
            </button>
          )}

          <button className="btn-primary" onClick={onOpenCreateModal}>
            <PlusCircle size={18} />
            <span>Crear Hilo</span>
          </button>
          
          <button
            onClick={onOpenProfileModal}
            className="btn-secondary"
            style={{
              padding: '0.45rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '12px',
              border: activeProfile?.isTwitterAuth ? '1px solid #1DA1F2' : '1px solid var(--border-card-hover)',
              background: activeProfile?.isTwitterAuth ? 'rgba(29, 161, 242, 0.1)' : undefined,
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: activeProfile?.avatarColor || 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#000',
                fontSize: '0.85rem',
              }}
            >
              {activeProfile ? activeProfile.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                @{activeProfile?.username || 'Usuario'}
                {activeProfile?.isTwitterAuth && <CheckCircle2 size={13} color="#1DA1F2" />}
              </div>
              <div style={{ fontSize: '0.7rem', color: activeProfile?.isTwitterAuth ? '#1DA1F2' : 'var(--accent-gold)' }}>
                {activeProfile?.badge || 'Miembro'}
              </div>
            </div>
          </button>

          {/* Botón Cerrar Sesión */}
          <button
            onClick={onLogout}
            className="btn-secondary"
            title="Cerrar Sesión"
            style={{ padding: '0.6rem', color: 'var(--text-muted)' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
