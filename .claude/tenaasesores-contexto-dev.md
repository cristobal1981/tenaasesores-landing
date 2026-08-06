# tenaasesores.es — Debilidades y cambios necesarios

> Auditoría SEO + rendimiento de la web pública. Solo incluye problemas detectados y la tarea concreta para resolverlos.

## SEO y contenido

- [ ] **404 sin redirigir de URLs antiguas indexadas.** `site:tenaasesores.es` muestra páginas de un WordPress previo (`/conoces-el-termino-screen-scraping/`, `/la-tributacion-del-crowdfunding/`, `/portfolio/paris-example/`, contenido de 2015-2020) que hoy devuelven 404 real, sin redirección 301. Mapear URLs antiguas conocidas y redirigir (301) a la página nueva más relevante o a un futuro blog; luego solicitar reindexación en Search Console.
- [ ] **Sin sección de blog/contenido.** No existe en el sitio actual, y es la principal vía de tráfico orgánico de cola larga para una asesoría (modelo 130, alta autónomo, IGIC trimestral...). Valorar reintroducir blog o hub de contenido.
- [ ] **Cero SEO local pese a tener dirección física.** "Tenerife" no aparece en title/meta/H1 de home, servicios ni contacto; solo una mención suelta en el cuerpo de `/nosotros`. Buscando "asesoría fiscal contable online autónomos Tenerife" el sitio no aparece; sí 8 competidores directos, todos con Tenerife/municipio en el title. Añadir "Tenerife" / "Los Realejos" / "Canarias" a title, meta y H1 de home y servicios.
- [ ] **Ausencia de terminología fiscal canaria** (IGIC, REF, ZEC), que todos los competidores usan como diferenciador explícito. Incorporar estos términos donde aplique en `/servicios` y contenido futuro.
- [ ] **NAP solo en `/contacto`, no en el footer global.** Añadir teléfono/dirección al footer de todas las páginas y valorar marcado `schema.org/LocalBusiness`.
- [ ] **Posible hueco de cumplimiento LSSI.** La razón social "Tena Asesores y Abogados SLP" sugiere sociedad profesional con abogados colegiados; no se detectan datos de colegio profesional/nº de colegiado en el sitio. Revisar con quien lleve el cumplimiento legal del despacho.
- [ ] **H1 de home mal formado.** Se extrae como `AsesoríaInnovadoraInnovadoraPersonalizadaEstratégica` — componente de palabras rotativas que vuelca todos los estados en el DOM sin separación. Revisar accesibilidad (lectores de pantalla) y semántica para crawlers.

## Contadores / UI

- [ ] **Contadores de cifras en 0.** En home y `/nosotros`, todos los contadores (clientes, años, satisfacción, profesionales en equipo, horas de respuesta) se renderizan como "+0"/"0%", incluso "0 Profesionales en equipo" con 6 personas listadas debajo. Verificar en navegador real y sin JS. Asegurar valores estáticos de fallback en el HTML servido, no solo animación dependiente de JS/scroll.

## Rendimiento (PageSpeed Insights, 5 ago 2026)

**Resumen de puntuaciones**

| | Móvil | Ordenador |
|---|---|---|
| Rendimiento | 82 | 97 |
| Accesibilidad | 94 | 94 |
| Prácticas recomendadas | 100 | 100 |
| SEO | 100 | 100 |
| Navegación agéntica | 1/2 | 1/2 |

Desktop va bien. El problema es específicamente **móvil**.

**Métricas móvil**
- FCP: 0,9 s (bien)
- **LCP: 4,7 s — deficiente** (umbral "bueno" de Google: <2,5 s). Es la métrica que más penaliza el 82.
- TBT: 10 ms (bien)
- CLS: 0 (perfecto)
- Speed Index: 3,6 s (mejorable)

**Tareas de rendimiento**
- [ ] **Reducir LCP en móvil (4,7 s → objetivo <2,5 s).** Es la prioridad nº1. Revisar el "Desglose de LCP" en el propio informe para identificar el elemento exacto (probablemente la imagen o el bloque de texto del hero) y priorizar su carga (preload, evitar que dependa de JS para pintarse).
- [ ] **Eliminar solicitudes que bloquean el renderizado** — ahorro estimado 570 ms. Cargar CSS crítico inline / diferir el resto, y usar `defer`/`async` en scripts no críticos.
- [ ] **Reducir JavaScript no usado** — ahorro estimado 137 KiB. Revisar imports de librerías grandes cargadas enteras cuando solo se usa una parte; code splitting por ruta.
- [ ] **Eliminar JavaScript "antiguo" (legacy)** — ahorro estimado 14 KiB. Revisar el `browserslist`/target de compilación: probablemente se está transpilando a ES5 innecesariamente para navegadores modernos.
- [ ] **Redistribución forzada (forced reflow)** — señalado en rojo. Revisar JS que lee y escribe layout en el mismo ciclo (típico causante: leer `offsetWidth`/`getBoundingClientRect` justo antes de mutar estilos, p. ej. en los contadores animados o el hero).
- [ ] **Árbol de dependencia de red demasiado largo** — señalado en rojo, contribuye al LCP alto. Acortar la cadena de recursos críticos (evitar que la imagen/fuente del hero dependa de varios saltos de CSS/JS antes de empezar a descargarse).

## Accesibilidad / Navegación agéntica (1/2)

- [ ] **Árbol de accesibilidad mal formado en el botón flotante (widget de chat "Sappo").** Auditoría fallida: `div.fixed > div.absolute > button.inline-flex > img.absolute` tiene `alt=""` pero `aria-hidden="false"` — combinación inconsistente. Si el icono es puramente decorativo dentro de un botón ya etiquetado, marcarlo `aria-hidden="true"`; si aporta información, darle un `alt` descriptivo. Afecta tanto a accesibilidad (94/100) como a la nueva categoría "Navegación agéntica", pensada para que agentes de IA puedan interactuar con la página.
- [ ] Revisar el resto de accesibilidad (94/100 implica alguna auditoría más además de la del widget) ejecutando la pestaña completa de Accesibilidad del informe.
