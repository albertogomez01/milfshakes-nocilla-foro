import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Share2, Copy, Check, Crown, Smartphone, FolderCode, MapPin } from 'lucide-react';

const REAL_SECRET_CODES = [
  {
    level: '📱 Teléfono',
    key: '662552',
    hint: 'Código de desbloqueo para el teléfono del reto.',
    icon: Smartphone,
  },
  {
    level: '📁 Carpeta de Codificación',
    key: '369253',
    hint: 'Contraseña para la carpeta de codificación.',
    icon: FolderCode,
  },
  {
    level: '📍 Carpeta de Localizaciones',
    key: '11770',
    hint: 'Clave de acceso a la carpeta de localizaciones.',
    icon: MapPin,
  },
];

export default function CodeVaultWidget({ activeProfile }) {
  const [shareCount, setShareCount] = useState(() => {
    const saved = localStorage.getItem('milfshakes_nocilla_share_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('milfshakes_nocilla_share_count', shareCount.toString());
  }, [shareCount]);

  // Admin Detection
  const isAdmin =
    activeProfile?.isAdmin ||
    activeProfile?.username?.toLowerCase() === 'albertogomez01' ||
    activeProfile?.username?.toLowerCase() === 'admin' ||
    activeProfile?.badge?.toLowerCase().includes('admin') ||
    activeProfile?.badge?.toLowerCase().includes('creador');

  const requiredShares = 5;
  const isUnlocked = isAdmin || shareCount >= requiredShares;
  const progressPercent = isAdmin ? 100 : Math.min(100, Math.round((shareCount / requiredShares) * 100));

  const forumUrl = 'https://milfshakes-nocilla-foro.vercel.app';
  const shareTitle = 'Milfshakes x Nocilla Foro';
  const shareMessage = '¡Entra en el Foro de Milfshakes x Nocilla para descubrir los códigos del reto! 🥤🍫';
  const shareTextEncoded = encodeURIComponent(shareMessage + ' ' + forumUrl);

  // Native Android & iPhone Web Share API handler
  const handleNativeMobileShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: forumUrl,
        });
        incrementShare();
      } catch (err) {
        // Fallback to copy link if user cancelled or unsupported
        handleCopyShareLink();
      }
    } else {
      handleCopyShareLink();
    }
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareTextEncoded}`, '_blank');
    incrementShare();
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareTextEncoded}`, '_blank');
    incrementShare();
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(forumUrl);
    setCopiedLink(true);
    incrementShare();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const incrementShare = () => {
    if (!isAdmin && shareCount < requiredShares) {
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
        background: isAdmin
          ? 'linear-gradient(135deg, rgba(229,168,59,0.2) 0%, rgba(20,13,9,0.95) 100%)'
          : isUnlocked
          ? 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(20,13,9,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(229,168,59,0.12) 0%, rgba(20,13,9,0.95) 100%)',
        border: isAdmin ? '1px solid #E5A83B' : isUnlocked ? '1px solid #4CAF50' : '1px solid var(--border-card)',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: isAdmin
          ? '0 10px 30px rgba(229,168,59,0.25)'
          : isUnlocked
          ? '0 10px 30px rgba(76,175,80,0.2)'
          : '0 10px 30px rgba(0,0,0,0.3)',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="widget-title" style={{ margin: 0, color: isAdmin ? '#E5A83B' : isUnlocked ? '#4CAF50' : 'var(--accent-gold)' }}>
          {isAdmin ? <Crown size={22} color="#E5A83B" /> : isUnlocked ? <Unlock size={22} color="#4CAF50" /> : <Lock size={22} color="var(--accent-gold)" />}
          <span>{isAdmin ? '👑 Bóveda Modo Admin' : isUnlocked ? '🔓 Bóveda Desbloqueada' : '🔒 Bóveda de Códigos'}</span>
        </div>

        {isAdmin ? (
          <span
            style={{
              background: 'rgba(229,168,59,0.25)',
              color: '#E5A83B',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Crown size={12} /> Admin Bypass Activo
          </span>
        ) : (
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
        )}
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {isAdmin
          ? '👑 Bienvenido @albertogomez01. Como Administrador tienes acceso directo inmediato a todos los códigos sin necesidad de compartir nada.'
          : isUnlocked
          ? '🎉 ¡Enhorabuena! Has compartido el foro con 5 amigos. Aquí tienes todas las contraseñas del reto al descubierto:'
          : 'Envía el enlace del foro a 5 amigos distintos para revelar las contraseñas secretas.'}
      </p>

      {/* Progress Bar (Visible for Non-Admins) */}
      {!isAdmin && (
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
      )}

      {/* Codes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {REAL_SECRET_CODES.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: isAdmin ? '1px solid rgba(229,168,59,0.3)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isAdmin ? 'rgba(229,168,59,0.2)' : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={18} color={isAdmin ? '#E5A83B' : 'var(--accent-gold)'} />
                </div>

                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{item.level}</div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      letterSpacing: isUnlocked ? '2px' : '3px',
                      color: isUnlocked ? '#FFF' : 'var(--text-muted)',
                      marginTop: '2px',
                      filter: isUnlocked ? 'none' : 'blur(4px)',
                      userSelect: isUnlocked ? 'all' : 'none',
                    }}
                  >
                    {isUnlocked ? item.key : '••••••'}
                  </div>
                </div>
              </div>

              {isUnlocked && (
                <button
                  className="btn-secondary"
                  onClick={() => handleCopyCode(item.key, idx)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.85rem',
                    background: isAdmin ? 'rgba(229,168,59,0.15)' : undefined,
                    borderColor: isAdmin ? 'rgba(229,168,59,0.4)' : undefined,
                    color: isAdmin ? '#E5A83B' : undefined,
                  }}
                >
                  {copiedCodeIndex === idx ? <Check size={14} color="#4CAF50" /> : <Copy size={14} />}
                  <span>{copiedCodeIndex === idx ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Share Actions for Mobile Android & iPhone */}
      {!isUnlocked && !isAdmin && (
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
              <Share2 size={14} />
              <span>WhatsApp</span>
            </button>
          </div>

          <button
            onClick={handleNativeMobileShare}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', marginTop: '0.2rem' }}
          >
            {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copiedLink ? '¡Enlace copiado! (+1)' : '📱 Compartir en Móvil (+1)'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
