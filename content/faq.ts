export type FaqItem = {
  question: string
  answer: string
}

export type FaqSection = {
  slug: string
  title: string
  description: string
  items: readonly FaqItem[]
}

export const faqHref = "/faq" as const

export const faqPage = {
  badge: "Preguntas frecuentes",
  title: ["Resolvemos tus dudas", "antes de dar el paso"],
  subtitle:
    "Información clara sobre cómo trabajamos, qué servicios ofrecemos y qué puedes esperar desde la primera consulta.",
  cta: {
    title: "¿No encuentras lo que buscas?",
    subtitle: "Escríbenos y te respondemos en menos de 24 horas laborables.",
    label: "Solicitar consulta gratis",
    href: "/contacto",
  },
  homeTeaser: {
    title: "¿Tienes dudas antes de contactar?",
    subtitle:
      "Consulta las preguntas más habituales sobre servicios, planes, Odoo y la primera consulta.",
    label: "Ver preguntas frecuentes",
    href: faqHref,
  },
} as const

export const faqSections: readonly FaqSection[] = [
  {
    slug: "empezar",
    title: "Empezar",
    description: "Primera consulta, compromiso y tiempos de respuesta.",
    items: [
      {
        question: "¿La primera consulta tiene coste?",
        answer:
          "No. La primera consulta es gratuita y sin compromiso. Nos sirve para entender tu situación y decirte si podemos ayudarte.",
      },
      {
        question: "¿Qué pasa en la primera consulta?",
        answer:
          "Revisamos tu situación actual, tus prioridades y el tipo de ayuda que necesitas. Te explicamos cómo podríamos trabajar juntos y, si encaja, te orientamos sobre el siguiente paso.",
      },
      {
        question: "¿La consulta inicial me obliga a contratar?",
        answer:
          "No. La primera toma de contacto no implica compromiso. Decides con calma si seguimos trabajando juntos.",
      },
      {
        question: "¿En cuánto tiempo respondéis normalmente?",
        answer:
          "Nuestro compromiso es responder en menos de 24 horas laborables, con seguimiento claro de cada caso.",
      },
    ],
  },
  {
    slug: "servicios",
    title: "Servicios",
    description: "Fiscal, contable, laboral y constitución de empresas.",
    items: [
      {
        question: "¿Puedo contratar solo fiscal o solo laboral?",
        answer:
          "Sí. Puedes contratar servicios por separado o en formato integral, según la fase en la que esté tu negocio.",
      },
      {
        question: "¿Qué incluye la gestión integral?",
        answer:
          "Un solo equipo para contabilidad, fiscal, laboral y puesta en marcha. Coordinamos obligaciones, plazos y seguimiento para que no tengas que repartir la gestión entre varios proveedores.",
      },
      {
        question: "¿Trabajáis con empresas digitales y startups?",
        answer:
          "Sí. Nos especializamos en empresas digitales: cumplimiento normativo, contabilidad analítica, automatización de procesos y adaptación a entornos tecnológicos como Odoo o Holded.",
      },
      {
        question: "¿Ofrecéis formación para el equipo?",
        answer:
          "Sí. Como entidad colaboradora con organizaciones acreditadas, te ayudamos a aprovechar los créditos de la Seguridad Social destinados a la capacitación de tus empleados.",
      },
    ],
  },
  {
    slug: "planes",
    title: "Planes",
    description: "Autónomos, empresas y plan personalizado.",
    items: [
      {
        question: "¿Qué plan me conviene si soy autónomo?",
        answer:
          "Depende de tu operativa. El plan Base cubre necesidades esenciales; el Pro añade más soporte; el Premium incluye prioridad y alcance ampliado. En la página de autónomos puedes comparar qué incluye cada uno.",
      },
      {
        question: "¿Y si tengo una empresa o pyme?",
        answer:
          "El plan para empresas incluye seguimiento continuo y prioridad de respuesta. Si estás constituyendo la sociedad, el plan Constitución muestra un precio orientativo que acordamos contigo.",
      },
      {
        question: "¿Hay plan personalizado?",
        answer:
          "Sí. Si ningún plan encaja del todo, puedes solicitar una propuesta a medida desde la página de planes. Revisamos tu caso y te proponemos alcance y condiciones adaptados.",
      },
      {
        question: "¿El precio de constitución de empresa es fijo?",
        answer:
          "Mostramos un precio orientativo que puedes acordar con nuestros asesores según la complejidad del caso. No es un precio cerrado sin revisar tu situación.",
      },
    ],
  },
  {
    slug: "odoo",
    title: "Odoo y digitalización",
    description: "Partners oficiales, migración y control en tiempo real.",
    items: [
      {
        question: "¿Ayudáis con migración y uso de Odoo?",
        answer:
          "Sí. Como partners oficiales de Odoo, cubrimos migración, configuración y supervisión para que lo uses con seguridad.",
      },
      {
        question: "¿Tendré acceso a mi contabilidad en tiempo real?",
        answer:
          "Sí. Con Odoo consultas tu situación contable cuando quieras, desde cualquier dispositivo. Nosotros nos encargamos de que todo esté bien hecho, revisado y al día con la normativa.",
      },
      {
        question: "¿Qué implica arrancar con Odoo?",
        answer:
          "Definimos un paquete fiscal a medida, conectamos tus bancos para importar movimientos y configuramos la captura de facturas (OCR o recepción por email) para centralizar la documentación.",
      },
      {
        question: "¿Trabajáis también con Holded?",
        answer:
          "Sí. Además de Odoo, tenemos experiencia con Holded y otras herramientas de gestión. Te orientamos sobre la opción que mejor encaje con tu negocio.",
      },
    ],
  },
  {
    slug: "equipo",
    title: "Equipo y zona",
    description: "Dónde estamos, horario y trato directo.",
    items: [
      {
        question: "¿Trabajáis solo con empresas en Tenerife?",
        answer:
          "Nuestro equipo está en Tenerife, pero también trabajamos con autónomos y pymes de otras zonas cuando encaja el servicio.",
      },
      {
        question: "¿Con quién hablaré si contrato?",
        answer:
          "Somos un equipo de seis profesionales con trato directo. Conoces a las personas que gestionan tu caso, sin intermediarios ni call center.",
      },
      {
        question: "¿Cuál es vuestro horario de atención?",
        answer:
          "De lunes a viernes, de 9:00 a 15:00. Fuera de ese horario puedes escribirnos y te respondemos en el siguiente día laborable.",
      },
    ],
  },
  {
    slug: "contacto",
    title: "Contacto",
    description: "Formulario, canales y qué esperar al escribirnos.",
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
        question: "¿Qué canal usáis para contactar?",
        answer:
          "Te contactamos por email. Si hace falta, agendamos una llamada de seguimiento para resolver tus dudas y continuar con el proceso.",
      },
      {
        question: "¿Dónde está el formulario de contacto?",
        answer:
          "En la página de contacto puedes enviarnos tu consulta con nombre, email y un mensaje breve. El teléfono es opcional.",
      },
    ],
  },
] as const

/** @deprecated Use faqSections — kept for contact/chatbot compat */
export const faqGeneral = {
  badge: faqPage.badge,
  title: ["Dudas habituales", "antes de empezar"] as const,
  subtitle:
    "Respondemos lo que más nos preguntan para que sepas exactamente cómo trabajamos y qué esperar desde la primera consulta.",
  items: [
    faqSections[0].items[0],
    faqSections[4].items[0],
    faqSections[1].items[0],
    faqSections[0].items[3],
    faqSections[3].items[0],
  ],
} as const

/** @deprecated Use faqSections contact section — kept for contact page compat */
export const faqContact = {
  title: "Preguntas sobre la consulta",
  items: faqSections[5].items.slice(0, 4),
} as const
