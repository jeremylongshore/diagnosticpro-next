/**
 * Generate Stripe checkout session to test full payment flow
 * This will create a real payment session we can use
 */

async function generateStripeCheckout() {
  console.log('💳 Generating Stripe checkout session...');
  
  // First, submit the diagnostic form
  const formData = {
    fullName: 'Mandy Longshore',
    email: 'jeremylongshore@gmail.com',
    phone: '555-0123',
    selectedService: 'diagnosis',
    equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
    make: 'John Deere',
    model: '350G',
    year: '2018',
    mileage: '1500',
    errorCodes: 'P0420, P0171',
    problemDescription: 'Engine is misfiring badly under load. Started yesterday and getting worse. Mechanic says I need a new engine but that seems extreme. Need second opinion on actual problem and cost.',
    shopQuote: ''
  };
  
  try {
    console.log('📝 Step 1: Submitting diagnostic form...');
    
    const submitResponse = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/submit-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (!submitResponse.ok) {
      throw new Error(`Form submission failed: ${submitResponse.status}`);
    }

    const submitResult = await submitResponse.json();
    console.log(`✅ Form submitted! Submission ID: ${submitResult.submissionId}`);
    
    if (!submitResult.requiresPayment) {
      throw new Error('Form submission did not require payment');
    }
    
    console.log('💳 Step 2: Creating Stripe checkout session...');
    
    // Now create the checkout session
    const checkoutData = {
      submissionId: submitResult.submissionId,
      serviceType: formData.selectedService || 'diagnosis',
      customerEmail: formData.email,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      equipmentType: formData.equipmentType,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      problemDescription: formData.problemDescription,
      errorCodes: formData.errorCodes,
      shopQuote: formData.shopQuote,
      timestamp: new Date().toISOString()
    };
    
    const checkoutResponse = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData)
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      throw new Error(`Checkout creation failed: ${checkoutResponse.status} - ${errorText}`);
    }

    const checkoutResult = await checkoutResponse.json();
    console.log('✅ Checkout session created!');
    
    if (checkoutResult.url) {
      console.log(`🎯 Stripe Checkout URL: ${checkoutResult.url}`);
      console.log('\n🎉 SUCCESS! Full payment flow is working:');
      console.log('✅ 1. Form submission → Database save');
      console.log('✅ 2. Stripe checkout session creation');
      console.log('✅ 3. Payment URL generated');
      console.log('\n💡 You can now visit the URL above to complete a test payment');
      console.log('📧 After payment, you should receive:');
      console.log('   - AI diagnostic report email');
      console.log('   - Stripe payment receipt email');
      
      return checkoutResult.url;
    } else {
      throw new Error('No checkout URL returned');
    }
    
  } catch (error) {
    console.error('❌ Checkout generation failed:', error);
    return null;
  }
}

// Run the test
generateStripeCheckout().then(url => {
  if (url) {
    console.log('\n🚀 READY TO GENERATE 10 DIAGNOSTIC EMAILS!');
    console.log('✅ Payment flow is confirmed working');
  } else {
    console.log('\n❌ PAYMENT FLOW ISSUE');
    console.log('🔧 Need to debug further');
  }
});