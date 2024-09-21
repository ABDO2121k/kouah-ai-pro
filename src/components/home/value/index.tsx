
import FaqAccordion from "@/components/accordion";
import MaxWidthWrapper from "@/components/wrapper";
import React from "react";

export default function Value() {
  return (
    <MaxWidthWrapper className="mt-5 mb-12 py-4">
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-zinc-800 text-center">Frequently asked questions</h2>
      </div>
      <FaqAccordion />
    </MaxWidthWrapper>
  );
}
