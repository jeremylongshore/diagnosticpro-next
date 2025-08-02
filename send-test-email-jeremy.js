/**
 * Quick test to send Jeremy a finalized diagnostic email
 */

import EmailService from './src/lib/services/emailService.js';
import PDFService from './src/lib/services/pdfService.js';

async function sendTestEmailToJeremy() {
    console.log('📧 Sending finalized DiagnosticPro email to Jeremy...');
    
    try {
        // Mock diagnostic data that shows the complete format
        const mockReportData = {
            equipmentType: 'Excavator',
            make: 'Caterpillar',
            model: '320D',
            year: '2018',
            problemDescription: 'Hydraulic system losing pressure, slow boom movement, and intermittent jerky operation especially when lifting heavy loads',
            errorCodes: 'E02-14, H11-03',
            diagnosis: 'Hydraulic pump failure with 87% confidence based on symptoms and error codes',
            recommendations: `
            **PRIMARY DIAGNOSIS (87% Confidence)**
            Root cause: Main hydraulic pump internal wear causing pressure loss and flow inconsistencies. Age and operating hours indicate normal wear timeline.
            
            **DIFFERENTIAL DIAGNOSIS**
            1. Main hydraulic pump failure (87% - symptoms match exactly)
            2. Hydraulic filter blockage (10% - would show different pressure patterns)  
            3. Relief valve malfunction (3% - unlikely with these specific error codes)
            
            **DIAGNOSTIC VERIFICATION**
            Shop MUST perform: Hydraulic pressure test at pump outlet (expect <2800 PSI vs normal 3200 PSI), flow rate test, and internal bypass analysis.
            Required tools: Digital pressure gauge set, flow meter, bypass tester
            Testing cost estimate: $150-200
            
            **SHOP INTERROGATION QUESTIONS**
            1. "What specific hydraulic pressure readings did you record at the pump outlet?"
            2. "Can you show me the flow rate test results compared to manufacturer specifications?"
            3. "Did you test the relief valve separately to rule out pressure regulation issues?"
            4. "What's the internal bypass percentage on the pump?"
            5. "Can you demonstrate the pressure drop under load conditions?"
            
            **COST BREAKDOWN**
            - Remanufactured pump: $2,800-3,200 (fair market)
            - New OEM pump: $4,500-5,200 
            - Labor (6-8 hours): $720-1,200
            - Hydraulic fluid/filters: $150-200
            - Total fair range: $3,670-4,600
            
            **RIPOFF DETECTION RED FLAGS**
            - Quotes over $6,000 without justification
            - Claiming need for "complete hydraulic system overhaul"
            - Refusing to show diagnostic test results
            - Pushing new parts when reman options available
            
            **AUTHORIZATION GUIDE**
            - APPROVE: Quotes $3,500-4,500 with proper testing documentation
            - REJECT: Quotes over $5,500 or without diagnostic proof
            - GET 2ND OPINION: Any quote suggesting additional major components
            
            **TECHNICAL EDUCATION**
            System operation: Hydraulic pump creates 3200 PSI system pressure driving all functions. Internal wear causes pressure bypass reducing available force.
            Failure mechanism: Pump pistons and valve plate wear over 8,000+ hours creating internal leakage paths.
            Prevention: Regular hydraulic fluid changes every 2,000 hours, quality filtration
            
            **OEM PARTS STRATEGY**
            - Cat part #: 2557634 (pump assembly)
            - Why OEM critical: Precise tolerances required for pressure specifications
            - Pricing sources: Cat dealer $4,800, reman specialist $3,100
            
            **NEGOTIATION TACTICS**
            - Compare quotes: "Independent shop quoted $3,800 for same repair"
            - Labor justification: "Book time shows 6 hours, explain the extra 2 hours"
            - Warranty demand: "Need 12-month warranty on reman pump minimum"
            
            **QUALITY VERIFICATION**
            - Post-repair test: Full hydraulic pressure test under load
            - Monitor: Operating temperature and pressure for first 50 hours
            - Return triggers: Pressure loss >10% or temperature spike >20°F
            
            **INSIDER INTELLIGENCE**
            - Known issue: 2018 Cat 320D pumps commonly fail 7,000-9,000 hours
            - TSB reference: CAT-TSB-2019-H14 (pump inspection intervals)
            - Common shortcut: Some shops skip bypass testing and guess
            `,
            estimatedCost: '$3,500-4,500 (fair market range)',
            urgencyLevel: 'medium',
            analysisTimestamp: new Date().toISOString(),
            paymentAmount: '$24.99',
            paymentStatus: 'PAID',
            submissionId: 'diag_test_jeremy_' + Date.now()
        };

        // Format the recommendations as HTML
        mockReportData.recommendationsHtml = mockReportData.recommendations
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        mockReportData.recommendationsHtml = '<p>' + mockReportData.recommendationsHtml + '</p>';

        console.log('✅ Mock data prepared - sending email to jeremylongshore@gmail.com');
        
        // Send the email
        await EmailService.sendDiagnosticReport(
            mockReportData,
            'jeremylongshore@gmail.com',
            'Jeremy Longshore',
            'jeremy@intentsolutions.io'  // CC Jeremy's business email
        );
        
        console.log('🎉 FINALIZED EMAIL SENT! Check your inbox at jeremylongshore@gmail.com');
        console.log('📋 This email shows the complete format customers will receive');
        
    } catch (error) {
        console.error('❌ Failed to send test email:', error);
        console.log('💡 Email template is ready - configuration needed for delivery');
        
        // Show what the email would contain
        console.log('\n📧 EMAIL PREVIEW:');
        console.log('Subject: Your DiagnosticPro Report for Excavator: Hydraulic system losing pressure...');
        console.log('To: jeremylongshore@gmail.com');
        console.log('Content: Complete 12-section diagnostic analysis with payment confirmation');
    }
}

// Run the test
sendTestEmailToJeremy();