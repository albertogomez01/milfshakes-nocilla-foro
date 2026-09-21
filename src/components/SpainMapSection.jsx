import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, PlusCircle, Trash2, X, Sparkles, NavigationOff, 
  MapPinned, List, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2, Info, Compass, Maximize2, Users
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Spain view bounds presets
const BOUNDS = {
  spain: { center: [40.0, -3.7], zoom: 6 },
  peninsula: { center: [40.2085, -3.713], zoom: 6 },
  canarias: { center: [28.2915, -16.6291], zoom: 8 },
  baleares: { center: [39.6953, 3.0176], zoom: 8 }
};

export default function SpainMapSection({ activeProfile }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markersMapRef = useRef(new Map());

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [toast, setToast] = useState(null);

  // Helper for Toast Notifications
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Load Leaflet CSS dynamically if not present
  useEffect(() => {
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    const initializeLeafletMap = () => {
      if (!window.L || !mapRef.current || leafletInstance.current) return;

      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(BOUNDS.spain.center, BOUNDS.spain.zoom);

      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      window.L.control.attribution({ position: 'bottomleft' }).addTo(map);

      leafletInstance.current = map;
    };

    if (window.L) {
      initializeLeafletMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initializeLeafletMap;
      document.head.appendChild(script);
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  // REAL-TIME FIRESTORE SYNC FOR ALL USERS WORLDWIDE
  useEffect(() => {
    try {
      const citiesRef = collection(db, 'spain_cities');
      const q = query(citiesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedCities = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          fetchedCities.push({
            id: docSnap.id,
            name: data.name,
            province: data.province || 'España',
            lat: data.lat,
            lon: data.lon,
            author: data.author || 'Detective',
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        });

        setCitiesList(fetchedCities);

        // Update markers on Leaflet map
        if (leafletInstance.current && window.L) {
          // Remove markers no longer in dataset
          markersMapRef.current.forEach((marker, id) => {
            if (!fetchedCities.find(c => c.id === id)) {
              leafletInstance.current.removeLayer(marker);
              markersMapRef.current.delete(id);
            }
          });

          // Add new markers
          fetchedCities.forEach(city => {
            if (!markersMapRef.current.has(city.id)) {
              addMarkerToLeafletMap(city, false);
            }
          });
        }
      }, (err) => {
        console.warn('Firestore subscription fallback to local mode:', err.message);
        loadLocalFallback();
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore initialization fallback:', e.message);
      loadLocalFallback();
    }
  }, []);

  const loadLocalFallback = () => {
    try {
      const saved = localStorage.getItem('spain_map_cities_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCitiesList(parsed);
          parsed.forEach(city => addMarkerToLeafletMap(city, false));
        }
      }
    } catch (e) {
      console.error('Local fallback error:', e);
    }
  };

  // Custom DivIcon for Leaflet
  const createCustomMarkerIcon = () => {
    if (!window.L) return null;
    return window.L.divIcon({
      className: 'custom-marker-wrapper',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          animation: dropBounce 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        ">
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e11d48, #f59e0b);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(225, 29, 72, 0.5);
            border: 2px solid #ffffff;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style="width: 16px; height: 6px; background: rgba(0,0,0,0.5); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [36, 42],
      iconAnchor: [18, 40],
      popupAnchor: [0, -38]
    });
  };

  // Add Marker to Leaflet Instance
  const addMarkerToLeafletMap = (cityObj, openPopup = false) => {
    if (!leafletInstance.current || !window.L) return;

    const icon = createCustomMarkerIcon();
    const marker = window.L.marker([cityObj.lat, cityObj.lon], { icon }).addTo(leafletInstance.current);

    const popupHTML = `
      <div style="padding: 14px; width: 250px; font-family: sans-serif; color: #f8fafc;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="padding: 2px 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(225, 29, 72, 0.2); color: #f43f5e; border-radius: 6px; border: 1px solid rgba(225,29,72,0.3);">
            ${escapeHTML(cityObj.province)}
          </span>
          <span style="font-size: 10px; color: #f59e0b; font-weight: 700;">
            👤 ${escapeHTML(cityObj.author || 'Detective')}
          </span>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 800; color: #ffffff; line-height: 1.2;">
          ${escapeHTML(cityObj.name)}
        </h3>

        <div style="background: rgba(15, 23, 42, 0.9); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; font-family: monospace; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="color: #94a3b8;">Latitud:</span>
            <span style="color: #f59e0b; font-weight: 700;">${cityObj.lat.toFixed(4)}° N</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">Longitud:</span>
            <span style="color: #f59e0b; font-weight: 700;">${cityObj.lon.toFixed(4)}° W</span>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupHTML);
    markersMapRef.current.set(cityObj.id, marker);

    if (openPopup) {
      setTimeout(() => marker.openPopup(), 600);
    }
  };

  // Search & Add City using Nominatim API + Sync to Firebase
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const queryStr = inputQuery.trim();
    if (!queryStr) {
      showToast('Por favor, introduce una ciudad o municipio de España.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=es&addressdetails=1&limit=1&q=${encodeURIComponent(queryStr)}`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });

      if (!res.ok) throw new Error('Error en la respuesta de red');

      const data = await res.json();

      if (!data || data.length === 0) {
        showToast(`No se encontró ninguna localidad en España llamada "${queryStr}".`, 'error');
        setIsLoading(false);
        return;
      }

      const item = data[0];
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      const address = item.address || {};
      const cityName = item.name || address.city || address.town || address.village || queryStr;
      const province = address.province || address.state || address.county || 'España';
      const authorName = activeProfile ? activeProfile.username : 'Detective';

      // Duplicate check
      const exists = citiesList.find(c => Math.abs(c.lat - lat) < 0.01 && Math.abs(c.lon - lon) < 0.01);
      if (exists) {
        showToast(`"${cityName}" ya está marcada en el mapa. Centrando...`, 'warning');
        focusCity(exists);
        setIsLoading(false);
        return;
      }

      const newCityObj = {
        name: cityName,
        province: province,
        lat: lat,
        lon: lon,
        author: authorName,
        createdAt: serverTimestamp(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Push to Firebase Firestore for GLOBAL real-time sync across all users
      try {
        await addDoc(collection(db, 'spain_cities'), newCityObj);
      } catch (err) {
        console.warn('Firestore addDoc fallback:', err.message);
        // Fallback local addition if Firestore is blocked
        const localObj = { ...newCityObj, id: 'city_' + Date.now() };
        setCitiesList(prev => [...prev, localObj]);
        addMarkerToLeafletMap(localObj, true);
      }

      if (leafletInstance.current) {
        leafletInstance.current.flyTo([lat, lon], 12, { duration: 1.5 });
      }

      showToast(`¡"${cityName}" añadida al mapa global! Ahora visible para todos.`, 'success');
      setInputQuery('');
    } catch (err) {
      console.error(err);
      showToast('Error de conexión al geolocalizar. Reinténtalo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset view changer
  const handlePresetView = (key) => {
    const p = BOUNDS[key];
    if (p && leafletInstance.current) {
      leafletInstance.current.flyTo(p.center, p.zoom, { duration: 1.2 });
      showToast(`Vista ajustada a ${key === 'spain' ? 'España' : key.toUpperCase()}`, 'info');
    }
  };

  // Focus City on Map
  const focusCity = (city) => {
    if (leafletInstance.current) {
      leafletInstance.current.flyTo([city.lat, city.lon], 13, { duration: 1.2 });
      const marker = markersMapRef.current.get(city.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 500);
      }
    }
  };

  // Delete Individual City from Firestore & Map
  const handleDeleteCity = async (id, name) => {
    try {
      await deleteDoc(doc(db, 'spain_cities', id));
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }

    setCitiesList(prev => prev.filter(c => c.id !== id));
    const marker = markersMapRef.current.get(id);
    if (marker && leafletInstance.current) {
      leafletInstance.current.removeLayer(marker);
      markersMapRef.current.delete(id);
    }
    showToast(`"${name}" eliminada del mapa global.`, 'info');
  };

  // Clear All Cities
  const handleClearAll = async () => {
    if (citiesList.length === 0) return;
    if (window.confirm('¿Deseas eliminar todos los marcadores del mapa global?')) {
      for (const city of citiesList) {
        try {
          await deleteDoc(doc(db, 'spain_cities', city.id));
        } catch (e) {}
      }

      markersMapRef.current.forEach(m => {
        if (leafletInstance.current) leafletInstance.current.removeLayer(m);
      });
      markersMapRef.current.clear();
      setCitiesList([]);
      if (leafletInstance.current) {
        leafletInstance.current.flyTo(BOUNDS.spain.center, BOUNDS.spain.zoom, { duration: 1.2 });
      }
      showToast('Todos los marcadores han sido eliminados.', 'info');
    }
  };

  const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  };

  return (
    <div style={{
      width: '100%',
      borderRadius: '24px',
      overflow: 'hidden',
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      position: 'relative',
      margin: '1.5rem 0',
    }}>
      {/* Dynamic Keyframes CSS injection */}
      <style>{`
        @keyframes dropBounce {
          0% { transform: translateY(-50px) scale(0.3); opacity: 0; }
          60% { transform: translateY(6px) scale(1.15); opacity: 1; }
          80% { transform: translateY(-3px) scale(0.95); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.94) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.7) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { background: rgba(15, 23, 42, 0.94) !important; }
        .leaflet-container a.leaflet-popup-close-button { color: #94a3b8 !important; padding: 6px 10px 0 0 !important; }
      `}</style>

      {/* HEADER CONTROLS BAR */}
      <div style={{
        padding: '1.2rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Title */}
        <div style={{ display: 'flex', items: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 6px 16px rgba(225, 29, 72, 0.4)',
          }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Mapa Interactivo Global de España
              </h2>
              <span style={{
                padding: '2px 8px',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                borderRadius: '20px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Users size={10} /> EN TIEMPO REAL
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Todas las ciudades que añadas son visibles al instante para todos los usuarios en todo el mundo 🌎
            </p>
          </div>
        </div>

        {/* View Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => handlePresetView('spain')} style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
            🇪🇸 Todo
          </button>
          <button onClick={() => handlePresetView('peninsula')} style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
            🗺️ Península
          </button>
          <button onClick={() => handlePresetView('canarias')} style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
            🏝️ Canarias
          </button>
          <a href="/mapa.html" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize2 size={12} />
            <span>Pantalla Completa</span>
          </a>
        </div>
      </div>

      {/* SEARCH INPUT BAR */}
      <div style={{ padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
            <input 
              type="text"
              placeholder="Escribe el nombre de una ciudad o municipio en España para compartirlo con todos..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {inputQuery && (
              <button 
                type="button" 
                onClick={() => setInputQuery('')} 
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={16} />
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
              borderRadius: '14px',
              padding: '0 1.25rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
            }}
          >
            {isLoading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Añadir Global</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Sparkles size={12} color="#f59e0b" /> Sugerencias:
          </span>
          {['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'Las Palmas de Gran Canaria'].map(name => (
            <button
              key={name}
              onClick={() => setInputQuery(name)}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '8px',
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
          top: '120px',
          right: '20px',
          zIndex: 99,
          background: toast.type === 'error' ? 'rgba(153, 27, 27, 0.95)' : toast.type === 'warning' ? 'rgba(146, 64, 14, 0.95)' : 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          maxWidth: '320px',
        }}>
          {toast.type === 'error' && <AlertCircle size={18} color="#f87171" />}
          {toast.type === 'warning' && <AlertTriangle size={18} color="#fbbf24" />}
          {toast.type === 'success' && <CheckCircle2 size={18} color="#4ade80" />}
          {toast.type === 'info' && <Info size={18} color="#60a5fa" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* MAP CONTAINER & SIDEBAR WRAPPER */}
      <div style={{ position: 'relative', width: '100%', height: '520px' }}>
        {/* Leaflet DOM element */}
        <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* SIDEBAR FLOATING DRAWER */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          width: '320px',
          maxHeight: '480px',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Sidebar Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30, 41, 59, 0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPinned size={18} color="#f43f5e" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                Ciudades Globales ({citiesList.length})
              </span>
            </div>
            {citiesList.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#f43f5e',
                  background: 'rgba(225, 29, 72, 0.1)',
                  border: '1px solid rgba(225, 29, 72, 0.2)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Trash2 size={12} />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          {/* Sidebar List */}
          <div style={{ padding: '10px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px' }}>
            {citiesList.length === 0 ? (
              <div style={{ padding: '30px 15px', textAlign: 'center', color: '#94a3b8' }}>
                <NavigationOff size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: 600 }}>No hay ciudades en el mapa global</p>
                <p style={{ fontSize: '0.72rem', margin: '4px 0 0 0', opacity: 0.7 }}>Añade la primera ciudad para que aparezca a todos los usuarios.</p>
              </div>
            ) : (
              citiesList.slice().reverse().map(city => (
                <div
                  key={city.id}
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <button
                    onClick={() => focusCity(city)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'left',
                      textAlign: 'left',
                      cursor: 'pointer',
                      flex: 1,
                      padding: 0,
                    }}
                  >
                    <div style={{ display: 'flex', items: 'center', justify: 'between', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                        {city.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', display: 'flex', gap: '6px' }}>
                      <span>{city.province}</span>
                      <span style={{ color: '#f59e0b' }}>• por {city.author}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#f59e0b', marginTop: '2px' }}>
                      {city.lat.toFixed(3)}°, {city.lon.toFixed(3)}°
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteCity(city.id, city.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Eliminar de la lista global"
                  >
                    <Trash2 size={14} color="#f43f5e" />
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
