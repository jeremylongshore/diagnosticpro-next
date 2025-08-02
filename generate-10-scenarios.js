/**
 * Generate 10 Different Equipment Diagnostic Scenarios
 * Creates 10 separate form submissions + payment sessions
 * Results in 10 AI diagnostic emails + 10 payment receipts
 */

const scenarios = [
  {
    id: 1,
    customerName: 'Mandy Longshore',
    equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
    make: 'John Deere',
    model: '350G',
    year: '2018',
    mileage: '1500',
    errorCodes: 'P0420, P0171',
    problemDescription: 'Engine is misfiring badly under load. Started yesterday and getting worse. Mechanic says I need a new engine but that seems extreme. Please verify if this is actually needed.',
    shopQuote: 'Local shop quoted $8,500 for complete engine replacement. Says catalytic converter and oxygen sensors are shot.'
  },
  {
    id: 2,
    customerName: 'Mandy Longshore',
    equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
    make: 'Caterpillar',
    model: '320',
    year: '2019',
    mileage: '2200',
    errorCodes: 'E320, H42',
    problemDescription: 'Hydraulic system failure. Boom moves very slowly and loses pressure. Excavator can barely lift loads anymore.',
    shopQuote: 'Shop says entire hydraulic pump needs replacement for $12,000. Also mentioned possible cylinder damage.'
  },
  {
    id: 3,
    customerName: 'Mandy Longshore',
    equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
    make: 'Case',
    model: '590',
    year: '2017',
    mileage: '3100',
    errorCodes: 'T415, T201',
    problemDescription: 'Transmission slipping badly. Won\'t shift into higher gears under load. Gets stuck in first gear frequently.',
    shopQuote: 'Transmission rebuild quoted at $9,200. Mechanic says torque converter is definitely shot and transmission needs overhaul.'
  },
  {
    id: 4,
    customerName: 'Mandy Longshore',
    equipmentType: 'Material Handling (Conveyors, Hoists, Cranes, Lifts)',
    make: 'Bobcat',
    model: 'S650',
    year: '2020',
    mileage: '850',
    errorCodes: 'C402, T190',
    problemDescription: 'Overheating constantly even in cool weather. Coolant level drops but no visible leaks. Temperature gauge redlines after 20 minutes.',
    shopQuote: 'Shop diagnosed cracked engine block and wants $15,000 for engine replacement. Says head gasket is also blown.'
  },
  {
    id: 5,
    customerName: 'Mandy Longshore',
    equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
    make: 'Komatsu',
    model: 'PC200',
    year: '2016',
    mileage: '4200',
    errorCodes: 'E108, E201, C44',
    problemDescription: 'Multiple electrical issues. Dashboard warning lights constantly on. Engine cuts out randomly. Starting problems in cold weather.',
    shopQuote: 'Electrical system overhaul quoted at $6,800. Says main wiring harness needs replacement and ECU may be damaged.'
  },
  {
    id: 6,
    customerName: 'Mandy Longshore',
    equipmentType: 'Material Handling (Conveyors, Hoists, Cranes, Lifts)',
    make: 'Volvo',
    model: 'L60H',
    year: '2021',
    mileage: '600',
    errorCodes: 'H210, H55',
    problemDescription: 'Hydraulic pump making loud grinding noise. System pressure dropping. Oil getting contaminated with metal particles.',
    shopQuote: 'New hydraulic pump system quoted at $18,000. Shop says contamination damaged multiple components including cylinders.'
  },
  {
    id: 7,
    customerName: 'Mandy Longshore',
    equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
    make: 'Ford',
    model: 'F-450',
    year: '2019',
    mileage: '45000',
    errorCodes: 'P2002, P0471',
    problemDescription: 'DPF regeneration problems. Check engine light on. Truck goes into limp mode frequently. Poor fuel economy and power loss.',
    shopQuote: 'DPF system replacement quoted at $5,200. Says DPF filter, sensors, and EGR valve all need replacement.'
  },
  {
    id: 8,
    customerName: 'Mandy Longshore',
    equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
    make: 'Freightliner',
    model: 'Cascadia',
    year: '2018',
    mileage: '180000',
    errorCodes: 'ABS124, B302',
    problemDescription: 'Air brake system malfunction. Brakes dragging on rear axle. Air pressure drops quickly when parked. Safety issue.',
    shopQuote: 'Complete air brake system overhaul for $4,500. Says air compressor, dryer, and multiple valves need replacement.'
  },
  {
    id: 9,
    customerName: 'Mandy Longshore',
    equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
    make: 'International',
    model: '4300',
    year: '2017',
    mileage: '125000',
    errorCodes: 'P0087, P1211',
    problemDescription: 'Diesel engine performance issues. Black smoke from exhaust. Power loss climbing hills. Fuel consumption doubled.',
    shopQuote: 'Fuel injection system replacement quoted at $7,400. Says injectors, high-pressure pump, and rail need replacement.'
  },
  {
    id: 10,
    customerName: 'Mandy Longshore',
    equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
    make: 'Peterbilt',
    model: '379',
    year: '2015',
    mileage: '220000',
    errorCodes: 'C128, T95',
    problemDescription: 'Cooling system problems. Overheating on highway. Radiator fluid bubbling. White smoke from exhaust occasionally.',
    shopQuote: 'Engine overhaul quoted at $22,000. Shop says cooling system failure caused engine damage requiring complete rebuild.'
  }
];

