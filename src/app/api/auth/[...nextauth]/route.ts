import { db } from "@/lib/prisma";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { registerUser } from "@/actions/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      image?: string | null;
      fullName?: string | null;
    };
  }
}
const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        fullName: { label: "FullName", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.password) {
          throw new Error("No user found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile, credentials }) {
      console.log({ account, profile, credentials });
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("No email found");
        }
        await registerUser(profile.email, profile.name ?? "", "google");
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.fullName = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
};

const handler = NextAuth(options);
export { handler as GET, handler as POST };
