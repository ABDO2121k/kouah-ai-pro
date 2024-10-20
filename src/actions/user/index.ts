"use server";

import { db } from "@/lib/prisma";
import { pricingPackages } from "@/data/packages";
import Stripe from "stripe";
import { Plans } from "@prisma/client";

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

const getPackageCredits = (packageIndication: string) => {
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
) => {
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

export const checkUserLimits = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true, chatBots: true },
  });

  if (!user?.subscription) throw new Error("User or subscription not found");

  const packageLimits = pricingPackages.find(
    (pkg) => pkg.indication === user?.subscription?.plan
  )?.features;
  if (!packageLimits) throw new Error("Package limits not found");

  const totalFileUsage = user.chatBots.reduce(
    (acc, bot) => acc + Number(bot.fileUsage),
    0
  );

  return {
    isWithinQueryLimit: user.subscription.credits > 0,
    isWithinBotLimit: user.chatBots.length < packageLimits.KouahAiBot,
    isWithinStorageLimit: totalFileUsage < packageLimits.maxStoragePerBot,
    remainingQueries: user.subscription.credits,
    remainingBots: packageLimits.KouahAiBot - user.chatBots.length,
    remainingStorage: packageLimits.maxStoragePerBot - totalFileUsage,
  };
};

const resetQueryNumber = async (userId: string) => {
  await db.billings.update({
    where: { userId },
    data: { queriesNumber: 0 },
  });
};

export const handleSubscriptionChange = async (
  subscription: Stripe.Subscription
) => {
  const customerId = subscription.customer as string;
  const user = await findUserByStripeId(customerId);

  if (!user) {
    console.error(`No user found with Stripe ID: ${customerId}`);
    return;
  }

  const packageIndication =
    pricingPackages.find(
      (pkg) => pkg.price === subscription.items.data[0].price.unit_amount! / 100
    )?.indication || "FREE";

  await updateUserBilling(
    user.id,
    packageIndication as Plans,
    getPackageCredits(packageIndication)
  );
  await db.user.update({
    where: { id: user.id },
    data: { stripeId: customerId },
  });
  await resetQueryNumber(user.id);

  console.log(`Subscription ${subscription.status} for user ${user.id}`);
};

export const handleSubscriptionDeleted = async (
  subscription: Stripe.Subscription
) => {
  const user = await findUserByStripeId(subscription.customer as string);

  if (!user) {
    console.error(`No user found with Stripe ID: ${subscription.customer}`);
    return;
  }

  await updateUserBilling(user.id, "FREE", getPackageCredits("FREE"));
  await resetQueryNumber(user.id);
  console.log(`Subscription deleted for user ${user.id}`);
};

export const handleInvoicePaymentSucceeded = async (
  invoice: Stripe.Invoice
) => {
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

export const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const user = await findUserByStripeId(invoice.customer as string);

  if (!user) {
    console.error(`No user found with Stripe ID: ${invoice.customer}`);
    return;
  }

  await updateUserBilling(user.id, "FREE", getPackageCredits("FREE"));
  await resetQueryNumber(user.id);
  console.log(`Payment failed for user ${user.id}, moved to free plan.`);
};

export const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  const customerId = session.customer as string;
  const user = await findUserByStripeId(customerId);

  if (!user) {
    console.error(`No user found with Stripe ID: ${customerId}`);
    return;
  }

  const amountTotal = session.amount_total! / 100; // Convert cents to dollars
  const packageIndication = pricingPackages.find(pkg => pkg.price === amountTotal)?.indication || "FREE";

  await updateUserBilling(
    user.id,
    packageIndication as Plans,
    getPackageCredits(packageIndication)
  );
  await resetQueryNumber(user.id);

  console.log(`Checkout completed for user ${user.id}, updated to plan ${packageIndication}`);
};

export const handleCheckoutSessionCanceled = async (session: Stripe.Checkout.Session) => {
  const customerId = session.customer as string;
  const user = await findUserByStripeId(customerId);

  if (!user) {
    console.error(`No user found with Stripe ID: ${customerId}`);
    return;
  }

  // Keep the user on their current plan or revert to FREE if there's an issue
  const currentPlan = user.subscription?.plan || "FREE";
  await updateUserBilling(user.id, currentPlan as Plans, getPackageCredits(currentPlan));

  console.log(`Checkout canceled for user ${user.id}, plan unchanged or reverted to FREE`);
};
