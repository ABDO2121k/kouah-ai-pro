import Footer from "@/components/home/footer";
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

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

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
    <main className="grainy  h-full">
      <NavBar user={userData} isDashboard={false} />
      {children}
      <Footer />
    </main>
  );
}
