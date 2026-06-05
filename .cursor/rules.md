# Cursor Rules for landing-site

> **Reglas de agente (Cursor):** disciplina de desarrollo y convenciones de producto están en `.cursor/rules/*.mdc` (`alwaysApply` o por glob). Este archivo es la **referencia de marca y UI** (paleta, tipografía, tono).

Referencia de marca: `docs/syntia_manual-ivc.pdf` (Syntia 2025 — Manual de Identidad Corporativa, v1).

## Stack
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS 4
- Components: React 19 + shadcn/ui (mínimo: button, input, textarea)
- Animaciones: GSAP + ScrollTrigger (hero); framer-motion (scroll, incl. filosofía CLAVE); CSS (floating blobs en hero)
- Contenido: `content/site.ts`

## Estructura

```bash
app/
├── layout.tsx
├── page.tsx
├── proximamente/page.tsx   # WIP / no implementado → errorPages.wip
├── not-found.tsx
├── error.tsx
└── globals.css
components/
├── layout/section-shell.tsx
├── landing/          (header, hero, services, etc.)
├── animations.tsx
└── ui/               (solo componentes usados)
content/
└── site.ts
lib/
└── utils.ts
public/
```

## Identidad de marca (Syntia)

### Esencia
- Asesoría digital: clara, moderna, cercana, sin tecnicismos.
- Claim: **Digitaliza. Innova. Crece.**
- Valores a reflejar en UI y copy: profesionalidad, modernidad, cercanía, innovación accesible.

### Tono de voz (copy en `content/site.ts`)
- Cercano pero profesional; nunca distante ni burocrático.
- Claro, sin jerga técnica innecesaria.
- Inspirador y orientado al crecimiento del cliente.
- Evitar tono de “gestoría tradicional”.

## Tipografía

Fuente oficial del manual. En web cargar con `next/font` (Google Fonts o archivos locales si se aportan).

| Rol | Familia | Pesos | Uso |
| --- | --- | --- | --- |
| Principal | **Host Grotesk** | Regular, Medium, Semibold, Bold | Logotipo, titulares (H1–H3), badges, CTAs, mensajes clave |
| Secundaria | **Archivo** | Light, Regular, Semibold | Párrafos, subtítulos de apoyo, formularios, textos largos |

### Jerarquía (digital)
- **H1 / hero:** Host Grotesk Semibold o Bold; tamaño generoso, `leading-tight`.
- **H2 / sección:** Host Grotesk Semibold.
- **H3 / etiquetas:** Host Grotesk Medium o Semibold; `uppercase tracking-wide` solo en badges/labels.
- **Cuerpo:** Archivo Light o Regular; `leading-relaxed`.
- **Destacados en texto:** Host Grotesk; color acento Verde Syntia.
- No mezclar más de estas dos familias en una misma pieza.

### Implementación
- `layout.tsx`: `Host_Grotesk` + `Archivo` con `weight`, `display: swap`; `archivo.className` en `body`.
- `globals.css` `@layer base`: `body` → Archivo; `h1–h6` → Host Grotesk (`font-family` explícito).
- Utilidades: `badge-on-dark`, `badge-on-light`, `input-on-dark`, `prose-width`.
- No usar Geist ni otras fuentes del template.
- En fondos oscuros: texto secundario `text-muted-on-dark`; acentos e highlights `text-primary` (Verde Syntia). Turquesa solo en degradados o dinamismo secundario.

## Paleta de color

Usar los nombres oficiales del manual. Valores HEX son la referencia en código.

### Primarios
| Nombre | HEX | Uso |
| --- | --- | --- |
| Verde Syntia | `#01DEA2` | Acento identitario: botones primarios, enlaces activos, highlights, iconos destacados. Uso **puntual** (alta intensidad). |
| Verde Noche | `#041D23` | Fondo principal oscuro, texto sobre fondos claros. |
| Blanco Neblina | `#F0F6F6` | Texto sobre fondos oscuros, fondos claros (p. ej. sección contacto). |

### Secundarios
| Nombre | HEX | Uso |
| --- | --- | --- |
| Verde Brisa | `#D6F2E8` | Fondos suaves, bloques informativos, variantes claras. |
| Verde Turquesa | `#2BC0A9` | Degradados, iconos en fondos claros, dinamismo. |
| Verde Agua | `#01635C` | Bordes, fondos intermedios, CTAs secundarios, degradados con Verde Noche. |

### Combinaciones permitidas
- **Fondo + texto (principal):** Verde Noche + Blanco Neblina, o inverso.
- **Variantes:** Verde Brisa o Blanco Neblina con Verde Agua; Verde Agua con Verde Syntia — siempre con contraste legible (WCAG AA mínimo).
- **Acentos / CTA:** Verde Syntia en elementos clave; Verde Agua como acento secundario.
- **Dinamismo:** Brisa, Turquesa y Agua en degradados, cards y segunda/tercera jerarquía — sin saturar la composición.

