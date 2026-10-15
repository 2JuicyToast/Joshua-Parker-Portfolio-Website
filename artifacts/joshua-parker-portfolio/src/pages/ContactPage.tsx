import { Link } from 'wouter';
import { portfolio } from '../content';

export function ContactPage() {
  const { contact } = portfolio;

  return (
    <>
      <section className="section-page-hero content-width">
        <p className="eyebrow">{contact.eyebrow}</p>
        <h1 className="serif section-page-title">{contact.title}<span className="period">.</span></h1>
        <p className="section-page-intro">{contact.body}</p>
      </section>
      <section className="section-page-content content-width">
        <article className="page-empty contact-empty">
          <span className="chapter-number mono">06</span>
          <div>
            <p className="eyebrow">Get in touch</p>
            {contact.email ? (
              <>
                <h2 className="serif">{contact.email}</h2>
                <a className="page-entry-link" href={`mailto:${contact.email}`}>Send an email <span aria-hidden="true">↗</span></a>
              </>
            ) : (
              <>
                <h2 className="serif">Contact details haven’t been added yet.</h2>
                <p>{contact.placeholder}</p>
              </>
            )}
          </div>
        </article>
        <div className="page-return">
          <Link className="button button-outline" href="/">Back to Home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
