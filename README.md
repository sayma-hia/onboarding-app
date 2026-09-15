# Onboarding App

A multi-step onboarding flow built for the "configurable onboarding workflow" coding
challenge. The brief was pretty clear about what it didn't want: a pile of pages where
every component decides its own "next route" with an if/else. So the whole thing is
built around a small workflow engine instead, and everything else (screens, validation,
persistence) sits on top of that.

## Running it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. A few other scripts:

```bash
npm run build       # type-check + production build
npm test             # run the unit tests once
npm run test:watch   # same, in watch mode
npm run lint          # eslint
```

There's no backend to spin up — the "API" is mocked in the browser (more on that below),
so `npm run dev` is genuinely all you need.

## The shape of the problem

Personal Info → Account Type → (Personal Details **or** Company Details → Team Size) →
Preferences → Review → Complete. Individual accounts skip two screens that business
accounts need. If you go back and flip Account Type after already filling in the
business-only screens, that data needs to get cleaned up sensibly. None of this is
solvable well by hardcoding `navigate('/company')` inside a component — that's exactly
what the brief calls out, and it's the main thing I designed around.

## How it's put together

### The workflow engine (`src/workflow/steps.ts`)

This is the core of the whole architecture. Every step is a small object with two
functions on it:

```ts
personalInfo: {
  id: 'personalInfo',
  title: 'Personal Information',
  next: () => 'accountType',
  isValid: (data) => hasNoErrors(personalInfoErrors(data)),
},
accountType: {
  id: 'accountType',
  next: (data) => data.accountType.type === 'business' ? 'companyDetails' : 'personalDetails',
  isValid: (data) => hasNoErrors(accountTypeErrors(data)),
},
```

`next(data)` decides where a step leads based on the *current answers*, not on which
route you happen to be sitting on. `isValid(data)` decides whether you're allowed to
leave. Components never call either of these directly — they just dispatch `GO_NEXT` /
`GO_BACK`, and the reducer is the only thing that talks to `steps.ts`. That separation
is what makes the "20–30+ screens" scalability goal in the brief realistic: adding a new
step means adding one object to this map, not touching any existing screen.

One side effect I liked: because `next()` is just a pure function of the data, I could
write a `resolvePath(data)` that walks the graph from the start and returns the exact
sequence of steps *this* user is on. That's what drives the progress bar — an individual
account shows "Step 3 of 5", a business account shows "Step 3 of 6", and it's not a
hardcoded number anywhere, it falls out of the same config.

### State management: Context + `useReducer`

I went with plain React Context + `useReducer` over Redux Toolkit or Zustand. For a
single onboarding flow living in one provider, pulling in an external store felt like
solving a problem I didn't have — there's no state shared across unrelated parts of the
app, no time-travel debugging need, nothing Redux's middleware ecosystem buys you here.
`useReducer` already gives me the thing that actually matters for this problem: all the
transition logic (navigation, field updates, the branch-switch cleanup) lives in one
pure, testable function instead of scattered `setState` calls.

The one thing I did split on purpose: state and dispatch live in **two separate
contexts** (`onboardingContexts.ts`). A component that only needs to fire `GO_NEXT`
doesn't re-render every time a keystroke updates `data`. There's also a third, smaller
context just for `retryLoad` — the one bit of imperative, non-reducer logic (kicking off
a fetch again after a failed load), kept separate so the reducer stays pure and doesn't
need to know that a network call exists.

If this app actually grew to the 20–30+ screen scale the brief mentions, with real
async orchestration between steps (say, a step whose validity depends on a server-side
check), I'd probably reach for something like Zustand or XState at that point — but for
what's here, that would be over-building it.

### Validation

This went through a couple of iterations. Originally the Next button was just disabled
when a step was invalid — which technically satisfies "validate before continuing" but
is a bad experience, since the user has no idea *why* the button won't respond. It's
fixed now: Next is always clickable, and clicking it while the step is invalid sets an
`attemptedAdvance` flag on state (reset the moment you leave the step). Screens use that
flag to decide when to start showing inline errors, and errors clear live as soon as the
field becomes valid — no need to click Next again.

The rules themselves are layered:

- `validation.ts` has the generic, reusable primitives — `isNonEmpty`, `isValidEmail`,
  and a `lengthError(label, value, { min, max })` check.
