import React from 'react';
import { Layers, Flame, Compass, MessageSquare, Image } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Todos los Hilos', icon: Layers },
  { id: 'teorias', label: 'Teorías y Pistas', icon: Compass },
  { id: 'guias', label: 'Guías & Soluciones', icon: Flame },
  { id: 'general', label: 'General & Debate', icon: MessageSquare },
  { id: 'memes', label: 'Memes & FanArt', icon: Image },
];

export default function CategoryFilter({ activeCategory, setActiveCategory, sortBy, setSortBy }) {
  return (
    <div className="filter-bar">
      <div className="category-pills">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ordenar:</span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="popular">🔥 Más Populares</option>
          <option value="newest">⚡ Más Recientes</option>
          <option value="comments">💬 Más Comentarios</option>
        </select>
      </div>
    </div>
  );
}
