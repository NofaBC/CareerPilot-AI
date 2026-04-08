import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await req.json();
    const { priceId, mode } = body;

    if (!priceId || !mode) {
      return NextResponse.json(
        { error: 'Missing priceId or mode' },
        { status: 400 }
      );
    }

    // Get user data to check for existing Stripe customer
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    let customerId = userData?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email || decodedToken.email || '',
        metadata: {
          userId,
        },
      });
      customerId = customer.id;

      await userRef.update({
        stripeCustomerId: customerId,
        updatedAt: new Date().toISOString(),
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://career-pilot-ai-gamma.vercel.app';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: mode as 'subscription' | 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=canceled`,
      metadata: {
        userId,
      },
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: {
            userId,
          },
        },
      }),
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
