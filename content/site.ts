export const brand = {
  wordmark: "tenaasesores",
  wordmarkHighlight: "tena",
  wordmarkRest: "asesores",
  logoSrc: "/brand/syntia-isotipo.webp",
} as const

export const site = {
  name: "tenaasesores",
  tagline: "Asesores y Abogados",
  description:
    "Asesoramiento y consultoría empresarial online. Servicios profesionales especializados en empresas digitales: fiscalidad, contabilidad, laboral y constitución de empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.tenaasesores.es",
  location: "Oficina en Los Realejos, Tenerife",
  email: "info@tenaasesores.es",
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
      {
        label: "Soy autónomo",
        href: "/plan-autonomos",
        description:
          "Control fiscal y contable con soporte cercano y precio transparente.",
      },
      {
        label: "Soy empresa",
        href: "/plan-empresas",
        description:
          "Seguimiento continuo, prioridad de respuesta y visión de crecimiento.",
      },
    ],
  },
  { label: "Nosotros", href: "/nosotros" },
  { label: "FAQ", href: "/faq" },
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
    "Asesoría estratégica que convierte datos en crecimiento. Gestionamos obligaciones legales, automatizamos procesos y potenciamos tu negocio. Contabilidad analítica y expertise en Odoo y Holded con la personalización de nuestros profesionales.",
  ctaPrimary: "Solicitar Consulta Gratis",
  ctaSecondary: "Ver Servicios",
  trust: [
    { title: "Acceso 24/7", subtitle: "Tus datos cuando los necesites" },
    { title: "Partners Odoo y Holded", subtitle: "Implementación y supervisión" },
    { title: "Automatización", subtitle: "Menos errores, más tiempo" },
  ],
} as const

export const odoo = {
  badge: "Odoo y Holded · Partners oficiales",
  title: ["Contabilidad descentralizada,", "control profesional de verdad"],
  subtitle:
    "Tú tienes visibilidad y acceso en tiempo real; nosotros nos encargamos de que todo esté bien hecho, revisado y al día con la normativa.",
  partners: {
    odoo: {
      batch: {
        src: "/brand/partners/odoo-batch.webp",
        alt: "Odoo Ready Partner",
        width: 220,
        height: 88,
      },
      text: "Somos partners oficiales de Odoo. Es nuestra base para contabilidad, ERP e integración a medida: implementación, supervisión profesional y visibilidad en tiempo real para tu negocio.",
      verifyLink: {
        href: "https://www.odoo.com/es_ES/accounting-firms/tena-asesores-y-abogados-slp-20287821?country_id=67",
        label: "Compruébalo",
      },
    },
    holded: {
      logo: {
        src: "/brand/partners/holded-white.webp",
        alt: "Holded",
        width: 140,
        height: 36,
      },
      batch: {
        src: "/brand/partners/holded-batch.webp",
        alt: "Holded Asesoría Partner Silver",
        width: 168,
        height: 64,
      },
      text: "También somos partners oficiales de Holded, con certificación Silver. Cuando tu operativa encaja mejor con facturación y gestión ágil, te ofrecemos esta vía complementaria con el mismo equipo que supervisa tu contabilidad.",
      verifyLink: {
        href: "https://www.holded.com/es/directorio-asesorias/tena-asesores-y-abogados-s-l-p",
        label: "Compruébalo",
      },
    },
  },
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
} as const

const autonomosTiers = [
  {
    kind: "fixed",
    name: "Base",
    audience: "Autónomos con operativa estable y necesidades esenciales",
    price: "59",
    period: "mes",
    summary: "Cobertura esencial para tener fiscal y contabilidad al día.",
    responseSla: "Respuesta en 24h laborables",
    ctaLabel: "Quiero empezar",
    highlight: false,
    items: [
      "Contabilidad mensual y cierre básico",
      "Modelos fiscales trimestrales y resumen anual",
      "Soporte por email",
      "1 sesión de revisión mensual",
    ],
  },
  {
    kind: "custom",
    name: "Personalizado",
    audience: "Cuando necesitas más volumen, laboral u Odoo/Holded en el mismo equipo",
    summary:
      "Combinamos contabilidad, fiscal, laboral o tecnología según tu facturación, empleados y herramientas actuales.",
    ctaLabel: "Personalizar tu plan",
    highlight: true,
    items: [
      "Alcance definido contigo, sin paquete rígido",
      "Gestión laboral y nóminas según plantilla",
      "Integración Odoo, Holded u otras herramientas si las usas",
      "Propuesta clara antes de contratar",
    ],
  },
] as const

