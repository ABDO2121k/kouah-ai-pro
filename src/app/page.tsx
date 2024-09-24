"use server";
import Features from "@/components/home/features";
import Flow from "@/components/home/flow";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import HeroSection from "@/components/home/hero";
import Value from "@/components/home/value";
import NavBar from "@/components/Nav";
import { currentUser } from "@clerk/nextjs";
import React from "react";

interface User {
  id: string;
  fullName: string;
  given_name: string | null;
  family_name: string | null;
  email: string;
  picture: string | null;
}

const page = async () => {
  const user = await currentUser();

  // If user is `null`, handle the undefined case or pass null to NavBar
  const userData: User | null = user
    ? {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        picture: user.imageUrl,
      }
    : null;

  return (
    <main className="grainy overflow-y-auto max-h-screen">
      <NavBar user={userData} isDashboard={false} />
      <Header />
      <HeroSection />
      <Features />
      <Flow />
      <Value />
      <Footer />
    </main>
  );
};

export default page;
