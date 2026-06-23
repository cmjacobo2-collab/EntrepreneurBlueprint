# Founder's Workbook — Expo (React Native) scaffold

A real, runnable starting codebase for the Across the Table Founder's Workbook app, rebuilt from the design handoff. TypeScript + Expo. The design tokens, all workbook content, the completion logic, and every screen are wired up. The production backend (auth, sync, push, billing) is **intentionally stubbed behind interfaces** so you can plug it in without touching the screens.

## Run it

```bash
cd app
npm install        # or: yarn / pnpm install
npx expo start     # press a (Android), i (iOS), or w (web)
```

> Requires Node 18+ and the Expo toolchain. First run downloads the Google Fonts packages used by the theme.

## What's implemented

- **Design system** — `src/theme/tokens.ts` holds the exact color/type/spacing/radius/elevation/motion tokens. UI primitives in `src/components/ui.tsx` (Button, Card, Input, Toggle, ProgressRing, ProgressBar, Eyebrow, Tag…).
- **Content** — `src/content/*.json` is the extracted, verbatim workbook (112 sections, 7 parts), affirmations, 51 states (links + fees), KB/legal/how-to. Typed via `src/logic/types.ts`, loaded through `src/content/index.ts`.
- **Workbook engine** — `src/logic/workbook.ts` reproduces the prototype's `isDone` / `blocksDone` completion rules, progress math, and deterministic affirmation-of-the-day. `BlockRenderer.tsx` renders every block type (points, fields, rating, checks, numbered, table, mark, note, timeline, steps, resources, statecost, costs, statelinks).
- **Screens** — welcome → **log in** (email + password) or **sign up** (Step 1: first name, last name, email, password; Step 2: business details) → verify-and-lock → commitment onboarding → intro/overview (progress ring + affirmation + parts) → data-driven section screen → summary & decision (go/adjust/stop banner) → consultation / how-to / KB / legal resource views. A session keeps you signed in across launches; **Log out** lives in the sidebar.
- **Shell** — persistent sidebar on ≥980px; hamburger drawer below. Mirrors the prototype's responsive breakpoint.
- **Persistence** — `src/state/persistence.ts` is an adapter interface with a device-local (AsyncStorage) implementation today. The store (`src/state/store.tsx`) depends only on the interface.

## What you must still build for production

These match the gaps called out in `../docs/HANDOFF-ASSESSMENT.md`:

1. **Backend auth + account model** — the login/signup UI and a local `verifyLogin` stub are in place, but **passwords are stored in plaintext locally for the demo only**. Implement `PersistenceAdapter` against Supabase/Firebase: hash + verify passwords server-side, issue a real session token (not the account number), enforce one-account-one-business server-side, and keep the verify-and-lock.
2. **Answer sync** — same adapter; replace local reads/writes with account-bound storage.
3. **Real reminders** — `expo-notifications` + a server scheduler (e.g. Supabase Edge Function/cron) firing daily at the user's `reminderTime`, pulling the affirmation from the client's list. The dependency is already in `package.json`; wire registration + scheduling.
4. **Licensing/entitlement** — Play Billing (+ Apple IAP), or RevenueCat; gate multi-business use behind a server entitlement check.
5. **Swap the affirmation list** — replace `src/content/affirmations.json` with the client's Excel list (same shape: `{ "affirmations": [ "…" ] }`).
6. **Picker polish** — the industry/biz-type/state selectors use lightweight built-ins; consider `@react-native-picker/picker` or a bottom sheet.
7. **Legal review** — update Privacy Policy text once storage moves server-side (it currently says "stored locally on your device").

## Build a signed Android bundle (Play Store)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android        # produces a signed .aab
# then upload the .aab in Google Play Console (one-time $25 developer fee)
```

For iOS: `eas build --platform ios` (requires an Apple Developer account).

## Project layout

```
app/
├── App.tsx                  Root: fonts, onboarding gate, responsive shell
├── app.json                 Expo config (icons, splash, package ids, notifications)
├── package.json
├── src/
│   ├── theme/tokens.ts      Design tokens (source of truth for styling)
│   ├── content/             Extracted workbook JSON + typed loader
│   ├── logic/               types.ts, workbook.ts (completion rules, progress)
│   ├── state/               store.tsx (context) + persistence.ts (swappable adapter)
│   ├── components/          ui.tsx, BlockRenderer.tsx, Callout.tsx, Sidebar.tsx
│   └── screens/             account, commitment, intro, section, summary, resources/
└── assets/                  Brand logo + app icons (from the handoff)
```

> This is a scaffold and visual approximation built from the tokens — pair it with `../preview/index.html` (the clickable reference) and the handoff README for pixel-level intent. Do a design QA pass before shipping.
