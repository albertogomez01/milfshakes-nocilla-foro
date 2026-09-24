import React, { useState } from 'react';
import { KeyRound, Lock, ArrowRight, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthGate({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPassword = password.trim().toLowerCase();

    if (cleanPassword === 'herrete') {
      setError('');
      onLoginSuccess({
        id: 'user_herrete_' + Date.now(),
        username: 'Agente_Herrete',
        badge: '👟 Agente Perry',
        bio: 'Acceso concedido mediante la clave secreta del herrete.',
        avatarColor: '#3B82F6',
        reputation: 100,
      });
    } else {
      setError('Contraseña incorrecta. ¡Revisa la pista si estás atascado!');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'radial-gradient(circle at 50% 30%, #1A2338 0%, #0A0E1A 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(229,168,59,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '24px',
          padding: '2.25rem 2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(59, 130, 246, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Main Feature Image: Zapatillas de cordón y Ornitorrinco Azul */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            borderRadius: '18px',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.25)',
            background: '#0B1120',
          }}
        >
          <img
            src="/herrete_ornitorrinco.jpg"
            alt="Zapatillas de cordón y ornitorrinco azul"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(11, 17, 32, 0.95), transparent)',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#3B82F6" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#93C5FD', letterSpacing: '0.5px' }}>
              ZAPATILLAS DE CORDÓN & ORNITORRINCO AZUL 🦆👟
            </span>
          </div>
        </div>

        <div className="logo-badge" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#FFF', fontWeight: 800, fontSize: '0.75rem', borderRadius: '20px' }}>
          🔒 ACCESO PROTEGIDO CON CONTRASEÑA
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.65rem',
            fontWeight: 800,
            marginBottom: '0.4rem',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #93C5FD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Acceso al Foro No Oficial
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Para ingresar al sitio web, introduce la contraseña requerida.
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <KeyRound
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(147, 197, 253, 0.7)',
              }}
            />
            <input
              type="password"
              placeholder="Introduce la contraseña..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.6rem',
                borderRadius: '12px',
                background: 'rgba(11, 17, 32, 0.8)',
                border: error ? '1px solid #EF4444' : '1px solid rgba(59, 130, 246, 0.3)',
                color: '#FFF',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              required
              autoFocus
            />
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 0.85rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                color: '#FCA5A5',
                fontSize: '0.82rem',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={16} style={{ shrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              borderColor: '#3B82F6',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            <span>Desbloquear y Entrar</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Optional Hint toggle */}
        <div style={{ marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            style={{
              background: 'none',
              border: 'none',
              color: '#93C5FD',
              fontSize: '0.8rem',
              textDecoration: 'underline',
              cursor: 'pointer',
              opacity: 0.8,
            }}
          >
            {showHint ? 'Ocultar Pista' : '💡 ¿Necesitas una pista?'}
          </button>

          {showHint && (
            <div
              style={{
                marginTop: '0.6rem',
                padding: '0.6rem 0.8rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px dashed rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: '#DBEAFE',
                lineHeight: '1.4',
              }}
            >
              👟 <strong>Pista:</strong> Es el nombre en español del embellecedor de plástico o metal en el extremo de los cordones de las zapatillas (¡la famosa canción de Phineas y Ferb con Perry el ornitorrinco!).
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          🔒 Acceso restringido por clave • <strong>herrete</strong>
        </div>
      </div>
    </div>
  );
}

