import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, PlusCircle, Trash2, X, Sparkles, NavigationOff, 
  MapPinned, Users, AlertCircle, AlertTriangle, CheckCircle2, Info, Maximize2, Clock, Cake, Map as MapIcon
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

// PRESET CITIES SPECIFIED BY THE USER IN EXACT ORDER
const PRESET_CITIES = [
  { id: 'c_pontevedra', name: 'Pontevedra', province: 'Galicia', lat: 42.4336, lon: -8.6480, author: 'Investigador', timestamp: '#01 Alquiler' },
  { id: 'c_toledo', name: 'Toledo', province: 'Castilla-La Mancha', lat: 39.8628, lon: -4.0273, author: 'Investigador', timestamp: '#02 Billete de ida' },
  { id: 'c_cordoba', name: 'Córdoba', province: 'Andalucía', lat: 37.8882, lon: -4.7794, author: 'Investigador', timestamp: '#03 Campos' },
  { id: 'c_teruel', name: 'Teruel', province: 'Aragón', lat: 40.3456, lon: -1.1072, author: 'Investigador', timestamp: '#04 Carretera' },
  { id: 'c_palencia', name: 'Palencia', province: 'Castilla y León', lat: 42.0095, lon: -4.5287, author: 'Investigador', timestamp: '#05 Container' },
  { id: 'c_huelva', name: 'Huelva', province: 'Andalucía', lat: 37.2614, lon: -6.9447, author: 'Investigador', timestamp: '#06 Libro' },
  { id: 'c_jaen', name: 'Jaén', province: 'Andalucía', lat: 37.7796, lon: -3.7849, author: 'Investigador', timestamp: '#07 Llave' },
  { id: 'c_lerida', name: 'Lérida (Lleida)', province: 'Cataluña', lat: 41.6176, lon: 0.6200, author: 'Investigador', timestamp: '#08 Mapa' },
  { id: 'c_madrid', name: 'Madrid', province: 'Comunidad de Madrid', lat: 40.4168, lon: -3.7038, author: 'Investigador', timestamp: '#09 Mar / Tiempo' },
  { id: 'c_malaga', name: 'Málaga', province: 'Andalucía', lat: 36.7213, lon: -4.4214, author: 'Investigador', timestamp: '#10 Nocilla' },
  { id: 'c_valencia', name: 'Valencia', province: 'Comunitat Valenciana', lat: 39.4699, lon: -0.3763, author: 'Investigador', timestamp: '#11 Paella' },
  { id: 'c_oviedo', name: 'Oviedo', province: 'Asturias', lat: 43.3619, lon: -5.8494, author: 'Investigador', timestamp: '#12 Pard' },
  { id: 'c_santiago', name: 'Santiago de Compostela', province: 'Galicia', lat: 42.8782, lon: -8.5448, author: 'Investigador', timestamp: '#13 Restaurante' },
  { id: 'c_salamanca', name: 'Salamanca', province: 'Castilla y León', lat: 40.9701, lon: -5.6635, author: 'Investigador', timestamp: '#14 Sobre' },
  { id: 'c_pendiente_15', name: 'Pendiente (#15)', province: 'Por descubrir', lat: 40.0000, lon: -3.7000, author: 'Investigador', timestamp: '#15 Pendiente' },
  { id: 'c_zaragoza', name: 'Zaragoza', province: 'Aragón', lat: 41.6488, lon: -0.8891, author: 'Investigador', timestamp: '#16 Zaragoza' }
];

