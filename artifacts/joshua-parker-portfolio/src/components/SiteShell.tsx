import { useEffect, useState, type PropsWithChildren } from 'react';
import { Link, useLocation } from 'wouter';
import { portfolio } from '../content';

export function SiteShell({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }, [location]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      '.portrait-card, .skill-card, .principle-band, .skills-section, .section-page-hero, .page-content-section, .page-entry, .page-empty, .page-item-grid li, .business-card, .site-quote',
    ));
    const cardTargets = '.portrait-card, .skill-card, .page-entry, .page-empty, .page-item-grid li, .business-card';
    const pointerHandlers = new Map<HTMLElement, { move: (event: PointerEvent) => void; leave: () => void }>();

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

      if (canHover) {
        targets.forEach((target) => {
          const updatePointer = (event: PointerEvent) => {
            const bounds = target.getBoundingClientRect();
            const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
            const isCard = target.matches(cardTargets);
            const travel = isCard ? 2 : 0.8;
            const tilt = isCard ? 1.15 : 0;
            target.style.setProperty('--spot-x', `${(normalizedX + 1) * 50}%`);
            target.style.setProperty('--spot-y', `${(normalizedY + 1) * 50}%`);
            target.style.setProperty('--pointer-shift-x', `${normalizedX * travel}px`);
            target.style.setProperty('--pointer-shift-y', `${normalizedY * travel}px`);
            target.style.setProperty('--pointer-tilt-x', `${-normalizedY * tilt}deg`);
            target.style.setProperty('--pointer-tilt-y', `${normalizedX * tilt}deg`);
            target.classList.add('motion-pointed');
          };
          const clearPointer = () => {
            target.classList.remove('motion-pointed');
            target.style.removeProperty('--spot-x');
            target.style.removeProperty('--spot-y');
            target.style.removeProperty('--pointer-shift-x');
            target.style.removeProperty('--pointer-shift-y');
            target.style.removeProperty('--pointer-tilt-x');
            target.style.removeProperty('--pointer-tilt-y');
          };
          target.addEventListener('pointermove', updatePointer, { passive: true });
          target.addEventListener('pointerleave', clearPointer, { passive: true });
          pointerHandlers.set(target, { move: updatePointer, leave: clearPointer });
        });
      }

      return () => {
        observer.disconnect();
        targets.forEach((target) => {
          target.classList.remove('motion-track', 'motion-visible', 'motion-pointed');
          target.style.removeProperty('--spot-x');
          target.style.removeProperty('--spot-y');
          target.style.removeProperty('--pointer-shift-x');
          target.style.removeProperty('--pointer-shift-y');
          target.style.removeProperty('--pointer-tilt-x');
          target.style.removeProperty('--pointer-tilt-y');
          const handlers = pointerHandlers.get(target);
          if (handlers) {
            target.removeEventListener('pointermove', handlers.move);
            target.removeEventListener('pointerleave', handlers.leave);
          }
        });
      };
    }

    return undefined;
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
          <span
            className={`site-mode-indicator ${import.meta.env.DEV ? 'is-developer' : 'is-viewer'}`}
            aria-label={import.meta.env.DEV ? 'Developer mode' : 'Viewer mode'}
          >
            {import.meta.env.DEV ? 'Developer mode' : 'Viewer mode'}
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
    </div>
  );
}
