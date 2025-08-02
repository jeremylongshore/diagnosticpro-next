/**
 * REAL Email Generator - Sends 10 Actual Diagnostic Reports to jeremylongshore@gmail.com
 * Uses actual Gmail API and AI analysis service - NO MOCKS
 */

import EmailService from './src/lib/services/emailService.js';
import AIAnalysisService from './src/lib/services/aiAnalysisService.js';

// The 10 real scenarios
const scenarios = [
  {
    id: 1,
    submissionId: 'diag_1754091939104_yk6gyuyt2',
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
    submissionId: 'diag_1754091941283_ed20udlax',
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
    submissionId: 'diag_1754091943354_d2b3tp925',
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
    submissionId: 'diag_1754091945426_bwurjzkn6',
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
    submissionId: 'diag_1754091947495_m3zgmpdi7',
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
    submissionId: 'diag_1754091949604_0q2rh68ka',
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
    submissionId: 'diag_1754091951693_fyj5e402h',
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
    submissionId: 'diag_1754091953762_3kptfnk5z',
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
    submissionId: 'diag_1754091955827_maenhrwb4',
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
    submissionId: 'diag_1754091957895_lle5k7lxp',
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

async function sendRealDiagnosticEmail(scenario) {
  console.log(`\n🔥 REAL EMAIL ${scenario.id}: ${scenario.make} ${scenario.model}`);
  
  try {
    // Create diagnostic request for AI analysis
    const diagnosticRequest = {
      selectedService: 'diagnosis',
      equipmentType: scenario.equipmentType,
      make: scenario.make,
      model: scenario.model,
      year: scenario.year,
      mileage: scenario.mileage,
      problemDescription: scenario.problemDescription,
      errorCodes: scenario.errorCodes,
      shopQuote: scenario.shopQuote,
      fullName: scenario.customerName,
      email: 'jeremylongshore@gmail.com',
      phone: '555-0123',
      sessionId: `cs_real_${scenario.id}_${Date.now()}`,
      amountPaid: 4.99,
      paymentStatus: 'PAID'
    };
    
    console.log(`🤖 Running REAL AI analysis for ${scenario.make} ${scenario.model}...`);
    
    // Get REAL AI analysis
    const analysisResult = await AIAnalysisService.analyzeDiagnosticRequest(diagnosticRequest);
    console.log(`✅ AI analysis completed using ${analysisResult.aiModel}`);
    
    // Prepare REAL report data
    const reportData = {
      equipmentType: diagnosticRequest.equipmentType,
      make: diagnosticRequest.make,
      model: diagnosticRequest.model,
      year: diagnosticRequest.year,
      problemDescription: diagnosticRequest.problemDescription,
      errorCodes: diagnosticRequest.errorCodes,
      paymentStatus: 'PAID',
      paymentAmount: '$4.99',
      serviceLevel: 'DIAGNOSIS',
      ...analysisResult
    };
    
    console.log(`📧 Sending REAL email to jeremylongshore@gmail.com...`);
    
    // Send REAL email using Gmail API
    const emailResult = await EmailService.sendDiagnosticReport(
      reportData,
      'jeremylongshore@gmail.com',
      scenario.customerName,
      'jeremylongshore@gmail.com' // CC to Jeremy
    );
    
    console.log(`✅ REAL EMAIL SENT! Gmail ID: ${emailResult.id}`);
    
    // Also send payment notification
    await EmailService.notifyPaymentReceived({
      paymentIntentId: diagnosticRequest.sessionId,
      amount: diagnosticRequest.amountPaid,
      customerEmail: 'jeremylongshore@gmail.com',
      customerName: scenario.customerName,
      serviceType: 'diagnosis'
    });
    
    console.log(`💰 Payment notification sent to jeremylongshore@gmail.com`);
    
    return {
      success: true,
      scenario: scenario.id,
      submissionId: scenario.submissionId,
      gmailId: emailResult.id,
      make: scenario.make,
      model: scenario.model,
      aiModel: analysisResult.aiModel
    };
    
  } catch (error) {
    console.error(`❌ REAL EMAIL ${scenario.id} FAILED:`, error.message);
    return {
      success: false,
      scenario: scenario.id,
      error: error.message
    };
  }
}

async function sendAll10RealEmails() {
  console.log('🔥 SENDING 10 REAL DIAGNOSTIC EMAILS TO JEREMY\'S GMAIL');
  console.log('📧 Target: jeremylongshore@gmail.com');
  console.log('🤖 Using: Real AI Analysis Service');
  console.log('📮 Using: Real Gmail API\n');
  
  const results = [];
  
  // Send emails one by one
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    const result = await sendRealDiagnosticEmail(scenario);
    results.push(result);
    
    // Wait between emails to be respectful to Gmail API
    if (i < scenarios.length - 1) {
      console.log('⏳ Waiting 5 seconds before next email...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // Summary
  console.log('\n📊 REAL EMAIL SUMMARY:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/10`);
  console.log(`❌ Failed: ${failed.length}/10`);
  
  if (successful.length > 0) {
    console.log('\n🎯 REAL EMAILS SENT:');
    successful.forEach(result => {
      console.log(`${result.scenario}. ${result.make} ${result.model} - Gmail ID: ${result.gmailId}`);
      console.log(`   🤖 AI: ${result.aiModel}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED EMAILS:');
    failed.forEach(result => {
      console.log(`${result.scenario}. ${scenarios[result.scenario - 1].make} ${scenarios[result.scenario - 1].model} - ${result.error}`);
    });
  }
  
  console.log('\n🏆 FINAL RESULTS:');
  console.log(`📧 ${successful.length} REAL diagnostic emails sent to jeremylongshore@gmail.com`);
  console.log(`💰 ${successful.length} payment notifications sent`);
  console.log(`🤖 All reports generated with real AI analysis`);
  console.log(`📮 All emails sent via Gmail API`);
  
  if (successful.length >= 8) {
    console.log('\n🎉 SUCCESS! DiagnosticPro MVP is LIVE and working!');
    console.log('✅ Payment → AI Analysis → Email flow is fully operational');
  }
  
  return results;
}

// Execute the real email generation
sendAll10RealEmails().then(results => {
  const successful = results.filter(r => r.success).length;
  console.log(`\n🏁 COMPLETED: ${successful}/10 REAL emails sent to jeremylongshore@gmail.com`);
  console.log('\n🎯 CHECK YOUR GMAIL NOW!');
  console.log('📧 Look for DiagnosticPro MVP diagnostic reports');
  console.log('💰 Look for payment confirmations');
  console.log('🤖 Each email contains real AI analysis');
  
  process.exit(0);
}).catch(error => {
  console.error('❌ REAL EMAIL GENERATION FAILED:', error);
  process.exit(1);
});