import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const userDoc = await adminDb.collection('users').doc(session.user.uid).get();
    const userData = userDoc.data();

    if (userData?.stripeCustomerId) {
      stripeCustomerId = userData.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: { firebaseUid: session.user.uid },
      });
      stripeCustomerId = customer.id;
      await adminDb.collection('users').doc(session.user.uid).update({
        stripeCustomerId,
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL!}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL!}/billing?canceled=true`,
      metadata: {
        userId: session.user.uid,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
