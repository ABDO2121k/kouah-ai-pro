"use client";
import { cn } from "@/lib/utils";
import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  Blocks,
  Code,
  FileBarChartIcon,
  Headset,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/moving-border";

export default function Features() {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-center gap-5 flex-col">
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 flex gap-2 text-lg"
        >
          <Sparkles /> FEATURES
        </Button>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold text-center">
          Powerful <span className="text-[#06b6d4]">AI</span> Features
        </h1>
      </div>
      <BentoGrid className="max-w-full px-10 mx-auto md:auto-rows-[20rem] mt-5">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};
const SkeletonThree = () => {
  const first = {
    initial: {
      x: -5,
      rotate: 2,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        className="h-full w-full  bg-black p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 "
        variants={first}
      >
        <code className="text-white w-full h-full p-3 ">
          {`        <script type="module">
              import { KouahAiBotEmbedd } from "https://cdn.jsdelivr.net/npm/@kouahai/frame@2.0.18";
              KouahAiBotEmbedd("your kouahAIBot Id");
            </script>
          `}
        </code>
      </motion.div>
    </motion.div>
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/4 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/images/woocomerce.webp"
          alt="avatar"
          height="100"
          width="100"
          className="h-100 w-100 "
        />
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <Image
          src="/images/shopify-logo.webp"
          alt="avatar"
          height="100"
          width="100"
          className="h-100 w-100 "
        />
      </motion.div>
      <motion.div className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center hidden md:flex">
        <Image
          src="/images/youcan.webp"
          alt="avatar"
          height="100"
          width="100"
          className="h-100 w-100 "
        />
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/images/html.webp"
          alt="avatar"
          height="100"
          width="100"
          className="h-100 w-100 "
        />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Instant customer service. 24/7.",
    description: (
      <span className="text-sm">
        Get instant customer service with Kouah chatbot.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-2",
    icon: <Headset className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Automated Proofreading",
    description: (
      <span className="text-sm">
        Let AI handle the proofreading of your documents.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <FileBarChartIcon className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Seamlessly emded to your website",
    description: (
      <span className="text-sm">
        Easily embed Kouah chatbot to your website with a single line of code.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <Code className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Multiple Integrations",
    description: (
      <span className="text-sm">
        Kouah AI seamlessly integrates with various platforms and tools to
        enhance your business workflow. Whether you are using WordPress,
        WooCommerce, or YouCan, Kouah AI provides smooth and efficient
        connectivity for all your business needs.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <Blocks className="h-4 w-4 text-neutral-500" />,
  },
];
