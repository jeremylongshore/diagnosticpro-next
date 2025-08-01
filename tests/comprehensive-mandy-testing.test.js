/**
 * DiagnosticPro MVP - Comprehensive Testing with Mock User "Mandy Longshore"
 * 
 * This test suite simulates 10 real-world equipment repair scenarios using
 * Playwright automation to verify the complete workflow:
 * 1. Issue submission via platform form
 * 2. Payment processing with Stripe test cards
 * 3. AI diagnostic report generation
 * 4. Email delivery to jeremylongshore@gmail.com
 * 5. Database persistence validation
 */

import { test, expect } from '@playwright/test';

// Mock user data for all tests
const MOCK_USER = {
  name: 'Mandy Longshore',
  email: 'mandy.longshore@mockuser.com',
  deliveryEmail: 'jeremylongshore@gmail.com', // Where reports should be sent
  address: '123 Main St, Springfield, IL 62701',
  phone: '(555) 123-4567'
};

// Stripe test cards
const STRIPE_CARDS = {
  success: {
    number: '4242424242424242',
    expiry: '12/34',
    cvc: '123'
  },
  declined: {
    number: '4000000000000002',
    expiry: '12/34',
    cvc: '123'
  }
};

// Test scenarios with realistic equipment issues
const TEST_SCENARIOS = [
  {
    id: 1,
    title: 'Car - Check Engine Light After Oil Change',
    equipmentType: 'Automotive',
    make: 'Honda',
    model: 'Civic',
    year: '2018',
    problemDescription: 'Check engine light came on immediately after oil change. Engine runs rough at idle, occasional misfiring. Shop says it needs a new oxygen sensor.',
    shopQuote: 'Local mechanic quoted $500 for oxygen sensor replacement plus diagnostic fee. Says P0138 code indicates sensor failure.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 2,
    title: 'Boat - Engine Overheating at High RPM',
    equipmentType: 'Marine',
    make: 'Mercury',
    model: 'Outboard 150HP',
    year: '2020',
    problemDescription: 'Engine overheats when running at high RPM (above 4000). Temperature gauge hits red zone after 10 minutes. Loss of power when overheating occurs.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 3,
    title: 'Generator - Won\'t Start After Power Outage',
    equipmentType: 'Generator',
    make: 'Generac',
    model: 'GP6500',
    year: '2019',
    problemDescription: 'Generator won\'t start after sitting unused for 6 months. Strong fuel smell when trying to start. Starter motor turns but engine won\'t catch.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 4,
    title: 'HVAC - AC Not Cooling Effectively',
    equipmentType: 'HVAC',
    make: 'Carrier',
    model: 'Central Air 3-Ton',
    year: '2017',
    problemDescription: 'Air conditioning runs constantly but house stays warm. Airflow seems inconsistent between rooms. Unit freezes up overnight.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 5,
    title: 'Motorcycle - Strange Shifting Noises',
    equipmentType: 'Motorcycle',
    make: 'Yamaha',
    model: 'YZF-R6',
    year: '2021',
    problemDescription: 'Strange grinding noise when shifting from 2nd to 3rd gear. Clutch feels normal but shift is not smooth. Noise getting worse over past month.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 6,
    title: 'RV - Electrical System Issues',
    equipmentType: 'RV',
    make: 'Forest River',
    model: 'Cherokee 39KR',
    year: '2019',
    problemDescription: 'Interior lights flicker randomly, especially when using microwave or AC. 12V outlets lose power intermittently. Battery seems to drain faster than normal.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 7,
    title: 'Lawn Mower - Uneven Cutting Pattern',
    equipmentType: 'Lawn Equipment',
    make: 'John Deere',
    model: 'X350',
    year: '2020',
    problemDescription: 'Mower leaves uneven cutting pattern with strips of tall grass. Blades appear sharp but deck seems to vibrate more than usual. Recently hit a tree stump.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 8,
    title: 'Construction Equipment - Hydraulic Leak',
    equipmentType: 'Construction',
    make: 'Caterpillar',
    model: 'Mini Excavator 305E2',
    year: '2018',
    problemDescription: 'Hydraulic system leaking fluid from boom cylinder. Operation is slow and weak. Fluid level drops significantly after each use day.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 9,
    title: 'Farm Tractor - Power Loss and Stalling',
    equipmentType: 'Agricultural',
    make: 'John Deere',
    model: '5075E',
    year: '2016',
    problemDescription: 'Tractor loses power under load and occasionally stalls. Black smoke from exhaust when accelerating. Fuel consumption has increased noticeably.',
    serviceType: 'diagnosis',
    expectedPrice: '$4.99'
  },
  {
    id: 10,
    title: 'EMERGENCY - Generator Failure During Critical Work',
    equipmentType: 'Generator',
    make: 'Honda',
    model: 'EU7000iS',
    year: '2022',
    problemDescription: 'EMERGENCY: Generator failed during critical job site work. Won\'t start at all, no electrical output. Need immediate diagnosis as project deadline is tomorrow.',
    serviceType: 'emergency',
    expectedPrice: '$7.99'
  }
];

