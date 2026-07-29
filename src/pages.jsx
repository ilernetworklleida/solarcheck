import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Eye,
  FileCheck2,
  Gauge,
  Gem,
  HeartHandshake,
  Images,
  Layers3,
  Lightbulb,
  MapPin,
  Maximize2,
  MessageCircle,
  MousePointer2,
  MoveRight,
  Phone,
  Pause,
  Play,
  ScanLine,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  TimerReset,
  Waves,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  Breadcrumbs,
  BreadcrumbSchema,
  ContactDetails,
  CtaBand,
  FaqAccordion,
  FlipCard,
  LeadWizard,
  Link,
  LocalBusinessSchema,
  PageHero,
  ProcessStrip,
  SectionHeading,
  Seo,
} from './components';
import {BUSINESS, faqs, projects, services, SITE_URL} from './site';

const ButtonPair = ({primary = '/presupuesto/', primaryLabel = 'Pedir presupuesto', secondary = '/trabajos/', secondaryLabel = 'Ver trabajos'}) => <div className="button-pair">
  <Link className="button button-primary" href={primary}>{primaryLabel} <ArrowRight/></Link>
  <Link className="button button-secondary" href={secondary}>{secondaryLabel}</Link>
</div>;

const Metric = ({value, label, detail}) => <div className="metric"><strong>{value}</strong><span>{label}</span>{detail && <small>{detail}</small>}</div>;

const homeHeroSlides = [
  {
    key: 'tintado',
    nav: 'Tintado de lunas',
    eyebrow: 'LÁMINAS SOLARES · AUTOMÓVIL',
    title: 'Tintado de lunas.',
    highlight: 'Bien hecho.',
    text: 'Instalamos láminas certificadas en las lunas laterales traseras y la luneta. Más privacidad, mayor confort y un acabado integrado en el vehículo.',
    primary: 'Presupuestar mi coche',
    secondary: 'Ver cómo trabajamos',
    secondaryHref: '/laminas-solares-coche/',
    proof: ['Lunas traseras y luneta', 'Documentación de la lámina'],
  },
  {
    key: 'trabajos',
    nav: 'Resultados reales',
    eyebrow: 'TRABAJOS REALES · CENTRO DE LLEIDA',
    title: 'El acabado habla.',
    highlight: 'Míralo de cerca.',
    text: 'Vehículos instalados en el centro, fotografiados sin renders ni resultados inventados. Abre la galería y comprueba cómo se integra cada tonalidad.',
    primary: 'Ver todos los trabajos',
    primaryHref: '/trabajos/',
    secondary: 'Pedir orientación',
    secondaryHref: '/presupuesto/',
    proof: ['Fotografías del centro', 'Resultados sin recreaciones'],
  },
  {
    key: 'soluciones',
    nav: 'Todas las soluciones',
    eyebrow: 'AUTOMÓVIL · EDIFICIOS · PPF',
    title: 'Cada superficie pide',
    highlight: 'su propia solución.',
    text: 'Control solar para vidrio y protección transparente para pintura. Te ayudamos a elegir según el uso, el material y el resultado que necesitas.',
    primary: 'Explorar soluciones',
    primaryHref: '/servicios/',
    secondary: 'Hablar con el centro',
    secondaryHref: '/contacto/',
    proof: ['Diagnóstico antes de instalar', 'Recomendación según el caso'],
  },
];

function HomeHeroMedia({slide}) {
  if (slide.key === 'tintado') return <div className="hero-stage hero-stage-process">
    <img src="/images/stock/car-window-detail.jpg" alt="Primer plano de una luna oscura integrada en la carrocería de un automóvil" fetchPriority="high" decoding="async"/>
    <div className="hero-stage-shade"/><div className="glass-scan"/>
    <div className="hero-process-caption"><small>ACABADO ILUSTRATIVO</small><strong>Privacidad y un acabado integrado en las lunas posteriores.</strong></div>
    <div className="hero-legal-chip"><BadgeCheck/><span><strong>Instalación habitual</strong>Lunas traseras y luneta</span></div>
    <span className="stock-note">Fotografía de stock · Pexels</span>
  </div>;

  if (slide.key === 'trabajos') return <div className="hero-stage hero-stage-projects" aria-label="Collage de trabajos reales realizados en el centro">
    <figure className="hero-project-main"><img src="/images/work-mercedes-estate.webp" alt="Vehículo familiar gris con las lunas posteriores tintadas dentro del taller"/><figcaption>Familiar · Vista completa</figcaption></figure>
    <figure><img src="/images/work-audi-a7.webp" alt="Berlina gris con la luneta posterior tintada dentro del taller"/><figcaption>Luneta · Acabado integrado</figcaption></figure>
    <figure><img src="/images/work-audi-a3.webp" alt="Turismo blanco con la luneta posterior tintada dentro del taller"/><figcaption>Trabajo real · Lleida</figcaption></figure>
    <span className="hero-real-stamp"><strong>3</strong> acabados reales<br/>en menos espacio</span>
  </div>;

  return <div className="hero-stage hero-stage-services" aria-label="Servicios de automóvil, edificios y protección de pintura">
    <Link href="/laminas-solares-coche/" className="hero-service-panel auto"><img src="/images/unnamed (10).webp" alt="Vehículo con lunas traseras oscuras y ventanillas delanteras transparentes dentro del taller"/><span><small>01 · AUTOMÓVIL</small><strong>Láminas solares</strong><ArrowRight/></span></Link>
    <Link href="/laminas-edificios/" className="hero-service-panel building"><img src="/images/stock/architectural-glass.jpg" alt="Fachada acristalada de un edificio al atardecer"/><span><small>02 · EDIFICIOS</small><strong>Control solar</strong><ArrowRight/></span></Link>
    <Link href="/clearshield-ppf/" className="hero-service-panel ppf"><img src="/images/stock/ppf-finish-detail.jpg" alt="Detalle de una carrocería brillante sin personas"/><span><small>03 · PINTURA</small><strong>Clearshield PPF</strong><ArrowRight/></span></Link>
  </div>;
}

function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const touchStart = useRef(null);
  const slide = homeHeroSlides[active];

  const move = (direction) => setActive(current => (current + direction + homeHeroSlides.length) % homeHeroSlides.length);

  useEffect(() => {
    if (paused || interactionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => move(1), 8500);
    return () => window.clearInterval(timer);
  }, [active, paused, interactionPaused]);

  return <section className={`home-hero hero-variant-${slide.key}`}
    aria-roledescription="carrusel" aria-label="Presentación de servicios"
    onPointerEnter={() => setInteractionPaused(true)} onPointerLeave={() => setInteractionPaused(false)}
    onFocusCapture={() => setInteractionPaused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false); }}
    onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX; }}
    onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStart.current != null && end != null && Math.abs(end - touchStart.current) > 55) move(end < touchStart.current ? 1 : -1); touchStart.current = null; }}>
    <div className="hero-noise"/><div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
    <div className="shell home-hero-grid" key={slide.key}>
      <div className="home-hero-copy">
        <div className="eyebrow light"><span/> {slide.eyebrow}</div>
        <h1>{slide.title}<br/><em>{slide.highlight}</em></h1>
        <p>{slide.text}</p>
        <ButtonPair primary={slide.primaryHref || '/presupuesto/'} primaryLabel={slide.primary} secondary={slide.secondaryHref} secondaryLabel={slide.secondary}/>
        <div className="hero-trust-row">
          <span><ShieldCheck/> {slide.proof[0]}</span><span><FileCheck2/> {slide.proof[1]}</span>
        </div>
      </div>
      <HomeHeroMedia slide={slide}/>
      <div className="hero-slider-controls">
        <button className="hero-arrow" onClick={() => move(-1)} aria-label="Ver slide anterior"><ChevronLeft/></button>
        <div className="hero-slide-tabs" role="tablist" aria-label="Seleccionar contenido del hero">
          {homeHeroSlides.map((item, index) => <button key={item.key} role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span>0{index + 1}</span><strong>{item.nav}</strong><i/></button>)}
        </div>
        <button className="hero-arrow" onClick={() => move(1)} aria-label="Ver slide siguiente"><ChevronRight/></button>
        <button className="hero-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Reanudar cambio automático' : 'Pausar cambio automático'}>{paused ? <Play/> : <Pause/>}</button>
      </div>
    </div>
    <p className="sr-only" aria-live="polite">Slide {active + 1} de {homeHeroSlides.length}: {slide.nav}</p>
    <div className="hero-ticker"><div><span>AUTOMÓVIL</span><i/> <span>EDIFICIOS</span><i/> <span>PPF CLEARSHIELD</span><i/> <span>COMPUTERCUT</span><i/> <span>LLEIDA</span><i/> <span>AUTOMÓVIL</span><i/> <span>EDIFICIOS</span><i/> <span>PPF CLEARSHIELD</span></div></div>
  </section>;
}