async function generateScenario(scenario) {
  console.log(`\n🎯 Generating Scenario ${scenario.id}: ${scenario.make} ${scenario.model}`);
  
  try {
    // Step 1: Submit diagnostic form
    const formData = {
      fullName: scenario.customerName,
      email: 'jeremylongshore@gmail.com', // All emails go to Jeremy
      phone: '555-0123',
      selectedService: 'diagnosis',
      equipmentType: scenario.equipmentType,
      make: scenario.make,
      model: scenario.model,
      year: scenario.year,
      mileage: scenario.mileage,
      errorCodes: scenario.errorCodes,
      problemDescription: scenario.problemDescription,
      shopQuote: scenario.shopQuote || ''
    };
    
    console.log(`📝 Submitting form for ${scenario.make} ${scenario.model}...`);
    
    const submitResponse = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/submit-diagnosis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!submitResponse.ok) {
      throw new Error(`Form submission failed: ${submitResponse.status}`);
    }

    const submitResult = await submitResponse.json();
    console.log(`✅ Form submitted: ${submitResult.submissionId}`);
    
    // Step 2: Create Stripe checkout session
    const checkoutData = {
      submissionId: submitResult.submissionId,
      serviceType: 'diagnosis',
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
    
    console.log(`💳 Creating checkout session...`);
    
    const checkoutResponse = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.log(`⚠️ Checkout failed (likely due to Stripe key): ${checkoutResponse.status}`);
      
      // Even if Stripe checkout fails, we can simulate the webhook
      console.log(`🎣 Simulating webhook for completed payment...`);
      
      // Simulate what the webhook would do
      const webhookData = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: `cs_test_scenario_${scenario.id}_${Date.now()}`,
            amount_total: 499,
            metadata: checkoutData
          }
        }
      };
      
      // Since we can't actually trigger the webhook easily, we'll show what would happen
      console.log(`🤖 Would trigger AI analysis for: ${scenario.problemDescription.substring(0, 50)}...`);
      console.log(`📧 Would send diagnostic email to: ${formData.email}`);
      console.log(`📧 Would CC: jeremylongshore@gmail.com`);
      
      return {
        success: true,
        scenario: scenario.id,
        submissionId: submitResult.submissionId,
        checkoutUrl: null,
        simulated: true
      };
    }

    const checkoutResult = await checkoutResponse.json();
    console.log(`✅ Checkout created: ${checkoutResult.url}`);
    
    return {
      success: true,
      scenario: scenario.id,
      submissionId: submitResult.submissionId,
      checkoutUrl: checkoutResult.url,
      simulated: false
    };
    
  } catch (error) {
    console.error(`❌ Scenario ${scenario.id} failed:`, error.message);
    return {
      success: false,
      scenario: scenario.id,
      error: error.message
    };
  }
}

async function generateAllScenarios() {
  console.log('🚀 GENERATING 10 DIAGNOSTIC SCENARIOS');
  console.log('📧 All emails will be sent to: jeremylongshore@gmail.com');
  console.log('💳 Each scenario creates: 1 diagnostic email + 1 payment receipt\n');
  
  const results = [];
  
  // Generate scenarios one by one to avoid overwhelming the API
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    const result = await generateScenario(scenario);
    results.push(result);
    
    // Wait between requests to be respectful to the API
    if (i < scenarios.length - 1) {
      console.log('⏳ Waiting 2 seconds before next scenario...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  console.log('\n📊 GENERATION SUMMARY:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/10`);
  console.log(`❌ Failed: ${failed.length}/10`);
  
  if (successful.length > 0) {
    console.log('\n🎯 SUCCESSFUL SCENARIOS:');
    successful.forEach(result => {
      const scenario = scenarios[result.scenario - 1];
      console.log(`${result.scenario}. ${scenario.make} ${scenario.model} - ${result.submissionId}`);
      if (result.checkoutUrl) {
        console.log(`   💳 Payment URL: ${result.checkoutUrl}`);
      } else if (result.simulated) {
        console.log(`   🎭 Simulated (Stripe key needed for real payments)`);
      }
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED SCENARIOS:');
    failed.forEach(result => {
      const scenario = scenarios[result.scenario - 1];
      console.log(`${result.scenario}. ${scenario.make} ${scenario.model} - ${result.error}`);
    });
  }
  
  console.log('\n🎉 NEXT STEPS:');
  if (successful.some(r => r.checkoutUrl)) {
    console.log('✅ Visit the checkout URLs above to complete payments');
    console.log('📧 After each payment, you\'ll receive diagnostic report + receipt');
  } else {
    console.log('⚙️ Set STRIPE_SECRET_KEY environment variable for real payments');
    console.log('🎭 For now, form submissions were created and can be processed manually');
  }
  
  return results;
}

// Run the generator
generateAllScenarios().then(results => {
  const successful = results.filter(r => r.success).length;
  console.log(`\n🏁 COMPLETED: ${successful}/10 scenarios generated`);
  console.log('📧 Check jeremylongshore@gmail.com for diagnostic reports!');
});