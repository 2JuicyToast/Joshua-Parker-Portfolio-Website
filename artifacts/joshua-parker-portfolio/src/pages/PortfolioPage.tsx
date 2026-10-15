import { useState } from 'react';
import { Link } from 'wouter';
import { portfolio, type PortfolioPageKey } from '../content';
import { MotionDecor } from '../components/MotionDecor';

export function PortfolioPage({ pageKey }: { pageKey: PortfolioPageKey }) {
  const page = portfolio.pages[pageKey];
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const decorTheme = pageKey === 'interests' ? 'interests' : pageKey === 'writing' ? 'writing' : 'abstract';

  return (
    <>
      <section className="section-page-hero content-width">
        <MotionDecor theme={decorTheme} />
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
                      </div>
                      {entry.description && <p className="entry-description">{entry.description}</p>}
                      {(entry.problem || entry.whatItDoes || entry.role || entry.tools || entry.status || entry.learning) && (
                        <dl className="project-details">
                          {entry.problem && <div><dt>Problem</dt><dd>{entry.problem}</dd></div>}
                          {entry.whatItDoes && <div><dt>What It Does</dt><dd>{entry.whatItDoes}</dd></div>}
                          {entry.role && <div><dt>My Role</dt><dd>{entry.role}</dd></div>}
                          {entry.tools && <div><dt>Tools & Skills</dt><dd>{entry.tools}</dd></div>}
                          {entry.status && <div><dt>Status</dt><dd>{entry.status}</dd></div>}
                          {entry.learning && <div><dt>What I Learned</dt><dd>{entry.learning}</dd></div>}
                        </dl>
                      )}
                      {pageKey === 'projects' && (
                        <button
                          className="page-entry-link slideshow-trigger"
                          type="button"
                          onClick={() => setSelectedProject(entry.title)}
                          data-testid={`button-view-slideshow-${entry.title.toLowerCase().replaceAll(' ', '-')}`}
                        >
                          View Slideshow <span aria-hidden="true">↗</span>
                        </button>
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
                      <div className="page-item-copy">
                        <span className="page-item-label">{item.label}</span>
                        {item.description && <span className="page-item-description">{item.description}</span>}
                      </div>
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
      {selectedProject && (
        <div className="slideshow-backdrop" role="presentation" onClick={() => setSelectedProject(null)}>
          <section
            className="slideshow-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="slideshow-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="slideshow-close"
              type="button"
              aria-label="Close slideshow"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>
            <p className="eyebrow">{selectedProject}</p>
            <h2 className="serif" id="slideshow-title">Project slideshow</h2>
            <div className="slideshow-placeholder">Placeholder slides for the selected project.</div>
            <div className="slideshow-controls">
              <button type="button" disabled>← Previous</button>
              <span>1 / 1</span>
              <button type="button" disabled>Next →</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
