import React, { useState } from 'react';
import { Sparkles, Share2, Check, ExternalLink, MessageCircle } from 'lucide-react';

export default function TwitterViralBanner() {
  const [copied, setCopied] = useState(false);

  const forumUrl = 'https://milfshakes-nocilla-foro.vercel.app';
  const tweetText = encodeURIComponent(
    '¡Analizando todas las pistas y teorías del reto #MilfshakesxNocilla! 🥤🍫 Únete a la comunidad de investigadores aquí: ' +
      forumUrl +
      ' #RetoNocilla #Desofuscacion'
  );

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(forumUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.95) 0%, rgba(29, 161, 242, 0.15) 100%)',
        border: '1px solid rgba(29, 161, 242, 0.4)',
        borderRadius: '20px',
        padding: '1.5rem 2rem',
        margin: '1.5rem 0 2rem 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(29, 161, 242, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(29, 161, 242, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1 1 300px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1DA1F2, #0C7ABF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(29,161,242,0.4)',
            flexShrink: 0,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.2rem' }}>
            <span
              style={{
                background: 'rgba(29,161,242,0.2)',
                color: '#1DA1F2',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.15rem 0.6rem',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              🔥 Viral en X / Twitter
            </span>
            <Sparkles size={14} color="#1DA1F2" />
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
            ¡Comparte el Foro en X y atrae a más investigadores!
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#A0B0C0', marginTop: '0.2rem' }}>
            Publica con 1 clic en Twitter para traer a tu comunidad a debatir las pistas del reto.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
        <button
          onClick={handleCopyLink}
          className="btn-secondary"
          style={{
            borderColor: copied ? '#4CAF50' : 'rgba(255,255,255,0.15)',
            color: copied ? '#4CAF50' : 'var(--text-primary)',
            fontSize: '0.9rem',
          }}
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          <span>{copied ? '¡Enlace Copiado!' : 'Copiar Link'}</span>
        </button>

        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #1DA1F2, #0C7ABF)',
            color: '#FFF',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(29,161,242,0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.7rem 1.3rem',
            borderRadius: '12px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Publicar en X</span>
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
