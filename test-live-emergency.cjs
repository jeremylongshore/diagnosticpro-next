const { chromium } = require('playwright');

(async () => {
  console.log('🚀 DiagnosticPro Emergency Service Test - Production Environment');
  console.log('📅 Test Date:', new Date().toISOString());
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test parameters from protocol
    const testData = {
      email: 'jeremylongshore@gmail.com',
      service: 'emergency',
      equipment: '2019 Ford F-250 6.7L PowerStroke Diesel',
      vin: '1FT7W2BT5KEC24158',
      problem: "Truck started hesitating during acceleration 3 days ago. Makes a loud whistling sound from the engine bay, especially under load. Exhaust brake stopped working completely yesterday. Shop says I need a new turbo for $2,800 but I want verification before I authorize this repair.",
      errorCodes: 'P0047, P2563',
      shopEstimate: '$2,800 (Turbo replacement + labor)'
    };
    
    console.log('\n1️⃣ Accessing DiagnosticPro Production Site...');
    const startTime = Date.now();
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/', { 
      waitUntil: 'networkidle' 
    });
    console.log('✅ Site loaded in', Date.now() - startTime, 'ms');
    
    // Take screenshot of landing page
    await page.screenshot({ path: 'test-results/01-landing-page.png', fullPage: true });
    
    console.log('\n2️⃣ Selecting Emergency Service ($7.99)...');
    // Note: Prices have been updated to $7.99 for emergency
    await page.click('button:has-text("EMERGENCY - I\'m At The Shop")');
    await page.waitForTimeout(1000);
    
    console.log('\n3️⃣ Filling customer information...');
    await page.fill('input[name="name"]', 'Jeremy Longshore');
    await page.fill('input[name="email"]', testData.email);
    
    console.log('\n4️⃣ Clicking Continue to Form...');
    await page.click('button:has-text("Continue to Diagnostic Form")');
    await page.waitForNavigation();
    
    console.log('\n5️⃣ Filling diagnostic form...');
    // Fill equipment details
    await page.fill('input[placeholder*="Equipment Type"]', testData.equipment);
    await page.fill('input[placeholder*="VIN"]', testData.vin);
    
    // Fill problem description
    await page.fill('textarea[placeholder*="Describe"]', testData.problem);
    
    // Fill error codes
    await page.fill('input[placeholder*="error codes"]', testData.errorCodes);
    
    // Fill shop estimate
    await page.fill('input[placeholder*="quote"]', testData.shopEstimate);
    
    // Take screenshot before submission
    await page.screenshot({ path: 'test-results/02-form-filled.png', fullPage: true });
    
    console.log('\n6️⃣ Submitting form for AI analysis...');
    const submitTime = Date.now();
    await page.click('button:has-text("Get AI Diagnosis")');
    
    // Wait for Stripe checkout or confirmation
    await page.waitForTimeout(5000);
    
    // Check if we're on Stripe checkout
    const url = page.url();
    if (url.includes('checkout.stripe.com')) {
      console.log('✅ Redirected to Stripe checkout');
      console.log('⏱️ Time to checkout:', Date.now() - submitTime, 'ms');
      
      // Take screenshot of Stripe page
      await page.screenshot({ path: 'test-results/03-stripe-checkout.png', fullPage: true });
      
      console.log('\n7️⃣ TEST SUCCESS - Payment page reached');
      console.log('📊 Performance Metrics:');
      console.log('   - Site Load Time:', Date.now() - startTime, 'ms');
      console.log('   - Form to Checkout:', Date.now() - submitTime, 'ms');
      console.log('   - Service Type: EMERGENCY ($7.99)');
      console.log('   - Customer Email:', testData.email);
    } else {
      console.log('❌ Did not redirect to Stripe');
      console.log('Current URL:', url);
      await page.screenshot({ path: 'test-results/error-no-stripe.png', fullPage: true });
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'test-results/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n✅ Test completed');
  }
})();