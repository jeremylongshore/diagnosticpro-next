const { chromium } = require('playwright');

async function testPaymentDetailed() {
  console.log('💳 Testing payment flow with detailed error checking...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console logs and network requests
  page.on('console', msg => console.log(`🌐 Browser: ${msg.text()}`));
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`📡 API ${response.status()}: ${response.url()}`);
    }
  });
  
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
    console.log('Selecting service...');
    await page.click('button:has-text("Equipment Diagnosis")');
    
    // Fill equipment details
    console.log('Filling equipment details...');
    await page.selectOption('select', 'Automotive (Cars, Trucks, SUVs, Vans)');
    await page.fill('input[placeholder*="2020"]', '2018');
    await page.fill('input[placeholder*="Caterpillar"]', 'Honda');
    await page.fill('input[placeholder*="Model"]', 'Civic');
    
    // Fill problem description
    console.log('Filling problem description...');
    await page.fill('textarea[placeholder*="Describe what\'s wrong"]', 'Check engine light came on after oil change. Car runs rough at idle.');
    
    // Fill contact info
    console.log('Filling contact info...');
    await page.fill('input[placeholder*="John Smith"]', 'Mandy Longshore');
    await page.fill('input[placeholder*="john@example.com"]', 'mandy.longshore@mockuser.com');
    await page.fill('input[placeholder*="(555) 123-4567"]', '555-123-4567');
    
    console.log('✅ Form filled successfully');
    
    // Submit the form
    console.log('🚀 Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait a moment for submission to process
    await page.waitForTimeout(5000);
    
    console.log(`🔗 Current URL after submit: ${page.url()}`);
    
    // Check for JavaScript alert
    try {
      await page.waitForFunction(() => window.lastAlert, { timeout: 2000 });
      console.log('📢 JavaScript alert detected');
    } catch (e) {
      console.log('ℹ️ No JavaScript alert found');
    }
    
    // Check if we're still on the form page or redirected
    if (page.url().includes('stripe.com')) {
      console.log('🎉 SUCCESS! Redirected to Stripe checkout');
    } else if (page.url().includes('payment-success')) {
      console.log('✅ Redirected to payment success page');
    } else {
      console.log('⚠️ Still on form page - checking for errors');
      
      // Look for any visible error messages
      const bodyText = await page.textContent('body');
      if (bodyText.includes('error') || bodyText.includes('Error') || bodyText.includes('failed')) {
        console.log('❌ Found error text in page');
        // Get more specific error context
        try {
          const errorElements = await page.locator('text=/error|Error|failed|Failed/i').all();
          for (let i = 0; i < Math.min(errorElements.length, 3); i++) {
            const text = await errorElements[i].textContent();
            console.log(`Error ${i+1}: ${text}`);
          }
        } catch (e) {
          console.log('Could not extract specific error messages');
        }
      } else {
        console.log('ℹ️ No obvious error messages found');
      }
    }
    
    await page.screenshot({ path: '/tmp/payment-detailed-result.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Error testing payment flow:', error.message);
    await page.screenshot({ path: '/tmp/payment-detailed-error.png' });
  } finally {
    await browser.close();
  }
}

testPaymentDetailed();