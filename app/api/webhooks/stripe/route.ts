import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';
import { SUBSCRIPTION_TIERS, CREDIT_TOPUPS } from '@/lib/credits';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log('Stripe webhook event received:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('No userId in session metadata');
    return;
  }

  const mode = session.mode;

  if (mode === 'subscription') {
    // Handle subscription purchase
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date().toISOString(),
    });

    console.log(`Subscription ${subscriptionId} linked to user ${userId}`);
  } else if (mode === 'payment') {
    // Handle one-time credit top-up
    const priceId = session.line_items?.data[0]?.price?.id;
    if (!priceId) {
      console.error('No price ID found in session');
      return;
    }

    // Find which top-up tier this is
    let creditsToAdd = 0;
    for (const topup of Object.values(CREDIT_TOPUPS)) {
      if (topup.stripePriceId === priceId) {
        creditsToAdd = topup.credits;
        break;
      }
    }

    if (creditsToAdd === 0) {
      console.error('Unknown price ID:', priceId);
      return;
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const currentCredits = userData?.credits || 0;
    const currentLifetimeCredits = userData?.lifetimeCredits || 0;

    await userRef.update({
      credits: currentCredits + creditsToAdd,
      lifetimeCredits: currentLifetimeCredits + creditsToAdd,
      updatedAt: new Date().toISOString(),
    });

    console.log(`Added ${creditsToAdd} credits to user ${userId} (total: ${currentCredits + creditsToAdd})`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const userId = subscription.metadata?.userId;
  if (!userId) {
    // Try to find user by stripeSubscriptionId
    const usersSnapshot = await db
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    await updateUserSubscription(userDoc.id, subscription);
  } else {
    await updateUserSubscription(userId, subscription);
  }
}

async function updateUserSubscription(userId: string, subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    console.error('No price ID in subscription');
    return;
  }

  // Determine tier from price ID
  let tier: 'free' | 'starter' | 'pro' = 'free';
  for (const [tierKey, tierData] of Object.entries(SUBSCRIPTION_TIERS)) {
    if ('stripePriceId' in tierData && tierData.stripePriceId === priceId) {
      tier = tierKey as 'starter' | 'pro';
      break;
    }
  }

  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  const lifetimeCredits = userData?.lifetimeCredits || 0;
  const tierCredits = SUBSCRIPTION_TIERS[tier].credits;

  await userRef.update({
    subscription: tier,
    credits: tierCredits + lifetimeCredits,
    creditsRefillDate: new Date().toISOString(),
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer,
    subscriptionStatus: subscription.status,
    updatedAt: new Date().toISOString(),
  });

  console.log(`User ${userId} subscription updated to ${tier} (${tierCredits + lifetimeCredits} credits)`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const usersSnapshot = await db
    .collection('users')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error('No user found for subscription:', subscription.id);
    return;
  }

  const userDoc = usersSnapshot.docs[0];
  const userData = userDoc.data();
  const lifetimeCredits = userData?.lifetimeCredits || 0;

  await userDoc.ref.update({
    subscription: 'free',
    credits: SUBSCRIPTION_TIERS.free.credits + lifetimeCredits,
    creditsRefillDate: new Date().toISOString(),
    subscriptionStatus: 'canceled',
    updatedAt: new Date().toISOString(),
  });

  console.log(`User ${userDoc.id} downgraded to free tier`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    return; // Not a subscription invoice
  }

  // Fetch subscription to get metadata
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (subscription) {
    await handleSubscriptionUpdate(subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    return;
  }

  const usersSnapshot = await db
    .collection('users')
    .where('stripeSubscriptionId', '==', subscriptionId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error('No user found for subscription:', subscriptionId);
    return;
  }

  const userDoc = usersSnapshot.docs[0];
  await userDoc.ref.update({
    subscriptionStatus: 'past_due',
    updatedAt: new Date().toISOString(),
  });

  console.log(`User ${userDoc.id} subscription marked as past_due`);
}
