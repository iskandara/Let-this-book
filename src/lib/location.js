// Turns whatever someone pastes from a maps app into a pin we can store and link to.
// Accepts plain coordinates ("-6.25, 106.79") and Google Maps links, long or short.

const COORD = String.raw`(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)`;

function validCoords(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

function pin(lat, lng, raw) {
  return {
    raw,
    lat,
    lng,
    url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}

function isGoogleMapsUrl(u) {
  const host = u.hostname.replace(/^www\./, '');
  if (host === 'maps.app.goo.gl') return true;
  if (host === 'goo.gl') return u.pathname.startsWith('/maps');
  if (/^maps\.google\.[a-z.]+$/.test(host)) return true;
  return /^google\.[a-z.]+$/.test(host) && u.pathname.startsWith('/maps');
}

export function parseLocation(input) {
  const raw = (input || '').trim();
  if (!raw) return null;

  const plain = raw.match(new RegExp(String.raw`^\(?\s*${COORD}\s*\)?$`));
  if (plain) {
    const lat = Number(plain[1]);
    const lng = Number(plain[2]);
    return validCoords(lat, lng) ? pin(lat, lng, raw) : null;
  }

  // Share sheets often add text around the link, so pull the first URL out.
  const urlText = raw.match(/https?:\/\/\S+/)?.[0];
  if (!urlText) return null;
  let url;
  try {
    url = new URL(urlText);
  } catch {
    return null;
  }
  if (!isGoogleMapsUrl(url)) return null;
  url.protocol = 'https:';

  const text = decodeURIComponent(url.href);
  // !3d/!4d is the dropped pin itself; @lat,lng is only where the map was centred.
  const candidates = [
    text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/),
    ...['q', 'query', 'll', 'destination'].map((k) =>
      (url.searchParams.get(k) || '').match(new RegExp(`^${COORD}$`)),
    ),
    text.match(new RegExp(`/@${COORD}`)),
  ];
  for (const m of candidates) {
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (validCoords(lat, lng)) return pin(lat, lng, raw);
  }

  // A short link (maps.app.goo.gl) has no coordinates until Google expands it, so keep the link.
  return { raw, lat: null, lng: null, url: url.href };
}

export function formatLocation(loc) {
  if (!loc) return '';
  if (loc.lat != null) return `(${loc.lat}, ${loc.lng})`;
  return 'Open in Google Maps';
}
