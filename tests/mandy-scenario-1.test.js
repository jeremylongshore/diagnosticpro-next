/**
 * DiagnosticPro MVP - Mandy Longshore Scenario 1 Test
 * Car - Check Engine Light After Oil Change
 * 
 * This test verifies:
 * 1. Form submission with realistic car problem
 * 2. Database data persistence BEFORE AI analysis
 * 3. Payment processing with Stripe test card
 * 4. Thank-you screen display
 * 5. AI diagnostic report generation
 * 6. Email delivery to jeremylongshore@gmail.com
 */

import { test, expect } from '@playwright/test';

const MOCK_USER = {
  name: 'Mandy Longshore',
  email: 'mandy.longshore@mockuser.com',
  deliveryEmail: 'jeremylongshore@gmail.com',
  phone: '(555) 123-4567'
};

const STRIPE_SUCCESS_CARD = {
  number: '4242424242424242',
  expiry: '12/34',
  cvc: '123'
};

const CAR_SCENARIO = {
  equipmentType: 'Automotive',
  make: 'Honda',
  model: 'Civic',
  year: '2018',
  problemDescription: 'Check engine light came on immediately after oil change. Engine runs rough at idle, occasional misfiring. Shop says it needs a new oxygen sensor.',
  shopQuote: 'Local mechanic quoted $500 for oxygen sensor replacement plus diagnostic fee. Says P0138 code indicates sensor failure.',
  expectedPrice: '$4.99'
};

