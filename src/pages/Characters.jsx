import { Link } from 'react-router-dom';
import Frame from '../components/Frame.jsx';
import { CHARACTERS } from '../data.js';

export default function Characters() {
  return (
    <div className="page-pad">
      <h1 className="title-light">Choose your character first:</h1>
      <ul className="art-grid">
        {CHARACTERS.map((c) => (
          <li key={c.slug}>
            <Link to={`/capture/${c.slug}`} className="art-card">
              <Frame src={c.image} alt="" />
              <span>{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
