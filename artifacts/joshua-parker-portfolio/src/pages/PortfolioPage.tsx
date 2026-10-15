import { Link } from 'wouter';
import { portfolio, type PortfolioPageKey } from '../content';

export function PortfolioPage({ pageKey }: { pageKey: PortfolioPageKey }) {
  const page = portfolio.pages[pageKey];

  return (
    <>
      <section className="section-page-hero content-width">
        <p className="eyebrow">{page.eyebrow}<span> · </span> {page.number}</p>
        <h1 className="serif section-page-title">{page.title}<span className="period">.</span></h1>
        <p className="section-page-intro">{page.intro}</p>
      </section>
      <section className="section-page-content content-width" aria-label={page.title}>
        {page.entries.length > 0 ? (
          <div className="page-entry-list">
            {page.entries.map((entry) => (
              <article className="page-entry" key={`${entry.title}-${entry.meta ?? ''}`}>
                {entry.meta && <p className="eyebrow">{entry.meta}</p>}
                <h2 className="serif">{entry.title}</h2>
                <p>{entry.description}</p>
                {entry.href && (
                  <a href={entry.href} target="_blank" rel="noreferrer" className="page-entry-link">
                    Read more <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <article className="page-empty">
            <span className="chapter-number mono">{page.number}</span>
            <div>
              <p className="eyebrow">Portfolio details</p>
              <h2 className="serif">{page.emptyTitle}</h2>
              <p>{page.emptyNote}</p>
            </div>
          </article>
        )}
        <div className="page-return">
          <Link className="button button-outline" href="/">Back to Home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
