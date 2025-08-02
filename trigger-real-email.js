/**
 * REAL EMAIL TEST - Trigger actual diagnostic workflow to send email to Jeremy
 */

import { spawn } from 'child_process';

// Real form data for Honda Civic scenario
const realFormData = {
  problemDescription: 'Check engine light came on immediately after oil change. Engine runs rough at idle, occasional misfiring. Shop quote $500 for oxygen sensor replacement.',
  email: 'jeremylongshore@gmail.com', // Send directly to Jeremy
  fullName: 'Jeremy Longshore',
  phone: '(555) 123-4567',
  address: '123 Main St, Springfield, IL 62701',
  equipmentType: 'Automotive',
  make: 'Honda',
  model: 'Civic',
  year: '2018',
  serialNumber: '',
  mileage: '45000',
  errorCodes: 'P0138',
  shopQuote: '500',
  selectedService: 'diagnosis'
};

async function triggerRealEmail() {
  console.log('🚀 TRIGGERING REAL EMAIL TO JEREMY');
  console.log('📧 Target: jeremylongshore@gmail.com');
  console.log('🚗 Scenario: Honda Civic check engine light');
  
  try {
    // Method 1: Direct API call to submit-diagnosis
    console.log('\n📤 Submitting real diagnostic request...');
    
    const response = await fetch('http://localhost:5173/api/submit-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(realFormData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Diagnostic submission successful!');
      console.log('📋 Submission ID:', result.submissionId);
      console.log('💳 Payment required:', result.requiresPayment);
      
      if (result.requiresPayment) {
        console.log('\n💰 Processing payment simulation...');
        
        // Simulate payment completion via webhook
        const webhookData = {
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_test_jeremy_approval',
              payment_status: 'paid',
              amount_total: 499, // $4.99
              customer_email: 'jeremylongshore@gmail.com',
              metadata: {
                submissionId: result.submissionId
              }
            }
          }
        };
        
        const webhookResponse = await fetch('http://localhost:5173/api/stripe-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookData)
        });
        
        const webhookResult = await webhookResponse.json();
        console.log('✅ Payment webhook processed:', webhookResult.success);
        
        console.log('\n📧 EMAIL SHOULD NOW BE SENT TO: jeremylongshore@gmail.com');
        console.log('🔍 Check your inbox for Intent Solutions Inc. diagnostic report');
        console.log('⏱️ May take 1-2 minutes to arrive');
        
      }
    } else {
      console.error('❌ Diagnostic submission failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Real email trigger failed:', error.message);
    
    // Fallback: Try direct email service
    console.log('\n🔄 Attempting direct email service...');
    try {
      const emailProcess = spawn('node', ['-e', `
        const fs = require('fs');
        const path = require('path');
        
        // Try to use the email service directly
        console.log('📧 Attempting to load email service...');
        
        // Check if we can access the email generation functions
        const emailServicePath = './src/lib/services/emailService.js';
        
        if (fs.existsSync(emailServicePath)) {
          console.log('✅ Email service file found');
          console.log('⚠️ Need Gmail credentials to send actual email');
          console.log('🔧 Email service exists but needs configuration from Google Cloud Console');
        } else {
          console.log('❌ Email service file not found');
        }
      `]);
      
      emailProcess.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      
      emailProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });
      
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
    }
  }
}

triggerRealEmail();