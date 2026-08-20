# Security Policy

## Reporting a vulnerability

OmniTools is a static site that runs entirely in the browser. We still take security seriously.

If you discover a security issue — for example, an XSS vector in a tool, a bug that could expose data, or a problem with how files are handled — please **do not open a public issue**. Instead, report it privately by emailing the maintainer at **jamamjadalone@gmail.com**.

Please include:

- A description of the issue and the tool/page affected
- Steps to reproduce
- The impact you observed (if any)

We aim to respond within 5 business days and will work with you to understand and fix the issue. We'll credit you in the release notes if you'd like.

## Security notes for contributors

- Tools run 100% client-side. Never introduce any code that sends user data (files, text, or hashes) to a remote server.
- When rendering user-provided content, always escape it (use `window.OmniTools.escapeHtml` or equivalent) — never inject raw HTML.
- Be careful with `innerHTML` assignments and `data:` / `blob:` URLs; validate and sanitize user input.
- Never commit secrets, API keys, or credentials to the repository.
- When adding a helper that reads file bytes (e.g. magic-byte detection), stick to safe array-index reads within bounds.