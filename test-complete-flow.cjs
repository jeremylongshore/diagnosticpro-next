const { chromium } = require('playwright');

(async () => {
  console.log('🚀 DiagnosticPro Complete Flow Test - Emergency Service');
  console.log('📅 Test Date:', new Date().toISOString());
  console.log('🌐 Testing Production URL: https://diagnosticpro-mvp-970547573997.us-central1.run.app/\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const testResults = {
    startTime: Date.now(),
    success: false,
    errors: [],
    performance: {}
  };
  
  try {
    // Test parameters
    const testData = {
      name: 'Jeremy Longshore',
      email: 'jeremylongshore@gmail.com',
      service: 'emergency',
      equipment: '2019 Ford F-250 6.7L PowerStroke Diesel',
      vin: '1FT7W2BT5KEC24158',
      problem: "Truck started hesitating during acceleration 3 days ago. Makes a loud whistling sound from the engine bay, especially under load. Exhaust brake stopped working completely yesterday. Shop says I need a new turbo for $2,800 but I want verification before I authorize this repair.",
      errorCodes: 'P0047, P2563',
      shopEstimate: '$2,800 (Turbo replacement + labor)'
    };
    
    console.log('1️⃣ ACCESSING PRODUCTION SITE...');
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/', { 
      waitUntil: 'networkidle' 
    });
    testResults.performance.pageLoadTime = Date.now() - testResults.startTime;
    console.log(`✅ Page loaded in ${testResults.performance.pageLoadTime}ms`);
    
    // Based on the page structure, it seems services are displayed but need selection
    // Look for clickable service elements
    console.log('\n2️⃣ SELECTING SERVICE...');
    
    // Try clicking on the emergency service div/section
    const emergencySelectors = [
      'div:has-text("EMERGENCY - I\'m At The Shop")',
      'h3:has-text("EMERGENCY - I\'m At The Shop")',
      'text=EMERGENCY - I\'m At The Shop',
      '[data-service="emergency"]',
      '.service-card:has-text("EMERGENCY")'
    ];
    
    let serviceSelected = false;
    for (const selector of emergencySelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        serviceSelected = true;
        console.log('✅ Emergency service selected');
        break;
      } catch (e) {
        // Try next selector
      }
    }
    
    // If no clickable service, the form might already be visible
    if (!serviceSelected) {
      console.log('⚠️ No clickable service elements found, checking if form is already visible...');
    }
    
    console.log('\n3️⃣ FILLING CUSTOMER INFORMATION...');
    await page.fill('input[name="name"], input[placeholder*="Name"], input[type="text"]:first-of-type', testData.name);
    await page.fill('input[name="email"], input[placeholder*="Email"], input[type="email"]', testData.email);
    console.log('✅ Customer information filled');
    
    // Take screenshot before continuing
    await page.screenshot({ path: 'test-results/01-initial-form.png', fullPage: true });
    
    console.log('\n4️⃣ CLICKING CONTINUE TO PAYMENT...');
    const continueTime = Date.now();
    await page.click('button:has-text("Continue to Payment")');
    
    // Wait for navigation or form update
    await page.waitForTimeout(2000);
    
    // Check if we're on a new page or if form expanded
    const currentUrl = page.url();
    if (currentUrl.includes('/form')) {
      console.log('✅ Navigated to form page');
      
      console.log('\n5️⃣ FILLING DIAGNOSTIC FORM...');
      // Fill equipment details
      await page.fill('input[placeholder*="Equipment"], input[placeholder*="equipment"], input[name*="equipment"]', testData.equipment);
      await page.fill('input[placeholder*="VIN"], input[name*="vin"]', testData.vin);
      
      // Fill problem description
      await page.fill('textarea[placeholder*="Describe"], textarea[placeholder*="problem"], textarea', testData.problem);
      
      // Fill error codes
      await page.fill('input[placeholder*="error"], input[placeholder*="codes"], input[name*="code"]', testData.errorCodes);
      
      // Fill shop estimate
      await page.fill('input[placeholder*="quote"], input[placeholder*="estimate"], input[name*="price"]', testData.shopEstimate);
      
      console.log('✅ Diagnostic form filled');
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/02-diagnostic-form.png', fullPage: true });
      
      console.log('\n6️⃣ SUBMITTING FOR PAYMENT...');
      const submitTime = Date.now();
      
      // Look for submit button
      const submitButtons = [
        'button:has-text("Get AI Diagnosis")',
        'button:has-text("Submit")',
        'button:has-text("Continue")',
        'button[type="submit"]'
      ];
      
      for (const selector of submitButtons) {
        try {
          await page.click(selector);
          console.log('✅ Form submitted');
          break;
        } catch (e) {
          // Try next selector
        }
      }
      
      // Wait for Stripe redirect
      await page.waitForTimeout(5000);
      
      const finalUrl = page.url();
      testResults.performance.formToCheckout = Date.now() - submitTime;
      
      if (finalUrl.includes('checkout.stripe.com')) {
        testResults.success = true;
        console.log('\n✅ SUCCESS - Redirected to Stripe checkout!');
        console.log(`⏱️ Time to checkout: ${testResults.performance.formToCheckout}ms`);
        
        // Take screenshot of Stripe page
        await page.screenshot({ path: 'test-results/03-stripe-checkout.png', fullPage: true });
      } else {
        testResults.errors.push('No Stripe redirect');
        console.log('\n❌ ERROR - Did not redirect to Stripe');
        console.log('Current URL:', finalUrl);
      }
      
    } else if (currentUrl.includes('checkout.stripe.com')) {
      // Direct to Stripe from first page
      testResults.success = true;
      testResults.performance.formToCheckout = Date.now() - continueTime;
      console.log('\n✅ SUCCESS - Redirected directly to Stripe!');
      console.log(`⏱️ Time to checkout: ${testResults.performance.formToCheckout}ms`);
      await page.screenshot({ path: 'test-results/stripe-direct.png', fullPage: true });
    } else {
      testResults.errors.push('Unexpected navigation');
      console.log('\n⚠️ Unexpected page state');
      console.log('Current URL:', currentUrl);
      await page.screenshot({ path: 'test-results/unexpected-state.png', fullPage: true });
    }
    
  } catch (error) {
    testResults.errors.push(error.message);
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'test-results/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
    
    // Generate final report
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log('Status:', testResults.success ? '✅ PASSED' : '❌ FAILED');
    console.log('Total Time:', Date.now() - testResults.startTime, 'ms');
    console.log('\nPerformance Metrics:');
    Object.entries(testResults.performance).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}ms`);
    });
    
    if (testResults.errors.length > 0) {
      console.log('\nErrors Encountered:');
      testResults.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }
    
    console.log('\nTest Configuration:');
    console.log('  - Service: Emergency ($7.99)');
    console.log('  - Customer: Jeremy Longshore');
    console.log('  - Email: jeremylongshore@gmail.com');
    console.log('='.repeat(60));
  }
})();