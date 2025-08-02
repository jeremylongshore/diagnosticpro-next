/**
 * SEND REAL EMAIL USING GOOGLE WORKSPACE
 * Using authenticated gcloud credentials
 */

import { google } from 'googleapis';
import { readFileSync } from 'fs';

async function sendRealGmailTest() {
    console.log('📧 SENDING REAL EMAIL VIA GOOGLE WORKSPACE');
    console.log('🎯 Target: jeremylongshore@gmail.com');
    
    try {
        // Use default credentials from gcloud auth
        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/gmail.send']
        });

        const authClient = await auth.getClient();
        const gmail = google.gmail({ version: 'v1', auth: authClient });

        // Create email content (simple text version as requested)
        const emailContent = `Subject: Your DiagnosticPro Report for Car: Check Engine Light
To: jeremylongshore@gmail.com
From: jeremylongshore@gmail.com
Content-Type: text/plain; charset="UTF-8"

Dear Jeremy Longshore,

Thank you for using DiagnosticPro! Attached is your professional diagnostic report for "Car: Check Engine Light". This report includes detailed findings and recommendations based on your submission.

Payment Details:
- Amount: $4.99
- Transaction ID: ch_test_jeremy_approval
- Date: August 2, 2025

For any questions, contact us at support@diagnosticpro.io. Access your report history at https://staging.diagnosticpro.io/account.

Best regards,
The DiagnosticPro Team

---
This is a test email for launch approval.
DiagnosticPro MVP is ready for production deployment.
Please approve this email format to proceed with launch.
`;

        // Encode email for Gmail API
        const base64Email = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // Send email
        console.log('📤 Sending via Gmail API...');
        
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: base64Email
            }
        });

        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Gmail Message ID:', result.data.id);
        console.log('🎯 Sent to: jeremylongshore@gmail.com');
        console.log('📋 Subject: Your DiagnosticPro Report for Car: Check Engine Light');
        
        console.log('\n🔍 CHECK YOUR GMAIL INBOX NOW!');
        console.log('📱 This is the exact email customers will receive');
        console.log('👍 Please approve this format for launch');
        
        return result.data;
        
    } catch (error) {
        console.error('❌ Gmail API failed:', error.message);
        
        if (error.message.includes('insufficient authentication scopes')) {
            console.log('\n🔧 FIXING AUTHENTICATION SCOPES...');
            console.log('Running: gcloud auth application-default login --scopes=https://www.googleapis.com/auth/gmail.send');
            
            // Try to fix auth scopes
            const { exec } = require('child_process');
            exec('gcloud auth application-default login --scopes=https://www.googleapis.com/auth/gmail.send', (err, stdout, stderr) => {
                if (err) {
                    console.error('Auth fix failed:', err);
                } else {
                    console.log('✅ Auth scopes updated. Please run the script again.');
                }
            });
        } else {
            console.log('\n⚠️ Gmail API access may need additional setup');
            console.log('Trying alternative method...');
            
            // Alternative: Use the existing email service
            try {
                const { spawn } = require('child_process');
                const node = spawn('node', ['-e', `
                    // Try to use the existing email service
                    import('./src/lib/services/emailService.js').then(module => {
                        const EmailService = module.default;
                        const service = new EmailService();
                        return service.sendDiagnosticReport({
                            equipmentType: 'Automotive',
                            make: 'Honda',
                            model: 'Civic',
                            year: '2018',
                            problemDescription: 'Check engine light after oil change',
                            shopQuote: '500',
                            paymentAmount: '$4.99',
                            paymentStatus: 'PAID'
                        }, 'jeremylongshore@gmail.com', 'Jeremy Longshore');
                    }).catch(e => console.error('Email service failed:', e));
                `]);
                
                node.stdout.on('data', (data) => console.log(data.toString()));
                node.stderr.on('data', (data) => console.error(data.toString()));
                
            } catch (altError) {
                console.error('Alternative also failed:', altError.message);
            }
        }
    }
}

sendRealGmailTest();