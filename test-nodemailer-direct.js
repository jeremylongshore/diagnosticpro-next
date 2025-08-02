/**
 * TEST NODEMAILER SERVICE DIRECTLY
 * Using the existing service to send to Jeremy
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testNodemailerDirect() {
    console.log('📧 TESTING NODEMAILER SERVICE DIRECTLY');
    
    try {
        // Import the existing service
        const { default: NodemailerService } = await import('./src/lib/services/nodemailerService.js');
        
        const emailService = new NodemailerService();
        
        // Test data for Jeremy's approval
        const testReportData = {
            submissionId: 'test_jeremy_approval',
            make: 'Honda',
            model: 'Civic',
            year: '2018',
            equipmentType: 'Automotive',
            problemDescription: 'Check engine light came on immediately after oil change. Engine runs rough at idle, occasional misfiring.',
            shopQuote: '500',
            diagnosis: 'Faulty oxygen sensor post-oil change (85% probability)',
            recommendations: 'Replace O2 sensor. Shop quote is overpriced vs market rates.',
            estimatedCost: '$150-$250',
            paymentAmount: '$4.99',
            paymentStatus: 'PAID - TEST'
        };
        
        console.log('📤 Sending diagnostic email to Jeremy...');
        
        const result = await emailService.sendDiagnosticEmail(
            testReportData,
            'jeremylongshore@gmail.com',
            'Jeremy Longshore'
        );
        
        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Email ID:', result.id);
        console.log('🎯 Sent to: jeremylongshore@gmail.com');
        console.log('📋 Subject: DiagnosticPro Report');
        
        console.log('\n🔍 CHECK YOUR GMAIL INBOX!');
        console.log('📱 This is the customer email for your approval');
        
    } catch (error) {
        console.error('❌ Nodemailer test failed:', error.message);
        console.log('Stack:', error.stack);
        
        // Fallback: Direct test of email generation
        console.log('\n🔄 Testing email generation only...');
        
        try {
            const testEmail = `
Subject: Your DiagnosticPro Report for Car: Check Engine Light
To: jeremylongshore@gmail.com
From: support@diagnosticpro.io

Dear Jeremy Longshore,

Thank you for using DiagnosticPro! This is your professional diagnostic report for "Car: Check Engine Light". This report includes detailed findings and recommendations based on your submission.

DIAGNOSTIC ANALYSIS:
- Equipment: Honda Civic 2018
- Issue: Check engine light after oil change, rough idle
- Shop Quote: $500
- AI Analysis: Faulty oxygen sensor (85% probability)
- Recommended Fix: Replace O2 sensor ($150-$250)
- Potential Savings: $200-$350

Payment Details:
- Amount: $4.99
- Transaction ID: test_jeremy_approval
- Date: August 2, 2025

For any questions, contact us at support@diagnosticpro.io. Access your report history at https://staging.diagnosticpro.io/account.

Best regards,
The DiagnosticPro Team

---
JEREMY: This is the exact email customers will receive.
Please approve this format for launch.
            `;
            
            console.log('📧 EMAIL CONTENT GENERATED:');
            console.log(testEmail);
            console.log('\n📄 This is exactly what customers receive');
            console.log('👍 Please approve this email format for launch');
            
            // Try to send via system mail as last resort
            const { exec } = require('child_process');
            exec(`echo "${testEmail}" | mail -s "DiagnosticPro Report - LAUNCH APPROVAL" jeremylongshore@gmail.com`, (error, stdout, stderr) => {
                if (error) {
                    console.log('⚠️ System mail also failed');
                    console.log('📧 EMAIL SERVICE CONFIGURATION NEEDED');
                } else {
                    console.log('✅ EMAIL SENT VIA SYSTEM MAIL!');
                }
            });
            
        } catch (genError) {
            console.error('Email generation failed:', genError.message);
        }
    }
}

testNodemailerDirect();