Run the portfolio locally with `node server.mjs` or `./start-preview.ps1`. Node.js 22+ is required; there are no packages to install. Open http://127.0.0.1:5173/?motion=full.

Web Swing works entirely in the browser. Ask Spidy works with saved public portfolio answers immediately. To enable live AI:

1. Copy `.env.example` to `.env` in this folder.
2. Set `GROQ_API_KEY` in `.env` to your Groq key. Keep it private; do not put it in frontend code or commit it.
3. Restart `node server.mjs`. Spidy will show “AI portfolio guide”.

The default model is `openai/gpt-oss-20b`, using Groq strict structured output. Free limits depend on your account and may change. Authentication failures, exhausted quotas, timeouts and invalid output fall back to saved facts. “AI portfolio guide” indicates a configured key; the connection still needs an actual successful request to verify it.

Edit approved facts, saved answers and link actions in `public-knowledge.mjs` when adding projects. `info.txt` remains private planning material and is never used as chat context or served by the Node server. Chat transcripts are only kept in page memory. Live chat sends the current question, up to six recent messages and the public facts to Groq. Game best scores are stored locally in the visitor's browser.

Backend protections: same-origin JSON requests, bounded body/message/history size, per-IP and global rate limits, bounded concurrency and daily calls, server-held credentials, strict response shape, approved link IDs, output checks, no execution tools, and a scoped system prompt. Prompt/grounding checks reduce mistakes; they cannot prove every generated statement correct. Before public launch, test real Groq responses and adversarial queries. Rate limits are in process memory; a deployment with multiple instances needs a shared limiter and a trusted proxy configuration. Set `ALLOWED_ORIGIN` to the exact HTTPS website origin and adapt the loopback listener to the selected hosting platform. Static-only hosting cannot run `/api/chat`.

Checks: `node --test tests/portfolio.test.mjs` (local HTTP sockets needed). These use a stub Groq response and do not make paid API calls.
