# Across the Table — Design System

**Across the Table Small Business Consulting** helps owner-operated small businesses make confident money and operations decisions — clear bookkeeping, honest financial advice, and plans owners can actually follow. The name is the promise: real people sitting down *across the table* from you, talking plainly, no jargon.

This design system encodes that promise visually: **trustworthy and established**, but **warm and human** — never cold or corporate. Deep navy for authority, forest green for growth, a gold accent for optimism, all resting on warm cream paper.

> **Sources.** Designed from scratch — no prior brand assets, codebase, or Figma were provided. The direction (trustworthy & established; navy + forest + gold; clean modern sans; real photography) was set by the client. If brand assets, fonts, or a real logo exist, share them and this system will be re-grounded against them.

---

## CONTENT FUNDAMENTALS

How Across the Table writes.

- **Voice:** plain-spoken, warm, and direct. We sound like a trusted advisor at a kitchen table, not a bank. Confident but never boastful.
- **Person:** **"we" helping "you."** "We map 13 weeks ahead so payroll is never a surprise." Address the owner directly as *you / your business*. Avoid third-person ("clients receive…").
- **Casing:** **Sentence case everywhere** — headlines, buttons, nav, cards. Reserve ALL-CAPS only for small eyebrows/labels (with wide tracking) and the mono data-label style. Never Title Case headlines.
- **Tone words:** clear, confident, honest, practical, on-your-side, no-surprises. Avoid hype ("revolutionary", "10x", "game-changing"), avoid fear-mongering, avoid heavy finance jargon. Define a term if you must use it.
- **Sentence length:** short. One idea per sentence. Concrete nouns and real numbers over adjectives ("$2.4M advised", "13-week cash flow", "filed on time").
- **Emoji:** **none.** Not part of the brand. Use real icons (Lucide) or the gold mark instead.
- **Punctuation:** em dashes for asides, the occasional period for emphasis. No exclamation marks in body copy.
- **Examples:**
  - Hero: *"Sit across the table from an advisor who actually gets small business."*
  - Subhead: *"Clear books, honest advice, and a plan you can follow — for owners who'd rather run their business than wrangle spreadsheets."*
  - CTA: *"Book a free call"*, *"See pricing"*, *"Get your numbers straight"*
  - Eyebrow: *"SMALL BUSINESS CONSULTING"*, *"OUR SERVICES"*
  - Empty state: *"No invoices yet — add your first to start tracking."*

---

## VISUAL FOUNDATIONS

**Color.** Navy (`--navy-700 #1B344F`) is the primary — authority and trust. Forest (`--forest-600 #246049`) is the secondary — growth, "go", positive financials. Gold (`--gold-500 #C8962E`) is the accent — warmth and optimism, used **sparingly** for emphasis (active underlines, eyebrows, one hero CTA, key stats). Surfaces are warm cream (`--cream-50 #FBF8F2`) — never pure white pages — with white cards on top. Text is cool slate ink. This warm-paper + cool-ink + jewel-tone combination reads as established and human at once. Roughly **navy 60 / cream 30 / forest 7 / gold 3** across a layout.

**Type.** All clean sans, modern and neutral. **Schibsted Grotesk** for display (headlines, numbers, the wordmark) — bold weights (700/800), tight tracking (−2%). **Hanken Grotesk** for body — humanist, friendly, very readable at 16–18px with 1.5–1.65 line-height. **IBM Plex Mono** for figures, eyebrows, and data labels (uppercase, wide tracking). *No proprietary brand font exists — these are Google Fonts substitutes; see Caveats.*

**Spacing & layout.** 4px base unit. Generous whitespace — established brands aren't crowded. Content max-widths: 720 / 1080 / 1280. Left-aligned text is the default; centered only for short hero/section intros. Lay UI out with flex/grid + `gap`.

**Backgrounds.** Warm cream solid by default; alternate sections on `--cream-100`. Dark sections use navy-900 (footers, testimonial bands, big-stat bands). **No gradients** (except an optional barely-there cream→white wash), no busy patterns. **Real photography** carries warmth — people, hands, small storefronts, workshops — see Imagery.

**Imagery.** Real photography of small-business owners and the work itself: warm, natural daylight, candid (not stock-posed). Slightly warm white balance to sit with the cream. Photos go full-bleed in heroes/bands or inside `--radius-lg` rounded frames in cards. Treat people with dignity — competent, mid-work, real. *(Placeholders are used in the kits; swap in licensed photography.)*

