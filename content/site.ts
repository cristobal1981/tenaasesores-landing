export const brand = {
  wordmark: "tenaasesores",
  wordmarkHighlight: "tena",
  wordmarkRest: "asesores",
  logoSrc: "/syntia-isotipo.svg",
} as const

export const site = {
  name: "tenaasesores",
  tagline: "Asesores y Abogados",
  description:
    "Asesoramiento y consultoría empresarial en Tenerife. Servicios profesionales especializados en empresas digitales: fiscalidad, contabilidad, laboral y constitución de empresas.",
  url: "https://tenaasesores.es",
  location: "Tenerife, España",
  email: "info@tenaasesores.es",
  /** Incidencias técnicas de la web (reportar-problema); no usar para contacto comercial. */
  technicalEmail: "tecnico@tenaasesores.es",
  phone: {
    display: "+34 922 38 81 92",
    href: "tel:+34922388192",
  },
  hours: {
    weekdays: "9:00 - 15:00",
    weekend: "Cerrado",
  },
} as const

export const navItems = [
  { label: "Servicios", href: "/servicios" },
  {
    label: "Planes",
    children: [
      { label: "Soy autónomo", href: "/plan-autonomos" },
      { label: "Soy empresa", href: "/plan-empresas" },
    ],
  },
  { label: "Nosotros", href: "/nosotros" },
] as const

export const contactHref = "/contacto" as const

export const hero = {
  title: {
    prefix: "Asesoría",
    rotatingWords: ["Innovadora", "Personalizada", "Estratégica"],
    bridgeWord: "",
    secondLine: "",
  },
  subtitle:
    "Impulsamos empresas digitales con asesoría cercana, estratégica y orientada a datos. Gestionamos obligaciones legales y administrativas mientras convertimos información en decisiones de crecimiento. Unimos contabilidad analítica, automatización y acompañamiento experto para que ganes eficiencia y control, con máximo rendimiento en Odoo y Holded.",
  ctaPrimary: "Solicitar Consulta Gratis",
  ctaSecondary: "Ver Servicios",
  trust: [
    { title: "Acceso 24/7", subtitle: "Tus datos cuando los necesites" },
    { title: "Partners Odoo", subtitle: "Implementación y supervisión" },
    { title: "Automatización", subtitle: "Menos errores, más tiempo" },
  ],
} as const

export const odoo = {
  badge: "Odoo · Partners oficiales",
  title: ["Contabilidad descentralizada,", "control profesional de verdad"],
  subtitle:
    "Tú tienes visibilidad y acceso en tiempo real; nosotros nos encargamos de que todo esté bien hecho, revisado y al día con la normativa.",
  benefits: [
    {
      title: "Contabilidad descentralizada",
      description:
        "Consulta tu situación contable cuando quieras, desde cualquier dispositivo.",
    },
    {
      title: "Supervisión profesional",
      description:
        "Controlamos, revisamos y garantizamos el cumplimiento normativo de tu negocio.",
    },
    {
      title: "Automatización de procesos",
      description:
        "Menos tareas manuales, menos errores y más tiempo para lo que importa.",
    },
  ],
  stepsTitle: "Tres pasos para arrancar en Odoo",
  steps: [
    {
      title: "Paquete fiscal a medida",
      description:
        "Definimos plan contable, impuestos y obligaciones desde el primer día.",
    },
    {
      title: "Bancos sincronizados",
      description:
        "Conectamos tus cuentas para importar movimientos y evitar errores manuales.",
    },
    {
      title: "Facturas automáticas",
      description:
        "Captura OCR o recepción por email para centralizar la documentación de proveedores.",
    },
  ],
  cta: "Hablemos de tu migración a Odoo",
} as const

const plansBase = {
  badge: "Planes",
  legalNote:
    "Precios orientativos sin impuestos, solo como referencia inicial. Ajustamos propuesta final tras revisar tu volumen y necesidades reales.",
  ctaLabel: "Hablar con un asesor",
} as const