### Variables CSS (`app/globals.css`)
Tokens por superficie (no invertir `foreground` como fondo):

| Token Tailwind | Uso |
| --- | --- |
| `surface-dark` / `background` | Fondo oscuro (Verde Noche) |
| `on-dark` / `foreground` | Texto en oscuro (Neblina) |
| `surface-light` | Secciones claras |
| `on-light` | Texto en claro (Noche) |
| `muted-on-dark` | Subtítulos en oscuro (AA 4.5:1) |
| `muted-on-light` / `on-light-muted` | Subtítulos en claro |
| `accent-on-light` | Acentos en superficie clara (= Agua) |
| `primary` | Verde Syntia: CTAs, highlights, iconos, enlaces activos |
| `turquesa` | Degradados y acentos secundarios (uso moderado) |

En Tailwind usar tokens semánticos; evitar `bg-foreground` en secciones.

## Lenguaje visual

### Composición
- Layouts ordenados y limpios; formas rectangulares con esquinas ligeramente recortadas/redondeadas (coherente con el isotipo).
- Ancho máximo unificado: `max-w-7xl` vía `SectionShell`.
- Degradados suaves entre Verde Noche, Verde Agua y tonos secundarios en heroes y fondos amplios.
- Textura de ruido sutil opcional en fondos (baja opacidad); no comprometer legibilidad.

### Iconografía
- Estilo **lineal**, esquinas redondeadas, terminaciones rectas.
- En fondos oscuros: Blanco Neblina, Verde Syntia o Verde Turquesa (priorizar Syntia/Turquesa).
- En fondos claros: Verde Noche, Verde Syntia o Verde Turquesa.

### Patrón isotipo
- Isotipo en trazo fino como patrón de fondo; baja opacidad; no competir con el contenido.

### Fotografía
- Personas reales, escenas naturales y luminosas, tonos fríos o neutros.
- Evitar stock corporativo genérico o sobreactuado.

### Logotipo (cuando se integre)
- Versión horizontal como preferente en header/web.
- Respetar área de protección (módulo `x` del manual).
- Mínimos digitales: isotipo ≥35px altura; conjunto horizontal ≥80px altura.
- No deformar, rotar, añadir efectos ni cambiar colores oficiales.

## Funcionalidad no implementada

Cuando una página, enlace del footer, CTA o ruta **existe en la UI pero aún no está lista** (sin contenido real, sin API, sin integración):

- **No usar** `404`, `400` ni `500` para eso (no es error del usuario ni fallo del servidor).
- **Enlazar o redirigir** a la ruta canónica **`/proximamente`** (`content/errors.ts` → `notImplementedPath`, copy en `errorPages.wip`).
- Reutilizar el mismo layout que el resto de pantallas de estado (`components/errors/error-screen.tsx`).
- En la landing, si algo visible no debe navegar aún: badge “Próximamente” o enlace a `/proximamente` en lugar de `href="#"` o rutas vacías.
- Cuando la funcionalidad esté lista: sustituir el enlace por la ruta definitiva y eliminar el apunte a `/proximamente` en ese sitio.

Ejemplo: enlaces legales o redes sociales sin página → `href="/proximamente"`.

## Convenciones de producto
- Teléfono solo en sección contacto, no en header.
- `scroll-behavior: auto` en `html` (requerido por GSAP ScrollTrigger / parallax; no usar `smooth` global).
- Textos centralizados en `content/site.ts`.
- Sección contacto clara: fondo claro (Blanco Neblina) vs. secciones oscuras (Verde Noche).
- Botón primario: fondo Verde Syntia, texto Verde Noche; hover con opacidad, no otro color.

## Comandos
- `pnpm dev` — desarrollo
- `pnpm build` — producción

## Integración leads
- `POST /api/contact` y `POST /api/plan-customize` → webhook n8n (`ODOO_LEAD_WEBHOOK_URL`) → `crm.lead` en Odoo

## Checklist antes de entregar UI
- [x] Tipografías: Host Grotesk (títulos) + Archivo (cuerpo) vía `next/font` + `font-family` en base
- [x] Tokens `surface-light` / `on-light` / `muted-on-dark` (no hacks `bg-foreground`)
- [x] Verde Syntia (`primary`) en CTAs y acentos; turquesa/agua solo en degradados y secundarios
- [x] Contraste AA documentado en comentario de `globals.css`
- [ ] Copy alineado con tono de voz del manual
- [x] Degradados y decoración moderados (legibilidad primero)