function ProblemExplorer() {
  const problems = [
    {key: 'heat', icon: ThermometerSun, label: 'Demasiado calor', title: 'Recupera el confort sin renunciar a la luz.', text: 'Seleccionamos la tecnología por su comportamiento térmico, no solo por lo oscura que parece. El objetivo es reducir la energía que atraviesa el cristal manteniendo una visibilidad adecuada.', stat: 'Hasta 68%', statLabel: 'energía solar rechazada en gamas seleccionadas*'},
    {key: 'uv', icon: Sun, label: 'Radiación UV', title: 'Protege personas, tejidos y acabados.', text: 'Las láminas Solarcheck filtran más del 99% de la radiación ultravioleta en las gamas indicadas, ayudando a retrasar la decoloración del interior.', stat: '+99%', statLabel: 'de radiación UV filtrada*'},
    {key: 'privacy', icon: Eye, label: 'Falta de privacidad', title: 'Intimidad donde la necesitas.', text: 'Trabajamos con distintos niveles de transmisión luminosa para integrar la privacidad en el diseño del vehículo o del espacio sin improvisaciones.', stat: 'A medida', statLabel: 'tonalidad y acabado'},
    {key: 'impact', icon: Shield, label: 'Roces e impactos', title: 'Una barrera prácticamente invisible.', text: 'La película PPF protege las zonas más expuestas de la carrocería frente a impactos de gravilla, insectos y pequeños roces cotidianos.', stat: 'PPF', statLabel: 'protección transparente'},
  ];
  const [active, setActive] = useState('heat');
  const item = problems.find(problem => problem.key === active);
  const Icon = item.icon;
  return <div className="problem-explorer reveal">
    <div className="problem-tabs" role="tablist" aria-label="Selecciona tu necesidad">
      {problems.map(problem => {
        const TabIcon = problem.icon;
        return <button key={problem.key} className={active === problem.key ? 'active' : ''} onClick={() => setActive(problem.key)} role="tab" aria-selected={active === problem.key}>
          <TabIcon/><span>{problem.label}</span><ChevronRight/>
        </button>;
      })}
    </div>
    <div className="problem-result" role="tabpanel">
      <div className="result-icon"><Icon/></div>
      <small>TU NECESIDAD</small>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <div className="result-stat"><strong>{item.stat}</strong><span>{item.statLabel}</span></div>
      <Link href={item.key === 'impact' ? '/clearshield-ppf/' : item.key === 'heat' ? '/servicios/' : '/presupuesto/'}>Encontrar mi solución <ArrowRight/></Link>
    </div>
  </div>;
}

export function HomePage() {
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      LocalBusinessSchema(),
      {'@type': 'WebSite', name: BUSINESS.name, url: SITE_URL, inLanguage: 'es-ES'},
    ],
  }), []);
  return <>
    <Seo path="/" schema={schema}/>
    <HomeHero/>

    <section className="proof-bar">
      <div className="shell proof-grid">
        <Metric value="1998" label="Año de apertura"/>
        <Metric value=">99%" label="Filtro UV" detail="según gama"/>
        <Metric value="1 día" label="Instalación habitual" detail="según vehículo"/>
        <Metric value="100%" label="Asesoramiento personal"/>
      </div>
    </section>

    <section className="section solutions-home">
      <div className="shell">
        <div className="heading-split reveal">
          <SectionHeading eyebrow="SOLUCIONES SOLARCHECK" title={<>Tres formas de proteger<br/><em>lo que importa.</em></>}/>
          <div><p>No vendemos «un tintado». Diagnosticamos qué está pasando —calor, radiación, privacidad o impactos— y elegimos la tecnología apropiada.</p><small><MousePointer2/> Pulsa en cada módulo para descubrirlo</small></div>
        </div>
        <div className="flip-grid">{services.map(service => <FlipCard service={service} key={service.key}/>)}</div>
      </div>
    </section>

    <section className="section problem-section">
      <div className="shell">
        <SectionHeading eyebrow="EMPIEZA POR EL PROBLEMA" title={<>¿Qué quieres que<br/><em>cambie?</em></>} text="Selecciona tu prioridad y descubre qué tipo de solución puede encajar mejor."/>
        <ProblemExplorer/>
        <p className="technical-note">* Prestaciones máximas declaradas por el fabricante para gamas concretas. El rendimiento final depende de la lámina, el vidrio y las condiciones de uso.</p>
      </div>
    </section>

    <section className="legal-clarity section-dark">
      <div className="shell legal-clarity-grid">
        <div className="legal-image reveal">
          <img src="/images/unnamed (10).webp" alt="Vehículo con lunas traseras tintadas y ventanillas delanteras transparentes" loading="lazy"/>
          <span className="image-label">INSTALACIÓN LEGAL EN ESPAÑA</span>
        </div>
        <div className="legal-copy reveal">
          <div className="eyebrow light"><span/> CLARIDAD ANTES DE INSTALAR</div>
          <h2>Protección sí.<br/><em>Atajos, no.</em></h2>
          <p>En turismos, las láminas adhesivas se instalan en las lunas laterales traseras y en la luneta posterior. El parabrisas y las ventanillas laterales delanteras quedan fuera del servicio ordinario por estar dentro del campo de visión del conductor.</p>
          <div className="legal-points">
            <span><Check/> Lámina certificada</span><span><Check/> Marcado visible</span><span><Check/> Documentación</span><span><Check/> Preparado para ITV</span>
          </div>
          <Link className="text-link-light" href="/laminas-solares-coche/">Cómo hacemos una instalación homologada <ArrowRight/></Link>
        </div>
      </div>
    </section>

    <section className="section work-preview">
      <div className="shell">
        <div className="heading-split reveal">
          <SectionHeading eyebrow="TRABAJOS REALES" title={<>La diferencia está<br/><em>en el acabado.</em></>}/>
          <div><p>Vehículos tratados en nuestro centro de Lleida. Sin renders, sin promesas vacías: instalaciones reales y resultados que puedes comprobar.</p><Link href="/trabajos/" className="text-link">Ver galería completa <ArrowRight/></Link></div>
        </div>
        <div className="editorial-gallery">
          {projects.slice(0, 5).map((project, index) => <Link href="/trabajos/" className={`editorial-photo photo-${index + 1} reveal`} key={project.src}>
            <img src={project.src} alt={`${project.title}: ${project.note}`} loading="lazy"/>
            <span><small>{project.type}</small><strong>{project.title}</strong><i><Maximize2/></i></span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="section method-section">
      <div className="shell">
        <SectionHeading eyebrow="UN PROCESO SIN SORPRESAS" title={<>Del primer mensaje<br/><em>al último detalle.</em></>} text="Un método claro para que sepas qué vas a recibir, por qué lo recomendamos y cómo cuidarlo."/>
        <ProcessStrip steps={[
          {title: 'Escuchamos', text: 'Nos cuentas el vehículo, espacio o superficie y el objetivo que persigues.'},
          {title: 'Diagnosticamos', text: 'Revisamos compatibilidad, uso, exposición y acabado deseado.'},
          {title: 'Instalamos', text: 'Preparamos cada superficie y trabajamos con precisión en un entorno controlado.'},
          {title: 'Entregamos', text: 'Revisamos contigo el resultado, documentación, garantía y cuidados.'},
        ]}/>
      </div>
    </section>

    <section className="company-teaser">
      <div className="company-teaser-image"><img src="/images/workshop-privacy.webp" alt="Interior del taller Solarcheck Lleida con la presencia del fondo anonimizada" loading="lazy"/><span>EL CENTRO · LLEIDA</span></div>
      <div className="company-teaser-copy">
        <div className="eyebrow"><span/> DESDE 1998</div>
        <h2>Experiencia que se ve.<br/><em>Criterio que se nota.</em></h2>
        <p>Más de dos décadas trabajando con cristal, lámina y carrocería enseñan algo esencial: cada proyecto pide una solución distinta. Por eso medimos, explicamos y solo entonces instalamos.</p>
        <div className="company-values"><span><Wrench/> Oficio especializado</span><span><ScanLine/> Corte digital</span><span><HeartHandshake/> Trato directo</span></div>
        <Link className="button button-dark" href="/empresa/">Conoce el centro <ArrowRight/></Link>
      </div>
    </section>

    <section className="section home-faq">
      <div className="shell faq-layout">
        <div className="faq-aside"><SectionHeading eyebrow="DUDAS FRECUENTES" title={<>Antes de<br/><em>decidir.</em></>}/><p>Respuestas honestas sobre legalidad, tiempos, mantenimiento y garantías.</p><Link className="text-link" href="/preguntas-frecuentes/">Ver todas las preguntas <ArrowRight/></Link></div>
        <FaqAccordion items={faqs.slice(0, 5)}/>
      </div>
    </section>
    <CtaBand/>
  </>;
}

function SolutionFinder() {
  const questions = [
    {q: '¿Qué quieres proteger?', options: [{v: 'auto', label: 'Mi vehículo'}, {v: 'building', label: 'Un edificio'}, {v: 'ppf', label: 'La pintura'}]},
    {q: '¿Cuál es tu prioridad?', options: [{v: 'heat', label: 'Reducir calor'}, {v: 'privacy', label: 'Ganar privacidad'}, {v: 'uv', label: 'Filtrar radiación UV'}, {v: 'impact', label: 'Evitar impactos y roces'}]},
  ];
  const [answers, setAnswers] = useState({0: '', 1: ''});
  const done = answers[0] && answers[1];
  const result = answers[0] === 'ppf' || answers[1] === 'impact'
    ? {title: 'Protección PPF Clearshield', href: '/clearshield-ppf/', text: 'Una barrera transparente para las zonas más expuestas de la carrocería.'}
    : answers[0] === 'building'
      ? {title: 'Láminas para edificios', href: '/laminas-edificios/', text: 'Control solar, UV, deslumbramiento o seguridad sobre el vidrio existente.'}
      : {title: 'Láminas para automóvil', href: '/laminas-solares-coche/', text: 'Protección solar homologada en lunas traseras, ajustada a tu prioridad.'};
  return <div className="solution-finder reveal">
    <div className="finder-questions">
      {questions.map((question, qIndex) => <fieldset key={question.q}><legend><span>0{qIndex + 1}</span>{question.q}</legend><div>{question.options.map(option => <label key={option.v}><input type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === option.v} onChange={() => setAnswers(a => ({...a, [qIndex]: option.v}))}/><span>{option.label}<Check/></span></label>)}</div></fieldset>)}
    </div>
    <div className={`finder-result ${done ? 'ready' : ''}`}>
      {!done ? <><Sparkles/><small>TU RECOMENDACIÓN</small><h3>Dos clics.<br/>Una dirección clara.</h3><p>Responde a las dos preguntas y te mostraremos por dónde empezar.</p></> : <><CircleCheck/><small>RECOMENDACIÓN INICIAL</small><h3>{result.title}</h3><p>{result.text}</p><Link className="button button-primary" href={result.href}>Explorar solución <ArrowRight/></Link><Link className="finder-budget" href="/presupuesto/">Pedir recomendación personal</Link></>}
    </div>
  </div>;
}

