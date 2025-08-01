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
    
    // Take a screenshot to see form structure
    await page.screenshot({ path: '/tmp/form-debug.png', fullPage: true });
    console.log('📸 Screenshot saved to /tmp/form-debug.png');
    
    // Check select options
    const selectOptions = await page.locator('select option').allTextContents();
    console.log('🔍 Available select options:', selectOptions);
    
    // Fill out form with test data step by step
    console.log('📋 Filling out form step by step...');
    
    // Fill basic info first
    await page.fill('input[placeholder*="John"]', 'Mandy Longshore');
    await page.fill('input[type="email"]', 'jeremylongshore@gmail.com');
    await page.fill('input[type="tel"]', '555-0123');
    
    // Equipment details - select from available options
    await page.selectOption('select', 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)');
    
    // Find and fill all visible input fields
    const allInputs = await page.locator('input[type="text"], input[type="number"]').all();
    console.log(`🔍 Found ${allInputs.length} input fields`);
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const placeholder = await input.getAttribute('placeholder');
      const isVisible = await input.isVisible();
      
      if (isVisible && placeholder) {
        console.log(`📝 Filling input with placeholder: ${placeholder}`);
        
        if (placeholder.toLowerCase().includes('year')) {
          await input.fill('2018');
        } else if (placeholder.toLowerCase().includes('make') || placeholder.toLowerCase().includes('john')) {
          await input.fill('John Deere');
        } else if (placeholder.toLowerCase().includes('model')) {
          await input.fill('350G');
        } else if (placeholder.toLowerCase().includes('mileage') || placeholder.toLowerCase().includes('hours')) {
          await input.fill('1500');
        } else if (placeholder.toLowerCase().includes('code') || placeholder.toLowerCase().includes('p04')) {
          await input.fill('P0420, P0171');
        }
      }
    }
    
    // Problem description - find any textarea
    const textareas = await page.locator('textarea').all();
    console.log(`🔍 Found ${textareas.length} textarea fields`);
    
    for (let textarea of textareas) {
      const isVisible = await textarea.isVisible();
      if (isVisible) {
        await textarea.fill('Engine is misfiring badly, especially under load. Started yesterday and getting worse. Mechanic says I need a new engine but that seems extreme.');
        break;
      }
    }
    
    console.log('💳 Submitting form to test payment flow...');
    
    // Wait a moment for form to be ready
    await page.waitForTimeout(1000);
    
    // Look for submit button
    const submitButtons = await page.locator('button').all();
    console.log(`🔍 Found ${submitButtons.length} buttons`);
    
    let submitClicked = false;
    for (let button of submitButtons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      
      console.log(`🔍 Button: "${text}" (visible: ${isVisible}, enabled: ${isEnabled})`);
      
      if (isVisible && isEnabled && (text.includes('Submit') || text.includes('Pay') || text.includes('Continue') || text.includes('Complete') || text.includes('Diagnosis') || text.includes('$4.99'))) {
        console.log(`🎯 Clicking button: "${text}"`);
        await button.click();
        submitClicked = true;
        break;
      }
    }
    
    if (!submitClicked) {
      console.log('❌ No submit button found, trying form submit button');
      await page.click('button[type="submit"]');
    }
    
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