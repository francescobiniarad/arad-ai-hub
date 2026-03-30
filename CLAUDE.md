# CLAUDE.md

Last updated: March 30, 2026

## What This App Is

Internal AI Hub for ARAD Digital (~35 people). Tracks AI initiatives: offerings, certifications, learning, R&D ideas, workshops, and more. Company employees only (Google Workspace auth, @arad.digital domain).

The app is **constantly evolving** — new sections, collections, features, and cards get added regularly. Never assume this file is the complete picture. **Always read the actual codebase** to understand what currently exists.

- **Live URL**: https://arad-ai-hub-330f5.web.app
- **Local dev**: `npm run dev` (port auto-assigned, usually 3000–3003)
- **Local with emulators**: `npm run dev:emulators` + `npm run emulators` in another terminal
- **Deploy**: `npm run deploy` (builds + deploys to Firebase Hosting)
- **Test**: `npm test`
- **GitHub**: https://github.com/francescobiniarad/arad-ai-hub (always commit + push before deploying)

---

## Current App State (as of March 30, 2026)

### Pages & Routes

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | Card grid. AI Offering card hidden (route kept). Two cards visible: R&D + Formazione AI, centered. "Proponi" button top-right opens 4-type proposal modal. |
| `/rd` | R&D Hub | Sub-page cards: Kanban, Tabella Idee |
| `/rd/kanban` | Kanban | All streams visible incl. ARAD Model. Leader names hidden. "Formazione AI" displays as "Formazione". Streams always expanded (no toggle). Streams with substreams: header row only, no empty kanban cells. |
| `/rd/tabella` | Tabella Idee | Auto-resizing textareas. Proposals toggle buttons (top-right): 💡 Proposte Idee + 🔗 Proposte Prototipi |
| `/formazione` | Formazione AI | Sub-page cards |
| `/formazione/certificazioni` | Certificazioni | "Livello" column hidden from UI (data kept in Firestore) |
| `/formazione/practical` | Practical AI | Columns: Data, Argomento, Referente, Link Lezione (hyperlinked), Link Drive (hyperlinked). Proposals toggle (top-right): 🎓 Proposte Practical AI |
| `/formazione/workshop` | Workshop AI | Columns: Data, Argomento, Leader, Notes. Proposals toggle (top-right): 🏢 Proposte Workshop AI |
| `/formazione/materiali` | Materiali Utili | — |
| `/formazione/news` | News | — |
| `/formazione/gamification` | Gamification | — |
| `/offering` | AI Offering | Hidden from home, route still exists |
| `/proposte` | Tutte le Proposte | Full list of all proposals with per-row delete |

### Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `streams` | Kanban streams + substreams |
| `ideas` | Kanban ideas (cards) |
| `certifications` | Certifications table |
| `practical_sessions` | Practical AI sessions. Fields: date, topic, referente, lectureLink, driveLink, createdAt (serverTimestamp on create) |
| `workshops` | Workshop AI sessions. Fields: date, topic, leader, notes, createdAt (serverTimestamp on create) |
| `ai_offerings` | AI Offering table |
| `proposals` | All proposals from Proponi modal. Field: proposalType ('idea'|'prototype'|'practical'|'workshop') |
| `materiali_utili` | Materiali Utili links |
| `updates_log` | Audit trail — every save/delete logged with old+new values, userEmail, timestamp |

### Proposal System

The "Proponi" button (navbar, home page only) opens a 4-type modal:
1. **Idea** — titolo, descrizione, perche, asIs, toBe, streamId, roi, tipologia
2. **Prototipo** — prototypeLink, prototypeCosa, prototypeDescrizione, prototypeRoi
3. **Practical AI** — sessionTopic, sessionWhy, sessionTeoria, sessionPratica, sessionIsPresenter (bool), sessionWhen
4. **Workshop AI** — same fields as Practical AI

All saved to `proposals` collection with `proposalType` discriminator + `email` + `createdAt`.

Proposals are shown in collapsible tables on their dedicated pages (not on a separate route):
- Tabella Idee → Proposte Idee + Proposte Prototipi
- Practical AI → Proposte Practical AI
- Workshop AI → Proposte Workshop AI

Each proposal row is deletable via ConfirmDialog.

---

## Tech Stack (stable)

- React 18 + TypeScript + Tailwind CSS
- Firebase: Auth (Google provider, @arad.digital only), Firestore (realtime), Hosting
- Vite for bundling
- Fonts: DM Sans (body) + Space Mono (headings/mono)
- `react-hot-toast` for user feedback

---

## File Structure

```
src/
├── components/
│   ├── layout/navbar.tsx     → sticky nav, breadcrumb, Proponi button, user avatar/logout
│   └── ui/                   → Button, Input, Textarea, ConfirmDialog, Modal, etc.
├── pages/
│   ├── home.tsx              → card grid + Proponi modal (4 types)
│   ├── proposte.tsx          → full proposals list with delete
│   ├── rd/
│   │   ├── kanban.tsx
│   │   └── tabella.tsx
│   └── formazione/
│       ├── certificazioni.tsx
│       ├── practical.tsx
│       ├── workshop.tsx
│       ├── materiali.tsx
│       ├── news.tsx
│       └── gamification.tsx
├── services/
│   ├── firebase.ts           → Firebase app init
│   ├── auth.ts               → Google auth helpers
│   └── firestore.ts          → all Firestore read/write functions
└── types/index.ts            → all TypeScript interfaces
```