const sharedPlanTiers = [
  {
    name: "Base",
    audience: "Negocios con operativa estable y necesidades esenciales",
    price: "69",
    period: "mes",
    summary: "Cobertura esencial para tener fiscal y contabilidad al día sin fricción.",
    responseSla: "Respuesta en 48h laborables",
    ctaLabel: "Quiero Empezar",
    highlight: false,
    items: [
      "Contabilidad mensual y cierre básico",
      "Modelos fiscales trimestrales y resumen anual",
      "Soporte por email",
      "1 sesión de revisión mensual",
    ],
  },
  {
    name: "Estándar",
    audience: "Equipos en crecimiento que buscan más control y rapidez",
    price: "129",
    period: "mes",
    summary: "Plan recomendado para ganar contexto operativo y tomar decisiones más seguras.",
    responseSla: "Respuesta en menos de 24h laborables",
    ctaLabel: "Reservar Este Plan",
    highlight: true,
    items: [
      "Todo lo incluido en Base",
      "Gestión laboral hasta 6 nóminas",
      "Panel de seguimiento y alertas de plazos",
      "2 sesiones de revisión al mes",
    ],
  },
  {
    name: "Pro",
    audience: "Empresas con mayor volumen y necesidad de acompañamiento continuo",
    price: "239",
    period: "mes",
    summary: "Acompañamiento integral con canal prioritario y foco estratégico recurrente.",
    responseSla: "Canal prioritario y respuesta en el día",
    ctaLabel: "Pedir Propuesta",
    highlight: false,
    items: [
      "Todo lo incluido en Estándar",
      "Gestión laboral hasta 15 nóminas",
      "Acompañamiento en inspecciones y requerimientos",
      "Comité mensual de seguimiento con acciones",
    ],
  },
] as const

const sharedPlansComparison = {
  title: "Comparativa de planes",
  subtitle: "Visualiza en un vistazo qué cambia entre Base, Estándar y Pro.",
  rows: [
    { feature: "Contabilidad mensual", Base: "Incluida", Estándar: "Incluida", Pro: "Incluida" },
    { feature: "Modelos fiscales", Base: "Trimestral + anual", Estándar: "Trimestral + anual", Pro: "Completa + soporte prioritario" },
    { feature: "Gestión laboral", Base: "No incluida", Estándar: "Hasta 6 nóminas", Pro: "Hasta 15 nóminas" },
    { feature: "Sesiones de revisión", Base: "1 sesión / mes", Estándar: "2 sesiones / mes", Pro: "Comité mensual estratégico" },
    { feature: "Soporte", Base: "Email", Estándar: "Email + seguimiento activo", Pro: "Canal prioritario en el día" },
    { feature: "Alertas y seguimiento", Base: "Básico", Estándar: "Panel + alertas", Pro: "Panel + alertas + plan de acción" },
  ],
} as const

export const plansByAudience = {
  autonomos: {
    ...plansBase,
    title: ["Plan para autónomos", "que quieren claridad mensual"],
    subtitle:
      "Cobertura clara para autónomos y microempresas: control fiscal y contable, soporte cercano y precio transparente.",
    ctaTitle: "¿Eres autónomo y dudas entre opciones?",
    ctaSubtitle:
      "Te orientamos en 20 minutos y te recomendamos el plan que mejor encaja con tu volumen y momento actual.",
    tiers: sharedPlanTiers,
    comparisonTable: sharedPlansComparison,
  },
  empresas: {
    ...plansBase,
    title: ["Plan para empresas", "con visión de crecimiento"],
    subtitle:
      "Acompañamiento integral para empresas que necesitan seguimiento continuo, prioridad de respuesta y más profundidad estratégica.",
    ctaTitle: "¿Necesitas un plan para tu empresa?",
    ctaSubtitle:
      "Revisamos estructura, volumen y equipo para proponerte cobertura realista sin sobrecostes innecesarios.",
    tiers: sharedPlanTiers,
    comparisonTable: sharedPlansComparison,
  },
} as const

