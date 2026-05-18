import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@/types";

const roleHome: Record<Role, string> = {
  admin: "/admin",
  judge: "/judge",
  participant: "/participant",
  mentor: "/participant",
};

function routeRole(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/judge")) return "judge";
  if (pathname.startsWith("/participant")) return "participant";
  return null;
}

export async function updateSession(request: NextRequest) {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publishableKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321",
    publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const requiredRole = routeRole(request.nextUrl.pathname);
  const { data: { user } } = await supabase.auth.getUser();

  if (requiredRole && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const role = profile?.role as Role | undefined;
    if (request.nextUrl.pathname === "/login" && role) {
      return NextResponse.redirect(new URL(roleHome[role], request.url));
    }
    if (requiredRole && role && requiredRole !== role && !(requiredRole === "participant" && role === "mentor")) {
      return NextResponse.redirect(new URL(roleHome[role], request.url));
    }
  }

  return response;
}
