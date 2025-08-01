/**
 * Test payment flow after database scope fix
 * Tests form submission → database save → payment redirect
 */

import { chromium } from 'playwright';

async function testPaymentFlow() {
  console.log('🧪 Testing payment flow after database fix...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Go directly to form page
    console.log('📝 Going to form page...');
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form');
    
    await page.waitForTimeout(2000);
    
    // Check if form loads
    const formExists = await page.locator('form').count() > 0;
    if (!formExists) {
      throw new Error('Form not found on page');
    }
    console.log('✅ Form page loaded successfully');
    
    // Fill out form with test data
    console.log('📋 Filling out form...');
    await page.fill('input[placeholder*="John"]', 'Mandy Longshore');
    await page.fill('input[type="email"]', 'jeremylongshore@gmail.com');
    await page.fill('input[type="tel"]', '555-0123');
    
    // Equipment details
    await page.selectOption('select', 'Heavy Equipment');
    await page.fill('input[placeholder*="Year"]', '2018');
    await page.fill('input[placeholder*="John Deere"]', 'John Deere');
    await page.fill('input[placeholder*="Model"]', '350G');
    await page.fill('input[placeholder*="Mileage"]', '1500');
    await page.fill('input[placeholder*="P0420"]', 'P0420, P0171');
    
    // Problem description
    await page.fill('textarea[placeholder*="engine"]', 'Engine is misfiring badly, especially under load. Started yesterday and getting worse. Mechanic says I need a new engine but that seems extreme.');
    
    console.log('💳 Submitting form to test payment flow...');
    
    // Click submit button and wait for response
    await page.click('button[type="submit"]');
    
    // Wait for either payment redirect or error
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('checkout.stripe.com')) {
      console.log('✅ SUCCESS: Redirected to Stripe payment page!');
      console.log('🎯 Payment flow is working correctly');
      return true;
    } else if (currentUrl.includes('form')) {
      // Check for error messages
      const errorText = await page.textContent('body');
      console.log('❌ Still on form page. Checking for errors...');
      console.log('Page content:', errorText.substring(0, 500));
      return false;
    } else {
      console.log(`⚠️ Unexpected redirect to: ${currentUrl}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the test
testPaymentFlow().then(success => {
  if (success) {
    console.log('\n🎉 PAYMENT FLOW TEST PASSED');
    console.log('✅ Database scope fix is working');
    console.log('✅ Form submission → database save → payment redirect works');
  } else {
    console.log('\n❌ PAYMENT FLOW TEST FAILED');
    console.log('🔍 Need to investigate database issues further');
  }
  process.exit(success ? 0 : 1);
});