const empresasTiers = [
  {
    kind: "custom",
    name: "Plan a medida",
    badge: "Personalizado",
    audience: "Cada empresa es distinta — diseñamos el alcance contigo",
    audienceSubtitle: true,
    price: "150",
    pricePrefix: "desde",
    period: "mes",
    summary:
      "Diseñamos contabilidad, fiscal, laboral y tecnología según tu estructura, equipo y ritmo de crecimiento — con un paquete pensado solo para tu empresa.",
    ctaLabel: "Cuéntanos tu caso",
    highlight: true,
    items: [
      "Alcance definido contigo, paquete personalizado y único",
      "Fiscal, contable y laboral según volumen y plantilla",
      "Constitución o cambios societarios si los necesitas",
      "Propuesta clara antes de comprometerte",
    ],
  },
] as const

export const plansByAudience = {
  autonomos: {
    ...plansBase,
    title: ["Plan para autónomos", "que quieren claridad mensual"],
    subtitle:
      "Base con precio claro o plan personalizado — nuestra opción recomendada si tu caso no encaja en un paquete fijo.",
    tiers: autonomosTiers,
    customizeFormAnchor: "personalizar-plan",
    planNote:
      "El plan Base muestra un precio orientativo que puedes acordar con nuestros asesores. El plan personalizado se adapta mejor a tus necesidades.",
  },
  empresas: {
    ...plansBase,
    title: ["Plan para empresas", "con visión de crecimiento"],
    subtitle:
      "Cada empresa es única. Diseñamos contabilidad, fiscal, laboral y tecnología a tu medida, con condiciones claras desde el primer día.",
    tiers: empresasTiers,
    customizeFormAnchor: "personalizar-plan",
    planNote:
      "Los planes para empresas empiezan desde 150 €/mes como referencia orientativa. La propuesta final depende de tu actividad, equipo y alcance.",
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
          "Somos entidad acreditada: formamos a tu equipo en competencias profesionales y en el uso práctico de plataformas como Odoo o Holded.",
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
      title: "Constitución de empresas/Autónomos",
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
        "Registro, informes financieros y supervisión contable con acceso en Odoo/Holded y control profesional.",
    },
    {
      slug: "laboral",
      title: "Gestión laboral",
      description:
        "Nóminas, contratos, altas y bajas, y representación ante la Seguridad Social y la Inspección de Trabajo.",
    },
    {
      slug: "constitucion",
      title: "Constitución de empresas/Autónomos",
      description:
        "Alta de tu negocio con la forma jurídica adecuada y acompañamiento en los primeros meses.",
    },
  ],
} as const