export const services = {
  badge: "Nuestros Servicios",
  title: ["Todo lo que necesitas", "en un solo lugar"],
  subtitle:
    "¿Quieres trabajar con Odoo pero no sabes por dónde empezar? Un solo equipo para contabilidad, fiscal, laboral y puesta en marcha.",
  pageIntro: {
    badge: "Servicios",
    title: ["Servicios y", "propuesta de valor"],
    subtitle:
      "Asesoramiento integral: fiscal, contable y laboral con tecnología, cumplimiento normativo y un trato cercano que conoce tu negocio.",
  },
  valueDifferential: {
    badge: "Nuestro valor diferencial",
    title: ["Más que cumplir obligaciones,", "impulsamos tu negocio"],
    items: [
      {
        title: "Cumplimiento digital",
        description:
          "Te adaptamos al entorno digital cumpliendo con todas las normativas exigidas por los organismos públicos. Soluciones personalizadas para que tus procesos, sistemas y documentación estén alineados con los requisitos legales, minimizando riesgos y maximizando la eficiencia.",
      },
      {
        title: "Portal de cliente",
        description:
          "Ponemos a tu disposición un portal de clientes seguro y personalizado. Accede a tu documentación, comparte archivos, realiza consultas y gestiona trámites de forma rápida y eficiente, con acceso en Odoo cuando lo necesites.",
      },
      {
        title: "Formación",
        description:
          "Formación reglada para el desarrollo profesional del personal de tu empresa. Como entidad colaboradora con organizaciones acreditadas, te ayudamos a aprovechar los créditos de la Seguridad Social destinados a la capacitación de tus empleados.",
      },
    ],
  },
  mainServices: [
    {
      slug: "fiscal",
      title: "Gestión fiscal",
      intro:
        "Entendemos que cada negocio es único y que sus necesidades fiscales no son una excepción. Nos especializamos en diseñar estrategias fiscales personalizadas que se adaptan a las características y objetivos de tu empresa.",
      sections: [
        {
          title: "Estrategias fiscales adaptadas",
          description:
            "Estudiamos a fondo la situación financiera y operativa de tu empresa para desarrollar un plan fiscal estratégico que no solo cumpla con las normativas vigentes, sino que también impulse el crecimiento y la rentabilidad de tu negocio.",
        },
        {
          title: "Deducciones fiscales específicas",
          description:
            "Examinamos minuciosamente las posibilidades de deducción aplicables a tu sector y actividad: inversión en I+D+i, formación, adquisición de activos y más. Identificamos y gestionamos cada ventaja fiscal de manera eficiente.",
        },
        {
          title: "Cumplimiento normativo y seguridad",
          description:
            "Nos aseguramos de que todas las estrategias y deducciones aplicadas estén en línea con la normativa vigente, minimizando riesgos y garantizando que tu empresa esté preparada ante cualquier inspección o auditoría.",
        },
      ],
      benefits: [
        "Cumplimiento de obligaciones legales sin sorpresas",
        "Estrategias adaptadas al crecimiento y rentabilidad de tu negocio",
        "Deducciones y ventajas fiscales identificadas y gestionadas",
        "Preparación ante inspecciones y auditorías",
      ],
    },
    {
      slug: "contable",
      title: "Gestión contable",
      intro:
        "Una contabilidad clara y bien gestionada es clave para la estabilidad y el crecimiento de cualquier negocio. Ofrecemos un servicio integral de gestión y control contable para que puedas centrarte en lo que realmente importa: hacer crecer tu empresa.",
      sections: [
        {
          title: "Registro y organización contable",
          description:
            "Registramos y clasificamos todas las operaciones económicas de tu empresa de manera ordenada, cumpliendo con los principios contables y las normativas vigentes. Desde facturas hasta movimientos bancarios, todo queda correctamente registrado.",
        },
        {
          title: "Elaboración de informes financieros",
          description:
            "Preparamos estados financieros claros y precisos — balances, cuentas de resultados y flujos de efectivo — para que siempre tengas una visión completa y actualizada de la situación económica de tu negocio.",
        },
        {
          title: "Supervisión y revisión contable",
          description:
            "Control continuo de la contabilidad para detectar errores, desviaciones o áreas de mejora. Te asesoramos para implementar buenas prácticas que optimicen los resultados.",
        },
        {
          title: "Cumplimiento contable y fiscal",
          description:
            "Tu empresa cumple con todas sus obligaciones legales relacionadas con la contabilidad: presentación de libros contables y plazos con las autoridades tributarias.",
        },
      ],
      benefits: [
        "Ahorro de tiempo y recursos: delega la contabilidad y céntrate en tu actividad principal",
        "Cumplimiento asegurado: actualizados con los cambios normativos para evitar sanciones",
        "Decisiones informadas: informes financieros para tomar decisiones estratégicas",
        "Asesoramiento personalizado adaptado a las características de cada cliente",
      ],
    },
    {
      slug: "laboral",
      title: "Gestión laboral",
      intro:
        "Una correcta gestión laboral es fundamental para garantizar el bienestar de tus empleados y el cumplimiento de las normativas vigentes. Ofrecemos un servicio integral que abarca todos los aspectos de la administración y gestión laboral.",
      sections: [
        {
          title: "Contratos y nóminas",
          description:
            "Redacción, gestión y registro de contratos laborales conforme a la legislación vigente. Elaboración mensual de nóminas, incluyendo retenciones, bonificaciones y demás conceptos.",
        },
        {
          title: "Altas, bajas y modificaciones",
          description:
            "Tramitamos altas, bajas y modificaciones de los trabajadores en la Seguridad Social, asegurándonos de que todo esté correctamente gestionado dentro de los plazos establecidos.",
        },
        {
          title: "Asesoramiento en normativa laboral",
          description:
            "Te mantenemos informado sobre las normativas laborales y te asesoramos en decisiones relacionadas con la gestión de personal: reestructuraciones, bonificaciones o ajustes de plantilla.",
        },
        {
          title: "Relaciones con la administración",
          description:
            "Actuamos como tu representante ante organismos públicos como la Seguridad Social, el SEPE o la Inspección de Trabajo, gestionando trámites y procedimientos.",
        },
      ],
      benefits: [
        "Cumplimiento normativo en obligaciones laborales y de Seguridad Social",
        "Ahorro de tiempo para dedicar más recursos a tu actividad principal",
        "Tranquilidad: evita sanciones y errores administrativos con expertos a tu disposición",
        "Optimización de costes con bonificaciones y ayudas disponibles",
      ],
    },
    {
      slug: "constitucion",
      title: "Constitución de empresas",
      intro:
        "Te ayudamos a dar de alta tu negocio eligiendo la forma jurídica más adecuada, con puesta en marcha fiscal y contable desde el primer día.",
      sections: [
        {
          title: "Elección de forma jurídica",
          description:
            "Te asesoramos entre autónomo, sociedad limitada u otras opciones según tu actividad, socios y proyección de crecimiento.",
        },
        {
          title: "Tramitación de altas y licencias",
          description:
            "Gestionamos los trámites administrativos necesarios para que tu negocio quede operativo con la documentación en regla.",
        },
        {
          title: "Puesta en marcha fiscal y contable",
          description:
            "Configuramos obligaciones tributarias, plan contable y primeros pasos en Odoo para arrancar con el control desde el inicio.",
        },
        {
          title: "Acompañamiento inicial",
          description:
            "Te guiamos en los primeros meses para resolver dudas y consolidar procesos contables, fiscales y laborales.",
        },
      ],
      benefits: [
        "Elección de forma jurídica (autónomo, SL, etc.)",
        "Tramitación de altas y licencias sin complicaciones",
        "Puesta en marcha fiscal y contable desde el primer día",
        "Acompañamiento en los primeros meses",
      ],
    },
  ],
  cta: {
    title: "¿Hablamos de tu situación?",
    subtitle:
      "Cuéntanos tu caso y te orientamos sin compromiso. La primera consulta es gratuita.",
    label: "Solicitar consulta gratuita",
  },
  items: [
    {
      slug: "fiscal",
      title: "Gestión fiscal",
      description:
        "Estrategias fiscales personalizadas, deducciones y cumplimiento normativo para impulsar la rentabilidad de tu empresa.",
    },
    {
      slug: "contable",
      title: "Gestión contable",
      description:
        "Registro, informes financieros y supervisión contable con acceso en Odoo y control profesional.",
    },
    {
      slug: "laboral",
      title: "Gestión laboral",
      description:
        "Nóminas, contratos, altas y bajas, y representación ante la Seguridad Social y la Inspección de Trabajo.",
    },
    {
      slug: "constitucion",
      title: "Constitución de empresas",
      description:
        "Alta de tu negocio con la forma jurídica adecuada y acompañamiento en los primeros meses.",
    },
  ],
} as const

