"use client";
import { Button } from "@/components/ui/moving-border";
import { WobbleCard } from "@/components/ui/wobble-card";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {KouahAiBotEmbeddLocal} from "@kouahai/embed"

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      KouahAiBotEmbeddLocal('cm1lghktm0001br0k599pwsvf');
    }
  }, [isMounted]);
  return (
    <div className="mt-5">
      <div className="flex items-center justify-center gap-5 flex-col">
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 flex gap-2 text-lg"
        >
          <Sparkles /> BENEFITS
        </Button>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold">
          Why <span className="text-[#06b6d4]">Us</span> ?
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  mx-auto w-full px-4 sm:px-10 max-w-[100%] sm:max-w-[80%] mt-10">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Kouah AI: Revolutionizing the Future of AI Technology
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              With cutting-edge features and a user base that&apos;s constantly
              growing, Kouah AI is the top choice for developers looking to
              innovate and excel.
            </p>
          </div>
          <Image
            src="/images/loginP.png"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-15 lg:-right-[40%] -bottom-10 sm:-bottom-5 object-contain rounded-2xl"
          />
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Seamless Integration, Limitless Possibilities
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Kouah AI offers a smooth integration process, enabling you to
            leverage advanced AI capabilities without the hassle.
          </p>
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Join Kouah AI Today and Accelerate Your AI Solutions!
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Experience the most advanced AI technology with Kouah AI. Sign up
              now to transform your ideas into reality.
            </p>
          </div>
          <Image
            src="/images/loginP.png"
            width={500}
            height={500}
            alt="linear demo image"
            className="absolute -right-15 md:-right-[40%] lg:-right-[20%] -bottom-10 sm:-bottom-5 object-contain rounded-2xl"
          />
        </WobbleCard>
      </div>{" "}
    </div>
  );
}
