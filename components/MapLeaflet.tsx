// @ts-nocheck
"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useState } from 'react';

// Fix default icon paths for Next.js bundling
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: (markerIcon2x as any).src ?? markerIcon2x,
  iconUrl: (markerIcon as any).src ?? markerIcon,
  shadowUrl: (markerShadow as any).src ?? markerShadow,
});

export default function MapLeaflet() {
  // Avoid hydration issues by rendering map only on client after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Av. Paulista (MASP) coordinates
  const [center, setCenter] = useState<LatLngExpression>([-22.0771085, -48.7473689]);
  const [q, setQ] = useState('Av. Paulista, 1578 - São Paulo');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!mounted) return null;

  async function buscar() {
    if (!q) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/geocode?q=' + encodeURIComponent(q));
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Endereço não encontrado');
      console.log('data',data)
      if (data?.lat && data?.lng) {
        setCenter([data.lat, data.lng]);
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao geocodificar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display:'flex', gap:8, margin: '16px 0' }}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>{ if (e.key === 'Enter') buscar(); }}
          placeholder="Digite um endereço (ex.: Av. Paulista, SP)"
          style={{ flex:1, padding:'8px 10px' }}
        />
        <button onClick={buscar} disabled={busy} style={{ padding:'8px 12px' }}>{busy ? 'Buscando...' : 'Buscar'}</button>
      </div>
      {error && <p style={{color:'crimson', marginTop: -8}}>{error}</p>}
      <div style={{ width: '100%', height: 420 }}>
        <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              Endereço de exemplo: Av. Paulista - MASP, São Paulo
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