export const team = {
  badge: "Nuestro equipo",
  title: ["Personas reales,", "trato directo."],
  subtitle:
    "Siete profesionales en Tenerife. Sin call center ni intermediarios: conoces quién lleva tu expediente.",
  members: [
    {
      name: "Cristóbal",
      role: "Socio · Dirección y fiscal",
      photo:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Más de quince años asesorando pymes y autónomos. Especialista en planificación fiscal y cumplimiento tributario en Canarias.",
    },
    {
      name: "Ariana",
      role: "Área contable y Odoo",
      photo:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Supervisa la contabilidad en Odoo y los cierres mensuales. Le gusta que los números cuadren y que el cliente los entienda.",
    },
    {
      name: "Irene",
      role: "Área laboral",
      photo:
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Gestiona nóminas, contratos y Seguridad Social. Resuelve dudas laborales con claridad y sin tecnicismos innecesarios.",
    },
    {
      name: "Verónica",
      role: "Área fiscal",
      photo:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Lleva modelos, IVA/IGIC y obligaciones periódicas. Vigila plazos para que no te pillen sorpresas con Hacienda.",
    },
    {
      name: "David",
      role: "Constitución y altas",
      photo:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Acompaña a nuevos negocios desde el primer día: forma jurídica, altas y puesta en marcha contable y fiscal.",
    },
    {
      name: "Jesús",
      role: "Contabilidad y revisión",
      photo:
        "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Revisa asientos, conciliaciones y documentación. Puente entre lo que haces en Odoo y la supervisión del equipo.",
    },
    {
      name: "Guillermo",
      role: "Tecnología y procesos",
      photo:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      bio: "Automatización, integraciones y buenas prácticas en Odoo. Menos tareas manuales, más tiempo para lo importante.",
    },
  ],
  cta: {
    title: "¿Quieres conocernos mejor?",
    subtitle: "La primera consulta es gratuita y sin compromiso.",
    label: "Solicitar consulta gratuita",
  },
} as const

