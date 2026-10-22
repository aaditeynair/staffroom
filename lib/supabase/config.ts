// Supabase credentials are read from the environment so that they can be
// inlined at build time.
//
// The fallbacks below let `next build` succeed on a fresh clone before any
// environment file exists. Without them, @supabase/ssr throws while
// prerendering the /login and /set-password routes and the build fails with
// an error that has nothing to do with the actual problem.
//
// The fallback points at a local Supabase instance, which is what the CLI
// serves by default. If you deploy without setting these, requests will fail
// to reach Supabase instead of crashing the build.

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key";
