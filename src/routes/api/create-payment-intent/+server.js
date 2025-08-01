/**
 * DiagnosticPro MVP - Stripe Payment Intent API
 * Creates payment intents for diagnostic services using Google Cloud
 */

import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here', {
  apiVersion: '2023-10-16'
});

export async function POST({ request }) {
  try {
    console.log('💳 Creating Stripe payment intent...');
    
    const { amount, currency = 'usd', serviceType, customerInfo, diagnosticData } = await request.json();
    
    // Validate required fields
    if (!amount || !customerInfo?.email || !serviceType) {
      return json(
        { success: false, error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Create payment intent with metadata for later processing
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        serviceType,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name || 'Unknown',
        equipmentType: diagnosticData?.equipmentType || 'Unknown',
        timestamp: new Date().toISOString(),
        source: 'diagnosticpro-mvp'
      },
      receipt_email: customerInfo.email,
      description: `DiagnosticPro ${serviceType} service - ${diagnosticData?.equipmentType || 'Equipment'} diagnosis`
    });

    console.log(`✅ Payment intent created: ${paymentIntent.id} for $${amount}`);

    return json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount
    });

  } catch (error) {
    console.error('❌ Failed to create payment intent:', error);
    
    return json(
      { 
        success: false, 
        error: 'Failed to create payment. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}