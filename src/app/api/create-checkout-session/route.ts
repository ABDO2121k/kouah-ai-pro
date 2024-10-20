import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/prisma";
import { pricingPackages } from "@/data/packages";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user by clerkId instead of id
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { packageIndication } = await request.json();

    // If user is already subscribed, create a billing portal session
    if (user.subscription?.plan !== "FREE" && user.stripeId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeId,
        return_url: `${request.headers.get("origin")}/dashboard/billing`,
      });
      return NextResponse.json({ url: session.url });
    }

    // Otherwise, create a new checkout session
    const selectedPackage = pricingPackages.find(
      (pkg) => pkg.indication === packageIndication
    );

    if (!selectedPackage) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Create a product for the package if it doesn't exist
    const product = await stripe.products.create({
      name: `${packageIndication} Package`,
    });

    // Create a recurring price for the product
    const recurringPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: selectedPackage.price * 100, // Stripe expects the amount in cents
      currency: "usd",
      recurring: { interval: "month" },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: recurringPrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.headers.get(
        "origin"
      )}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/dashboard/billing?ssss=qqq`,
      customer: user.stripeId || undefined,
      client_reference_id: user.id, // Use the internal user ID as a reference
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error in create-checkout-session:", err);
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
