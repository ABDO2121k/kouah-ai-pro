import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import {handleInvoicePaymentFailed, handleInvoicePaymentSucceeded, handleSubscriptionChange, handleSubscriptionDeleted} from "@/actions/user"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;
    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(deletedSubscription);
      break;
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(failedInvoice);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

