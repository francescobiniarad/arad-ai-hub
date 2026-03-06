# CLAUDE.md

Last updated: March 05, 2026

## What This App Is

Internal AI Hub for ARAD Digital (~35 people). Tracks AI initiatives: offerings, certifications, learning, R&D ideas, workshops, and more. Company employees only (Google Workspace auth, @arad.digital domain).

The app is **constantly evolving** — new sections, collections, features, and cards get added regularly. Never assume this file is the complete picture. **Always read the actual codebase** to understand what currently exists.

- **Live URL**: https://arad-ai-hub-330f5.web.app
- **Local dev**: `npm run dev` (port 3000)
- **Local with emulators**: `npm run dev:emulators` + `npm run emulators` in another terminal
- **Deploy**: `npm run deploy` (builds + deploys to Firebase Hosting)
- **Test**: `npm test`

## Tech Stack (stable)

- React 18 + TypeScript + Tailwind CSS (dark mode default)
- Firebase: Auth (Google provider, @arad.digital only), Firestore (realtime), Hosting
- Vite for bundling
- Fonts: DM Sans (body) + Space Mono (headings/mono)

## App Structure (evolving — always verify from code)

The app has a card-based home page linking to main sections. Sections contain sub-pages with tables, Kanban boards, forms, charts, and placeholders for future features.

**Before any task, read these to understand current state:**
- `src/` directory structure → what pages/components exist now
- Firestore service files → what collections are currently in use
- Home page component → what top-level sections/cards exist
- Router or navigation logic → what routes are defined

Do NOT rely on any list in this file for what sections, collections, or features exist. The code is the source of truth.

## File Structure

```
src/
├── components/     → reusable UI (tables, modals, kanban pieces, etc.)
├── pages/          → main views (one per section/sub-section)
├── services/       → Firebase helpers (auth.ts, firestore.ts)
├── types/          → shared TypeScript interfaces
public/             → static assets
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

Testing is NOT optional:
- Write/update tests for every change, even small ones
- Test both the new behavior AND regressions on existing features
- Run `npm test` and `npm run build` locally and report results
- If tests don't exist yet for the area you're changing, write them first
- Only say "done" when all tests pass and build succeeds

### 5. Firebase Rules

- **Always use emulators for local dev.** Never point to production during development.
- **Never hardcode production keys or URLs in code.**
- **Clean up Firestore listeners** — every `onSnapshot` needs an unsubscribe in the useEffect cleanup.
- **Keep queries efficient** — use existing index patterns.
- **Respect security rules** — all reads/writes require @arad.digital auth. Never bypass client-side.

### 6. Adding New Features / Sections / Collections

This app grows frequently. When adding something new:
- **Read an existing similar feature first** (e.g., before adding a new table section, read how an existing table section works)
- **Mirror the existing pattern exactly** — same component structure, same Firestore integration approach, same styling conventions
- **Add the Firestore collection** with the same listener/save patterns already in use
- **Add navigation** following the current routing/nav pattern
- **Add TypeScript types** for any new data shape
- **Update this CLAUDE.md** at the end — add a note in the "Patterns & Bug Fixes" section if you learned something new

---

## Known Patterns & Bug Fixes

### Use onBlur for Firestore saves, NOT onChange

`onChange` fires on every keystroke → floods Firestore with writes → causes cursor jumping and data races. Always use `onBlur` to save to Firestore. Keep local state with `onChange` for responsive typing, then persist on blur.

```tsx
// ✅ CORRECT
const [localVal, setLocalVal] = useState(initialVal);
<input value={localVal} onChange={e => setLocalVal(e.target.value)} onBlur={() => saveToFirestore(localVal)} />

// ❌ WRONG — causes cursor jumps and excessive writes
<input value={val} onChange={e => saveToFirestore(e.target.value)} />
```

### Realtime Listeners Pattern

```tsx
useEffect(() => {
  const unsub = onSnapshot(collection(db, 'collectionName'), (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setState(data);
  });
  return () => unsub(); // ALWAYS clean up
}, []);
```

### Error Handling

Use `react-hot-toast` for user feedback. Every Firestore operation should be wrapped in try/catch.

---

## Code Style (stable)

- Functional components + hooks only (no classes)
- `const` over `let`, never `var`
- Always type props and interfaces (TypeScript strict mode is on)
- Tailwind utility-first; inline styles only where the original prototype uses them
- PascalCase components, camelCase functions/variables, kebab-case files/folders

## Workflow For Any Task

1. **Read** — Understand what currently exists. Read the relevant files and similar features.
2. **Plan** — List what files change and what could break. Say it out loud.
3. **Confirm** — If there's any risk, ask before proceeding.
4. **Implement** — Minimal changes. Follow existing patterns.
5. **Test** — Run `npm test` and `npm run build`. Report results.
6. **Verify** — Check the feature works in the local dev server with emulators.

---

*Update this file when new patterns, bug fixes, or conventions are established.*
