import { useEffect } from 'react';
import type { PortfolioEntry, PortfolioPageKey } from '../content';
import { createPortal } from 'react-dom';
import {
  usePortfolioContent,
  type EditableCollection,
  type PortfolioContentPath,
} from '../state/PortfolioContentProvider';

type FieldProps = {
  label: string;
  path: PortfolioContentPath;
  value: string;
  multiline?: boolean;
  type?: 'text' | 'email' | 'url' | 'tel';
};

function TextField({ label, path, value, multiline = false, type = 'text' }: FieldProps) {
  const { updateContent } = usePortfolioContent();
  return (
    <label className="editor-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => updateContent(path, event.target.value)}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => updateContent(path, event.target.value)}
        />
      )}
    </label>
  );
}

function ListField({ label, path, value }: FieldProps) {
  const { updateContent } = usePortfolioContent();
  const items = value.split('\n');
  return (
    <label className="editor-field">
      <span>{label} <small>One item per line</small></span>
      <textarea
        value={value}
        onChange={(event) => updateContent(
          path,
          event.target.value.split('\n').map((item) => item.trim()).filter(Boolean),
        )}
        rows={Math.max(3, Math.min(items.length + 1, 8))}
      />
    </label>
  );
}

const projectFields: { key: keyof PortfolioEntry; label: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Card title' },
  { key: 'eyebrow', label: 'Small heading' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'problem', label: 'Problem', multiline: true },
  { key: 'whatItDoes', label: 'What it does', multiline: true },
  { key: 'role', label: 'My role', multiline: true },
  { key: 'tools', label: 'Tools and skills', multiline: true },
  { key: 'status', label: 'Status' },
  { key: 'learning', label: 'What I learned', multiline: true },
];

const editablePageKeys: PortfolioPageKey[] = [
  'projects',
  'ventures',
  'writing',
  'recognition',
  'interests',
];

function AddCardButton({
  collection,
  children,
}: {
  collection: EditableCollection;
  children: string;
}) {
  const { addCard } = usePortfolioContent();
  return (
    <button className="editor-add-button" type="button" onClick={() => addCard(collection)}>
      <span aria-hidden="true">+</span> {children}
    </button>
  );
}

