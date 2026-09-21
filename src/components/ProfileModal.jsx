import React, { useState } from 'react';
import { X, User, Check, Award, UserPlus, CheckCircle2 } from 'lucide-react';

const AVATAR_COLORS = [
  { name: 'Gold Nocilla', color: '#E5A83B' },
  { name: 'Rosa Milkshake', color: '#FF3366' },
  { name: 'Chocolate Extra', color: '#8D5B4C' },
  { name: 'Verde Hacker', color: '#4CAF50' },
  { name: 'Púrpura Místico', color: '#9C27B0' },
];

const BADGE_OPTIONS = [
  'Hunter Pro',
  'Investigador',
  'Descifrador',
  'Nocilla Mod',
  'Chocolate Master',
  'Buscador de Pistas',
  'Fan Nocilla',
];

export default function ProfileModal({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onCreateProfile,
  onOpenTwitterAuthModal,
}) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Profile Form State
  const [username, setUsername] = useState('');
  const [badge, setBadge] = useState('Investigador');
  const [bio, setBio] = useState('');
  const [selectedColor, setSelectedColor] = useState('#E5A83B');

  if (!isOpen) return null;

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    const newProf = {
      id: 'user_' + Date.now(),
      username: username.trim().replace(/^@/, ''),
      badge: badge,
      bio: bio.trim() || 'Apasionado de la comunidad y del reto Milfshakes x Nocilla.',
      avatarColor: selectedColor,
      reputation: 10,
      createdAt: 'Hoy',
    };

    onCreateProfile(newProf);
    setIsCreatingNew(false);
    setUsername('');
    setBio('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User color="var(--accent-gold)" size={22} />
            <h2 className="modal-title">Gestión de Perfiles de Usuario</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {isCreatingNew ? (
          /* Formulario de Creación de Perfil */
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                ✨ Crear Nuevo Perfil de Miembro
              </h3>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de usuario / Nick *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: ChocoSolver, PistaHunter99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Insignia / Rol en la comunidad</label>
              <select className="form-select" value={badge} onChange={(e) => setBadge(e.target.value)}>
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Color de Avatar / Estilo</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '0.25rem' }}>
                {AVATAR_COLORS.map((c) => (
                  <div
                    key={c.color}
                    onClick={() => setSelectedColor(c.color)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: c.color,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: selectedColor === c.color ? '3px solid #FFF' : '2px solid transparent',
                      boxShadow: selectedColor === c.color ? '0 0 10px ' + c.color : 'none',
                    }}
                  >
                    {selectedColor === c.color && <Check size={18} color="#000" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Biografía / Presentación</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '80px' }}
                placeholder="Escribe brevemente tu experiencia en el reto..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsCreatingNew(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Perfil
              </button>
            </div>
          </form>
        ) : (
          /* Vista de Perfiles y Selector */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Perfil Activo Destacado */}
            <div
              style={{
                background: activeProfile.isTwitterAuth
                  ? 'linear-gradient(135deg, rgba(29, 161, 242, 0.2), rgba(15, 20, 25, 0.9))'
                  : 'linear-gradient(135deg, rgba(229,168,59,0.15), rgba(255,51,102,0.1))',
                border: activeProfile.isTwitterAuth ? '1px solid #1DA1F2' : '1px solid var(--accent-gold)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: activeProfile.avatarColor || 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: '#FFF',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  }}
                >
                  {activeProfile.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                      @{activeProfile.username}
                    </h3>
                    {activeProfile.isTwitterAuth && <CheckCircle2 size={16} color="#1DA1F2" />}
                    <span className="author-badge" style={{ background: activeProfile.isTwitterAuth ? 'rgba(29,161,242,0.2)' : undefined, color: activeProfile.isTwitterAuth ? '#1DA1F2' : undefined }}>
                      {activeProfile.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {activeProfile.bio}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REPUTACIÓN</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: activeProfile.isTwitterAuth ? '#1DA1F2' : 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={18} />
                  {activeProfile.reputation || 50} pts
                </div>
              </div>
            </div>

            {/* Acciones de Perfil */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Perfiles disponibles ({profiles.length})
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-secondary"
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      borderColor: 'rgba(29,161,242,0.4)',
                      color: '#1DA1F2',
                      background: 'rgba(29,161,242,0.1)',
                    }}
                    onClick={() => {
                      onClose();
                      onOpenTwitterAuthModal();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Login con X / Twitter</span>
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => setIsCreatingNew(true)}
                  >
                    <UserPlus size={16} />
                    <span>Nuevo Perfil</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {profiles.map((p) => {
                  const isCurrent = p.id === activeProfileId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSwitchProfile(p.id)}
                      style={{
                        background: isCurrent
                          ? p.isTwitterAuth
                            ? 'rgba(29,161,242,0.2)'
                            : 'rgba(229,168,59,0.15)'
                          : 'rgba(0,0,0,0.3)',
                        border: isCurrent
                          ? p.isTwitterAuth
                            ? '1px solid #1DA1F2'
                            : '1px solid var(--accent-gold)'
                          : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: p.avatarColor || 'var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          color: '#FFF',
                          fontSize: '0.95rem',
                        }}
                      >
                        {p.username.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          @{p.username}
                          {p.isTwitterAuth && <CheckCircle2 size={13} color="#1DA1F2" />}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: p.isTwitterAuth ? '#1DA1F2' : 'var(--accent-gold)' }}>
                          {p.badge}
                        </div>
                      </div>

                      {isCurrent && <Check size={18} color={p.isTwitterAuth ? '#1DA1F2' : 'var(--accent-gold)'} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
