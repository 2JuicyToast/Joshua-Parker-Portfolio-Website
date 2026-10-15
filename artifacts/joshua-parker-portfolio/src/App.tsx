import { useState } from 'react';
import { portfolio } from './content';

function ArrowMark({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow-mark">{diagonal ? '↗' : '→'}</span>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { identity, navigation, sections } = portfolio;

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Joshua Parker, home">
          <span className="wordmark-monogram">JP</span>
          <span>Joshua Parker</span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
        <nav className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} className={index === 0 ? 'nav-home' : ''} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero content-width" id="home">
          <div className="hero-copy">
            <p className="eyebrow reveal">{identity.location} <span>·</span> {identity.classYear}</p>
            <h1 className="serif reveal reveal-delay-1">{identity.name}<span className="period">.</span></h1>
            <h2 className="hero-subtitle reveal reveal-delay-1">{identity.headline}</h2>
            <p className="hero-intro reveal reveal-delay-2">{identity.introduction}</p>
            <div className="hero-actions reveal reveal-delay-3">
              <a className="button button-primary" href="#projects">{portfolio.actions.projects}<ArrowMark /></a>
              <a className="button button-outline" href="#writing">{portfolio.actions.writing}<ArrowMark /></a>
              <a className="button button-outline" href="#contact">{portfolio.actions.contact}<ArrowMark /></a>
            </div>
            <div className="social-list reveal reveal-delay-3" aria-label="Social profiles">
              {portfolio.social.map((item) => item.url ? (
                <a key={item.label} href={item.url} target="_blank" rel="noreferrer">{item.label}<ArrowMark diagonal /></a>
              ) : (
                <span className="social-placeholder" key={item.label} title="Profile link not provided">{item.label}<i aria-hidden="true">↗</i></span>
              ))}
            </div>
          </div>
          <aside className="portrait-stage reveal reveal-delay-2" aria-label={identity.portraitLabel}>
            <div className="portrait-card">
              <div className="portrait-inner">
                <span className="portrait-label">{identity.portraitLabel}</span>
                <span className="portrait-caption">{identity.portraitNote}</span>
              </div>
              <span className="portrait-index mono">01 / JP</span>
            </div>
            <span className="orbit orbit-one" /><span className="orbit orbit-two" />
            <span className="portrait-side-note mono">DOVER, DE<br />EST. 2027</span>
          </aside>
        </section>

        <section className="principle-band content-width" aria-label={portfolio.principle.label}>
          <span className="band-mark" aria-hidden="true">“</span>
          <div>
            <p className="eyebrow light-eyebrow">{portfolio.principle.label}</p>
            <blockquote>{portfolio.principle.quote}</blockquote>
          </div>
          <span className="band-outline" aria-hidden="true" />
        </section>

        <section className="skills-section content-width" id="skills">
          <div className="section-heading">
            <div><p className="eyebrow">{portfolio.skills.eyebrow}</p><h2 className="serif">{portfolio.skills.title}<span className="period">.</span></h2></div>
            <span className="section-rule" />
            <span className="section-index mono">A—01</span>
          </div>
          <div className="skills-grid">
            {portfolio.skills.groups.map((group, i) => (
              <article className={`skill-card skill-card-${i + 1}`} key={group.title}>
                <span className="skill-card-number mono">0{i + 1}</span>
                <h3 className="serif">{group.title}</h3>
                <div className="tag-list">{group.items.map((item) => <span className="skill-tag" key={item}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="quote-wrap content-width">
          <div className="quote-card">
            <span className="quote-spark" aria-hidden="true" />
            <blockquote className="serif">{portfolio.quote.text}</blockquote>
            <p className="quote-credit"><span /> {portfolio.quote.attribution}</p>
          </div>
        </section>

        <section className="chapter-list content-width" aria-label="Portfolio sections">
          {Object.entries(sections).map(([key, section]) => (
            <article className="chapter" id={key} key={key}>
              <div className="chapter-number mono">{section.number}</div>
              <div className="chapter-main">
                <p className="eyebrow">{section.eyebrow}</p>
                <h2 className="serif">{section.title}<span className="period">.</span></h2>
                <p className="chapter-intro">{section.intro}</p>
              </div>
              <div className="chapter-placeholder">
                <span className="placeholder-rule" />
                <p>{section.placeholder}</p>
                <small>{section.note}</small>
                <span className="placeholder-mark" aria-hidden="true">+</span>
              </div>
            </article>
          ))}
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-inner content-width">
            <div className="contact-orbit" aria-hidden="true" />
            <div className="contact-copy">
              <p className="eyebrow light-eyebrow">{portfolio.contact.eyebrow}</p>
              <h2 className="serif">{portfolio.contact.title}</h2>
              <p>{portfolio.contact.body}</p>
            </div>
            <div className="contact-action">
              <span>{portfolio.contact.placeholder}</span>
              <a href="#home" className="back-top">{portfolio.backToTop} <ArrowMark diagonal /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer content-width">
        <div><strong>{identity.name}</strong><span>{identity.location}</span></div>
        <p>{portfolio.footer}</p>
        <div className="footer-links">{navigation.slice(1, 4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
      </footer>
    </div>
  );
}

export default App;
