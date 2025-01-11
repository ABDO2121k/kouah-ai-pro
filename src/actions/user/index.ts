"use server";

import { stripe } from "@/lib/stripe";
import { pricingPackages } from "@/data/packages";
import Stripe from "stripe";
import { Plans } from "@prisma/client";
import { db } from "@/lib/prisma";
import { getUserPlan } from "@/lib/utils";


const findUserByStripeId = async (stripeId: string) => {
  return db.user.findFirst({
    where: { stripeId },
    include: { subscription: true },
  });
};


const updateUserBilling = async (
  userId: string,
  plan: Plans,
  credits: number
) => {
  await db.billings.upsert({
    where: { userId },
    update: { plan, credits },
    create: { userId, plan, credits },
  });
};


const getPackageCredits = (packageIndication: string): number => {
  return (
    pricingPackages.find((pkg) => pkg.indication === packageIndication)
      ?.features.queriesPerMonth || 0
  );
};


export const getUserSubscription = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  return user?.subscription || null;
};

export const updateUserCredits = async (
  userId: string,
  creditsUsed: number
): Promise<number> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user?.subscription) throw new Error("User or subscription not found");

  const updatedCredits = Math.max(user.subscription.credits - creditsUsed, 0);
  await db.billings.update({
    where: { userId: user.id },
    data: { credits: updatedCredits },
  });

  return updatedCredits;
};


// export const checkUserLimits = async (userId: string) => {
//   const user = await db.user.findUnique({
//     where: { id: userId },
//     include: { subscription: true, chatBots: true },
//   });

//   if (!user?.subscription) throw new Error("User or subscription not found");

//   const packageLimits = pricingPackages.find(
//     (pkg) => pkg.indication === user.subscription?.plan
//   )?.features;
//   if (!packageLimits) throw new Error("Package limits not found");

//   const totalFileUsage = user.chatBots.reduce(
//     (acc, bot) => acc + Number(bot.fileUsage),
//     0
//   );

//   return {
//     isWithinQueryLimit: user.subscription.credits > 0,
//     isWithinBotLimit: user.chatBots.length < packageLimits.KouahAiBot,
//     isWithinStorageLimit: totalFileUsage < packageLimits.maxStoragePerBot,
//     remainingQueries: user.subscription.credits,
//     remainingBots: packageLimits.KouahAiBot - user.chatBots.length,
//     remainingStorage: packageLimits.maxStoragePerBot - totalFileUsage,
//   };
// };


const resetQueryNumber = async (userId: string): Promise<void> => {
  await db.billings.update({
    where: { userId },
    data: { queriesNumber: 0 },
  });
};


export const handleSubscriptionChange = async (
  subscription: Stripe.Subscription
): Promise<void> => {
  const customerId = subscription.customer as string;
  console.log(`Handling subscription change for Stripe ID: ${customerId}`);

  const user = await db.user.findUnique({ where: { stripeId: customerId } });

  if (!user) {
    console.error(`No user found with Stripe ID: ${customerId}`);
    return;
  }

  if (subscription.cancel_at_period_end) {
    console.log(
      `Subscription set to cancel at end of period: ${subscription.id}`
    );
    await updateUserBilling(user.id, "FREE", getPackageCredits("FREE"));
    await db.user.update({
      where: { id: user.id },
      data: { stripeId: null },
    });
    console.log(
      `User ${user.id} plan updated to FREE (effective at period end) and stripeId set to null`
    );
  } else {
    const packageIndication =
      pricingPackages.find(
        (pkg) =>
          pkg.price === subscription.items.data[0].price.unit_amount! / 100
      )?.indication || "FREE";

    await updateUserBilling(
      user.id,
      packageIndication as Plans,
      getPackageCredits(packageIndication)
    );
    console.log(
      `Subscription ${subscription.status} for user ${user.id}, plan: ${packageIndication}`
    );
  }

  await resetQueryNumber(user.id);
};

export const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription
): Promise<void> => {
  const user = await findUserByStripeId(subscription.customer as string);

  if (!user) {
    console.error(`No user found with Stripe ID: ${subscription.customer}`);
    return;
  }

  await updateUserBilling(user.id, "FREE", getPackageCredits("FREE"));
  await resetQueryNumber(user.id);
  await db.user.update({
    where: { id: user.id },
    data: { stripeId: null },
  });
  console.log(
    `Subscription deleted for user ${user.id} and stripeId set to null`
  );
};


