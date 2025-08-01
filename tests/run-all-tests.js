#!/usr/bin/env node

/**
 * DiagnosticPro MVP - Comprehensive Test Runner
 * Executes all test suites with detailed reporting
 */

import { execSync } from 'child_process';
import fs from 'fs';

const testSuites = [
  {
    name: 'Setup & Dependencies',
    command: 'npx playwright test setup.setup.js',
    description: 'Verify system dependencies and environment'
  },
  {
    name: 'API Endpoints',
    command: 'npx playwright test api-endpoints.test.js',
    description: 'Direct API testing without browser overhead'
  },
  {
    name: 'AI Quality Validation', 
    command: 'npx playwright test ai-quality-validation.test.js',
    description: 'Validate AI response quality and accuracy'
  },
  {
    name: 'Email Verification',
    command: 'npx playwright test email-verification.test.js',
    description: 'Verify email delivery and content'
  },
  {
    name: 'End-to-End Workflows',
    command: 'npx playwright test e2e-complete-workflow.test.js',
    description: 'Complete customer journey testing'
  }
];

async function runTests() {
  console.log('🚀 DiagnosticPro MVP - Comprehensive Test Suite');
  console.log('=' .repeat(60));
  
  let totalPassed = 0;
  let totalFailed = 0;
  const results = [];
  
  // Ensure test results directory exists
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results', { recursive: true });
  }
  
  for (const suite of testSuites) {
    console.log(`\\n🧪 Running: ${suite.name}`);
    console.log(`📝 ${suite.description}`);
    console.log('-'.repeat(40));
    
    const startTime = Date.now();
    
    try {
      const output = execSync(suite.command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 600000 // 10 minute timeout per suite
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${suite.name} - PASSED (${duration}ms)`);
      console.log(output);
      
      totalPassed++;
      results.push({
        suite: suite.name,
        status: 'PASSED',
        duration,
        output
      });
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.log(`❌ ${suite.name} - FAILED (${duration}ms)`);
      console.log('Error output:', error.stdout || error.message);
      
      totalFailed++;
      results.push({
        suite: suite.name,
        status: 'FAILED', 
        duration,
        error: error.stdout || error.message
      });
    }
  }
  
  // Generate summary report
  console.log('\\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${result.suite} (${result.duration}ms)`);
  });
  
  console.log(`\\n🎯 Total: ${totalPassed + totalFailed} suites`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  
  if (totalFailed === 0) {
    console.log('\\n🎉 ALL TESTS PASSED! DiagnosticPro MVP is working perfectly!');
    console.log('💰 Your Vertex AI credits are being used efficiently');
    console.log('📧 Email delivery is functioning correctly');
    console.log('🤖 AI diagnostic quality is validated');
  } else {
    console.log(`\\n⚠️ ${totalFailed} test suite(s) failed. Review output above.`);
  }
  
  // Save detailed results
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalPassed + totalFailed,
      passed: totalPassed,
      failed: totalFailed
    },
    results
  };
  
  fs.writeFileSync('test-results/comprehensive-report.json', JSON.stringify(reportData, null, 2));
  console.log('\\n📁 Detailed report saved to: test-results/comprehensive-report.json');
  
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Handle interrupts gracefully
process.on('SIGINT', () => {
  console.log('\\n⚠️ Test run interrupted by user');
  process.exit(1);
});

runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});