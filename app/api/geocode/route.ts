import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });

  const contact = process.env.GEOCODER_CONTACT || 'contact@example.com';
  const url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=' + encodeURIComponent(q);

  const res = await fetch(url, {
    headers: {
      'User-Agent': `PI-Deploy/1.0 (${contact})`,
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    },
    cache: 'no-store'
  });

  if (!res.ok) return NextResponse.json({ error: 'Geocoder error' }, { status: 502 });
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]) return NextResponse.json({ error: 'No results' }, { status: 404 });

  const { lat, lon, display_name } = data[0];
  return NextResponse.json({ lat: Number(lat), lng: Number(lon), display_name });
}

