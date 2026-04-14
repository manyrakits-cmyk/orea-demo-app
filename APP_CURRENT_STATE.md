# Current App State (Reusable Context)

## 1) Architecture

- **Type:** Frontend-only React prototype (single-page, mobile-first demo).
- **Tech stack:** Vite + React, custom CSS (no backend/API).
- **Code organization:** Mostly centralized in `src/App.jsx` with styling in `src/App.css` and shell/frame in `src/index.css`.
- **Data model:** In-memory mock data (profiles, shifts, messages, emails, documents), no persistence.
- **State management:** Local component state (`useState`, `useMemo`) for:
  - active tab (`Domů`, `Zprávy`, `Více`)
  - demo role/profile toggle (Recepce / Housekeeping)
  - selected shift + bottom-sheet visibility
  - messaging panel switching and detail states
  - announcement confirmation/document status
- **Interaction model:** UI simulates real app behavior (in-app detail views), but all actions are demo behaviors.

## 2) Screens / Navigation

- **Bottom navigation (3 tabs):**
  - `Domů`
  - `Zprávy`
  - `Více`

### `Domů`

- Next shift hero block (primary quick action).
- “Needs attention” operational card.
- “Do this now” action card.
- Upcoming shifts list.
- Shift detail opened via bottom sheet.

### `Zprávy` (Communication Hub)

- 3 switchable panels:
  - `Rychlé zprávy`
    - WhatsApp-like conversation list (thread rows)
    - in-place conversation detail (`list -> detail -> back`)
  - `E-maily`
    - in-app email thread list
    - in-place email detail (`list -> detail -> back`)
  - `Hromadná sdělení`
    - broadcast notices
    - read-confirm action for critical announcements

### `Více`

- Personal summary.
- Documents (demo open/download status feedback).
- Time-off snapshot.
- Help/HR contact.

## 3) Key Product/Design Decisions

- **Demo-ready over production-ready:** No real integrations yet; behavior is simulated with realistic UX.
- **3-tab simplification:** Merged operational priorities into fewer top-level choices for low-tech users.
- **Communication centralized in one place:** Email + instant messages + broadcasts in `Zprávy`.
- **In-app reading model:** User can read emails/messages without leaving app context.
- **Role-switch demo mode:** Quick switch between Recepce and Housekeeping to show scalability of same UX.
- **Mobile framing on desktop:** Visual phone shell to present mobile intent during demos.

## 4) UX Principles Being Applied

- **Mobile-first and glanceable:** Key info visible quickly, large touch-friendly controls.
- **Low cognitive load:** Few top-level tabs, progressive disclosure for details.
- **Single clear path:** Important scenarios optimized for minimal steps.
- **Operational realism:** Language and data tailored to hotel daily workflows.
- **Consistency:** Reused interaction patterns (`list -> detail -> back`, status confirmations).
- **Demo stability:** Happy-path flows prioritized; fallback/empty-state behavior included where needed.

## 5) Current Maturity (Important Context)

- **Strong at:** UX concept validation, stakeholder demos, daily-use scenario storytelling.
- **Not yet implemented:** Real backend/API, SSO, real email/chat providers, role-based auth, audit/reporting.
- **Best positioning:** High-fidelity MVP prototype for presentation and scope alignment, not pilot/production build yet.
