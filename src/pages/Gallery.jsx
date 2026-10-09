import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Frame from '../components/Frame.jsx';
import { FilterIcon } from '../components/PinIcon.jsx';
import { CHARACTERS, PLACES } from '../data.js';
import { isDemo, listPosts } from '../lib/store.js';

function Filter({ label, value, options, onChange }) {
  return (
    <label className={`filter ${value ? 'active' : ''}`}>
      <FilterIcon />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={`Filter by ${label}`}>
        <option value="">All {label}</option>
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>{o.name}</option>
        ))}
      </select>
    </label>
  );
}

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const character = params.get('character') || '';
  const place = params.get('place') || '';
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let live = true;
    setState('loading');
    listPosts({ character, place })
      .then((r) => {
        if (!live) return;
        setPosts(r.posts);
        setCursor(r.cursor);
        setState('done');
      })
      .catch((err) => {
        console.error(err);
        if (live) setState('error');
      });
    return () => {
      live = false;
    };
  }, [character, place]);

  async function more() {
    setState('more');
    try {
      const r = await listPosts({ character, place, cursor });
      setPosts((p) => [...p, ...r.posts]);
      setCursor(r.cursor);
      setState('done');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  }

  const setFilter = (key) => (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="page-pad gallery">
      <h1 className="title-bold">Gallery</h1>
      <div className="filters">
        <span>Filter by</span>
        <Filter label="Character" value={character} options={CHARACTERS} onChange={setFilter('character')} />
        <Filter label="Places" value={place} options={PLACES} onChange={setFilter('place')} />
      </div>
      {isDemo && <p className="hint">Demo mode: moments are saved only in this browser until Firebase is connected.</p>}

      {state === 'loading' && <p className="status">Loading moments…</p>}
      {state === 'error' && <p className="status error" role="alert">Could not load the gallery. Please try again.</p>}
      {state !== 'loading' && state !== 'error' && posts.length === 0 && (
        <p className="status">
          No moments here yet. <Link to="/capture" className="underline">Be the first to capture one.</Link>
        </p>
      )}

      <ul className="photo-grid">
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={`/gallery/${p.id}`} aria-label={p.caption}>
              <Frame src={p.thumb} alt="" ratio="224 / 240" />
            </Link>
          </li>
        ))}
      </ul>
      {cursor && (
        <button className="oval-btn" onClick={more} disabled={state === 'more'}>
          {state === 'more' ? 'Loading…' : 'More'}
        </button>
      )}
    </div>
  );
}
