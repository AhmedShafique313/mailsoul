# Mailsoul — project memory

Read this at the start of every session to pick up context. Update it before ending a session whenever something material changes (per hooks.md).

**Status as of 2026-06-28**: deployed to Vercel and confirmed working end-to-end by the user (as of 2026-06-26) — no open issues or errors. Signup/signin via Better Auth, the protected `/dashboard`, and the redesigned sidebar dashboard are all live and verified on the deployed Vercel URL (after the `trustedOrigins` wildcard fix for "Invalid origin").

Since then: real Google OAuth + live Gmail integration were built and verified working locally (user confirmed sign-in/sign-up via Google succeeds and lands on `/dashboard`, logs show correct `redirect_uri` and scopes). See "Google OAuth & Gmail integration" section below — this replaces the "Not done yet" Google/Gmail items further down, which are now stale.

## Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, framer-motion, lucide-react.
- AGENTS.md warns this Next.js version may have breaking changes vs. training data — check `node_modules/next/dist/docs/` before relying on assumptions about App Router APIs (params/searchParams are async promises, etc).
- Folder split (per AGENTS.md): `src/frontend/` (components, client lib) and `src/backend/` (server lib, integrations). API routes under `src/app/api/**` stay thin and delegate to `src/backend/`.

## Auth
- **Better Auth** (not NextAuth/Auth.js — Auth.js team now points new projects to Better Auth as of 2026). Email/password AND Google OAuth are both live now. Yahoo/Microsoft buttons still exist in the UI but remain disabled ("Coming soon").
- Config: `src/backend/lib/auth.ts`. DB pool singleton: `src/backend/lib/db.ts` (pg.Pool, reused across hot reloads via `global.__mailsoulPool`).
- Route handler: `src/app/api/auth/[...all]/route.ts` (thin `toNextJsHandler` re-export). Google's OAuth callback is `/api/auth/callback/google` (Better Auth convention) — the Google Cloud Console redirect URI must match this exactly, not a custom path.
- Client: `src/frontend/lib/auth-client.ts` (`signUp`, `signIn`, `signOut`, `useSession` from `better-auth/react`). Google sign-in/sign-up both call `signIn.social({ provider: "google", callbackURL: "/dashboard" })`.
- Protected pages check session server-side via `auth.api.getSession({ headers: await headers() })` and `redirect()` if none (see `src/app/dashboard/page.tsx`).
- `trustedOrigins` includes `https://*.vercel.app` because every Vercel deploy gets a unique per-deployment URL — without the wildcard, sign-in/signup 403s with "Invalid origin" on every new deploy.
- Per-user isolation is automatic, not something bolted on: every Gmail API route re-derives the session (and thus `userId`) fresh from the request's cookies on every call, then looks up that user's own `account` row — there is no shared/global token cache, so concurrent users can never cross-read each other's inbox.

## Google OAuth & Gmail integration
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` live in `.env.local` (OAuth client created in Google Cloud Console, project `project-495cbb47-9273-4722-904`). The downloaded `client_secret_*.json` was deleted after extracting values; `client_secret*.json` is now gitignored as a safety net.
- `src/backend/lib/auth.ts` configures `socialProviders.google` with `accessType: "offline"` + `prompt: "consent"` (forces a refresh token every time) and scopes `gmail.readonly`, `gmail.send`, `gmail.modify`.
- `src/backend/integrations/gmail.ts` is the Gmail REST client: lists/parses messages into the existing `Mail` shape (`data.ts`), sends mail (raw MIME, base64url), stars/unstars, trashes, marks spam, marks read/unread, fetches per-label counts. Tokens come via Better Auth's `auth.api.getAccessToken` (auto-refreshes using the stored refresh token).
- API routes: `GET /api/gmail/messages` (folder/category/q params), `PATCH /api/gmail/messages/[id]` (`star`/`unstar`/`trash`/`spam`/`read`/`unread`), `POST /api/gmail/send` (new mail or threaded reply via `threadId`/`inReplyTo`), `GET /api/gmail/labels` (real per-folder counts).
- `DashboardView.tsx` now fetches real Gmail data instead of `data.ts`'s `initialMails` (that file's `initialMails` export is unused mock data now, kept only for the type/meta exports). Loading/error states, debounced search, optimistic star/trash/spam/read with rollback on failure.
- Known limitation: Gmail's "Snooze" has no public API, so Snoozed is a client-side-only toggle that doesn't persist across reload (commented in `gmail.ts`).
- Not yet built: the "Drafted in your tone" RAG panel is still decorative (`aiDraft: ""`, `toneMatch: 0` on real mail) — no RAG pipeline exists yet, per `concept.md`'s plan to read the Sent folder for tone-matching.

## Database
- Supabase Postgres (project ref `ysiommdcwhpwkzlogzfh`, region `ap-south-1`). Tables (`user`, `session`, `account`, `verification`) generated/migrated via `npx better-auth generate` / `migrate` (devDependency `@better-auth/cli`).
- Connection strings: `DATABASE_URL` uses the **Transaction pooler** (port 6543, `?pgbouncer=true`) for runtime/serverless. `DIRECT_URL` uses the **Session pooler** (port 5432) for migrations — the literal "Direct connection" host is IPv6-only and fails to resolve on this user's network, so the Session pooler is the IPv4-safe substitute for direct connections on Supabase.
- Migration SQL history lives in `better-auth_migrations/` at repo root — safe to commit, not executed automatically by Next.js build or Vercel deploy (only runs when someone manually runs the CLI).
- Secrets live in `.env.local` only (gitignored). Never write actual credential values into `.claude/memory.md` or other committed files — this file is not gitignored.

## Pages built so far
- `/` — landing page: Navbar, Hero (interactive unified-inbox mockup with clickable inbox tabs), ChannelLogos, Features, HowItWorks, CTA (now a "Contact us" section, id `#contact`, not a waitlist), Footer (links to /privacy, /terms).
- `/signup`, `/signin` — real Better Auth email/password forms, redirect to `/dashboard` on success.
- `/privacy`, `/terms` — static legal pages reusing Navbar/Footer.
- `/dashboard` — protected (redirects to `/signin` if no session). See below.

