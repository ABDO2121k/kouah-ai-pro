import Footer from "@/components/home/footer";
import NavBar from "@/components/Nav";
import { getServerSession } from "next-auth";
import React from "react";

interface User {
  id: string;
  fullName: string;
  given_name: string | null;
  family_name: string | null;
  email: string;
  picture: string | null;
}

export default async function HomeLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await getServerSession();

  return (
    <main className="grainy  h-full">
      <NavBar user={user?.user ?? { email: null, image: null, fullName: null }} isDashboard={false} />
      {children}
      <Footer />
    </main>
  );
}