export const team = {
  badge: "Nuestro equipo",
  title: ["Personas reales,", "trato directo."],
  subtitle:
    "Seis profesionales online. Sin call center ni intermediarios: conoces quién lleva tu expediente.",
  members: [
    {
      name: "Cristóbal",
      role: "Socio · Dirección y fiscal",
      photo: "/team/cristobal.avif",
      bio: "Más de quince años asesorando pymes y autónomos. Especialista en planificación fiscal y cumplimiento tributario Estatal y REF.",
    },
    {
      name: "Ariana",
      role: "Área contable y Odoo/Holded",
      photo: "/team/ariana.avif",
      bio: "Supervisa la contabilidad en Odoo y Holded, y los cierres mensuales. Le gusta que los números cuadren y que el cliente los entienda.",
    },
    {
      name: "Irene",
      role: "Área laboral",
      photo: "/team/irene.avif",
      bio: "Gestiona nóminas, contratos y Seguridad Social. Resuelve dudas laborales con claridad y sin tecnicismos innecesarios.",
    },
    {
      name: "David",
      role: "Área contable y Odoo/Holded",
      photo: "/team/david.avif",
      bio: "Lleva la contabilidad al día en Odoo y Holded, y coordina los cierres mensuales. Cree en dejar los números ordenados y explicados, no solo entregados.",
    },
    {
      name: "Jesús",
      role: "Área Laboral",
      photo: "/team/jesus.avif",
      bio: "Cuida nóminas, contratos y trámites con la Seguridad Social. Cuando surge una duda laboral, la resuelve con calma y en lenguaje llano.",
    },
    {
      name: "Guillermo",
      role: "Tecnología y procesos",
      photo: "/team/guillermo.avif",
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
    "Si tu asesoría actual no responde a tiempo, te genera más dudas que soluciones o simplemente no te entiende, quizá es momento de cambiar. Trabajamos con una filosofía",
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
  title: ["Equipo ágil y", "muy comprometido."],
  subtitle:
    "No somos una gran corporación, y eso es precisamente nuestra ventaja: cada cliente tiene acceso directo a profesionales con experiencia, no a un call center. Llevamos años acompañando a pymes, autónomos y empresas digitales con sede en Tenerife y asesoramiento online en fiscal, contable y laboral. Como partners oficiales de Odoo y Holded, combinamos tecnología en tiempo real con supervisión humana y tarifas claras desde el primer día.",
  stats: [
    { end: 150, prefix: "+", suffix: "", label: "Clientes activos" },
    { end: 24, prefix: "", suffix: "h", label: "Respuesta garantizada" },
    { end: 6, prefix: "", suffix: "", label: "Profesionales en equipo" },
    { end: 0, prefix: "", suffix: "", label: "Permanencias" },
  ],
} as const

/** Oculto en home/footer/chatbot hasta activar sección (`testimonialsEnabled = true`). */
export const testimonialsEnabled = false

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
      href: "https://www.linkedin.com/company/tenaasesores",
    },
  ],
} as const

export const logoMarquee = {
  badge: "Empresas con las que trabajamos",
  title: "Confianza de equipos que priorizan orden y claridad",
  slotWidth: 220,
  slotHeight: 60,
  items: [
    {
      name: "Spalopia",
      alt: "Logo de Spalopia",
      src: "/partners/logo-spalopia.webp",
      url: "https://www.spalopia.com/",
      scale: 1,
    },
    {
      name: "Turitop",
      alt: "Logo de Turitop",
      src: "/partners/logo-turitop.webp",
      url: "https://www.turitop.com/",
      scale: 1,
    },
    {
      name: "Bluenewable",
      alt: "Logo de Bluenewable",
      src: "/partners/logo-bluenewable.webp",
      url: "https://bluenewables.com/",
      scale: 1,
      fluidSize: true,
    },
    {
      name: "Youwind",
      alt: "Logo de Youwind",
      src: "/partners/logo-youwind.webp",
      url: "https://youwindrenewables.com/",
      scale: 1,
      fluidSize: true,
    },
    {
      name: "Agnos PCB",
      alt: "Logo de Agnos PCB",
      src: "/partners/logo-agnospcb.webp",
      url: "https://agnospcb.com/",
      scale: 1.4,
    },
    {
      name: "Nubelia",
      alt: "Logo de Nubelia",
      src: "/partners/logo-nubelia.webp",
      url: "https://nubeliacloud.com/",
      scale: 1,
      fluidSize: true,
    },
    {
      name: "Mecainca",
      alt: "Logo de Mecainca",
      src: "/partners/logo-mecainca.webp",
      url: "https://mecainca.com/",
      scale: 1,
    },
  ],
} as const

export const homeStats = {
  items: [
    {
      end: 150,
      prefix: "+",
      suffix: "",
      label: "Clientes activos",
    },
    {
      end: 15,
      prefix: "+",
      suffix: "",
      label: "Años asesorando",
    },
    {
      end: 98,
      prefix: "",
      suffix: "%",
      label: "Satisfacción de clientes",
    },
  ],
} as const

export { faqContact, faqGeneral, faqHref, faqPage, faqSections } from "@/content/faq"
export type { FaqItem, FaqSection } from "@/content/faq"

export const footer = {
  description:
    "Asesoramiento y consultoría empresarial online. Partners oficiales Odoo y Holded: contabilidad en tiempo real, fiscal y laboral para autónomos, pymes y empresas digitales.",
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
    // { label: "Testimonios", href: "/#testimonios" }, // testimonialsEnabled
    { label: "Contacto", href: "/contacto" },
    { label: "FAQ", href: "/faq" },
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
