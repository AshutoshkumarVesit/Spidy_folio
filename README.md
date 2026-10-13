# Spidy Folio

Ashutosh Tripathi's interactive portfolio, with image particles, scroll animations, project showcases, a web-swinging mini game and Ask Spidy.

## Run locally

Requires Node.js 22 or newer. No dependencies to install.

```sh
node server.mjs
```

Open http://127.0.0.1:5173/?motion=full.

## Configure Ask Spidy

Copy `.env.example` to `.env`, set your own `GROQ_API_KEY`, and restart the server. The key stays on the backend. Without a key, the chatbot uses saved portfolio answers. See [SPIDY-SETUP.md](SPIDY-SETUP.md) for configuration and deployment notes.

The Node backend is required for live AI; static hosting alone cannot run `/api/chat`.

## Antideploy

The project is configured for **https://ashuverse.antideploy.app**. Its application ID is stored in `.antideploy.json`; account credentials stay outside the repository in the user's Antideploy configuration.

`Dockerfile` runs the complete portfolio and chatbot together on Node.js 22. The server reads the platform's `PORT` and `APP_URL`/`SITE_URL`, listens on the container interface in production, and exposes `/healthz`. `ALLOWED_ORIGIN` can override the public address for a custom domain. Local defaults remain `127.0.0.1:5173`.

After connecting an Antideploy account and staging the source files, deploy with:

```sh
node scripts/antideploy.mjs deploy
node scripts/antideploy.mjs status <taskId>
```

The helper archives only Git-tracked/staged files, refuses private planning files or `.env` in that manifest, and sends only the Groq configuration and production runtime settings as deployment environment variables. It reads the application's current public URL and sets `ALLOWED_ORIGIN` explicitly, so the server accepts that address even when the platform omits `APP_URL`. It enables `PROXY_HOST` because Antideploy rewrites the upstream Host; chat requests still require the configured public Origin, and forwarded headers are never trusted for origins or rate limits. It does not upload the local preview port. Docker also excludes env files and private notes from its build context. Deployments use folder uploads; pushing GitHub alone does not redeploy this application.

Next session: visitor counts, error tracking, and an email contact form. Antideploy currently lists counts and error tracking as ideas; they need separate provider setup. Contact email can use its built-in relay. These are planned, not enabled.

## Checks

```sh
node --test tests/portfolio.test.mjs tests/swing-world.test.mjs tests/swing-controls.test.mjs
```

Tests use stubbed AI responses and do not consume Groq API credits. Local HTTP connections are needed.