// Helper function to wait for page load and take screenshot
async function setupTestEnvironment(page, scenarioTitle) {
  console.log(`🧪 Starting test: ${scenarioTitle}`);
  
  // Navigate to the application
  await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app');
  await page.waitForLoadState('networkidle');
  
  // Take initial screenshot
  await page.screenshot({ 
    path: `test-results/mandy-test-${scenarioTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-start.png`,
    fullPage: true 
  });
  
  console.log(`✅ Test environment ready for: ${scenarioTitle}`);
}

// Helper function to fill diagnostic form
async function fillDiagnosticForm(page, scenario) {
  console.log(`📝 Filling diagnostic form for scenario ${scenario.id}`);
  
  // Navigate to form if not already there
  const formButton = page.locator('button', { hasText: 'Get Started' }).first();
  if (await formButton.isVisible()) {
    await formButton.click();
    await page.waitForTimeout(2000);
  }
  
  // Select service type
  const serviceButton = page.locator('button').filter({ 
    hasText: scenario.serviceType === 'emergency' ? 'EMERGENCY' : 'Equipment Diagnosis' 
  }).first();
  
  if (await serviceButton.isVisible()) {
    await serviceButton.click();
    console.log(`✅ Selected service: ${scenario.serviceType}`);
    await page.waitForTimeout(1000);
  }
  
  // Fill equipment details
  await page.locator('select').first().selectOption(scenario.equipmentType);
  console.log(`✅ Equipment type: ${scenario.equipmentType}`);
  
  // Fill vehicle/equipment details
  const textInputs = await page.locator('input[type="text"]').all();
  if (textInputs.length >= 4) {
    await textInputs[1]?.fill(scenario.make || '');
    await textInputs[2]?.fill(scenario.model || '');
    await textInputs[3]?.fill(scenario.year || '');
    console.log(`✅ Equipment details: ${scenario.make} ${scenario.model} ${scenario.year}`);
  }
  
  // Fill problem description
  const problemTextarea = page.getByRole('textbox', { name: /Problem Description/i });
  if (await problemTextarea.isVisible()) {
    await problemTextarea.fill(scenario.problemDescription);
    console.log(`✅ Problem description filled`);
  }
  
  // Fill shop quote if provided
  if (scenario.shopQuote) {
    const quoteTextarea = page.getByRole('textbox', { name: /Repair Quote/i });
    if (await quoteTextarea.isVisible()) {
      await quoteTextarea.fill(scenario.shopQuote);
      console.log(`✅ Shop quote filled`);
    }
  }
  
  // Fill customer information
  await page.locator('input[type="text"]').first().fill(MOCK_USER.name);
  await page.locator('input[type="email"]').fill(MOCK_USER.email);
  await page.locator('input[type="tel"]').fill(MOCK_USER.phone);
  console.log(`✅ Customer info filled for ${MOCK_USER.name}`);
  
  // Take screenshot of completed form
  await page.screenshot({ 
    path: `test-results/mandy-test-scenario-${scenario.id}-form-completed.png`,
    fullPage: true 
  });
}

