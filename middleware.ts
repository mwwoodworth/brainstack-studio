import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { sanitizeRedirectPath } from "@/lib/authRedirect";

const PROTECTED_ROUTES = ["/dashboard", "/settings", "/onboarding"];
const AUTH_ROUTES = ["/auth"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const onboardingCompleted = Boolean(user?.user_metadata?.bss_onboarding_completed);

  // Protect /dashboard and /settings — redirect to /auth
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !user) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && !onboardingCompleted) {
    const onboardingProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/settings");
    if (onboardingProtected) {
      const redirectUrl = new URL("/onboarding", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (user && onboardingCompleted && pathname.startsWith("/onboarding")) {
    const redirectTarget = sanitizeRedirectPath(
      request.nextUrl.searchParams.get("redirect"),
      "/dashboard"
    );
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  // Auth routes — redirect logged-in users to /dashboard
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && user) {
    const target = onboardingCompleted ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
