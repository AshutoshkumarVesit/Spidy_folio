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

## Checks

```sh
node --test tests/portfolio.test.mjs tests/swing-world.test.mjs tests/swing-controls.test.mjs
```

Tests use stubbed AI responses and do not consume Groq API credits. Local HTTP connections are needed.
