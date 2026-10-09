import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Supporters from './Supporters.jsx';

const MENU = [
  ['/home', 'Home'],
  ['/about', 'About'],
  ['/gallery', 'Gallery'],
  ['/book', 'See the Book'],
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Choosing the page you are already on still closes the menu and goes back to its top.
  const go = () => {
    setOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="shell">
      <div className="column">
        <header className="topbar">
          <Link to="/home" className="topbar-logo" aria-label="Let This Book Be Your Public Space — home" />
          <button
            className="topbar-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          />
        </header>
        {open && (
          <nav className="menu dotted" aria-label="Main">
            {MENU.map(([to, label]) => (
              <Link key={to} to={to} className="box-btn" onClick={go}>
                {label}
              </Link>
            ))}
            <Link to="/capture" className="capture-banner" onClick={go}>
              <img src="/img/capture-moment.png" alt="Capture moment" width="540" height="418" />
            </Link>
            <button className="close-btn" onClick={() => setOpen(false)}>
              Close
            </button>
            <Supporters />
          </nav>
        )}
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">
          <span>Let This Book Be Your Public Space</span>
          <span>2025</span>
        </footer>
      </div>
    </div>
  );
}
