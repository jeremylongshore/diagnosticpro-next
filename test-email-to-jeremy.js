/**
 * Test Email Generation - Send Real Diagnostic Report to Jeremy
 * This will generate and send an actual diagnostic email for approval
 */

import AIAnalysisService from './src/lib/services/aiAnalysisService.js';
import EmailService from './src/lib/services/emailService.js';

const testFormData = {
  problemDescription: 'Check engine light came on immediately after oil change. Engine runs rough at idle, occasional misfiring. Shop says it needs new oxygen sensor.',
  email: 'mandy.longshore@mockuser.com',
  fullName: 'Mandy Longshore',
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

async function sendTestEmail() {
  console.log('🧪 GENERATING TEST EMAIL FOR JEREMY APPROVAL');
  console.log('📧 Will send to: jeremylongshore@gmail.com');
  
  try {
    // Step 1: Generate AI diagnostic report
    console.log('\n🤖 Generating AI diagnostic analysis...');
    const aiService = new AIAnalysisService();
    await aiService.initialize();
    
    const diagnosticResult = await aiService.generateDiagnosticReport(testFormData);
    console.log('✅ AI analysis completed using:', diagnosticResult.aiModel);
    
    // Step 2: Prepare email data
    const emailData = {
      ...testFormData,
      ...diagnosticResult,
      paymentStatus: 'PAID - TEST TRANSACTION',
      paymentAmount: '$4.99',
      analysisTimestamp: new Date().toISOString()
    };
    
    // Step 3: Send email
    console.log('\n📤 Sending diagnostic report email...');
    const emailService = new EmailService();
    await emailService.initialize();
    
    const emailResult = await emailService.sendDiagnosticReport(
      emailData,
      'jeremylongshore@gmail.com', // Send to Jeremy for approval
      'Jeremy Longshore',
      'jeremylongshore@gmail.com' // CC to Jeremy
    );
    
    console.log('\n🎉 SUCCESS! Email sent to Jeremy for approval');
    console.log('📧 Email ID:', emailResult.id);
    console.log('📋 Report Summary:');
    console.log('   Equipment:', testFormData.equipmentType, testFormData.make, testFormData.model);
    console.log('   Issue:', testFormData.problemDescription.substring(0, 100) + '...');
    console.log('   Shop Quote:', '$' + testFormData.shopQuote);
    console.log('   AI Model Used:', diagnosticResult.aiModel);
    
    console.log('\n✅ CHECK YOUR EMAIL: jeremylongshore@gmail.com');
    console.log('🔍 Review the Intent Solutions Inc. branding and report quality');
    console.log('👍 Reply with approval to proceed with launch');
    
  } catch (error) {
    console.error('\n❌ EMAIL TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    
    // Try mock email as fallback
    console.log('\n🔄 Attempting mock email as fallback...');
    try {
      const mockEmailService = new EmailService();
      await mockEmailService.sendMockDiagnosticReport(testFormData, 'jeremylongshore@gmail.com');
      console.log('✅ Mock email sent as fallback');
    } catch (mockError) {
      console.error('❌ Mock email also failed:', mockError.message);
    }
  }
}

// Run the test
sendTestEmail();