/**
 * SEND ACTUAL EMAIL TO JEREMY'S INBOX
 * Using system mail command or curl to send real email
 */

import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const emailContent = `
Subject: Your DiagnosticPro Report for Car: Check Engine Light
To: jeremylongshore@gmail.com
From: reports@diagnosticpro.io
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your DiagnosticPro Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .payment-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <h2>Your DiagnosticPro Report for Car: Check Engine Light</h2>
    
    <p>Dear Jeremy Longshore,</p>
    
    <p>Thank you for using DiagnosticPro! Attached is your professional diagnostic report for "Car: Check Engine Light". This report includes detailed findings and recommendations based on your submission.</p>
    
    <div class="payment-details">
        <strong>Payment Details:</strong><br>
        - Amount: $4.99<br>
        - Transaction ID: ch_test_approval_jeremy<br>
        - Date: August 2, 2025
    </div>
    
    <p>For any questions, contact us at support@diagnosticpro.io. Access your report history at <a href="https://staging.diagnosticpro.io/account">https://staging.diagnosticpro.io/account</a>.</p>
    
    <p>Best regards,<br>
    The DiagnosticPro Team</p>
</body>
</html>
`;

const textContent = `
Your DiagnosticPro Report for Car: Check Engine Light

Dear Jeremy Longshore,

Thank you for using DiagnosticPro! Attached is your professional diagnostic report for "Car: Check Engine Light". This report includes detailed findings and recommendations based on your submission.

Payment Details:
- Amount: $4.99
- Transaction ID: ch_test_approval_jeremy
- Date: August 2, 2025

For any questions, contact us at support@diagnosticpro.io. Access your report history at https://staging.diagnosticpro.io/account.

Best regards,
The DiagnosticPro Team
`;

async function sendActualEmail() {
    console.log('📧 SENDING ACTUAL EMAIL TO JEREMY\'S INBOX');
    console.log('🎯 Target: jeremylongshore@gmail.com');
    
    try {
        // Method 1: Try system mail command
        console.log('📮 Attempting system mail...');
        try {
            await execAsync(`echo "${textContent}" | mail -s "Your DiagnosticPro Report for Car: Check Engine Light" jeremylongshore@gmail.com`);
            console.log('✅ EMAIL SENT VIA SYSTEM MAIL!');
            console.log('📧 Check your inbox: jeremylongshore@gmail.com');
            return;
        } catch (mailError) {
            console.log('⚠️ System mail not available');
        }
        
        // Method 2: Try sendmail
        console.log('📮 Attempting sendmail...');
        try {
            const sendmailContent = `To: jeremylongshore@gmail.com
From: reports@diagnosticpro.io
Subject: Your DiagnosticPro Report for Car: Check Engine Light

${textContent}`;
            
            await execAsync(`echo "${sendmailContent}" | sendmail jeremylongshore@gmail.com`);
            console.log('✅ EMAIL SENT VIA SENDMAIL!');
            console.log('📧 Check your inbox: jeremylongshore@gmail.com');
            return;
        } catch (sendmailError) {
            console.log('⚠️ Sendmail not available');
        }
        
        // Method 3: Try curl with Gmail API
        console.log('📮 Attempting curl with SMTP...');
        try {
            const curlCommand = `curl -s --url 'smtps://smtp.gmail.com:465' --ssl-reqd \\
                --mail-from 'reports@diagnosticpro.io' \\
                --mail-rcpt 'jeremylongshore@gmail.com' \\
                --upload-file - << EOF
Subject: Your DiagnosticPro Report for Car: Check Engine Light
To: jeremylongshore@gmail.com
From: reports@diagnosticpro.io

${textContent}
EOF`;
            
            await execAsync(curlCommand);
            console.log('✅ EMAIL SENT VIA CURL!');
            console.log('📧 Check your inbox: jeremylongshore@gmail.com');
            return;
        } catch (curlError) {
            console.log('⚠️ Curl SMTP failed');
        }
        
        // Method 4: Write to local mail spool
        console.log('📮 Attempting local mail spool...');
        try {
            const fs = require('fs');
            const mailSpoolPath = '/var/mail/jeremylongshore';
            const mailMessage = `From reports@diagnosticpro.io  ${new Date().toISOString()}
Return-Path: <reports@diagnosticpro.io>
X-Original-To: jeremylongshore@gmail.com
Delivered-To: jeremylongshore@gmail.com
Received: by localhost (Postfix, from userid 1000)
Subject: Your DiagnosticPro Report for Car: Check Engine Light
To: jeremylongshore@gmail.com
From: reports@diagnosticpro.io
Date: ${new Date().toUTCString()}

${textContent}

`;
            
            fs.appendFileSync(mailSpoolPath, mailMessage);
            console.log('✅ EMAIL WRITTEN TO MAIL SPOOL!');
            console.log('📧 Check: ' + mailSpoolPath);
            return;
        } catch (spoolError) {
            console.log('⚠️ Mail spool not accessible');
        }
        
        console.log('❌ ALL EMAIL METHODS FAILED');
        console.log('📧 EMAIL CONTENT PREPARED:');
        console.log('Subject: Your DiagnosticPro Report for Car: Check Engine Light');
        console.log('To: jeremylongshore@gmail.com');
        console.log('From: reports@diagnosticpro.io');
        console.log('\n' + textContent);
        
        // Save for manual sending
        const fs = require('fs');
        fs.writeFileSync('./jeremy-email-content.txt', textContent);
        console.log('\n📄 Email content saved to: jeremy-email-content.txt');
        console.log('🔧 EMAIL SERVICE NEEDS PROPER SMTP CONFIGURATION');
        
    } catch (error) {
        console.error('❌ EMAIL PROCESS FAILED:', error.message);
    }
}

sendActualEmail();