export const philosophy = {
  badge: "Nuestra filosofía",
  title: ["Tu asesoría debería ayudarte,", "no convertirse en un problema más"],
  subtitle:
    "Si tu gestoría actual no responde a tiempo, te genera más dudas que soluciones o simplemente no te entiende, quizá es momento de cambiar. Trabajamos con una filosofía",
  acronym: "CLAVE",
  values: [
    { letter: "C", title: "CERCANÍA", description: "Conocemos tu negocio como si fuera el nuestro. Trato directo y personal." },
    { letter: "L", title: "CLARIDAD", description: "Sin letra pequeña ni sorpresas. Tarifas claras desde el primer día." },
    { letter: "A", title: "AGILIDAD", description: "Respuestas rápidas cuando más las necesitas. Máximo 24 horas." },
    { letter: "V", title: "VALOR", description: "No solo cumplimos, te ayudamos a crecer y optimizar tu negocio." },
    { letter: "E", title: "EXPERIENCIA", description: "Años resolviendo lo que otros complican. Sabemos lo que hacemos." },
  ],
} as const

export const about = {
  badge: "Sobre tenaasesores",
  title: ["Pequeños pero", "muy comprometidos."],
  paragraphs: [
    "No somos una gran corporación, y eso es precisamente nuestra ventaja. Cada cliente tiene acceso directo a profesionales con experiencia, no a un call center. Conocemos tu negocio, tu sector y tus preocupaciones.",
    "Llevamos años ayudando a pymes, autónomos y empresas digitales en Tenerife a gestionar su día a día fiscal, contable y laboral. Como partners oficiales de Odoo, combinamos tecnología en tiempo real con supervisión humana: sin humo, sin promesas vacías.",
  ],
  features: [
    "Atención directa con tu asesor asignado",
    "Respuesta garantizada en menos de 24 horas",
    "Sin permanencias ni letra pequeña",
    "Tarifas claras desde el primer día",
  ],
  stats: [
    { value: "+150", label: "Clientes activos" },
    { value: "98%", label: "Satisfacción" },
    { value: "24h", label: "Tiempo respuesta" },
    { value: "0", label: "Permanencias" },
  ],
} as const

