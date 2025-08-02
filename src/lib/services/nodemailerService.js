/**
 * Nodemailer Email Service for DiagnosticPro MVP
 * Actually sends emails using SMTP and saves copies to database
 */

import nodemailer from 'nodemailer';
import DatabaseService from '../server/database.js';

class NodemailerService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Create SMTP transporter - using Gmail SMTP as fallback
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'diagnosticpro.reports@gmail.com',
          pass: process.env.SMTP_PASS || 'your-app-password'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Test the connection
      await this.transporter.verify();
      this.initialized = true;
      console.log('✅ Nodemailer service initialized successfully');
    } catch (error) {
      console.log('⚠️ SMTP not configured, using alternative method');
      // Continue without SMTP - we'll use alternative sending method
      this.initialized = true;
    }
  }

  /**
   * Send diagnostic report email to customer and save copy to database
   */
  async sendDiagnosticEmail(reportData, customerEmail, customerName) {
    await this.initialize();

    const emailContent = this.generateEmailHTML(reportData, customerName);
    const subject = `🔧 Your DiagnosticPro MVP Equipment Analysis Report - ${reportData.make} ${reportData.model}`;

    const emailRecord = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_email: customerEmail,
      customer_name: customerName,
      subject: subject,
      content: emailContent,
      submission_id: reportData.submissionId,
      equipment: `${reportData.make} ${reportData.model}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      sent_at: null
    };

    try {
      // Method 1: Try SMTP if configured
      if (this.transporter) {
        try {
          const mailOptions = {
            from: `"DiagnosticPro MVP" <support@diagnosticpro.io>`,
            to: customerEmail,
            cc: 'jeremylongshore@gmail.com', // Always CC Jeremy
            subject: subject,
            html: emailContent
          };

          const result = await this.transporter.sendMail(mailOptions);
          emailRecord.status = 'sent';
          emailRecord.sent_at = new Date().toISOString();
          emailRecord.smtp_message_id = result.messageId;
          
          console.log(`✅ Email sent via SMTP to ${customerEmail}`);
          console.log(`📧 Message ID: ${result.messageId}`);
        } catch (smtpError) {
          console.log(`⚠️ SMTP failed: ${smtpError.message}`);
          throw smtpError;
        }
      } else {
        throw new Error('SMTP not configured');
      }

    } catch (error) {
      console.log('📧 SMTP not available, using alternative delivery method...');
      
      // Method 2: Save email for manual/alternative delivery
      emailRecord.status = 'ready_for_delivery';
      emailRecord.delivery_method = 'manual';
      
      // Save email to file system as backup
      const fs = await import('fs');
      const emailFile = `/home/jeremylongshore/diagnostic-pro-mvp/emails/email_${emailRecord.id}.html`;
      fs.writeFileSync(emailFile, emailContent);
      emailRecord.file_path = emailFile;
      
      console.log(`📁 Email saved for delivery: ${emailFile}`);
    }

    // Always save email record to database
    await this.saveEmailToDatabase(emailRecord);
    
    return emailRecord;
  }

  /**
   * Save email record to database
   */
  async saveEmailToDatabase(emailRecord) {
    try {
      const query = `
        INSERT INTO email_records (
          id, customer_email, customer_name, subject, content, 
          submission_id, equipment, status, created_at, sent_at,
          smtp_message_id, delivery_method, file_path
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          sent_at = EXCLUDED.sent_at,
          smtp_message_id = EXCLUDED.smtp_message_id
      `;

      await DatabaseService.query(query, [
        emailRecord.id,
        emailRecord.customer_email,
        emailRecord.customer_name,
        emailRecord.subject,
        emailRecord.content,
        emailRecord.submission_id,
        emailRecord.equipment,
        emailRecord.status,
        emailRecord.created_at,
        emailRecord.sent_at,
        emailRecord.smtp_message_id || null,
        emailRecord.delivery_method || 'smtp',
        emailRecord.file_path || null
      ]);

      console.log(`💾 Email record saved to database: ${emailRecord.id}`);
      return emailRecord;
      
    } catch (dbError) {
      console.error('❌ Failed to save email to database:', dbError);
      
      // If database fails, ensure we still have file backup
      try {
        const fs = await import('fs');
        const backupFile = `/home/jeremylongshore/diagnostic-pro-mvp/emails/backup_${emailRecord.id}.json`;
        fs.writeFileSync(backupFile, JSON.stringify(emailRecord, null, 2));
        console.log(`📁 Email record backed up to file: ${backupFile}`);
      } catch (fileError) {
        console.error('❌ Failed to create file backup:', fileError);
      }
      
      return emailRecord;
    }
  }

  /**
   * Generate beautiful HTML email content using the polished template
   */
  generateEmailHTML(reportData, customerName) {
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
      paymentAmount,
      submissionId
    } = reportData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DiagnosticPro MVP - Equipment Analysis Report</title>
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
        .logo { 
            font-size: 32px; 
            font-weight: 800; 
            margin-bottom: 8px; 
            letter-spacing: -1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .tagline { 
            font-size: 18px; 
            font-weight: 300; 
            opacity: 0.9;
            margin-bottom: 15px;
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
            color: #1e293b; 
            margin-bottom: 15px; 
            font-size: 20px; 
            font-weight: 700;
        }
        .section p { margin-bottom: 10px; color: #475569; }
        .section strong { color: #1e293b; font-weight: 600; }
        
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
            <div class="logo">🔧 DiagnosticPro MVP</div>
            <div class="tagline">Professional Equipment Diagnostic Analysis</div>
            <div class="status-badge">${paymentStatus || 'ANALYSIS COMPLETE'}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello ${customerName},</div>
            <div class="intro">
                Your comprehensive equipment diagnostic analysis has been completed! Our advanced AI-powered diagnostic system has thoroughly analyzed your ${equipmentType} and generated expert recommendations to help you make informed repair decisions.
                ${paymentAmount ? `<br><br><strong>Payment Confirmed:</strong> ${paymentAmount} - Thank you for choosing DiagnosticPro MVP!` : ''}
            </div>

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
            </div>

            <!-- Disclaimer -->
            <div class="disclaimer">
                <strong>⚠️ Important Disclaimer:</strong><br>
                This diagnostic analysis is based on the information you provided and should be used as a professional starting point for equipment repair decisions. Always consult with a qualified, certified technician before authorizing any repairs. DiagnosticPro MVP provides diagnostic guidance but is not responsible for repair outcomes or damages. This report is for informational purposes and does not guarantee specific repair results.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-brand">DiagnosticPro MVP</div>
            <div class="footer-subtitle">Professional Equipment Diagnostic Services</div>
            <div style="font-size: 14px; margin-bottom: 20px;">
                Report generated on ${new Date(analysisTimestamp).toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                })}
            </div>
            
            <div class="contact-grid">
                <div class="contact-card">
                    <h4>📧 Customer Support</h4>
                    <div class="contact-item">
                        <span>✉️</span>
                        <a href="mailto:support@diagnosticpro.io">support@diagnosticpro.io</a>
                    </div>
                    <div class="contact-item">
                        <span>🌐</span>
                        <a href="https://diagnosticpro.io">diagnosticpro.io</a>
                    </div>
                    <div class="contact-item">
                        <span>📱</span>
                        <span style="color: #94a3b8;">24/7 Support Available</span>
                    </div>
                </div>
                
                <div class="contact-card">
                    <h4>👨‍💼 Connect with Jeremy Longshore</h4>
                    <div class="contact-item">
                        <span>🔗</span>
                        <a href="https://www.linkedin.com/in/jeremylongshore">LinkedIn Profile</a>
                    </div>
                    <div class="contact-item">
                        <span>🐦</span>
                        <a href="https://x.com/AsphaltCowb0y">@AsphaltCowb0y</a>
                    </div>
                    <div class="contact-item">
                        <span>📧</span>
                        <a href="mailto:jeremy@intentsolutions.io">jeremy@intentsolutions.io</a>
                    </div>
                    <div class="contact-item">
                        <span>🏢</span>
                        <a href="https://intentsolutions.io">Intent Solutions</a>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #475569; font-size: 12px; opacity: 0.7;">
                © 2025 DiagnosticPro MVP | Intent Solutions | All rights reserved<br>
                This email was sent to a verified customer who purchased diagnostic services.<br>
                Report ID: ${submissionId}
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Create email records table if it doesn't exist
   */
  async createEmailRecordsTable() {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS email_records (
          id VARCHAR(255) PRIMARY KEY,
          customer_email VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255),
          subject TEXT,
          content TEXT,
          submission_id VARCHAR(255),
          equipment VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          sent_at TIMESTAMP,
          smtp_message_id TEXT,
          delivery_method VARCHAR(50) DEFAULT 'smtp',
          file_path TEXT,
          FOREIGN KEY (submission_id) REFERENCES diagnostic_submissions(id)
        );
      `;
      
      await DatabaseService.query(createTableQuery);
      console.log('✅ Email records table ready');
    } catch (error) {
      console.log('⚠️ Could not create email records table:', error.message);
    }
  }
}

export default new NodemailerService();