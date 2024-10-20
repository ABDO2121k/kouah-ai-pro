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
    "/api/auth-callback(.*)",
    "/redirectUrl",
    "/docs(.*)",
    "/pricing(.*)",
    "/api/uploadthing(.*)", // Add this line
  ],
  ignoredRoutes: [
    "/embed(.*)",
    "/kouahBot(.*)",
    "/api/iframe(.*)",
    "/test",
    "/api/frame(.*)",
    "/api/button",
    "/test3",
    "/buttonT",
    "/frameT",
    "/favicon.ico",
    "/_next/static/chunks/(.*)",
    "/_next/static/(.*)",
    "/api/webhooks/stripe(.*)"
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
