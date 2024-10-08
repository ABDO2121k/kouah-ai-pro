"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import MobileNav from "./MobileNav";
import MaxWidthWrapper from "../wrapper";
import UserAccountNav from "./UserAccountNav";
import Image from "next/image";
import { useWindowScroll } from "@mantine/hooks";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../theme/button";
import { HoveredLink, MenuItem } from "../ui/navbar-menu";
import { useState } from "react";

interface User {
  id: string;
  fullName: string;
  given_name: string | null;
  family_name: string | null;
  email: string;
  picture: string | null;
}

const Navbar = ({
  user,
  isDashboard,
}: {
  user: User | null;
  isDashboard: boolean;
}) => {
  const [scroll] = useWindowScroll();
  const [active, setActive] = useState("");
  return (
    <nav
      className={cn(
        "sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all animate-out dark:bg-black dark:text-white",
        {
          "w-[80%] m-auto rounded-xl mt-3 bg-zinc-400/20 shadow-lg backdrop-blur-xl top-[20px] animate-in":
            scroll.y != 0 && !isDashboard,
        }
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="flex z-40 font-semibold dark:bg-white/75 dark:backdrop-blur-lg rounded-md"
          >
            <Image
              src="/images/logo.png"
              alt="LOGO"
              sizes="100vw"
              style={{
                width: "200px",
                height: "auto",
              }}
              width={0}
              height={0}
            />
          </Link>
          {/* mobile Navbar here */}
          <MobileNav
            isAuth={user && user?.id ? true : false}
            isDashboard={isDashboard}
          />
          <div className="hidden sm:flex items-center space-x-4 gap-10">
            <MenuItem active={active} setActive={setActive} item="Resources">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/blog">Blog</HoveredLink>
                <HoveredLink href="/docs">Docs</HoveredLink>
                <HoveredLink href="/about">About Us</HoveredLink>
              </div>
            </MenuItem>
            {!user || !user.email ? (
              <>
                <Link
                  href={"/pricing"}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href={"/auth/sign-in"}
                >
                  Sign In
                </Link>
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "bg-[#06b6d4]"
                  )}
                  href="/auth/sign-up"
                >
                  Get Started <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ``}
                  imageUrl={user.picture ?? ``}
                />
                {isDashboard && (
                  <div className="flex items-center space-x-4">
                    <ModeToggle />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