export const testimonials = {
  badge: "Testimonios",
  title: ["Negocios reales.", "Opiniones reales."],
  subtitle:
    "No tenemos cientos de clientes, pero los que tenemos confían en nosotros año tras año.",
  items: [
    {
      name: "María García",
      role: "Autónoma - Diseño Gráfico",
      content:
        "Llevaba años con una gestoría que apenas me contestaba. Desde que cambié a tenaasesores, tengo respuestas el mismo día y cero sorpresas en los impuestos.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Gerente - Taller Mecánico",
      content:
        "Son cercanos y se explican de forma que lo entiendo todo. Mi anterior asesor usaba tecnicismos y nunca sabía cómo iba realmente mi negocio.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      role: "CEO - Tienda Online",
      content:
        "Como pequeña empresa, necesitaba alguien que entendiera mi situación. Me ayudaron a optimizar la fiscalidad y ahora pago lo justo, no de más.",
      rating: 5,
    },
  ],
} as const

export const contact = {
  badge: "Contacto",
  title: ["Hablemos de tu negocio.", "Sin compromiso."],
  subtitle:
    "Cuéntanos tu situación y te contactaremos en menos de 24 horas. La primera consulta es gratuita.",
  formTitle: "Solicita tu consulta gratuita",
  privacyNote: "Al enviar aceptas la política de privacidad",
  socialTitle: "Síguenos en redes",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com",
    },
    {
      label: "X",
      href: "https://x.com",
    },
  ],
} as const

export const logoMarquee = {
  badge: "Empresas con las que trabajamos",
  title: "Confianza de equipos que priorizan orden y claridad",
  /** Ancho/alto del hueco de cada logo en el carrusel (px). */
  slotWidth: 220,
  slotHeight: 60,
  items: [
    {
      name: "Spalopia",
      alt: "Logo de Spalopia",
      src: "/logos/logo-spalopia.svg",
      url: "https://www.spalopia.com/",
      scale: 1,
    },
    {
      name: "Turitop",
      alt: "Logo de Turitop",
      src: "/logos/logo-turitop.svg",
      url: "https://www.turitop.com/",
      scale: 1,
    },
    {
      name: "Bluenewable",
      alt: "Logo de Bluenewable",
      src: "/logos/logo-bluenewable.svg",
      url: "https://bluenewables.com/",
      scale: 1,
    },
    {
      name: "Youwind",
      alt: "Logo de Youwind",
      src: "/logos/logo-youwind.svg",
      url: "https://youwindrenewables.com/",
      scale: 1,
    },
    {
      name: "Agnos PCB",
      alt: "Logo de Agnos PCB",
      src: "/logos/logo-agnospcb.webp",
      url: "https://agnospcb.com/",
      scale: 1.4,
    },
    {
      name: "Nubelia",
      alt: "Logo de Nubelia",
      src: "/logos/logo-nubelia.png",
      url: "https://nubeliacloud.com/",
      scale: 1,
    },
    {
      name: "Mecainca",
      alt: "Logo de Mecainca",
      src: "/logos/logo-mecainca.webp",
      url: "https://mecainca.com/",
      scale: 1,
    },
  ],
} as const

