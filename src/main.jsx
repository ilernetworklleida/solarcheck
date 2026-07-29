import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {SiteChrome} from './components';
import {
  AutomotivePage,
  BuildingsPage,
  CompanyPage,
  ContactPage,
  CookiesPage,
  FaqPage,
  HomePage,
  LegalNoticePage,
  NotFoundPage,
  PpfPage,
  PrivacyPage,
  QuotePage,
  ServicesPage,
  WorkPage,
} from './pages';
import {normalizePath} from './site';
import './styles.css';

const routes = {
  '/': HomePage,
  '/servicios/': ServicesPage,
  '/laminas-solares-coche/': AutomotivePage,
  '/laminas-edificios/': BuildingsPage,
  '/clearshield-ppf/': PpfPage,
  '/trabajos/': WorkPage,
  '/empresa/': CompanyPage,
  '/preguntas-frecuentes/': FaqPage,
  '/contacto/': ContactPage,
  '/presupuesto/': QuotePage,
  '/aviso-legal/': LegalNoticePage,
  '/privacidad/': PrivacyPage,
  '/cookies/': CookiesPage,
};

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handleRoute = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  useEffect(() => {
    document.body.dataset.route = path === '/' ? 'home' : path.replaceAll('/', '');
    const main = document.getElementById('main-content');
    if (main) main.focus({preventScroll: true});
  }, [path]);

  const Page = routes[path] || NotFoundPage;
  return <SiteChrome path={path}><Page/></SiteChrome>;
}

createRoot(document.getElementById('root')).render(<App/>);
