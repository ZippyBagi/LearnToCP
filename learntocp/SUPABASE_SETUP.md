# Supabase + Google OAuth Setup

One-time setup to make the new auth system work. Code is already in place.

## 0. Install dependencies

```bash
pnpm install
```

## 1. Create the Supabase project

1. Go to [database.new](https://database.new) and create a project (any name, e.g. `learntocp`).
2. In the dashboard: **Settings → API Keys**. Copy:
   - **Project URL** (`https://<ref>.supabase.co`)
   - **Publishable key** (`sb_publishable_...`) — create one if none exists.
3. Paste both into `.env.local`, replacing the placeholders:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 2. Connect to Vercel

1. Vercel dashboard → your project → **Settings → Integrations** (or [vercel.com/integrations/supabase](https://vercel.com/integrations/supabase)) → add the Supabase integration and link your Supabase project.
2. This auto-syncs the env vars to Vercel. Verify in **Settings → Environment Variables** that `NEXT_PUBLIC_SUPABASE_URL` exists. If the integration created `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of `..._PUBLISHABLE_KEY`, add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` manually with the publishable key value.

## 3. Create Google OAuth credentials

1. [Google Cloud Console](https://console.cloud.google.com) → create/select a project.
2. **APIs & Services → OAuth consent screen**: configure (External, app name, your email). Scopes: `email`, `profile`, `openid` (defaults are fine).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://learn-to-cp.vercel.app`
   - Authorized redirect URI (exactly this — from Supabase, not your site):
     - `https://<ref>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**.

## 4. Enable Google in Supabase

1. Supabase dashboard → **Authentication → Sign In / Providers → Google**.
2. Enable it, paste Client ID + Client Secret. Save.

## 5. Set redirect URLs in Supabase

**Authentication → URL Configuration**:

- **Site URL**: `https://learn-to-cp.vercel.app`
- **Redirect URLs** — add:
  - `http://localhost:3000/auth/callback`
  - `https://learn-to-cp.vercel.app/auth/callback`
  - `https://*-<your-vercel-team>.vercel.app/auth/callback` (optional, for preview deploys)

## 6. Test

```bash
pnpm dev
```

Visit `http://localhost:3000/en/login` → "Continue with Google" → you should land back on the site with your avatar in the navbar.

## How it works

- `lib/supabase/client.ts` — browser client (Client Components)
- `lib/supabase/server.ts` — server client (Server Components / Route Handlers)
- `lib/supabase/proxy.ts` + `proxy.ts` — refreshes the session cookie on every request; `/auth/*` excluded from locale redirects
- `app/[locale]/login/` — login page (redirects home if already signed in)
- `app/auth/callback/route.ts` — exchanges the OAuth code for a session
- `app/ui/utils/authButton.tsx` — navbar Log In button / user menu

Security note: anything that must be protected (e.g. the roadmap) gets checked server-side with `supabase.auth.getClaims()` — never trust client state or `getSession()` on the server.
