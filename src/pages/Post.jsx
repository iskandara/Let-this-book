import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Frame from '../components/Frame.jsx';
import { Chevron, PinIcon } from '../components/PinIcon.jsx';
import { findCharacter, findPlace } from '../data.js';
import { formatLocation } from '../lib/location.js';
import { getPost } from '../lib/store.js';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cameFromSite = useLocation().key !== 'default';
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    let live = true;
    getPost(id)
      .then((p) => live && setPost(p))
      .catch(() => live && setPost(null));
    return () => {
      live = false;
    };
  }, [id]);

  if (post === undefined) return <p className="page-pad status">Loading…</p>;
  if (post === null)
    return (
      <p className="page-pad status">
        This moment could not be found. <Link to="/gallery" className="underline">Back to the gallery</Link>
      </p>
    );

  const character = findCharacter(post.character);
  const place = findPlace(post.place);

  return (
    <article className="page-pad post">
      <Frame src={post.full} alt={post.caption} ratio="auto" className="photo natural" />
      <h1 className="post-meta">
        {character && <Link to={`/gallery?character=${character.slug}`} className="underline">{character.name}</Link>}
        {character && place && ' in '}
        {place && <Link to={`/gallery?place=${place.slug}`} className="underline">{place.name}</Link>}
      </h1>
      <p className="field filled readonly">{post.caption}</p>
      {post.location && (
        <a className="field pin filled readonly" href={post.location.url} target="_blank" rel="noopener noreferrer">
          <PinIcon />
          <span>{formatLocation(post.location)}</span>
          <span className="sr-only"> (opens Google Maps)</span>
        </a>
      )}
      <nav className="post-nav">
        <button className="link-btn" onClick={() => (cameFromSite ? navigate(-1) : navigate('/gallery'))}>
          <Chevron dir="left" /> Back
        </button>
        <Link to="/capture" className="link-btn">
          Upload your Moment <Chevron />
        </Link>
      </nav>
    </article>
  );
}
