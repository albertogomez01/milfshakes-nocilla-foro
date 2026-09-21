import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Share2, Copy, Check, Sparkles, Send, Gift, ShieldAlert } from 'lucide-react';

const SECRET_CODES = [
  { level: 'Nivel 1 - Archivo Retro', key: 'MILFSHAKE_STRAWBERRY_2026', hint: 'Clave de acceso al sistema retro del nivel 1.' },
  { level: 'Nivel 2 - Carpeta Oculta /assets', key: 'NOCILLA_CHOCO_HAZELNUT_PASS', hint: 'Contraseña para desofuscar el bundle en JS.' },
  { level: 'Nivel 3 - Bóveda Final del Reto', key: 'SECRET_FLAG{Nocilla_x_Milfshakes_Master_Solver}', hint: 'Código de victoria y trofeo del reto.' },
];

export default function CodeVaultWidget() {
  const [shareCount, setShareCount] = useState(() => {
    const saved = localStorage.getItem('milfshakes_nocilla_share_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('milfshakes_nocilla_share_count', shareCount.toString());
  }, [shareCount]);

  const requiredShares = 5;
  const isUnlocked = shareCount >= requiredShares;
  const progressPercent = Math.min(100, Math.round((shareCount / requiredShares) * 100));

  const forumUrl = 'https://milfshakes-nocilla-foro.vercel.app';
  const shareText = encodeURIComponent(
    '¡Entra en el Foro de Milfshakes x Nocilla para descubrir los códigos del reto! 🥤🍫 ' + forumUrl
  );

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
    incrementShare();
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    incrementShare();
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(forumUrl);
    setCopiedLink(true);
    incrementShare();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const incrementShare = () => {
    if (shareCount < requiredShares) {
      setShareCount((prev) => prev + 1);
    }
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div
      className="widget-card"
      style={{
        background: isUnlocked
          ? 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(20,13,9,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(229,168,59,0.12) 0%, rgba(20,13,9,0.95) 100%)',
        border: isUnlocked ? '1px solid #4CAF50' : '1px solid var(--accent-gold)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: isUnlocked ? '0 10px 30px rgba(76,175,80,0.2)' : '0 10px 30px rgba(229,168,59,0.15)',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="widget-title" style={{ margin: 0, color: isUnlocked ? '#4CAF50' : 'var(--accent-gold)' }}>
          {isUnlocked ? <Unlock size={22} color="#4CAF50" /> : <Lock size={22} color="var(--accent-gold)" />}
          <span>{isUnlocked ? '🔓 Bóveda de Códigos DESBLOQUEADA' : '🔒 Bóveda de Códigos del Reto'}</span>
        </div>
        <span
          style={{
            background: isUnlocked ? 'rgba(76,175,80,0.2)' : 'rgba(229,168,59,0.2)',
            color: isUnlocked ? '#4CAF50' : 'var(--accent-gold)',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
          }}
        >
          {shareCount} / {requiredShares} Compartidos
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {isUnlocked
          ? '🎉 ¡Enhorabuena! Has compartido el foro con 5 amigos. Aquí tienes todas las contraseñas del reto al descubierto:'
          : 'Envía el enlace del foro a 5 amigos distintos para desbloquear y revelar las contraseñas secretas de cada nivel.'}
      </p>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '10px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '5px',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: isUnlocked
              ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
              : 'linear-gradient(90deg, var(--accent-gold), #FF5252)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Codes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {SECRET_CODES.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{item.level}</div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: isUnlocked ? '1px' : '3px',
                  color: isUnlocked ? '#FFF' : 'var(--text-muted)',
                  marginTop: '2px',
                  filter: isUnlocked ? 'none' : 'blur(4px)',
                  userSelect: isUnlocked ? 'all' : 'none',
                }}
              >
                {isUnlocked ? item.key : '••••••••••••••••••••'}
              </div>
            </div>

            {isUnlocked && (
              <button
                className="btn-secondary"
                onClick={() => handleCopyCode(item.key, idx)}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
              >
                {copiedCodeIndex === idx ? <Check size={14} color="#4CAF50" /> : <Copy size={14} />}
                <span>{copiedCodeIndex === idx ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Share Actions */}
      {!isUnlocked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Comparte para sumar invitar (+1 por amigo):
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={handleShareTwitter}
              className="btn-secondary"
              style={{
                background: 'rgba(29,161,242,0.12)',
                borderColor: 'rgba(29,161,242,0.4)',
                color: '#1DA1F2',
                fontSize: '0.85rem',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Enviar en X</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="btn-secondary"
              style={{
                background: 'rgba(37,211,102,0.12)',
                borderColor: 'rgba(37,211,102,0.4)',
                color: '#25D366',
                fontSize: '0.85rem',
                justifyContent: 'center',
              }}
            >
              <Send size={14} />
              <span>WhatsApp</span>
            </button>
          </div>

          <button
            onClick={handleCopyShareLink}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', marginTop: '0.2rem' }}
          >
            {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copiedLink ? '¡Enlace copiado! (+1)' : 'Copiar Enlace para 1 Amigo (+1)'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
