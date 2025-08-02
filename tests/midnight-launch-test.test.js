/**
 * MIDNIGHT LAUNCH TEST - Single Car Scenario
 * Quick end-to-end verification for launch readiness
 */

import { test, expect } from '@playwright/test';

const MANDY = {
  name: 'Mandy Longshore',
  email: 'mandy.longshore@mockuser.com',
  phone: '(555) 123-4567',
  address: '123 Main St, Springfield, IL 62701'
};

test('MIDNIGHT LAUNCH: Car scenario end-to-end verification', async ({ page }) => {
  console.log('🚀 MIDNIGHT LAUNCH TEST: Car diagnostic workflow');
  
  try {
    // Step 1: Landing page
    await page.goto('http://localhost:5173');
    console.log('✅ Landing page loaded');
    
    // Step 2: Select diagnosis service
    await page.click('text=Equipment Diagnosis');
    console.log('✅ Service selected');
    
    // Step 3: Fill contact info
    await page.fill('input[placeholder*="full name"], input[placeholder*="name"]', MANDY.name);
    await page.fill('input[placeholder*="email"]', MANDY.email);
    console.log('✅ Contact info filled');
    
    // Step 4: Get Started
    await page.click('text=Get Started');
    await page.waitForURL('**/form*');
    console.log('✅ Form page reached');
    
    // Step 5: Test /form API directly
    const formResponse = await page.evaluate(async () => {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mandy.longshore@mockuser.com',
          issue: 'Check engine light after oil change',
          quote: '500',
          fullName: 'Mandy Longshore',
          equipment: 'Car'
        })
      });
      return await response.json();
    });
    
    expect(formResponse.success).toBe(true);
    console.log('✅ /form API working:', formResponse.submissionId);
    
    // Step 6: Test submit-diagnosis API
    const diagnosisResponse = await page.evaluate(async () => {
      const response = await fetch('/api/submit-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemDescription: 'Check engine light after oil change, rough idle',
          email: 'mandy.longshore@mockuser.com',
          fullName: 'Mandy Longshore',
          phone: '(555) 123-4567',
          equipmentType: 'Automotive',
          make: 'Honda',
          model: 'Civic',
          year: '2018',
          shopQuote: '500',
          selectedService: 'diagnosis'
        })
      });
      return await response.json();
    });
    
    expect(diagnosisResponse.success).toBe(true);
    console.log('✅ Diagnosis API working:', diagnosisResponse.submissionId);
    
    // Step 7: Verify thank-you page exists
    await page.goto('http://localhost:5173/payment-success');
    await page.waitForLoadState('networkidle');
    console.log('✅ Thank-you page accessible');
    
    console.log('🎉 MIDNIGHT LAUNCH TEST PASSED - READY FOR DEPLOYMENT!');
    
  } catch (error) {
    console.error('❌ MIDNIGHT LAUNCH TEST FAILED:', error.message);
    await page.screenshot({ path: 'test-results/midnight-launch-failure.png' });
    throw error;
  }
});