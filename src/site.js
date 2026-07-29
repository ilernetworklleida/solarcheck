export const SITE_URL = 'https://solarcheck.proposta.cat';

export const BUSINESS = {
  name: 'Solarcheck Lleida',
  legalName: 'Auto Vidres Lleida, S.L.',
  taxId: 'B25429697',
  phone: '973 28 81 76',
  phoneHref: '+34973288176',
  whatsapp: '34616494155',
  whatsappLabel: '616 494 155',
  email: 'autovidres@gmail.com',
  address: 'C/ Indívil i Mandoni, 3, bajos',
  postalCode: '25003',
  city: 'Lleida',
  hours: 'L–J 8:00–18:00 · V 8:00–15:00',
  maps: 'https://www.google.com/maps/search/?api=1&query=Carrer+Ind%C3%ADvil+i+Mandoni+3+25003+Lleida',
};

export const pages = {
  '/': {
    title: 'Solarcheck Lleida | Tintado de lunas y protección solar',
    description: 'Láminas solares homologadas para vehículos y edificios, y protección PPF en Lleida. Asesoramiento profesional y presupuesto sin compromiso.',
    image: '/images/stock/car-window-detail.jpg',
  },
  '/servicios/': {
    title: 'Servicios de protección solar en Lleida | Solarcheck',
    description: 'Soluciones profesionales para automóvil, edificios y pintura: láminas solares homologadas, control térmico y PPF Clearshield en Lleida.',
    image: '/images/stock/tint-workshop-detail.jpg',
  },
  '/laminas-solares-coche/': {
    title: 'Tintado de lunas homologado en Lleida | Solarcheck',
    description: 'Tintado profesional de lunas traseras en Lleida con láminas Solarcheck homologadas, corte ComputerCut, documentación y garantía.',
    image: '/images/stock/car-window-detail.jpg',
  },
  '/laminas-edificios/': {
    title: 'Láminas solares para edificios en Lleida | Solarcheck',
    description: 'Reduce calor, reflejos y radiación UV en viviendas, oficinas y comercios de Lleida sin sustituir los cristales.',
    image: '/images/stock/architectural-glass.jpg',
  },
  '/clearshield-ppf/': {
    title: 'PPF para coche en Lleida | Protección Clearshield',
    description: 'Protege la pintura de tu coche frente a gravilla, insectos, roces y arañazos con película PPF instalada profesionalmente en Lleida.',
    image: '/images/stock/ppf-finish-detail.jpg',
  },
  '/trabajos/': {
    title: 'Trabajos de tintado de lunas en Lleida | Solarcheck',
    description: 'Galería de instalaciones reales realizadas por Solarcheck Lleida en turismos, SUV, familiares y vehículos profesionales.',
    image: '/images/work-audi-a7.webp',
  },
  '/empresa/': {
    title: 'Centro Solarcheck en Lleida desde 1998 | Empresa',
    description: 'Conoce el centro Solarcheck Lleida, nuestro taller, proceso de trabajo y más de 25 años de experiencia en protección solar.',
    image: '/images/workshop-privacy.webp',
  },
  '/preguntas-frecuentes/': {
    title: 'Preguntas sobre tintado de lunas y PPF | Solarcheck',
    description: 'Resolvemos dudas sobre homologación, ITV, mantenimiento, garantías, láminas para edificios y protección PPF en Lleida.',
    image: '/images/work-mercedes-profile.webp',
  },
  '/contacto/': {
    title: 'Contacto y taller Solarcheck Lleida | Cómo llegar',
    description: 'Visita Solarcheck Lleida en C/ Indívil i Mandoni, 3. Consulta horarios, teléfono, WhatsApp y cómo llegar al taller.',
    image: '/images/detail.jpg',
  },
  '/presupuesto/': {
    title: 'Pedir presupuesto Solarcheck Lleida | Sin compromiso',
    description: 'Solicita presupuesto para tintado de lunas, láminas solares de edificios o protección PPF en Lleida. Respuesta directa por WhatsApp.',
    image: '/images/stock/tint-workshop-detail.jpg',
  },
  '/aviso-legal/': {
    title: 'Aviso legal | Solarcheck Lleida',
    description: 'Información legal y condiciones de uso del sitio web de Solarcheck Lleida, operado por Auto Vidres Lleida, S.L.',
  },
  '/privacidad/': {
    title: 'Política de privacidad | Solarcheck Lleida',
    description: 'Información sobre el tratamiento de datos personales y ejercicio de derechos en Solarcheck Lleida.',
  },
  '/cookies/': {
    title: 'Política de cookies | Solarcheck Lleida',
    description: 'Información y preferencias sobre las cookies utilizadas por el sitio web de Solarcheck Lleida.',
  },
};

export const services = [
  {
    key: 'auto',
    number: '01',
    title: 'Automóvil',
    eyebrow: 'Confort · Privacidad · Protección',
    description: 'Láminas homologadas para las lunas traseras, elegidas e instaladas según tu coche y la forma en que lo utilizas.',
    back: 'Menos acumulación de calor, más privacidad y protección UV para ocupantes e interior. Corte digital sin cuchillas sobre el cristal.',
    href: '/laminas-solares-coche/',
    image: '/images/stock/car-window-detail.jpg',
  },
  {
    key: 'building',
    number: '02',
    title: 'Edificios',
    eyebrow: 'Eficiencia · Bienestar · Seguridad',
    description: 'Control solar para viviendas, oficinas, comercios y grandes superficies acristaladas, sin cambiar las ventanas.',
    back: 'Estudiamos orientación, uso, tipo de vidrio y objetivo para recomendar una solución equilibrada y técnicamente compatible.',
    href: '/laminas-edificios/',
    image: '/images/stock/architectural-glass.jpg',
  },
  {
    key: 'ppf',
    number: '03',
    title: 'Clearshield PPF',
    eyebrow: 'Pintura · Impactos · Valor',
    description: 'Película transparente de protección para las zonas de la carrocería más expuestas a gravilla, roces e insectos.',
    back: 'Elige desde zonas críticas hasta una cobertura integral. La película protege el acabado sin cambiar el color original.',
    href: '/clearshield-ppf/',
    image: '/images/stock/ppf-finish-detail.jpg',
  },
];

