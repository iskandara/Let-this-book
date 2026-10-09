import { Link } from 'react-router-dom';
import Supporters from '../components/Supporters.jsx';

export default function Home() {
  return (
    <div className="dotted page-pad home">
      <nav className="stack">
        <Link to="/about" className="box-btn">About</Link>
        <Link to="/gallery" className="box-btn">Gallery</Link>
        <Link to="/book" className="box-btn">See the Book</Link>
      </nav>
      <Link to="/capture" className="capture-banner">
        <img src="/img/capture-moment.png" alt="Capture moment" width="540" height="418" />
      </Link>
      <Supporters />
    </div>
  );
}
