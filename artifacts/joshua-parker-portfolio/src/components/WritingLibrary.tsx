import { useEffect, useState } from 'react';
import { writingSections, type WritingDocument } from '../content';
import { publicAsset } from '../lib/public-asset';

export function WritingLibrary() {
  const [selectedDocument, setSelectedDocument] = useState<WritingDocument | null>(null);

  useEffect(() => {
    if (!selectedDocument) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedDocument(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedDocument]);

  const pdfUrl = selectedDocument
    ? publicAsset(`writing/${selectedDocument.filename}`)
    : null;

  return (
    <>
      <div className="writing-library">
        {writingSections.map((section, index) => (
          <section className="writing-section" key={section.id} aria-labelledby={`writing-section-${section.id}`}>
            <p className="eyebrow">{String(index + 1).padStart(2, '0')} / Writing</p>
            <h2 className="serif writing-section-title" id={`writing-section-${section.id}`}>
              {section.title}
            </h2>
            <p className="writing-section-description">{section.description}</p>

            {section.documents.length > 0 ? (
              <div className="writing-document-list">
                {section.documents.map((document) => (
                  <button
                    className="writing-document-button"
                    key={document.filename}
                    type="button"
                    onClick={() => setSelectedDocument(document)}
                    aria-haspopup="dialog"
                    data-testid={`button-open-writing-${section.id}`}
                  >
                    <span className="writing-document-copy">
                      <span className="serif writing-document-title">{document.title}</span>
                      {document.description && (
                        <span className="writing-document-description">{document.description}</span>
                      )}
                    </span>
                    <span className="writing-document-action">
                      Read PDF <span aria-hidden="true">↗</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="writing-empty">Selected pieces will appear here when published.</p>
            )}
          </section>
        ))}
      </div>

      {selectedDocument && pdfUrl && (
        <div
          className="slideshow-backdrop"
          role="presentation"
          onClick={() => setSelectedDocument(null)}
        >
          <section
            className="slideshow-dialog pdf-viewer-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="writing-pdf-title"
            onClick={(event) => event.stopPropagation()}
            data-testid="writing-pdf-dialog"
          >
            <button
              className="slideshow-close"
              type="button"
              aria-label="Close PDF viewer"
              onClick={() => setSelectedDocument(null)}
            >
              ×
            </button>
            <div className="pdf-viewer-heading">
              <p className="eyebrow">Writing · PDF preview</p>
              <h2 className="serif" id="writing-pdf-title">{selectedDocument.title}</h2>
              {selectedDocument.description && (
                <p className="pdf-viewer-description">{selectedDocument.description}</p>
              )}
            </div>
            <iframe
              className="pdf-viewer-frame"
              src={`${pdfUrl}#view=FitH`}
              title={`PDF preview: ${selectedDocument.title}`}
            />
            <div className="pdf-viewer-actions">
              <a className="button button-outline" href={pdfUrl} target="_blank" rel="noreferrer">
                Open PDF in a new tab <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