export const projects = [
  {src: '/images/work-mercedes-estate.webp', title: 'Mercedes-Benz familiar', type: 'Familiar', note: 'Lámina solar trasera'},
  {src: '/images/work-audi-a7.webp', title: 'Audi A7', type: 'Turismo', note: 'Privacidad y confort'},
  {src: '/images/work-ford-ranger.webp', title: 'Ford Ranger', type: 'Profesional', note: 'Protección para uso intensivo'},
  {src: '/images/work-audi-a3.webp', title: 'Audi A3', type: 'Turismo', note: 'Acabado integrado'},
  {src: '/images/work-bmw-x4.webp', title: 'BMW SUV', type: 'SUV', note: 'Corte ComputerCut'},
  {src: '/images/work-mercedes-coupe.webp', title: 'Mercedes-Benz Coupé', type: 'Turismo', note: 'Estética y protección UV'},
  {src: '/images/unnamed (5).webp', title: 'BMW X3', type: 'SUV', note: 'Lunas posteriores'},
  {src: '/images/unnamed (7).webp', title: 'Škoda familiar', type: 'Familiar', note: 'Confort familiar'},
  {src: '/images/unnamed (11).webp', title: 'Audi A7', type: 'Turismo', note: 'Instalación en taller'},
  {src: '/images/unnamed (13).webp', title: 'Porsche Cayenne', type: 'SUV', note: 'Luneta posterior'},
  {src: '/images/unnamed (14).webp', title: 'BMW X1', type: 'SUV', note: 'Protección solar trasera'},
  {src: '/images/unnamed-15-privacy.webp', title: 'Mercedes-Benz familiar', type: 'Familiar', note: 'Transición legal delante/detrás'},
];

export const faqs = [
  {category: 'automovil', q: '¿Se pueden tintar las ventanillas delanteras en España?', a: 'Con carácter general, no. La normativa excluye el parabrisas, las ventanillas laterales delanteras y cualquier vidrio dentro del arco de visión directa de 180° del conductor. En turismos instalamos las láminas en lunas laterales traseras y luneta posterior, salvo supuestos excepcionales legalmente autorizados.'},
  {category: 'automovil', q: '¿Las láminas pasan la ITV?', a: 'Sí, cuando son láminas certificadas, se instalan en los vidrios permitidos y conservas la documentación entregada por el centro. También deben mantenerse sin burbujas, desprendimientos o deterioro.'},
  {category: 'automovil', q: '¿Cuánto tarda el tintado de lunas?', a: 'La mayoría de turismos se terminan en el mismo día. El tiempo exacto depende del modelo, número de cristales y complejidad de la instalación; te lo confirmamos al reservar.'},
  {category: 'automovil', q: '¿Hay que desmontar puertas o cortar sobre el cristal?', a: 'Trabajamos con patrones ComputerCut específicos para cada modelo. El corte digital reduce la manipulación y evita utilizar cuchillas directamente sobre el vidrio.'},
  {category: 'automovil', q: '¿Qué tono debería elegir?', a: 'Depende de la privacidad, la estética, la visibilidad nocturna y la protección térmica que busques. No siempre la lámina más oscura es la que más calor rechaza: la tecnología también importa.'},
  {category: 'edificios', q: '¿Hay que cambiar las ventanas?', a: 'No. La lámina se aplica sobre el vidrio existente después de comprobar su tipo y compatibilidad. Es una intervención limpia, rápida y sin obra pesada.'},
  {category: 'edificios', q: '¿Sirve para cualquier tipo de cristal?', a: 'No todas las láminas son compatibles con todos los vidrios. Antes de presupuestar revisamos composición, orientación, sombras, dimensiones y riesgo térmico para seleccionar la solución correcta.'},
  {category: 'edificios', q: '¿Las láminas oscurecen mucho el interior?', a: 'Existen acabados muy distintos, incluidos productos de alta transmisión luminosa. Elegimos el equilibrio entre luz natural, apariencia, privacidad y control solar que necesita el espacio.'},
  {category: 'ppf', q: '¿Qué zonas conviene proteger con PPF?', a: 'Las zonas de mayor impacto suelen ser frontal, capó, aletas, retrovisores, taloneras y bordes de carga. Puedes proteger puntos concretos, el frontal completo o toda la carrocería.'},
  {category: 'ppf', q: '¿El PPF cambia el color del coche?', a: 'La película transparente está pensada para conservar el aspecto original. El resultado final depende del estado previo de la pintura y del acabado elegido, por eso revisamos el vehículo antes de instalar.'},
  {category: 'general', q: '¿Puedo pedir presupuesto sin compromiso?', a: 'Sí. Para automóvil necesitamos marca, modelo y año; para edificios, fotos, medidas aproximadas y orientación; para PPF, modelo y zonas que deseas proteger.'},
  {category: 'general', q: '¿Ofrecéis garantía?', a: 'La cobertura depende de la gama y del uso. Te entregamos la documentación aplicable y explicamos por escrito cuidados, alcance y condiciones antes de confirmar el trabajo.'},
];

export const normalizePath = (value = '/') => {
  const clean = value.split('?')[0].split('#')[0];
  if (clean === '/') return '/';
  return `/${clean.replace(/^\/+|\/+$/g, '')}/`;
};
