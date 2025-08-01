/**
 * Quick Payment Test - Check form submission and payment redirect
 */

import { test, expect } from '@playwright/test';

test('quick payment flow check', async ({ page }) => {
  console.log('🧪 Quick payment flow test...');
  
  // Navigate to the form
  await page.goto('http://localhost:5173/form');
  
  // Take screenshot of initial page
  await page.screenshot({ path: 'test-results/01-initial-page.png', fullPage: true });
  console.log('📸 Initial page screenshot saved');
  
  // Check if form exists
  const formExists = await page.$('form');
  console.log('📋 Form exists:', !!formExists);
  
  if (formExists) {
    console.log('📝 Filling basic form data...');
    
    // Fill minimum required fields
    try {
      await page.fill('input[name="customerName"]', 'Test Customer');
      await page.fill('input[name="customerEmail"]', 'test@example.com');
      await page.fill('input[name="customerPhone"]', '555-123-4567');
      
      // Check available equipment types
      const equipmentSelect = await page.$('select[name="equipmentType"]');
      if (equipmentSelect) {
        await page.selectOption('select[name="equipmentType"]', 'Car');
        console.log('✅ Equipment type selected');
      }
      
      await page.fill('input[name="make"]', 'Honda');
      await page.fill('input[name="model"]', 'Civic');
      await page.fill('input[name="year"]', '2018');
      await page.fill('textarea[name="problemDescription"]', 'Test problem description');
      
      // Select service type
      const diagnosisRadio = await page.$('input[value="diagnosis"]');
      if (diagnosisRadio) {
        await page.check('input[value="diagnosis"]');
        console.log('✅ Service type selected');
      }
      
      console.log('✅ Form filled successfully');
      
      // Take screenshot before submission
      await page.screenshot({ path: 'test-results/02-form-filled.png', fullPage: true });
      
      // Submit form
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        console.log('🚀 Submitting form...');
        await submitButton.click();
        
        // Wait a bit for any navigation/processing
        await page.waitForTimeout(5000);
        
        // Check current URL
        const currentUrl = page.url();
        console.log('🔗 Current URL after submission:', currentUrl);
        
        // Take screenshot after submission
        await page.screenshot({ path: 'test-results/03-after-submission.png', fullPage: true });
        
        // Check page content
        const pageText = await page.textContent('body');
        console.log('📄 Page content preview:', pageText.substring(0, 300) + '...');
        
        // Look for Stripe or payment related elements
        if (currentUrl.includes('stripe.com') || currentUrl.includes('checkout')) {
          console.log('✅ SUCCESS: Redirected to payment processor!');
        } else if (pageText.includes('payment') || pageText.includes('checkout')) {
          console.log('✅ Payment-related content found on page');
        } else {
          console.log('⚠️  No obvious payment redirect or content found');
        }
        
      } else {
        console.log('❌ Submit button not found');
      }
      
    } catch (error) {
      console.error('❌ Error filling form:', error.message);
      await page.screenshot({ path: 'test-results/error-form-fill.png', fullPage: true });
    }
    
  } else {
    console.log('❌ No form found on page');
    const pageContent = await page.textContent('body');
    console.log('Page content:', pageContent.substring(0, 500));
  }
});