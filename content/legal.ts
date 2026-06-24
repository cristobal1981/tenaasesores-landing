import { sappoIntroStorageKey } from "@/content/chatbot"
import { site } from "@/content/site"
import { contactClientStorageKey } from "@/lib/contact/rate-limit"
import { planCustomizeClientStorageKey } from "@/lib/plan-customize/rate-limit"
import { webIssueMailtoStorageKey } from "@/lib/web-issue/build-mailto"

export const legalEntity = {
  tradeName: "Tenaasesores",
  businessName: "Tena Asesores y Abogados, S.L.P",
  nif: "B76647148",
  address:
    "Calle El Toscal, nº 29, 1º pta 7, Los Realejos, Santa Cruz de Tenerife",
  registry:
    "Registro Mercantil de Santa Cruz de Tenerife, Tomo 3345, Libro 0, Folio 102, Hoja TF-54112, Inscripción 1ª",
  email: site.email,
  phone: site.phone.display,
  website: site.url,
  lastUpdated: "2026-06-24",
} as const

export type LegalPageSlug = keyof typeof legalPages

export type LegalSection = {
  id: string
  title: string
  paragraphs: readonly string[]
  listItems?: readonly string[]
}

export type LegalPageContent = {
  title: string
  intro: string
  sections: readonly LegalSection[]
}

export const legalRoutes = {
  "aviso-legal": "/aviso-legal",
  privacidad: "/privacidad",
  cookies: "/cookies",
} as const

export const cookieConsentStorageKey = "cookie-consent" as const

export const cookieRegistry = [
  {
    name: "_va / _vercel_insights",
    type: "Analítica",
    purpose: "Medición agregada de visitas y rendimiento del sitio (Vercel Analytics).",
    duration: "Según política de Vercel",
    provider: "Vercel Inc.",
  },
  {
    name: "_ga",
    type: "Analítica",
    purpose:
      "Distinguir usuarios de forma anónima y calcular estadísticas de visitas (Google Analytics 4).",
    duration: "2 años",
    provider: "Google Ireland Ltd.",
  },
  {
    name: "_gid",
    type: "Analítica",
    purpose:
      "Distinguir usuarios durante la sesión actual para estadísticas de visitas (Google Analytics 4).",
    duration: "24 horas",
    provider: "Google Ireland Ltd.",
  },
  {
    name: cookieConsentStorageKey,
    type: "Técnica",
    purpose: "Recordar tu elección sobre cookies no esenciales.",
    duration: "12 meses",
    provider: site.name,
  },
  {
    name: sappoIntroStorageKey,
    type: "Preferencias (localStorage)",
    purpose: "Evitar mostrar de nuevo la presentación del asistente Sappo.",
    duration: "Persistente hasta que borres datos del sitio",
    provider: site.name,
  },
  {
    name: contactClientStorageKey,
    type: "Técnica (sessionStorage)",
    purpose: "Limitar envíos repetidos del formulario de contacto (solo marcas de tiempo, sin datos personales).",
    duration: "Hasta cerrar la pestaña del navegador",
    provider: site.name,
  },
  {
    name: planCustomizeClientStorageKey,
    type: "Técnica (sessionStorage)",
    purpose: "Limitar envíos repetidos del formulario de plan personalizado (solo marcas de tiempo, sin datos personales).",
    duration: "Hasta cerrar la pestaña del navegador",
    provider: site.name,
  },
  {
    name: webIssueMailtoStorageKey,
    type: "Técnica (localStorage)",
    purpose: "Limitar aperturas repetidas del correo de reporte de incidencias web (solo marcas de tiempo).",
    duration: "Persistente hasta que borres datos del sitio",
    provider: site.name,
  },
] as const