/** Franja de cifras en la home (tras el hero, antes del carrusel de logos). No duplicar about.stats en Nosotros. */
export const homeStats = {
  items: [
    {
      end: 150,
      prefix: "+",
      suffix: "",
      label: "Clientes activos",
    },
    {
      end: 7,
      prefix: "",
      suffix: "",
      label: "Profesionales en equipo",
      sublabel: "Trato directo en Tenerife",
    },
    {
      end: 15,
      prefix: "",
      suffix: "+",
      label: "Años asesorando en Canarias",
    },
    {
      end: 3,
      prefix: "",
      suffix: "",
      label: "Áreas integradas",
      sublabel: "Fiscal, contable y laboral",
    },
  ],
} as const

export const faqGeneral = {
  badge: "Preguntas frecuentes",
  title: ["Dudas habituales", "antes de empezar"],
  subtitle:
    "Respondemos lo que más nos preguntan para que sepas exactamente cómo trabajamos y qué esperar desde la primera consulta.",
  items: [
    {
      question: "¿La primera consulta tiene coste?",
      answer:
        "No. La primera consulta es gratuita y sin compromiso. Nos sirve para entender tu situación y decirte si podemos ayudarte.",
    },
    {
      question: "¿Trabajáis solo con empresas en Tenerife?",
      answer:
        "Nuestro equipo está en Tenerife, pero también trabajamos con autónomos y pymes de otras zonas cuando encaja el servicio.",
    },
    {
      question: "¿Puedo contratar solo fiscal o solo laboral?",
      answer:
        "Sí. Puedes contratar servicios por separado o en formato integral, según la fase en la que esté tu negocio.",
    },
    {
      question: "¿En cuánto tiempo respondéis normalmente?",
      answer:
        "Nuestro compromiso es responder en menos de 24 horas laborables, con seguimiento claro de cada caso.",
    },
    {
      question: "¿Ayudáis con migración y uso de Odoo?",
      answer:
        "Sí. Como partners oficiales de Odoo, cubrimos migración, configuración y supervisión para que lo uses con seguridad.",
    },
  ],
} as const

export const faqContact = {
  title: "Preguntas sobre la consulta",
  items: [
    {
      question: "¿Qué debo contar en el formulario?",
      answer:
        "Con una descripción breve de tu situación actual y el tipo de ayuda que necesitas es suficiente para empezar.",
    },
    {
      question: "¿Cuándo recibiré respuesta?",
      answer:
        "Normalmente en menos de 24 horas laborables. Si la consulta requiere revisión adicional, te avisamos del siguiente paso.",
    },
    {
      question: "¿La consulta inicial me obliga a contratar?",
      answer:
        "No. La primera toma de contacto no implica compromiso. Decides con calma si seguimos trabajando juntos.",
    },
    {
      question: "¿Qué canal usáis para contactar?",
      answer:
        "Te contactamos por teléfono o email según lo que indiques, y si hace falta agendamos una llamada de seguimiento.",
    },
  ],
} as const

export const footer = {
  description:
    "Asesoramiento y consultoría empresarial en Tenerife. Partners oficiales Odoo: contabilidad en tiempo real, fiscal y laboral para autónomos, pymes y empresas digitales.",
  services: [
    { label: "Gestión fiscal", href: "/servicios#fiscal" },
    { label: "Gestión contable", href: "/servicios#contable" },
    { label: "Gestión laboral", href: "/servicios#laboral" },
    { label: "Constitución de empresas", href: "/servicios#constitucion" },
  ],
  company: [
    { label: "Servicios", href: "/servicios" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Soy autónomo", href: "/plan-autonomos" },
    { label: "Soy empresa", href: "/plan-empresas" },
    { label: "Testimonios", href: "/#testimonios" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Aviso legal", href: "/aviso-legal" },
    { label: "Política de privacidad", href: "/privacidad" },
    { label: "Política de cookies", href: "/cookies" },
  ],
} as const

export const images = {
  hero: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920",
  services: "https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1920",
  about: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920",
  contact: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920",
} as const
