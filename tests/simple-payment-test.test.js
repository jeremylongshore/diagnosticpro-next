/**
 * Simple Payment Test - Test form interaction and submission
 */

import { test, expect } from '@playwright/test';

test('simple payment flow test', async ({ page }) => {
  console.log('🧪 Simple payment flow test...');
  
  // Navigate to the form
  await page.goto('http://localhost:5173/form');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/form-page.png', fullPage: true });
  console.log('📸 Form page screenshot saved');
  
  // Look for input fields by placeholder or label text
  console.log('🔍 Looking for form fields...');
  
  // Try to find name field
  const nameField = await page.locator('input').filter({ hasText: /name/i }).first();
  if (await nameField.isVisible()) {
    await nameField.fill('Test Customer');
    console.log('✅ Name field filled');
  } else {
    // Try different selector
    const nameInput = await page.locator('input[type="text"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Customer');
      console.log('✅ First text input filled (likely name)');
    }
  }
  
  // Try to find email field
  const emailField = await page.locator('input[type="email"]').first();
  if (await emailField.isVisible()) {
    await emailField.fill('test@example.com');
    console.log('✅ Email field filled');
  }
  
  // Try to find phone field
  const phoneField = await page.locator('input[type="tel"]').first();
  if (await phoneField.isVisible()) {
    await phoneField.fill('555-123-4567');
    console.log('✅ Phone field filled');
  }
  
  // Look for equipment type dropdown
  const equipmentSelect = await page.locator('select').first();
  if (await equipmentSelect.isVisible()) {
    await equipmentSelect.selectOption({ index: 1 }); // Select first option after default
    console.log('✅ Equipment type selected');
  }
  
  // Fill other text fields
  const textInputs = await page.locator('input[type="text"]').all();
  if (textInputs.length > 1) {
    await textInputs[1]?.fill('Honda'); // Make
    await textInputs[2]?.fill('Civic'); // Model
    await textInputs[3]?.fill('2018'); // Year
    console.log('✅ Vehicle details filled');
  }
  
  // Fill textarea (problem description)
  const textarea = await page.locator('textarea').first();
  if (await textarea.isVisible()) {
    await textarea.fill('Engine making strange noise when accelerating');
    console.log('✅ Problem description filled');
  }
  
  // Take screenshot after filling
  await page.screenshot({ path: 'test-results/form-filled.png', fullPage: true });
  
  // Look for submit button and click it
  const submitBtn = await page.locator('button').filter({ hasText: /submit|continue|next|proceed/i }).first();
  if (await submitBtn.isVisible()) {
    console.log('🚀 Found submit button, clicking...');
    await submitBtn.click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('🔗 URL after submission:', currentUrl);
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/after-submit.png', fullPage: true });
    
    // Check if we're on Stripe or payment page
    if (currentUrl.includes('stripe.com') || currentUrl.includes('checkout')) {
      console.log('✅ SUCCESS: Redirected to Stripe checkout!');
      
      // If on Stripe, try to fill test card
      try {
        await page.waitForSelector('input[name="cardnumber"]', { timeout: 5000 });
        console.log('💳 Found Stripe card field');
        
        // Fill test card
        await page.fill('input[name="cardnumber"]', '4242424242424242');
        await page.fill('input[name="exp-date"]', '1234');
        await page.fill('input[name="cvc"]', '123');
        
        const nameOnCard = await page.locator('input[name="ccname"]');
        if (await nameOnCard.isVisible()) {
          await nameOnCard.fill('Test Customer');
        }
        
        console.log('💳 Test card details filled');
        
        // Submit payment
        const payButton = await page.locator('button').filter({ hasText: /pay|submit/i }).first();
        if (await payButton.isVisible()) {
          await payButton.click();
          console.log('💰 Payment submitted');
          
          // Wait for processing
          await page.waitForTimeout(5000);
          
          const finalUrl = page.url();
          console.log('🎯 Final URL:', finalUrl);
          
          if (finalUrl.includes('payment-success')) {
            console.log('🎉 SUCCESS: Complete payment flow worked!');
          }
        }
        
      } catch (error) {
        console.log('⚠️ Could not complete Stripe payment form:', error.message);
      }
      
    } else {
      console.log('⚠️ Not redirected to payment processor');
      const pageContent = await page.textContent('body');
      console.log('Page content preview:', pageContent.substring(0, 300));
    }
    
  } else {
    console.log('❌ No submit button found');
    
    // Debug: show all buttons
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} buttons on page`);
    
    for (let i = 0; i < Math.min(allButtons.length, 3); i++) {
      const buttonText = await allButtons[i].textContent();
      console.log(`Button ${i + 1}: "${buttonText}"`);
    }
  }
});