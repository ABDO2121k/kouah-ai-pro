import HomeLayout from "@/components/homeLayout/layout";
import Pricing from "@/components/Pricing";
import React from "react";

export default async function Page() {

  return (
    <HomeLayout>
      <Pricing/>
    </HomeLayout>
  );
}
