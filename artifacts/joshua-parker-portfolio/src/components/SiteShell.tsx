import { useEffect, useState, type PropsWithChildren } from 'react';
import { Link, useLocation } from 'wouter';
import { publicAsset } from '../lib/public-asset';
import { ContentEditor } from './ContentEditor';
import { CursorShadow } from './CursorShadow';
import { usePortfolioContent } from '../state/PortfolioContentProvider';

export function SiteShell({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [location] = useLocation();
  const { content: { portfolio }, isDeveloper } = usePortfolioContent();

  useEffect(() => {
    setMenuOpen(false);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }, [location]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      '.portrait-card, .skill-card, .writing-section, .principle-band, .skills-section, .section-page-hero, .page-content-section, .page-entry, .page-empty, .page-item-grid li, .business-card, .site-quote',
    ));

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' });

      targets.forEach((target) => {
        target.classList.add('motion-track');
        observer.observe(target);
      });

      return () => {
        observer.disconnect();
        targets.forEach((target) => target.classList.remove('motion-track', 'motion-visible'));
      };
    }

    return undefined;
  }, [location]);

  return (
    <div className="page-shell">
      <div className="ambient-smoke" aria-hidden="true">
        <span className="ambient-smoke-orb" />
        <span className="ambient-smoke-orb" />
        <span className="ambient-smoke-orb" />
        <span className="ambient-smoke-orb" />
        <span className="ambient-smoke-orb" />
        <span className="ambient-smoke-orb" />
        <span className="ambient-smoke-orb" />
      </div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label={`${portfolio.identity.name}, home`}>
          <img className="wordmark-logo" src={publicAsset('parker-monogram.png')} alt="" />
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
          <span
            className={`site-mode-indicator ${import.meta.env.DEV ? 'is-developer' : 'is-viewer'}`}
            aria-label={import.meta.env.DEV ? 'Developer mode' : 'Viewer mode'}
          >
            {isDeveloper ? (
              <button
                className="edit-content-toggle"
                type="button"
                aria-expanded={editorOpen}
                onClick={() => setEditorOpen((open) => !open)}
              >
                Developer mode · Edit
              </button>
            ) : 'Viewer mode'}
          </span>
        </nav>
      </header>

      <main className="site-main" key={location}>{children}</main>

      <section className="site-quote content-width" aria-label="Nikola Tesla quote">
        <blockquote>{portfolio.quote.text}</blockquote>
        <p>— {portfolio.quote.attribution}</p>
      </section>

      <footer className="site-footer content-width">
        <div>
          <strong>{portfolio.identity.name}</strong>
          <span>{portfolio.identity.location}</span>
        </div>
        <nav className="footer-navigation" aria-label="Footer navigation">
          <Link href="/ventures" data-testid="footer-link-current-ventures">Current Ventures</Link>
          <Link href="/contact" data-testid="footer-link-contact">Contact Me</Link>
          <Link href="/" data-testid="footer-link-home">Return Home</Link>
        </nav>
      </footer>
      <CursorShadow />
      {isDeveloper && editorOpen && <ContentEditor onClose={() => setEditorOpen(false)} />}
    </div>
  );
}
