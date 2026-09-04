# Auditoría SEO — Google Search Console (últimos 12 meses)

**Fecha de la auditoría:** 2026-09-04
**Sitio:** www.tenaasesores.es
**Periodo solicitado:** últimos 12 meses (export GSC)
**Periodo con datos reales:** 16 jun – 1 sep 2026 (el sitio se relanzó en Next.js el 26 de mayo de 2026; GSC no tiene actividad relevante antes del 16 de junio)
**Artifact publicado (versión visual completa):** https://claude.ai/code/artifact/3c0f6389-c42f-4587-bc75-cbc6c52d370e

## Resumen ejecutivo

- **60 clics / 888 impresiones** en ~11 semanas de datos reales. CTR global 6,76%. Posición media ponderada 20,2.
- **~97% de los clics son de marca** ("tena asesores" y variantes). De las ~100 consultas del export, solo 3 generaron algún clic — todas de marca.
- Las consultas con intención comercial real (fiscalidad autónomos, contabilidad, ubicación) tienen impresiones pero posición 40-95: invisibles en la práctica. No es un problema de indexación, es ausencia de contenido dedicado a esas búsquedas.
- **La posición media empeora cada mes** desde el relanzamiento: 9,4 (16-30 jun) → 20,8 (jul) → 26,7 (ago). Tres periodos consecutivos de deterioro, no ruido puntual.

## Hallazgos

| Severidad | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|
| Crítico | Cero cobertura de contenido para las búsquedas con intención real | "apoyo contable y fiscal para pymes" (26 impr., pos. 67), "asesoramiento contable preciso tenerife" (8 impr., pos. 56,6), "contable los realejos" (4 impr., pos. 41) sin página dedicada | Crear páginas específicas por intención (ver plan de acción) |
| Alto | El diferencial fiscal canario (IGIC/REF/ZEC) está enterrado en un párrafo de `/servicios#fiscal` | Ningún title/H1/meta menciona Canarias, IGIC o ZEC | Página propia de fiscalidad canaria |
| Alto | Posición media empeorando mes a mes desde el relanzamiento | 9,4 → 20,8 → 26,7 | Vigilancia mensual + contenido/enlaces antes de que se consolide la caída |
| Medio | GSC todavía reporta URLs del sitio Odoo anterior (`/about-us`, `/contactus`, `/appointment`...) | Los redirects 308 ya funcionan en vivo (verificado); es indexación previa sin consolidar | Validar URLs canónicas en Search Console |
| Nota | El schema `FAQPage` no generará resultados enriquecidos | Google restringió los rich results de FAQ en agosto 2023 a dominios gubernamentales/salud | Mantener el schema (ayuda al entendimiento semántico) sin esperar CTR extra |
| Nota | Móvil rinde mucho mejor que escritorio | Móvil: pos. 6,11, CTR 7,76%. Escritorio: pos. 28,22, CTR 6,22% | Ninguna acción; preservar como fortaleza |

## Consultas con más impresiones (0 clics, oportunidad intacta)

| Consulta | Impr. | Posición |
|---|---|---|
| apoyo contable y fiscal para pymes | 26 | 67,2 |
| asesoramiento contable preciso tenerife | 8 | 56,6 |
| contable los realejos | 4 | 41,0 |
| contabilidad mensual para autónomos | 3 | 55,7 |
| contable tenerife | 1 | 56,0 |
| asesoria contable tenerife | 1 | 59,0 |
| planes de contabilidad | 2 | 67,5 |

## Páginas con más impresiones

| Página | Clics | Impr. | Posición |
|---|---|---|---|
| / (https) | 42 | 582 | 22,6 |
| / (http, URL heredada) | 7 | 348 | 5,2 |
| /nosotros | 6 | 169 | 4,8 |
| /contacto | 4 | 167 | 8,7 |
| /servicios | 1 | 119 | 3,7 |
| /plan-empresas | 0 | 98 | 21,8 |
| /faq | 0 | 69 | 5,9 |
| /plan-autonomos | 0 | 29 | 9,7 |

## Plan de acción — páginas nuevas propuestas

**1. `/asesoria-contable-tenerife`** — cubre el clúster geográfico ("contable tenerife", "contable los realejos"...). Zona de cobertura real (Los Realejos, Puerto de la Cruz, La Orotava + resto de España en remoto), NAP visible en texto (no solo en schema), teaser de equipo, CTA a `/contacto`. Enlazada desde el panel "Nosotros" del nav (sustituye el ancla `#oficina`), footer y `/servicios`.

**2. `/fiscalidad-canaria`** — cubre IGIC/REF/ZEC (hoy solo un párrafo en `/servicios#fiscal`). Bloques: IGIC (modelos, periodicidad), REF (implicaciones), ZEC (requisitos). CTA dual a `/plan-autonomos` / `/plan-empresas`. Enlazada desde el panel "Servicios" del nav, `/servicios#fiscal`, `/plan-empresas` y `/plan-autonomos`.

**3. Refuerzo de contenido (sin página nueva)** en `/servicios#contable` y `/plan-autonomos` con la fraseología literal de "apoyo contable y fiscal para pymes" / "contabilidad mensual para autónomos" (hoy el copy es más abstracto).

Cambios técnicos que implica: añadir ambas rutas a `indexablePaths` en `lib/seo/metadata.ts`, `pageMetadata()` propio por página, `breadcrumbSchema()` (ya existe, solo usarlo).

Se descartó forzar "Tenerife"/"Canarias" en el title y H1 del **home**: el posicionamiento de marca es deliberadamente nacional ("sede en Tenerife, alcance nacional"). La señal geográfica vive en la página local nueva, no en la página que compite a nivel nacional.

**Estado — ya implementado (fuera de esta auditoría, sesión del mismo día):**
- Schema `ProfessionalService` ampliado con `geo`, `image` y `priceRange` (`lib/seo/structured-data.ts`).
- Enlaces "ver en Maps" del footer y `/nosotros` apuntan a la ficha real de Google Business en vez de a una búsqueda genérica por dirección.
- Pendiente: las dos páginas nuevas (`/asesoria-contable-tenerife`, `/fiscalidad-canaria`) y la validación de URLs canónicas en Search Console.

## Metodología

Análisis de los 7 CSV exportados de Google Search Console (filtro: búsqueda web, últimos 12 meses, generado 2026-09-04) cruzado con el código fuente del repositorio (`vercel.json`, `lib/seo/metadata.ts`, `lib/seo/structured-data.ts`) y verificación en vivo de cabeceras HTTP.