export function ContentEditor({ onClose }: { onClose: () => void }) {
  const {
    content,
    hasUnsavedChanges,
    saveMessage,
    saveChanges,
    discardChanges,
  } = usePortfolioContent();
  const { portfolio, writingSections } = content;
  const projectSections = portfolio.pages.projects.sections;
  const ventureSections = portfolio.pages.ventures.sections;
  const recognitionSection = portfolio.pages.recognition.sections[0];

  const downloadViewerContent = () => {
    const file = new Blob([`${JSON.stringify(content, null, 2)}\n`], {
      type: 'application/json',
    });
    const fileUrl = window.URL.createObjectURL(file);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = 'portfolio-content.json';
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return createPortal(
    <div className="content-editor-layer">
      <button
        className="content-editor-backdrop"
        type="button"
        aria-label="Close content editor"
        onClick={onClose}
      />
      <aside
        className="content-editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-editor-title"
      >
        <header className="content-editor-header">
          <div>
            <p className="eyebrow">Developer mode</p>
            <h2 className="serif" id="content-editor-title">Edit portfolio content</h2>
          </div>
          <button className="content-editor-close" type="button" onClick={onClose} aria-label="Close editor" autoFocus>
            ×
          </button>
        </header>
        <p className="content-editor-note">
          Save keeps edits in this browser. To publish them, download the Viewer file below, replace
          {' '}<code>public/portfolio-content.json</code>, then push the project to <code>main</code>.
        </p>
        <div className="content-editor-export">
          <span>Anyone can view this content after it is published. Don’t put passwords or private information here.</span>
          <button className="editor-add-button" type="button" onClick={downloadViewerContent}>
            <span aria-hidden="true">↓</span> Download Viewer content
          </button>
        </div>

        <div className="content-editor-body">
          <details className="content-editor-group" open>
            <summary>Home page</summary>
            <div className="content-editor-fields">
              <TextField label="Name" path={['portfolio', 'identity', 'name']} value={portfolio.identity.name} />
              <TextField label="Location" path={['portfolio', 'identity', 'location']} value={portfolio.identity.location} />
              <TextField label="Class year" path={['portfolio', 'identity', 'classYear']} value={portfolio.identity.classYear} />
              <TextField label="Headline" path={['portfolio', 'identity', 'headline']} value={portfolio.identity.headline} multiline />
              <TextField label="Introduction" path={['portfolio', 'identity', 'introduction']} value={portfolio.identity.introduction} multiline />
              <TextField label="Projects button" path={['portfolio', 'actions', 'projects']} value={portfolio.actions.projects} />
              <TextField label="Writing button" path={['portfolio', 'actions', 'writing']} value={portfolio.actions.writing} />
              <TextField label="Contact button" path={['portfolio', 'actions', 'contact']} value={portfolio.actions.contact} />
              <TextField label="Principle heading" path={['portfolio', 'principle', 'label']} value={portfolio.principle.label} />
              <TextField label="Principle statement" path={['portfolio', 'principle', 'quote']} value={portfolio.principle.quote} multiline />
              <TextField label="Footer quote" path={['portfolio', 'quote', 'text']} value={portfolio.quote.text} multiline />
              <TextField label="Footer quote attribution" path={['portfolio', 'quote', 'attribution']} value={portfolio.quote.attribution} />
              {portfolio.skills.groups.map((group, index) => (
                <div className="editor-card-fields" key={index}>
                  <TextField label={`Skill group ${index + 1}`} path={['portfolio', 'skills', 'groups', index, 'title']} value={group.title} />
                  <ListField
                    label={`Skills in ${group.title}`}
                    path={['portfolio', 'skills', 'groups', index, 'items']}
                    value={group.items.join('\n')}
                  />
                </div>
              ))}
            </div>
          </details>

          <details className="content-editor-group">
            <summary>Page headings and introductions</summary>
            <div className="content-editor-fields">
              {editablePageKeys.map((key) => {
                const page = portfolio.pages[key];
                return (
                  <div className="editor-card-fields" key={key}>
                    <strong>{page.title}</strong>
                    <TextField label="Page title" path={['portfolio', 'pages', key, 'title']} value={page.title} />
                    <TextField label="Small heading" path={['portfolio', 'pages', key, 'eyebrow']} value={page.eyebrow} />
                    <TextField label="Introduction" path={['portfolio', 'pages', key, 'intro']} value={page.intro} multiline />
                  </div>
                );
              })}
            </div>
          </details>

          <details className="content-editor-group">
            <summary>Projects</summary>
            <div className="content-editor-fields">
              <AddCardButton collection="projects">Add project card</AddCardButton>
              {projectSections.flatMap((section, sectionIndex) =>
                (section.entries ?? []).map((entry, entryIndex) => {
                  const path = ['portfolio', 'pages', 'projects', 'sections', sectionIndex, 'entries', entryIndex];
                  return (
                    <details className="editor-card" key={`${sectionIndex}-${entryIndex}`}>
                      <summary>{entry.title || `Project ${entryIndex + 1}`}</summary>
                      <div className="content-editor-fields">
                        {projectFields.map((field) => (
                          <TextField
                            key={field.key}
                            label={field.label}
                            path={[...path, field.key]}
                            value={entry[field.key] ?? ''}
                            multiline={field.multiline}
                          />
                        ))}
                      </div>
                    </details>
                  );
                }),
              )}
            </div>
          </details>

          <details className="content-editor-group">
            <summary>Current ventures</summary>
            <div className="content-editor-fields">
              <AddCardButton collection="ventures">Add venture card</AddCardButton>
              {ventureSections.flatMap((section, sectionIndex) =>
                (section.entries ?? []).map((entry, entryIndex) => {
                  const path = ['portfolio', 'pages', 'ventures', 'sections', sectionIndex, 'entries', entryIndex];
                  return (
                    <details className="editor-card" key={`${sectionIndex}-${entryIndex}`}>
                      <summary>{entry.title || `Venture ${entryIndex + 1}`}</summary>
                      <div className="content-editor-fields">
                        <TextField label="Card title" path={[...path, 'title']} value={entry.title} />
                        <TextField label="Subtitle" path={[...path, 'subtitle']} value={entry.subtitle ?? ''} />
                        <TextField label="Description" path={[...path, 'description']} value={entry.description ?? ''} multiline />
                      </div>
                    </details>
                  );
                }),
              )}
            </div>
          </details>

          <details className="content-editor-group">
            <summary>Awards and recognition</summary>
            <div className="content-editor-fields">
              <AddCardButton collection="recognition">Add recognition card</AddCardButton>
              {(recognitionSection?.items ?? []).map((item, index) => (
                <details className="editor-card" key={item.number}>
                  <summary>{item.label || `Recognition ${index + 1}`}</summary>
                  <div className="content-editor-fields">
                    <TextField
                      label="Card title"
                      path={['portfolio', 'pages', 'recognition', 'sections', 0, 'items', index, 'label']}
                      value={item.label}
                    />
                    <TextField
                      label="Description"
                      path={['portfolio', 'pages', 'recognition', 'sections', 0, 'items', index, 'description']}
                      value={item.description ?? ''}
                      multiline
                    />
                  </div>
                </details>
              ))}
            </div>
          </details>

          <details className="content-editor-group">
            <summary>Writing</summary>
            <div className="content-editor-fields">
              <AddCardButton collection="writing">Add writing card</AddCardButton>
              {writingSections.map((section, sectionIndex) => (
                <div className="editor-card-fields" key={section.id}>
                  <strong>{section.title}</strong>
                  <TextField label="Section title" path={['writingSections', sectionIndex, 'title']} value={section.title} />
                  <TextField label="Section description" path={['writingSections', sectionIndex, 'description']} value={section.description} multiline />
                  {section.documents.map((document, documentIndex) => (
                    <details className="editor-card" key={`${section.id}-${documentIndex}`}>
                      <summary>{document.title || `Writing ${documentIndex + 1}`}</summary>
                      <div className="content-editor-fields">
                        <TextField
                          label="Card title"
                          path={['writingSections', sectionIndex, 'documents', documentIndex, 'title']}
                          value={document.title}
                        />
                        <TextField
                          label="Description"
                          path={['writingSections', sectionIndex, 'documents', documentIndex, 'description']}
                          value={document.description ?? ''}
                          multiline
                        />
                        <TextField
                          label="PDF filename in public/writing"
                          path={['writingSections', sectionIndex, 'documents', documentIndex, 'filename']}
                          value={document.filename}
                        />
                      </div>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </details>

          <details className="content-editor-group">
            <summary>Contact card and social links</summary>
            <div className="content-editor-fields">
              <TextField label="Contact heading" path={['portfolio', 'contact', 'title']} value={portfolio.contact.title} />
              <TextField label="Contact introduction" path={['portfolio', 'contact', 'body']} value={portfolio.contact.body} multiline />
              <TextField label="Role" path={['portfolio', 'contact', 'role']} value={portfolio.contact.role} />
              <TextField label="Email" path={['portfolio', 'contact', 'email']} value={portfolio.contact.email} type="email" />
              <TextField label="Email label / placeholder" path={['portfolio', 'contact', 'emailLabel']} value={portfolio.contact.emailLabel} />
              <TextField label="Phone number" path={['portfolio', 'contact', 'phone']} value={portfolio.contact.phone} type="tel" />
              <TextField label="Phone label / formatted number" path={['portfolio', 'contact', 'phoneLabel']} value={portfolio.contact.phoneLabel} />
              {portfolio.social.map((item, index) => (
                <div className="editor-card-fields" key={index}>
                  <strong>{item.label || `Social link ${index + 1}`}</strong>
                  <TextField label="Label" path={['portfolio', 'social', index, 'label']} value={item.label} />
                  <TextField label="Profile URL" path={['portfolio', 'social', index, 'url']} value={item.url} type="url" />
                </div>
              ))}
            </div>
          </details>
        </div>

        <footer className="content-editor-footer">
          <p role="status">{hasUnsavedChanges ? 'Unsaved changes' : saveMessage || 'All changes saved.'}</p>
          <button className="button button-outline" type="button" onClick={discardChanges} disabled={!hasUnsavedChanges}>
            Discard
          </button>
          <button className="button button-primary" type="button" onClick={saveChanges} disabled={!hasUnsavedChanges}>
            Save changes
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
