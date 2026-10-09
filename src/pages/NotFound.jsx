import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-pad">
      <h1 className="title-light">Lost?</h1>
      <p className="status">
        This page does not exist. <Link to="/home" className="underline">Go home</Link>
      </p>
    </div>
  );
}
