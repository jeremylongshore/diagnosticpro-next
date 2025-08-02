/**
 * Direct Email Test - Send Jeremy a diagnostic report for approval
 */

import nodemailer from 'nodemailer';

const mockReport = `
# Intent Solutions Inc. DiagnosticPro AI Report

**Intent Solutions Inc.**
**Date**: ${new Date().toLocaleDateString()}
**Customer**: Mandy Longshore (mandy.longshore@mockuser.com)
**Equipment**: Honda Civic 2018
**Issue**: Check engine light, rough idle after oil change
**Shop Quote**: $500

## AI Diagnosis

**Likely Cause**: Faulty oxygen sensor post-oil change (85% probability)

**Recommended Fix**: Replace O2 sensor (Estimated: $150-$250)

**Evaluation of Shop Quote**: $500 is overpriced compared to market rates ($200-$300)

**Next Steps**: 
1. Get second opinion before authorizing repair
2. Request specific diagnostic codes from shop
3. Verify sensor wiring before replacement

## Contact
**Intent Solutions Inc.**
- LinkedIn: linkedin.com/in/jeremylongshore
- Twitter: @jeremylongshore  
- Email: jeremylongshore@gmail.com

---
© 2025 Intent Solutions Inc. | DiagnosticPro AI Platform
`;

const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Intent Solutions Inc. DiagnosticPro AI Report</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .tagline { font-size: 16px; opacity: 0.9; }
        .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .section h3 { color: #1e293b; margin-top: 0; }
        .diagnosis { background: #fff7ed; border-left: 4px solid #f97316; }
        .contact { background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .contact a { color: #60a5fa; text-decoration: none; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🔧 Intent Solutions Inc.</div>
        <div class="tagline">DiagnosticPro AI-Powered Analysis</div>
        <div style="margin-top: 15px; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block;">
            ANALYSIS COMPLETE
        </div>
    </div>

    <div class="section">
        <h3>📋 Equipment Information</h3>
        <p><strong>Customer:</strong> Mandy Longshore (mandy.longshore@mockuser.com)</p>
        <p><strong>Equipment:</strong> Honda Civic 2018</p>
        <p><strong>Issue:</strong> Check engine light, rough idle after oil change</p>
        <p><strong>Shop Quote:</strong> $500</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section diagnosis">
        <h3>🔍 AI Diagnostic Analysis</h3>
        <p><strong>Likely Cause:</strong> Faulty oxygen sensor post-oil change (85% probability)</p>
        <p><strong>Recommended Fix:</strong> Replace O2 sensor (Estimated: $150-$250)</p>
        <p><strong>Quote Evaluation:</strong> $500 is overpriced compared to market rates ($200-$300)</p>
        
        <h4>Next Steps:</h4>
        <ul>
            <li>Get second opinion before authorizing repair</li>
            <li>Request specific diagnostic codes from shop</li>
            <li>Verify sensor wiring before replacement</li>
        </ul>
    </div>

    <div class="contact">
        <h3>📞 Intent Solutions Inc. Contact</h3>
        <p>
            <a href="https://linkedin.com/in/jeremylongshore">LinkedIn</a> | 
            <a href="https://twitter.com/jeremylongshore">Twitter</a> | 
            <a href="mailto:jeremylongshore@gmail.com">jeremylongshore@gmail.com</a>
        </p>
    </div>

    <div class="footer">
        © 2025 Intent Solutions Inc. | DiagnosticPro AI Platform | All rights reserved<br>
        This email was sent to a verified customer who purchased diagnostic services.
    </div>
</body>
</html>
`;

async function sendEmailToJeremy() {
    console.log('📧 Sending diagnostic report to Jeremy for approval...');
    
    try {
        // Create nodemailer transporter (using Gmail SMTP)
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER || 'reports@diagnosticpro.io',
                pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
            }
        });

        // Email content
        const mailOptions = {
            from: '"Intent Solutions Inc." <reports@diagnosticpro.io>',
            to: 'jeremylongshore@gmail.com',
            subject: 'Intent Solutions Inc. DiagnosticPro AI Report - APPROVAL NEEDED',
            text: mockReport,
            html: htmlReport
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Message ID:', result.messageId);
        console.log('🔍 CHECK YOUR EMAIL: jeremylongshore@gmail.com');
        console.log('👍 Please review and approve before launch');
        
    } catch (error) {
        console.error('❌ EMAIL FAILED:', error.message);
        console.log('\n📝 EMAIL CONTENT PREVIEW:');
        console.log('Subject: Intent Solutions Inc. DiagnosticPro AI Report - APPROVAL NEEDED');
        console.log('To: jeremylongshore@gmail.com');
        console.log('From: reports@diagnosticpro.io');
        console.log('\nContent Preview:');
        console.log(mockReport);
        
        console.log('\n⚠️ EMAIL SERVICE NOT CONFIGURED');
        console.log('Please set up GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
    }
}

sendEmailToJeremy();