export default function SpainMapSection({ activeProfile }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef(new Map());
  const polylineRef = useRef(null);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citiesList, setCitiesList] = useState(PRESET_CITIES);
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

  // 2. Real-time Firestore Sync combined with Preset Cities
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const citiesRef = collection(db, 'spain_cities');

      unsubscribe = onSnapshot(citiesRef, (snapshot) => {
        const remoteCities = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data && data.name && data.lat && data.lon) {
            remoteCities.push({
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

        // Merge Preset Cities with Remote Cities without duplicates
        const combined = [...PRESET_CITIES];
        remoteCities.forEach(rc => {
          if (!combined.some(pc => pc.name.toLowerCase() === rc.name.toLowerCase() || (Math.abs(pc.lat - rc.lat) < 0.01 && Math.abs(pc.lon - rc.lon) < 0.01))) {
            combined.push(rc);
          }
        });

        setCitiesList(combined);
      }, (error) => {
        console.warn('Firestore onSnapshot fallback:', error.message);
      });
    } catch (e) {
      console.warn('Firestore setup error:', e);
    }

    return () => unsubscribe();
  }, []);

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

    // Add new markers with Start/End visual badges
    citiesList.forEach((city, idx) => {
      const isStart = idx === 0;
      const isEnd = idx === citiesList.length - 1;
      const numStr = (idx + 1).toString().padStart(2, '0');

      let badgeBg = 'rgba(15, 23, 42, 0.85)';
      let badgeColor = '#cbd5e1';
      let badgeText = `#${numStr}`;
      let pinBg = 'linear-gradient(135deg, #e11d48, #f59e0b)';
      let glowColor = 'rgba(225, 29, 72, 0.5)';
      let innerText = numStr;

      if (isStart) {
        badgeBg = 'rgba(16, 185, 129, 0.95)';
        badgeColor = '#ffffff';
        badgeText = '🟢 INICIO (#01)';
        pinBg = 'linear-gradient(135deg, #10b981, #059669)';
        glowColor = 'rgba(16, 185, 129, 0.8)';
        innerText = '🚀';
      } else if (isEnd) {
        badgeBg = 'rgba(225, 29, 72, 0.95)';
        badgeColor = '#ffffff';
        badgeText = `🏁 FIN (#${numStr})`;
        pinBg = 'linear-gradient(135deg, #e11d48, #9333ea)';
        glowColor = 'rgba(225, 29, 72, 0.8)';
        innerText = '🏁';
      }

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
                  background: ${badgeBg};
                  color: ${badgeColor};
                  font-size: 10px;
                  font-weight: 800;
                  padding: 2px 7px;
                  border-radius: 10px;
                  border: 1px solid rgba(255,255,255,0.3);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                  white-space: nowrap;
                  margin-bottom: 2px;
                ">
                  ${badgeText}
                </div>
                <div style="
                  width: 34px;
                  height: 34px;
                  border-radius: 50%;
                  background: ${pinBg};
                  color: #ffffff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 15px ${glowColor};
                  border: 2px solid #ffffff;
                  font-weight: 800;
                  font-size: 12px;
                ">
                  ${innerText}
                </div>
                <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.4); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
              </div>
            `,
            iconSize: [80, 60],
            iconAnchor: [40, 56],
            popupAnchor: [0, -50]
          });

          const marker = window.L.marker([city.lat, city.lon], { icon }).addTo(map);

          const popupHTML = `
            <div style="padding: 12px; width: 230px; font-family: sans-serif; color: #f8fafc;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="padding: 2px 7px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: ${isStart ? 'rgba(16,185,129,0.2)' : isEnd ? 'rgba(225,29,72,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${isStart ? '#34d399' : isEnd ? '#f43f5e' : '#f59e0b'}; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);">
                  ${isStart ? 'INICIO DE RUTA' : isEnd ? 'FIN DE RUTA' : escapeHTML(city.province)}
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

    // Draw / Update Route Line connecting cities in exact order (#01 -> #16)
    if (polylineRef.current) {
      try { map.removeLayer(polylineRef.current); } catch (e) {}
      polylineRef.current = null;
    }

    const routeCoords = citiesList.map(c => [c.lat, c.lon]);
    if (routeCoords.length > 1) {
      polylineRef.current = window.L.polyline(routeCoords, {
        color: '#f59e0b',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }
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

  // Fit Entire Route from Start to End
  const handleFitRoute = () => {
    if (leafletMapRef.current && polylineRef.current) {
      try {
        leafletMapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] });
        showToast('📍 Encuadrando la ruta completa (Inicio -> Fin)', 'info');
      } catch (e) {
        handlePreset('spain');
      }
    } else {
      handlePreset('spain');
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
          <button onClick={handleFitRoute} style={{ padding: '5px 10px', fontSize: '0.72rem', fontWeight: 800, borderRadius: '6px', border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🛣️ Ver Ruta
          </button>
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
          {['Pontevedra', 'Toledo', 'Córdoba', 'Teruel', 'Palencia', 'Huelva', 'Jaén', 'Lérida', 'Madrid', 'Málaga', 'Valencia', 'Oviedo', 'Santiago', 'Salamanca', 'Zaragoza'].map(name => (
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
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', minHeight: '520px' }}>
        {/* Leaflet DOM element */}
        <div 
          ref={mapContainerRef} 
          style={{ flex: '1 1 340px', minHeight: '520px', zIndex: 1, backgroundColor: '#0b0f19' }} 
        />

        {/* SIDEBAR PANEL */}
        <div style={{
          width: '320px',
          flexShrink: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '520px',
        }}>
          {/* Header */}
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
                Localizaciones ({citiesList.length})
              </span>
            </div>
          </div>

          {/* BANNER REQUERIDO: "PENDIENTE PUESTO 15" */}
          <div style={{
            margin: '8px 10px 4px 10px',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(225, 29, 72, 0.15))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <AlertTriangle size={14} color="#f59e0b" />
              <span>OBJETO PENDIENTE DEL CASO</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#f1f5f9', lineHeight: 1.3, fontWeight: 700 }}>
              "Pendiente la localización <strong>#15 por descubrir ❓</strong>"
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.7rem', color: '#cbd5e1' }}>
              <span style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cake size={12} color="#f43f5e" /> #15 Pendiente
              </span>
            </div>
          </div>

          {/* Cities List in exact specified order */}
          <div style={{ padding: '8px 10px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {citiesList.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8' }}>
                <NavigationOff size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>Sin ciudades aún</p>
              </div>
            ) : (
              citiesList.map((city, idx) => (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                        {city.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px', display: 'flex', gap: '4px' }}>
                      <span>{city.province}</span>
                      <span style={{ color: '#f59e0b' }}>• {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°</span>
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
