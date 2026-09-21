import React, { useState } from 'react';
import { Milk, Sparkles, Shield, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthGate({ onLoginSuccess, onOpenTwitterAuth, onOpenProfileModal }) {
  const [quickUsername, setQuickUsername] = useState('');

  const handleQuickLogin = (e) => {
    e.preventDefault();
    if (!quickUsername.trim()) return;

    onLoginSuccess({
      id: 'user_' + Date.now(),
      username: quickUsername.trim().replace(/^@/, ''),
      badge: 'Investigador',
      bio: 'Miembro verificado de la comunidad.',
      avatarColor: '#E5A83B',
      reputation: 20,
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'radial-gradient(circle at 50% 30%, #2A170E 0%, #0D0805 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(229,168,59,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,51,102,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(23, 15, 10, 0.85)',
          border: '1px solid var(--border-card-hover)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255,51,102,0.2), rgba(229,168,59,0.2))',
            border: '1px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 25px rgba(229,168,59,0.25)',
          }}
        >
          <Milk size={38} color="#FF3366" />
        </div>

        <div className="logo-badge" style={{ marginBottom: '0.75rem', padding: '0.3rem 0.75rem' }}>
          🔒 ACCESO PRIVADO
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #FFF7F0 0%, #E5A83B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Milfshakes x Nocilla
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          Inicia sesión para acceder al foro de la comunidad, participar en los debates y consultar las pistas del reto.
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Twitter / X Login Button */}
          <button
            onClick={onOpenTwitterAuth}
            style={{
              width: '100%',
              background: '#0F1419',
              border: '1px solid #1DA1F2',
              color: '#FFF',
              fontWeight: 700,
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 15px rgba(29,161,242,0.2)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Iniciar Sesión con X (Twitter)</span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span>O entra con tu Nick</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Quick Nick Login */}
          <form onSubmit={handleQuickLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Introduce tu nick o usuario..."
              value={quickUsername}
              onChange={(e) => setQuickUsername(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
              <span>Entrar al Foro</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🔒 Conexión cifrada y guardada localmente
        </div>
      </div>
    </div>
  );
}
