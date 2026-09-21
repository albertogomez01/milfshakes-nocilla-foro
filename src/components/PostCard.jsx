import React from 'react';
import { ChevronUp, ChevronDown, MessageSquare, Clock, Tag } from 'lucide-react';

export default function PostCard({ post, onVote, onClick }) {
  const handleUpvote = (e) => {
    e.stopPropagation();
    onVote(post.id, 'up');
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    onVote(post.id, 'down');
  };

  return (
    <div className="post-card" onClick={() => onClick(post)}>
      <div className="vote-box">
        <button
          className={`vote-btn ${post.userVote === 'up' ? 'upvoted' : ''}`}
          onClick={handleUpvote}
          aria-label="Votar a favor"
        >
          <ChevronUp size={22} />
        </button>
        <span
          className="vote-count"
          style={{
            color:
              post.userVote === 'up'
                ? 'var(--upvote-color)'
                : post.userVote === 'down'
                ? 'var(--downvote-color)'
                : 'var(--text-primary)',
          }}
        >
          {post.votes}
        </span>
        <button
          className={`vote-btn ${post.userVote === 'down' ? 'downvoted' : ''}`}
          onClick={handleDownvote}
          aria-label="Votar en contra"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      <div className="post-main">
        <div className="post-header">
          <span className="category-tag">{post.categoryLabel || post.category}</span>
          <div className="author-info">
            <span className="author-name">{post.author}</span>
            {post.authorBadge && <span className="author-badge">{post.authorBadge}</span>}
          </div>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            <span>{post.timeAgo}</span>
          </div>
        </div>

        <h2 className="post-title">{post.title}</h2>
        <p className="post-excerpt">{post.content}</p>

        <div className="post-footer">
          <div className="footer-item">
            <MessageSquare size={16} color="var(--accent-gold)" />
            <span>{post.comments ? post.comments.length : 0} Comentarios</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="tag-list">
              <Tag size={14} color="var(--text-muted)" />
              {post.tags.map((tag, idx) => (
                <span key={idx} className="tag-item">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