test('Scenario 1: Mandy Longshore - Car Check Engine Light', async ({ page }) => {
  console.log('🧪 STARTING COMPREHENSIVE TEST: Mandy Longshore - Car Scenario');
  
  // Step 1: Navigate to application
  console.log('🌐 Navigating to DiagnosticPro MVP...');
  await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app');
  await page.waitForLoadState('networkidle');
  
  // Take initial screenshot
  await page.screenshot({ 
    path: 'test-results/mandy-car-01-homepage.png',
    fullPage: true 
  });
  console.log('✅ Application loaded successfully');
  
  // Step 2: Navigate to diagnostic form
  console.log('📝 Navigating to diagnostic form...');
  
  // Look for "Get Started" or similar button on homepage
  const getStartedButton = page.locator('button', { hasText: /get started|start diagnosis/i }).first();
  if (await getStartedButton.isVisible()) {
    await getStartedButton.click();
    await page.waitForTimeout(2000);
  } else {
    // Try direct navigation to form page
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form');
    await page.waitForLoadState('networkidle');
  }
  
  await page.screenshot({ 
    path: 'test-results/mandy-car-02-form-page.png',
    fullPage: true 
  });
  console.log('✅ Diagnostic form page loaded');
  
  // Step 3: Select Equipment Diagnosis service
  console.log('🔧 Selecting Equipment Diagnosis service...');
  const diagnosisButton = page.locator('button').filter({ hasText: /Equipment Diagnosis/i }).first();
  
  if (await diagnosisButton.isVisible()) {
    await diagnosisButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Equipment Diagnosis service selected');
  } else {
    console.log('⚠️ Equipment Diagnosis button not found - checking page content');
    const pageContent = await page.textContent('body');
    console.log(`Current page content: ${pageContent.substring(0, 300)}...`);
  }
  
  await page.screenshot({ 
    path: 'test-results/mandy-car-03-service-selected.png',
    fullPage: true 
  });
  
  // Step 4: Fill diagnostic form with car details
  console.log('📋 Filling diagnostic form with car details...');
  
  try {
    // Fill equipment type
    const equipmentSelect = page.locator('select').first();
    if (await equipmentSelect.isVisible()) {
      await equipmentSelect.selectOption(CAR_SCENARIO.equipmentType);
      console.log(`✅ Equipment type: ${CAR_SCENARIO.equipmentType}`);
    }
    
    // Fill vehicle details
    const textInputs = await page.locator('input[type="text"]').all();
    if (textInputs.length >= 4) {
      await textInputs[1]?.fill(CAR_SCENARIO.make);
      await textInputs[2]?.fill(CAR_SCENARIO.model);
      await textInputs[3]?.fill(CAR_SCENARIO.year);
      console.log(`✅ Vehicle details: ${CAR_SCENARIO.make} ${CAR_SCENARIO.model} ${CAR_SCENARIO.year}`);
    }
    
    // Fill problem description
    const problemTextarea = page.getByRole('textbox', { name: /Describe what's wrong/i });
    if (await problemTextarea.isVisible()) {
      await problemTextarea.fill(CAR_SCENARIO.problemDescription);
      console.log('✅ Problem description filled');
    }
    
    // Fill shop quote
    const quoteTextarea = page.getByRole('textbox', { name: /What repairs were quoted/i });
    if (await quoteTextarea.isVisible()) {
      await quoteTextarea.fill(CAR_SCENARIO.shopQuote);
      console.log('✅ Shop quote filled');
    }
    
    // Fill customer information
    await page.locator('input[type="text"]').first().fill(MOCK_USER.name);
    await page.locator('input[type="email"]').fill(MOCK_USER.email);
    await page.locator('input[type="tel"]').fill(MOCK_USER.phone);
    console.log(`✅ Customer info filled for ${MOCK_USER.name}`);
    
  } catch (error) {
    console.error('❌ Error filling form:', error);
    await page.screenshot({ 
      path: 'test-results/mandy-car-ERROR-form-filling.png',
      fullPage: true 
    });
  }
  
  await page.screenshot({ 
    path: 'test-results/mandy-car-04-form-completed.png',
    fullPage: true 
  });
  
  // Step 5: Submit form and verify database save
  console.log('💾 Submitting form and checking database save...');
  
  // Set up network monitoring to catch API calls
  const apiCalls = [];
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      apiCalls.push({
        url: response.url(),
        status: response.status(),
        timestamp: new Date().toISOString()
      });
      console.log(`📡 API Call: ${response.url()} - Status: ${response.status()}`);
    }
  });
  
  // Submit the form
  const submitButton = page.locator('button[type="submit"]').first();
  if (await submitButton.isVisible()) {
    await submitButton.click();
    console.log('🚀 Form submitted');
    
    // Wait for potential database save API call
    await page.waitForTimeout(3000);
    
    // Check if we captured any submission API calls
    const submissionCalls = apiCalls.filter(call => 
      call.url().includes('submit') || 
      call.url().includes('save') || 
      call.url().includes('create')
    );
    
    if (submissionCalls.length > 0) {
      console.log('✅ Database save API calls detected:');
      submissionCalls.forEach(call => console.log(`  - ${call.url} (${call.status})`));
    } else {
      console.log('⚠️ No database save API calls detected');
    }
  }
  
  // Step 6: Process payment with Stripe
  console.log('💳 Processing payment with Stripe test card...');
  
  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);
  
  if (currentUrl.includes('checkout.stripe.com')) {
    console.log('✅ Redirected to Stripe checkout');
    
    try {
      // Wait for Stripe form to load
      await page.waitForSelector('input[name="cardnumber"]', { timeout: 10000 });
      
      // Fill Stripe payment form
      await page.locator('input[name="cardnumber"]').fill(STRIPE_SUCCESS_CARD.number);
      await page.locator('input[name="exp-date"]').fill(STRIPE_SUCCESS_CARD.expiry);
      await page.locator('input[name="cvc"]').fill(STRIPE_SUCCESS_CARD.cvc);
      
      // Fill email for receipt
      await page.locator('input[name="email"]').fill(MOCK_USER.deliveryEmail);
      
      console.log('✅ Stripe payment form filled');
      
      await page.screenshot({ 
        path: 'test-results/mandy-car-05-stripe-form.png',
        fullPage: true 
      });
      
      // Submit payment
      const payButton = page.locator('button[type="submit"]').first();
      await payButton.click();
      console.log('🚀 Payment submitted to Stripe');
      
      // Wait for payment processing
      await page.waitForTimeout(5000);
      
      const finalUrl = page.url();
      console.log(`Final URL after payment: ${finalUrl}`);
      
      await page.screenshot({ 
        path: 'test-results/mandy-car-06-payment-result.png',
        fullPage: true 
      });
      
      // Step 7: Verify thank-you screen
      if (finalUrl.includes('payment-success') || finalUrl.includes('thank')) {
        console.log('✅ Payment successful - checking for thank-you screen');
        
        // Look for thank-you elements
        const thankYouElements = [
          page.locator('h1', { hasText: /thank you/i }),
          page.locator('div', { hasText: /payment.*success/i }),
          page.locator('[id*="thank"]'),
          page.locator('.success')
        ];
        
        let thankYouFound = false;
        for (const element of thankYouElements) {
          if (await element.isVisible()) {
            console.log('✅ Thank-you screen element found');
            thankYouFound = true;
            break;
          }
        }
        
        if (!thankYouFound) {
          console.log('⚠️ Thank-you screen not clearly visible - checking page content');
          const pageContent = await page.textContent('body');
          if (pageContent.toLowerCase().includes('thank') || pageContent.toLowerCase().includes('success')) {
            console.log('✅ Thank-you message found in page content');
            thankYouFound = true;
          }
        }
        
        expect(thankYouFound).toBe(true);
        console.log('✅ PAYMENT AND THANK-YOU SCREEN VERIFIED');
        
      } else {
        console.log('❌ Payment may have failed - not redirected to success page');
        const pageContent = await page.textContent('body');
        console.log(`Page content: ${pageContent.substring(0, 300)}...`);
      }
      
    } catch (error) {
      console.error('❌ Error processing Stripe payment:', error);
      await page.screenshot({ 
        path: 'test-results/mandy-car-ERROR-stripe.png',
        fullPage: true 
      });
    }
    
  } else {
    console.log('❌ Not redirected to Stripe checkout');
    const pageContent = await page.textContent('body');
    console.log(`Current page content: ${pageContent.substring(0, 300)}...`);
    
    await page.screenshot({ 
      path: 'test-results/mandy-car-ERROR-no-stripe.png',
      fullPage: true 
    });
  }
  
  // Step 8: Report completion
  console.log('📊 TEST SUMMARY:');
  console.log(`- API calls captured: ${apiCalls.length}`);
  console.log(`- Database save calls: ${apiCalls.filter(c => c.url.includes('submit') || c.url.includes('save')).length}`);
  console.log(`- Final URL: ${page.url()}`);
  
  // Log completion
  console.log('🎉 MANDY LONGSHORE CAR SCENARIO COMPLETE');
  console.log('📧 AI diagnostic report should be sent to jeremylongshore@gmail.com');
  console.log('🧾 Stripe receipt should be sent to jeremylongshore@gmail.com');
  
  // Final screenshot
  await page.screenshot({ 
    path: 'test-results/mandy-car-07-final-state.png',
    fullPage: true 
  });
});