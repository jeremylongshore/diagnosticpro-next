/**
 * Email Service for DiagnosticPro MVP
 * Handles sending diagnostic reports via Gmail API
 */

import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

class EmailService {
  constructor() {
    this.gmail = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Gmail API with service account and domain-wide delegation
      let auth;
      
      // Try to use service account key file first
      const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || '/home/jeremylongshore/diagnosticpro-gmail-key.json';
      try {
        const fs = await import('fs');
        if (fs.existsSync(keyFile)) {
          auth = new google.auth.GoogleAuth({
            keyFile: keyFile,
            scopes: GMAIL_SCOPES,
            // Use domain-wide delegation to impersonate jeremy email
            subject: 'support@diagnosticpro.io'
          });
          console.log('✅ Using service account key file for Gmail API');
        } else {
          throw new Error('Key file not found, using Application Default Credentials');
        }
      } catch (keyError) {
        console.log('⚠️ Service account key not found, using Application Default Credentials');
        // Fallback to Application Default Credentials with domain-wide delegation
        auth = new google.auth.GoogleAuth({
          scopes: GMAIL_SCOPES,
          // Use domain-wide delegation to impersonate the support email
          subject: 'support@diagnosticpro.io'
        });
      }

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
  async sendDiagnosticReport(reportData, customerEmail, customerName) {
    await this.initialize();

    // Generate dynamic subject line based on equipment and problem
    const subject = `Your DiagnosticPro Report for ${reportData.equipmentType || 'Equipment'}: ${reportData.problemDescription?.slice(0, 50) || 'Diagnostic Analysis'}${reportData.problemDescription?.length > 50 ? '...' : ''}`;
    
    const emailContent = this.generateReportEmail(reportData, customerName);
    
    // Generate PDF attachment
    console.log('📄 Generating PDF attachment...');
    const pdfBuffer = await this.generatePDF(reportData, customerName);
    const pdfFilename = `DiagnosticPro_Report_${reportData.equipmentType}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const rawMessage = this.createEmailMessageWithAttachment(
      'support@diagnosticpro.io',
      customerEmail,
      subject,
      emailContent,
      pdfBuffer,
      pdfFilename
    );

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage
        }
      });

      console.log('✅ Diagnostic report sent successfully via Gmail API:', response.data.id);
      console.log(`📧 Sent to: ${customerEmail} from support@diagnosticpro.io`);
      
      // Save email copy for records
      await this.saveEmailCopy(
        customerEmail,
        subject,
        emailContent,
        response.data.id,
        pdfBuffer,
        pdfFilename
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Gmail API failed, trying nodemailer fallback:', error.message);
      
      try {
        // Fallback to nodemailer with diagnosticpro.reports@gmail.com
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'diagnosticpro.reports@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD // You'll need to set this
          }
        });

        const mailOptions = {
          from: 'diagnosticpro.reports@gmail.com',
          to: customerEmail,
          subject: subject,
          html: emailContent
        };
        
        // Add PDF attachment if available
        if (pdfBuffer && pdfFilename) {
          mailOptions.attachments = [{
            filename: pdfFilename,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }];
        }
        
        await transporter.sendMail(mailOptions);

        console.log('✅ Diagnostic report sent successfully via nodemailer fallback');
        console.log(`📧 Sent to: ${customerEmail} from diagnosticpro.reports@gmail.com`);
        
        // Save email copy for records
        await this.saveEmailCopy(
          customerEmail,
          subject,
          emailContent,
          'nodemailer-fallback',
          pdfBuffer,
          pdfFilename
        );
        
        return { id: 'nodemailer-fallback' };
      } catch (fallbackError) {
        console.error('❌ Both Gmail API and nodemailer failed:', fallbackError);
        throw fallbackError;
      }
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
      analysisTimestamp,
      recommendationsHtml,
      paymentStatus,
      paymentAmount
    } = reportData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your DiagnosticPro Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f7fa; }
        .email-container { max-width: 800px; margin: 0 auto; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        
        /* Header Styling */
        .header { 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        .logo { 
            font-size: 32px; 
            font-weight: 800; 
            margin-bottom: 8px; 
            letter-spacing: -1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        .tagline { 
            font-size: 18px; 
            font-weight: 400; 
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: #10b981;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 1;
        }
        
        /* Content Styling */
        .content { padding: 40px 30px; }
        .greeting { 
            font-size: 24px; 
            font-weight: 600; 
            color: #1e293b; 
            margin-bottom: 20px;
        }
        .intro { 
            font-size: 16px; 
            color: #64748b; 
            margin-bottom: 30px; 
            line-height: 1.7;
        }
        
        /* Section Styling */
        .section { 
            margin-bottom: 30px; 
            padding: 25px; 
            border-radius: 12px;
            border-left: 5px solid #3b82f6; 
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .section h3 { 
            color: #0f172a; 
            margin-bottom: 15px; 
            font-size: 20px; 
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section p { margin-bottom: 10px; color: #475569; }
        .section strong { color: #0f172a; font-weight: 700; }
        
        /* Urgency Level Styling */
        .urgency-high { 
            border-left-color: #dc2626; 
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        }
        .urgency-medium { 
            border-left-color: #f59e0b; 
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }
        .urgency-low { 
            border-left-color: #059669; 
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }
        
        /* Equipment Info Grid */
        .equipment-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .equipment-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .equipment-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .equipment-value {
            font-size: 16px;
            color: #1e293b;
            font-weight: 600;
            margin-top: 4px;
        }
        
        /* CTA Button */
        .cta-section {
            text-align: center;
            margin: 30px 0;
        }
        .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        /* Footer */
        .footer { 
            background: #1e293b; 
            color: #94a3b8; 
            padding: 40px 30px; 
            text-align: center;
        }
        .footer-brand {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
        }
        .footer-subtitle {
            font-size: 14px;
            margin-bottom: 30px;
            opacity: 0.8;
        }
        
        /* Contact Cards */
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .contact-card {
            background: #334155;
            padding: 25px;
            border-radius: 12px;
            text-align: left;
        }
        .contact-card h4 {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            gap: 10px;
        }
        .contact-item a {
            color: #60a5fa;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .contact-item a:hover {
            color: #93c5fd;
        }
        
        /* Disclaimer */
        .disclaimer {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
            .email-container { margin: 0; }
            .header, .content, .footer { padding: 25px 20px; }
            .equipment-grid { grid-template-columns: 1fr; }
            .contact-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🔧 Intent Solutions Inc.</div>
            <div class="tagline">DiagnosticPro AI-Powered Analysis</div>
            <div class="status-badge">${paymentStatus || 'ANALYSIS COMPLETE'}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello ${customerName},</div>
            <div class="intro">
                Thank you for using DiagnosticPro! Attached is your professional diagnostic report for ${equipmentType}: ${problemDescription?.slice(0, 80) || 'Equipment Analysis'}${problemDescription?.length > 80 ? '...' : ''}. This report includes detailed findings and recommendations based on your submission.
            </div>

            <!-- Payment Details Section -->
            ${paymentAmount ? `<div class="section" style="border-left-color: #10b981; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                <h3>💳 Payment Details</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                        <div><strong>Amount:</strong> ${paymentAmount}</div>
                        <div><strong>Date:</strong> ${new Date(analysisTimestamp).toLocaleDateString()}</div>
                    </div>
                    <div><strong>Transaction ID:</strong> ${reportData.submissionId || 'Processing'}</div>
                </div>
            </div>` : ''}

            <!-- Equipment Details -->
            <div class="section">
                <h3>📋 Equipment Information</h3>
                <div class="equipment-grid">
                    <div class="equipment-item">
                        <div class="equipment-label">Equipment Type</div>
                        <div class="equipment-value">${equipmentType}</div>
                    </div>
                    <div class="equipment-item">
                        <div class="equipment-label">Make & Model</div>
                        <div class="equipment-value">${make} ${model}</div>
                    </div>
                    ${year ? `<div class="equipment-item">
                        <div class="equipment-label">Year</div>
                        <div class="equipment-value">${year}</div>
                    </div>` : ''}
                    ${errorCodes ? `<div class="equipment-item">
                        <div class="equipment-label">Error Codes</div>
                        <div class="equipment-value">${errorCodes}</div>
                    </div>` : ''}
                </div>
                <div style="margin-top: 20px;">
                    <strong>Problem Description:</strong><br>
                    <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; border: 1px solid #e2e8f0;">
                        ${problemDescription}
                    </div>
                </div>
            </div>

            <!-- Diagnosis -->
            <div class="section urgency-${urgencyLevel || 'medium'}">
                <h3>🔍 Professional Diagnostic Analysis</h3>
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    ${recommendationsHtml || `<p><strong>Diagnosis:</strong> ${diagnosis || 'Analysis completed'}</p>
                    <p><strong>Urgency Level:</strong> ${(urgencyLevel || 'medium').toUpperCase()}</p>`}
                </div>
                ${estimatedCost ? `<div style="margin-top: 15px; padding: 15px; background: #f0f9ff; border-radius: 6px; border: 1px solid #0ea5e9;">
                    <strong>💰 Estimated Cost Range:</strong> ${estimatedCost}
                </div>` : ''}
            </div>

            <!-- Next Steps -->
            <div class="section">
                <h3>⚡ Recommended Next Steps</h3>
                <ol style="margin-left: 20px; color: #475569;">
                    <li style="margin-bottom: 8px;">Review the complete diagnostic analysis above carefully</li>
                    <li style="margin-bottom: 8px;">Share this report with your preferred certified technician</li>
                    <li style="margin-bottom: 8px;">Request detailed verification of any recommended repairs</li>
                    <li style="margin-bottom: 8px;">Get a second opinion for any repairs over $1,000</li>
                    <li style="margin-bottom: 8px;">Keep this report for your equipment maintenance records</li>
                </ol>
                
                <div class="cta-section">
                    <a href="https://diagnosticpro.io" class="cta-button">Get Another Diagnosis</a>
                </div>
                
                <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b;">For any questions, contact us at <a href="mailto:support@diagnosticpro.io" style="color: #3b82f6; text-decoration: none; font-weight: 600;">support@diagnosticpro.io</a></p>
                </div>
            </div>

        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-brand">Intent Solutions Inc.</div>
            <div class="footer-subtitle">DiagnosticPro AI-Powered Analysis</div>
            <div style="font-size: 14px; margin-bottom: 20px;">
                Report generated on ${new Date(analysisTimestamp).toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Chicago',
                    timeZoneName: 'short'
                })}
            </div>
            
            <div class="contact-grid">
                <div class="contact-card">
                    <h4>📧 Customer Support</h4>
                    <div class="contact-item">
                        <span>✉️</span>
                        <a href="mailto:reports@diagnosticpro.io">reports@diagnosticpro.io</a>
                    </div>
                    <div class="contact-item">
                        <span>🔗</span>
                        <a href="https://linkedin.com/in/jeremylongshore">Jeremy Longshore</a>
                    </div>
                    <div class="contact-item">
                        <span>🐦</span>
                        <a href="https://twitter.com/AsphaltCowb0y">Jeremy Longshore</a>
                    </div>
                    <div class="contact-item">
                        <span>💼</span>
                        <a href="https://www.upwork.com/freelancers/jeremylongshore">Jeremy Longshore</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <h4>🏢 Intent Solutions Inc.</h4>
                    <div class="contact-item">
                        <span>🔧</span>
                        <span style="color: #94a3b8;">DiagnosticPro AI Platform</span>
                    </div>
                    <div class="contact-item">
                        <span>📧</span>
                        <a href="mailto:reports@diagnosticpro.io">reports@diagnosticpro.io</a>
                    </div>
                    <div class="contact-item">
                        <span>🌐</span>
                        <a href="https://jeremylongshore.com">jeremylongshore.com</a>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #475569; font-size: 14px;">
                <div style="margin-bottom: 15px; font-weight: 600; color: #ffffff;">Best regards,<br>The DiagnosticPro Team</div>
                <div style="font-size: 12px; opacity: 0.7;">
                    © 2025 Intent Solutions Inc. | DiagnosticPro AI Platform | All rights reserved<br>
                    This email was sent to a verified customer who purchased diagnostic services.
                </div>
            </div>
        </div>
        
        <!-- Important Disclaimer -->
        <div class="disclaimer">
            <strong>⚠️ Important Disclaimer:</strong><br>
            This diagnostic analysis is based on the information you provided and should be used as a professional starting point for equipment repair decisions. Always consult with a qualified, certified technician before authorizing any repairs. DiagnosticPro MVP provides diagnostic guidance but is not responsible for repair outcomes or damages. This report is for informational purposes and does not guarantee specific repair results.
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate PDF from email content
   */
  async generatePDF(reportData, customerName) {
    try {
      const pdfHtml = this.generatePDFTemplate(reportData, customerName);
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(pdfHtml, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      await browser.close();
      console.log('✅ PDF generated successfully');
      return pdfBuffer;
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      return null;
    }
  }

  /**
   * Generate PDF-optimized template
   */
  generatePDFTemplate(reportData, customerName) {
    const emailContent = this.generateReportEmail(reportData, customerName);
    
    // Optimize for PDF: remove animations, adjust colors for print
    return emailContent
      .replace(/transition: all 0\.3s ease;/g, '')
      .replace(/box-shadow: 0 [^;]+;/g, 'border: 1px solid #e2e8f0;')
      .replace(/background: linear-gradient\([^)]+\);/g, 'background: #f8fafc;')
      .replace('background: #1e293b;', 'background: #f8fafc; border-top: 2px solid #1e293b;');
  }

  /**
   * Create base64 encoded email message for Gmail API with attachment support
   */
  createEmailMessageWithAttachment(from, to, subject, htmlContent, pdfBuffer = null, pdfFilename = null, cc = null) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      htmlContent
    );
    
    if (pdfBuffer && pdfFilename) {
      messageParts.push(
        `--${boundary}`,
        'Content-Type: application/pdf',
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment; filename="${pdfFilename}"`,
        '',
        pdfBuffer.toString('base64')
      );
    }
    
    messageParts.push(`--${boundary}--`);
    
    const message = messageParts.join('\n');
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
  async saveEmailCopy(recipient, subject, content, emailId, pdfBuffer = null, pdfFilename = null) {
    try {
      const emailRecord = {
        timestamp: new Date().toISOString(),
        recipient,
        subject,
        content,
        gmailId: emailId,
        status: 'sent',
        pdfAttachment: pdfFilename || null
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
      
      // Save PDF attachment if provided
      if (pdfBuffer && pdfFilename) {
        const pdfPath = path.join(archiveDir, `${new Date().toISOString().split('T')[0]}-${pdfFilename}`);
        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log(`📄 PDF attachment saved: ${pdfPath}`);
      }
      
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
      'jeremy@intentsolutions.io',
      'jeremy@intentsolutions.io',
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
      'jeremy@intentsolutions.io',
      'jeremy@intentsolutions.io',
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