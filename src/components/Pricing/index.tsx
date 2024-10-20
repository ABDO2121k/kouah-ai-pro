import React from "react";
import { pricingPackages } from "@/data/packages";
import { CircleCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatFeature, formatFileSize } from "@/lib/utils";

const Billing = () => {

  return (
    <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <section className="mb-24">
        <div className="md:text-center mb-16">
          <h1 className="font-display text-5xl mb-4">Simple pricing.</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Use KouahAI for free. Upgrade to enable custom domains and more
            advanced features.
          </p>
          {/* Subscription toggle can be added here if needed */}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {pricingPackages.map((pkg, index) => (
            <section
              key={pkg.name}
              className={`relative flex flex-col border bg-card p-6 shadow-lg dark:border-gray-800 rounded-3xl ${
                pkg.isPopular
                  ? "z-10 border-none ring-4 ring-ring/80"
                  : "border-gray-200"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute right-6 top-0 z-10 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-base text-muted-foreground mb-4">
                {pkg.indication}
              </p>
              <p className="text-4xl font-light tracking-tight mb-6">
                <span>$</span>
                <span>{pkg.price}</span>
              </p>
              <ul className="flex-grow space-y-3 text-sm mb-6">
                {Object.entries(pkg.features).map(([key, value]) => (
                  <li key={key} className="flex items-center">
                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500 mr-2" />
                    <span>{formatFeature(key, value)}</span>
                  </li>
                ))}
              </ul>
              <a
                href={"/billing"}
                className={`inline-flex justify-center items-center rounded-full text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 ${
                  pkg.isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Get started
              </a>
            </section>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold lg:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Use KouahAI for free. Upgrade to enable custom domains and more
            advanced features.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-2xl mx-auto"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>How does KouahAI work?</AccordionTrigger>
            <AccordionContent>
              KouahAI uses advanced AI technology to provide intelligent chatbot
              solutions...
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I use KouahAI?</AccordionTrigger>
            <AccordionContent>
              To use KouahAI, simply sign up for an account and follow our easy
              setup guide...
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we take data security very seriously. All data is encrypted
              and stored securely...
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="text-center text-muted-foreground mt-8">
          Can&apos;t find the answer you&apos;re looking for? Reach out to our
          <a
            href="mailto:support@kouah.ai"
            className="font-semibold text-primary hover:underline"
          >
            {" "}
            customer support team.
          </a>
        </p>
      </section>

      {/* Call to action */}
      <section className="text-center">
        <h2 className="font-display text-4xl font-semibold sm:text-5xl mb-4">
          Get started for <span className="text-primary">free</span>
        </h2>
        <p className="text-muted-foreground mb-8">
          No credit card required. Cancel anytime.
        </p>
        <a
          href="/auth/sign-up"
          className="inline-flex items-center justify-center rounded-full text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          Start for free
        </a>
      </section>
    </div>
  );
};

//eslint-disable-next-line


export default Billing;
