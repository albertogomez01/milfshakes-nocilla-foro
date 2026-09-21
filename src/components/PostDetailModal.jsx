import React, { useState } from 'react';
import { X, Send, MessageSquare, Clock, Tag } from 'lucide-react';

export default function PostDetailModal({ post, onClose, onAddComment, activeProfile }) {
  const [newCommentText, setNewCommentText] = useState('');

  if (!post) return null;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment(post.id, {
      id: Date.now(),
      author: activeProfile?.username || 'HunterPro',
      authorBadge: activeProfile?.badge || 'Hunter Pro',
      text: newCommentText.trim(),
      timeAgo: 'Ahora mismo',
    });

    setNewCommentText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="category-tag">{post.categoryLabel || post.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Por @{post.author}</span>
            {post.authorBadge && <span className="author-badge">{post.authorBadge}</span>}
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div>
          <h1 className="post-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              <span>{post.timeAgo}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="tag-list">
                <Tag size={14} />
                {post.tags.map((t, idx) => (
                  <span key={idx} className="tag-item">#{t}</span>
                ))}
              </div>
            )}
          </div>

          {post.imageUrl && (
            <div
              style={{
                margin: '1rem 0',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid var(--accent-gold)',
                background: '#090503',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
          )}

          <div style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-line', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {post.content}
          </div>
        </div>

        {/* Sección de Comentarios */}
        <div className="comments-section">
          <div className="comments-title">
            <MessageSquare size={18} color="var(--accent-gold)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Comentarios ({post.comments ? post.comments.length : 0})
          </div>

          <form onSubmit={handleSubmitComment} className="add-comment-box">
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder={`Comentar como @${activeProfile?.username || 'HunterPro'}...`}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Send size={16} />
              <span>Enviar</span>
            </button>
          </form>

          <div style={{ marginTop: '1.25rem' }}>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="comment-author">@{comment.author}</span>
                      {comment.authorBadge && <span className="author-badge" style={{ fontSize: '0.65rem' }}>{comment.authorBadge}</span>}
                    </div>
                    <span>{comment.timeAgo}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No hay comentarios todavía. ¡Sé el primero en aportar una pista!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