**Corner radii.** Restrained — established, not bubbly. Buttons/inputs `--radius-md (10px)`, cards `--radius-lg (14px)`, pills/avatars full. Nothing larger than 20px except pills.

**Borders.** Warm hairlines (`--border-default #E0D9CB`) on cream; cards use a 1px warm border **plus** a soft shadow (belt and suspenders — feels solid and trustworthy). On dark, borders are `rgba(255,255,255,.14)`.

**Shadows.** Soft, warm-tinted, restrained. `--shadow-sm` at rest on cards, `--shadow-card-hover` on lift. Never neon or hard. No glows.

**Motion.** Subtle and quick. `--dur-fast 130ms` for hovers, `--dur-base 200ms` for cards/toggles. Easing `--ease-out`. Cards lift 2px on hover; buttons depress 1px on press. **No bounces, no infinite loops, no parallax.** Honor `prefers-reduced-motion`.

**Hover / press states.** Buttons darken on hover (navy→navy-800, forest→forest-700), gold→gold-600 with text flipping to white. Press = `translateY(1px)`. Cards lift + deepen shadow + border-strong. Links: navy-600, underline on hover. Icon buttons: cream-100 wash on hover.

**Focus.** Always visible: a 3px gold focus ring (`--shadow-focus`, gold at 35%). Inputs also shift border to navy-700 on focus.

**Transparency & blur.** Used minimally — a `backdrop-filter: blur` on the sticky site header over photography, and subtle alpha on dark-surface borders. No frosted-glass everywhere.

**Cards.** White surface, 1px warm border, `--radius-lg`, `--shadow-sm` at rest. Optional gold uppercase **eyebrow**, display-bold **title**, body text. Clickable cards gain `hover` lift. A `dark` navy variant exists for emphasis panels.

---

## ICONOGRAPHY

- **System: [Lucide](https://lucide.dev)** — clean, consistent **outline** icons at a **2px stroke**, rounded line caps/joins. The even, calm stroke weight matches the trustworthy-but-warm voice. No filled or duotone icon sets.
- **Delivery:** linked from CDN in the kits — `<script src="https://unpkg.com/lucide@latest"></script>` then `lucide.createIcons()`, or inline `<svg>` copied from Lucide. Components that take an icon (`Button.leftIcon`, `Alert.icon`, `IconButton`) accept any 24×24 stroke SVG node.
- **Sizing:** 20px in buttons/inline, 24px standalone, 16px in dense tables. Color inherits `currentColor`.
- **No emoji. No unicode glyphs as icons.** The only decorative brand glyph is the logo mark (a table seen from above with two seats — `assets/logo-mark.svg`).
- **Substitution flag:** Lucide is a substitute for a (non-existent) proprietary icon set. If a brand icon library is adopted, swap it here.

---

## INDEX / MANIFEST

Root
- `styles.css` — **the** entry point (consumers link only this). `@import`s every token + font file.
- `readme.md` — this guide. `SKILL.md` — Agent-Skill wrapper.
- `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` — **generated**, do not edit.

`tokens/` — `fonts.css` (Google Fonts @import), `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `base.css`.

`assets/` — `logo-mark.svg`, `logo-mark-light.svg`, `logo-roundel.svg`.

`components/` — React primitives (each `.jsx` + `.d.ts` + `.prompt.md`, one `*.card.html` per group):
- `core/` — **Button, IconButton, Badge, Tag, Avatar, Card, Stat**
- `forms/` — **Input** (+ multiline), **Select, Checkbox, Switch**
- `feedback/` — **Alert**
- `navigation/` — **Tabs**

`guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.

`ui_kits/`
- `website/` — marketing site recreation (hero, services, proof, CTA, footer).
- `portal/` — client portal web app (dashboard, documents, tasks).

`slides/` — sample pitch-deck slide types (title, agenda, big-stat, comparison, quote, closing) as standalone 1280×720 cards.

`templates/` — starting folders consuming projects can copy:
- `pitch-deck/` — the six slides assembled into a presentable, keyboard-navigable deck (loads the system via `ds-base.js`).

**Namespace:** components are exposed at `window.AcrossTheTableDesignSystem_520822` in card/kit HTML.
