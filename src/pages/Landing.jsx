import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <h1 className="landing-title">
        <img src="/img/title.png" alt="Let This Book Be Your Public Space." width="722" height="764" />
      </h1>
      <Link to="/intro" className="landing-start">
        Start Exploring
      </Link>
      <p className="landing-note">“For a better experience, access this website from your phone.”</p>
    </div>
  );
}
