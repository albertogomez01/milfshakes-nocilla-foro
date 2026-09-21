import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function CreatePostModal({ isOpen, onClose, onCreatePost, activeProfile }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('teorias');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const categoryLabels = {
      teorias: '🔍 Teorías y Pistas',
      guias: '⚡ Guías & Soluciones',
      general: '💬 General & Debate',
      memes: '🎨 Memes & FanArt',
    };

    onCreatePost({
      id: Date.now(),
      title: title.trim(),
      category: category,
      categoryLabel: categoryLabels[category] || category,
      author: activeProfile?.username || 'HunterPro',
      authorBadge: activeProfile?.badge || 'Hunter Pro',
      authorColor: activeProfile?.avatarColor || 'var(--accent-gold)',
      content: content.trim(),
      imageUrl: imageUrl.trim() || null,
      tags: parsedTags.length > 0 ? parsedTags : ['Milfshakes', 'Nocilla'],
      votes: 1,
      userVote: 'up',
      timeAgo: 'Ahora mismo',
      comments: [],
    });

    // Reset and close
    setTitle('');
    setContent('');
    setImageUrl('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle color="var(--accent-gold)" size={22} />
            <h2 className="modal-title">Crear Nuevo Hilo en la Comunidad</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Publicando como:</span>
          <strong style={{ color: 'var(--accent-gold)' }}>@{activeProfile?.username || 'Usuario'}</strong>
          <span className="author-badge">{activeProfile?.badge}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Título de la discusión *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: ¡Descubrimiento importante sobre el archivo de pistas en /assets!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoría *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="teorias">🔍 Teorías y Pistas</option>
              <option value="guias">⚡ Guías & Soluciones</option>
              <option value="general">💬 General & Debate</option>
              <option value="memes">🎨 Memes & FanArt</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Pista1, Decodificado, Nocilla"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adjuntar Imagen / Pista (Opcional)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="URL de imagen o carga un archivo..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <label
                className="btn-secondary"
                style={{ padding: '0.55rem 0.85rem', cursor: 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                📁 Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contenido detallado *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe tu teoría, observación o pregunta para la comunidad..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Publicar Hilo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
