<div align="center">

# 🛠️ OmniTools
### The Ultimate Free, Privacy-First Online Web Utilities Suite

**150+ Powerful In-Browser Tools Across 10 Categories — Zero Server Uploads, Zero Paywalls.**

[![Live Web App](https://img.shields.io/badge/Live%20Site-jamamjadalone.github.io%2Fomnitools-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white)](https://jamamjadalone.github.io/omnitools/)
[![GitHub Stars](https://img.shields.io/github/stars/jamamjadalone/omnitools?style=for-the-badge&color=F59E0B&logo=github)](https://github.com/jamamjadalone/omnitools/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/jamamjadalone/omnitools/pulls)

<br/>

![Client-Side Only](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10B981?style=flat-square&logo=shield)
![No Server Uploads](https://img.shields.io/badge/Data-Never%20Leaves%20Your%20Device-0284C7?style=flat-square)
![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-7C3AED?style=flat-square)
![Pure Web Standards](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-F97316?style=flat-square)

</div>

---

## 🌟 Why OmniTools?

Most online tool websites require accounts, upload your sensitive files to third-party servers, or gate essential features behind premium subscriptions. **OmniTools is built differently.**

| Principle | Why It Matters |
| :--- | :--- |
| 🛡️ **100% Privacy by Design** | Every single operation (image resizing, PDF processing, encoding, hashing, file extension conversion) runs locally in your browser memory via native JavaScript & Web APIs. Your data never touches a server. |
| ⚡ **Zero Latency / Instant** | No server roundtrips, no upload/download waiting times. Tools render and process at local device speed. |
| 💸 **Free Forever** | No subscriptions, no credit cards, no login, and no annoying limits. |
| 📱 **PWA & Offline Ready** | Installable as a progressive web app on desktop and mobile devices. Use your favorite utilities even without an internet connection. |
| 🔍 **SEO & Accessibility First** | Semantic HTML, complete ARIA labeling, dark-mode first UI, and lightweight vanilla architecture with zero runtime bloat. |

---

## 📂 Available Tools by Category (150+ Tools)

All tools run client-side with clean, dedicated interfaces and batch ZIP export where applicable:

| Category | Count | Key Highlights |
| :--- | :---: | :--- |
| **[Image Tools](https://jamamjadalone.github.io/omnitools/categories/image-tools.html)** | **21** | Bulk Image Resizer, Image Compressor, Format Converter, SVG Cleaner, Color Palette Extractor, QR Code Generator |
| **[Developer Tools](https://jamamjadalone.github.io/omnitools/categories/developer-tools.html)** | **22** | Base64 Encoder/Decoder, JSON Formatter, UUID Generator, Hash Generator (SHA/MD5), JWT Inspector, Regex Tester |
| **[Converters](https://jamamjadalone.github.io/omnitools/categories/converters.html)** | **18** | File Extension Changer, Image Format Converter, Text File Encoding Converter, Unit & Color Converters |
| **[Text Tools](https://jamamjadalone.github.io/omnitools/categories/text-tools.html)** | **23** | Text Case Converter, Word & Character Counter, Diff Checker, Markdown Previewer, Slug Generator |
| **[SEO Tools](https://jamamjadalone.github.io/omnitools/categories/seo-tools.html)** | **12** | Meta Tag Generator, OpenGraph Previewer, Sitemap XML Validator, Robots.txt Generator, Heading Analyzer |
| **[Calculators](https://jamamjadalone.github.io/omnitools/categories/calculators.html)** | **20** | Aspect Ratio Calculator, Percentage, Storage / Bandwidth Unit Calculator, Time Zone Converter |
| **[Utilities](https://jamamjadalone.github.io/omnitools/categories/utilities.html)** | **30** | Strong Password Generator, ZIP Creator/Extractor, Universal File Saver, Lorem Ipsum Generator |
| **[AI Tools](https://jamamjadalone.github.io/omnitools/categories/ai-tools.html)** | **5** | Prompt Formatter, Token Estimator, AI Content Structure Checker |

---

## 🚀 Quick Start / Local Development

OmniTools requires **zero build steps, zero node_modules, and zero compilation**. Pure, lightweight web standards:

```bash
# 1. Clone the repository
git clone https://github.com/jamamjadalone/omnitools.git

# 2. Open in your preferred browser
cd omnitools
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

---

## 🏗️ Project Architecture

```
omnitools/
├── index.html                   # Homepage with live instant search & category navigation
├── manifest.webmanifest         # PWA installation manifest
├── data/
│   └── tools.json               # Centralized single source of truth for all 150+ tools
├── tools/
│   └── <tool-id>/               # Dedicated standalone tool directory
│       ├── index.html           # Tool UI & SEO schema metadata
│       ├── script.js            # Pure client-side tool logic
│       └── style.css            # Scoped custom styles
├── categories/                  # Category landing pages
├── assets/
│   ├── css/                     # Global design tokens, base typography, and dark theme
│   ├── js/                      # Main search engine & component renderer
│   └── icons/                   # Vector favicons & logos
└── scripts/                     # Automated helpers for sitemaps & search index
```

---

## 🤝 Contributing & Adding New Tools

Contributions are warmly welcomed! To add a new utility:
1. Fork the repo and create a new feature branch.
2. Duplicate `templates/tool-template/` into `tools/<your-tool-id>/`.
3. Implement your tool logic in `index.html` and `script.js` (ensuring 100% client-side execution).
4. Register your tool in `data/tools.json`.
5. Submit a Pull Request!

---

## 📄 License & Attribution

This project is open-source under the **[MIT License](LICENSE)**.

Developed with ❤️ by **[Muhammad Amjad Rasheed](https://github.com/jamamjadalone)** ([@jamamjadalone](https://www.youtube.com/@jamamjadalone)).
