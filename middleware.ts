import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

// Next.js 15.5: the file/export convention is still `middleware.ts` /
// `middleware()`. The `proxy.ts` rename only takes effect from v16.0.0 —
// using it on this version would be silently ignored (no build error, no
// session refresh, no route protection at all). Revisit on the next major.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
