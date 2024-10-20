import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import {
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
  handleSubscriptionChange,
  handleSubscriptionDeleted,
  handleCheckoutSessionCompleted,
  handleCheckoutSessionCanceled,
} from "@/actions/user";

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
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(failedInvoice);
      break;
    case "checkout.session.expired":
      const canceledSession = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCanceled(canceledSession);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
