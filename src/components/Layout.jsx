import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MENU = [
  ['/home', 'Home'],
  ['/about', 'About'],
  ['/gallery', 'Gallery'],
  ['/book', 'See the Book'],
  ['/capture', 'Capture Moment'],
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

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
              <Link key={to} to={to} className="box-btn">
                {label}
              </Link>
            ))}
            <button className="link-btn" onClick={() => setOpen(false)}>
              Close
            </button>
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
