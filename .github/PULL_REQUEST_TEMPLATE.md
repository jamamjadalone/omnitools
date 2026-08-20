---
name: Pull request
about: Submit changes to OmniTools
title: ""
labels: ""
assignees: ""
---

## What does this PR do?

Describe the change concisely.

## Related issue

Link to the issue this closes, e.g. `Closes #123`.

## Type of change

- [ ] New tool
- [ ] Bug fix
- [ ] Documentation
- [ ] Infrastructure / scripts
- [ ] SEO / metadata

## Checklist

- [ ] Tool (if any) runs 100% client-side — no uploads, no server calls
- [ ] `node --check tools/<slug>/script.js` passes
- [ ] Registered the tool in `data/tools.json` (if applicable)
- [ ] Regenerated `sitemap.xml` / README table if `tools.json` changed
- [ ] Follows the existing design system and conventions
- [ ] Tested the page locally in the browser

## Screenshots (if applicable)

Add screenshots to help reviewers understand the change.