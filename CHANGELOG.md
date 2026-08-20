# Changelog

All notable changes to OmniTools are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Wi-Fi and vCard presets** to the QR Code Generator — pick a mode, fill in the fields, and the correct payload is built for you, with a live character counter.
- **Tier 2 tool batch** (29 tools), including:

  **File & document**
  - File Size Batch Checker
  - Duplicate File Finder (SHA-256, in-browser)
  - File Hash / Checksum Verifier
  - ZIP Creator
  - ZIP Extractor
  - Filename Cleaner (illegal character remover)
  - CSV Column Renamer / Cleaner
  - Text File Encoding Converter

  **Image preparation**
  - Bulk Image Resizer
  - Transparent PNG Checker
  - Image DPI / PPI Setter
  - Aspect Ratio Cropper
  - EXIF / Metadata Stripper
  - Watermark Adder
  - Thumbnail Grid / Contact Sheet Generator
  - Image Format Converter

  **Text & content**
  - Slug Generator
  - Meta Description Length Checker
  - Title Tag Length Checker
  - Alt Text Generator Helper
  - Keyword List Formatter
  - Hashtag Generator
  - Word & Character Counter
  - Content Calendar CSV Generator

  **Developer & config**
  - .env Template Generator
  - .gitignore Generator
  - package.json Validator
  - README Template Generator
  - License Text Generator

- **Tier 1 tool batch** (8 tools): Stock Asset Readiness Checker, Batch File Renamer, Universal File Saver, SEO-Friendly Filename Generator, Stock Photo Metadata Generator, AI Image Disclosure Helper, Image Background Edge Checker, File Type Detector.
- **Shared helpers** in `assets/js/helpers/`: `zip-export.js`, `slugify.js`, `magic-bytes.js`, `hash.js`.
- **Vendored libraries** in `assets/js/vendor/`: JSZip and FileSaver (offline-friendly).
- **Build scripts** in `scripts/`: `generate-tool-page.mjs`, `generate-sitemap.mjs`, `generate-readme.mjs`.

### Changed

- Homepage hero copy: removed stale "500+ tools" claims; tool count is now dynamic.
- Added a generated Open Graph image (`assets/images/og-image.png`).
- `sitemap.xml` regenerated to cover all 47 tools.
- README rewritten with badges, an auto-generated tool table, and build instructions.

## [Initial release]

- OmniTools static site foundation: homepage, category pages, tool pages, shared header/footer, search, dark mode, and a `data/tools.json` single source of truth.
- Core tools: Image Compressor, Color Palette Extractor, JSON Formatter, Base64 Encoder/Decoder, UUID Generator, Email Extractor, Lorem Ipsum Generator, Password Generator, QR Code Generator, Text Case Converter.