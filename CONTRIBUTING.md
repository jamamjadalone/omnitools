# Contributing to OmniTools

Thanks for wanting to help! OmniTools is a static, client-side-only collection of free online tools. The project's philosophy is simple: **every tool runs entirely in the browser — no uploads, no accounts, no servers.**

## Ground rules

- **Client-side only.** No backends, no API keys, no server round-trips. Any new tool must work from a static file.
- **No clones or filler.** A tool should earn its place by being genuinely useful and distinct. Reference an idea, don't copy an implementation.
- **No linking out to "do it here" alternatives.** Tools are built natively with the OmniTools design system; the site never wraps or iframes third-party sites.
- **Vanilla everything.** HTML5, CSS3, ES6+ JavaScript. No frameworks, no build step.

## Adding a new tool

The preferred flow uses the spec-based generator so every page stays consistent:

1. **Open an issue first.** Describe the tool and how it fits the client-side-only philosophy before writing code.
2. **Write a spec** at `scripts/specs/<slug>.json` (name, description, category, UI fields, FAQ, optional `extraScripts`). See existing specs in `scripts/specs/` for the exact shape.
3. **Generate the page**:
   ```sh
   node scripts/generate-tool-page.mjs scripts/specs/<slug>.json
   ```
4. **Write the logic** in `tools/<slug>/script.js` (and `style.css` if needed). Follow the conventions in `templates/tool-template/`:
   - Wrap everything in an IIFE with `"use strict"`.
   - Grab elements by ID at the top of the script.
   - Use the shared helpers (`window.OmniTools.showToast`, `copyText`, `escapeHtml`) and `assets/js/helpers/` modules where relevant.
   - Make interactive elements keyboard-accessible.
5. **Register the tool** in `data/tools.json` (see the README for the entry shape).
6. **Regenerate derived files**:
   ```sh
   node scripts/generate-sitemap.mjs
   node scripts/generate-readme.mjs
   ```
7. **Verify** — run `node --check tools/<slug>/script.js` and open the page locally to confirm it works.
8. **Commit with a clear message** and open a pull request.

## Fixing bugs or improving docs

Small, focused PRs are welcome for anything: bugs, accessibility, SEO, documentation. Please keep changes scoped to the issue you're fixing.

## Style

- No code comments unless they explain a non-obvious decision.
- Match the existing conventions of the file you're editing.
- Keep lines readable; prefer clarity over cleverness.
- Use the project's design tokens and CSS classes rather than one-off styles.

## Commit messages

Use conventional-style prefixes, e.g. `feat:`, `fix:`, `docs:`, `chore:`. Write a short subject line and, when useful, a body describing what and why.

## Code of conduct

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).