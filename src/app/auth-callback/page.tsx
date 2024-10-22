// "use client"
// import { onCompleteUserRegistrationGoogle } from "@/actions/auth";
// import { Loader } from "@/components/loader";
// import { currentUser } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// // interface PageParams {
// //   userType: "owner" | "student";
// // }

// // export default async function SSOCallback() {
// //   // { params }: { params: PageParams }
// //   // const { userType } = params;
// //   const user = await currentUser();
// //   console.log({ user });
// //   if (user && user.id) {
// //     const response = await onCompleteUserRegistrationGoogle(
// //       user.emailAddresses[0]?.emailAddress || "",
// //       `${user.firstName} ${user.lastName}`,
// //       user.id,
// //       "owner"
// //     );
// //     console.log({ response });
// //     if (response.status !== 400) {
// //       redirect("/dashboard");
// //     } else {
// //       redirect("/");
// //     }
// //   }
// //   return (
// //     <div className="h-100 w-100 flex items-center justify-center">
// //       <Loader loading={true}>
// //         <>Loading ...</>
// //       </Loader>
// //     </div>
// //   );
// // }

// // app/after-sign-in/page.tsx
// import { useEffect } from "react";
// import { useAuth, useSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// export default function AfterSignInPage() {
//   const { isLoaded: authLoaded, isSignedIn } = useAuth();
//   const { isLoaded: signInLoaded } = useSignIn();
//   const router = useRouter();

//   useEffect(() => {
//     // Wait for authentication to be loaded
//     if (!authLoaded || !signInLoaded) {
//       return;
//     }

//     // If user is signed in, redirect to the complete URL (dashboard)
//     if (isSignedIn) {
//       router.push("/dashboard");
//     } else {
//       // If sign in failed, redirect back to sign in page
//       router.push("/sign-in");
//     }
//   }, [authLoaded, signInLoaded, isSignedIn, router]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <h1>Processing your sign in...</h1>
//         {/* Optional: Add a loading spinner */}
//         <div className="mt-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// export default function SSOCallback() {

//   return (
//     <AuthenticateWithRedirectCallback
//       afterSignInUrl="/dashboard"
//       afterSignUpUrl="/dashboard"
//       redirectUrl="/sso-callback"
//     />
//   );
// }

// "use client";

// import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function SSOCallback() {
//   const router = useRouter();
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (!isRedirecting) {
//         setIsRedirecting(true);
//         router.push("/dashboard");
//       }
//     }, 2000); // 5 seconds timeout

//     return () => clearTimeout(timeoutId);
//   }, [router, isRedirecting]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <AuthenticateWithRedirectCallback
//         afterSignInUrl="/dashboard"
//         afterSignUpUrl="/dashboard"
//         redirectUrl="/sso-callback"
//       />
//       <p className="mt-4 text-lg">Completing authentication, please wait...</p>
//       {isRedirecting && (
//         <p className="mt-2 text-sm">Redirecting to dashboard...</p>
//       )}
//     </div>
//   );
// }

"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to dashboard after a short delay
  //   const timer = setTimeout(() => {
  //     router.push("/dashboard");
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AuthenticateWithRedirectCallback />
      <p className="mt-4 text-lg">Completing authentication, please wait...</p>
    </div>
  );
}
