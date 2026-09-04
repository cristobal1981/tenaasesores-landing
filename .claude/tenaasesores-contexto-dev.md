# tenaasesores.es — Debilidades y cambios necesarios

> Auditoría SEO + rendimiento de la web pública. Solo incluye problemas detectados y la tarea concreta para resolverlos.
>
> Actualizado 1 sep 2026 tras audit completo de todo el sitio (no solo `/servicios`) con la skill `seo-audit`. Incluye verificación uno por uno de los pendientes anteriores contra el código actual, más las páginas nuevas desde el 24 ago (mega menu, `/implementacion-odoo`). Metodología: SSR local (`next dev`) de las 14 rutas del sitio, inspección de `<title>`/meta description/canonical/headings/schema en el HTML servido, y lectura de código para los componentes compartidos (header, footer, chat widget).

## UX — mega menu

- [x] **Navitems del mega menu no se marcaban activos al hacer clic ni al hacer scroll.** Resuelto 1 sep 2026. Causa: `isNavActive` en `components/landing/header.tsx` comparaba `pathname` (de `usePathname()`, que nunca incluye el hash) contra hrefs de ancla tipo `/servicios#fiscal` — nunca podía coincidir, ni tras click ni scrolleando. No existía ningún scroll-spy en el header (el que ya había en el repo, `lib/scroll/use-section-scroll-spy.ts`, alimenta el sub-nav de página en FAQ/legal, desconectado del header). Fix: nuevo hook `lib/scroll/use-active-section-hash.ts` (mismo patrón de offset 120px que el hook existente) que Header usa para trackear qué sección de la página actual está a la vista; `isNavActive` ahora separa ruta y hash del href y compara el hash contra ese estado. Verificado en navegador (`/servicios`): el trigger "Servicios" y el item de grid correcto (Gestión fiscal/contable/laboral/Constitución) se resaltan en verde tanto al hacer scroll libre como al hacer click en un item del panel.
- [x] **Item "Inicio" (panel Inicio) e "Implementación de Odoo" (panel Odoo) se quedaban activos para siempre, tapando al resto de items del mismo panel al scrollear.** Resuelto 1 sep 2026 — bug distinto al de arriba, encontrado por Guillermo tras el primer fix. Causa: estos dos son los únicos items de grid sin hash en su href (enlazan a la propia página: `/` e `/implementacion-odoo`), a diferencia del resto de items de sus mismos paneles que sí llevan `#hash`. Con la regla genérica (`pathname === path` sin hash → activo siempre en esa página), quedaban permanentemente resaltados en cuanto estabas en la página, sin importar a qué sección hubieras scrolleado. Por eso solo pasaba en Inicio y Odoo (los únicos paneles con un item "página completa" mezclado con items de ancla) y no en Servicios/Planes/Nosotros. Fix: nueva función `isPanelChildActive` — para items de grid, un href sin hash solo se considera activo cuando `activeHash === ""` (arriba del todo, antes de cruzar cualquier sección trackeada). Verificado en navegador en home (scroll a `#servicios`: "Qué resolvemos" activo, "Inicio" ya no) y en `/implementacion-odoo` (scroll a `#fases`: "Cómo lo implementamos, fase a fase" activo, "Implementación de Odoo" ya no).

## SEO y contenido

