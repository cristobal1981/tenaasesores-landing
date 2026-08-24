# tenaasesores.es — Debilidades y cambios necesarios

> Auditoría SEO + rendimiento de la web pública. Solo incluye problemas detectados y la tarea concreta para resolverlos.
>
> Actualizado 6 ago 2026 tras audit con la skill `seo-audit` + medición Lighthouse del usuario. Se revisó el estado real de cada punto contra el código actual antes de marcarlo.

## SEO y contenido

- [x] **404 sin redirigir de URLs antiguas indexadas.** Resuelto: `next.config.mjs` ya tiene 301 para `/conoces-el-termino-screen-scraping`, `/la-tributacion-del-crowdfunding` y `/portfolio/:path*` → home.
- [x] **H1 de home mal formado.** Resuelto: `home-hero-band.tsx` separa los clones de medición de ancho fuera del `<h1>` real (con comentario explícito en el código para que no se vuelva a romper), así que el crawler ya no concatena los estados de la palabra rotativa.
- [ ] **Sin sección de blog/contenido.** Sigue pendiente. Es la vía de tráfico orgánico de cola larga más realista para una asesoría (modelo 130, alta autónomo, IGIC trimestral...), pero **decisión explícita: no se aborda por ahora** (6 ago 2026).
- [x] ~~**NAP solo en `/contacto`, no en el footer global.**~~ **Descartado.** No aporta a SEO nacional (24 ago 2026).
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
  - [x] ~~`init()` en `home-three-field.tsx` diferido con `requestIdleCallback`~~. **Superado (24 ago 2026):** el hero cambió de fondo a `HeroAmbient` (sin Three.js) en un commit posterior; `home-three-field.tsx` quedó sin usar y se borró en la limpieza de código muerto de hoy. Ya no aplica diferir su ejecución porque el componente no existe.
  - **747 KiB de JavaScript sin usar → 35 KiB** (un solo archivo flagged: el propio chunk de Three.js, parcialmente cubierto por la traza).

**Cambios aplicados el 6 ago 2026 para atacar el LCP:**

- [x] **`HomeThreeField` (fondo Three.js/WebGL del hero) diferido con `next/dynamic({ ssr:false })`.** Era el principal sospechoso: se importaba de forma síncrona en `home-hero-band.tsx`, así que todo el peso de Three.js iba en el mismo bundle que debía cargar y ejecutarse antes de que la home respondiera, para un fondo puramente decorativo (`aria-hidden`). Verificado en producción: Three.js (~564 KB) ahora es un chunk separado y asíncrono, no bloquea el bundle principal. Verificado visualmente en navegador, sin regresión.
- [x] **`import * as THREE from "three"` cambiado a imports nombrados** en `home-three-field.tsx` (solo las ~20 clases realmente usadas). Correcto como práctica, pero medido en el build: el ahorro de peso es mínimo porque Three.js tree-shakea mal internamente. El punto anterior es el que realmente importa.
- [x] **Lenis (smooth scroll) eliminado por completo.** Guillermo decidió quitarlo tras ver que el coste real no era solo Lenis (~18 KB) sino que `SmoothScrollProvider` cargaba GSAP+ScrollTrigger+Lenis en **todas** las páginas, incluidas las legales que no usan ningún efecto de scroll. Se quitó `lenis` de `package.json`, se limpió `smooth-scroll-provider.tsx` (ya no crea instancia de Lenis, mantiene el refresh de `ScrollTrigger` que sí hace falta) y se borraron `lib/scroll/lenis-instance.ts` y `lib/scroll/scroll-to-element.ts` (resultaron ser código muerto, nada los importaba). GSAP+ScrollTrigger se mantienen intactos: siguen haciendo trabajo real (parallax de fondo en logo marquee/Odoo/filosofía/servicios, contadores animados). Verificado en navegador: scroll nativo, parallax y contadores funcionan igual.
- [x] **Ejecución de `HomeThreeField` diferida con `requestIdleCallback`** (ver arriba).

