import { useEffect, useState, type PropsWithChildren } from 'react';
import { Link, useLocation } from 'wouter';
import { portfolio } from '../content';

export function SiteShell({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="page-shell">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label={`${portfolio.identity.name}, home`}>
          <span className="wordmark-monogram">JP</span>
          <span>{portfolio.identity.name}</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((open) => !open)}
          data-testid="button-toggle-navigation"
        >
          <span /><span />
        </button>
        <nav
          className={`navigation ${menuOpen ? 'is-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {portfolio.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={location === item.href ? 'nav-active' : ''}
              aria-current={location === item.href ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
              data-testid={`nav-${item.id}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <section className="site-quote content-width" aria-label="Nikola Tesla quote">
        <blockquote>{portfolio.quote.text}</blockquote>
        <p>— {portfolio.quote.attribution}</p>
      </section>

      <footer className="site-footer content-width">
        <div>
          <strong>{portfolio.identity.name}</strong>
          <span>{portfolio.identity.location}</span>
        </div>
      </footer>
    </div>
  );
}