export const legalPages = {
  "aviso-legal": {
    title: "Aviso legal",
    intro:
      "El presente aviso regula el uso del sitio web y la conducta de quienes acceden a él, en cumplimiento de la **Ley 34/2002 (LSSI-CE)**. Las condiciones de los servicios contratados se regirán, además, por los *acuerdos particulares con cada cliente*.",
    sections: [
      {
        id: "titular",
        title: "1. Datos identificativos del titular",
        paragraphs: [
          `**${legalEntity.tradeName}** es un nombre comercial registrado, propiedad de **${legalEntity.businessName}**.`,
          `**NIF/CIF:** ${legalEntity.nif}`,
          `**Domicilio social:** ${legalEntity.address}`,
          `**Inscripción:** ${legalEntity.registry}`,
          `**Correo electrónico:** ${legalEntity.email}`,
          `**Teléfono:** ${legalEntity.phone}`,
          `**Sitio web:** ${legalEntity.website}`,
          "La Compañía cumple con la normativa aplicable, incluida la **Ley 5/2012**, de mediación en asuntos civiles y mercantiles, en lo relativo a la formación de sus profesionales.",
        ],
      },
      {
        id: "objeto",
        title: "2. Objeto del sitio web",
        paragraphs: [
          "Este sitio tiene como finalidad principal ofrecer información sobre los servicios de consultoría legal y empresarial de Tenaasesores, así como facilitar canales de contacto: formulario de contacto, solicitud de plan personalizado y reporte de incidencias técnicas de la web. Las condiciones específicas de los servicios contratados se establecerán en los contratos particulares correspondientes.",
        ],
      },
      {
        id: "condiciones-uso",
        title: "3. Condiciones de uso",
        paragraphs: [
          "Tenaasesores se reserva el derecho de modificar, suspender, eliminar o actualizar la información del sitio sin previo aviso y en cualquier momento. Aunque se realizan esfuerzos por garantizar la exactitud de la información y el correcto funcionamiento del sitio, no se garantiza un acceso continuo ni libre de errores.",
          "El usuario se compromete a:",
        ],
        listItems: [
          "Hacer un uso **diligente y de buena fe** del sitio web, conforme a la normativa vigente.",
          "***Abstenerse*** de alterar el contenido del sitio, distribuir material protegido por derechos de autor o utilizar el sitio para actividades ilícitas.",
          "**Custodiar** las claves de acceso en caso de acceder a áreas restringidas.",
        ],
      },
      {
        id: "propiedad-intelectual",
        title: "4. Propiedad intelectual e industrial",
        paragraphs: [
          "Todos los elementos del sitio web son **propiedad exclusiva** de Tenaasesores o de terceros que han autorizado su uso. *Queda prohibido* su uso con fines comerciales sin autorización expresa.",
          "La marca **Tenaasesores** está registrada en el Registro de Marcas y Patentes de España.",
        ],
      },
      {
        id: "responsabilidad",
        title: "5. Limitación de responsabilidad",
        paragraphs: [
          "El titular no garantiza la ausencia de errores en el acceso al sitio ni en sus contenidos, aunque adoptará medidas razonables para evitarlos y corregirlos.",
          "El titular no se hace responsable de los daños derivados del uso indebido del sitio ni de la información publicada por terceros a través de enlaces externos.",
        ],
      },
      {
        id: "enlaces",
        title: "6. Enlaces externos",
        paragraphs: [
          "El sitio web puede contener enlaces a sitios externos. Tenaasesores no se responsabiliza de los contenidos, veracidad o seguridad de dichos sitios. El acceso a ellos es bajo la exclusiva responsabilidad del usuario.",
        ],
      },
      {
        id: "notificaciones",
        title: "7. Notificaciones y comunicaciones",
        paragraphs: [
          "Las notificaciones dirigidas a los usuarios se realizarán por medios telemáticos. El usuario debe facilitar una dirección de correo electrónico válida a tal efecto.",
        ],
      },
      {
        id: "privacidad",
        title: "8. Protección de datos y cookies",
        paragraphs: [
          "El tratamiento de datos personales se describe en la Política de privacidad. El uso de cookies y tecnologías similares se detalla en la Política de cookies.",
          "El sitio utiliza herramientas de medición web (**Google Analytics 4** y **Vercel Analytics**) sujetas a tu consentimiento, conforme a lo indicado en dichas políticas.",
        ],
        listItems: [
          "Política de privacidad: /privacidad",
          "Política de cookies: /cookies",
        ],
      },
      {
        id: "legislacion",
        title: "9. Legislación aplicable y jurisdicción",
        paragraphs: [
          "Este sitio se rige por la legislación española, en particular:",
        ],
        listItems: [
          "Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
          "Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.",
          "Ley 7/1998, de 13 de abril, sobre Condiciones Generales de la Contratación.",
        ],
      },
      {
        id: "fuero",
        title: "10. Fuero",
        paragraphs: [
          "Para la resolución de conflictos derivados del uso de este sitio, las partes se someten a los **juzgados y tribunales de Santa Cruz de Tenerife**, sin perjuicio de los derechos que asistan a consumidores y usuarios.",
        ],
      },
      {
        id: "idioma",
        title: "11. Idioma",
        paragraphs: [
          "El idioma principal del sitio web es el español. En caso de discrepancias entre una versión en otro idioma y el texto en español, prevalecerá el contenido en español.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    intro:
      "Tenaasesores trata los datos personales en cumplimiento del **Reglamento (UE) 2016/679 (RGPD)** y la **Ley Orgánica 3/2018 (LOPDGDD)**.",
    sections: [
      {
        id: "responsable",
        title: "1. Responsable del tratamiento",
        paragraphs: [
          `**Entidad:** ${legalEntity.businessName}`,
          `**NIF/CIF:** ${legalEntity.nif}`,
          `**Domicilio social:** ${legalEntity.address}`,
          `**Correo de contacto:** ${legalEntity.email}`,
          `**Teléfono:** ${legalEntity.phone}`,
        ],
      },
      {
        id: "datos",
        title: "2. Datos que recogemos",
        paragraphs: [
          "Según el canal que utilices en el sitio, podemos tratar los siguientes datos:",
          "**Formulario de contacto:** nombre, correo electrónico, teléfono (opcional) y contenido del mensaje.",
          "**Plan personalizado:** tipo de perfil (autónomos o empresas), situación laboral o societaria, facturación anual estimada, servicios de interés, descripción de la actividad, residencia fiscal (península o Canarias), datos de contacto (nombre, email, teléfono opcional) y comentarios adicionales.",
          "**Reportar un problema con la web:** la URL de la página, el tipo de incidencia y la descripción. Estos datos no pasan por nuestros servidores: se envían a **tecnico@tenaasesores.es** a través del cliente de correo de tu dispositivo cuando tú confirmas el envío.",
          "**Asistente Sappo:** el asistente funciona en tu navegador; *no enviamos el contenido de tus mensajes a servidores*. Solo guardamos en tu dispositivo una preferencia para no repetir la presentación inicial (ver /cookies).",
          "**Datos técnicos:** dirección IP (para limitar abusos en formularios, sin incluirla en el registro de consultas), cookies y almacenamiento local si aceptas o usas funciones del sitio (ver /cookies).",
          "**Datos de navegación (analítica):** si aceptas las cookies analíticas, podemos recabar información sobre páginas visitadas, tiempo de permanencia, origen del tráfico, tipo de dispositivo y navegador, e interacciones con el sitio mediante **Google Analytics 4** y **Vercel Analytics**.",
        ],
      },
      {
        id: "finalidades",
        title: "3. Finalidades del tratamiento",
        paragraphs: [
          "Los datos personales recabados se utilizan exclusivamente para:",
        ],
        listItems: [
          "Prestar los servicios contratados.",
          "Responder a consultas realizadas a través del formulario de contacto.",
          "Gestionar solicitudes de plan personalizado y preparar propuestas a medida.",
          "Atender incidencias técnicas reportadas por correo electrónico.",
          "Prevenir abusos y envíos automatizados en los formularios del sitio.",
          "Enviar comunicaciones comerciales relacionadas con los servicios de Tenaasesores, cuando exista consentimiento del usuario.",
          "Medir de forma agregada el uso del sitio, si aceptas las cookies analíticas (consulta /cookies).",
        ],
      },
      {
        id: "legitimacion",
        title: "4. Base legal",
        paragraphs: [
          "El tratamiento de consultas y solicitudes de plan se basa en el **interés legítimo** de atender tu petición y en el **consentimiento implícito** al enviar el formulario. La analítica web se basa en tu **consentimiento** a las cookies (consulta /cookies). La relación profesional con clientes se fundamenta además en el **cumplimiento de obligaciones legales** aplicables.",
        ],
      },
      {
        id: "conservacion",
        title: "5. Plazo de conservación",
        paragraphs: [
          "Los datos se conservarán mientras sea necesario para la finalidad para la que se recogieron y, posteriormente, durante los plazos exigidos por la normativa aplicable (por ejemplo, obligaciones mercantiles o fiscales).",
          "Los datos de contacto no convertidos en cliente se suprimirán o anonimizarán cuando dejen de ser necesarios, salvo que solicites su supresión antes.",
        ],
      },
      {
        id: "destinatarios",
        title: "6. Destinatarios y encargados",
        paragraphs: [
          "No cedemos datos a terceros salvo obligación legal o cuando sea necesario para la prestación del servicio (por ejemplo, proveedores de hosting, gestión de clientes o herramientas de analítica).",
          "Los datos enviados a través del formulario de contacto y del plan personalizado se registran en **Odoo CRM** mediante una integración automatizada (webhook), con el fin de gestionar y dar seguimiento a las solicitudes.",
          "Algunos proveedores pueden estar ubicados fuera del Espacio Económico Europeo; en ese caso se aplicarán las garantías previstas en el RGPD (cláusulas contractuales tipo u otras medidas adecuadas).",
        ],
        listItems: [
          "Hosting y despliegue: Vercel Inc.",
          "Gestión de clientes (CRM): Odoo — leads de formulario de contacto y plan personalizado",
          "Analítica: Vercel Analytics (datos agregados de uso)",
          "Analítica: Google Analytics 4 (Google Ireland Ltd.)",
        ],
      },
      {
        id: "google-analytics",
        title: "7. Google Analytics 4",
        paragraphs: [
          "Utilizamos **Google Analytics 4**, un servicio de analítica web prestado por **Google Ireland Ltd.**, con la finalidad de obtener información **estadística** sobre el tráfico y el comportamiento de navegación en el sitio (por ejemplo, páginas visitadas, tiempo en página, origen del tráfico, tipo de dispositivo y navegador, y eventos de interacción).",
          "Google Analytics recoge la dirección IP del usuario, pero **GA4 no almacena la IP completa**: la trunca antes de su tratamiento para dificultar la identificación directa.",
          "Este tratamiento se basa en tu **consentimiento** a las cookies analíticas. Puedes revocarlo en cualquier momento según se indica en /cookies.",
          "Google puede tratar los datos en servidores ubicados fuera del Espacio Económico Europeo, incluidos Estados Unidos. Google declara que aplica las garantías previstas en el RGPD, en particular el **marco de privacidad de datos UE-EE.UU. (EU-U.S. Data Privacy Framework)** y sus **cláusulas contractuales tipo**.",
          "Puedes consultar más información en la política de privacidad de Google: https://policies.google.com/privacy",
        ],
      },
      {
        id: "derechos",
        title: "8. Derechos de las personas interesadas",
        paragraphs: [
          "Puedes ejercer los derechos de **acceso, rectificación, supresión, oposición, limitación y portabilidad** escribiendo a **info@tenaasesores.es**, adjuntando copia de un documento que acredite tu identidad.",
          "Si retiras el consentimiento, *ello no afectará a la licitud del tratamiento* basado en el consentimiento previo a su retirada.",
        ],
      },
      {
        id: "reclamacion",
        title: "9. Reclamación ante la autoridad de control",
        paragraphs: [
          "Tienes derecho a presentar una reclamación ante la **Agencia Española de Protección de Datos (AEPD)** si consideras que el tratamiento no se ajusta a la normativa: https://www.aepd.es",
        ],
      },
      {
        id: "seguridad",
        title: "10. Medidas de seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas apropiadas para proteger los datos personales frente a accesos no autorizados, pérdida o alteración, en función del riesgo del tratamiento.",
        ],
      },
      {
        id: "cookies-ref",
        title: "11. Cookies",
        paragraphs: [
          "Para información detallada sobre cookies y tecnologías similares, consulta nuestra Política de cookies en /cookies.",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    intro:
      "Tenaasesores utiliza cookies para **mejorar la experiencia**, **analizar el uso** del sitio (con tu permiso) y **garantizar la seguridad** de la navegación. Puedes gestionarlas o deshabilitarlas desde la configuración de tu navegador.",
    sections: [
      {
        id: "que-son",
        title: "1. ¿Qué son las cookies?",
        paragraphs: [
          "Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando visitas un sitio web. También usamos almacenamiento local del navegador (**localStorage** y **sessionStorage**) para preferencias técnicas y medidas anti-abuso en formularios. En sessionStorage solo guardamos marcas de tiempo, sin datos personales.",
        ],
      },
      {
        id: "finalidades",
        title: "2. Finalidades",
        paragraphs: ["En este sitio utilizamos cookies y almacenamiento local para:"],
        listItems: [
          "Mejorar la experiencia del usuario.",
          "Analizar el uso del sitio web con fines estadísticos (solo si aceptas las cookies analíticas).",
          "Garantizar la seguridad de la navegación y recordar tu elección de consentimiento.",
        ],
      },
      {
        id: "tipos",
        title: "3. Tipos de cookies que utilizamos",
        paragraphs: [
          "Clasificamos las cookies y tecnologías similares de la siguiente forma:",
        ],
        listItems: [
          "Técnicas o necesarias: imprescindibles para el funcionamiento del sitio y recordar tu elección de consentimiento.",
          "Analíticas: nos permiten medir de forma agregada cómo se utiliza el sitio (**Google Analytics 4** y **Vercel Analytics**).",
          "Preferencias: recuerdan ajustes de la interfaz, como no volver a mostrar la presentación del asistente Sappo.",
        ],
      },
      {
        id: "tabla",
        title: "4. Detalle de cookies y almacenamiento",
        paragraphs: [
          "A continuación se listan las principales cookies y claves de almacenamiento utilizadas:",
        ],
      },
      {
        id: "terceros",
        title: "5. Cookies de terceros",
        paragraphs: [
          "**Google Analytics 4** (Google Ireland Ltd.) puede instalar las cookies **_ga** y **_gid** para estadísticas de visitas cuando aceptas las cookies analíticas. Puedes consultar su política de privacidad en https://policies.google.com/privacy",
          "Vercel Analytics y Speed Insights pueden instalar cookies propias para estadísticas de visitas y rendimiento. Puedes consultar su política de privacidad en el sitio de Vercel.",
          "Algunas imágenes del sitio se cargan desde **Pexels** (images.pexels.com). Tu navegador puede comunicar datos técnicos de la solicitud (por ejemplo, dirección IP) al proveedor de la imagen.",
          "Este sitio no utiliza cookies de publicidad comportamental de terceros en el momento de la última actualización de esta política.",
        ],
      },
      {
        id: "analytics-nota",
        title: "6. Analítica y consentimiento",
        paragraphs: [
          "Utilizamos **Google Consent Mode v2**: por defecto, los parámetros `analytics_storage` y `ad_storage` se configuran en **denied** hasta que indiques tu preferencia en el banner. Si aceptas, se activan las cookies analíticas de **Google Analytics 4** (`_ga`, `_gid`). Si rechazas, Google puede seguir recibiendo señales agregadas sin cookies identificativas.",
          "Las herramientas de **Vercel Analytics** y **Speed Insights** **solo se cargan si aceptas** las cookies analíticas en el banner. Si las rechazas, *no cargamos* esas herramientas de medición.",
          "Tu elección se guarda en el almacenamiento local del navegador. Puedes cambiarla borrando los datos del sitio o eliminando la clave **«cookie-consent»** y recargando la página.",
        ],
      },
      {
        id: "gestion",
        title: "7. Cómo gestionar o revocar el consentimiento",
        paragraphs: [
          "Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que desactivar cookies técnicas puede afectar al funcionamiento del sitio.",
          "Para revocar la elección guardada en este sitio, borra los datos de navegación del dominio o elimina la entrada de consentimiento desde las herramientas de desarrollo del navegador (clave «cookie-consent»).",
        ],
        listItems: [
          "Chrome: Configuración → Privacidad y seguridad → Cookies",
          "Firefox: Opciones → Privacidad y seguridad",
          "Safari: Preferencias → Privacidad",
          "Edge: Configuración → Cookies y permisos del sitio",
        ],
      },
      {
        id: "mas-info",
        title: "8. Más información",
        paragraphs: [
          "Para el tratamiento de datos personales asociado a estas tecnologías, consulta nuestra Política de privacidad en /privacidad.",
        ],
      },
    ],
  },
} as const satisfies Record<string, LegalPageContent>

export const cookieBannerCopy = {
  title: "Cookies en este sitio",
  description:
    "Usamos cookies técnicas y, con tu permiso, cookies analíticas (Google Analytics y Vercel) para mejorar el sitio. Puedes leer más en nuestra política de cookies o de privacidad.",
  acceptLabel: "Aceptar cookies",
  rejectLabel: "Rechazar cookies no esenciales",
  cookiesLinkLabel: "Política de cookies",
  privacyLinkLabel: "Política de privacidad",
  savedMessage: "Preferencia de cookies guardada.",
} as const
