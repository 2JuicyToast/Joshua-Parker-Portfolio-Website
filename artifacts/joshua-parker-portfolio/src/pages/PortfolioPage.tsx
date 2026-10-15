import { Link } from 'wouter';
import { portfolio, type PortfolioPageKey } from '../content';

export function PortfolioPage({ pageKey }: { pageKey: PortfolioPageKey }) {
  const page = portfolio.pages[pageKey];

  return (
    <>
      <section className="section-page-hero content-width">
        <p className="eyebrow">{page.eyebrow}<span> · </span> {page.number}</p>
        <h1 className="serif section-page-title">{page.title}<span className="period">.</span></h1>
        {page.intro && <p className="section-page-intro">{page.intro}</p>}
      </section>
      <section className="section-page-content content-width" aria-label={page.title}>
        <div className="page-sections">
          {page.sections.map((section, sectionIndex) => (
            <section className="page-content-section" key={`${section.title ?? 'section'}-${sectionIndex}`}>
              {section.title && <h2 className="serif page-section-title">{section.title}</h2>}
              {section.entries && section.entries.length > 0 && (
                <div className="page-entry-list">
                  {section.entries.map((entry) => (
                    <article className="page-entry" key={entry.title}>
                      <div className="page-entry-heading">
                        <div>
                          {entry.eyebrow && <p className="eyebrow">{entry.eyebrow}</p>}
                          <h3 className="serif">{entry.title}</h3>
                          {entry.subtitle && <p className="entry-subtitle">{entry.subtitle}</p>}
                        </div>
                        {entry.status && <span className="entry-status">{entry.status}</span>}
                      </div>
                      {entry.description && <p className="entry-description">{entry.description}</p>}
                      {entry.whatItDoes && (
                        <div className="project-highlight">
                          <p className="eyebrow">What It Does</p>
                          <p>{entry.whatItDoes}</p>
                        </div>
                      )}
                      {(entry.problem || entry.role || entry.tools?.length || entry.learning) && (
                        <dl className="project-details">
                          {entry.problem && <div><dt>Problem</dt><dd>{entry.problem}</dd></div>}
                          {entry.role && <div><dt>My Role</dt><dd>{entry.role}</dd></div>}
                          {entry.tools && entry.tools.length > 0 && <div><dt>Tools & Skills</dt><dd>{entry.tools.join(', ')}</dd></div>}
                          {entry.learning && <div><dt>What I Learned</dt><dd>{entry.learning}</dd></div>}
                        </dl>
                      )}
                    </article>
                  ))}
                </div>
              )}
              {section.items && section.items.length > 0 && (
                <ol className="page-item-grid">
                  {section.items.map((item) => (
                    <li key={item.number}>
                      <span className="page-item-number mono">{item.number}</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ol>
              )}
              {section.note && <p className="page-note">{section.note}</p>}
              {section.copy && (
                <article className="page-empty writing-status">
                  <p className="eyebrow">Writing</p>
                  <p>{section.copy}</p>
                </article>
              )}
            </section>
          ))}
        </div>
        <div className="page-return">
          <Link className="button button-outline" href="/">Back to Home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
