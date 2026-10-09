import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Frame from '../components/Frame.jsx';
import { Chevron, Cross, PinIcon } from '../components/PinIcon.jsx';
import { findCharacter, findPlace } from '../data.js';
import { useDraft } from '../draft.jsx';
import { parseLocation } from '../lib/location.js';
import { createPost } from '../lib/store.js';

export default function Review() {
  const params = useParams();
  const character = findCharacter(params.character);
  const place = findPlace(params.place);
  const navigate = useNavigate();
  const { photo, form, setForm, reset } = useDraft();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!character || !place) return <Navigate to="/capture" replace />;
  if (!photo) return <Navigate to={`/capture/${character.slug}/${place.slug}`} replace />;

  const location = parseLocation(form.pin);
  const pinInvalid = form.pin.trim() !== '' && !location;
  const caption = form.caption.trim();
  const ready = caption && form.agreed && !pinInvalid && !sending;
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  async function share(e) {
    e.preventDefault();
    if (!ready) return;
    setSending(true);
    setError('');
    try {
      const id = await createPost({
        caption,
        location,
        character: character.slug,
        place: place.slug,
        full: photo.full,
        thumb: photo.thumb,
      });
      navigate(`/success/${id}`, { replace: true, state: { image: photo.full } });
      reset();
    } catch (err) {
      console.error(err);
      setError('Sharing failed. Check your connection and try again.');
      setSending(false);
    }
  }

  return (
    <form className="page-pad review" onSubmit={share}>
      <h1 className="title-bold">Looking Good!</h1>
      <Frame src={photo.full} alt="Your photo" ratio="588 / 636" className="photo" />
      <p className="review-meta">
        <Link to="/capture" className="underline">{character.name}</Link> in{' '}
        <Link to={`/capture/${character.slug}`} className="underline">{place.name}</Link>
      </p>

      <label className={`field ${caption ? 'filled' : ''}`}>
        <span className="sr-only">Caption</span>
        <textarea
          rows={3}
          maxLength={280}
          placeholder="Add a caption..."
          value={form.caption}
          onChange={(e) => set({ caption: e.target.value })}
        />
      </label>

      <div className={`field pin ${location ? 'filled' : ''} ${pinInvalid ? 'invalid' : ''}`}>
        <PinIcon />
        <label className="sr-only" htmlFor="pin">Pin point from maps</label>
        <input
          id="pin"
          inputMode="url"
          autoComplete="off"
          placeholder="Paste your pin point from maps here"
          value={location?.lat != null ? `(${location.lat}, ${location.lng})` : form.pin}
          onChange={(e) => set({ pin: e.target.value })}
          readOnly={location?.lat != null}
        />
        {form.pin ? (
          <button type="button" className="icon-btn" aria-label="Clear pin point" onClick={() => set({ pin: '' })}>
            <Cross />
          </button>
        ) : (
          <a className="icon-btn" href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" aria-label="Open Google Maps to find your pin point">
            <Chevron />
          </a>
        )}
      </div>
      {pinInvalid && <p className="hint error">Paste a Google Maps link or coordinates like -6.25, 106.79</p>}

      <label className="agree">
        <input type="checkbox" checked={form.agreed} onChange={(e) => set({ agreed: e.target.checked })} />
        <span>
          By checking this button, you are agree for our{' '}
          <Link to="/terms" target="_blank" rel="noopener">terms and conditions</Link>
        </span>
      </label>

      {error && <p className="status error" role="alert">{error}</p>}
      <button type="submit" className="oval-btn" disabled={!ready}>
        {sending ? 'Sharing…' : 'Share'}
      </button>
    </form>
  );
}