export function ServicesPage() {
  const crumbs = [{label: 'Servicios', href: '/servicios/'}];
  return <>
    <Seo path="/servicios/" schema={BreadcrumbSchema(crumbs)}/>
    <PageHero eyebrow="SERVICIOS SOLARCHECK LLEIDA" title="Protección pensada para" highlight="cada superficie." text="Del cristal de tu coche a la fachada de tu negocio. Tres especialidades, una misma obsesión: elegir bien, instalar mejor y dejar un acabado impecable." image="/images/stock/tint-workshop-detail.jpg" imageAlt="Detalle de una luna y una carrocería azul en un entorno de taller, sin personas" objectPosition="center 44%">
      <ButtonPair primaryLabel="Encontrar mi solución" secondary="/trabajos/"/>
    </PageHero>
    <div className="shell"><Breadcrumbs items={crumbs}/></div>
    <section className="section service-detail-list">
      <div className="shell">
        <SectionHeading eyebrow="ARQUITECTURA DE SERVICIOS" title={<>Todo lo que protegemos.<br/><em>Todo en su sitio.</em></>} text="Cada especialidad tiene su propia página, proceso, preguntas frecuentes y configurador de presupuesto."/>
        <div className="service-rows">
          {services.map((service, index) => <article key={service.key} className="service-row reveal">
            <div className="service-row-image"><img src={service.image} alt="" loading="lazy"/><span>{service.number}</span></div>
            <div className="service-row-copy"><small>{service.eyebrow}</small><h2>{service.title}</h2><p>{service.back}</p><ul>{(index === 0 ? ['Lunas laterales traseras y luneta', 'Láminas certificadas y documentadas', 'Corte digital ComputerCut'] : index === 1 ? ['Viviendas, oficinas y comercios', 'Control solar, UV y deslumbramiento', 'Estudio de compatibilidad del vidrio'] : ['Zonas críticas o cobertura integral', 'Acabado transparente', 'Protección frente a impactos cotidianos']).map(item => <li key={item}><Check/>{item}</li>)}</ul><Link href={service.href}>Ver servicio completo <ArrowRight/></Link></div>
          </article>)}
        </div>
      </div>
    </section>
    <section className="section finder-section section-dark">
      <div className="shell">
        <SectionHeading light eyebrow="RECOMENDADOR INTERACTIVO" title={<>Dinos qué te preocupa.<br/><em>Te marcamos el camino.</em></>} text="Una primera orientación en menos de un minuto."/>
        <SolutionFinder/>
      </div>
    </section>
    <section className="section comparison-section">
      <div className="shell">
        <SectionHeading eyebrow="DE UN VISTAZO" title={<>La solución correcta,<br/><em>sin mezclar conceptos.</em></>}/>
        <div className="comparison-table" role="table" aria-label="Comparativa de servicios">
          <div className="comparison-head" role="row"><span>Servicio</span><span>Protege</span><span>Objetivo principal</span><span>Intervención</span><span></span></div>
          <div role="row"><strong>Automóvil</strong><span>Lunas posteriores</span><span>Calor, UV, intimidad</span><span>Habitualmente 1 día</span><Link href="/laminas-solares-coche/">Ver <ArrowRight/></Link></div>
          <div role="row"><strong>Edificios</strong><span>Cristal existente</span><span>Confort y eficiencia</span><span>Sin sustituir ventanas</span><Link href="/laminas-edificios/">Ver <ArrowRight/></Link></div>
          <div role="row"><strong>Clearshield PPF</strong><span>Pintura</span><span>Impactos y roces</span><span>Por zonas o integral</span><Link href="/clearshield-ppf/">Ver <ArrowRight/></Link></div>
        </div>
      </div>
    </section>
    <CtaBand source="una solución de protección"/>
  </>;
}

const films = [
  {key: 'essential', name: 'Essential', tag: 'Equilibrio', icon: Layers3, summary: 'Una entrada sólida a la protección solar con tres tonalidades.', best: 'Estética, privacidad y protección UV con una inversión contenida.', features: ['No reflectiva', '3 tonalidades', 'Más del 99% de rechazo UV*']},
  {key: 'erian', name: 'Erian', tag: 'Color estable', icon: Gem, summary: 'Claridad óptica y estabilidad de color garantizada.', best: 'Quien busca un acabado neutro y duradero sin interferencias de señal.', features: ['Color estable', 'Sin interferencias', 'Varias transmisiones de luz']},
  {key: 'plus', name: 'Erian Plus', tag: 'Alto rendimiento', icon: Gauge, summary: 'Capa metalizada imperceptible para aumentar el rechazo térmico.', best: 'Vehículos expuestos al sol y uso familiar frecuente.', features: ['Hasta 60% de energía solar rechazada*', '4 tonalidades', 'Alta calidad óptica']},
  {key: 'ir', name: 'Erian Plus IR', tag: 'Nano-cerámica', icon: Zap, summary: 'Prestación térmica alta con tonalidades también muy claras.', best: 'Máximo confort térmico y cero interferencias electrónicas.', features: ['Hasta 96% de infrarrojos rechazados*', 'Hasta 70% de energía solar rechazada*', '6 tonalidades']},
];

function FilmSelector() {
  const [active, setActive] = useState('plus');
  const film = films.find(item => item.key === active);
  const Icon = film.icon;
  return <div className="film-selector reveal">
    <div className="film-tabs" role="tablist">{films.map(item => <button key={item.key} role="tab" aria-selected={active === item.key} className={active === item.key ? 'active' : ''} onClick={() => setActive(item.key)}><span>{item.tag}</span><strong>{item.name}</strong><ChevronRight/></button>)}</div>
    <div className="film-panel" role="tabpanel">
      <div className="film-icon"><Icon/></div><small>GAMA RECOMENDADA</small><h3>{film.name}</h3><p className="film-summary">{film.summary}</p><div className="film-best"><span>IDEAL PARA</span><p>{film.best}</p></div><ul>{film.features.map(feature => <li key={feature}><Check/>{feature}</li>)}</ul><Link href="/presupuesto/" className="button button-primary">Pedir recomendación <ArrowRight/></Link>
    </div>
  </div>;
}

