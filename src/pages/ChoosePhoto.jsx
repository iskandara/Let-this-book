import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Supporters from '../components/Supporters.jsx';
import { findCharacter, findPlace } from '../data.js';
import { useDraft } from '../draft.jsx';
import { preparePhoto } from '../lib/image.js';

// Phones and tablets can open the camera straight from a file input; desktops can't.
const hasCamera = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function ChoosePhoto() {
  const params = useParams();
  const character = findCharacter(params.character);
  const place = findPlace(params.place);
  const navigate = useNavigate();
  const { setPhoto } = useDraft();
  const galleryInput = useRef(null);
  const cameraInput = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!character) return <Navigate to="/capture" replace />;
  if (!place) return <Navigate to={`/capture/${character.slug}`} replace />;

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      setPhoto(await preparePhoto(file));
      navigate(`/capture/${character.slug}/${place.slug}/review`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dotted page-pad choose">
      <div className="stack">
        <button className="box-btn small" disabled={busy} onClick={() => galleryInput.current.click()}>
          Choose from Gallery
        </button>
        {hasCamera && (
          <button className="box-btn small" disabled={busy} onClick={() => cameraInput.current.click()}>
            Open Camera
          </button>
        )}
        {busy && <p className="status">Preparing your photo…</p>}
        {error && <p className="status error" role="alert">{error}</p>}
      </div>
      <input ref={galleryInput} type="file" accept="image/*" hidden onChange={onFile} />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
      <Supporters />
    </div>
  );
}
