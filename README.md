<div align="center">

# OmniTools

**All the online tools you need, in one place.**

Free, fast, browser-based tools for images, PDFs, developers, text and more.
No sign-up, no uploads to a server -- everything runs on your device.

[![Live Site](https://img.shields.io/badge/Live%20Site-jamamjadalone.github.io-7c6cf6?style=for-the-badge&logo=github&logoColor=white)](https://jamamjadalone.github.io/omnitools/)
[![Stars](https://img.shields.io/github/stars/jamamjadalone/omnitools?style=for-the-badge&color=fbbf24)](https://github.com/jamamjadalone/omnitools/stargazers)
[![Forks](https://img.shields.io/github/forks/jamamjadalone/omnitools?style=for-the-badge&color=22d3ee)](https://github.com/jamamjadalone/omnitools/network/members)
[![Issues](https://img.shields.io/github/issues/jamamjadalone/omnitools?style=for-the-badge&color=f87171)](https://github.com/jamamjadalone/omnitools/issues)
[![License](https://img.shields.io/github/license/jamamjadalone/omnitools?style=for-the-badge&color=34d399)](https://github.com/jamamjadalone/omnitools/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/jamamjadalone/omnitools?style=for-the-badge&color=9285ff)](https://github.com/jamamjadalone/omnitools/commits/main)

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub%20Pages-22272e?style=flat&logo=github&logoColor=white)
![No Backend](https://img.shields.io/badge/No%20Backend-100%25%20Client--Side-34d399?style=flat)
![Static Site](https://img.shields.io/badge/Type-Static%20Site-0a0c11?style=flat)
![Open Source](https://img.shields.io/badge/Open%20Source-MIT%20License-34d399?style=flat)

</div>

---

## Why OmniTools

| | Feature |
|---|---------|
| ⚡ | **Instant** -- no installs, no accounts, no server round-trips |
| 🔒 | **Private by design** -- all processing happens in your browser |
| 💸 | **Free forever** -- no paywalls, no watermarks, no daily limits |
| 📱 | **Responsive & accessible** -- keyboard navigation, ARIA labels, semantic HTML, dark mode |
| 🧩 | **Data-driven** -- homepage, search, categories and related-tools all generated from a single JSON file |
| 🔍 | **SEO-ready** -- sitemap, JSON-LD structured data, Open Graph tags, clean per-tool URLs |

## Available Tools

**47 tools** across **6 categories** -- all running entirely in your browser.

| Category | Tools | Highlights |
|----------|-------|------------|
| [Image Tools](https://jamamjadalone.github.io/omnitools/categories/image-tools.html) | 14 | Compressor, QR Code, Color Palette, Stock Checkers |
| [Developer Tools](https://jamamjadalone.github.io/omnitools/categories/developer-tools.html) | 8 | JSON Formatter, Base64, UUID Generator, .env/.gitignore |
| [Text Tools](https://jamamjadalone.github.io/omnitools/categories/text-tools.html) | 7 | Email Extractor, Case Converter, Word Counter |
| [SEO Tools](https://jamamjadalone.github.io/omnitools/categories/seo-tools.html) | 6 | Filename Generator, Slug, Meta Checker, Alt Text |
| [Utilities](https://jamamjadalone.github.io/omnitools/categories/utilities.html) | 10 | Password Gen, ZIP Creator/Extractor, File Tools |
| [Converters](https://jamamjadalone.github.io/omnitools/categories/converters.html) | 2 | Image Format, Text Encoding |

> **[View all tools with descriptions](TOOLS.md)**

## Quick Start

```bash
# Clone the repo
git clone https://github.com/jamamjadalone/omnitools.git
cd omnitools

# Open in browser
open index.html
```

No build step, no dependencies, no server required. Just open `index.html`.

## Project Structure

```
omnitools/
├── index.html                  # Homepage
├── data/
│   └── tools.json              # Single source of truth for all tools
├── tools/
│   └── <slug>/                 # Each tool lives here
│       ├── index.html
│       ├── style.css
│       └── script.js
├── categories/                 # Category landing pages
├── components/                 # Shared header/footer partials
├── templates/
│   └── tool-template/          # Copy this for new tools
├── assets/
│   ├── css/                    # Design tokens, base, components
│   ├── js/                     # main.js + render.js
│   └── images/                 # OG image, icons
└── scripts/                    # Build helpers (sitemap, README)
```

## Adding a New Tool

1. Copy `templates/tool-template/` to `tools/<your-slug>/`
2. Fill in `index.html`, `style.css`, `script.js`
3. Add your tool entry to `data/tools.json`
4. The homepage, search, category pages and related-tools update automatically

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is released under the [MIT License](LICENSE). You're free to use, modify, and distribute it.