export const handleInvoicePaymentSucceeded = async (
  invoice: Stripe.Invoice
): Promise<void> => {
  const user = await findUserByStripeId(invoice.customer as string);

  if (!user) {
    console.error(`No user found with Stripe ID: ${invoice.customer}`);
    return;
  }

  await db.billings.update({
    where: { userId: user.id },
    data: { lastPaymentDate: new Date(), queriesNumber: 0 },
  });

  console.log(`Payment succeeded for user ${user.id}`);
};


export const handleInvoicePaymentFailed = async (
  invoice: Stripe.Invoice
): Promise<void> => {
  const user = await findUserByStripeId(invoice.customer as string);

  if (!user) {
    console.error(`No user found with Stripe ID: ${invoice.customer}`);
    return;
  }

  await updateUserBilling(user.id, "FREE", getPackageCredits("FREE"));
  await resetQueryNumber(user.id);
  await db.user.update({
    where: { id: user.id },
    data: { stripeId: null },
  });
  console.log(
    `Payment failed for user ${user.id}, moved to free plan and stripeId set to null`
  );
};


export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
): Promise<void> => {
  console.log(
    `Handling checkout session completed for session ID: ${session.id}`
  );

  if (!session.metadata?.userId) {
    console.error(`No userId found in session metadata`);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const packageIndication =
    pricingPackages.find(
      (pkg) => pkg.price === subscription.items.data[0].price.unit_amount! / 100
    )?.indication || "FREE";

  //kan diro update l user ila session t create with success
  await db.user.update({
    where: { id: session.metadata.userId },
    data: { stripeId: session.customer as string },
  });

  await updateUserBilling(
    session.metadata.userId,
    packageIndication as Plans,
    getPackageCredits(packageIndication)
  );
  await resetQueryNumber(session.metadata.userId);

  console.log(
    `Checkout completed for user ${session.metadata.userId}, updated to plan ${packageIndication}`
  );
};


export const handleCheckoutSessionCanceled = async (
  session: Stripe.Checkout.Session
): Promise<void> => {
  const customerId = session.customer as string;
  const user = await findUserByStripeId(customerId);

  if (!user) {
    console.error(`No user found with Stripe ID: ${customerId}`);
    return;
  }

  // Keep the user on their current plan or revert to FREE if there's an issue
  const currentPlan = user.subscription?.plan || "FREE";
  await updateUserBilling(
    user.id,
    currentPlan as Plans,
    getPackageCredits(currentPlan)
  );
  await db.user.update({
    where: { id: user.id },
    data: { stripeId: null },
  });

  console.log(
    `Checkout canceled for user ${user.id}, plan unchanged or reverted to FREE and stripeId set to null`
  );
};

export async function checkUserLimits(
  userId: string,
  action: "query" | "create_chatbot" | "file" | "web" | "youtube",
  chatbotId?: string,
  count: number = 1,
  fileSize?: bigint
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user || !user.subscription) {
    throw new Error("User or subscription not found");
  }

  const plan = getUserPlan(user);

  switch (action) {
    case "query":
      const currentQueries = user.subscription.queriesNumber;
      if (currentQueries >= plan.features.queriesPerMonth) {
        throw new Error("Monthly query limit exceeded");
      }
      break;
    case "create_chatbot":
      const currentChatbots = await db.chatBot.count({
        where: { userId: userId },
      });
      if (currentChatbots >= plan.features.KouahAiBot) {
        throw new Error("Chatbot creation limit exceeded");
      }
      break;
    case "file":
      if (!chatbotId)
        throw new Error("Chatbot ID is required for file uploads");
      const chatbot = await db.chatBot.findUnique({
        where: { id: chatbotId },
        select: { fileUsage: true },
      });
      if (!chatbot) throw new Error("Chatbot not found");
      const newTotalSize = chatbot.fileUsage + (fileSize || BigInt(0));
      if (newTotalSize > BigInt(plan.features.maxStoragePerBot)) {
        throw new Error("File storage limit exceeded");
      }
      break;
    case "web":
      if (!chatbotId)
        throw new Error("Chatbot ID is required for web page uploads");
      const currentWebPages = await db.file.count({
        where: { chatBotId: chatbotId, type: "web" },
      });
      if (currentWebPages + count > plan.features.maxWebPages) {
        throw new Error("Web page limit exceeded");
      }
      break;
    case "youtube":
      if (!chatbotId)
        throw new Error("Chatbot ID is required for YouTube video uploads");
      const currentVideos = await db.file.count({
        where: { chatBotId: chatbotId, type: "youtube" },
      });
      if (currentVideos + count > plan.features.maxYoutube) {
        throw new Error("YouTube video limit exceeded");
      }
      break;
  }
}
