import Stripe from "stripe";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_A || "", {
  //   apiVersion: '202-08-16',
  typescript: true,
});
