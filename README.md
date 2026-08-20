# OmniTools

**All the online tools you need, in one place.**

OmniTools is a free, fast, browser-based collection of online utilities &mdash; image tools, PDF tools, developer tools, text tools, converters, calculators and more. Every tool runs entirely on the client side, so files and text you work with are never uploaded to a server.

Live site: `https://jamamjadalone.github.io/omnitools/`

---

## Features

- ⚡ **Instant** &mdash; no installs, no accounts, no waiting on a server
- 🔒 **Private by design** &mdash; all processing happens in your browser
- 💸 **Free** &mdash; no paywalls, watermarks, or daily limits
- 📱 **Responsive & accessible** &mdash; keyboard navigation, ARIA labels, semantic HTML, dark mode
- 🧩 **Dynamic** &mdash; the homepage, search, and category pages are generated from a single `data/tools.json` file, so adding a tool never means editing the homepage by hand
- 🔍 **SEO-ready** &mdash; sitemap, structured data (JSON-LD), Open Graph tags, and clean per-tool URLs out of the box

## Technology used

- HTML5, CSS3, and vanilla JavaScript (ES6+) &mdash; no framework, no build step required to run it
- 100% static &mdash; deploys directly to GitHub Pages

## Project structure

```
/
├── index.html                 Homepage
├── 404.html                   Custom not-found page
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest
├── assets/
│   ├── css/                   variables.css, base.css, components.css, home.css, tool-page.css
│   ├── js/                    main.js (header/footer/search/theme), render.js (data → cards)
│   └── icons/                 favicon.svg
├── components/                header.html, footer.html (shared partials)
├── data/
│   └── tools.json             The single source of truth for every tool + category
├── categories/                One landing page per category (image-tools.html, pdf-tools.html, ...)
├── tools/
│   └── <tool-slug>/
│       ├── index.html
│       ├── style.css
│       └── script.js
├── templates/
│   └── tool-template/         Starting point for a brand new tool
├── about/, contact/, privacy/, terms/
```

## GitHub Pages deployment

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, choose the `main` branch and `/ (root)` folder.
4. Save. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

No build step, bundler, or server configuration is required.

## How to add a new tool in the future

1. **Duplicate the template folder**: copy `templates/tool-template/` to `tools/your-tool-name/`.
2. **Rename and edit**:
   - Update the `<title>`, meta description, canonical URL, and breadcrumb/structured data in `index.html`.
   - Replace the `<!-- TOOL_BODY -->` section with your tool's UI.
   - Write your tool's logic in `script.js` and any one-off styles in `style.css`.
3. **Register the tool** by adding one object to `data/tools.json`:
   ```json
   {
     "id": "your-tool-name",
     "name": "Your Tool Name",
     "slug": "your-tool-name",
     "category": "utilities",
     "icon": "🔧",
     "description": "One sentence describing what it does.",
     "keywords": ["relevant", "search", "terms"],
     "featured": false,
     "isNew": true
   }
   ```
4. **Commit** your changes.
5. **Push to GitHub.**

The homepage, search, category pages, and "related tools" sections all read from `data/tools.json` automatically &mdash; no other file needs to change.

## License

This project is released under the MIT License. You're free to use, modify, and distribute it.

## Contributing

Issues and pull requests are welcome. If you'd like to add a tool, please open an issue first describing what it does so we can make sure it fits the project's client-side-only philosophy.
