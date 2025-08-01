const { chromium } = require('playwright');

async function testFormPage() {
  console.log('🧪 Testing form page content...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to form page...');
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/form', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check for key form elements
    const formElements = await page.evaluate(() => {
      return {
        hasForm: !!document.querySelector('form'),
        hasSelect: !!document.querySelector('select'),
        selectOptions: Array.from(document.querySelectorAll('select option')).map(opt => opt.textContent.trim()).slice(0, 10),
        hasInputs: document.querySelectorAll('input').length,
        hasTextareas: document.querySelectorAll('textarea').length,
        formText: document.body.innerText.includes('Equipment') ? 'Contains Equipment text' : 'No Equipment text',
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()).slice(0, 5),
        bodySnippet: document.body.innerText.substring(0, 200)
      };
    });
    
    console.log('🔍 Form analysis:', JSON.stringify(formElements, null, 2));
    
    // Take a screenshot for debugging
    await page.screenshot({ path: '/tmp/form-page-debug.png', fullPage: true });
    console.log('📸 Screenshot saved to /tmp/form-page-debug.png');
    
  } catch (error) {
    console.error('❌ Error testing form page:', error.message);
  } finally {
    await browser.close();
  }
}

testFormPage();