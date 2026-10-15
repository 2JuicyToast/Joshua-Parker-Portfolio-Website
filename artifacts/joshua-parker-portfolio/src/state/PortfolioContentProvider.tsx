import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  portfolio as defaultPortfolio,
  writingSections as defaultWritingSections,
  type PortfolioEntry,
  type WritingSection,
} from '../content';
import { publicAsset } from '../lib/public-asset';

export type EditablePortfolioContent = {
  portfolio: typeof defaultPortfolio;
  writingSections: WritingSection[];
};

export type PortfolioContentPath = (string | number)[];
export type EditableCollection = 'projects' | 'ventures' | 'recognition' | 'writing';

type PortfolioContentContextValue = {
  content: EditablePortfolioContent;
  isDeveloper: boolean;
  hasUnsavedChanges: boolean;
  saveMessage: string;
  updateContent: (path: PortfolioContentPath, value: unknown) => void;
  addCard: (collection: EditableCollection) => void;
  saveChanges: () => boolean;
  discardChanges: () => void;
};

const STORAGE_KEY = 'joshua-parker-portfolio-content-v1';
const isDeveloper = import.meta.env.DEV;
const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createDefaultContent(): EditablePortfolioContent {
  return {
    portfolio: clone(defaultPortfolio),
    writingSections: clone(defaultWritingSections),
  };
}

function parseEditableContent(value: unknown): EditablePortfolioContent {
  if (
    !value ||
    typeof value !== 'object' ||
    !('portfolio' in value) ||
    !('writingSections' in value) ||
    !Array.isArray(value.writingSections)
  ) {
    throw new Error('Portfolio content file has an unexpected format.');
  }

  const candidate = value as EditablePortfolioContent;
  if (
    !candidate.portfolio ||
    typeof candidate.portfolio !== 'object' ||
    !candidate.portfolio.identity ||
    !candidate.portfolio.pages
  ) {
    throw new Error('Portfolio content file is missing required page data.');
  }
  return candidate;
}

function readInitialContent() {
  const fallback = createDefaultContent();
  if (!isDeveloper || typeof window === 'undefined') {
    return { content: fallback, message: '', fromStorage: false };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { content: fallback, message: '', fromStorage: false };
    return {
      content: parseEditableContent(JSON.parse(saved)),
      message: 'Loaded saved edits from this browser.',
      fromStorage: true,
    };
  } catch (error) {
    console.error('Could not load saved portfolio edits:', error);
    return {
      content: fallback,
      message: 'Saved edits could not be read. Your original content is loaded; saving will replace the damaged browser copy.',
      fromStorage: false,
    };
  }
}

function setPath(target: Record<string | number, unknown>, path: PortfolioContentPath, value: unknown) {
  let current: Record<string | number, unknown> = target;
  for (const part of path.slice(0, -1)) {
    const child = current[part];
    if (!child || typeof child !== 'object') return;
    current = child as Record<string | number, unknown>;
  }
  const last = path.at(-1);
  if (last !== undefined) current[last] = value;
}

function nextEntry(title: string): PortfolioEntry {
  return { title, description: '', eyebrow: '', subtitle: '' };
}

export function PortfolioContentProvider({ children }: PropsWithChildren) {
  const [initial] = useState(readInitialContent);
  const [content, setContent] = useState(initial.content);
  const [savedContent, setSavedContent] = useState(initial.content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState(initial.message);
  const hasUnsavedChangesRef = useRef(false);
  const hasLocalSaveRef = useRef(initial.fromStorage);

  const updateContent = useCallback((path: PortfolioContentPath, value: unknown) => {
    setContent((current) => {
      const next = clone(current);
      setPath(next as unknown as Record<string | number, unknown>, path, value);
      return next;
    });
    hasUnsavedChangesRef.current = true;
    setHasUnsavedChanges(true);
    setSaveMessage('');
  }, []);

  const addCard = useCallback((collection: EditableCollection) => {
    setContent((current) => {
      const next = clone(current);
      switch (collection) {
        case 'projects': {
          const entries = next.portfolio.pages.projects.sections[0].entries ??= [];
          entries.push(nextEntry(`New project ${entries.length + 1}`));
          break;
        }
        case 'ventures': {
          const sections = next.portfolio.pages.ventures.sections;
          if (sections.length === 0) sections.push({ title: 'Current Ventures', entries: [] });
          const entries = sections[0].entries ??= [];
          entries.push(nextEntry(`New venture ${entries.length + 1}`));
          break;
        }
        case 'recognition': {
          const sections = next.portfolio.pages.recognition.sections;
          if (sections.length === 0) sections.push({ items: [] });
          const items = sections[0].items ??= [];
          items.push({
            number: String(items.length + 1).padStart(2, '0'),
            label: `New recognition ${items.length + 1}`,
            description: '',
          });
          break;
        }
        case 'writing': {
          const section = next.writingSections[0];
          section.documents.push({
            title: `New writing ${section.documents.length + 1}`,
            filename: '',
            description: '',
          });
          break;
        }
      }
      return next;
    });
    hasUnsavedChangesRef.current = true;
    setHasUnsavedChanges(true);
    setSaveMessage('');
  }, []);

  const saveChanges = useCallback(() => {
    if (!isDeveloper || typeof window === 'undefined') return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      hasLocalSaveRef.current = true;
      hasUnsavedChangesRef.current = false;
      setSavedContent(clone(content));
      setHasUnsavedChanges(false);
      setSaveMessage('Saved in this browser.');
      return true;
    } catch (error) {
      console.error('Could not save portfolio edits:', error);
      setSaveMessage('Could not save. Check browser storage and try again.');
      return false;
    }
  }, [content]);

  const discardChanges = useCallback(() => {
    hasUnsavedChangesRef.current = false;
    setContent(clone(savedContent));
    setHasUnsavedChanges(false);
    setSaveMessage('Unsaved edits discarded.');
  }, [savedContent]);

  useEffect(() => {
    if (initial.fromStorage || hasLocalSaveRef.current) return;
    let active = true;

    fetch(publicAsset('portfolio-content.json'), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Portfolio content request failed with status ${response.status}.`);
        }
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (!active || hasUnsavedChangesRef.current || value === null) return;
        const publishedContent = parseEditableContent(value);
        setContent(clone(publishedContent));
        setSavedContent(clone(publishedContent));
        if (isDeveloper) setSaveMessage('Loaded content from the project Viewer file.');
      })
      .catch((error: unknown) => {
        console.error('Could not load the project Viewer content file:', error);
        if (active && isDeveloper) {
          setSaveMessage('Could not load the project Viewer content file. Default content is shown.');
        }
      });

    return () => {
      active = false;
    };
  }, [initial.fromStorage]);

  useEffect(() => {
    if (!isDeveloper || !hasUnsavedChanges) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [hasUnsavedChanges]);

  return (
    <PortfolioContentContext.Provider
      value={{
        content,
        isDeveloper,
        hasUnsavedChanges,
        saveMessage,
        updateContent,
        addCard,
        saveChanges,
        discardChanges,
      }}
    >
      {children}
    </PortfolioContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContentContext);
  if (!context) {
    throw new Error('usePortfolioContent must be used inside PortfolioContentProvider.');
  }
  return context;
}