## Dashboard (`src/frontend/components/dashboard/`)
- **Layout**: left `Sidebar.tsx` (not a top nav — deliberate uniqueness choice), collapsible/expandable on desktop (`w-72` ↔ `w-20`), becomes an off-canvas mobile drawer with hamburger toggle. Contains: compose button, folders, inbox/provider switcher, labels, account menu/sign-out.
- Main content: slim top bar (search + mobile compose), inline `InsightsRow.tsx` stat strip (icon+value+label trios next to the greeting — deliberately NOT big cards, per user feedback that boxes felt template-y and wasted space), `CategoryTabs.tsx` (Primary/Social/Updates/Forums/Promotions, shown only when viewing the Inbox folder), then a two-pane `MailList.tsx` / `MailDetail.tsx` grid.
- `data.ts` is the source of truth for `InboxKey` (provider), `FolderKey` (Inbox/Starred/Snoozed/Sent/Drafts/All Mail/Spam/Trash), `CategoryKey`, label color types/meta. `Mail` now also has optional `threadId`/`messageId` for reply-threading. Its `initialMails` mock array is no longer used by `DashboardView` (real Gmail data replaced it) but stays in the file as a type reference.
- Mail state in `DashboardView.tsx` is fetched live from `/api/gmail/*` (see "Google OAuth & Gmail integration" above), not mock data. Star/trash/spam/read are optimistic with rollback on API failure. Snooze stays client-only (Gmail has no snooze API).
- The "Drafted in your tone" panel is still decorative/editable but doesn't call a real model — no RAG backend yet.

## Design rules (from hooks.md / user feedback)
- Dark theme: bg `#05050a`, violet→fuchsia→cyan gradient accents, glassmorphism (`border-white/10`, `bg-white/5`, `backdrop-blur-xl`), fully rounded buttons/cards, no sharp corners.
- Never use em/en dashes ("—") in frontend copy.
- Never show the word "MVP" anywhere user-facing.
- Scrollbars are always hidden (`.no-scrollbar` utility in `globals.css`) even where scrolling is functional — applies to every scrollable container in the dashboard.
- User wants every new page/screen to feel modern, creative, unique — avoid generic SaaS-template layouts (e.g. rejected plain stat-card grids in favor of an inline stat strip).

## Deployment (Vercel)
- Env vars needed in Vercel dashboard: `DATABASE_URL`, `DIRECT_URL` (optional, only used by the migration CLI, not at runtime), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- `BETTER_AUTH_URL` must be the **stable Production domain** (Vercel project → Domains tab), not a per-deployment preview hash URL (those change every deploy and will mismatch).
- No build-time DB calls; `next build` succeeds standalone. `/dashboard` and the auth API route are correctly dynamic (`ƒ`), everything else prerenders static (`○`).

## Not done yet (don't assume these exist)
- Google OAuth + Gmail integration ARE done now (see above). Still no real OAuth for Microsoft/Yahoo (UI placeholders only, disabled) — multi-channel "connect inbox" button in Sidebar is still disabled.
- No RAG pipeline yet (tone-matched AI drafts are decorative placeholders on real mail too).
- No billing/plan tiers (discussed: `plan` column on `user`, Stripe webhook later — not implemented).
- No Settings page (sidebar button is disabled "Coming soon").
- Vercel env vars still need `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` added for the deployed version, plus the Vercel production domain's `/api/auth/callback/google` added as an authorized redirect URI in Google Cloud Console (only `localhost:3000` is authorized there so far).
