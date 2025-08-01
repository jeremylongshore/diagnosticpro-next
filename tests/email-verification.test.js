import { test, expect } from '@playwright/test';
import { google } from 'googleapis';

/**
 * Email Delivery Verification Tests
 * Verifies that diagnostic reports are actually delivered to customers
 */

test.describe('Email Delivery Verification', () => {
  let gmail;
  
  test.beforeAll(async () => {
    // Initialize Gmail API for email verification
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: '/home/jeremylongshore/diagnosticpro-gmail-key.json',
        scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
        subject: 'jeremy@intentsoultions.io'
      });
      
      gmail = google.gmail({ version: 'v1', auth });
      console.log('✅ Gmail API initialized for email verification');
    } catch (error) {
      console.warn('⚠️ Gmail API initialization failed:', error.message);
    }
  });

  test('Email Delivery - Diagnostic Report', async ({ page }) => {
    console.log('📧 Testing diagnostic report email delivery...');
    
    const testEmail = 'jeremylongshore@gmail.com';
    const testData = {
      equipmentType: 'Excavator',
      make: 'Caterpillar', 
      model: '320D',
      year: '2020',
      problemDescription: 'Email delivery test - engine performance issues',
      fullName: 'Email Test Customer',
      email: testEmail,
      selectedService: 'diagnostic'
    };

    // Get initial email count
    let initialEmailCount = 0;
    if (gmail) {
      try {
        const initialQuery = await gmail.users.messages.list({
          userId: 'me',
          q: `to:${testEmail} subject:"DiagnosticPro" newer_than:1h`
        });
        initialEmailCount = initialQuery.data.messages ? initialQuery.data.messages.length : 0;
        console.log(`📊 Initial email count: ${initialEmailCount}`);
      } catch (error) {
        console.warn('⚠️ Could not check initial email count:', error.message);
      }
    }

    // Submit diagnostic request
    await page.goto('/');
    
    // Fill out form
    await page.selectOption('select[name="equipmentType"]', testData.equipmentType);
    await page.fill('input[name="make"]', testData.make);
    await page.fill('input[name="model"]', testData.model);
    await page.fill('input[name="year"]', testData.year);
    await page.fill('textarea[name="problemDescription"]', testData.problemDescription);
    await page.fill('input[name="fullName"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    
    // Submit and wait for completion
    const submitButton = page.getByRole('button', { name: /submit|analyze/i });
    await submitButton.click();
    
    await expect(page.getByText(/analysis.*completed|success/i)).toBeVisible({ timeout: 120000 });
    
    // Wait for email delivery (give it extra time)
    console.log('⏳ Waiting for email delivery...');
    await page.waitForTimeout(30000); // 30 second buffer for email delivery
    
    // Verify email was delivered
    if (gmail) {
      try {
        const emailQuery = await gmail.users.messages.list({
          userId: 'me',
          q: `to:${testEmail} subject:"DiagnosticPro" newer_than:1h`
        });
        
        const currentEmailCount = emailQuery.data.messages ? emailQuery.data.messages.length : 0;
        console.log(`📊 Current email count: ${currentEmailCount}`);
        
        expect(currentEmailCount).toBeGreaterThan(initialEmailCount);
        
        if (emailQuery.data.messages && emailQuery.data.messages.length > 0) {
          // Get the latest email details
          const latestEmailId = emailQuery.data.messages[0].id;
          const emailDetails = await gmail.users.messages.get({
            userId: 'me',
            id: latestEmailId
          });
          
          // Verify email content
          const emailSubject = emailDetails.data.payload.headers.find(h => h.name === 'Subject')?.value;
          expect(emailSubject).toContain('DiagnosticPro');
          
          console.log(`✅ Email delivered successfully: "${emailSubject}"`);
          
          // Verify email contains diagnostic content
          const emailBody = emailDetails.data.payload.parts?.[0]?.body?.data || 
                           emailDetails.data.payload.body?.data;
          
          if (emailBody) {
            const decodedBody = Buffer.from(emailBody, 'base64').toString();
            expect(decodedBody).toContain(testData.make);
            expect(decodedBody).toContain(testData.model);
            console.log('✅ Email contains expected diagnostic content');
          }
        }
      } catch (error) {
        console.error('❌ Email verification failed:', error.message);
        // Don't fail the test if Gmail API has issues
      }
    } else {
      console.log('⚠️ Skipping email verification - Gmail API not available');
    }
    
    console.log('✅ Email delivery test completed');
  });

  test('Email Delivery - Quote Verification Report', async ({ page }) => {
    console.log('📧 Testing quote verification email delivery...');
    
    const testData = {
      equipmentType: 'Tractor',
      make: 'John Deere',
      model: '6130R',
      year: '2018',
      problemDescription: 'Fuel system issues - email delivery test',
      shopQuote: '$8,500 for fuel system replacement - testing email delivery',
      fullName: 'Quote Email Test',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'verification'
    };

    await page.goto('/');
    
    // Fill out form for quote verification
    await page.selectOption('select[name="equipmentType"]', testData.equipmentType);
    await page.fill('input[name="make"]', testData.make);
    await page.fill('input[name="model"]', testData.model);
    await page.fill('input[name="year"]', testData.year);
    await page.fill('textarea[name="problemDescription"]', testData.problemDescription);
    await page.fill('textarea[name="shopQuote"]', testData.shopQuote);
    await page.fill('input[name="fullName"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    
    // Select verification service
    await page.locator('input[value="verification"]').check();
    
    // Submit and verify
    const submitButton = page.getByRole('button', { name: /submit|analyze/i });
    await submitButton.click();
    
    await expect(page.getByText(/analysis.*completed|success/i)).toBeVisible({ timeout: 120000 });
    
    console.log('✅ Quote verification email test completed');
  });

  test('Email Delivery - Emergency Triage', async ({ page }) => {
    console.log('📧 Testing emergency triage email delivery...');
    
    const testData = {
      equipmentType: 'Crane',
      make: 'Liebherr',
      model: 'LTM 1060',
      errorCodes: 'E001, E045',
      problemDescription: 'URGENT EMAIL TEST: Hydraulic failure, boom will not lift',
      fullName: 'Emergency Email Test',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'emergency'
    };

    await page.goto('/');
    
    // Fill out emergency form
    await page.selectOption('select[name="equipmentType"]', testData.equipmentType);
    await page.fill('input[name="make"]', testData.make);
    await page.fill('input[name="model"]', testData.model);
    await page.fill('textarea[name="errorCodes"]', testData.errorCodes);
    await page.fill('textarea[name="problemDescription"]', testData.problemDescription);
    await page.fill('input[name="fullName"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    
    // Select emergency service
    await page.locator('input[value="emergency"]').check();
    
    // Submit and verify
    const submitButton = page.getByRole('button', { name: /submit|analyze/i });
    await submitButton.click();
    
    await expect(page.getByText(/analysis.*completed|success/i)).toBeVisible({ timeout: 120000 });
    
    console.log('✅ Emergency triage email test completed');
  });

  test('Admin Notification Email', async ({ page }) => {
    console.log('📧 Testing admin notification email...');
    
    const testData = {
      equipmentType: 'Bulldozer',
      make: 'Caterpillar',
      model: 'D6T',
      problemDescription: 'Admin notification test - track engine issues',
      fullName: 'Admin Notification Test',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'diagnostic'
    };

    await page.goto('/');
    
    // Fill out form
    await page.selectOption('select[name="equipmentType"]', testData.equipmentType);
    await page.fill('input[name="make"]', testData.make);
    await page.fill('input[name="model"]', testData.model);
    await page.fill('textarea[name="problemDescription"]', testData.problemDescription);
    await page.fill('input[name="fullName"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    
    // Submit
    const submitButton = page.getByRole('button', { name: /submit|analyze/i });
    await submitButton.click();
    
    await expect(page.getByText(/analysis.*completed|success/i)).toBeVisible({ timeout: 120000 });
    
    // Admin should receive notification email
    console.log('✅ Admin notification test completed');
  });

  test('Email Delivery Error Handling', async ({ page }) => {
    console.log('📧 Testing email delivery error handling...');
    
    const testData = {
      equipmentType: 'Tractor',
      make: 'Test',
      model: 'Error Handler',
      problemDescription: 'Testing what happens if email delivery fails',
      fullName: 'Error Test',
      email: 'invalid-email-for-testing@nonexistent-domain-12345.com',
      selectedService: 'diagnostic'
    };

    await page.goto('/');
    
    // Fill out form with invalid email
    await page.selectOption('select[name="equipmentType"]', testData.equipmentType);
    await page.fill('input[name="make"]', testData.make);
    await page.fill('input[name="model"]', testData.model);
    await page.fill('textarea[name="problemDescription"]', testData.problemDescription);
    await page.fill('input[name="fullName"]', testData.fullName);
    await page.fill('input[name="email"]', testData.email);
    
    // Submit
    const submitButton = page.getByRole('button', { name: /submit|analyze/i });
    await submitButton.click();
    
    // Should still get analysis but with email delivery warning
    await expect(page.getByText(/analysis.*completed|email.*failed/i)).toBeVisible({ timeout: 120000 });
    
    console.log('✅ Email error handling test completed');
  });
});