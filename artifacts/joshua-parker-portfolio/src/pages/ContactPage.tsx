import { Link } from 'wouter';
import { MotionDecor } from '../components/MotionDecor';
import { usePortfolioContent } from '../state/PortfolioContentProvider';

function splitContactDetail(text: string, fallbackLabel: string) {
  const match = text.trim().match(/^(.+?)\s*[·:]\s*(.*)$/);
  if (match) {
    return { label: `${match[1].replace(/:$/, '').trim()}:`, value: match[2].trim() };
  }

  const trimmed = text.trim();
  if (trimmed.toLowerCase().replace(/:$/, '') === fallbackLabel.toLowerCase()) {
    return { label: `${trimmed.replace(/:$/, '')}:`, value: '' };
  }

  return { label: `${fallbackLabel}:`, value: trimmed };
}

export function ContactPage() {
  const { content: { portfolio } } = usePortfolioContent();
  const { contact } = portfolio;
  const emailDetail = splitContactDetail(contact.emailLabel, 'Email');
  const phoneDetail = splitContactDetail(contact.phoneLabel, 'Phone');

  return (
    <>
      <section className="section-page-hero content-width contact-hero">
        <MotionDecor theme="abstract" />
        <p className="eyebrow">{contact.eyebrow}</p>
        <h1 className="serif section-page-title">{contact.title}<span className="period">.</span></h1>
        <p className="section-page-intro">{contact.body}</p>
      </section>
      <section className="section-page-content content-width contact-content">
        <article className="business-card" aria-label={`Contact card for ${portfolio.identity.name}`}>
          <div className="business-card-edge" aria-hidden="true" />
          <div className="business-card-top">
            <span className="business-card-monogram serif">JP</span>
          </div>
          <div className="business-card-main">
            <p className="eyebrow">Get in touch</p>
            <h2 className="serif">{portfolio.identity.name}<span className="period">.</span></h2>
            <p className="business-card-role">{contact.role}</p>
          </div>
          <div className="business-card-bottom">
            <div className="business-card-details">
              {contact.email
                ? (
                  <a href={`mailto:${contact.email}`}>
                    <span className="contact-detail-label">{emailDetail.label}</span>{' '}
                    <span className="contact-detail-value">{contact.email}</span>
                  </a>
                )
                : (
                  <span>
                    <span className="contact-detail-label">{emailDetail.label}</span>
                    {emailDetail.value && <> <span className="contact-detail-placeholder">{emailDetail.value}</span></>}
                  </span>
                )}
              {contact.phone
                ? (
                  <a href={`tel:${contact.phone}`}>
                    <span className="contact-detail-label">{phoneDetail.label}</span>{' '}
                    <span className="contact-detail-value">{phoneDetail.value || contact.phone}</span>
                  </a>
                )
                : (
                  <span>
                    <span className="contact-detail-label">{phoneDetail.label}</span>
                    {phoneDetail.value && <> <span className="contact-detail-placeholder">{phoneDetail.value}</span></>}
                  </span>
                )}
            </div>
            <div className="business-card-socials" aria-label="Social profiles">
              {portfolio.social.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`contact-social-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {item.label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <span className="business-card-watermark" aria-hidden="true">JP</span>
        </article>
        <div className="page-return">
          <Link className="button button-outline" href="/">Back to Home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