- [x] **404 sin redirigir de URLs antiguas indexadas.** Resuelto: `next.config.mjs` ya tiene 301 para `/conoces-el-termino-screen-scraping`, `/la-tributacion-del-crowdfunding` y `/portfolio/:path*` → home.
- [x] **H1 de home mal formado.** Resuelto: `home-hero-band.tsx` separa los clones de medición de ancho fuera del `<h1>` real (con comentario explícito en el código para que no se vuelva a romper), así que el crawler ya no concatena los estados de la palabra rotativa.
- [ ] **Sin sección de blog/contenido.** Sigue pendiente. Es la vía de tráfico orgánico de cola larga más realista para una asesoría (modelo 130, alta autónomo, IGIC trimestral...), pero **decisión explícita: no se aborda por ahora** (6 ago 2026).
- [x] ~~**NAP solo en `/contacto`, no en el footer global.**~~ **Descartado.** No aporta a SEO nacional (24 ago 2026).
- [x] ~~**Cero SEO local pese a tener dirección física.**~~ **Descartado, no es un bug.** Guillermo confirmó que el objetivo es posicionamiento **nacional**, no local — Tenerife es una señal de confianza (oficina física real), no el foco de targeting. Así está implementado a propósito en `organizationSchema()` (`areaServed: España`). No añadir "Tenerife"/"Los Realejos" a title/H1 de home o servicios.
- [x] **Ausencia de terminología fiscal canaria** (IGIC, REF, ZEC) — incorporada en `content/site.ts` (sección "Fiscalidad canaria (IGIC, REF, ZEC)" dentro de `services.mainServices`). Resuelto 1 sep 2026: Guillermo revisó la precisión fiscal y quitó el `TODO`, cambiando "Gestionamos tu IGIC trimestral" por "Gestionamos tus modelos de IGIC" (más preciso, sin comprometerse a una periodicidad concreta). Re-auditado en local (`/servicios`): keyword IGIC se mantiene, jerarquía de headings sigue H1→H2→H3 sin saltos (el H3 sigue siendo "Fiscalidad canaria (IGIC, REF, ZEC)"), sin restos de TODO en el HTML servido, title/meta description/canonical/`Service` schema de `/servicios` intactos. Pendiente de desplegar (cambio aún no commiteado).
- [x] **NAP solo en `/contacto`, no en el footer global.** Resuelto 1 sep 2026 — el footer (`components/landing/footer.tsx:112`) ya usa `legalEntity.address` (dirección completa: "Calle El Toscal, nº 29, 1º pta 7, Los Realejos, Santa Cruz de Tenerife") en vez del texto corto "Los Realejos, Tenerife". Dato ya público en `/aviso-legal` y `/privacidad`, sin exposición nueva. Verificado en HTML servido.
- [x] ~~**Posible hueco de cumplimiento LSSI (colegio profesional/nº de colegiado).**~~ **Descartado** — no aplica, Tenaasesores no tiene abogados en plantilla. Guillermo confirma (1 sep 2026).
  - **Hallazgo real detrás de esto:** `content/legal.ts` conserva restos de cuando sí había abogados — `legalEntity.businessName: "Tena Asesores y Abogados, S.L.P"` (nombre social aún no renombrado) y en `aviso-legal` texto sobre "servicios de consultoría **legal**" y "**Ley 5/2012**, de mediación en asuntos civiles y mercantiles". No tocado: es nombre social/registro mercantil real, cambiarlo requiere trámite legal, no es un fix de código. Pendiente de que Guillermo decida si renombra la sociedad o ajusta el texto del aviso legal para reflejar la actividad actual.

### Nuevos hallazgos on-page (1 sep 2026) — audit completo del sitio

- [x] **`/contacto` no tiene H1.** Resuelto 1 sep 2026: añadido `as="h1"` en `components/landing/contact.tsx:178` (`MarketingSectionHeading` por defecto renderiza `as="h2"`). Verificado en HTML servido: `<h1>Hablemos de tu negocio.</h1>` presente.
- [x] **`/implementacion-odoo`: title y description demasiado largos.** Resuelto 1 sep 2026 en `content/odoo-implementation.ts:36-38` (`odooImplementationMeta`). Title 71→60 car.: "Implementación de Odoo: auditoría y migración | tenaasesores". Description 204→150 car., manteniendo "Partners oficiales de Odoo" dentro del límite visible: "Implementamos Odoo en tu negocio: auditoría, estructura fiscal, migración bancaria, formación del equipo y acompañamiento. Partners oficiales de Odoo." Verificado en HTML servido.
- [x] **Contadores de cifras en 0.** Resuelto — verificado en el HTML servido de home y `/nosotros`: los contadores ahora sirven el valor final estático en el SSR (`+150`, `+15`, `98%`, `24h`, `6`) y solo animan desde 0 vía GSAP en cliente. El único contador con `end: 0` es "Permanencias" (0 permanencias de contrato) — es un dato real, no un bug.
- [x] **Árbol de accesibilidad del botón flotante del chat "Sappo".** Revisado el código actual (`components/chat/site-chat-widget.tsx`): el botón FAB tiene `aria-label` y `aria-expanded`, y el `<Image>` decorativo dentro lleva `alt=""` (ya excluido del árbol de accesibilidad por sí solo, independientemente de `aria-hidden`). Estructuralmente ya no se aprecia el problema descrito el 6 ago. No verificado con un lector de pantalla real ni con el árbol de accesibilidad de Chrome DevTools — si el hallazgo original venía de ahí, confirmarlo en navegador antes de darlo por cerrado del todo.
- [x] **Demasiada separación en `/plan-autonomos` y `/plan-empresas`.** Resuelto — `components/pages/plans-page.tsx:12` ya no pasa `padding="spacious"` a `DarkPageHero`, usa el `padding="default"` (`py-16 md:py-20` en vez de `py-20 md:py-28`). Coincide con el commit `54da83d` ("Rediseña el hero de Nosotros y ajusta espaciado de planes").
- [x] **`tsconfig.tsbuildinfo` trackeado en git.** Resuelto — ya no aparece en `git ls-files` y está en `.gitignore:37` (`*.tsbuildinfo`).
- [x] **Cobertura técnica del sitio completo.** Las 14 rutas responden 200, el sitemap (`app/sitemap.ts`, vía `indexablePaths` en `lib/seo/metadata.ts`) incluye las 11 páginas indexables incluida `/implementacion-odoo` con prioridad 0.9, y `robots.ts` bloquea correctamente `/proximamente`, `/400`, `/reportar-problema` y `/solicitud-alta-autonomo`. Sin páginas huérfanas: todas las rutas indexables tienen al menos un enlace interno desde home. Todas las imágenes (`next/image`) llevan `alt`. `/implementacion-odoo` tiene `breadcrumbSchema`; podría sumar también un `Service` schema propio como tiene `/servicios`, pero es mejora menor, no bloqueante.

