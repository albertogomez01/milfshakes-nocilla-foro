import React, { useState, useRef } from 'react';
import { Box, Sparkles, Upload, RotateCw, Play, Pause } from 'lucide-react';

export default function ModelViewerWidget() {
  const [modelSrc, setModelSrc] = useState('/model.glb');
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasCustomFile, setHasCustomFile] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const objectUrl = URL.createObjectURL(file);
      setModelSrc(objectUrl);
      setHasCustomFile(true);
    }
  };

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
          <span>Visor 3D Interactivo (.GLB)</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn-secondary"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pausar Rotación' : 'Activar Rotación 3D'}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
          >
            {autoRotate ? <Pause size={14} color="var(--accent-gold)" /> : <Play size={14} />}
            <span>{autoRotate ? 'Pausar' : 'Rotar'}</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
          >
            <Upload size={14} />
            <span>Subir tu .GLB</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".glb,.gltf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        style={{
          width: '100%',
          height: '260px',
          background: 'radial-gradient(circle at 50% 50%, rgba(229, 168, 59, 0.12) 0%, rgba(0,0,0,0.6) 80%)',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Render 3D Model using Google's <model-viewer> web component */}
        <model-viewer
          src={modelSrc}
          alt="Modelo 3D El Milfterio del Picasso"
          auto-rotate={autoRotate ? '' : undefined}
          auto-rotate-delay="0"
          rotation-per-second="30deg"
          camera-controls
          shadow-intensity="1.5"
          environment-image="neutral"
          exposure="1.2"
          touch-action="pan-y"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          {/* Fallback procedural 3D animation if .glb is loading or empty */}
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
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '3px solid var(--accent-gold)',
                borderTopColor: 'transparent',
                animation: 'spin3d 2s linear infinite',
              }}
            />
            <span>Cargando Modelo 3D (.glb)...</span>
          </div>
        </model-viewer>

        {/* Ambient floating glow element */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            background: 'rgba(0,0,0,0.6)',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles size={12} color="var(--accent-gold)" />
          <span>Arrastra o gira con el dedo</span>
        </div>
      </div>

      <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        💡 Coloca tu archivo en la carpeta <code style={{ color: 'var(--accent-gold)' }}>public/model.glb</code> o usa el botón de subida.
      </div>
    </div>
  );
}
