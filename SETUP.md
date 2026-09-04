# External setup

## Google login

1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview) and create or select a project.
2. Configure the consent screen. Choose **External** unless every user belongs to one Google Workspace organization. While the app is in testing, add the Google accounts allowed to sign in as test users.
3. Create an OAuth client with application type **Web application**.
4. Add these authorized redirect URIs exactly:

```text
http://localhost:3000/api/auth/callback/google
https://diogomota.com/api/auth/callback/google
```

Add the equivalent exact URI for a stable `*.vercel.app` domain if you will use it for login. Dynamic preview URLs are not configured by default.

5. Copy the generated client ID and client secret.

## Local environment

Copy `.env.example` to `.env.local`, generate `AUTH_SECRET` with `npm exec auth secret`, then fill in:

```env
AUTH_SECRET=generated-random-secret
AUTH_GOOGLE_ID=google-client-id
AUTH_GOOGLE_SECRET=google-client-secret
AUTH_TRUST_HOST=true
```

`AUTH_TRUST_HOST` is needed locally. Vercel detects and trusts its host automatically. Never commit `.env.local`.

## Vercel

1. Import this repository into Vercel. Next.js is detected automatically.
2. Add `diogomota.com` under **Project > Settings > Domains**.
3. Under **Project > Settings > Environment Variables**, add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`. Enable them for Production and any other environment where login should work.
4. Redeploy after adding or changing environment variables.

You can also link and pull the development values locally:

```bash
vercel link
vercel env pull .env.local
```

The current POC uses encrypted JWT sessions and no database. Add one shared database and Auth.js adapter when the apps need persistent user data.

References: [Auth.js Google provider](https://authjs.dev/getting-started/providers/google), [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server), [Vercel environment variables](https://vercel.com/docs/environment-variables).