- `fieldErrors.ts` composes those into per-field rules and owns the actual copy
  ("First name is required", "First name must be at least 2 characters"), plus a
  `FIELD_LIMITS` table with the min/max character counts per field.
- Both `steps.ts`'s `isValid()` gate and each screen's inline error message read from
  the *same* functions, so the button and the message can never say different things.
- Those same limits also get forwarded to MUI's `slotProps.htmlInput` as native
  `maxLength`/`minLength` on the actual input, so the browser stops you from typing past
  the max instead of only complaining after the fact.

### Mock API and persistence

The API is mocked with **MSW** (Mock Service Worker). `src/api/onboardingApi.ts` and
`companyTypesApi.ts` make plain `fetch()` calls to `/api/onboarding/:id` and
`/api/company-types` — nothing in that code knows it's being mocked. MSW's Service
Worker intercepts those requests in the browser before they hit the network, so the
Network tab shows real GET/PUT requests with real status codes, not just resolved
promises. `src/mocks/handlers.ts` is where the actual "server" behavior lives:
`localStorage` stands in for a database, there's an artificial delay so the loading
state is real and not just a flash, and the onboarding endpoints fail at a low random
rate on purpose, so the save-error UI actually gets exercised instead of being dead code
nobody ever sees run. `/api/company-types` (the one async-loaded screen the brief asks
for) is more deliberate about it — it fails on the *first* call of every page load,
guaranteed, so the loading → error → retry → success sequence is always reachable, not
just possible if you get unlucky.

Because the client-side API modules only ever talk in terms of `fetch()` and plain
functions, swapping MSW out for a real backend later means deleting `src/mocks/` and
changing zero call sites — the boundary was already there.

A session id gets generated once and stored in `localStorage`, so a refresh reuses the
same record instead of starting over — that's what satisfies "refreshing shouldn't lose
your progress." Every change autosaves on an 800ms debounce, with `loadStatus` /
`saveStatus` exposed through context so the UI can show a spinner, a "saved" indicator,
or a retry action without guessing at timing.

### The branch-switch decision

The brief specifically calls out: what happens if someone picks Business, fills in
Company Details and Team Size, then goes back and switches to Individual? I decided to
**clear** the now-irrelevant branch's data rather than keep it around hidden. The
alternative — quietly keeping stale Company Details data in state after switching to
Individual — means if they switch back to Business a minute later they'd see it
reappear, which feels like a feature, but it also means Review could show data from a
branch the user explicitly backed out of, if there's ever a code path that renders
partial state. Clearing it felt like the safer default; it's handled in the reducer's
`UPDATE_FIELD` case, right next to where the field itself gets written.

### UI

Material UI, with a strict black-and-white theme (see `src/theme.ts`) since that was
the ask. Worth noting for anyone reading the component code: this version of MUI's
`Stack` dropped `alignItems`/`justifyContent` as direct props — they only work through
`sx` now. Tripped me up once, so every `Stack` in this codebase uses
`sx={{ justifyContent: ..., alignItems: ... }}` instead of the shorthand props you'd see
in older MUI examples.

## What I'd still do with more time

- **Multi-tab conflicts.** The session id lives in `localStorage`, which is shared
  across tabs on the same origin. Two tabs open to the app at once will race to save
  over each other, last write wins. Fine for a single-user demo, not fine for anything
  real — would need either a `BroadcastChannel` to sync tabs or a proper backend with
  optimistic concurrency.
- **Component/integration tests.** The unit tests cover the workflow logic thoroughly
  (the reducer, the step graph, validation), which is the part most worth protecting
  since it's where the actual business rules live. I didn't get to component-level
  tests for the screens themselves.
- **Error boundary.** Nothing currently catches a render-time crash gracefully — it'd
  just be a blank screen. Worth adding for a real app.
- **Accessibility.** MUI's defaults get you a reasonable baseline (labels, ARIA on the
  radio group, etc.) but I haven't done a real audit with a screen reader.

## Testing

```bash
npm test
```

68 tests across `src/workflow/*.test.ts`, covering the reducer (navigation, the
branch-switch cleanup in both directions, `GO_TO`/`GO_BACK` history, the load/save
lifecycle, `RESET`), the step graph's `next()`/`isValid()`/`resolvePath()`, and the
validation functions. This is where I put the testing effort — it's pure logic with no
UI to mock, and it's exactly the part where a silent regression would be worst.
