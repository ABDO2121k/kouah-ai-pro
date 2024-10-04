import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await currentUser();
  if (user) redirect("/");

  return (
    <div className="flex w-full justify-center overflow-hidden">
      <div className="w-[600px] ld:w-full flex flex-col items-start p-6">
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
        {children}
      </div>
      <div className="hidden lg:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-cream  flex-col pt-10 pl-24 gap-3">
        <h2 className="text-gravel md:text-4xl font-bold">
          Hi, I’m Kouah AI, your AI-powered business assistant!
        </h2>
        <p className="text-iridium md:text-sm mb-10">
          Kouah AI is here to streamline your workflows, automate customer
          service, and boost your productivity with cutting-edge AI solutions.{" "}
          <br />
          something never done before 😉
        </p>
        <Image
          src="/images/loginP.png"
          alt="Kouah AI interface"
          loading="lazy"
          sizes="30"
          className="absolute shrink-0 !w-[1600px] top-48 mt-5 overflow-hidden rounded-lg border-8 border-[#06b6d4]"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default Layout;
