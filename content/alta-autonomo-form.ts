export const altaAutonomoYesNoOptions = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
] as const

export const altaAutonomoFormContent = {
  sectionId: "solicitud-alta-autonomo-form",
  pathPrefix: "/solicitud-alta-autonomo",
  minAnnualIncomeEur: 10000,
  fields: {
    honeypotLabel: "Deja este campo vacio",
    nombre: "Nombre",
    apellidos: "Apellidos",
    nif: "NIF/NIE",
    telefono: "Teléfono",
    email: "Email",
    certificado_digital: "¿Tienes certificado digital o Cl@ve permanente?",
    ya_eres_autonomo: "¿Ya eres autónomo?",
    fecha_alta: "Fecha de alta",
    fecha_dar_alta: "Fecha prevista de alta",
    fuiste_autonomo_3_anos: "¿Has sido autónomo en los últimos 3 años?",
    fecha_baja: "Fecha de baja",
    fecha_empezar_con_nosotros: "¿Cuándo quieres empezar con nosotros?",
    direccion: "Dirección donde realizarás la actividad",
    ciudad: "Ciudad",
    provincia: "Provincia",
    codigo_postal: "Código postal",
    pais: "País",
    actividad: "Actividad",
    ingresos_anuales: "Ingresos anuales estimados",
    iban: "IBAN (ES)",
    comentarios: "Comentarios (opcional)",
    privacidad: "Acepto la política de privacidad",
  },
  placeholders: {
    nombre: "María",
    apellidos: "García López",
    nif: "12345678Z o X1234567L",
    telefono: "+34 600 000 000",
    email: "tu@email.com",
    direccion: "Calle, numero, piso...",
    ciudad: "Tu ciudad",
    codigo_postal: "38001",
    pais: "España",
    actividad: "Describe tu actividad principal",
    ingresos_anuales: "10000",
    iban: "ES00 0000 0000 0000 0000 0000",
    comentarios: "Cuentanos cualquier detalle adicional",
  },
  hero: {
    eyebrow: "Solicitud alta autonomo",
    title: "Activa tu alta de autonomo con soporte completo",
    subtitle:
      "Revisamos tu caso y tramitamos el alta con un proceso claro. Completa este formulario y te guiaremos en cada paso.",
  },
  panel: {
    title: "Información importante",
    infoItems: [
      "Necesitamos tus datos fiscales y bancarios para validar la documentación antes de tramitar.",
      "Si ya eres autónomo, revisamos tu situación actual antes de cambiar de asesoría.",
      "Si no eres autónomo, definimos contigo la fecha de alta y revisamos posibles bonificaciones.",
      "El mínimo de ingresos estimados para este circuito es de 10.000 € al año.",
    ],
    faqNotice: "Antes de enviar, puedes revisar las dudas frecuentes justo debajo.",
  },
  actions: {
    submit: "Enviar solicitud",
    sending: "Enviando...",
  },
  success: {
    title: "Solicitud enviada",
    body: "Hemos recibido tu solicitud de alta. Te contactaremos en menos de 24 horas laborables.",
    doneLabel: "Formulario enviado",
  },
  messages: {
    validation: "Revisa los campos marcados y vuelve a intentarlo.",
    honeypot: "No hemos podido enviar la solicitud. Inténtalo de nuevo.",
    genericError: "No hemos podido enviar la solicitud en este momento. Inténtalo de nuevo en unos minutos.",
    forbidden: "No podemos procesar esta solicitud desde este origen.",
    tokenInvalid: "El enlace no es válido o ha caducado.",
  },
  submitErrors: {
    invalid:
      "Este enlace ya no está disponible. Pide a tu asesor un enlace nuevo para enviar el formulario.",
    expired:
      "Este enlace ha caducado. Pide a tu asesor un enlace actualizado para completar la solicitud.",
    used: "Este formulario ya se envió con este enlace. Si necesitas cambiar algo, contacta con tu asesor.",
    revoked:
      "Este enlace ya no está activo. Usa el enlace más reciente que te haya enviado tu asesor.",
    rateLimited:
      "Estamos recibiendo muchas solicitudes. Espera unos minutos y vuelve a intentarlo.",
    unavailable:
      "No hemos podido completar el envío ahora mismo. Inténtalo de nuevo en unos minutos.",
  },
  accessErrors: {
    invalid: {
      variant: "link",
      title: "Este enlace no está disponible",
      body: "El enlace que has abierto no es válido, ha caducado o ya no está activo.",
      hint: "Si necesitas completar el formulario, pide a tu asesor en Tena Asesores que te genere un enlace nuevo.",
    },
    expired: {
      variant: "link",
      title: "Este enlace ha caducado",
      body: "Por seguridad, los enlaces del formulario de alta tienen una validez limitada y este ya no se puede usar.",
      hint: "Contacta con tu asesor para recibir un enlace actualizado.",
    },
    used: {
      variant: "link",
      title: "Este formulario ya se envió",
      body: "Este enlace ya se utilizó para enviar la solicitud de alta. No es posible volver a usarlo.",
      hint: "Si necesitas corregir algún dato, escribe a tu asesor para que te ayude.",
    },
    revoked: {
      variant: "link",
      title: "Este enlace ya no está activo",
      body: "Se ha generado un enlace más reciente o este acceso ha sido revocado.",
      hint: "Revisa tu correo o pide a tu asesor el último enlace disponible.",
    },
    unavailable: {
      variant: "service",
      title: "No podemos validar el enlace ahora mismo",
      body: "Ha habido un problema temporal al conectar con el servicio. Espera unos minutos y vuelve a abrir el enlace.",
      hint: "Si el problema continúa, contacta con tu asesor en Tena Asesores.",
    },
  },
  validation: {
    nombre: "Indica tu nombre.",
    apellidos: "Indica tus apellidos.",
    nif: "Indica un NIF o NIE válido.",
    telefono: "Indica un teléfono móvil válido de España (+34).",
    email: "Indica un email válido.",
    certificado_digital: "Indica si tienes certificado digital.",
    ya_eres_autonomo: "Indica si ya eres autónomo.",
    fecha_alta: "Indica la fecha de alta actual.",
    fecha_dar_alta: "Indica cuándo quieres darte de alta.",
    fuiste_autonomo_3_anos: "Indica si has sido autónomo en los últimos 3 años.",
    fecha_baja: "Indica la fecha de baja.",
    fecha_empezar_con_nosotros: "Indica cuándo quieres empezar con nosotros.",
    direccion: "Indica tu dirección.",
    ciudad: "Indica tu ciudad.",
    provincia: "Selecciona una provincia válida.",
    codigo_postal: "Indica un código postal válido de 5 dígitos.",
    pais: "Indica el país.",
    actividad: "Describe tu actividad.",
    ingresos_anuales: "Los ingresos anuales deben ser de al menos 10.000 €.",
    iban: "Indica un IBAN español válido (ES).",
    comentarios: "El comentario es demasiado largo.",
    privacidad: "Debes aceptar la política de privacidad.",
  },
  faqSection: {
    title: "Preguntas frecuentes sobre el alta",
    description: "Resolvemos las dudas mas habituales antes de iniciar el tramite.",
    items: [
      {
        question: "¿Cuánto tardáis en revisar la solicitud?",
        answer:
          "Normalmente revisamos la solicitud en menos de 24 horas laborables y te indicamos el siguiente paso.",
      },
      {
        question: "¿Puedo completar la solicitud sin certificado digital?",
        answer:
          "Sí. Puedes solicitar el alta igualmente, y te indicaremos la opción de firma que mejor encaje en tu caso.",
      },
      {
        question: "¿Qué pasa si fui autónomo recientemente?",
        answer:
          "Te pedimos la fecha de baja para revisar posibles implicaciones en cuotas y bonificaciones antes de tramitar el alta.",
      },
      {
        question: "¿Para qué os pedimos el IBAN?",
        answer:
          "Lo usamos para preparar correctamente la documentación y evitar errores durante la tramitación con la administración.",
      },
    ],
  },
  limits: {
    minSubmitDelayMs: 2500,
    nombreMax: 80,
    apellidosMax: 120,
    nifMax: 16,
    telefonoMax: 20,
    emailMax: 254,
    direccionMax: 180,
    ciudadMax: 100,
    codigoPostalLength: 5,
    paisMax: 60,
    actividadMin: 8,
    actividadMax: 600,
    ingresosAnualesDigitsMax: 12,
    ibanMax: 34,
    comentariosMax: 1200,
    tokenMax: 256,
  },
} as const

export type AltaAutonomoYesNoValue = (typeof altaAutonomoYesNoOptions)[number]["value"]
