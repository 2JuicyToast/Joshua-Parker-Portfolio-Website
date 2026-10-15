import { useEffect } from 'react';
import { Route, Router, Switch, useLocation, Link } from 'wouter';
import { portfolio } from './content';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';
import { SiteShell } from './components/SiteShell';

function NotFoundPage() {
  return (
    <section className="section-page-hero content-width">
      <p className="eyebrow">Page not found</p>
      <h1 className="serif section-page-title">This page isn’t here<span className="period">.</span></h1>
      <Link className="button button-primary" href="/">Return home</Link>
    </section>
  );
}

function AppRoutes() {
  const [location] = useLocation();

  useEffect(() => {
    const pageTitle = Object.values(portfolio.pages).find((page) => page.href === location)?.title;
    const title = location === '/'
      ? `${portfolio.identity.name} — Portfolio`
      : location === '/contact'
        ? `Contact — ${portfolio.identity.name}`
        : pageTitle
          ? `${pageTitle} — ${portfolio.identity.name}`
          : `Page not found — ${portfolio.identity.name}`;
    document.title = title;
  }, [location]);

  return (
    <SiteShell>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/projects"><PortfolioPage pageKey="projects" /></Route>
        <Route path="/ventures"><PortfolioPage pageKey="ventures" /></Route>
        <Route path="/writing"><PortfolioPage pageKey="writing" /></Route>
        <Route path="/recognition"><PortfolioPage pageKey="recognition" /></Route>
        <Route path="/interests"><PortfolioPage pageKey="interests" /></Route>
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </SiteShell>
  );
}

function App() {
  return (
    <Router base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AppRoutes />
    </Router>
  );
}

export default App;
