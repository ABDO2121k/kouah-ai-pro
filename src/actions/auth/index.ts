"use server";

import { db as client } from "@/lib/prisma";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

export const onCompleteUserRegistration = async (
  email: string,
  fullName: string,
  clerkId: string,
  type: string
) => {
  try {
    const registered = await client.user.create({
      data: {
        email,
        fullName,
        clerkId,
        type,
        subscription: {
          create: {},
        },
      },
      select: {
        fullName: true,
        id: true,
        type: true,
      },
    });

    if (registered) {
      return { status: 200, user: registered };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const onLoginUser = async () => {
  const user = await currentUser();
  if (!user) redirectToSignIn();
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          fullName: true,
          id: true,
          type: true,
        },
      });
      if (authenticated) {
        // const domains = await onGetAllAccountDomains()
        return { status: 200, user: authenticated };
      }
    } catch (error) {
      return { status: 400 };
    }
  }
};



export const onCompleteUserRegistrationGoogle = async(
  email: string,
  fullName: string,
  clerkId: string,
  userType: "owner" | "student"
) => {
  try {
    const userExists = await client.user.findFirst({
      where: { email: email },
    });
    if (!userExists) {
      await onCompleteUserRegistration(
        email,
        fullName,
        clerkId,
        userType 
      );
      return {status:200}
    }
    return {status:202}
  } catch (err) {
    return { status: 400 };
  }
};
