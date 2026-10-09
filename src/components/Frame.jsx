// The thick black picture frame used for every artwork and photo.
export default function Frame({ src, alt, ratio = '3 / 4', className = '' }) {
  return (
    <div className={`frame ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
