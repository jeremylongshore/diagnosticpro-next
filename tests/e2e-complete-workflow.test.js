import { test, expect } from '@playwright/test';

/**
 * Complete End-to-End DiagnosticPro MVP Workflow Tests
 * Tests the entire customer journey from form submission to email delivery
 */

const testCases = [
  {
    name: 'Heavy Equipment - Excavator Diagnostic',
    data: {
      equipmentType: 'Heavy Equipment',
      year: '2020',
      make: 'Caterpillar',
      model: '320D',
      serialNumber: 'CAT123456789',
      mileage: '3500 hours',
      errorCodes: 'P0012, P0016, U0100',
      problemDescription: 'Engine is running rough, losing power under load, and showing timing-related error codes. Started last week after routine maintenance. Black smoke from exhaust under heavy load.',
      fullName: 'Jeremy Test Customer',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'diagnostic'
    },
    expectedInResponse: ['Root Cause', 'Verification Tests', 'Cost Estimate']
  },
  {
    name: 'Quote Verification - Overpriced Repair',
    data: {
      equipmentType: 'Tractor',
      year: '2018',
      make: 'John Deere',
      model: '6130R',
      serialNumber: 'JD987654321',
      mileage: '2800 hours',
      errorCodes: 'SPN 94 FMI 1',
      problemDescription: 'Fuel pressure issues, engine occasionally stalling',
      shopQuote: '$8,500 for complete fuel system replacement including high-pressure pump, injectors, and fuel lines. Labor: $3,200, Parts: $5,300',
      fullName: 'Test Verification',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'verification'
    },
    expectedInResponse: ['Red Flags', 'Questions to Ask', 'Fair Cost Estimate']
  },
  {
    name: 'Emergency Triage - Critical Equipment',
    data: {
      equipmentType: 'Crane',
      year: '2019',
      make: 'Liebherr',
      model: 'LTM 1060-3.1',
      serialNumber: 'LH555444333',
      errorCodes: 'E001, E045',
      problemDescription: 'URGENT: Hydraulic system failure during operation, boom will not lift, multiple warning lights, equipment shut down automatically',
      fullName: 'Emergency Test',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'emergency'
    },
    expectedInResponse: ['Emergency', 'Safety', 'Immediate']
  }
];

testCases.forEach(({ name, data, expectedInResponse }) => {
  test(`Complete Workflow: ${name}`, async ({ page }) => {
    console.log(`🧪 Testing: ${name}`);
    
    // Step 1: Navigate to application
    await page.goto('/');
    await expect(page).toHaveTitle(/DiagnosticPro/);
    
    // Step 2: Fill out the diagnostic form
    console.log('📝 Filling out diagnostic form...');
    
    // Equipment details
    await page.selectOption('select[name="equipmentType"]', data.equipmentType);
    if (data.year) await page.fill('input[name="year"]', data.year);
    if (data.make) await page.fill('input[name="make"]', data.make);
    if (data.model) await page.fill('input[name="model"]', data.model);
    if (data.serialNumber) await page.fill('input[name="serialNumber"]', data.serialNumber);
    if (data.mileage) await page.fill('input[name="mileage"]', data.mileage);
    if (data.errorCodes) await page.fill('textarea[name="errorCodes"]', data.errorCodes);
    
    // Problem description
    await page.fill('textarea[name="problemDescription"]', data.problemDescription);
    
    // Shop quote if verification
    if (data.shopQuote) {
      await page.fill('textarea[name="shopQuote"]', data.shopQuote);
    }
    
    // Customer details
    await page.fill('input[name="fullName"]', data.fullName);
    await page.fill('input[name="email"]', data.email);
    
    // Service selection
    const serviceRadio = page.locator(`input[value="${data.selectedService}"]`);
    await serviceRadio.check();
    
    // Step 3: Submit form and wait for processing
    console.log('🚀 Submitting form...');
    const submitButton = page.getByRole('button', { name: /submit|analyze/i });
    await submitButton.click();
    
    // Step 4: Wait for success response (up to 2 minutes for AI processing)
    console.log('⏳ Waiting for AI analysis...');
    await expect(page.getByText(/analysis.*completed|success/i)).toBeVisible({ timeout: 120000 });
    
    // Step 5: Verify response content
    console.log('✅ Verifying AI response quality...');
    const responseContent = await page.textContent('body');
    
    // Check for expected content in the response
    expectedInResponse.forEach(expectedText => {
      expect(responseContent.toLowerCase()).toContain(expectedText.toLowerCase());
    });
    
    // Step 6: Verify no error messages
    const errorElements = page.locator('.error, [class*="error"], .alert-error');
    await expect(errorElements).toHaveCount(0);
    
    // Step 7: Take screenshot for documentation
    await page.screenshot({ 
      path: `test-results/workflow-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`,
      fullPage: true 
    });
    
    console.log(`✅ ${name} workflow completed successfully!`);
  });
});

test('Form Validation Tests', async ({ page }) => {
  console.log('🧪 Testing form validation...');
  
  await page.goto('/');
  
  // Test empty form submission
  const submitButton = page.getByRole('button', { name: /submit|analyze/i });
  await submitButton.click();
  
  // Should show validation errors
  await expect(page.getByText(/required|missing/i)).toBeVisible({ timeout: 5000 });
  
  console.log('✅ Form validation working correctly');
});

test('Cross-Browser Compatibility', async ({ page, browserName }) => {
  console.log(`🌐 Testing ${browserName} compatibility...`);
  
  await page.goto('/');
  await expect(page).toHaveTitle(/DiagnosticPro/);
  
  // Test basic form interaction
  await page.selectOption('select[name="equipmentType"]', 'Tractor');
  await page.fill('textarea[name="problemDescription"]', 'Test description');
  await page.fill('input[name="fullName"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  
  // Verify form elements are functional
  const formElements = await page.locator('input, select, textarea').count();
  expect(formElements).toBeGreaterThan(5);
  
  console.log(`✅ ${browserName} compatibility confirmed`);
});

test('Performance and Load Time', async ({ page }) => {
  console.log('⚡ Testing performance...');
  
  const startTime = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - startTime;
  
  console.log(`📊 Page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
  
  // Test form responsiveness
  await page.selectOption('select[name="equipmentType"]', 'Heavy Equipment');
  await page.fill('input[name="make"]', 'Caterpillar');
  
  console.log('✅ Performance tests passed');
});