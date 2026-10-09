// Photos are shrunk in the browser and stored as JPEG data URLs, so the site
// runs on Firebase's free plan without Cloud Storage.

const FULL = { maxSide: 1400, maxChars: 700_000 };
const THUMB = { maxSide: 420, maxChars: 60_000 };

async function decode(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Fall through: some browsers reject the options argument.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function encode(source, { maxSide, maxChars }) {
  const w = source.width;
  const h = source.height;
  let side = maxSide;
  let quality = 0.82;
  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, side / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', quality);
    if (data.length <= maxChars) return data;
    if (quality > 0.6) quality -= 0.1;
    else side = Math.round(side * 0.8);
  }
  throw new Error('This photo is too large to upload.');
}

export async function preparePhoto(file) {
  if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) {
    throw new Error('Please choose a photo.');
  }
  let source;
  try {
    source = await decode(file);
  } catch {
    throw new Error('This photo format is not supported here. Try a JPEG or PNG.');
  }
  return { full: encode(source, FULL), thumb: encode(source, THUMB) };
}
