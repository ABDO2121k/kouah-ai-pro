import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/auth(.*)",
    "/portal(.*)",
    "/images(.*)",
    "/bot-test",
    "/favicon.ico",
    "/noise.webp",
    "/auth-callback(.*)",
    "/redirectUrl",
    "/docs(.*)",
    "/pricing(.*)",
    // "/api/uploadthing(.*)", // Add this line
    "/api/webhooks/stripe(.*)",
    // "/dashboard",
  ],
  ignoredRoutes: [
    "/embed(.*)",
    "/kouahBot(.*)",
    "/api/iframe(.*)",
    "/test",
    "/api/frame(.*)",
    "/api/button",
    "/test3",
    "/buttonT(.*)",
    "/frameT",
    "/favicon.ico",
    "/_next/static/chunks/(.*)",
    "/_next/static/(.*)",
    "/api/chat(.*)",
    "/api/uploadThing(.*)"
  ],
});

export const config = {
  matcher: [
    "/((?!.+.[w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/api/auth-callback(.*)",
    "/(.*)",
  ],
};
