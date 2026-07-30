import React, {useEffect, useId, useRef, useState} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Building2,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Cookie,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {BUSINESS, normalizePath, pages, services, SITE_URL} from './site';
import logoUrl from './assets/logo-negative.png';

export function navigate(href) {
  const target = normalizePath(href);
  if (normalizePath(window.location.pathname) === target) {
    window.scrollTo({top: 0, behavior: 'smooth'});
    return;
  }
  window.history.pushState({}, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({top: 0, behavior: 'instant'});
}

export function Link({href, children, onClick, className = '', ...props}) {
  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      !href?.startsWith('/')
    ) return;
    event.preventDefault();
    navigate(href);
  };
  return <a href={href} className={className} onClick={handleClick} {...props}>{children}</a>;
}

export function Seo({path, schema, noindex = false}) {
  useEffect(() => {
    const meta = pages[path] || {
      title: 'Página no encontrada | Solarcheck Lleida',
      description: 'La página solicitada no existe.',
    };
    document.title = meta.title;
    document.documentElement.lang = 'es';

    const setMeta = (selector, attribute, value) => {
      let node = document.head.querySelector(selector);
      if (!node) {
        node = document.createElement('meta');
        const key = selector.includes('property=') ? 'property' : 'name';
        const match = selector.match(/["']([^"']+)["']/);
        node.setAttribute(key, match?.[1] || 'description');
        document.head.appendChild(node);
      }
      node.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', `${SITE_URL}${path === '/' ? '/' : path}`);
    setMeta('meta[property="og:image"]', 'content', `${SITE_URL}${meta.image || '/images/work-mercedes-estate.webp'}`);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${path === '/' ? '/' : path}`;

    document.head.querySelectorAll('script[data-page-schema]').forEach((node) => node.remove());
    if (schema) {
      const node = document.createElement('script');
      node.type = 'application/ld+json';
      node.dataset.pageSchema = 'true';
      node.textContent = JSON.stringify(schema);
      document.head.appendChild(node);
    }
  }, [path, schema, noindex]);
  return null;
}

export function Header({path}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [centerOpen, setCenterOpen] = useState(false);
  const megaRef = useRef(null);
  const centerRef = useRef(null);
  const megaCloseTimer = useRef(null);
  const centerCloseTimer = useRef(null);

  const cancelClose = (timerRef) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const scheduleClose = (setter, timerRef) => {
    cancelClose(timerRef);
    timerRef.current = window.setTimeout(() => setter(false), 180);
  };

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setCenterOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle('menu-locked', mobileOpen);
    return () => document.body.classList.remove('menu-locked');
  }, [mobileOpen]);

  useEffect(() => {
    const close = (event) => {
      if (!megaRef.current?.contains(event.target)) setMegaOpen(false);
      if (!centerRef.current?.contains(event.target)) setCenterOpen(false);
    };
    const closeWithKeyboard = (event) => {
      if (event.key !== 'Escape') return;
      setMegaOpen(false);
      setCenterOpen(false);
      setMobileOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', closeWithKeyboard);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', closeWithKeyboard);
      cancelClose(megaCloseTimer);
      cancelClose(centerCloseTimer);
    };
  }, []);

  const active = (href) => path === href || (href !== '/' && path.startsWith(href));

  return <header className="site-header">
    <div className="utility-bar">
      <div className="header-wrap utility-inner">
        <span><ShieldCheck size={13}/> Centro especializado en Lleida desde 1998</span>
        <div>
          <a href={`tel:${BUSINESS.phoneHref}`}><Phone size={13}/> {BUSINESS.phone}</a>
          <a href={BUSINESS.maps} target="_blank" rel="noreferrer"><MapPin size={13}/> {BUSINESS.address}</a>
        </div>
      </div>
    </div>
    <div className="header-main">
      <div className="header-wrap header-inner">
        <Link href="/" className="brand" aria-label="Solarcheck Lleida, inicio" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark"><img src={logoUrl} alt="Solarcheck Lleida" width="390" height="200"/></span>
          <span className="brand-location">Centro Lleida</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <div className="nav-group" ref={megaRef}
            onPointerEnter={() => { cancelClose(megaCloseTimer); setMegaOpen(true); setCenterOpen(false); }}
            onPointerLeave={() => scheduleClose(setMegaOpen, megaCloseTimer)}
            onFocus={() => { cancelClose(megaCloseTimer); setMegaOpen(true); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose(setMegaOpen, megaCloseTimer); }}>
            <button className={active('/servicios/') || services.some(s => active(s.href)) ? 'active' : ''} onClick={() => setMegaOpen(v => !v)} aria-expanded={megaOpen} aria-controls="solutions-menu">
              Soluciones <ChevronDown size={15}/>
            </button>
            <div id="solutions-menu" className={`mega-menu ${megaOpen ? 'open' : ''}`} onPointerEnter={() => cancelClose(megaCloseTimer)}>
              <div className="mega-intro">
                <small>PROTECCIÓN 360º</small>
                <strong>Una solución para cada cristal y cada superficie.</strong>
                <Link href="/servicios/">Ver todos los servicios <ArrowRight size={16}/></Link>
              </div>
              <div className="mega-services">
                {services.map((service) => <Link href={service.href} key={service.key} className="mega-service">
                  <span>{service.number}</span>
                  <div><strong>{service.title}</strong><small>{service.eyebrow}</small></div>
                  <ChevronRight size={17}/>
                </Link>)}
              </div>
              <div className="mega-proof">
                <img src="/images/work-mercedes-estate.webp" alt="Vehículo familiar con láminas solares traseras instalado en el centro de Lleida"/>
                <span>Trabajo real · Lleida</span>
              </div>
            </div>
          </div>
          <Link href="/trabajos/" className={active('/trabajos/') ? 'active' : ''}>Trabajos</Link>
          <div className="nav-group compact-group" ref={centerRef}
            onPointerEnter={() => { cancelClose(centerCloseTimer); setCenterOpen(true); setMegaOpen(false); }}
            onPointerLeave={() => scheduleClose(setCenterOpen, centerCloseTimer)}
            onFocus={() => { cancelClose(centerCloseTimer); setCenterOpen(true); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose(setCenterOpen, centerCloseTimer); }}>
            <button onClick={() => setCenterOpen(v => !v)} className={['/empresa/', '/preguntas-frecuentes/', '/contacto/'].some(active) ? 'active' : ''} aria-expanded={centerOpen} aria-controls="center-menu">
              El centro <ChevronDown size={15}/>
            </button>
            <div id="center-menu" className={`nav-popover ${centerOpen ? 'open' : ''}`} onPointerEnter={() => cancelClose(centerCloseTimer)}>
              <Link href="/empresa/"><strong>Quiénes somos</strong><small>Experiencia y método</small></Link>
              <Link href="/preguntas-frecuentes/"><strong>Preguntas frecuentes</strong><small>ITV, garantías y cuidados</small></Link>
              <Link href="/contacto/"><strong>Contacto</strong><small>Horario y cómo llegar</small></Link>
            </div>
          </div>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={`tel:${BUSINESS.phoneHref}`} aria-label={`Llamar al ${BUSINESS.phone}`}><Phone size={18}/></a>
          <Link href="/presupuesto/" className="nav-cta">Pedir presupuesto <ArrowRight size={17}/></Link>
          <button className="menu-toggle" onClick={() => setMobileOpen(v => !v)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {mobileOpen ? <X/> : <Menu/>}
          </button>
        </div>
      </div>
    </div>
    <div className={`mobile-panel ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
      <nav aria-label="Navegación móvil">
        <Link href="/servicios/" className="mobile-main-link">Soluciones <span>01</span></Link>
        <div className="mobile-subnav">
          {services.map(service => <Link href={service.href} key={service.key}><span>{service.number}</span>{service.title}<ArrowRight size={16}/></Link>)}
        </div>
        <Link href="/trabajos/" className="mobile-main-link">Trabajos <span>02</span></Link>
        <Link href="/empresa/" className="mobile-main-link">El centro <span>03</span></Link>
        <div className="mobile-subnav two-col">
          <Link href="/preguntas-frecuentes/">Preguntas frecuentes</Link>
          <Link href="/contacto/">Contacto</Link>
        </div>
        <Link href="/presupuesto/" className="button button-primary mobile-budget">Pedir presupuesto <ArrowRight/></Link>
      </nav>
      <div className="mobile-contact">
        <a href={`tel:${BUSINESS.phoneHref}`}><Phone/> {BUSINESS.phone}</a>
        <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a>
      </div>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-glow"/>
    <div className="shell footer-main">
      <div className="footer-brand">
        <span className="footer-brand-mark"><img src={logoUrl} alt="Solarcheck Lleida" width="390" height="200"/></span>
        <p>Protección solar profesional para vehículos y edificios. Instalación especializada en Lleida desde 1998.</p>
        <a className="footer-rating" href={BUSINESS.maps} target="_blank" rel="noreferrer"><span>Centro en Lleida</span><ExternalLink size={14}/></a>
      </div>
      <div className="footer-column">
        <small>SOLUCIONES</small>
        <Link href="/laminas-solares-coche/">Tintado de lunas</Link>
        <Link href="/laminas-edificios/">Láminas para edificios</Link>
        <Link href="/clearshield-ppf/">Protección PPF</Link>
        <Link href="/servicios/">Todos los servicios</Link>
      </div>
      <div className="footer-column">
        <small>DESCUBRE</small>
        <Link href="/trabajos/">Trabajos reales</Link>
        <Link href="/empresa/">El centro</Link>
        <Link href="/preguntas-frecuentes/">Preguntas frecuentes</Link>
        <Link href="/contacto/">Contacto</Link>
      </div>
      <div className="footer-contact">
        <small>HABLEMOS</small>
        <a className="footer-big-link" href={`tel:${BUSINESS.phoneHref}`}>{BUSINESS.phone}</a>
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        <p>{BUSINESS.address}<br/>{BUSINESS.postalCode} {BUSINESS.city}</p>
        <p>{BUSINESS.hours}</p>
        <div className="footer-social">
          <a href="https://www.instagram.com/solarchecklleida/" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera/></a>
          <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a>
        </div>
      </div>
    </div>
    <div className="shell footer-bottom">
      <span>© {new Date().getFullYear()} {BUSINESS.legalName} · CIF {BUSINESS.taxId}</span>
      <div>
        <Link href="/aviso-legal/">Aviso legal</Link>
        <Link href="/privacidad/">Privacidad</Link>
        <Link href="/cookies/">Cookies</Link>
        <button onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>Configurar cookies</button>
      </div>
    </div>
  </footer>;
}

export function Breadcrumbs({items = []}) {
  return <nav className="breadcrumbs" aria-label="Migas de pan">
    <Link href="/">Inicio</Link>
    {items.map((item, index) => <React.Fragment key={item.label}>
      <ChevronRight size={13}/>
      {item.href && index !== items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
    </React.Fragment>)}
  </nav>;
}

export function PageHero({eyebrow, title, highlight, text, image, imageAlt, children, compact = false, objectPosition}) {
  return <section className={`page-hero ${compact ? 'page-hero-compact' : ''}`}>
    <div className="page-hero-grid shell">
      <div className="page-hero-copy reveal is-visible">
        <div className="eyebrow"><span/> {eyebrow}</div>
        <h1>{title} {highlight && <em>{highlight}</em>}</h1>
        <p>{text}</p>
        {children}
      </div>
      {image && <div className="page-hero-media reveal is-visible">
        <img src={image} alt={imageAlt} style={objectPosition ? {objectPosition} : undefined}/>
        <div className="media-grid"/>
        <div className="media-corner"><span>PRECISIÓN</span><strong>SOLAR<br/>CHECK</strong></div>
      </div>}
    </div>
    <div className="page-hero-orbit"/>
  </section>;
}

export function SectionHeading({eyebrow, title, text, light = false, align = 'left'}) {
  return <div className={`section-heading ${light ? 'light' : ''} align-${align}`}>
    <div className="eyebrow"><span/> {eyebrow}</div>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>;
}

export function FlipCard({service}) {
  const [flipped, setFlipped] = useState(false);
  return <article className={`flip-card ${flipped ? 'flipped' : ''}`}>
    <button className="flip-card-inner" onClick={() => setFlipped(v => !v)} aria-pressed={flipped} aria-label={`${flipped ? 'Ocultar' : 'Mostrar'} detalles de ${service.title}`}>
      <span className="flip-face flip-front">
        <img src={service.image} alt="" loading="lazy"/>
        <span className="flip-shade"/>
        <span className="flip-number">{service.number}</span>
        <span className="flip-content">
          <small>{service.eyebrow}</small>
          <strong>{service.title}</strong>
          <span>{service.description}</span>
          <span className="flip-action">Pulsa para descubrir <Sparkles size={17}/></span>
        </span>
      </span>
      <span className="flip-face flip-back">
        <span className="flip-back-number">{service.number}</span>
        <small>SOLUCIÓN SOLARCHECK</small>
        <strong>{service.title}</strong>
        <span>{service.back}</span>
        <span className="fake-link">Ver servicio completo <ArrowRight/></span>
        <span className="flip-close">Pulsa para volver</span>
      </span>
    </button>
    <Link href={service.href} className="flip-real-link" aria-label={`Abrir página de ${service.title}`}>Explorar {service.title} <ArrowRight size={17}/></Link>
  </article>;
}

export function ProcessStrip({steps}) {
  return <div className="process-strip">
    {steps.map((step, index) => <article key={step.title} className="reveal">
      <span>0{index + 1}</span>
      <div><h3>{step.title}</h3><p>{step.text}</p></div>
    </article>)}
  </div>;
}

export function CtaBand({eyebrow = 'PRESUPUESTO SIN COMPROMISO', title = 'Tu proyecto empieza con una buena recomendación.', text = 'Cuéntanos qué quieres proteger y te diremos qué solución tiene más sentido para ti.', source = 'consulta general', image = '/images/work-audi-a7.webp'}) {
  const whatsappText = encodeURIComponent(`Hola Solarcheck Lleida. Quiero información sobre ${source}.`);
  return <section className="cta-band">
    <img src={image} alt="" loading="lazy"/>
    <div className="cta-band-shade"/>
    <div className="shell cta-band-inner">
      <div>
        <div className="eyebrow light"><span/> {eyebrow}</div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="cta-actions">
        <Link className="button button-primary" href="/presupuesto/">Configurar presupuesto <ArrowRight/></Link>
        <a className="button button-glass" href={`https://wa.me/${BUSINESS.whatsapp}?text=${whatsappText}`} target="_blank" rel="noreferrer"><MessageCircle/> Hablar por WhatsApp</a>
      </div>
    </div>
  </section>;
}

export function FaqAccordion({items, initial = 0}) {
  const [open, setOpen] = useState(initial);
  return <div className="faq-accordion">
    {items.map((item, index) => <article className={`faq-row ${open === index ? 'open' : ''}`} key={item.q}>
      <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{item.q}</strong>
        <i><ChevronDown/></i>
      </button>
      <div className="faq-answer" aria-hidden={open !== index}><p>{item.a}</p></div>
    </article>)}
  </div>;
}

const projectOptions = {
  auto: {
    label: 'Láminas para automóvil',
    icon: Car,
    fields: ['Marca y modelo', 'Año del vehículo'],
    placeholder: ['Ej. Seat Ateca', 'Ej. 2022'],
  },
  building: {
    label: 'Láminas para edificio',
    icon: Building2,
    fields: ['Tipo de espacio', 'Medidas aproximadas'],
    placeholder: ['Vivienda, oficina, comercio…', 'Ej. 6 cristales de 1 × 2 m'],
  },
  ppf: {
    label: 'Protección PPF',
    icon: ShieldCheck,
    fields: ['Marca y modelo', 'Zona a proteger'],
    placeholder: ['Ej. Tesla Model 3', 'Frontal, capó, completo…'],
  },
};

export function LeadWizard({defaultType = 'auto', compact = false}) {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({type: defaultType, name: '', phone: '', email: '', detail1: '', detail2: '', message: '', consent: false});
  const update = (key, value) => setData(current => ({...current, [key]: value}));
  const option = projectOptions[data.type];
  const OptionIcon = option.icon;
  const next = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStep(value => Math.min(3, value + 1));
  };
  const submit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const message = [
      'Hola Solarcheck Lleida, quiero solicitar presupuesto.',
      `Servicio: ${option.label}.`,
      `${option.fields[0]}: ${data.detail1 || 'Por confirmar'}.`,
      `${option.fields[1]}: ${data.detail2 || 'Por confirmar'}.`,
      `Nombre: ${data.name}. Teléfono: ${data.phone}.`,
      data.email ? `Email: ${data.email}.` : '',
      data.message ? `Comentario: ${data.message}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  if (sent) return <div className={`lead-wizard wizard-success ${compact ? 'compact' : ''}`}>
    <div className="success-icon"><MessageCircle/></div>
    <small>PASO FINAL</small>
    <h2>Tu solicitud está lista.</h2>
    <p>Se ha abierto WhatsApp con todos los datos. Pulsa «Enviar» allí y el equipo podrá responderte directamente.</p>
    <button className="text-button" onClick={() => {setSent(false); setStep(1);}}>Preparar otra solicitud <ArrowRight/></button>
  </div>;

  return <form className={`lead-wizard ${compact ? 'compact' : ''}`} onSubmit={step === 3 ? submit : next}>
    <div className="wizard-top">
      <div><small>SOLICITUD GUIADA</small><strong>Presupuesto sin compromiso</strong></div>
      <div className="wizard-progress" aria-label={`Paso ${step} de 3`}><span style={{width: `${step * 33.333}%`}}/></div>
      <b>{step}/3</b>
    </div>

    {step === 1 && <fieldset className="wizard-step">
      <legend>¿Qué quieres proteger?</legend>
      <p>Elige una opción para que podamos pedirte solo la información necesaria.</p>
      <div className="wizard-options">
        {Object.entries(projectOptions).map(([key, value]) => {
          const Icon = value.icon;
          return <label key={key}>
            <input type="radio" name="project-type" value={key} checked={data.type === key} onChange={() => update('type', key)}/>
            <span><Icon/><strong>{value.label}</strong><Check/></span>
          </label>;
        })}
      </div>
    </fieldset>}

    {step === 2 && <fieldset className="wizard-step">
      <legend>Háblanos de tu {data.type === 'building' ? 'espacio' : 'vehículo'}.</legend>
      <p>Con estos datos podremos orientarte mucho mejor desde el primer mensaje.</p>
      <div className="wizard-fields">
        <label>{option.fields[0]}<input value={data.detail1} onChange={e => update('detail1', e.target.value)} required placeholder={option.placeholder[0]}/></label>
        <label>{option.fields[1]}<input value={data.detail2} onChange={e => update('detail2', e.target.value)} placeholder={option.placeholder[1]}/></label>
        <label className="full">¿Qué te gustaría conseguir?<textarea value={data.message} onChange={e => update('message', e.target.value)} rows="3" placeholder="Menos calor, más privacidad, proteger la pintura…"/></label>
      </div>
    </fieldset>}

    {step === 3 && <fieldset className="wizard-step">
      <legend>¿Dónde te respondemos?</legend>
      <p>Recibirás una respuesta personal del centro, sin centralitas ni mensajes automáticos.</p>
      <div className="wizard-fields">
        <label>Nombre y apellidos<input value={data.name} onChange={e => update('name', e.target.value)} autoComplete="name" required placeholder="Tu nombre"/></label>
        <label>Teléfono<input value={data.phone} onChange={e => update('phone', e.target.value)} autoComplete="tel" type="tel" required placeholder="600 000 000"/></label>
        <label className="full">Email <small>(opcional)</small><input value={data.email} onChange={e => update('email', e.target.value)} autoComplete="email" type="email" placeholder="tu@email.com"/></label>
        <label className="check-label full"><input type="checkbox" checked={data.consent} onChange={e => update('consent', e.target.checked)} required/><span>Acepto la <Link href="/privacidad/">política de privacidad</Link> y el tratamiento de mis datos para responder a esta solicitud.</span></label>
      </div>
    </fieldset>}

    <div className="wizard-nav">
      {step > 1 ? <button type="button" className="wizard-back" onClick={() => setStep(value => value - 1)}><ArrowLeft/> Atrás</button> : <span/>}
      <button className="button button-primary" type="submit">
        {step === 3 ? <>Continuar por WhatsApp <MessageCircle/></> : <>Siguiente <ArrowRight/></>}
      </button>
    </div>
    <small className="wizard-note"><ShieldCheck/> Tus datos no se almacenan en esta web; se preparan en tu dispositivo para enviarlos por WhatsApp.</small>
  </form>;
}

export function ContactDetails({dark = false}) {
  return <div className={`contact-details ${dark ? 'dark' : ''}`}>
    <a href={`tel:${BUSINESS.phoneHref}`}><span><Phone/></span><div><small>LLÁMANOS</small><strong>{BUSINESS.phone}</strong></div><ArrowRight/></a>
    <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer"><span><MessageCircle/></span><div><small>WHATSAPP</small><strong>{BUSINESS.whatsappLabel}</strong></div><ArrowRight/></a>
    <a href={`mailto:${BUSINESS.email}`}><span><Mail/></span><div><small>ESCRÍBENOS</small><strong>{BUSINESS.email}</strong></div><ArrowRight/></a>
    <a href={BUSINESS.maps} target="_blank" rel="noreferrer"><span><MapPin/></span><div><small>VISÍTANOS</small><strong>{BUSINESS.address}</strong></div><ExternalLink/></a>
    <div><span><Clock3/></span><div><small>HORARIO</small><strong>{BUSINESS.hours}</strong></div></div>
  </div>;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(() => localStorage.getItem('solarcheck-cookie-choice') === null);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const open = () => setSettings(true);
    window.addEventListener('open-cookie-settings', open);
    return () => window.removeEventListener('open-cookie-settings', open);
  }, []);

  const save = (choice) => {
    localStorage.setItem('solarcheck-cookie-choice', choice);
    setVisible(false);
    setSettings(false);
  };

  return <>
    {visible && <aside className="cookie-banner" aria-label="Aviso de cookies">
      <Cookie/>
      <div><strong>Tu privacidad, sin letra pequeña.</strong><p>Solo usamos almacenamiento técnico para recordar tus preferencias. La analítica permanece desactivada salvo que la aceptes.</p></div>
      <div className="cookie-actions"><button onClick={() => save('essential')}>Solo necesarias</button><button onClick={() => setSettings(true)}>Configurar</button><button className="accept" onClick={() => save('all')}>Aceptar todas</button></div>
    </aside>}
    {settings && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSettings(false)}>
      <section className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-title" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setSettings(false)} aria-label="Cerrar"><X/></button>
        <small>PREFERENCIAS</small><h2 id="cookie-title">Configurar cookies</h2>
        <div className="cookie-setting"><div><strong>Necesarias</strong><p>Guardan tu elección y permiten el funcionamiento básico.</p></div><span>Siempre activas</span></div>
        <label className="cookie-setting"><div><strong>Analítica</strong><p>Actualmente no se carga ningún servicio analítico; esta preferencia queda preparada para una futura integración consentida.</p></div><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)}/></label>
        <button className="button button-primary full-button" onClick={() => save(analytics ? 'all' : 'essential')}>Guardar preferencias <Check/></button>
        <Link href="/cookies/" onClick={() => setSettings(false)} className="cookie-policy-link">Leer política de cookies <ArrowRight/></Link>
      </section>
    </div>}
  </>;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 700);
    window.addEventListener('scroll', update, {passive: true});
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  if (!visible) return null;
  return <button className="back-to-top" type="button" aria-label="Volver arriba" title="Volver arriba" onClick={() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'});
  }}><ArrowUp/><span>Arriba</span></button>;
}

export function SiteChrome({children, path}) {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -40px'});
    const observe = () => document.querySelectorAll('.reveal:not(.is-visible)').forEach(node => observer.observe(node));
    observe();
    const mutation = new MutationObserver(observe);
    mutation.observe(document.getElementById('root'), {childList: true, subtree: true});
    return () => {observer.disconnect(); mutation.disconnect();};
  }, []);

  useEffect(() => {
    const progress = document.querySelector('.scroll-progress span');
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <>
    <a className="skip-link" href="#main-content">Saltar al contenido</a>
    <div className="scroll-progress" aria-hidden="true"><span/></div>
    <Header path={path}/>
    <main id="main-content" tabIndex="-1">{children}</main>
    <Footer/>
    <a className="floating-whatsapp" href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hola Solarcheck Lleida, quisiera información.')}`} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><MessageCircle/><span>¿Te ayudamos?</span></a>
    <BackToTop/>
    <a className="mobile-call" href={`tel:${BUSINESS.phoneHref}`}><Phone/> Llamar al centro</a>
    <CookieConsent/>
  </>;
}

export function LocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutoRepair'],
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    taxID: BUSINESS.taxId,
    url: SITE_URL,
    telephone: BUSINESS.phoneHref,
    email: BUSINESS.email,
    image: `${SITE_URL}/images/workshop-privacy.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressRegion: 'Lleida',
      addressCountry: 'ES',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '15:00' },
    ],
    areaServed: ['Lleida', 'Segrià', 'Pla d’Urgell', 'Noguera', 'Garrigues'],
    priceRange: '€€',
  };
}

export function BreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL},
      ...items.map((item, index) => ({'@type': 'ListItem', position: index + 2, name: item.label, item: `${SITE_URL}${item.href || ''}`})),
    ],
  };
}
