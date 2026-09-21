import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import PostCard from './components/PostCard';
import PostDetailModal from './components/PostDetailModal';
import CreatePostModal from './components/CreatePostModal';
import ProfileModal from './components/ProfileModal';
import TwitterAuthModal from './components/TwitterAuthModal';
import TwitterViralBanner from './components/TwitterViralBanner';
import CodeVaultWidget from './components/CodeVaultWidget';
import AuthGate from './components/AuthGate';
import CommunityPoll from './components/CommunityPoll';
import { Milk, Sparkles, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

const INITIAL_PROFILES = [
  {
    id: 'user_1',
    username: 'HunterPro',
    badge: 'Hunter Pro',
    bio: 'Especialista en resolución de retos web y desofuscación.',
    avatarColor: '#E5A83B',
    reputation: 140,
  },
  {
    id: 'user_2',
    username: 'NocillaMaster',
    badge: 'Nocilla Mod',
    bio: 'Moderador del foro y entusiasta del chocolate.',
    avatarColor: '#FF3366',
    reputation: 210,
  },
  {
    id: 'user_3',
    username: 'ChocoHacker',
    badge: 'Investigador',
    bio: 'Analizando las pistas del reto paso a paso.',
    avatarColor: '#4CAF50',
    reputation: 85,
  },
];

const INITIAL_POSTS = [
  {
    id: 1,
    title: '🍫 Análisis del bundle JS: ¿Alguien ha revisado las variables ocultas en window?',
    category: 'teorias',
    categoryLabel: '🔍 Teorías y Pistas',
    author: 'NocillaMaster',
    authorBadge: 'Nocilla Mod',
    content: 'Revisando las entrañas de la aplicación retro, me encontré con un fragmento de código muy interesante que realiza sustituciones de caracteres antes de validar. ¿Creéis que la combinación de Milfshakes + Nocilla abre la tercera carpeta secreta?',
    tags: ['IngenieriaInversa', 'Pista3', 'Desofuscacion'],
    votes: 42,
    userVote: null,
    timeAgo: 'Hace 2 horas',
    comments: [
      { id: 101, author: 'ChocoHacker', authorBadge: 'Investigador', text: '¡Totalmente! Si revisas la cadena en Base64 verás un prefijo que coincide con los ingredientes principales.', timeAgo: 'Hace 1 hora' },
      { id: 102, author: 'CreamHunter', authorBadge: 'Buscador de Pistas', text: 'Confirmo. En el archivo index de assets hay una función de comprobación de hashes.', timeAgo: 'Hace 30 min' },
    ],
  },
  {
    id: 2,
    title: '⚡ Guía completa de soluciones para el Nivel 1 y Nivel 2 del Reto',
    category: 'guias',
    categoryLabel: '⚡ Guías & Soluciones',
    author: 'RetroSolver',
    authorBadge: 'Descifrador',
    content: 'Aquí tenéis el paso a paso recopilado por la comunidad para desbloquear los primeros accesos:\n1. Inspecciona los atributos data-code del contenedor principal.\n2. La clave por defecto del primer archivo se obtiene ordenando los nombres de los sabores.\n3. Guarda las credenciales en tu localStorage para mantener el progreso.',
    tags: ['Guia', 'Nivel1', 'Solucionario'],
    votes: 89,
    userVote: 'up',
    timeAgo: 'Hace 5 horas',
    comments: [
      { id: 103, author: 'MilkyWay', authorBadge: 'Fan Nocilla', text: '¡Impresionante guía! Me salvó en la segunda carpeta.', timeAgo: 'Hace 3 horas' },
    ],
  },
  {
    id: 3,
    title: '🎨 Cuando crees que has encontrado la contraseña pero resulta ser un easter egg de Nocilla',
    category: 'memes',
    categoryLabel: '🎨 Memes & FanArt',
    author: 'MemeShake',
    authorBadge: 'Fan Nocilla',
    content: 'Llevaba 3 horas intentando descifrar un array de charcodes para que al final la alerta me mostrara: "¡Buen intento, pero primero tómate un Milfshakes de Nocilla!" 💀🥤',
    tags: ['Memes', 'EasterEgg', 'Humor'],
    votes: 128,
    userVote: null,
    timeAgo: 'Hace 12 horas',
    comments: [
      { id: 104, author: 'NocillaMaster', authorBadge: 'Nocilla Mod', text: 'Jajaja los creadores del reto se lucieron con ese easter egg.', timeAgo: 'Hace 10 horas' },
    ],
  },
  {
    id: 4,
    title: '💬 ¿Qué opináis de la interfaz estilo escritorio retro del juego?',
    category: 'general',
    categoryLabel: '💬 General & Debate',
    author: 'VaporSynth',
    authorBadge: 'Investigador',
    content: 'La estética noventera con la ventana retro, cursores retro y efectos CRT da una nostalgia genial. ¿Alguien ha encontrado más secretos ocultos en el fondo de pantalla o en la papelera simulada?',
    tags: ['RetroUI', 'Debate', 'Nostalgia'],
    votes: 31,
    userVote: null,
    timeAgo: 'Hace 1 día',
    comments: [],
  },
];

export default function App() {
  // Auth Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('milfshakes_nocilla_auth_logged_in') === 'true';
  });

  // Profiles State
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('milfshakes_nocilla_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem('milfshakes_nocilla_active_profile') || 'user_1';
  });

  // Posts State
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('milfshakes_nocilla_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_POSTS;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTwitterAuthModalOpen, setIsTwitterAuthModalOpen] = useState(false);

  // Sync Auth State
  useEffect(() => {
    localStorage.setItem('milfshakes_nocilla_auth_logged_in', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Sync Profiles to localStorage
  useEffect(() => {
    localStorage.setItem('milfshakes_nocilla_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('milfshakes_nocilla_active_profile', activeProfileId);
  }, [activeProfileId]);

  // Sync Posts to localStorage
  useEffect(() => {
    localStorage.setItem('milfshakes_nocilla_posts', JSON.stringify(posts));
  }, [posts]);

  // Get active profile object
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Login Gate Success
  const handleAuthGateLoginSuccess = (profileObj) => {
    setProfiles((prev) => {
      const exists = prev.find((p) => p.id === profileObj.id || p.username.toLowerCase() === profileObj.username.toLowerCase());
      if (exists) return prev;
      return [profileObj, ...prev];
    });
    setActiveProfileId(profileObj.id);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Profile Management Handlers
  const handleCreateProfile = (newProf) => {
    setProfiles((prev) => [...prev, newProf]);
    setActiveProfileId(newProf.id);
  };

  const handleSwitchProfile = (profId) => {
    setActiveProfileId(profId);
  };

  const handleTwitterLoginSuccess = (twitterProfile) => {
    setProfiles((prev) => {
      const exists = prev.find((p) => p.id === twitterProfile.id || p.username.toLowerCase() === twitterProfile.username.toLowerCase());
      if (exists) return prev;
      return [twitterProfile, ...prev];
    });
    setActiveProfileId(twitterProfile.id);
    setIsAuthenticated(true);
  };

  // Vote handler
  const handleVote = (postId, direction) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        let voteDiff = 0;
        let newVoteState = direction;

        if (post.userVote === direction) {
          newVoteState = null;
          voteDiff = direction === 'up' ? -1 : 1;
        } else {
          if (post.userVote === 'up') voteDiff = -2;
          else if (post.userVote === 'down') voteDiff = 2;
          else voteDiff = direction === 'up' ? 1 : -1;
        }

        const updated = {
          ...post,
          votes: post.votes + voteDiff,
          userVote: newVoteState,
        };

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(updated);
        }

        return updated;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId, commentObj) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updatedComments = [...(post.comments || []), commentObj];
        const updatedPost = { ...post, comments: updatedComments };

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(updatedPost);
        }

        return updatedPost;
      })
    );
  };

  // Create Post
  const handleCreatePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Filter & Sort Logic
  const filteredPosts = posts
    .filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesContent = p.content.toLowerCase().includes(q);
        const matchesAuthor = p.author.toLowerCase().includes(q);
        const matchesTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesContent || matchesAuthor || matchesTags;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.votes - a.votes;
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'comments') return (b.comments ? b.comments.length : 0) - (a.comments ? a.comments.length : 0);
      return 0;
    });

  const totalComments = posts.reduce((acc, p) => acc + (p.comments ? p.comments.length : 0), 0);

  // IF NOT AUTHENTICATED -> RENDER LOCK / AUTH GATE
  if (!isAuthenticated) {
    return (
      <div>
        <AuthGate
          onLoginSuccess={handleAuthGateLoginSuccess}
          onOpenTwitterAuth={() => setIsTwitterAuthModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />
        <TwitterAuthModal
          isOpen={isTwitterAuthModalOpen}
          onClose={() => setIsTwitterAuthModalOpen(false)}
          onTwitterLoginSuccess={handleTwitterLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        activeProfile={activeProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenTwitterAuthModal={() => setIsTwitterAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="app-container">
        {/* Hero Banner */}
        <section className="hero-banner">
          <h1 className="hero-title">Comunidad Milfshakes x Nocilla 🥤🍫</h1>
          <p className="hero-subtitle">
            El espacio de encuentro oficial para investigadores, gamers y fans. Comparte hipótesis, analiza pistas y ayuda a desbloquear todos los niveles del reto.
          </p>

          <div className="stats-grid">
            <div className="stat-item">
              <Sparkles size={20} color="var(--accent-gold)" />
              <div>
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">Hilos Activos</div>
              </div>
            </div>

            <div className="stat-item">
              <MessageSquare size={20} color="var(--accent-pink)" />
              <div>
                <div className="stat-number">{totalComments}</div>
                <div className="stat-label">Aportes / Respuestas</div>
              </div>
            </div>

            <div className="stat-item">
              <ShieldCheck size={20} color="#4CAF50" />
              <div>
                <div className="stat-number">{profiles.length}</div>
                <div className="stat-label">Perfiles Registrados</div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Twitter Viral Share Banner */}
        <TwitterViralBanner />

        {/* Layout Grid */}
        <div className="main-layout">
          {/* Main Feed Section */}
          <section>
            <CategoryFilter
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            <div className="posts-feed">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onVote={handleVote}
                    onClick={(p) => setSelectedPost(p)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <HelpCircle size={40} style={{ marginBottom: '0.75rem' }} />
                  <h3>No se encontraron hilos de discusión</h3>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Prueba a cambiar los filtros de búsqueda o sé el primero en publicar un nuevo tema.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Code Vault Unlock Widget requiring 5 shares */}
            <CodeVaultWidget />

            <CommunityPoll />

            <div className="widget-card">
              <div className="widget-title">
                <Milk size={18} color="var(--accent-pink)" />
                <span>Normas de la Comunidad</span>
              </div>
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Mantén un trato respetuoso con todos los miembros.</li>
                <li>Usa la etiqueta de <strong>#Spoilers</strong> al publicar claves directas.</li>
                <li>Diviértete compartiendo memes y teorías del reto.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Modales */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onAddComment={handleAddComment}
        activeProfile={activeProfile}
      />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
        activeProfile={activeProfile}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSwitchProfile={handleSwitchProfile}
        onCreateProfile={handleCreateProfile}
        onOpenTwitterAuthModal={() => setIsTwitterAuthModalOpen(true)}
      />

      <TwitterAuthModal
        isOpen={isTwitterAuthModalOpen}
        onClose={() => setIsTwitterAuthModalOpen(false)}
        onTwitterLoginSuccess={handleTwitterLoginSuccess}
      />
    </div>
  );
}
