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
import ModelViewerWidget from './components/ModelViewerWidget';
import AuthGate from './components/AuthGate';
import CommunityPoll from './components/CommunityPoll';
import Footer from './components/Footer';
import LegalNoticeModal from './components/LegalNoticeModal';
import { Milk, Sparkles, MessageSquare, ShieldCheck, HelpCircle, ShieldAlert } from 'lucide-react';

const INITIAL_PROFILES = [
  {
    id: 'user_admin',
    username: 'albertogomez01',
    badge: '👑 Admin / Creador',
    bio: 'Administrador principal de la comunidad y del reto.',
    avatarColor: '#E5A83B',
    reputation: 999,
    isAdmin: true,
  },
  {
    id: 'user_1',
    username: 'HunterPro',
    badge: 'Hunter Pro',
    bio: 'Especialista en resolución de retos web y desofuscación.',
    avatarColor: '#FF3366',
    reputation: 140,
  },
  {
    id: 'user_2',
    username: 'NocillaMaster',
    badge: 'Nocilla Mod',
    bio: 'Moderador del foro y entusiasta del chocolate.',
    avatarColor: '#4CAF50',
    reputation: 210,
  },
];

const INITIAL_POSTS = [
  {
    id: 1,
    title: '🖼️ Análisis del expediente: ¿Qué esconde la fotografía del cuadro Picasso?',
    category: 'teorias',
    categoryLabel: '🔍 Teorías y Pistas',
    author: 'NocillaMaster',
    authorBadge: 'Nocilla Mod',
    content: 'Revisando los documentos y fotografías en el terminal de archivos de El Milfterio del Picasso, he encontrado una anotación al reverso del lienzo. ¿Creéis que la combinación de los tres vasos desbloquea la carpeta final?',
    tags: ['CasoPicasso', 'Investigacion', 'Fotografias'],
    votes: 56,
    userVote: null,
    timeAgo: 'Hace 2 horas',
    comments: [
      { id: 101, author: 'ChocoHacker', authorBadge: 'Investigador', text: '¡Totalmente! Si revisas el archivo de la carpeta de codificación, verás que los números coinciden.', timeAgo: 'Hace 1 hora' },
      { id: 102, author: 'CreamHunter', authorBadge: 'Buscador de Pistas', text: 'Confirmo. En el archivo del teléfono hay una pista de audio clave.', timeAgo: 'Hace 30 min' },
    ],
  },
  {
    id: 2,
    title: '⚡ Guía de acceso a las carpetas bloqueadas del terminal del caso',
    category: 'guias',
    categoryLabel: '⚡ Guías & Soluciones',
    author: 'RetroSolver',
    authorBadge: 'Descifrador',
    content: 'Paso a paso para revisar las pruebas del expediente:\n1. Revisa los informes de texto e inspecciona las pistas de las grabaciones.\n2. La carpeta de localizaciones contiene el mapa clave.\n3. Recuerda que para optar al premio oficial de 15.000 € debes conservar tus 3 vasos físicos y el ticket de compra.',
    tags: ['Guia', 'CasoAbierto', 'BasesOficiales'],
    votes: 94,
    userVote: 'up',
    timeAgo: 'Hace 4 horas',
    comments: [
      { id: 103, author: 'MilkyWay', authorBadge: 'Fan Nocilla', text: '¡Excelente resumen! Me sirvió para guiarme en el terminal.', timeAgo: 'Hace 2 horas' },
    ],
  },
  {
    id: 3,
    title: '🎨 Cuando encuentras una pista oculta en las grabaciones de audio',
    category: 'memes',
    categoryLabel: '🎨 Memes & FanArt',
    author: 'MemeShake',
    authorBadge: 'Fan Nocilla',
    content: 'Estuve 20 minutos escuchando en bucle la grabación de audio del caso Picasso pensando que era código morse y resultó ser el sonido de un sorbo de Milfshake 💀🥤',
    tags: ['Memes', 'Humor', 'Grabaciones'],
    votes: 142,
    userVote: null,
    timeAgo: 'Hace 10 horas',
    comments: [
      { id: 104, author: 'NocillaMaster', authorBadge: 'Nocilla Mod', text: 'Jajaja los creadores de la campaña se lucieron con ese detalle.', timeAgo: 'Hace 8 horas' },
    ],
  },
  {
    id: 4,
    title: '💬 ¿Qué os parece la interfaz de terminal de archivos de la web del enigma?',
    category: 'general',
    categoryLabel: '💬 General & Debate',
    author: 'VaporSynth',
    authorBadge: 'Investigador',
    content: 'La ambientación de caso abierto con documentos, fotografías y reproductor de audio da una sensación genial de investigación policíaca. ¿Alguien ha descifrado ya todas las carpetas?',
    tags: ['CasoAbierto', 'Debate', 'MisterioPicasso'],
    votes: 38,
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
    return localStorage.getItem('milfshakes_nocilla_active_profile') || 'user_admin';
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
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(229,168,59,0.2)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <ShieldAlert size={14} />
            <span>FORO NO OFICIAL CREADO POR LA COMUNIDAD DE FANS</span>
          </div>

          <h1 className="hero-title">El Milfterio del Picasso 🔍🖼️</h1>
          <p className="hero-subtitle">
            Comunidad independiente de investigación. Analiza los documentos, fotografías y grabaciones con el resto de detectives del caso.
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
                <div className="stat-label">Detectives Registrados</div>
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
            {/* Interactive 3D GLB Model Viewer displaying milfo.glb */}
            <ModelViewerWidget />

            {/* Code Vault Unlock Widget with Admin bypass */}
            <CodeVaultWidget activeProfile={activeProfile} />

            <CommunityPoll />

            <div className="widget-card">
              <div className="widget-title">
                <Milk size={18} color="var(--accent-pink)" />
                <span>Normas del Expediente</span>
              </div>
              <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Mantén un trato respetuoso con todos los miembros.</li>
                <li>Usa la etiqueta de <strong>#Spoilers</strong> al publicar soluciones directas.</li>
                <li>Conserva tus 3 vasos físicos y ticket para poder optar al premio oficial de 15.000 €.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer onOpenLegalModal={() => setIsLegalModalOpen(true)} />

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

      <LegalNoticeModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}
