"use client";
import { Button } from "@/components/ui/button";
import { useSignInForm } from "@/hooks/sign-in/use-sign-in";
import Google from "@/icons/Google";

const GoogleButton = () => {
  const { loading, handleGoogleSignIn } = useSignInForm();
  return (
    <Button
      onClick={handleGoogleSignIn}
      type="button"
      className="flex items-center w-full justify-center gap-2 bg-white text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-colors"
    >
      <Google className="w-5 h-5" />
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleButton;
