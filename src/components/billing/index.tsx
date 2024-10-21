"use client"
import React from "react";
import { pricingPackages } from "@/data/packages";
import { Check, HelpCircle, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatFeature, getFeatureTooltip } from "@/lib/utils";
import Link from "next/link";
import SubscriptionButton from "./SubscriptionButton";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";
import { Plans } from "@prisma/client";

const Billing =  () => {
  const { chatbot } = useGetChatbot();
  console.log({ bill: chatbot?.User });

  return (
    <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <section className="mb-24">
        <div className="md:text-center mb-16">
          <h1 className="font-display text-6xl font-bold sm:text-7xl mb-4">
            Pricing
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re just trying our service or need more advanced
            features, we&apos;ve got you covered.
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <TooltipProvider>
            {pricingPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={cn("relative rounded-2xl bg-white shadow-lg", {
                  "border-2 border-primary shadow-primary/20": pkg.isPopular,
                  "border border-gray-200": !pkg.isPopular,
                })}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                    Most popular
                  </div>
                )}

                <div className="p-5">
                  <h3 className="my-3 text-center font-display text-3xl font-bold">
                    {pkg.name}
                  </h3>
                  <p className="text-muted-foreground">{pkg.indication}</p>
                  <p className="my-5 font-display text-6xl font-semibold">
                    ${pkg.price}
                    <span className="text-xl font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                </div>

                <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>
                      {pkg.features.KouahAiBot} KouahAiBot
                      {pkg.features.KouahAiBot > 1 ? "s" : ""} included
                    </p>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="cursor-default ml-1.5">
                        <HelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        Number of KouahAiBots you can create with this plan.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ul className="my-10 space-y-5 px-8">
                  {Object.entries(pkg.features).map(([key, value]) => (
                    <li key={key} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <p className="text-gray-600">
                          {formatFeature(key, value)}
                        </p>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger className="cursor-default ml-1.5">
                            <HelpCircle className="h-4 w-4 text-zinc-500" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-2">
                            {getFeatureTooltip(key)}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200" />
                <div className="p-5">
                  {pkg.price === 0 ? (
                    <Link
                      href={"/dashboard"}
                      className={buttonVariants({
                        className: "w-full",
                        variant: "secondary",
                      })}
                    >
                     Go to Dashboard
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  ) : chatbot?.User ? (
                    <SubscriptionButton
                      type={pkg.indication as Plans}
                      currentPlan={chatbot?.User?.subscription?.plan || null}
                    />
                  ) : (
                    <Link
                      href="/auth/sign-in"
                      className={buttonVariants({
                        className: "w-full",
                      })}
                    >
                      Sign up
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </TooltipProvider>
        </div>
      </section>
    </div>
  );
};

export default Billing;
