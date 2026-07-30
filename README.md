# Solarcheck Lleida

Web multipágina de captación para Solarcheck Lleida, especializada en láminas solares para vehículos y edificios, y protección de pintura Clearshield PPF.

## Arquitectura

- Inicio y visión general de servicios
- Hub de servicios y recomendador interactivo
- Láminas solares para coche
- Láminas solares para edificios
- Clearshield PPF
- Trabajos realizados con filtros y galería
- Empresa y proceso de instalación
- Preguntas frecuentes
- Contacto y solicitud de presupuesto guiada
- Aviso legal, privacidad y cookies

Las rutas se generan como entradas HTML independientes durante el build, con título, descripción, canonical, Open Graph y datos estructurados propios.

## Desarrollo

```bash
npm install
npm run dev
```

## Validación

```bash
npm run build
npm run check              # rutas, títulos y enlaces
npm run audit:contrast     # contraste WCAG AA de todo el texto (con `npm run preview` levantado)
```

El build genera `dist/`, el sitemap y 13 rutas estáticas. Las fotografías externas y sus
licencias están documentadas en `STOCK-LICENSES.md`.

## Producción

| | |
|---|---|
| Dominio | https://solarcheck.proposta.cat |
| Ruta remota | `/home/u862342697/domains/proposta.cat/public_html/solarcheck/` |
| Rama | `main` |
| Deploy | `bash ~/.claude/bin/deploy-auto.sh <ruta-proyecto>` |

El deploy va por **rsync a Hostinger**, no por GitHub Pages: el DNS de
`solarcheck.proposta.cat` es un ALIAS al CDN de Hostinger, así que `npm run deploy`
(gh-pages) no publica nada visible. Usa `deploy-auto.sh`, que hace backup remoto, ejecuta
`deploy.sh` y verifica que las 13 rutas responden 200.

`deploy.sh` sube con `rsync --delete`, así que la carpeta remota queda idéntica a `dist/`.
Es intencionado: el 30-07-2026 una subida sin `--delete` dejó conviviendo dos versiones
del sitio (una landing de 2 páginas encima de la web completa) y costó diagnosticarlo.

## Logotipo

El logo original (`src/assets/logo.png`) es azul marino + azul claro sobre transparente, así
que sobre la cabecera azul la parte marino desaparece. La versión que usa la web es la
**negativa** (`src/assets/logo-negative.png`): "SOLAR" en blanco y "CHECK" en el azul claro
de la marca, sin placa blanca de fondo.

```bash
npm run logo:negative      # regenera logo-negative.png desde logo.png
```

El script solo reescribe la paleta del PNG indexado, no recomprime la imagen. Si el cliente
manda un logo nuevo, sustituye `logo.png` y vuelve a lanzarlo.

## Sistema de color

Paleta corporativa del cliente: azul de marca `--brand` sobre azul marino `--ink`.
`--accent-text` y `--muted-text` son **sensibles al contexto**: dentro de una superficie
oscura se aclaran solos para cumplir WCAG AA. La lista de contextos oscuros está al
principio de `src/styles.css`; si añades una sección oscura nueva, inclúyela ahí.
