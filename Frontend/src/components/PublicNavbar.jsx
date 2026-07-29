import { useState } from 'react';
import { Link } from 'react-router-dom';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
        <Link to="/" className="font-display text-lg tracking-tight">
          FIT<span className="text-pulse">PULSE</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-slate hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary px-4 py-2 text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary px-4 py-2 text-sm">Get started</Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="block py-2 text-sm font-medium text-slate">
              {l.label}
            </a>
          ))}
          <div className="mt-3 flex gap-3">
            <Link to="/login" className="btn-secondary flex-1 py-2 text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary flex-1 py-2 text-sm">Get started</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
