import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, PlusCircle, Trash2, X, Sparkles, NavigationOff, 
  MapPinned, Users, AlertCircle, AlertTriangle, CheckCircle2, Info, Maximize2
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

// Spain view bounds presets
const BOUNDS = {
  spain: { center: [40.0, -3.7], zoom: 6 },
  peninsula: { center: [40.2085, -3.713], zoom: 6 },
  canarias: { center: [28.2915, -16.6291], zoom: 8 },
  baleares: { center: [39.6953, 3.0176], zoom: 8 }
};

export default function SpainMapSection({ activeProfile }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef(new Map());

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast Notification helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load Leaflet CSS dynamically if missing
  useEffect(() => {
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // 1. Initialize Leaflet Map (Mounted once safely)
  useEffect(() => {
    let isMounted = true;

    const setupMap = () => {
      if (!mapContainerRef.current || !window.L || leafletMapRef.current) return;

      // Prevent Leaflet "Map container is already initialized" error
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      try {
        const map = window.L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false
        }).setView(BOUNDS.spain.center, BOUNDS.spain.zoom);

        window.L.control.zoom({ position: 'bottomright' }).addTo(map);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);

        leafletMapRef.current = map;
        if (isMounted) setIsMapReady(true);
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    };

    if (window.L) {
      setupMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = setupMap;
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // 2. Real-time Firestore Sync for Cities
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const citiesRef = collection(db, 'spain_cities');

      unsubscribe = onSnapshot(citiesRef, (snapshot) => {
        const fetched = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data && data.name && data.lat && data.lon) {
            fetched.push({
              id: docSnap.id,
              name: data.name,
              province: data.province || 'España',
              lat: Number(data.lat),
              lon: Number(data.lon),
              author: data.author || 'Detective',
              timestamp: data.timestamp || 'Reciente'
            });
          }
        });

        setCitiesList(fetched);
      }, (error) => {
        console.warn('Firestore onSnapshot error, falling back to local storage:', error.message);
        fallbackLocalStorage();
      });
    } catch (e) {
      console.warn('Firestore setup error, using local storage:', e);
      fallbackLocalStorage();
    }

    return () => unsubscribe();
  }, []);

  const fallbackLocalStorage = () => {
    try {
      const saved = localStorage.getItem('spain_map_cities_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCitiesList(parsed);
      }
    } catch (e) {}
  };

  // 3. Sync Markers to Leaflet Map whenever citiesList or isMapReady changes
  useEffect(() => {
    if (!isMapReady || !leafletMapRef.current || !window.L) return;

    const map = leafletMapRef.current;
    const currentMarkers = markersRef.current;

    // Remove obsolete markers
    currentMarkers.forEach((marker, id) => {
      if (!citiesList.some(c => c.id === id)) {
        try { map.removeLayer(marker); } catch (e) {}
        currentMarkers.delete(id);
      }
    });

    // Add new markers
    citiesList.forEach(city => {
      if (!currentMarkers.has(city.id)) {
        try {
          const icon = window.L.divIcon({
            className: 'custom-marker-wrapper',
            html: `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                animation: dropBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
              ">
                <div style="
                  width: 34px;
                  height: 34px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #e11d48, #f59e0b);
                  color: #ffffff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 8px 20px rgba(225, 29, 72, 0.5);
                  border: 2px solid #ffffff;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.4); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
              </div>
            `,
            iconSize: [34, 40],
            iconAnchor: [17, 38],
            popupAnchor: [0, -36]
          });

          const marker = window.L.marker([city.lat, city.lon], { icon }).addTo(map);

          const popupHTML = `
            <div style="padding: 12px; width: 230px; font-family: sans-serif; color: #f8fafc;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="padding: 2px 7px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(225, 29, 72, 0.2); color: #f43f5e; border-radius: 6px; border: 1px solid rgba(225,29,72,0.3);">
                  ${escapeHTML(city.province)}
                </span>
                <span style="font-size: 10px; color: #f59e0b; font-weight: 700;">
                  👤 ${escapeHTML(city.author || 'Detective')}
                </span>
              </div>
              <h3 style="margin: 0 0 6px 0; font-size: 1.05rem; font-weight: 800; color: #ffffff; line-height: 1.2;">
                ${escapeHTML(city.name)}
              </h3>
              <div style="background: rgba(15, 23, 42, 0.9); padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.72rem; font-family: monospace;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #94a3b8;">Coords:</span>
                  <span style="color: #f59e0b; font-weight: 700;">${city.lat.toFixed(4)}°, ${city.lon.toFixed(4)}°</span>
                </div>
              </div>
            </div>
          `;

          marker.bindPopup(popupHTML);
          currentMarkers.set(city.id, marker);
        } catch (e) {
          console.error('Error creating marker:', e);
        }
      }
    });
  }, [citiesList, isMapReady]);

  // Handle Search & Geocode
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = inputQuery.trim();
    if (!query) {
      showToast('Introduce una ciudad o municipio de España.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=es&addressdetails=1&limit=1&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });

      if (!res.ok) throw new Error('Network response error');

      const data = await res.json();

      if (!data || data.length === 0) {
        showToast(`No se encontró "${query}" en España.`, 'error');
        setIsLoading(false);
        return;
      }

      const item = data[0];
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      const address = item.address || {};
      const cityName = item.name || address.city || address.town || address.village || query;
      const province = address.province || address.state || address.county || 'España';
      const author = activeProfile ? activeProfile.username : 'Detective';

      // Check if already in list
      const duplicate = citiesList.find(c => Math.abs(c.lat - lat) < 0.01 && Math.abs(c.lon - lon) < 0.01);
      if (duplicate) {
        showToast(`"${cityName}" ya está en el mapa. Centrando...`, 'warning');
        focusCity(duplicate);
        setIsLoading(false);
        return;
      }

      const cityObj = {
        name: cityName,
        province: province,
        lat: lat,
        lon: lon,
        author: author,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Push to Firestore
      try {
        await addDoc(collection(db, 'spain_cities'), cityObj);
      } catch (err) {
        console.warn('Firestore fallback on addDoc:', err);
        const localObj = { ...cityObj, id: 'city_' + Date.now() };
        setCitiesList(prev => [...prev, localObj]);
      }

      if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([lat, lon], 12, { duration: 1.5 });
      }

      showToast(`¡"${cityName}" añadida al mapa global!`, 'success');
      setInputQuery('');
    } catch (err) {
      console.error('Search error:', err);
      showToast('Error al conectar con el servidor de mapas. Reinténtalo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Preset Views
  const handlePreset = (key) => {
    const p = BOUNDS[key];
    if (p && leafletMapRef.current) {
      leafletMapRef.current.flyTo(p.center, p.zoom, { duration: 1.2 });
      showToast(`Vista: ${key === 'spain' ? 'España' : key.toUpperCase()}`, 'info');
    }
  };

  // Focus City
  const focusCity = (city) => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([city.lat, city.lon], 13, { duration: 1.2 });
      const marker = markersRef.current.get(city.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 400);
      }
    }
  };

  // Delete City
  const handleDeleteCity = async (id, name) => {
    try {
      await deleteDoc(doc(db, 'spain_cities', id));
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }
    setCitiesList(prev => prev.filter(c => c.id !== id));
    showToast(`"${name}" eliminada del mapa.`, 'info');
  };

  const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  };

  return (
    <div style={{
      width: '100%',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      margin: '1.5rem 0',
    }}>
      <style>{`
        @keyframes dropBounce {
          0% { transform: translateY(-40px) scale(0.4); opacity: 0; }
          60% { transform: translateY(4px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* HEADER BAR */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                Mapa Interactivo de España
              </h2>
              <span style={{
                padding: '2px 7px',
                fontSize: '0.62rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                borderRadius: '16px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}>
                <Users size={10} /> EN VIVO
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
              Añade ciudades y visualízalas en tiempo real con la comunidad
            </p>
          </div>
        </div>

        {/* View Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => handlePreset('spain')} style={{ padding: '5px 10px', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
            🇪🇸 Todo
          </button>
          <button onClick={() => handlePreset('peninsula')} style={{ padding: '5px 10px', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
            🗺️ Península
          </button>
          <button onClick={() => handlePreset('canarias')} style={{ padding: '5px 10px', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
            🏝️ Canarias
          </button>
          <a href="/mapa.html" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 8px', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Maximize2 size={12} />
            <span>Pantalla Completa</span>
          </a>
        </div>
      </div>

      {/* SEARCH FORM */}
      <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(15, 23, 42, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text"
              placeholder="Escribe una ciudad de España (ej: Madrid, Sevilla, Llanes)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            {inputQuery && (
              <button 
                type="button" 
                onClick={() => setInputQuery('')} 
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0 1rem',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span>Buscando...</span>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Añadir</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.6rem', overflowX: 'auto', paddingBottom: '2px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
            <Sparkles size={11} color="#f59e0b" /> Sugerencias:
          </span>
          {['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'Las Palmas de Gran Canaria'].map(name => (
            <button
              key={name}
              onClick={() => setInputQuery(name)}
              style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                color: '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* TOAST ALERT */}
      {toast && (
        <div style={{
          position: 'absolute',
          top: '110px',
          right: '16px',
          zIndex: 99,
          background: toast.type === 'error' ? 'rgba(153, 27, 27, 0.95)' : toast.type === 'warning' ? 'rgba(146, 64, 14, 0.95)' : 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: '10px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          maxWidth: '300px',
        }}>
          {toast.type === 'error' && <AlertCircle size={16} color="#f87171" />}
          {toast.type === 'warning' && <AlertTriangle size={16} color="#fbbf24" />}
          {toast.type === 'success' && <CheckCircle2 size={16} color="#4ade80" />}
          {toast.type === 'info' && <Info size={16} color="#60a5fa" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* MAP & LIST FLEX GRID */}
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', minHeight: '440px' }}>
        {/* Leaflet DOM element */}
        <div 
          ref={mapContainerRef} 
          style={{ flex: '1 1 340px', minHeight: '440px', zIndex: 1, backgroundColor: '#0b0f19' }} 
        />

        {/* SIDEBAR PANEL */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '440px',
        }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30, 41, 59, 0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPinned size={16} color="#f43f5e" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
                Ciudades ({citiesList.length})
              </span>
            </div>
          </div>

          <div style={{ padding: '8px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {citiesList.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8' }}>
                <NavigationOff size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>Sin ciudades aún</p>
                <p style={{ fontSize: '0.7rem', margin: '3px 0 0 0', opacity: 0.7 }}>Añade la primera arriba para compartirla con la comunidad.</p>
              </div>
            ) : (
              citiesList.slice().reverse().map(city => (
                <div
                  key={city.id}
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    borderRadius: '8px',
                    padding: '7px 10px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <button
                    onClick={() => focusCity(city)}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      flex: 1,
                      padding: 0,
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                      {city.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', display: 'flex', gap: '4px' }}>
                      <span>{city.province}</span>
                      <span style={{ color: '#f59e0b' }}>• {city.author}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteCity(city.id, city.name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    title="Eliminar"
                  >
                    <Trash2 size={13} color="#f43f5e" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
