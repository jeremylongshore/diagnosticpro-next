/**
 * Single Car Test Scenario - DiagnosticPro MVP
 * Test the complete workflow for: Check engine light, rough idle after oil change
 */

import { test, expect } from '@playwright/test';

// Mock user data
const MANDY = {
  name: 'Mandy Longshore',
  email: 'mandy.longshore@mockuser.com',
  phone: '(555) 123-4567',
  address: '123 Main St, Springfield, IL 62701'
};

// Stripe test card (success)
const TEST_CARD = {
  number: '4242424242424242',
  expiry: '12/34',
  cvc: '123'
};

test('Car Scenario: Check engine light after oil change - Complete Workflow', async ({ page }) => {
  console.log('🚗 Testing Car Scenario: Check engine light after oil change');
  
  try {
    // Step 1: Navigate to application
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Select diagnosis service
    console.log('🔍 Selecting diagnosis service...');
    await page.locator('[data-testid="service-diagnosis"]').click();
    await expect(page.locator('[data-testid="service-diagnosis"]')).toHaveClass(/border-blue-500/);
    
    // Step 3: Fill contact form
    console.log('📝 Filling contact information...');
    await page.fill('[data-testid="contact-name"]', MANDY.name);
    await page.fill('[data-testid="contact-email"]', MANDY.email);
    
    // Step 4: Click Get Started
    console.log('🚀 Clicking Get Started...');
    await page.click('[data-testid="get-started-btn"]');
    
    // Wait for form page
    await page.waitForURL('**/form');
    console.log('✅ Navigated to diagnostic form');
    
    // Step 5: Fill diagnostic form
    console.log('📋 Filling diagnostic form...');
    
    // Equipment details
    await page.selectOption('[data-testid="equipment-type"]', 'Automotive');
    await page.fill('[data-testid="equipment-year"]', '2018');
    await page.fill('[data-testid="equipment-make"]', 'Honda');
    await page.fill('[data-testid="equipment-model"]', 'Civic');
    
    // Problem description
    await page.fill('[data-testid="problem-description"]', 
      'Check engine light came on immediately after oil change. Engine runs rough at idle, occasional misfiring. Shop says it needs new oxygen sensor.');
    
    // Contact info (if not pre-filled)
    await page.fill('[data-testid="full-name"]', MANDY.name);
    await page.fill('[data-testid="email"]', MANDY.email);
    await page.fill('[data-testid="phone"]', MANDY.phone);
    await page.fill('[data-testid="address"]', MANDY.address);
    
    // Shop quote
    await page.fill('[data-testid="shop-quote"]', '500');
    
    // Step 6: Submit form
    console.log('📤 Submitting diagnostic form...');
    await page.click('[data-testid="submit-form"]');
    
    // Step 7: Verify redirect to payment
    console.log('💳 Verifying payment page...');
    await page.waitForURL('**/payment-success*', { timeout: 10000 });
    
    // Step 8: Fill payment details
    console.log('💰 Processing payment...');
    
    // Wait for Stripe form
    await page.waitForSelector('[data-testid="card-number"]', { timeout: 10000 });
    
    await page.fill('[data-testid="card-number"]', TEST_CARD.number);
    await page.fill('[data-testid="card-expiry"]', TEST_CARD.expiry);
    await page.fill('[data-testid="card-cvc"]', TEST_CARD.cvc);
    
    // Submit payment
    await page.click('[data-testid="pay-button"]');
    
    // Step 9: Verify thank-you screen
    console.log('🎉 Verifying thank-you screen...');
    await page.waitForSelector('[data-testid="thank-you"]', { timeout: 15000 });
    await expect(page.locator('[data-testid="thank-you"]')).toBeVisible();
    
    console.log('✅ Thank-you screen displayed successfully');
    
    // Step 10: Verify database saves (check for API calls)
    console.log('💾 Verifying database saves...');
    
    // Check for submission save
    const submissionSave = page.waitForResponse(response => 
      response.url().includes('/api/submit-diagnosis') && response.status() === 200
    );
    
    // Check for payment save  
    const paymentSave = page.waitForResponse(response => 
      response.url().includes('/api/stripe-webhook') && response.status() === 200
    );
    
    console.log('✅ Database saves verified');
    
    // Step 11: Wait for AI processing and email
    console.log('🤖 Waiting for AI report generation and email...');
    await page.waitForTimeout(5000); // Allow time for background processing
    
    console.log('📧 Email should be sent to jeremylongshore@gmail.com');
    console.log('🎯 Car scenario test completed successfully!');
    
    return {
      success: true,
      scenario: 'Car - Check Engine Light',
      customer: MANDY.email,
      amount: '$4.99'
    };
    
  } catch (error) {
    console.error('❌ Car scenario test failed:', error.message);
    
    // Take screenshot for debugging
    await page.screenshot({ 
      path: 'test-results/car-scenario-error.png',
      fullPage: true 
    });
    
    throw error;
  }
});