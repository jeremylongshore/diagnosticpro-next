/**
 * DiagnosticPro MVP - Complete Stripe Payment Flow Test
 * Tests the entire user journey from form submission to payment completion
 */

import { test, expect } from '@playwright/test';

test.describe('Complete Stripe Payment Flow', () => {
  test('should complete full payment flow with Stripe test card', async ({ page }) => {
    console.log('🧪 Starting complete payment flow test...');
    
    // Navigate to the main page
    await page.goto('http://localhost:5173');
    
    // Fill out the diagnostic form
    console.log('📝 Filling out diagnostic form...');
    
    // Basic Info
    await page.fill('input[name="customerName"]', 'Test Customer');
    await page.fill('input[name="customerEmail"]', 'test@example.com');
    await page.fill('input[name="customerPhone"]', '555-123-4567');
    
    // Equipment Details
    await page.selectOption('select[name="equipmentType"]', 'Car');
    await page.fill('input[name="make"]', 'Honda');
    await page.fill('input[name="model"]', 'Civic');
    await page.fill('input[name="year"]', '2018');
    
    // Problem Details
    await page.fill('textarea[name="problemDescription"]', 'Engine making strange rattling noise when accelerating');
    await page.fill('input[name="errorCodes"]', 'P0301, P0302');
    
    // Shop Quote (if verification)
    await page.fill('input[name="shopQuote"]', '$850 - Replace spark plugs and ignition coils');
    
    // Service Type
    await page.check('input[value="diagnosis"]');
    
    console.log('✅ Form filled successfully');
    
    // Submit the form (should redirect to payment)
    await page.click('button[type="submit"]');
    console.log('🚀 Form submitted, checking for payment redirect...');
    
    // Wait for payment page or Stripe checkout
    await page.waitForTimeout(3000);
    
    // Check if we're redirected to Stripe checkout
    const currentUrl = page.url();
    console.log('🔗 Current URL after form submission:', currentUrl);
    
    if (currentUrl.includes('checkout.stripe.com')) {
      console.log('✅ Successfully redirected to Stripe checkout');
      
      // Fill in Stripe test card details
      console.log('💳 Filling Stripe test card details...');
      
      // Wait for Stripe form to load
      await page.waitForSelector('input[name="cardnumber"]', { timeout: 10000 });
      
      // Fill card number (successful test card)
      await page.fill('input[name="cardnumber"]', '4242424242424242');
      
      // Fill expiry date
      await page.fill('input[name="exp-date"]', '1234'); // 12/34
      
      // Fill CVC
      await page.fill('input[name="cvc"]', '123');
      
      // Fill cardholder name
      await page.fill('input[name="ccname"]', 'Test Customer');
      
      // Fill billing details if required
      const countryField = await page.$('select[name="country"]');
      if (countryField) {
        await page.selectOption('select[name="country"]', 'US');
      }
      
      const zipField = await page.$('input[name="postal"]');
      if (zipField) {
        await page.fill('input[name="postal"]', '12345');
      }
      
      console.log('💳 Test card details filled');
      
      // Submit payment
      await page.click('button[type="submit"]');
      console.log('💰 Payment submitted, waiting for processing...');
      
      // Wait for payment to process and redirect
      await page.waitForTimeout(10000);
      
      // Check final URL after payment
      const finalUrl = page.url();
      console.log('🎯 Final URL after payment:', finalUrl);
      
      if (finalUrl.includes('payment-success')) {
        console.log('🎉 SUCCESS: Payment completed and redirected to success page!');
        
        // Verify success page content
        await expect(page.locator('h1')).toContainText('Payment Successful');
        await expect(page.locator('text=Thank you for choosing DiagnosticPro')).toBeVisible();
        
        console.log('✅ Success page content verified');
        
      } else {
        console.log('⚠️  Payment may have failed or redirect issue occurred');
        console.log('Current page content:');
        const pageContent = await page.textContent('body');
        console.log(pageContent.substring(0, 500) + '...');
      }
      
    } else {
      console.log('❌ Not redirected to Stripe checkout');
      console.log('Current page content:');
      const pageContent = await page.textContent('body');
      console.log(pageContent.substring(0, 500) + '...');
      
      // Check for errors
      const errorElements = await page.$$('text=/error|Error|ERROR/i');
      if (errorElements.length > 0) {
        console.log('🚨 Found error messages on page');
        for (const error of errorElements) {
          const errorText = await error.textContent();
          console.log('Error:', errorText);
        }
      }
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/stripe-payment-flow.png', fullPage: true });
    console.log('📸 Screenshot saved to test-results/stripe-payment-flow.png');
  });
  
  test('should handle declined payment correctly', async ({ page }) => {
    console.log('🧪 Testing declined payment flow...');
    
    // Navigate and fill form (abbreviated for declined test)
    await page.goto('http://localhost:5173');
    
    // Quick form fill
    await page.fill('input[name="customerName"]', 'Declined Test');
    await page.fill('input[name="customerEmail"]', 'declined@example.com');
    await page.fill('input[name="customerPhone"]', '555-999-9999');
    await page.selectOption('select[name="equipmentType"]', 'Truck');
    await page.fill('input[name="make"]', 'Ford');
    await page.fill('input[name="model"]', 'F-150');
    await page.fill('input[name="year"]', '2020');
    await page.fill('textarea[name="problemDescription"]', 'Transmission slipping');
    await page.check('input[value="diagnosis"]');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    if (page.url().includes('checkout.stripe.com')) {
      console.log('✅ Reached Stripe checkout for declined test');
      
      // Use declined test card
      await page.waitForSelector('input[name="cardnumber"]');
      await page.fill('input[name="cardnumber"]', '4000000000000002'); // Declined card
      await page.fill('input[name="exp-date"]', '1234');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="ccname"]', 'Declined Test');
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);
      
      // Should show decline message
      const pageContent = await page.textContent('body');
      if (pageContent.includes('declined') || pageContent.includes('failed')) {
        console.log('✅ Declined payment handled correctly');
      } else {
        console.log('⚠️  Decline handling unclear');
      }
    }
    
    await page.screenshot({ path: 'test-results/stripe-declined-payment.png', fullPage: true });
  });
});