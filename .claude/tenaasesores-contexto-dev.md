# tenaasesores.es — Debilidades y cambios necesarios

> Auditoría SEO + rendimiento de la web pública. Solo incluye problemas detectados y la tarea concreta para resolverlos.
>
> Actualizado 6 ago 2026 tras audit con la skill `seo-audit` + medición Lighthouse del usuario. Se revisó el estado real de cada punto contra el código actual antes de marcarlo.

## SEO y contenido

- [x] **404 sin redirigir de URLs antiguas indexadas.** Resuelto: `next.config.mjs` ya tiene 301 para `/conoces-el-termino-screen-scraping`, `/la-tributacion-del-crowdfunding` y `/portfolio/:path*` → home.
- [x] **H1 de home mal formado.** Resuelto: `home-hero-band.tsx` separa los clones de medición de ancho fuera del `<h1>` real (con comentario explícito en el código para que no se vuelva a romper), así que el crawler ya no concatena los estados de la palabra rotativa.
- [ ] **Sin sección de blog/contenido.** Sigue pendiente. Es la vía de tráfico orgánico de cola larga más realista para una asesoría (modelo 130, alta autónomo, IGIC trimestral...), pero **decisión explícita: no se aborda por ahora** (6 ago 2026).
- [x] ~~**Cero SEO local pese a tener dirección física.**~~ **Descartado, no es un bug.** Guillermo confirmó que el objetivo es posicionamiento **nacional**, no local — Tenerife es una señal de confianza (oficina física real), no el foco de targeting. Así está implementado a propósito en `organizationSchema()` (`areaServed: España`). No añadir "Tenerife"/"Los Realejos" a title/H1 de home o servicios.
- [ ] **Ausencia de terminología fiscal canaria** (IGIC, REF, ZEC) — ya incorporada en `content/site.ts` (sección "Fiscalidad canaria (IGIC, REF, ZEC)" dentro de `services.mainServices`), pero tiene un `TODO(Guillermo)` pidiendo revisión de precisión fiscal antes de publicar y ya está en producción. Guillermo se encarga de la revisión más adelante.
- [ ] **NAP solo en `/contacto`, no en el footer global.** Sigue pendiente — el footer tiene teléfono y ubicación (`components/landing/footer.tsx`) pero no la dirección postal completa. Valorar añadirla y marcado adicional si en algún momento se reconsiderara SEO local (hoy no aplica, ver punto anterior).
- [ ] **Posible hueco de cumplimiento LSSI.** Sigue pendiente — revisar con quien lleve el cumplimiento legal del despacho si faltan datos de colegio profesional/nº de colegiado.

### Nuevos hallazgos SEO on-page (6 ago 2026) — todos resueltos hoy

- [x] **Título de `/servicios` demasiado largo** (63 caracteres, se recorta en el SERP). Acortado a "Servicios: fiscal, contable y laboral | tenaasesores" (52 caracteres).
- [x] **Meta descriptions por debajo de 150 caracteres** en home, `/plan-autonomos`, `/plan-empresas`, `/contacto` y `/cookies` — desaprovechaban espacio de SERP. Ampliadas reutilizando datos reales ya existentes en `content/site.ts` (Odoo/Holded, soporte por email, 24h de respuesta, etc.), sin inventar contenido nuevo.
- [x] **Sin `Service` schema en `/servicios`.** Añadida función `servicesSchema()` en `lib/seo/structured-data.ts` (una entidad `Service` por cada línea: fiscal, contable, laboral, constitución) e insertada en `app/(site)/servicios/page.tsx` junto al breadcrumb.
- [x] **Heading-order: `/servicios` saltaba de H1 a H3.** Los 3 ítems de "Nuestro valor diferencial" (Portal de cliente, Cumplimiento digital, Formación) iban justo después del H1 de la página sin H2 intermedio. Cambiados de `<h3>` a `<h2>` en `components/pages/services-page.tsx`.
- [x] **Heading-order: el footer global rompía la jerarquía en casi todas las páginas.** El footer (visible en todo el sitio) tenía `<h4>Síguenos:</h4>`, y casi todas las páginas terminan su contenido en H1/H2 (p. ej. `CtaBrisaBand` es H2) justo antes del footer → salto H1/H2 → H4. Cambiado a `<p>` en `components/landing/footer.tsx`, igual que el resto de etiquetas de navegación del footer (que ya usaban `<summary>`, no headings). Esto arregla el heading-order en **todas** las páginas de una vez, no solo en una.

## Contadores / UI

- [ ] **Contadores de cifras en 0.** Sigue pendiente — no se ha tocado en esta sesión. En home y `/nosotros`, todos los contadores (clientes, años, satisfacción, profesionales en equipo) se renderizan como "+0"/"0%" antes de animar. Verificar en navegador real y sin JS; asegurar valores estáticos de fallback en el HTML servido.

## Rendimiento

**Medición inicial (PageSpeed Insights, 5 ago 2026) — histórico, ver medición actualizada abajo**

| | Móvil | Ordenador |
|---|---|---|
| Rendimiento | 82 | 97 |
| Accesibilidad | 94 | 94 |
| Prácticas recomendadas | 100 | 100 |
| SEO | 100 | 100 |
| Navegación agéntica | 1/2 | 1/2 |

- FCP: 0,9 s / LCP: 4,7 s (deficiente) / TBT: 10 ms / CLS: 0 / Speed Index: 3,6 s

