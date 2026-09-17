# Blog + News en tenaasesores.landing — evaluación de CMS

> Conversación de evaluación (15 sep 2026) sobre cómo añadir un blog y una sección de noticias legales a la landing, de forma que alguien no técnico pueda mantener el contenido sin tocar código ni hacer deploy. Documento de decisión/contexto, todavía sin implementar.

## Objetivo

- Dos secciones de contenido dentro de la propia landing (mismas rutas, mismo deploy que hoy):
  - **`/blog`**: contenido evergreen orientado a SEO/tráfico (guías, cómo hacer un trámite, comparativas).
  - **`/news`**: contenido legal (cambios de IGIC, nuevas ayudas para autónomos, plazos de modelos, novedades fiscal/laboral/mercantil) — no es una newsletter de email, es una segunda sección de posts con formato distinto.
- Debe poder mantenerlo una persona **no técnica**: sin git, sin deploys, sin tocar código.
- Encaja con el plan de la empresa de migrar todo lo externo (incluidos otros proyectos como Syntia) a un servidor interno propio cuando esté listo → se prioriza self-hosted sobre SaaS.

## Opciones descartadas

- **Substack**: no es una integración real con la landing. El contenido vive y se sirve desde la plataforma de Substack (aunque se use un subdominio tipo `blog.tudominio.com`); como mucho se podría traer un listado vía RSS, no un CMS headless de verdad. Descartado por no vivir "dentro" de la landing.
- **Ghost**: combina blog + newsletter de email en un único producto, pero es un stack/servicio completo aparte (su propia app, su propia base de datos, su propio dominio/rutas) que hay que desplegar y mantener por separado. No es lo que se busca — se quiere algo integrado en el propio Next.js, no un servicio adicional.
- **listmonk**: se descartó en cuanto se aclaró que "newsletter" no significaba envío de emails/difusión, sino la sección `/news` de contenido legal. No hace falta infraestructura de envío de correo para esto.

## Decisión: CMS headless embebido — Payload CMS

**Qué es:** Payload CMS es un CMS headless open source, TypeScript-first, pensado para integrarse directamente dentro de una app Next.js (desde su v3). No es un servicio aparte: se instala como una dependencia más del proyecto, y el panel de admin (`/admin`) es otra ruta dentro de la misma app y el mismo deploy. Requiere una base de datos (Postgres) donde guarda el contenido. Self-hosted por naturaleza.

**Diferencia con WordPress:** en WordPress hay un único concepto de "Post" flexible y se añaden tipos de contenido instalando plugins (ACF, custom post types); el theme decide el renderizado. En Payload, los tipos de contenido ("Collections") se definen en código (config TypeScript) — cada colección tiene sus propios campos, y el admin genera un formulario distinto por colección automáticamente. El renderizado de `/blog` y `/news` lo seguimos controlando nosotros en el propio código Next.js (Payload solo sirve los datos vía su API), no hay sistema de "temas".

**Base de datos:** Payload necesita Postgres por debajo. Si en algún momento se usa Supabase, encajaría como ese Postgres (Supabase = Postgres alojado + extras) — pero Supabase por sí solo (su Table Editor) **no sustituye** al CMS: es una herramienta de infraestructura para desarrolladores (edición de filas tipo hoja de cálculo), no un editor pensado para que una persona no técnica escriba contenido (sin editor de texto enriquecido, sin gestión de medios, sin flujo borrador/publicado).

## CMS vs. editor visual / page builder

Son conceptos distintos:

- **CMS** (Payload): gestiona entradas de contenido con estructura fija definida de antemano en código — rellenar un formulario dentro de una plantilla ya diseñada. Sirve para "añadir un post nuevo" o "editar el texto de una página existente", no para cambiar el layout.
- **Page builder** (Webflow, Elementor, Builder.io): deja componer visualmente el layout de una página arrastrando/soltando bloques, redimensionando, etc. Mucho más grande de construir y mantener.

**Decisión:** no se necesita un builder. Con Payload alcanza para todo lo hablado:

1. **Posts (`/blog`, `/news`)** → dos Collections distintas (`BlogPosts`, `NewsItems`), cada una con sus propios campos.
2. **Editar contenido de páginas estáticas ya existentes** (`/plan-autonomos`, `/fiscalidad-canaria`, `/asesoria-contable-tenerife`, etc., hoy hardcodeadas en `content/*.ts`) → cada página pasa a ser un **Global** de Payload (documento único, no repetido) con campos que mapean los textos actuales. El layout/componentes React no cambian, solo cambia de dónde sale el texto (de `content/x.ts` a la API de Payload). El trabajo es mapear, página por página, qué textos se convierten en campos editables.
3. Si algún día hiciera falta más flexibilidad de layout dentro de una página (añadir/quitar/reordenar secciones), existe un punto intermedio sin llegar a un builder completo: el campo tipo **"Blocks"** de Payload — se predefine un catálogo de componentes (Hero, Testimonios, CTA...) y la persona no técnica puede añadir/quitar/reordenar esos bloques y rellenarlos desde una lista en el admin, con **Live Preview** (panel de vista previa en tiempo real). No evaluado en profundidad todavía porque no hace falta para el alcance actual (blog + news + edición de páginas existentes).

## Propuesta de campos (borrador, pendiente de afinar)

- **`BlogPosts`**: título, cuerpo (rich text), imagen destacada, tags, meta SEO, autor.
- **`NewsItems`**: título, resumen, cuerpo, categoría (fiscal / laboral / mercantil / subvenciones), fecha de publicación, **fecha de entrada en vigor de la norma** (distinta de la fecha de publicación).

## Pendiente / próximos pasos

- [ ] Definir campos concretos de `BlogPosts` y `NewsItems`.
- [ ] Decidir alcance de "edición de páginas existentes" vía Globals: ¿todas las páginas de `content/*.ts` o solo algunas?
- [ ] Decidir base de datos (Postgres propio vs. Supabase) y dónde se aloja mientras no exista el servidor interno.
- [ ] Evaluar si se necesita el campo "Blocks" (composición de secciones) o basta con Globals de campos fijos.
