# Frontend

Environment variables are loaded via Vite's `import.meta.env`.

Required vars:

- `VITE_API_BASE_URL`: Backend base URL (e.g. `http://localhost:3000`)
- `VITE_PORT` (optional): Dev server port (default 5173)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
