import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Array of public routes that don't require authentication
const publicRoutes = [
  "/auth",
  "/portal",
  "/images",
  "/bot-test",
  "/favicon.ico",
  "/noise.webp",
  "/auth-callback",
  "/redirectUrl",
  "/docs",
  "/pricing",
  "/api/webhooks/stripe",
  "/about",
  "/embed",
];

// Array of routes to be completely ignored by the middleware
const ignoredRoutes = [
  "/embed",
  "/kouahBot",
  "/api/iframe",
  "/test",
  "/api/frame",
  "/api/button",
  "/test3",
  "/buttonT",
  "/frameT",
  "/favicon.ico",
  "/_next/static",
  "/api/chat",
  "/api/uploadThing",
];

const headerProtectedRoutes = ["/api/chatbot"];

export async function middleware(request: NextRequest) {
  console.log("middleware");
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (headerProtectedRoutes.some((route) => pathname.startsWith(route))) {
    console.log("header protected route");
    const authHeader = request.headers.get("authorization");

    if (authHeader !== "abdo_is_the_best") {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized: Invalid or missing authorization header",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.next();
  }

  if (ignoredRoutes.some((route) => pathname.startsWith(route))) {
    console.log("ignored route");
    return NextResponse.next();
  }

  // Check if the path is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.log("public route");
    return NextResponse.next();
  }

  console.log("private route");
  // Get the token from the session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log({ token });
  // Redirect to login if there's no token
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes should use the middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    //had route anrddo protected 
    "/api/chatbot/:path*",

  ],
};