---

## MANDATORY RULES — Read Before Every Task

### 1. Understand Before Touching

Before writing ANY code:
- Read the components/files involved in the change
- Read adjacent components that share the same data or patterns
- Trace how data flows (state → Firestore → UI) for the feature you're modifying
- If adding a new section/collection, look at how existing ones are structured and follow the same pattern

### 2. Don't Touch What's Not Asked

Only modify what the task requires. Do NOT:
- Refactor unrelated components
- Restyle things that work fine
- "Improve" code structure unless explicitly asked
- Add dependencies unless strictly necessary

### 3. Check Side Effects Before Implementing

For every change, think through:
- Does this break any existing section's functionality (tables, kanban, forms, charts)?
- Does this break any Firestore listener or query?
- Does this break navigation, routing, or breadcrumbs?
- Does this cause a Firebase listener leak (missing cleanup in useEffect)?
- Does this affect the live app's data in any way?
- If I'm adding something new, am I following the exact same pattern as existing similar features?

If any risk exists, say so BEFORE writing code.

### 4. Test More, Break Less

- Run `npx tsc --noEmit` and `npm run build` after every change
- Only say "done" when build succeeds with no errors

### 5. Firebase Rules

- **Clean up Firestore listeners** — every `onSnapshot` needs an unsubscribe in the useEffect cleanup
- **Use onBlur for Firestore saves, NOT onChange** (see pattern below)
- **New documents**: save `createdAt: serverTimestamp()` on creation only (check `existing.exists()` first)
- **Respect security rules** — all reads/writes require @arad.digital auth

### 6. Git + Deploy Workflow

Always: commit → push to GitHub → then `npm run deploy`. Never deploy without committing first.

If Firebase auth expires: run `firebase login --reauth` then retry deploy.

---

## Known Patterns & Bug Fixes

### onBlur for Firestore saves, NOT onChange

```tsx
// ✅ CORRECT — local state on change, save on blur
onChange={(e) => handleUpdateLocal(row.id, 'field', e.target.value)}
onBlur={() => handleSave(row.id)}

// ❌ WRONG — floods Firestore, causes cursor jumps
onChange={(e) => saveToFirestore(e.target.value)}
```

### Realtime Listeners Pattern

```tsx
useEffect(() => {
  const unsub = subscribeToX((data) => setState(data));
  return unsub; // ALWAYS clean up
}, []);
```

### New Row Ordering (Practical AI / Workshop AI)

New rows must be saved to Firestore immediately on creation (so `createdAt` is set). Then sort client-side: rows without `createdAt` first (pre-existing), then by `createdAt` ascending. This prevents new rows from appearing in the middle due to UUID lexicographic ordering.

```tsx
const handleAdd = async () => {
  const newItem = { id: `x_${crypto.randomUUID()}`, ... };
  setData(prev => [...prev, newItem]);
  await saveItem(newItem); // saves createdAt: serverTimestamp()
};
// sort: no createdAt first, then ascending
.sort((a, b) => {
  if (!a.createdAt && !b.createdAt) return 0;
  if (!a.createdAt) return -1;
  if (!b.createdAt) return 1;
  return a.createdAt.getTime() - b.createdAt.getTime();
});
```

### ConfirmDialog — Always Renders at Viewport Center

`ConfirmDialog` uses `createPortal(…, document.body)` internally. This means it always renders relative to the viewport, not the page. No need to do anything special at the call site — just use `<ConfirmDialog ... />` normally. No dark backdrop (was removed intentionally).

### animate-fade-in and position:fixed

`position: fixed` inside a CSS-transformed parent becomes `position: absolute` relative to that parent. `animate-fade-in` previously ended with `transform: translateY(0)` which persisted via `fill-mode: forwards`, breaking all fixed-position dialogs after page scroll. Fixed by ending the animation with `transform: none` in `index.css`. Combined with portal in ConfirmDialog.

### Auto-Resizing Textareas (Tabella Idee)

Use a custom `AutoTextarea` component (defined inline in `tabella.tsx`) that uses `useRef` + `useEffect` to set `height = 'auto'` then `height = scrollHeight + 'px'` on value change.

### Filtering undefined from Firestore writes

```tsx
const clean = Object.fromEntries(
  Object.entries({ ...data, createdAt: serverTimestamp() }).filter(([, v]) => v !== undefined)
);
await addDoc(collection(db, 'proposals'), clean);
```

### Hidden Features (not deleted, just not shown)

- **AI Offering**: card hidden from home page grid, route `/offering` still works
- **Certificazioni Livello column**: hidden from UI, data still in Firestore
- **AI Offering card on home**: removed from grid, `<AIOfferingPage />` route kept

---

## Code Style (stable)

- Functional components + hooks only (no classes)
- `const` over `let`, never `var`
- Always type props and interfaces (TypeScript strict mode is on)
- Tailwind utility-first; inline styles only where the original prototype uses them
- PascalCase components, camelCase functions/variables, kebab-case files/folders

---

*Update this file when new patterns, bug fixes, or conventions are established.*
