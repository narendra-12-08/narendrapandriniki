import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/control")) {
    return NextResponse.next();
  }

  // Expose pathname to server components so the layout can decide whether
  // to render admin chrome (sidebar) — used to suppress it on /control/login
  // even when a stale auth cookie exists.
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set("x-pathname", pathname);

  if (
    pathname === "/control/login" ||
    pathname === "/control" ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next({ request: { headers: forwardHeaders } });
  }

  let response = NextResponse.next({
    request: { headers: forwardHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/control/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/control/:path*"],
};
