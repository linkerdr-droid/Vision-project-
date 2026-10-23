# Panel de gestión técnica

Panel para asignar cuadrillas, seguir trabajos en campo y ver la productividad del día.
Next.js (App Router) + Tailwind CSS. Sin librerías de interfaz extra.

## Cómo correrlo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # versión de producción
```

## Qué hay en cada carpeta

| Ruta | Contenido |
|---|---|
| `app/` | Página, layout y `globals.css` (variables de color con modo oscuro) |
| `components/TechDashboard.jsx` | Tablero Kanban, indicadores, productividad y panel de detalle |
| `tailwind.config.js` | Colores por rol, radios, sombras y tipografía |
| `prototipos/` | Dos páginas HTML que se abren con doble clic, sin instalar nada |

## Estado actual

- **Hecho:** tablero con arrastrar y soltar, búsqueda, filtro por cuadrilla, nueva asignación, panel de detalle del trabajo, indicadores y productividad.
- **Pendiente:** las secciones del menú (Asignaciones, Cuadrillas, Calendario, Reportes, Ajustes) aparecen como "Pronto". Los datos son de ejemplo y se pierden al recargar: falta conectar una base de datos.
- **`prototipos/sistema-completo-despacho.html`:** el sistema completo de la primera etapa (despacho, horas extra, equipos, contratistas, proveedores, clientes, planeación). Aún no usa el diseño nuevo.

## Subirlo a GitHub

1. Crea un repositorio vacío en https://github.com/new (sin README ni .gitignore).
2. En esta carpeta:

```bash
git init
git add .
git commit -m "Panel de gestión técnica"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
git push -u origin main
```
