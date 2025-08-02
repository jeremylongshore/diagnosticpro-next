/**
 * PDF Generation Service for DiagnosticPro MVP
 * Converts AI diagnostic analysis into professional PDF reports
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

class PDFService {
  constructor() {
    this.browser = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Puppeteer with optimal settings for PDF generation
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-default-apps'
        ]
      });
      
      this.initialized = true;
      console.log('✅ PDF service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PDF service:', error);
      throw error;
    }
  }

  /**
   * Generate PDF report from diagnostic data
   * @param {Object} reportData - The diagnostic report data
   * @param {string} customerName - Customer's name
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generateDiagnosticPDF(reportData, customerName) {
    await this.initialize();

    const htmlContent = this.generatePDFHTML(reportData, customerName);
    
    try {
      const page = await this.browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 1600 });
      
      // Set content with base URL for asset loading
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Generate PDF with professional settings
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; width: 100%; text-align: center; color: #64748b;">
            <span style="margin-left: 48px;">DiagnosticPro MVP - Professional Equipment Analysis</span>
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; width: 100%; text-align: center; color: #64748b; margin: 0 48px;">
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            <span style="float: right;">© 2025 DiagnosticPro MVP | support@diagnosticpro.io</span>
          </div>
        `
      });
      
      await page.close();
      
      console.log(`✅ PDF generated successfully (${pdfBuffer.length} bytes)`);
      return pdfBuffer;
      
    } catch (error) {
      console.error('❌ Failed to generate PDF:', error);
      throw error;
    }
  }

  /**
   * Generate HTML content optimized for PDF rendering
   */
  generatePDFHTML(reportData, customerName) {
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
    <title>DiagnosticPro MVP - Equipment Analysis Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1e293b; 
            background: #ffffff;
            font-size: 12px;
        }
        
        .pdf-container { 
            max-width: 100%; 
            margin: 0;
            padding: 20px;
        }
        
        /* Header Styling */
        .header { 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .logo { 
            font-size: 28px; 
            font-weight: 800; 
            margin-bottom: 8px; 
            letter-spacing: -1px;
        }
        
        .tagline { 
            font-size: 16px; 
            font-weight: 300; 
            opacity: 0.9;
            margin-bottom: 15px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            background: #10b981;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Report Info */
        .report-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 1px solid #e2e8f0;
        }
        
        .report-info h2 {
            color: #1e293b;
            font-size: 20px;
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .info-label {
            font-weight: 600;
            color: #64748b;
        }
        
        .info-value {
            color: #1e293b;
            font-weight: 500;
        }
        
        /* Section Styling */
        .section { 
            margin-bottom: 25px; 
            padding: 20px; 
            border-radius: 8px;
            border-left: 4px solid #3b82f6; 
            background: #f8fafc;
            page-break-inside: avoid;
        }
        
        .section h3 { 
            color: #1e293b; 
            margin-bottom: 12px; 
            font-size: 16px; 
            font-weight: 700;
        }
        
        .section p { 
            margin-bottom: 8px; 
            color: #475569; 
            font-size: 11px;
            line-height: 1.5;
        }
        
        .section strong { 
            color: #1e293b; 
            font-weight: 600; 
        }
        
        /* Urgency Level Styling */
        .urgency-high { 
            border-left-color: #dc2626; 
            background: #fef2f2;
        }
        .urgency-medium { 
            border-left-color: #f59e0b; 
            background: #fffbeb;
        }
        .urgency-low { 
            border-left-color: #059669; 
            background: #f0fdf4;
        }
        
        /* Equipment Info Grid */
        .equipment-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 12px;
        }
        
        .equipment-item {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        
        .equipment-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .equipment-value {
            font-size: 12px;
            color: #1e293b;
            font-weight: 600;
        }
        
        /* Problem Description */
        .problem-description {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
            border: 1px solid #e2e8f0;
            font-size: 11px;
            line-height: 1.6;
        }
        
        /* Analysis Section */
        .analysis-section {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            font-size: 11px;
            line-height: 1.5;
        }
        
        .cost-estimate {
            margin-top: 12px;
            padding: 12px;
            background: #f0f9ff;
            border-radius: 6px;
            border: 1px solid #0ea5e9;
            font-size: 11px;
        }
        
        /* Next Steps */
        .next-steps ol {
            margin-left: 16px;
            font-size: 11px;
            line-height: 1.5;
        }
        
        .next-steps li {
            margin-bottom: 6px;
            color: #475569;
        }
        
        /* Footer */
        .footer {
            background: #1e293b;
            color: #94a3b8;
            padding: 25px;
            text-align: center;
            border-radius: 8px;
            margin-top: 30px;
            page-break-inside: avoid;
        }
        
        .footer-brand {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
            font-size: 10px;
        }
        
        .contact-card {
            background: #334155;
            padding: 15px;
            border-radius: 8px;
            text-align: left;
        }
        
        .contact-card h4 {
            color: #ffffff;
            font-size: 12px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .contact-item {
            margin-bottom: 6px;
            font-size: 10px;
        }
        
        .contact-item a {
            color: #60a5fa;
            text-decoration: none;
        }
        
        /* Page breaks */
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="pdf-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🔧 DiagnosticPro MVP</div>
            <div class="tagline">Professional Equipment Diagnostic Analysis</div>
            <div class="status-badge">${paymentStatus || 'ANALYSIS COMPLETE'}</div>
        </div>

        <!-- Report Information -->
        <div class="report-info">
            <h2>Diagnostic Report for ${customerName}</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Report ID:</span>
                    <span class="info-value">${submissionId || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Generated:</span>
                    <span class="info-value">${new Date(analysisTimestamp).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Equipment:</span>
                    <span class="info-value">${make} ${model}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Service:</span>
                    <span class="info-value">${paymentAmount || 'Professional Analysis'}</span>
                </div>
            </div>
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
            <div style="margin-top: 15px;">
                <strong>Problem Description:</strong>
                <div class="problem-description">
                    ${problemDescription}
                </div>
            </div>
        </div>

        <!-- Diagnosis Analysis -->
        <div class="section urgency-${urgencyLevel || 'medium'}">
            <h3>🔍 Professional Diagnostic Analysis</h3>
            <div class="analysis-section">
                ${recommendationsHtml || `<p><strong>Diagnosis:</strong> ${diagnosis || 'Analysis completed'}</p>
                <p><strong>Urgency Level:</strong> ${(urgencyLevel || 'medium').toUpperCase()}</p>`}
            </div>
            ${estimatedCost ? `<div class="cost-estimate">
                <strong>💰 Estimated Cost Range:</strong> ${estimatedCost}
            </div>` : ''}
        </div>

        <!-- Next Steps -->
        <div class="section next-steps">
            <h3>⚡ Recommended Next Steps</h3>
            <ol>
                <li>Review the complete diagnostic analysis above carefully</li>
                <li>Share this report with your preferred certified technician</li>
                <li>Request detailed verification of any recommended repairs</li>
                <li>Get a second opinion for any repairs over $1,000</li>
                <li>Keep this report for your equipment maintenance records</li>
            </ol>
        </div>

        <!-- Disclaimer -->
        <div class="section">
            <h3>⚠️ Important Disclaimer</h3>
            <p><strong>Professional Guidance:</strong> This diagnostic analysis is based on the information you provided and should be used as a professional starting point for equipment repair decisions. Always consult with a qualified, certified technician before authorizing any repairs.</p>
            <p><strong>Liability:</strong> DiagnosticPro MVP provides diagnostic guidance but is not responsible for repair outcomes or damages. This report is for informational purposes and does not guarantee specific repair results.</p>
            <p><strong>Warranty:</strong> This analysis is provided with professional care but no warranty is implied for the accuracy of third-party repair recommendations.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-brand">DiagnosticPro MVP</div>
            <div style="font-size: 11px; margin-bottom: 15px;">
                Professional Equipment Diagnostic Services<br>
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
                    <div class="contact-item">Email: support@diagnosticpro.io</div>
                    <div class="contact-item">Web: diagnosticpro.io</div>
                    <div class="contact-item">Support: 24/7 Available</div>
                </div>
                
                <div class="contact-card">
                    <h4>👨‍💼 Jeremy Longshore</h4>
                    <div class="contact-item">LinkedIn: /in/jeremylongshore</div>
                    <div class="contact-item">Twitter: @AsphaltCowb0y</div>
                    <div class="contact-item">Email: jeremy@intentsolutions.io</div>
                    <div class="contact-item">Company: Intent Solutions</div>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #475569; font-size: 9px; opacity: 0.7;">
                © 2025 DiagnosticPro MVP | Intent Solutions | All rights reserved<br>
                This report was generated for a verified customer who purchased diagnostic services.
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Save PDF to file system
   * @param {Buffer} pdfBuffer - The PDF buffer
   * @param {string} filename - Filename for the PDF
   * @returns {Promise<string>} File path
   */
  async savePDF(pdfBuffer, filename) {
    try {
      const reportsDir = '/home/jeremylongshore/diagnostic-pro-mvp/reports';
      
      // Create reports directory if it doesn't exist
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const filepath = path.join(reportsDir, filename);
      fs.writeFileSync(filepath, pdfBuffer);
      
      console.log(`📁 PDF saved: ${filepath}`);
      return filepath;
      
    } catch (error) {
      console.error('❌ Failed to save PDF:', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.initialized = false;
      console.log('🧹 PDF service cleaned up');
    }
  }
}

export default new PDFService();