**Medición actualizada (Lighthouse, Guillermo, 6 ago 2026) — el problema es mucho más grave de lo que indicaba la medición del 5 ago**

- [x] **LCP móvil: 12,1 s → 5,4 s (Lighthouse, build de Vercel preview, 6 ago 2026), tras los 3 cambios de abajo.** Importante matiz encontrado al leer el informe completo: Lighthouse reporta dos LCP distintos que no siempre coinciden — el que puntúa (5,4s, simulado con el modelo "Lantern") y el desglose real de la traza observada (`lcp-breakdown-insight`): **TTFB 60ms + render delay 839ms ≈ 900ms real**. El elemento LCP no es el `<h1>`, es el párrafo del subtítulo (`p[data-hero="subtitle"]`). La cifra simulada es conocida por ser inestable en páginas con mucho JS cliente — probablemente explica por qué salió mejor "sin razón clara" entre dos medidas.
  - **Hallazgo real (no simulado) que seguía vivo:** el chunk de Three.js (`0y2j6tp13kmom.js`, confirmado byte a byte contra el build local) seguía siendo el script individual más caro — 1,6s de scripting de los 3,7s totales de "Script Evaluation" — con sus long tasks más pesadas (491ms + 104ms) cayendo muy tarde (5,3-5,9s), penalizando Total Blocking Time (520ms) e Interactive (5,8s). Diferir la *descarga* (ya hecho) no evita que su *ejecución* siga siendo pesada y caiga en mitad de la ventana de carga.
  - **Decisión tomada:** mantener la animación WebGL del isotipo (no volver al `HeroAmbient` de main, que existe sin usar en el repo y es la alternativa cero-Three.js) y en su lugar diferir también la *ejecución*, no solo la carga.
  - [x] **`init()` en `home-three-field.tsx` diferido con `requestIdleCallback`** (timeout 2000ms, fallback `setTimeout` 200ms en navegadores sin soporte, p. ej. Safari). Así el parseo de SVG y el setup de WebGL solo ocurren cuando el navegador tiene hueco libre, en vez de justo al montar. Verificado visualmente: el fondo sigue apareciendo igual, solo con el arranque retrasado. **Pendiente: re-medir con Lighthouse para cuantificar el efecto real en TBT/Interactive.**
  - **747 KiB de JavaScript sin usar → 35 KiB** (un solo archivo flagged: el propio chunk de Three.js, parcialmente cubierto por la traza).

**Cambios aplicados el 6 ago 2026 para atacar el LCP:**

- [x] **`HomeThreeField` (fondo Three.js/WebGL del hero) diferido con `next/dynamic({ ssr:false })`.** Era el principal sospechoso: se importaba de forma síncrona en `home-hero-band.tsx`, así que todo el peso de Three.js iba en el mismo bundle que debía cargar y ejecutarse antes de que la home respondiera, para un fondo puramente decorativo (`aria-hidden`). Verificado en producción: Three.js (~564 KB) ahora es un chunk separado y asíncrono, no bloquea el bundle principal. Verificado visualmente en navegador, sin regresión.
- [x] **`import * as THREE from "three"` cambiado a imports nombrados** en `home-three-field.tsx` (solo las ~20 clases realmente usadas). Correcto como práctica, pero medido en el build: el ahorro de peso es mínimo porque Three.js tree-shakea mal internamente. El punto anterior es el que realmente importa.
- [x] **Lenis (smooth scroll) eliminado por completo.** Guillermo decidió quitarlo tras ver que el coste real no era solo Lenis (~18 KB) sino que `SmoothScrollProvider` cargaba GSAP+ScrollTrigger+Lenis en **todas** las páginas, incluidas las legales que no usan ningún efecto de scroll. Se quitó `lenis` de `package.json`, se limpió `smooth-scroll-provider.tsx` (ya no crea instancia de Lenis, mantiene el refresh de `ScrollTrigger` que sí hace falta) y se borraron `lib/scroll/lenis-instance.ts` y `lib/scroll/scroll-to-element.ts` (resultaron ser código muerto, nada los importaba). GSAP+ScrollTrigger se mantienen intactos: siguen haciendo trabajo real (parallax de fondo en logo marquee/Odoo/filosofía/servicios, contadores animados). Verificado en navegador: scroll nativo, parallax y contadores funcionan igual.
- [x] **Ejecución de `HomeThreeField` diferida con `requestIdleCallback`** (ver arriba).

- [ ] Eliminar solicitudes que bloquean el renderizado (~570 ms) — sin abordar.
- [ ] Eliminar JavaScript "legacy"/ES5 innecesario (~14 KiB) — sin abordar.
- [ ] Redistribución forzada (forced reflow) — sin abordar; sospechoso habitual: lecturas de `offsetWidth`/`getBoundingClientRect` justo antes de mutar estilos (revisar contadores animados y el hero, que ya hace medición de ancho de palabras rotativas en `home-hero-band.tsx`).
- [ ] Árbol de dependencia de red demasiado largo — sin abordar.

## Accesibilidad / Navegación agéntica (1/2)

- [ ] **Árbol de accesibilidad mal formado en el botón flotante (widget de chat "Sappo").** Sin abordar. `div.fixed > div.absolute > button.inline-flex > img.absolute` con `alt=""` y `aria-hidden="false"` inconsistentes.
- [ ] Revisar el resto de accesibilidad (94/100) con la pestaña completa del informe.
