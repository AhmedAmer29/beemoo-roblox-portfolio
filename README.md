# Ahmed — Roblox Developer Portfolio

A one-page portfolio built with React, TypeScript, Vite, and CSS Modules.

Live site: https://ahmedamer29.github.io/beemoo-roblox-portfolio/

## Run locally

```bash
npm install
npm run dev
```

## Contact form setup

The form uses Formspree so the portfolio does not need its own server. Copy `.env.example` to `.env.local`, then set `VITE_FORMSPREE_ENDPOINT` to the endpoint from your Formspree form before deployment. For GitHub Pages, add it as a repository Actions variable with the same name. Until then, the portfolio shows a setup message and does not send form data. The endpoint is included in the public client bundle, so it should be treated as public configuration rather than a secret.

## Project structure

```text
src/
  app/                 Page composition
  components/          Shared interface pieces
  data/                Portfolio content and code excerpts
  features/            Navigation, hero, projects, systems, about, contact
  styles/              Global tokens and shared layout styles
  types/               Shared TypeScript types
```

This is a static frontend. There is no custom application backend: message delivery is delegated to Formspree, and the endpoint is supplied as a build-time environment variable.
