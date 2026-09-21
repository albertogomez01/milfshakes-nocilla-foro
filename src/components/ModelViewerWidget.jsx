import React, { useState } from 'react';
import { Box, Sparkles, RotateCw, Play, Pause, Maximize2 } from 'lucide-react';

export default function ModelViewerWidget() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div
      className="widget-card"
      style={{
        background: 'linear-gradient(135deg, rgba(38, 22, 14, 0.95), rgba(15, 10, 7, 0.98))',
        border: '1px solid var(--accent-gold)',
        borderRadius: '20px',
        padding: '1.25rem',
        margin: '1.25rem 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(229,168,59,0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div className="widget-title" style={{ margin: 0 }}>
          <Box size={20} color="var(--accent-gold)" />
          <span>Artefacto 3D del Expediente</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn-secondary"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pausar Rotación' : 'Activar Rotación 3D'}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
          >
            {autoRotate ? <Pause size={14} color="var(--accent-gold)" /> : <Play size={14} />}
            <span>{autoRotate ? 'Pausar' : 'Girar'}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        style={{
          width: '100%',
          height: '280px',
          background: 'radial-gradient(circle at 50% 50%, rgba(229, 168, 59, 0.15) 0%, rgba(15, 10, 7, 0.85) 80%)',
          borderRadius: '14px',
          border: '1px solid rgba(229, 168, 59, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Render 3D Model using Google's <model-viewer> web component */}
        <model-viewer
          src="/milfo.glb"
          alt="Objeto 3D Oficial - El Milfterio del Picasso"
          auto-rotate={autoRotate ? '' : undefined}
          auto-rotate-delay="0"
          rotation-per-second="25deg"
          camera-controls
          shadow-intensity="1.8"
          environment-image="neutral"
          exposure="1.25"
          touch-action="pan-y"
          interaction-prompt="none"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          {/* Fallback loading indicator */}
          <div
            slot="poster"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '3px solid var(--accent-gold)',
                borderTopColor: 'transparent',
                animation: 'spin3d 1.5s linear infinite',
              }}
            />
            <span>Cargando Artefacto 3D (milfo.glb)...</span>
          </div>
        </model-viewer>

        {/* Ambient floating glow element */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            fontSize: '0.72rem',
            color: 'var(--accent-gold)',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(229,168,59,0.3)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Sparkles size={12} color="var(--accent-gold)" />
          <span>Arrastra para rotar en 360°</span>
        </div>
      </div>

      <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4' }}>
        🔍 <strong>milfo.glb</strong> — Modelo tridimensional integrado oficialmente en la plataforma. Forma parte del sistema de investigación del caso.
      </div>
    </div>
  );
}