### Re-medición 24 ago 2026 — build de producción real (`pnpm build` + `pnpm start`, puerto 3002)

Hallazgo clave: `HomeThreeField` (el fondo WebGL de Three.js, ~564 KB) llevaba tiempo sin usarse — el hero ya usa `HeroAmbient` (alternativa sin Three.js) desde algún commit reciente, pero el archivo viejo seguía en el repo sin importar por nadie. Detectado con `knip` y borrado junto con `lib/gsap/use-background-parallax.ts` (también muerto) y las dependencias `three`/`@types/three`. Esto explica que los puntos de abajo, pendientes desde el 6 ago, aparezcan ya resueltos: era Three.js el causante principal.

- [x] **Eliminar solicitudes que bloquean el renderizado (~570 ms).** Resuelto. Medido en prod real: 2 CSS bloqueantes, ~156 ms combinados.
- [x] **Eliminar JavaScript "legacy"/ES5 innecesario (~14 KiB).** Resto mínimo: un chunk de 112 KB con referencia a `core-js` (helper de interop de una dependencia transpilada, no código propio). Ya estaba en la escala de "ruido" original (~14 KiB); no accionable sin tocar dependencias de terceros.
- [x] **Redistribución forzada (forced reflow).** Resuelto. 0 long-animation-frames detectados en producción tras la carga (Long Animation Frame API).
- [x] **Árbol de dependencia de red demasiado largo.** Resuelto. Solo 29 recursos, 385 KB de transferencia total en la home (antes: 747 KiB de JS sin usar solo en el chunk de Three.js).

## Accesibilidad / Navegación agéntica (1/2)

- [ ] **Árbol de accesibilidad mal formado en el botón flotante (widget de chat "Sappo").** Sin abordar. `div.fixed > div.absolute > button.inline-flex > img.absolute` con `alt=""` y `aria-hidden="false"` inconsistentes.
- [ ] Revisar el resto de accesibilidad (94/100) con la pestaña completa del informe.

## UI — pendientes

- [ ] **Demasiada separación entre el título y las cards en `/plan-autonomos` y `/plan-empresas`.** El header (`DarkPageHero`, `padding="spacious"`) deja mucho hueco antes de que arranque `PlansPageClient`. Reducir el espaciado — revisar `padding` de `DarkPageHero` en `components/pages/plans-page.tsx` y el `py-*` superior de la sección de cards.

## Dev server — consumo de RAM/CPU (21 ago 2026)

- [x] **`next-server` (Turbopack) se disparaba a 600%+ CPU y crecía sin límite en RAM (varios GB) hasta morir por OOM-killer.** Causa: caché de `.next/` corrupta/hinchada (333 MB) acumulada por sesiones previas del dev server que quedaron colgadas o se cerraron mal, provocando un bucle de recompilación en los hilos del pool de Turbopack ya desde el arranque, sin necesidad de tráfico. Confirmado con `journalctl -k` (un `next-server` anterior ya había sido matado por el OOM-killer del kernel el mismo día). Solución aplicada: matar los procesos huérfanos, `rm -rf .next` y reiniciar — con caché limpia el CPU decae con normalidad tras el arranque en frío y la RAM se estabiliza (~940 MB).
  - **Si vuelve a pasar:** parar siempre el dev server con `Ctrl+C` limpio (no cerrar la terminal a lo bruto, para que Turbopack cierre bien la caché); si el consumo se dispara, primer paso es `rm -rf .next` y reiniciar.
- [ ] **`tsconfig.tsbuildinfo` está trackeado en git** (debería estar en `.gitignore` — es un artefacto de build de TypeScript que se regenera constantemente). Pendiente: `git rm --cached tsconfig.tsbuildinfo` + añadirlo a `.gitignore`. No hecho aún porque no está confirmado que sea la causa del problema de arriba (parece más bien higiene de repo), a la espera de confirmación de Guillermo.
