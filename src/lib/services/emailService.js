/**
 * Email Service for DiagnosticPro MVP
 * Handles sending diagnostic reports via Gmail API
 */

import { google } from 'googleapis';

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

class EmailService {
  constructor() {
    this.gmail = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Gmail API with service account
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || '/home/jeremylongshore/diagnosticpro-gmail-key.json',
        scopes: GMAIL_SCOPES,
        subject: process.env.GMAIL_IMPERSONATION_EMAIL || 'support@diagnosticpro.io'
      });

      this.gmail = google.gmail({ version: 'v1', auth });
      this.initialized = true;
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      throw error;
    }
  }

  /**
   * Send diagnostic report email
   * @param {Object} reportData - The diagnostic report data
   * @param {string} customerEmail - Customer's email address
   * @param {string} customerName - Customer's name
   */
  async sendDiagnosticReport(reportData, customerEmail, customerName, ccEmail = 'jeremylongshore@gmail.com') {
    await this.initialize();

    const emailContent = this.generateReportEmail(reportData, customerName);
    const rawMessage = this.createEmailMessage(
      'support@diagnosticpro.io',
      customerEmail,
      'Your DiagnosticPro MVP Equipment Analysis Report',
      emailContent,
      ccEmail // Always CC Jeremy
    );

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage
        }
      });

      console.log('✅ Diagnostic report sent successfully:', response.data.id);
      console.log(`📧 Sent to: ${customerEmail}, CC: ${ccEmail}`);
      
      // Save email copy for records
      await this.saveEmailCopy(
        `${customerEmail} (CC: ${ccEmail})`,
        'Your DiagnosticPro MVP Equipment Analysis Report',
        emailContent,
        response.data.id
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send diagnostic report:', error);
      throw error;
    }
  }

  /**
   * Generate HTML email content for diagnostic report
   */
  generateReportEmail(reportData, customerName) {
    const {
      equipmentType,
      make,
      model,
      year,
      problemDescription,
      errorCodes,
      diagnosis,
      recommendations,
      estimatedCost,
      urgencyLevel,
      analysisTimestamp
    } = reportData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        .report-container { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 30px; background: #ffffff; }
        .section { margin-bottom: 25px; padding: 20px; border-left: 4px solid #3b82f6; background: #f8fafc; }
        .section h3 { color: #1e40af; margin-top: 0; font-size: 18px; }
        .urgency-high { border-left-color: #dc2626; background: #fef2f2; }
        .urgency-medium { border-left-color: #f59e0b; background: #fffbeb; }
        .urgency-low { border-left-color: #059669; background: #f0fdf4; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        .cta-button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="report-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">DiagnosticPro MVP</div>
            <p>Expert Equipment Diagnosis Report</p>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Hello ${customerName},</h2>
            <p>Your equipment diagnostic analysis is complete! Our AI-powered system has analyzed your ${equipmentType} and provided expert recommendations.</p>

            <!-- Equipment Details -->
            <div class="section">
                <h3>📋 Equipment Information</h3>
                <p><strong>Type:</strong> ${equipmentType}</p>
                <p><strong>Make/Model:</strong> ${make} ${model} ${year ? `(${year})` : ''}</p>
                <p><strong>Problem Description:</strong> ${problemDescription}</p>
                ${errorCodes ? `<p><strong>Error Codes:</strong> ${errorCodes}</p>` : ''}
            </div>

            <!-- Diagnosis -->
            <div class="section urgency-${urgencyLevel}">
                <h3>🔍 Diagnostic Analysis</h3>
                <p><strong>Diagnosis:</strong> ${diagnosis}</p>
                <p><strong>Urgency Level:</strong> ${urgencyLevel.toUpperCase()}</p>
            </div>

            <!-- Recommendations -->
            <div class="section">
                <h3>🛠️ Expert Recommendations</h3>
                <div>${recommendations}</div>
                ${estimatedCost ? `<p><strong>Estimated Repair Cost:</strong> ${estimatedCost}</p>` : ''}
            </div>

            <!-- Next Steps -->
            <div class="section">
                <h3>⚡ Next Steps</h3>
                <ol>
                    <li>Review the diagnostic findings above</li>
                    <li>Contact a qualified technician with this report</li>
                    <li>Show them the specific error codes and recommendations</li>
                    <li>Get a second opinion if the quote seems too high</li>
                </ol>
                <a href="https://diagnosticpro.io" class="cta-button">Get Another Diagnosis</a>
            </div>

            <!-- Disclaimer -->
            <div class="section">
                <h3>⚠️ Important Disclaimer</h3>
                <p><em>This analysis is based on the information provided and should be used as a starting point for professional repair. Always consult with a qualified technician before performing any repairs. DiagnosticPro MVP is not responsible for any damages resulting from the use of this information.</em></p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>DiagnosticPro MVP</strong> - Expert Equipment Diagnosis</p>
            <p>Report generated on ${new Date(analysisTimestamp).toLocaleString()}</p>
            
            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Contact & Support:</strong></p>
                <p style="margin: 5px 0;">📧 Email: <a href="mailto:support@diagnosticpro.io" style="color: #3b82f6;">support@diagnosticpro.io</a></p>
                <p style="margin: 5px 0;">🌐 Website: <a href="https://diagnosticpro.io" style="color: #3b82f6;">diagnosticpro.io</a></p>
                
                <div style="margin-top: 15px;">
                    <p style="margin: 5px 0;"><strong>Connect with Jeremy:</strong></p>
                    <p style="margin: 5px 0;">
                        🔗 <a href="https://www.linkedin.com/in/jeremylongshore" style="color: #3b82f6; margin-right: 15px;">LinkedIn</a>
                        🐦 <a href="https://x.com/AsphaltCowb0y" style="color: #3b82f6; margin-right: 15px;">Twitter/X</a>
                        💼 <a href="mailto:jeremy@intentsoultions.io" style="color: #3b82f6;">Direct Contact</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Create base64 encoded email message for Gmail API with CC support
   */
  createEmailMessage(from, to, subject, htmlContent, cc = null) {
    const messageParts = [
      `From: ${from}`,
      `To: ${to}`
    ];
    
    if (cc) {
      messageParts.push(`Cc: ${cc}`);
    }
    
    messageParts.push(
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlContent
    );

    const message = messageParts.join('\n');
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /**
   * Save email copy to local storage for record keeping
   */
  async saveEmailCopy(recipient, subject, content, emailId) {
    try {
      const emailRecord = {
        timestamp: new Date().toISOString(),
        recipient,
        subject,
        content,
        gmailId: emailId,
        status: 'sent'
      };
      
      // Create email archive directory if it doesn't exist
      const fs = await import('fs');
      const path = await import('path');
      
      const archiveDir = '/home/jeremylongshore/jeremy_projects/diagnosticpro-mvp/email-archive';
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }
      
      // Save individual email file
      const filename = `${new Date().toISOString().split('T')[0]}-${emailId}.json`;
      const filepath = path.join(archiveDir, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(emailRecord, null, 2));
      console.log(`📁 Email copy saved: ${filepath}`);
      
      return filepath;
    } catch (error) {
      console.error('⚠️ Failed to save email copy:', error);
    }
  }

  /**
   * Send notification about successful payment
   */
  async notifyPaymentReceived(paymentData) {
    await this.initialize();

    const { paymentIntentId, amount, customerEmail, customerName, serviceType } = paymentData;

    const emailContent = `
    <h2>💰 Payment Received - DiagnosticPro MVP</h2>
    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Service:</strong> ${serviceType.toUpperCase()}</p>
    <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
    <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Status:</strong> ✅ DIAGNOSTIC REPORT SENT</p>
    `;

    const rawMessage = this.createEmailMessage(
      'support@diagnosticpro.io',
      'jeremylongshore@gmail.com',
      `💰 Payment Received: $${amount} - DiagnosticPro MVP`,
      emailContent
    );

    try {
      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: rawMessage }
      });
      console.log('✅ Payment notification sent to admin');
    } catch (error) {
      console.error('❌ Failed to send payment notification:', error);
    }
  }

  /**
   * Send notification to admin about new diagnostic request
   */
  async notifyAdminNewRequest(formData) {
    await this.initialize();

    const emailContent = `
    <h2>New DiagnosticPro MVP Request</h2>
    <p><strong>Customer:</strong> ${formData.fullName} (${formData.email})</p>
    <p><strong>Equipment:</strong> ${formData.equipmentType} - ${formData.make} ${formData.model}</p>
    <p><strong>Problem:</strong> ${formData.problemDescription}</p>
    <p><strong>Service:</strong> ${formData.selectedService}</p>
    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    `;

    const rawMessage = this.createEmailMessage(
      'support@diagnosticpro.io',
      'jeremylongshore@gmail.com',
      'New DiagnosticPro MVP Request',
      emailContent
    );

    try {
      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: rawMessage }
      });
      console.log('✅ Admin notification sent');
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
    }
  }
}

export default new EmailService();