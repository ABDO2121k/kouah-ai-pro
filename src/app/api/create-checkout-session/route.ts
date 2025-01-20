import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

import { pricingPackages } from "@/data/packages";
import { getCurrentUserFromDb } from "@/actions/auth";

export async function POST(request: Request) {
  try {
       const user=await getCurrentUserFromDb();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { packageIndication } = await request.json();

    const selectedPackage = pricingPackages.find(
      (pkg) => pkg.indication === packageIndication
    );

    if (!selectedPackage) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // if use 3ndo deja subscription w stripeId
    if (user.stripeId) {
      const billingPortalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeId,
        return_url: `${request.headers.get("origin")}/dashboard/billing`,
      });
      return NextResponse.json({ url: billingPortalSession.url });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPackage.name,
            },
            unit_amount: selectedPackage.price * 100,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.headers.get("origin")}/dashboard/billing?success=true`,
      cancel_url: `${request.headers.get("origin")}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
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
