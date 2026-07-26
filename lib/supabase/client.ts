import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components. Uses the publishable key —
 * safe to expose to the browser, every query it makes is gated by RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
