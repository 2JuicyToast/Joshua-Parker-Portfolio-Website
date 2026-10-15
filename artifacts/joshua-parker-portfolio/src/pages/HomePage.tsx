import { Link } from 'wouter';
import { portfolio } from '../content';

function ArrowMark({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow-mark">{diagonal ? '↗' : '→'}</span>;
}

export function HomePage() {
  const { identity, principle, skills } = portfolio;

  return (
    <>
      <section className="hero content-width" id="home">
        <div className="hero-copy">
          <p className="eyebrow reveal">{identity.location} <span>·</span> {identity.classYear}</p>
          <h1 className="serif reveal reveal-delay-1">{identity.name}<span className="period">.</span></h1>
          <h2 className="hero-subtitle reveal reveal-delay-1">{identity.headline}</h2>
          <p className="hero-intro reveal reveal-delay-2">{identity.introduction}</p>
          <div className="hero-actions reveal reveal-delay-3">
            <Link className="button button-primary" href="/projects" data-testid="link-view-projects">
              {portfolio.actions.projects}<ArrowMark />
            </Link>
            <Link className="button button-outline" href="/writing" data-testid="link-read-writing">
              {portfolio.actions.writing}<ArrowMark />
            </Link>
            <Link className="button button-outline" href="/contact" data-testid="link-contact">
              {portfolio.actions.contact}<ArrowMark />
            </Link>
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
        </aside>
      </section>

      <section className="principle-band content-width" aria-label={principle.label}>
        <span className="band-mark" aria-hidden="true">“</span>
        <div>
          <p className="eyebrow light-eyebrow">{principle.label}</p>
          <blockquote>{principle.quote}</blockquote>
        </div>
        <span className="band-outline" aria-hidden="true" />
      </section>

      <section className="skills-section content-width" id="skills">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{skills.eyebrow}</p>
            <h2 className="serif">{skills.title}<span className="period">.</span></h2>
          </div>
          <span className="section-rule" />
          <span className="section-index mono">A—01</span>
        </div>
        <div className="skills-grid">
          {skills.groups.map((group, index) => (
            <article className={`skill-card skill-card-${index + 1}`} key={group.title}>
              <span className="skill-card-number mono">0{index + 1}</span>
              <h3 className="serif">{group.title}</h3>
              <div className="tag-list">
                {group.items.map((item) => <span className="skill-tag" key={item}>{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}
