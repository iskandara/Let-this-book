import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRAYER =
  'Dear God, thank You for granting me a new day. Please forgive my mistakes, and keep me from spending my free time at malls or cafés this week. Calm my mind and keep me free.';

export default function Intro() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), 6500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <button className="intro" onClick={() => navigate('/home', { replace: true })} aria-label="Continue">
      <span className="sr-only">{PRAYER}</span>
      <span className="intro-hint" aria-hidden="true">
        tap to continue
      </span>
    </button>
  );
}
