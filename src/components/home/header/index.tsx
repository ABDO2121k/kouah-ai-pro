import { buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/wrapper";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <MaxWidthWrapper className="mb-12 mt-10 sm:mt-20 flex flex-col items-center justify-center text-center ">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold text-gray-700">
          Kouah ai is now public!
        </p>
      </div>
      <h1 className="max-w-4xl text-4xl font-bold md:text-5xl lg:text-6xl ">
        Transform Your Website with{" "}
        <span className="text-[#06b6d4]">AI-Powered</span> Chatbots
      </h1>
      <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
        Simplify customer support with Kouah-AI. Upload your data and let our
        custom AI chatbots handle inquiries, process orders, and provide 24/7
        assistance. Perfect for e-commerce, service platforms, and more—boost
        engagement and streamline operations effortlessly.
      </p>
      <Link
        className={cn(
          "mt-5 truncate break-words bg-[#06b6d4]",
          buttonVariants({
            className: "bg-[#06b6d4]",
          })
        )}
        href="/dashboard"
        target="_blank"
      >
        Get Started – Empower Your Business
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>{" "}
      <div className="mt-10">
        <Image
          src="/images/1.png"
          width={400}
          height={100}
          alt="Logo"
          className="max-w-lg object-contain"
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default Header;
