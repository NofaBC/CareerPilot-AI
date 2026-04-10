import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  try {
    // Check if env var exists
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'STRIPE_SECRET_KEY not found in environment variables',
        hasKey: false 
      }, { status: 500 });
    }

    // Check key format
    const keyPreview = process.env.STRIPE_SECRET_KEY.substring(0, 8) + '...';
    
    // Try to initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    // Try to list products (simple API call to verify connection)
    const products = await stripe.products.list({ limit: 1 });

    return NextResponse.json({ 
      success: true,
      keyFormat: keyPreview,
      stripeConnected: true,
      productsFound: products.data.length,
      testPassed: true
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      type: error.type,
      code: error.code,
      testPassed: false
    }, { status: 500 });
  }
}
