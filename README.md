# Admin Dashboard

A responsive admin-style dashboard built with **React** and **Vite**. It includes charts, data tables, theme switching, toast notifications, and a demo login flow (no backend).

## Tech stack

- React 19, React Router 7
- Vite 8
- Recharts
- ESLint (flat config)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build → `dist`|
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint               |

## Demo login

Authentication is **mock only** (credentials live in the app; session is stored in `sessionStorage`).

| Role   | Email                 | Password |
| ------ | --------------------- | -------- |
| Admin  | `alex.morgan@acme.io` | `demo`   |
| User   | `demo@acme.io`        | `demo`   |

## Deploy on Vercel

1. Push the repo to GitHub (or connect your folder).
2. Import the project in [Vercel](https://vercel.com); it will detect **Vite** and use `npm run build` with output **`dist`**.
3. `vercel.json` includes SPA rewrites so deep links (e.g. `/users`) and refresh work in production.

You can also deploy from the CLI:

```bash
npm i -g vercel
vercel
```

## License

Private / portfolio use — adjust as needed.
