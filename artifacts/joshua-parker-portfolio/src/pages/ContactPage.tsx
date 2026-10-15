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
            <h2 className="serif">Contact details</h2>
            <p>{contact.body}</p>
            <div className="contact-detail-list">
              {contact.email
                ? <a href={`mailto:${contact.email}`}>Email · {contact.email}</a>
                : <span>{contact.emailLabel}</span>}
              {contact.phone
                ? <a href={`tel:${contact.phone}`}>Phone · {contact.phone}</a>
                : <span>{contact.phoneLabel}</span>}
            </div>
          </div>
        </article>
        <div className="page-return">
          <Link className="button button-outline" href="/">Back to Home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
