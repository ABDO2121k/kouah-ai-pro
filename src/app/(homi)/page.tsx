"use server";
import Features from "@/components/home/features";
import Flow from "@/components/home/flow";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import HeroSection from "@/components/home/hero";
import Value from "@/components/home/value";
import React from "react";

const page = async () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <Flow />
      <Value />
    </>
  );
};

export default page;
