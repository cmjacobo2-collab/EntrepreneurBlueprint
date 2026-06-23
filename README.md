# Across the Table — Founder's Workbook

A runnable, installable static **PWA** built from the `Founder Workbook.dc.html`
Claude Design handoff. This is a real implementation — the prototype's
`<x-dc>` / `<sc-*>` template engine is **not** used. A freshly written runtime
and real-DOM renderer drive the design; only the authored content and logic
(112 workbook sections across 7 parts, 51-state registration data, affirmations,
knowledge base, and legal copy) are reused unchanged, so nothing was lost in
translation.

## Run it

It's plain HTML/CSS/JS — no build step.

- **Quickest:** open `index.html` in a browser. Everything works except the
  service worker (offline cache), which browsers only allow over http(s).
- **Full PWA (offline + installable):** serve the folder over http, e.g.
  - `python3 -m http.server 8080` then visit `http://localhost:8080/`
  - or `npx serve .`

## What's inside

| File | Role |
|------|------|
| `index.html` | Entry point — links the design system, loads the scripts |
| `runtime.js` | Small React-like base class (`DCLogic`) + bootstrap (newly written) |
| `app.logic.js` | Reused verbatim app logic: content data + `renderVals()` view model |
| `render.js` | Real-DOM renderer — builds every screen from the view model (newly written) |
| `_ds/…` | The Across the Table design system (tokens + styles), reused as-is |
| `assets/`, `manifest.json`, `sw.js` | Logo/icons, PWA manifest, offline service worker |

## Features implemented

- **Onboarding** — account creation → verify-and-lock, then commitment setup
  (launch date *or* weekly hours, US state, daily reminders).
- **Workbook** — all 7 parts and 112 sections: lessons, validation worksheets,
  planning prompts, foundation pledges, rating grids, tables, numbered lists,
  checklists, the state-specific cost & official `.gov` registration links, the
  step-by-step launch guide, and free-resource directories.
- **Progress, go/no-go decision, and summary** with a validation checklist.
- **Resources** — book a consultation (pre-filled email), how-to, knowledge
  base, legal & licensing.
- **Persistence** — answers, account, and commitment saved to `localStorage`.
- **Responsive** sidebar/drawer, daily reminder scheduling, offline support.

## Notes

- Reminders use the browser Notification API (asks permission when enabled).
- All registration/tax links point to official government sites only.
- Fonts load from Google Fonts (the design system's substitute faces); swap in
  licensed brand fonts by editing `_ds/.../tokens/fonts.css`.
