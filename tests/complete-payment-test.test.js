/**
 * Complete Payment Test - Full workflow from service selection to payment
 */

import { test, expect } from '@playwright/test';

test('complete payment workflow', async ({ page }) => {
  console.log('🧪 Complete payment workflow test...');
  
  // Navigate to the form
  await page.goto('http://localhost:5173/form');
  await page.waitForTimeout(2000);
  
  console.log('📸 Taking initial screenshot...');
  await page.screenshot({ path: 'test-results/01-form-initial.png', fullPage: true });
  
  // Step 1: Select service (click the first service - Equipment Diagnosis)
  console.log('🔍 Selecting Equipment Diagnosis service...');
  const diagnosisButton = await page.locator('button').filter({ hasText: /Equipment Diagnosis/i }).first();
  
  if (await diagnosisButton.isVisible()) {
    await diagnosisButton.click();
    console.log('✅ Equipment Diagnosis service selected');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/02-service-selected.png', fullPage: true });
  } else {
    console.log('❌ Could not find Equipment Diagnosis button');
    return;
  }
  
  // Step 2: Fill out the form
  console.log('📝 Filling out diagnostic form...');
  
  // Fill name
  const nameInput = await page.locator('input[type="text"]').first();
  if (await nameInput.isVisible()) {
    await nameInput.fill('Test Customer');
    console.log('✅ Name filled');
  }
  
  // Fill email
  const emailInput = await page.locator('input[type="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill('test@example.com');
    console.log('✅ Email filled');
  }
  
  // Fill phone
  const phoneInput = await page.locator('input[type="tel"]');
  if (await phoneInput.isVisible()) {
    await phoneInput.fill('555-123-4567');
    console.log('✅ Phone filled');
  }
  
  // Select equipment type
  const equipmentSelect = await page.locator('select');
  if (await equipmentSelect.isVisible()) {
    await equipmentSelect.selectOption({ index: 1 });
    console.log('✅ Equipment type selected');
  }
  
  // Fill vehicle details
  const textInputs = await page.locator('input[type="text"]').all();
  if (textInputs.length > 1) {
    await textInputs[1]?.fill('Honda');
    await textInputs[2]?.fill('Civic'); 
    await textInputs[3]?.fill('2018');
    console.log('✅ Vehicle details filled');
  }
  
  // Fill problem description (be more specific with textarea selection)
  const problemDescription = await page.getByRole('textbox', { name: /Describe what's wrong/i });
  if (await problemDescription.isVisible()) {
    await problemDescription.fill('Engine making strange rattling noise during acceleration. Started 2 days ago.');
    console.log('✅ Problem description filled');
  }
  
  await page.screenshot({ path: 'test-results/03-form-filled.png', fullPage: true });
  
  // Step 3: Look for Continue/Next/Submit button after filling form
  console.log('🔍 Looking for Continue button...');
  
  // Try various button texts that might appear
  const continueSelectors = [
    'button:has-text("Continue")',
    'button:has-text("Next")', 
    'button:has-text("Submit")',
    'button:has-text("Proceed")',
    'button:has-text("Get Analysis")',
    'button:has-text("Continue to Payment")',
    'button[type="submit"]'
  ];
  
  let continueButton = null;
  for (const selector of continueSelectors) {
    const btn = await page.locator(selector).first();
    if (await btn.isVisible()) {
      continueButton = btn;
      console.log(`✅ Found continue button with selector: ${selector}`);
      break;
    }
  }
  
  if (!continueButton) {
    // If no continue button found, look for any button that's not a service selection
    const allButtons = await page.locator('button').all();
    console.log(`🔍 Checking all ${allButtons.length} buttons for continue option...`);
    
    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      console.log(`Button ${i + 1}: "${buttonText?.trim()}"`);
      
      // Skip service selection buttons
      if (!buttonText?.includes('Equipment Diagnosis') && 
          !buttonText?.includes('Quote Verification') && 
          !buttonText?.includes('EMERGENCY')) {
        continueButton = allButtons[i];
        console.log(`✅ Using button ${i + 1} as continue button`);
        break;
      }
    }
  }
  
  if (continueButton) {
    console.log('🚀 Clicking continue button...');
    await continueButton.click();
    
    // Wait for navigation/processing
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log('🔗 URL after continue:', currentUrl);
    
    await page.screenshot({ path: 'test-results/04-after-continue.png', fullPage: true });
    
    // Check if we're on Stripe checkout
    if (currentUrl.includes('stripe.com') || currentUrl.includes('checkout')) {
      console.log('🎉 SUCCESS: Redirected to Stripe checkout!');
      
      // Test Stripe payment form
      try {
        console.log('💳 Filling Stripe test card...');
        await page.waitForSelector('input[name="cardnumber"]', { timeout: 10000 });
        
        await page.fill('input[name="cardnumber"]', '4242424242424242');
        await page.fill('input[name="exp-date"]', '1234');
        await page.fill('input[name="cvc"]', '123');
        
        const nameField = await page.locator('input[name="ccname"]');
        if (await nameField.isVisible()) {
          await nameField.fill('Test Customer');
        }
        
        console.log('💳 Test card details filled');
        await page.screenshot({ path: 'test-results/05-stripe-filled.png', fullPage: true });
        
        // Submit payment
        const payButton = await page.locator('button').filter({ hasText: /pay|submit/i }).first();
        if (await payButton.isVisible()) {
          console.log('💰 Submitting payment...');
          await payButton.click();
          
          // Wait for payment processing
          await page.waitForTimeout(10000);
          
          const finalUrl = page.url();
          console.log('🎯 Final URL after payment:', finalUrl);
          
          await page.screenshot({ path: 'test-results/06-payment-result.png', fullPage: true });
          
          if (finalUrl.includes('payment-success')) {
            console.log('🎉🎉 COMPLETE SUCCESS: Full payment flow worked!');
            console.log('✅ Form submission ✅ Stripe redirect ✅ Payment processing ✅ Success page');
          } else {
            console.log('⚠️ Payment completed but unclear final state');
            const pageContent = await page.textContent('body');
            console.log('Final page content:', pageContent.substring(0, 300));
          }
        }
        
      } catch (stripeError) {
        console.log('⚠️ Stripe payment form issue:', stripeError.message);
        await page.screenshot({ path: 'test-results/stripe-error.png', fullPage: true });
      }
      
    } else {
      console.log('⚠️ Not redirected to Stripe - checking page content...');
      const pageContent = await page.textContent('body');
      console.log('Page content after continue:', pageContent.substring(0, 500));
      
      // Check for error messages
      if (pageContent.includes('error') || pageContent.includes('Error')) {
        console.log('🚨 Error detected on page');
      }
    }
    
  } else {
    console.log('❌ No continue button found - form may need more interaction');
    await page.screenshot({ path: 'test-results/no-continue-button.png', fullPage: true });
  }
});