### Nuevos hallazgos SEO on-page (6 ago 2026) — todos resueltos hoy

- [x] **Título de `/servicios` demasiado largo** (63 caracteres, se recorta en el SERP). Acortado a "Servicios: fiscal, contable y laboral | tenaasesores" (52 caracteres).
- [x] **Meta descriptions por debajo de 150 caracteres** en home, `/plan-autonomos`, `/plan-empresas`, `/contacto` y `/cookies` — desaprovechaban espacio de SERP. Ampliadas reutilizando datos reales ya existentes en `content/site.ts` (Odoo/Holded, soporte por email, 24h de respuesta, etc.), sin inventar contenido nuevo.
- [x] **Sin `Service` schema en `/servicios`.** Añadida función `servicesSchema()` en `lib/seo/structured-data.ts` (una entidad `Service` por cada línea: fiscal, contable, laboral, constitución) e insertada en `app/(site)/servicios/page.tsx` junto al breadcrumb.
- [x] **Heading-order: `/servicios` saltaba de H1 a H3.** Los 3 ítems de "Nuestro valor diferencial" (Portal de cliente, Cumplimiento digital, Formación) iban justo después del H1 de la página sin H2 intermedio. Cambiados de `<h3>` a `<h2>` en `components/pages/services-page.tsx`.
- [x] **Heading-order: el footer global rompía la jerarquía en casi todas las páginas.** El footer (visible en todo el sitio) tenía `<h4>Síguenos:</h4>`, y casi todas las páginas terminan su contenido en H1/H2 (p. ej. `CtaBrisaBand` es H2) justo antes del footer → salto H1/H2 → H4. Cambiado a `<p>` en `components/landing/footer.tsx`, igual que el resto de etiquetas de navegación del footer (que ya usaban `<summary>`, no headings). Esto arregla el heading-order en **todas** las páginas de una vez, no solo en una.

## Contadores / UI

- [x] ~~**Contadores de cifras en 0.**~~ Resuelto — ver detalle en "Nuevos hallazgos on-page (1 sep 2026)" arriba.

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

- [x] ~~**Árbol de accesibilidad mal formado en el botón flotante (widget de chat "Sappo").**~~ Ya no se aprecia en el código — ver detalle en "Nuevos hallazgos on-page (1 sep 2026)" arriba. Pendiente de confirmación visual en navegador/lector de pantalla.
- [ ] Revisar el resto de accesibilidad (94/100) con la pestaña completa del informe. No re-medido esta sesión (requiere Lighthouse manual).

## UI — pendientes

- [x] ~~**Demasiada separación entre el título y las cards en `/plan-autonomos` y `/plan-empresas`.**~~ Resuelto — ver detalle en "Nuevos hallazgos on-page (1 sep 2026)" arriba.

## Dev server — consumo de RAM/CPU (21 ago 2026)

- [x] **`next-server` (Turbopack) se disparaba a 600%+ CPU y crecía sin límite en RAM (varios GB) hasta morir por OOM-killer.** Causa: caché de `.next/` corrupta/hinchada (333 MB) acumulada por sesiones previas del dev server que quedaron colgadas o se cerraron mal, provocando un bucle de recompilación en los hilos del pool de Turbopack ya desde el arranque, sin necesidad de tráfico. Confirmado con `journalctl -k` (un `next-server` anterior ya había sido matado por el OOM-killer del kernel el mismo día). Solución aplicada: matar los procesos huérfanos, `rm -rf .next` y reiniciar — con caché limpia el CPU decae con normalidad tras el arranque en frío y la RAM se estabiliza (~940 MB).
  - **Si vuelve a pasar:** parar siempre el dev server con `Ctrl+C` limpio (no cerrar la terminal a lo bruto, para que Turbopack cierre bien la caché); si el consumo se dispara, primer paso es `rm -rf .next` y reiniciar.
- [x] ~~**`tsconfig.tsbuildinfo` está trackeado en git.**~~ Resuelto — ver detalle en "Nuevos hallazgos on-page (1 sep 2026)" arriba.