function ToneDemo() {
  const tones = [{v: 'soft', label: 'Suave', opacity: .18}, {v: 'medium', label: 'Medio', opacity: .42}, {v: 'dark', label: 'Oscuro', opacity: .68}];
  const [tone, setTone] = useState(tones[1]);
  return <div className="tone-demo reveal">
    <div className="tone-image"><img src="/images/work-mercedes-profile.webp" alt="Perfil de un Mercedes-Benz en el taller"/><span className="tone-overlay" style={{opacity: tone.opacity}}/><div className="tone-line"><span>LUNAS DELANTERAS<br/><b>Sin lámina</b></span><i/><span>LUNAS TRASERAS<br/><b>Tono {tone.label.toLowerCase()}</b></span></div></div>
    <div className="tone-controls"><small>SIMULADOR ORIENTATIVO</small><h3>Elige una presencia.</h3><p>La oscuridad visual y el rendimiento térmico no son lo mismo. Este control solo ilustra el estilo; elegiremos el producto por sus datos técnicos.</p><div>{tones.map(item => <button key={item.v} className={tone.v === item.v ? 'active' : ''} onClick={() => setTone(item)}>{item.label}<span/></button>)}</div></div>
  </div>;
}

export function AutomotivePage() {
  const crumbs = [{label: 'Servicios', href: '/servicios/'}, {label: 'Láminas para automóvil', href: '/laminas-solares-coche/'}];
  const autoFaqs = faqs.filter(item => item.category === 'automovil').slice(0, 5);
  const schema = useMemo(() => ({'@context':'https://schema.org','@graph': [BreadcrumbSchema(crumbs), {'@type':'Service', name:'Tintado de lunas homologado', provider: LocalBusinessSchema(), areaServed:'Lleida', serviceType:'Instalación de láminas solares en lunas traseras de vehículos'}]}), []);
  return <>
    <Seo path="/laminas-solares-coche/" schema={schema}/>
    <PageHero eyebrow="AUTOMÓVIL · LLEIDA" title="Menos calor. Más privacidad." highlight="Todo legal." text="Tintado profesional de lunas laterales traseras y luneta posterior con láminas Solarcheck certificadas, corte digital y documentación para circular con tranquilidad." image="/images/stock/hero-rear-window.jpg" imageAlt="Detalle de lunas posteriores de un automóvil" objectPosition="center 30%"><ButtonPair primaryLabel="Presupuesto para mi coche" secondary="/trabajos/" secondaryLabel="Ver resultados reales"/></PageHero>
    <div className="shell"><Breadcrumbs items={crumbs}/></div>
    <section className="auto-benefits section">
      <div className="shell">
        <h2 className="sr-only">Ventajas de las láminas solares para automóvil</h2>
        <div className="benefit-grid">
          {[{icon: ThermometerSun, title: 'Confort térmico', text: 'Reduce la energía solar que entra por los cristales y ayuda al habitáculo a recuperar antes una temperatura confortable.'}, {icon: Sun, title: 'Filtro UV', text: 'Las gamas Solarcheck indicadas rechazan más del 99% de radiación UV, protegiendo ocupantes y materiales interiores.'}, {icon: Eye, title: 'Privacidad', text: 'Diferentes transmisiones de luz para encontrar un acabado integrado, desde discreto hasta más oscuro.'}, {icon: ShieldCheck, title: 'Seguridad pasiva', text: 'La película ayuda a mantener unidos los fragmentos de vidrio en caso de rotura.'}].map(({icon: Icon, title, text}, i) => <article className="benefit-card reveal" key={title}><span>0{i+1}</span><Icon/><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <p className="technical-note">Las prestaciones varían según la referencia elegida, el acristalamiento y las condiciones reales del vehículo.</p>
      </div>
    </section>
    <section className="legal-panel section-dark">
      <div className="shell legal-panel-grid">
        <div className="legal-panel-copy"><div className="eyebrow light"><span/> NORMATIVA ESPAÑOLA</div><h2>¿Qué lunas se pueden<br/><em>tintar?</em></h2><p>La norma excluye de la instalación ordinaria de láminas el parabrisas, las ventanillas laterales delanteras y cualquier superficie situada en el arco de 180° de visión directa hacia delante del conductor.</p><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2010-11822" target="_blank" rel="noreferrer" className="text-link-light">Consultar Orden ITC/1992/2010 en el BOE <ArrowRight/></a></div>
        <div className="glass-map reveal"><div className="glass-map-car"><img src="/images/unnamed (10).webp" alt="Vehículo con lunas traseras tintadas y delanteras transparentes"/><div className="glass-map-hot rear">Permitido<span>Laterales traseras<br/>y luneta</span></div><div className="glass-map-hot front">No ordinario<span>Parabrisas y<br/>laterales delanteras</span></div></div><div className="glass-legend"><span><i className="allow"/> Zona de instalación habitual</span><span><i className="deny"/> Campo de visión del conductor</span></div></div>
      </div>
    </section>
    <section className="section film-section"><div className="shell"><SectionHeading eyebrow="GAMAS SOLARCHECK" title={<>No todas las láminas<br/><em>hacen lo mismo.</em></>} text="Compara tecnologías y descubre cuál se acerca más a tu manera de usar el coche."/><FilmSelector/><p className="technical-note">* Datos máximos del fabricante según referencia concreta. Confirmaremos la ficha técnica y el alcance de la garantía de la opción propuesta.</p></div></section>
    <section className="section tone-section"><div className="shell"><SectionHeading eyebrow="ESTÉTICA CON CRITERIO" title={<>El tono se elige.<br/><em>La tecnología se calcula.</em></>} text="Prueba el control visual y entiende por qué una lámina clara también puede ofrecer un gran rendimiento térmico."/><ToneDemo/></div></section>
    <section className="section install-section"><div className="shell install-grid"><div className="install-media reveal"><img src="/images/stock/tint-workshop-detail.jpg" alt="Detalle de una luna de automóvil en un entorno de taller sin personas" loading="lazy"/><span>Imagen de stock · Detalle ilustrativo</span></div><div><SectionHeading eyebrow="COMPUTERCUT" title={<>Precisión antes de<br/><em>tocar el coche.</em></>} text="Los patrones digitales se preparan para cada modelo. Así minimizamos la manipulación, evitamos cortar directamente sobre el cristal y reducimos la necesidad de desmontaje."/><ProcessStrip steps={[{title:'Recepción',text:'Revisamos cristales, sellos y estado general.'},{title:'Preparación',text:'Limpieza profunda en un entorno de trabajo controlado.'},{title:'Corte digital',text:'Patrón específico para marca, modelo y vidrio.'},{title:'Instalación',text:'Aplicación, secado inicial y control de acabado.'}]}/></div></div></section>
    <section className="section"><div className="shell faq-layout"><div className="faq-aside"><SectionHeading eyebrow="AUTOMÓVIL · FAQ" title={<>Todo claro antes<br/><em>de reservar.</em></>}/><Link href="/preguntas-frecuentes/" className="text-link">Ver todas las preguntas <ArrowRight/></Link></div><FaqAccordion items={autoFaqs}/></div></section>
    <CtaBand title="Tu coche, tu uso, tu lámina." text="Dinos marca, modelo y año. Te recomendaremos una gama y tonalidad con sentido, sin venderte más de lo que necesitas." source="láminas solares para mi coche" image="/images/work-bmw-x4.webp"/>
  </>;
}

function BuildingConfigurator() {
  const [space, setSpace] = useState('home');
  const [priority, setPriority] = useState('heat');
  const spaces = {home: 'Vivienda', office: 'Oficina', retail: 'Comercio', industry: 'Nave / industria'};
  const priorities = {heat: {label:'Calor', result:'Lámina de control solar', text:'Prioriza el rechazo de energía solar manteniendo la entrada de luz que el espacio necesita.'}, glare: {label:'Reflejos', result:'Control de deslumbramiento', text:'Reduce molestias en pantallas y zonas de trabajo sin recurrir a persianas cerradas todo el día.'}, uv: {label:'Decoloración', result:'Protección UV', text:'Ayuda a retrasar el deterioro de productos, mobiliario, tejidos y acabados expuestos.'}, safety: {label:'Seguridad', result:'Lámina de seguridad', text:'Refuerza el comportamiento del vidrio y ayuda a mantener unidos los fragmentos en caso de rotura.'}};
  const result = priorities[priority];
  return <div className="building-config reveal"><div className="config-controls"><fieldset><legend>01 · Tipo de espacio</legend>{Object.entries(spaces).map(([key,label]) => <label key={key}><input type="radio" name="space" checked={space === key} onChange={() => setSpace(key)}/><span>{label}<Check/></span></label>)}</fieldset><fieldset><legend>02 · Prioridad principal</legend>{Object.entries(priorities).map(([key,value]) => <label key={key}><input type="radio" name="priority" checked={priority === key} onChange={() => setPriority(key)}/><span>{value.label}<Check/></span></label>)}</fieldset></div><div className="config-result"><div className="config-sun"><Sun/><span/><i/></div><small>ORIENTACIÓN INICIAL · {spaces[space].toUpperCase()}</small><h3>{result.result}</h3><p>{result.text}</p><div><span><Check/> Estudio de vidrio</span><span><Check/> Muestra de acabado</span><span><Check/> Propuesta a medida</span></div><Link href="/presupuesto/" className="button button-primary">Pedir estudio <ArrowRight/></Link></div></div>;
}

export function BuildingsPage() {
  const crumbs = [{label: 'Servicios', href: '/servicios/'}, {label: 'Láminas para edificios', href: '/laminas-edificios/'}];
  const buildingFaqs = faqs.filter(item => item.category === 'edificios');
  return <>
    <Seo path="/laminas-edificios/" schema={{'@context':'https://schema.org','@graph':[BreadcrumbSchema(crumbs), {'@type':'Service',name:'Láminas solares para edificios',provider:LocalBusinessSchema(),areaServed:'Lleida',serviceType:'Instalación de láminas de control solar, UV y seguridad en edificios'}]}}/>
    <PageHero eyebrow="ARQUITECTURA · CONTROL SOLAR" title="Haz del cristal una" highlight="ventaja." text="Mejora el confort, reduce los reflejos y protege los interiores sin sustituir las ventanas. Soluciones para viviendas, oficinas, comercios e industria en Lleida." image="/images/stock/architectural-glass.jpg" imageAlt="Fachada acristalada de un edificio al atardecer"><ButtonPair primaryLabel="Solicitar estudio" secondary="/servicios/" secondaryLabel="Comparar servicios"/></PageHero>
    <div className="shell"><Breadcrumbs items={crumbs}/></div>
    <section className="section building-intro"><div className="shell"><div className="heading-split"><SectionHeading eyebrow="SIN OBRA PESADA" title={<>Más confort.<br/><em>Mismo cristal.</em></>}/><p>Una lámina bien especificada modifica cómo se comporta la radiación sobre el vidrio existente. El primer paso no es elegir un color: es entender el acristalamiento, la orientación y el uso real del espacio.</p></div><div className="building-metrics"><Metric value="Hasta 86%" label="energía solar rechazada" detail="según solución y vidrio"/><Metric value=">99%" label="radiación UV filtrada" detail="según gama"/><Metric value="0" label="ventanas sustituidas" detail="si el vidrio es compatible"/></div></div></section>
    <section className="section building-use-cases section-dark"><div className="shell"><SectionHeading light eyebrow="DÓNDE TRABAJAMOS" title={<>Una envolvente mejor<br/><em>para cada actividad.</em></>}/><div className="use-case-grid">{[{icon:Building2,title:'Viviendas',text:'Estancias sobrecalentadas, grandes ventanales, privacidad y protección de mobiliario.'},{icon:Lightbulb,title:'Oficinas',text:'Confort de los equipos, reflejos en pantallas y reducción de cargas térmicas.'},{icon:Eye,title:'Comercios',text:'Escaparates, exposición de producto, privacidad y control del deslumbramiento.'},{icon:Waves,title:'Industria',text:'Lucernarios, fachadas amplias y zonas de trabajo con alta incidencia solar.'}].map(({icon:Icon,title,text},i)=><article key={title} className="use-case reveal"><span>0{i+1}</span><Icon/><h3>{title}</h3><p>{text}</p><Link href="/presupuesto/">Estudiar este caso <ArrowRight/></Link></article>)}</div></div></section>
    <section className="section building-config-section"><div className="shell"><SectionHeading eyebrow="CONFIGURADOR DE NECESIDADES" title={<>Define el problema.<br/><em>Nosotros estudiamos el vidrio.</em></>} text="Selecciona el espacio y la prioridad para obtener una orientación inicial."/><BuildingConfigurator/></div></section>
    <section className="section solar-layers"><div className="shell layers-grid"><div className="layers-visual reveal"><div className="sun-source"><Sun/></div><span className="ray ray-1"/><span className="ray ray-2"/><span className="ray ray-3"/><div className="window-layer"><span>VIDRIO</span><i>LÁMINA</i></div><div className="inside-label">INTERIOR<br/><strong>más confortable</strong></div></div><div><SectionHeading eyebrow="CÓMO ACTÚA" title={<>Gestiona lo invisible.<br/><em>Conserva lo esencial.</em></>} text="La radiación solar combina luz visible, ultravioleta e infrarrojo. Cada proyecto necesita decidir qué parte transmitir, absorber o reflejar."/><ul className="feature-list"><li><Sun/><div><strong>Control solar</strong><span>Reduce la entrada de energía y la sensación de sobrecalentamiento.</span></div></li><li><Eye/><div><strong>Control visual</strong><span>Gestiona reflejos, luz y privacidad según la actividad.</span></div></li><li><Shield/><div><strong>Protección</strong><span>Ayuda frente a UV, rotura o vandalismo según la gama elegida.</span></div></li></ul></div></div></section>
    <section className="section"><div className="shell"><SectionHeading eyebrow="METODOLOGÍA" title={<>Medir antes de<br/><em>prometer.</em></>}/><ProcessStrip steps={[{title:'Visita o documentación',text:'Recogemos fotos, medidas, orientación y uso de cada zona.'},{title:'Comprobación técnica',text:'Identificamos el vidrio y descartamos combinaciones incompatibles.'},{title:'Propuesta',text:'Comparamos rendimiento, estética y alcance económico.'},{title:'Instalación',text:'Planificamos accesos, protección del espacio y control final.'}]}/></div></section>
    <section className="section section-soft"><div className="shell faq-layout"><div className="faq-aside"><SectionHeading eyebrow="EDIFICIOS · FAQ" title={<>Decisiones con<br/><em>datos.</em></>}/><p>La compatibilidad del vidrio es crítica. Por eso siempre revisamos antes de instalar.</p></div><FaqAccordion items={buildingFaqs}/></div></section>
    <CtaBand title="Cuéntanos dónde pega el sol." text="Envíanos fotos, medidas aproximadas y orientación. Te diremos qué datos faltan para preparar un estudio responsable." source="láminas solares para un edificio" image="/images/stock/architectural-glass.jpg"/>
  </>;
}

function CoverageSelector() {
  const options = [
    {key:'essential',name:'Zonas críticas',num:'01',zones:['retrovisores','taloneras','carga'],text:'Protección puntual en áreas de roce frecuente y uso cotidiano.'},
    {key:'front',name:'Frontal completo',num:'02',zones:['capo','paragolpes','aletas','retrovisores'],text:'La opción más buscada para reducir el impacto de gravilla e insectos en carretera.'},
    {key:'full',name:'Cobertura integral',num:'03',zones:['capo','paragolpes','aletas','retrovisores','puertas','techo','trasera'],text:'Protección envolvente para vehículos especiales, nuevos o de alto valor.'},
  ];
  const [active, setActive] = useState(options[1]);
  return <div className="coverage-selector reveal"><div className="coverage-visual"><div className="car-silhouette" aria-label={`Zonas activas: ${active.zones.join(', ')}`}><svg viewBox="0 0 720 300" role="img" aria-hidden="true"><path className="car-base" d="M79 210h28c8-45 39-69 83-69 44 0 75 24 83 69h207c8-45 40-69 84-69s75 24 83 69h43v-50c0-21-12-38-35-45l-98-29-82-65H246l-94 78-59 14c-32 8-48 29-48 63v34h34Z"/><path className={`zone roof ${active.zones.includes('techo')?'active':''}`} d="m252 42-70 58h268l-72-58H252Z"/><path className={`zone capo ${active.zones.includes('capo')?'active':''}`} d="m454 103 101 30-9 46H441l-14-76h27Z"/><path className={`zone paragolpes ${active.zones.includes('paragolpes')?'active':''}`} d="M546 179h99v39h-97c2-13 2-26-2-39Z"/><path className={`zone aletas ${active.zones.includes('aletas')?'active':''}`} d="M427 103h28l-14 76c-18 8-31 20-40 37h-40v-113h66Z"/><path className={`zone puertas ${active.zones.includes('puertas')?'active':''}`} d="M181 103h178v113h-87c-8-45-39-69-83-69-3 0-5 0-8 1v-45Z"/><circle className="wheel" cx="190" cy="215" r="48"/><circle className="wheel" cx="498" cy="215" r="48"/></svg><div className="zone-pulse"/></div><span className="coverage-caption">Visualización orientativa · la cobertura se adapta al modelo</span></div><div className="coverage-options">{options.map(option=><button key={option.key} className={active.key===option.key?'active':''} onClick={()=>setActive(option)}><span>{option.num}</span><div><strong>{option.name}</strong><small>{option.text}</small></div><ChevronRight/></button>)}<Link href="/presupuesto/" className="button button-primary">Presupuestar {active.name.toLowerCase()} <ArrowRight/></Link></div></div>;
}

export function PpfPage() {
  const crumbs = [{label:'Servicios',href:'/servicios/'},{label:'Clearshield PPF',href:'/clearshield-ppf/'}];
  const ppfFaqs = faqs.filter(item=>item.category==='ppf');
  return <>
    <Seo path="/clearshield-ppf/" schema={{'@context':'https://schema.org','@graph':[BreadcrumbSchema(crumbs),{'@type':'Service',name:'Protección de pintura PPF Clearshield',provider:LocalBusinessSchema(),areaServed:'Lleida',serviceType:'Instalación de película de protección de pintura para vehículos'}]}}/>
    <PageHero eyebrow="CLEARSHIELD · PAINT PROTECTION FILM" title="La protección que" highlight="no roba protagonismo." text="Película transparente para proteger la pintura frente a gravilla, insectos, roces y pequeñas abrasiones. Elige las zonas críticas, el frontal o una cobertura integral." image="/images/stock/ppf-finish-detail.jpg" imageAlt="Detalle de una carrocería brillante sin personas"><ButtonPair primaryLabel="Configurar cobertura" secondary="/trabajos/" secondaryLabel="Conocer el taller"/></PageHero>
    <div className="shell"><Breadcrumbs items={crumbs}/></div>
    <section className="section ppf-benefits"><div className="shell"><SectionHeading eyebrow="PROTECCIÓN INVISIBLE" title={<>Conserva el acabado.<br/><em>Disfruta el coche.</em></>} text="Una capa sacrificable entre la pintura y lo que ocurre en la carretera."/><div className="ppf-benefit-grid">{[{icon:Shield,title:'Gravilla',text:'Ayuda a absorber pequeños impactos en las zonas más expuestas.'},{icon:Sparkles,title:'Acabado',text:'Mantiene el color y el brillo original como protagonistas.'},{icon:Sun,title:'Exposición',text:'Protección diseñada para convivir con el uso y la radiación solar.'},{icon:Gem,title:'Valor',text:'Contribuye a conservar mejor el estado de la pintura original.'}].map(({icon:Icon,title,text})=><article key={title} className="reveal"><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section coverage-section section-dark"><div className="shell"><SectionHeading light eyebrow="CONFIGURADOR PPF" title={<>Protege lo necesario.<br/><em>Amplía cuando quieras.</em></>} text="Selecciona una cobertura para visualizar las zonas habituales y preparar tu consulta."/><CoverageSelector/></div></section>
    <section className="section ppf-process"><div className="shell ppf-process-grid"><div><SectionHeading eyebrow="EL RESULTADO EMPIEZA ANTES" title={<>La película no corrige.<br/><em>Protege lo que encuentra.</em></>} text="Por eso examinamos la pintura, detectamos daños previos y acordamos el alcance antes de empezar. La preparación es parte del resultado."/><ul className="feature-list"><li><ScanLine/><div><strong>Inspección bajo luz</strong><span>Documentamos el estado de cada panel incluido.</span></div></li><li><Waves/><div><strong>Descontaminación</strong><span>Preparamos la superficie para una adhesión uniforme.</span></div></li><li><Layers3/><div><strong>Colocación precisa</strong><span>Alineación, tensión, bordes y terminaciones según pieza.</span></div></li></ul></div><div className="ppf-process-photo reveal"><img src="/images/stock/ppf-finish-detail.jpg" alt="Detalle de una carrocería brillante sin personas" loading="lazy"/><span>Fotografía de stock · Acabado ilustrativo</span><div><strong>PPF</strong><small>Paint protection film</small></div></div></div></section>
    <section className="section section-soft"><div className="shell"><SectionHeading eyebrow="PROCESO" title={<>Cuatro controles.<br/><em>Un acabado limpio.</em></>}/><ProcessStrip steps={[{title:'Inspección',text:'Revisamos pintura, repintados, golpes y expectativas.'},{title:'Preparación',text:'Lavado técnico y descontaminación de las zonas.'},{title:'Instalación',text:'Aplicación panel a panel en ambiente controlado.'},{title:'Revisión',text:'Control de bordes, terminaciones y cuidados posteriores.'}]}/></div></section>
    <section className="section"><div className="shell faq-layout"><div className="faq-aside"><SectionHeading eyebrow="PPF · FAQ" title={<>Antes de<br/><em>proteger.</em></>}/><p>Revisamos cada coche porque el estado previo condiciona el acabado final.</p></div><FaqAccordion items={ppfFaqs}/></div></section>
    <CtaBand title="¿Qué parte de tu coche te preocupa más?" text="Dinos modelo, año y tipo de uso. Te ayudaremos a decidir entre zonas críticas, frontal o cobertura integral." source="protección PPF para mi coche" image="/images/stock/ppf-finish-detail.jpg"/>
  </>;
}

function Gallery() {
  const filters = ['Todos','Turismo','SUV','Familiar','Profesional'];
  const [filter,setFilter] = useState('Todos');
  const [selected,setSelected] = useState(null);
  const visible = filter==='Todos' ? projects : projects.filter(project=>project.type===filter);
  const move = direction => {
    const index = visible.findIndex(item=>item.src===selected?.src);
    setSelected(visible[(index+direction+visible.length)%visible.length]);
  };
  return <><div className="gallery-filters" role="group" aria-label="Filtrar trabajos">{filters.map(item=><button className={filter===item?'active':''} onClick={()=>{setFilter(item);setSelected(null)}} key={item}>{item}<span>{item==='Todos'?projects.length:projects.filter(p=>p.type===item).length}</span></button>)}</div><div className="work-grid">{visible.map((project,index)=><button className={`work-card ${index%5===0?'wide':''} reveal`} key={project.src} onClick={()=>setSelected(project)}><img src={project.src} alt={`${project.title}, ${project.note}`} loading="lazy"/><span className="work-card-shade"/><span className="work-card-index">{String(index+1).padStart(2,'0')}</span><span className="work-card-copy"><small>{project.type}</small><strong>{project.title}</strong><em>{project.note}</em></span><i><Maximize2/></i></button>)}</div>{selected&&<div className="gallery-modal" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={()=>setSelected(null)}><button className="gallery-close" onClick={()=>setSelected(null)} aria-label="Cerrar"><X/></button><button className="gallery-prev" onMouseDown={e=>e.stopPropagation()} onClick={()=>move(-1)} aria-label="Anterior"><ChevronLeft/></button><figure onMouseDown={e=>e.stopPropagation()}><img src={selected.src} alt={`${selected.title}, ${selected.note}`}/><figcaption><small>{selected.type} · TRABAJO REAL</small><strong>{selected.title}</strong><span>{selected.note}</span></figcaption></figure><button className="gallery-next" onMouseDown={e=>e.stopPropagation()} onClick={()=>move(1)} aria-label="Siguiente"><ChevronRight/></button></div>}</>;
}

export function WorkPage() {
  const crumbs=[{label:'Trabajos',href:'/trabajos/'}];
  return <><Seo path="/trabajos/" schema={BreadcrumbSchema(crumbs)}/><PageHero eyebrow="PORTFOLIO · TRABAJOS REALES" title="El acabado no se promete." highlight="Se enseña." text="Una selección de vehículos tratados en nuestro centro de Lleida. Filtra la galería y abre cada imagen para ver el resultado con más detalle." image="/images/work-audi-a7.webp" imageAlt="Audi A7 con lámina solar posterior instalado en Solarcheck Lleida"><ButtonPair primaryLabel="Quiero un resultado así" secondary="/laminas-solares-coche/" secondaryLabel="Ver el servicio"/></PageHero><div className="shell"><Breadcrumbs items={crumbs}/></div><section className="section work-page"><div className="shell"><div className="heading-split"><SectionHeading eyebrow="GALERÍA DEL CENTRO" title={<>Coches reales.<br/><em>Acabados reales.</em></>}/><p>Estas fotografías pertenecen a instalaciones realizadas por el centro. Las matrículas visibles se han ocultado cuando ha sido necesario.</p></div><Gallery/></div></section><section className="work-proof section-dark"><div className="shell work-proof-grid"><div><Award/><strong>Más de 25 años</strong><span>de experiencia local</span></div><div><ScanLine/><strong>ComputerCut</strong><span>corte digital por modelo</span></div><div><ShieldCheck/><strong>Documentación</strong><span>lámina certificada</span></div><div><HeartHandshake/><strong>Trato directo</strong><span>con el equipo del centro</span></div></div></section><CtaBand title="El próximo puede ser el tuyo." text="Envíanos marca, modelo y año. Te orientaremos sobre gama, tonalidad y disponibilidad." source="un tintado de lunas para mi vehículo" image="/images/work-mercedes-estate.webp"/></>;
}

export function CompanyPage() {
  const crumbs=[{label:'Empresa',href:'/empresa/'}];
  return <><Seo path="/empresa/" schema={BreadcrumbSchema(crumbs)}/><PageHero eyebrow="SOLARCHECK LLEIDA · DESDE 1998" title="Un oficio de precisión." highlight="Una relación de confianza." text="Somos un centro especializado en soluciones de protección solar y superficies. Llevamos más de 25 años trabajando en Lleida con una idea sencilla: explicar bien, recomendar con criterio e instalar con cuidado." image="/images/workshop-privacy.webp" imageAlt="Interior del centro Solarcheck Lleida con la presencia del fondo anonimizada" objectPosition="center 54%"><ButtonPair primaryLabel="Visitar el centro" primary="/contacto/" secondary="/trabajos/" secondaryLabel="Ver trabajos"/></PageHero><div className="shell"><Breadcrumbs items={crumbs}/></div>
  <section className="section company-story"><div className="shell story-grid"><div className="story-sticky"><div className="eyebrow"><span/> NUESTRA HISTORIA</div><h2>La tecnología cambia.<br/><em>El criterio permanece.</em></h2></div><div className="timeline"><article><span>1998</span><div><h3>Abrimos el centro</h3><p>Empezamos a trabajar desde Lleida en instalación profesional de láminas y soluciones para cristal.</p></div></article><article><span>2000s</span><div><h3>Especialización</h3><p>La experiencia diaria con vehículos, edificios y distintos acristalamientos consolida un método propio.</p></div></article><article><span>ComputerCut</span><div><h3>Precisión digital</h3><p>Integramos patrones de corte específicos por modelo para reducir manipulación y mejorar consistencia.</p></div></article><article><span>Hoy</span><div><h3>Protección 360º</h3><p>Automóvil, arquitectura y PPF conviven en una propuesta más completa y asesorada.</p></div></article></div></div></section>
  <section className="section-dark company-workshop"><div className="shell workshop-grid"><div className="workshop-collage"><img src="/images/workshop-privacy.webp" alt="Zona de trabajo del centro con la presencia del fondo anonimizada"/><img src="/images/detail.jpg" alt="Fachada de Solarcheck Lleida"/><span>C/ INDÍVIL I MANDONI, 3</span></div><div><SectionHeading light eyebrow="EL CENTRO" title={<>Un espacio preparado<br/><em>para hacer bien el trabajo.</em></>} text="La limpieza, la iluminación y el control del entorno importan. Aquí recibimos el vehículo, preparamos las superficies y comprobamos el acabado antes de entregarlo."/><ContactDetails dark/></div></div></section>
  <section className="section company-principles"><div className="shell"><SectionHeading eyebrow="CÓMO DECIDIMOS" title={<>Cuatro principios.<br/><em>Ninguna improvisación.</em></>}/><div className="principle-grid">{[{n:'01',title:'Primero, entender',text:'Preguntamos por el uso y el problema antes de hablar de producto.'},{n:'02',title:'Después, comprobar',text:'Revisamos vehículo, vidrio o pintura para evitar incompatibilidades.'},{n:'03',title:'Explicar sin humo',text:'Prestaciones, límites, garantía y cuidados quedan claros antes de empezar.'},{n:'04',title:'Revisar juntos',text:'La entrega incluye comprobación visual y siguientes pasos.'}].map(item=><article className="reveal" key={item.n}><span>{item.n}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
  <section className="section company-values-section section-soft"><div className="shell values-layout"><SectionHeading eyebrow="POR QUÉ EL CENTRO" title={<>Cerca para responder.<br/><em>Preparados para resolver.</em></>}/><div className="big-values"><article><strong>+25</strong><span>años de experiencia</span></article><article><strong>3</strong><span>áreas de especialidad</span></article><article><strong>1</strong><span>equipo de trato directo</span></article></div></div></section><CtaBand title="Ven, enséñanos tu proyecto." text="Estamos en el centro de Lleida. Si vienes con vehículo, confirma antes la disponibilidad para que podamos atenderte sin esperas." source="una visita al centro" image="/images/workshop-privacy.webp"/></>;
}

export function FaqPage() {
  const [category,setCategory]=useState('all');
  const groups=[['all','Todas'],['automovil','Automóvil'],['edificios','Edificios'],['ppf','PPF'],['general','General']];
  const visible=category==='all'?faqs:faqs.filter(item=>item.category===category);
  const crumbs=[{label:'Preguntas frecuentes',href:'/preguntas-frecuentes/'}];
  const faqSchema={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(item=>({'@type':'Question',name:item.q,acceptedAnswer:{'@type':'Answer',text:item.a}}))};
  return <><Seo path="/preguntas-frecuentes/" schema={faqSchema}/><PageHero eyebrow="CENTRO DE AYUDA" title="Preguntas directas." highlight="Respuestas claras." text="Legalidad, ITV, tiempos, compatibilidad, cuidados y garantías. Todo lo que conviene saber antes de proteger un coche, un cristal o una pintura." image="/images/work-mercedes-profile.webp" imageAlt="Mercedes-Benz con láminas traseras en Solarcheck Lleida"><ButtonPair primaryLabel="Hacer una consulta" primary="/contacto/" secondary="/servicios/" secondaryLabel="Ver servicios"/></PageHero><div className="shell"><Breadcrumbs items={crumbs}/></div><section className="section faq-page"><div className="shell"><div className="faq-filter">{groups.map(([key,label])=><button key={key} className={category===key?'active':''} onClick={()=>setCategory(key)}>{label}<span>{key==='all'?faqs.length:faqs.filter(item=>item.category===key).length}</span></button>)}</div><div className="faq-page-grid"><aside><small>MOSTRANDO</small><strong>{visible.length}</strong><span>respuestas</span><p>¿No encuentras tu duda? Escríbenos y te responderá directamente el equipo del centro.</p><a className="button button-dark" href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle/> Preguntar por WhatsApp</a></aside><FaqAccordion key={category} items={visible}/></div></div></section><section className="legal-source-note"><div className="shell"><FileCheck2/><div><strong>Información legal contrastada</strong><p>La respuesta sobre lunas delanteras se basa en la Orden ITC/1992/2010. Puedes consultar el texto consolidado en el BOE.</p></div><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2010-11822" target="_blank" rel="noreferrer">Abrir BOE <ArrowRight/></a></div></section><CtaBand title="¿Te queda una duda concreta?" text="Escríbenos con el modelo de vehículo o las características del espacio y te responderemos de forma personal." source="una duda sobre vuestros servicios"/></>;
}

export function ContactPage() {
  const crumbs=[{label:'Contacto',href:'/contacto/'}];
  return <><Seo path="/contacto/" schema={BreadcrumbSchema(crumbs)}/><PageHero eyebrow="CONTACTO · SOLARCHECK LLEIDA" title="Estamos cerca." highlight="Y respondemos personas." text="Llama, escribe por WhatsApp o ven al centro. Si necesitas presupuesto, puedes preparar toda la información con nuestro formulario guiado." image="/images/detail.jpg" imageAlt="Fachada del centro Solarcheck Lleida"><ButtonPair primaryLabel="Cómo llegar" primary={BUSINESS.maps} secondary="/presupuesto/" secondaryLabel="Preparar presupuesto"/></PageHero><div className="shell"><Breadcrumbs items={crumbs}/></div><section className="section contact-page"><div className="shell contact-page-grid"><div><SectionHeading eyebrow="DATOS DEL CENTRO" title={<>El canal que prefieras.<br/><em>El mismo equipo.</em></>} text="Para instalaciones de automóvil, recomendamos reservar antes de desplazarte."/><ContactDetails/><div className="contact-hours"><Clock3/><div><strong>Horario habitual</strong><p>Lunes a jueves: 8:00–18:00<br/>Viernes: 8:00–15:00<br/>Sábado y domingo: cerrado</p><small>Consulta posibles cambios en festivos antes de venir.</small></div></div></div><div className="contact-map"><a href={BUSINESS.maps} target="_blank" rel="noreferrer" aria-label="Abrir ubicación en Google Maps"><div className="map-grid"/><div className="map-road road-a"/><div className="map-road road-b"/><div className="map-road road-c"/><span className="map-pin"><MapPin/></span><div className="map-card"><small>SOLARCHECK LLEIDA</small><strong>{BUSINESS.address}</strong><span>{BUSINESS.postalCode} {BUSINESS.city}</span><b>Abrir indicaciones <ArrowRight/></b></div></a></div></div></section><section className="contact-wizard section-dark"><div className="shell contact-wizard-grid"><div><SectionHeading light eyebrow="ADELANTA INFORMACIÓN" title={<>Llega al primer mensaje<br/><em>con todo preparado.</em></>} text="Elige el servicio, añade los datos básicos y abriremos WhatsApp con una consulta clara."/><div className="mini-proof"><span><Check/> Sin registro</span><span><Check/> Sin centralitas</span><span><Check/> Respuesta del centro</span></div></div><LeadWizard compact/></div></section></>;
}

export function QuotePage() {
  const crumbs=[{label:'Presupuesto',href:'/presupuesto/'}];
  return <><Seo path="/presupuesto/" schema={BreadcrumbSchema(crumbs)}/><section className="quote-page-hero"><div className="quote-bg"><img src="/images/stock/tint-workshop-detail.jpg" alt=""/><div/></div><div className="shell quote-layout"><div className="quote-copy"><Breadcrumbs items={crumbs}/><div className="eyebrow light"><span/> PRESUPUESTO GUIADO</div><h1>Cuéntanos lo justo.<br/><em>Te respondemos con criterio.</em></h1><p>En tres pasos prepararemos una consulta completa para el centro. No publicamos tarifas genéricas porque cada modelo, vidrio y cobertura cambia el trabajo real.</p><div className="quote-assurances"><span><ShieldCheck/> Sin compromiso</span><span><TimerReset/> Menos de 2 minutos</span><span><MessageCircle/> Respuesta directa</span></div><ContactDetails dark/></div><LeadWizard/></div></section></>;
}

function LegalLayout({path, title, intro, children, updated='29 de julio de 2026'}) {
  const label=title.replace(/<[^>]+>/g,'');
  return <><Seo path={path}/><section className="legal-hero"><div className="shell"><Breadcrumbs items={[{label,href:path}]}/><div className="eyebrow light"><span/> INFORMACIÓN LEGAL</div><h1>{title}</h1><p>{intro}</p><small>Última actualización: {updated}</small></div></section><section className="legal-content section"><div className="shell legal-layout"><aside><strong>Índice</strong><a href="#identidad">Identidad</a><a href="#condiciones">Condiciones</a><a href="#derechos">Derechos</a><a href="#contacto-legal">Contacto</a></aside><article>{children}</article></div></section></>;
}

export function LegalNoticePage(){return <LegalLayout path="/aviso-legal/" title="Aviso legal" intro="Identificación del titular, condiciones de acceso y responsabilidades asociadas a este sitio web."><h2 id="identidad">1. Titular del sitio</h2><p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico, se informa de que este sitio es operado por:</p><dl><dt>Razón social</dt><dd>{BUSINESS.legalName}</dd><dt>CIF</dt><dd>{BUSINESS.taxId}</dd><dt>Domicilio</dt><dd>{BUSINESS.address}, {BUSINESS.postalCode} {BUSINESS.city}, España</dd><dt>Correo</dt><dd><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></dd><dt>Teléfono</dt><dd><a href={`tel:${BUSINESS.phoneHref}`}>{BUSINESS.phone}</a></dd></dl><h2 id="condiciones">2. Condiciones de uso</h2><p>El acceso al sitio implica la aceptación de estas condiciones. La información se ofrece con carácter general y puede actualizarse sin previo aviso. Los presupuestos, prestaciones y garantías definitivas serán los que consten en la propuesta y documentación entregada para cada trabajo.</p><h3>Propiedad intelectual</h3><p>Los textos, diseño y elementos propios del sitio pertenecen a su titular o se utilizan con autorización. La marca Solarcheck y demás signos distintivos pertenecen a sus respectivos titulares. Las fotografías de trabajos reales corresponden al centro; las imágenes de stock se usan bajo las licencias indicadas por sus proveedores.</p><h3>Enlaces externos</h3><p>Este sitio enlaza a servicios de terceros, como WhatsApp, Google Maps y fuentes normativas. El acceso a esos servicios queda sujeto a sus propias condiciones y políticas.</p><h2 id="derechos">3. Responsabilidad</h2><p>Trabajamos para mantener la información correcta, pero no garantizamos la ausencia absoluta de errores o interrupciones. La información técnica es orientativa hasta verificar el vehículo, el vidrio, la superficie y la referencia de producto.</p><h2 id="contacto-legal">4. Contacto</h2><p>Para cualquier comunicación relacionada con este aviso, escribe a <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.</p></LegalLayout>}

export function PrivacyPage(){return <LegalLayout path="/privacidad/" title="Política de privacidad" intro="Cómo tratamos los datos cuando contactas con el centro o solicitas información."><h2 id="identidad">1. Responsable del tratamiento</h2><dl><dt>Responsable</dt><dd>{BUSINESS.legalName}</dd><dt>CIF</dt><dd>{BUSINESS.taxId}</dd><dt>Dirección</dt><dd>{BUSINESS.address}, {BUSINESS.postalCode} {BUSINESS.city}</dd><dt>Correo</dt><dd><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></dd></dl><h2 id="condiciones">2. Datos, finalidad y base jurídica</h2><p>Cuando solicitas información podemos tratar tu nombre, teléfono, correo, datos del vehículo o proyecto y el contenido de tu consulta. La finalidad es responder, preparar un presupuesto, concertar una cita y gestionar la relación precontractual o contractual.</p><p>La base jurídica es tu consentimiento al enviar la consulta y, cuando corresponda, la aplicación de medidas precontractuales solicitadas por ti o la ejecución del servicio contratado.</p><h3>Formulario guiado y WhatsApp</h3><p>El configurador de esta web no guarda tus respuestas en un servidor propio. Genera localmente un texto y abre WhatsApp para que decidas si quieres enviarlo. Al utilizar WhatsApp, el tratamiento por parte de dicho proveedor se rige también por sus propias condiciones y política de privacidad.</p><h3>Conservación y destinatarios</h3><p>Conservaremos los datos durante el tiempo necesario para responder y gestionar la relación, y posteriormente durante los plazos legales aplicables. No vendemos datos. Podrán acceder proveedores necesarios para comunicaciones, alojamiento o soporte bajo sus correspondientes obligaciones, y autoridades cuando exista obligación legal.</p><h2 id="derechos">3. Tus derechos</h2><p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad cuando proceda. Escribe a <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> indicando el derecho que deseas ejercer y aportando la información necesaria para identificar tu solicitud. También puedes reclamar ante la Agencia Española de Protección de Datos.</p><h2 id="contacto-legal">4. Menores y seguridad</h2><p>Los servicios no están dirigidos a menores para la contratación autónoma. Aplicamos medidas razonables para evitar accesos no autorizados, aunque ningún sistema conectado puede garantizar seguridad absoluta.</p></LegalLayout>}

export function CookiesPage(){return <LegalLayout path="/cookies/" title="Política de cookies" intro="Qué almacenamiento utiliza esta web y cómo puedes controlar tus preferencias."><h2 id="identidad">1. Qué son las cookies</h2><p>Las cookies y tecnologías similares permiten que un sitio recuerde información en el navegador. Algunas son necesarias para prestar funciones solicitadas; otras se usan para medición o personalización y requieren consentimiento cuando no están exentas.</p><h2 id="condiciones">2. Qué utiliza esta web</h2><div className="cookie-table"><div><strong>solarcheck-cookie-choice</strong><span>Local storage</span><span>Recuerda si aceptaste solo almacenamiento necesario o todas las categorías.</span><span>Persistente</span></div></div><p>En la versión actual no cargamos Google Analytics, píxeles publicitarios ni cookies de seguimiento de terceros. El botón «Configurar cookies» deja preparada una preferencia de analítica, pero no activa ningún servicio mientras no se integre de forma explícita.</p><h3>Servicios externos</h3><p>Los enlaces a WhatsApp, Google Maps, Instagram u otros sitios no cargan contenido de esos proveedores dentro de la página. Solo contactas con ellos al pulsar el enlace, momento en que pueden aplicar sus propias tecnologías conforme a sus políticas.</p><h2 id="derechos">3. Cómo cambiar tu elección</h2><p>Puedes abrir el panel mediante «Configurar cookies» en el pie de página. También puedes borrar el almacenamiento del sitio desde la configuración de tu navegador.</p><h2 id="contacto-legal">4. Contacto</h2><p>Si tienes dudas sobre esta política, escribe a <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.</p></LegalLayout>}

export function NotFoundPage(){return <><Seo path="/404/" noindex/><section className="not-found"><div className="not-found-orbit"/><div className="shell"><small>ERROR 404</small><strong>4<span>0</span>4</strong><h1>Esta ruta se ha quedado sin señal.</h1><p>La página no existe o ha cambiado de dirección. Puedes volver al inicio o ir directamente a nuestras soluciones.</p><ButtonPair primary="/" primaryLabel="Volver al inicio" secondary="/servicios/" secondaryLabel="Ver servicios"/></div></section></>}
