/**
 * Debug form submission issue
 * Tests why clicking submit doesn't trigger payment redirect
 */

import { chromium } from 'playwright';

async function debugFormSubmission() {
  console.log('🔍 Debugging form submission issue...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Intercept network requests to see what happens
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`📤 API Request: ${request.method()} ${request.url()}`);
      if (request.method() === 'POST') {
        console.log('📦 Request body:', request.postData());
      }
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`📥 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  // Log console messages from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser console error:', msg.text());
    }
  });
  
  try {
    // Go to form page
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form');
    await page.waitForTimeout(2000);
    
    // Check if we need to select a service first
    const serviceButtons = await page.locator('button').filter({ hasText: /Equipment Diagnosis.*\$4\.99/ }).all();
    if (serviceButtons.length > 0) {
      console.log('🎯 Found service selection button, clicking it...');
      await serviceButtons[0].click();
      await page.waitForTimeout(1000);
    }
    
    // Now fill the form
    console.log('📝 Filling form fields...');
    
    // Personal info
    await page.fill('input[name="fullName"], input[placeholder*="John"]', 'Mandy Longshore');
    await page.fill('input[type="email"]', 'jeremylongshore@gmail.com');
    await page.fill('input[type="tel"]', '555-0123');
    
    // Equipment type
    await page.selectOption('select', 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)');
    await page.waitForTimeout(500);
    
    // Equipment details
    const inputs = await page.locator('input[type="text"], input[type="number"]').all();
    for (let input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      const name = await input.getAttribute('name');
      const value = await input.inputValue();
      
      if (!value && placeholder) {
        if (placeholder.includes('2020') || placeholder.includes('Year')) {
          await input.fill('2018');
        } else if (placeholder.includes('John Deere') || placeholder.includes('Make')) {
          await input.fill('John Deere');
        } else if (placeholder.includes('Model')) {
          await input.fill('350G');
        } else if (placeholder.includes('hours') || placeholder.includes('miles')) {
          await input.fill('1500');
        } else if (placeholder.includes('P0') || placeholder.includes('code')) {
          await input.fill('P0420, P0171');
        }
      }
    }
    
    // Problem description
    const textareas = await page.locator('textarea').all();
    for (let textarea of textareas) {
      await textarea.fill('Engine is misfiring badly under load. Mechanic says I need new engine but seems extreme. Please verify.');
    }
    
    console.log('✅ Form filled, looking for submit button...');
    
    // Find the actual submit button
    const buttons = await page.locator('button').all();
    for (let button of buttons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      
      if (isVisible && text.includes('Get AI Diagnosis')) {
        console.log(`🎯 Found submit button: "${text}"`);
        
        // Check if button has onclick handler
        const onclick = await button.getAttribute('onclick');
        const type = await button.getAttribute('type');
        console.log(`📍 Button type: ${type}, onclick: ${onclick}`);
        
        // Try clicking with force
        console.log('🖱️ Clicking submit button...');
        await button.click({ force: true });
        break;
      }
    }
    
    // Wait for navigation or API call
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(5000);
    
    // Check current URL
    const finalUrl = page.url();
    console.log(`📍 Final URL: ${finalUrl}`);
    
    if (finalUrl.includes('checkout.stripe.com')) {
      console.log('✅ SUCCESS! Redirected to Stripe checkout');
      return true;
    } else {
      // Check for any error messages on the page
      const bodyText = await page.textContent('body');
      if (bodyText.includes('error') || bodyText.includes('Error')) {
        console.log('❌ Error found on page');
      }
      
      // Take a screenshot for debugging
      await page.screenshot({ path: '/tmp/form-submission-debug.png', fullPage: true });
      console.log('📸 Debug screenshot saved to /tmp/form-submission-debug.png');
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the debug test
debugFormSubmission().then(success => {
  if (success) {
    console.log('\n🎉 FORM SUBMISSION WORKING!');
    console.log('✅ Payment redirect is functional');
  } else {
    console.log('\n❌ FORM SUBMISSION ISSUE PERSISTS');
    console.log('🔍 Need to investigate form component');
  }
  process.exit(success ? 0 : 1);
});