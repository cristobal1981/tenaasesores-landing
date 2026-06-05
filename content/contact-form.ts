export const contactForm = {
  fields: {
    honeypotLabel: "Deja este campo vacío",
    phoneLabel: "Teléfono",
  },
  limits: {
    nameMax: 100,
    phoneMax: 30,
    emailMax: 254,
    messageMin: 12,
    messageMax: 4000,
    minSubmitDelayMs: 2500,
  },
  rateLimit: {
    maxPerIpPerHour: 5,
    maxPerEmailPerHour: 3,
    clientMaxPerWindow: 2,
    clientWindowMs: 30 * 60 * 1000,
  },
  success: {
    title: "Consulta enviada",
    body: "Te contactaremos en menos de 24 horas laborables con una respuesta clara.",
    doneLabel: "Formulario enviado",
  },
  messages: {
    validation: "Revisa los campos marcados e inténtalo de nuevo.",
    phoneRequired: "Indica un teléfono de contacto.",
    phoneInvalid: "Revisa el teléfono. Usa un formato válido, por ejemplo +34 600 000 000.",
    rateLimit:
      "Has enviado varias consultas recientemente. Espera un momento antes de volver a intentarlo.",
    honeypot: "No se ha podido enviar la consulta. Si eres una persona, inténtalo de nuevo.",
    duplicateLead:
      "Ya hay una consulta reciente con este email. Te contactaremos en breve; si es urgente, llámanos por teléfono.",
    webhookForbidden:
      "No hemos podido registrar tu solicitud ahora mismo. Inténtalo en unos minutos o contáctanos por teléfono.",
    genericError: "No se ha podido enviar la consulta. Inténtalo más tarde o llámanos por teléfono.",
    sending: "Enviando…",
  },
} as const
