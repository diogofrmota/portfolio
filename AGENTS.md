# AGENTS.md

## Project

This repository is the Next.js App Router site for `diogomota.com`. Use React and follow the existing project structure. Keep changes focused, readable, responsive, and accessible.

## Non-negotiable UI boundary

There are two intentionally simple public pages:

- `/` (`diogomota.com`)
- `/apps` (`diogomota.com/apps`)

Preserve their current minimal, text-first UI: dark background, monospace typography, compact centered content, plain links, and bracketed navigation. Do not turn either page into a dashboard, marketing page, card grid, or highly styled product surface. Do not add decorative gradients, large navigation bars, hero sections, illustrations, or animations to these two pages unless explicitly requested.

Everything beyond those two public pages should use a clean, modern React UI. This includes:

- Login and registration screens
- Authentication dialogs opened from `/apps`
- Every individual app, including `/tvsync`, `/couple-planner`, and `/fithub`
- New authenticated/product routes added later

The authentication dialog may look modern because it is part of the auth experience, but the `/apps` page visible behind it must retain its simple design.

## Design direction for auth and apps

- Build polished product interfaces with clear hierarchy, deliberate spacing, modern typography, and cohesive color and surface systems.
- Prefer reusable React components over duplicated markup.
- Give each app an interface suited to its purpose; do not force the minimal portfolio styling onto product screens.
- Keep visual choices restrained and intentional. Avoid generic template aesthetics, excessive effects, and unnecessary animation.
- Make all screens responsive from mobile through desktop.
- Include complete interaction states: hover, focus, active, disabled, loading, empty, error, and success where relevant.
- Use semantic HTML, visible keyboard focus, meaningful labels, and sufficient color contrast.
- Keep login and registration visually consistent with each other and make the current mode unmistakable.

## Styling isolation

The simple public pages and the modern product UI must be able to evolve independently.

- Do not add broad global element styles that unintentionally redesign `/` or `/apps`.
- Keep `app/globals.css` limited to resets, shared foundations, and the styles intentionally used by the simple public shell.
- Scope modern auth and app styles to route-specific wrappers, CSS Modules, or dedicated component styles.
- When changing shared layouts, verify that `/` and `/apps` still look simple and unchanged.

## Architecture and behavior

- Prefer Server Components by default. Add `'use client'` only when a component needs browser APIs, local state, effects, or event handlers.
- Keep authentication and authorization checks on the server. Protected routes must remain protected and should redirect unauthenticated users to `/login`.
- Reuse shared auth actions and components rather than implementing separate login behavior per app.
- Preserve callback destinations so users return to the app they selected after authenticating.
- Treat login and registration as two presentation modes of the same Google-based authentication flow unless the product requirements change.
- Do not change authentication providers, environment variables, or deployment configuration without an explicit requirement.
- Do not expose secrets or commit `.env.local`.

## Current route map

- `app/page.js`: simple public homepage; preserve its visual language.
- `app/apps/page.js` and `app/apps/apps-client.js`: simple public app directory; preserve its visual language apart from the auth dialog.
- `app/login/page.js`: modern login/register experience.
- `app/(protected)/layout.js`: server-side authentication boundary and shared authenticated shell.
- `app/(protected)/*`: modern app experiences.

## Validation

For UI work:

1. Run `npm run build` and resolve errors introduced by the change.
2. Check `/` and `/apps` at mobile and desktop widths to confirm their simple UI was preserved.
3. Check login, registration, the `/apps` auth dialog, and affected app routes at mobile and desktop widths.
4. Verify keyboard navigation, focus visibility, dialog close behavior, and authentication redirects.
5. Preserve unrelated user changes already present in the working tree.
