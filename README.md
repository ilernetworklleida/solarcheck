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

## Validación y producción

```bash
npm run build
npm run check
```

El build genera `dist/`, el sitemap y 13 rutas estáticas preparadas para despliegue. Las fotografías externas empleadas y sus licencias están documentadas en `STOCK-LICENSES.md`.

Para publicar la versión validada en GitHub Pages:

```bash
npm run deploy
```

El dominio de publicación configurado es `solarcheck.proposta.cat`.
