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
    "/api/uploadthing",
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
    // "/api/uploadthing"
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