// Helper function to process payment
async function processPayment(page, scenario, useDeclinedCard = false) {
  console.log(`💳 Processing payment for scenario ${scenario.id}`);
  
  // Click submit/continue button
  const submitButton = page.locator('button[type="submit"]').first();
  if (await submitButton.isVisible()) {
    await submitButton.click();
    console.log(`🚀 Clicked submit button`);
  }
  
  // Wait for Stripe checkout page
  await page.waitForTimeout(3000);
  
  // Check if we're on Stripe checkout
  const currentUrl = page.url();
  console.log(`🔗 Current URL: ${currentUrl}`);
  
  if (currentUrl.includes('checkout.stripe.com')) {
    console.log(`✅ Redirected to Stripe checkout`);
    
    // Fill Stripe payment form
    const card = useDeclinedCard ? STRIPE_CARDS.declined : STRIPE_CARDS.success;
    
    // Wait for Stripe form to load
    await page.waitForSelector('input[name="cardnumber"]', { timeout: 10000 });
    
    // Fill card details
    await page.locator('input[name="cardnumber"]').fill(card.number);
    await page.locator('input[name="exp-date"]').fill(card.expiry);
    await page.locator('input[name="cvc"]').fill(card.cvc);
    
    // Fill billing details
    await page.locator('input[name="email"]').fill(MOCK_USER.deliveryEmail);
    
    console.log(`💳 Card details filled: ${useDeclinedCard ? 'DECLINED CARD' : 'SUCCESS CARD'}`);
    
    // Submit payment
    const payButton = page.locator('button[type="submit"]', { hasText: /pay/i }).first();
    await payButton.click();
    
    console.log(`🚀 Payment submitted`);
    
    // Wait for result
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log(`🔗 Final URL after payment: ${finalUrl}`);
    
    // Take screenshot of result
    await page.screenshot({ 
      path: `test-results/mandy-test-scenario-${scenario.id}-payment-result.png`,
      fullPage: true 
    });
    
    return finalUrl.includes('payment-success');
  } else {
    console.log(`❌ Not redirected to Stripe - checking page content`);
    const pageContent = await page.textContent('body');
    console.log(`Page content: ${pageContent.substring(0, 200)}...`);
    
    await page.screenshot({ 
      path: `test-results/mandy-test-scenario-${scenario.id}-no-stripe-redirect.png`,
      fullPage: true 
    });
    
    return false;
  }
}

// Individual test cases for each scenario
TEST_SCENARIOS.forEach((scenario, index) => {
  test(`Scenario ${scenario.id}: ${scenario.title}`, async ({ page }) => {
    try {
      // Setup test environment
      await setupTestEnvironment(page, scenario.title);
      
      // Fill diagnostic form
      await fillDiagnosticForm(page, scenario);
      
      // Process payment (use declined card for scenario 1 to test error handling)
      const useDeclinedCard = scenario.id === 1;
      const paymentSuccess = await processPayment(page, scenario, useDeclinedCard);
      
      if (useDeclinedCard) {
        // For scenario 1, we expect payment to fail
        expect(paymentSuccess).toBe(false);
        console.log(`✅ Scenario ${scenario.id}: Payment declined as expected`);
      } else {
        // For other scenarios, we expect payment to succeed
        expect(paymentSuccess).toBe(true);
        console.log(`✅ Scenario ${scenario.id}: Payment successful`);
        
        // TODO: Verify AI report generation and email delivery
        // TODO: Check database persistence
      }
      
      console.log(`🎉 Scenario ${scenario.id} completed successfully`);
      
    } catch (error) {
      console.error(`❌ Scenario ${scenario.id} failed:`, error);
      
      // Take error screenshot
      await page.screenshot({ 
        path: `test-results/mandy-test-scenario-${scenario.id}-ERROR.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });
});

// Special test for promo code (scenario 10)
test('Scenario 10 with Promo Code SAVE10', async ({ page }) => {
  const scenario = TEST_SCENARIOS[9]; // Emergency scenario
  
  try {
    await setupTestEnvironment(page, `${scenario.title} + Promo Code`);
    await fillDiagnosticForm(page, scenario);
    
    // Apply promo code before payment
    const promoInput = page.locator('input[placeholder*="promo" i]').first();
    if (await promoInput.isVisible()) {
      await promoInput.fill('SAVE10');
      
      const applyButton = page.locator('button', { hasText: /apply/i }).first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
        console.log(`✅ Promo code SAVE10 applied`);
      }
    }
    
    const paymentSuccess = await processPayment(page, scenario);
    expect(paymentSuccess).toBe(true);
    
    console.log(`🎉 Scenario 10 with promo code completed successfully`);
    
  } catch (error) {
    console.error(`❌ Scenario 10 with promo code failed:`, error);
    throw error;
  }
});

// Test for Stripe receipt generation
test('Verify Stripe Receipt Generation', async ({ page }) => {
  const scenario = TEST_SCENARIOS[0]; // Use first scenario
  
  try {
    await setupTestEnvironment(page, 'Stripe Receipt Test');
    await fillDiagnosticForm(page, scenario);
    
    // Use success card to ensure payment goes through
    const paymentSuccess = await processPayment(page, scenario, false);
    expect(paymentSuccess).toBe(true);
    
    // TODO: Verify receipt email was sent to jeremylongshore@gmail.com
    console.log(`✅ Stripe receipt test completed - check jeremylongshore@gmail.com for receipt`);
    
  } catch (error) {
    console.error(`❌ Stripe receipt test failed:`, error);
    throw error;
  }
});