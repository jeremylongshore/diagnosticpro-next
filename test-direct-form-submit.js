/**
 * Test form submission by directly triggering the form submit event
 * This bypasses UI issues and tests the actual form logic
 */

import { chromium } from 'playwright';

async function testDirectFormSubmit() {
  console.log('🧪 Testing direct form submission...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Intercept network requests
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`📤 ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`📥 ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    // Go to form page
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form');
    await page.waitForTimeout(2000);
    
    // Select service first
    const serviceButton = await page.locator('button').filter({ hasText: /Equipment Diagnosis.*\$4\.99/ }).first();
    if (await serviceButton.count() > 0) {
      await serviceButton.click();
      await page.waitForTimeout(500);
    }
    
    // Fill form using JavaScript execution to ensure all fields are set
    await page.evaluate(() => {
      // Fill all input fields directly
      const fullNameInput = document.querySelector('input[placeholder*="John"], input[name="fullName"]');
      if (fullNameInput) fullNameInput.value = 'Mandy Longshore';
      
      const emailInput = document.querySelector('input[type="email"]');
      if (emailInput) emailInput.value = 'jeremylongshore@gmail.com';
      
      const phoneInput = document.querySelector('input[type="tel"]');
      if (phoneInput) phoneInput.value = '555-0123';
      
      // Equipment type
      const selectElement = document.querySelector('select');
      if (selectElement) {
        selectElement.value = 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)';
        selectElement.dispatchEvent(new Event('change'));
      }
      
      // Fill other inputs
      const yearInput = document.querySelector('input[placeholder*="2020"], input[placeholder*="Year"]');
      if (yearInput) yearInput.value = '2018';
      
      const makeInput = document.querySelector('input[placeholder*="John Deere"], input[placeholder*="Make"]');
      if (makeInput) makeInput.value = 'John Deere';
      
      const modelInput = document.querySelector('input[placeholder*="Model"]');
      if (modelInput) modelInput.value = '350G';
      
      const mileageInput = document.querySelector('input[placeholder*="hours"], input[placeholder*="miles"]');
      if (mileageInput) mileageInput.value = '1500';
      
      const codesInput = document.querySelector('input[placeholder*="P0"], input[placeholder*="code"]');
      if (codesInput) codesInput.value = 'P0420, P0171';
      
      // Problem description
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.value = 'Engine is misfiring badly under load. Mechanic says I need new engine but seems extreme. Please verify.';
      
      // Trigger input events to notify Svelte
      const allInputs = document.querySelectorAll('input, select, textarea');
      allInputs.forEach(input => {
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
    
    console.log('✅ Form filled via JavaScript');
    
    // Wait a moment for Svelte to process the changes
    await page.waitForTimeout(1000);
    
    // Now trigger the form submission directly
    console.log('🚀 Triggering form submission...');
    
    const submitResult = await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        // Create and dispatch a submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        return form.dispatchEvent(submitEvent);
      }
      return false;
    });
    
    console.log(`📋 Form submit event dispatched: ${submitResult}`);
    
    // Wait for redirect or response
    await page.waitForTimeout(10000);
    
    const currentUrl = page.url();
    console.log(`📍 Final URL: ${currentUrl}`);
    
    if (currentUrl.includes('checkout.stripe.com')) {
      console.log('✅ SUCCESS! Redirected to Stripe checkout');
      return true;
    } else {
      console.log('❌ No redirect to Stripe');
      
      // Check for any console errors
      const errors = await page.evaluate(() => {
        return window.console.errors || [];
      });
      
      if (errors.length > 0) {
        console.log('❌ JavaScript errors:', errors);
      }
      
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
testDirectFormSubmit().then(success => {
  if (success) {
    console.log('\n🎉 DIRECT FORM SUBMISSION SUCCESSFUL!');
    console.log('✅ Ready to generate 10 diagnostic emails');
  } else {
    console.log('\n❌ FORM SUBMISSION STILL FAILING');
    console.log('🔧 May need to check form validation or API');
  }
  process.exit(success ? 0 : 1);
});