import { Global } from "@/components/about/Global";
import { Team } from "@/components/about/Me";
import HomeLayout from "@/components/homeLayout/layout";
import React from "react";

const page = () => {
  return (
    <HomeLayout>
      <Global />
      <Team/>
    </HomeLayout>
  );
};

export default page;
