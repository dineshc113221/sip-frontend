# sip-micro-frontend

This project uses Vite as the Javascript bundler, and was scaffolded with the npx create-vite-app with the React + Typescript template. This repo requires that you have Node installed on your local machine. You can optionally serve the production static site using docker-compose, which requires you to have docker installed on your machine.

## Setup

- Install dependencies: `npm install`

## Commands

- Run the server: `npm run dev`
- Run unit tests: `npm run test`
- Run linter: `npm run lint`
- Build a production site: `npm run build`
- Run a preview : `npm run preview`

## Other notes

If you need to configure environment variables, they must be prefixed with `VITE_` so that they can run.

```bash
VITE_SOME_KEY=123 # will import
DB_PASSWORD=foobar # will not import
```

The environment variables will be exposed as `import.meta.env.VITE_SOME_KEY`.

```javascript
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

For more information, visit <https://vitejs.dev/guide/env-and-mode.html#env-files>.
