const { chromium } = require('playwright');

async function testPaymentFlow() {
  console.log('💳 Testing payment flow...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to form page...');
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Fill out the form quickly
    console.log('📝 Filling diagnostic form...');
    await page.waitForSelector('select', { timeout: 10000 });
    
    // Select service (first button)
    await page.click('button:has-text("Equipment Diagnosis")');
    
    // Fill equipment details
    await page.selectOption('select', 'Automotive (Cars, Trucks, SUVs, Vans)');
    await page.fill('input[placeholder*="2020"]', '2018');
    await page.fill('input[placeholder*="Caterpillar"]', 'Honda');
    await page.fill('input[placeholder*="Model"]', 'Civic');
    
    // Fill problem description
    await page.fill('textarea[placeholder*="Describe what\'s wrong"]', 'Check engine light came on after oil change. Car runs rough at idle.');
    
    // Fill contact info
    await page.fill('input[placeholder*="John Smith"]', 'Mandy Longshore');
    await page.fill('input[placeholder*="john@example.com"]', 'mandy.longshore@mockuser.com');
    await page.fill('input[placeholder*="(555) 123-4567"]', '555-123-4567');
    
    console.log('✅ Form filled successfully');
    
    // Submit the form
    console.log('🚀 Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait for either redirect to Stripe or error message
    console.log('⏳ Waiting for payment redirect or response...');
    
    // Wait up to 30 seconds for either redirect or error
    const result = await Promise.race([
      // Wait for redirect to stripe.com
      page.waitForURL(/stripe\.com/, { timeout: 30000 }).then(() => 'stripe_redirect'),
      // Wait for error message
      page.waitForSelector('text=error', { timeout: 30000 }).then(() => 'error'),
      // Wait for success message
      page.waitForSelector('text=payment', { timeout: 30000 }).then(() => 'payment_page'),
      // Timeout fallback
      new Promise(resolve => setTimeout(() => resolve('timeout'), 30000))
    ]);
    
    console.log(`📊 Result: ${result}`);
    
    if (result === 'stripe_redirect') {
      console.log('🎉 SUCCESS! Redirected to Stripe checkout');
      console.log(`🔗 Current URL: ${page.url()}`);
    } else if (result === 'error') {
      console.log('❌ Error occurred during form submission');
      const errorText = await page.locator('text=error').first().textContent();
      console.log(`Error: ${errorText}`);
    } else if (result === 'timeout') {
      console.log('⏰ Timeout - checking current status...');
      console.log(`🔗 Current URL: ${page.url()}`);
      
      // Check for any alert or error messages
      const alerts = await page.locator('[role="alert"], .alert, .error').count();
      if (alerts > 0) {
        const alertText = await page.locator('[role="alert"], .alert, .error').first().textContent();
        console.log(`Alert: ${alertText}`);
      }
    }
    
    await page.screenshot({ path: '/tmp/payment-flow-result.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Error testing payment flow:', error.message);
    await page.screenshot({ path: '/tmp/payment-flow-error.png' });
  } finally {
    await browser.close();
  }
}

testPaymentFlow();