import { Link, Navigate, useParams } from 'react-router-dom';
import Frame from '../components/Frame.jsx';
import { PLACES, findCharacter } from '../data.js';

export default function Places() {
  const character = findCharacter(useParams().character);
  if (!character) return <Navigate to="/capture" replace />;

  return (
    <div className="page-pad">
      <h1 className="title-light">
        <Link to="/capture" className="underline" title="Choose another character">
          {character.name}
        </Link>
        <br />
        in a:
      </h1>
      <ul className="art-grid">
        {PLACES.map((p) => (
          <li key={p.slug}>
            <Link to={`/capture/${character.slug}/${p.slug}`} className="art-card">
              <Frame src={p.image} alt="" />
              <span>{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
