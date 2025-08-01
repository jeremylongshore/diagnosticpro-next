const { chromium } = require('playwright');

async function testScenario1() {
  console.log('🧪 Testing Scenario 1: Car - Check Engine Light');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to form page...');
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Wait for the form to be fully loaded
    console.log('⏳ Waiting for equipment dropdown to be visible...');
    await page.waitForSelector('select', { timeout: 10000 });
    
    // Try to select equipment type
    console.log('🔧 Selecting equipment type...');
    await page.selectOption('select', 'Automotive (Cars, Trucks, SUVs, Vans)');
    
    console.log('✅ Equipment type selected successfully!');
    
    // Try to fill other fields
    await page.fill('input[placeholder*="2020"]', '2018');
    await page.fill('input[placeholder*="Caterpillar"]', 'Honda');
    await page.fill('input[placeholder*="Model"]', 'Civic');
    
    console.log('✅ Basic form fields filled successfully!');
    
    await page.screenshot({ path: '/tmp/scenario-1-success.png' });
    console.log('📸 Success screenshot saved!');
    
  } catch (error) {
    console.error('❌ Error in scenario 1:', error.message);
    await page.screenshot({ path: '/tmp/scenario-1-error.png' });
  } finally {
    await browser.close();
  }
}

testScenario1();