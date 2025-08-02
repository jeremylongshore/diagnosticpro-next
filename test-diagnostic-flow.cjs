const { chromium } = require('playwright');

(async () => {
  console.log('🔍 DiagnosticPro Production Site Analysis');
  console.log('📅 Test Date:', new Date().toISOString());
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('\n1️⃣ Accessing DiagnosticPro Production Site...');
    const startTime = Date.now();
    await page.goto('https://diagnosticpro-mvp-970547573997.us-central1.run.app/', { 
      waitUntil: 'networkidle' 
    });
    console.log('✅ Site loaded in', Date.now() - startTime, 'ms');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/production-landing.png', fullPage: true });
    
    // Get page content
    const pageTitle = await page.title();
    console.log('📄 Page Title:', pageTitle);
    
    // Check for service buttons
    const serviceButtons = await page.$$eval('button', buttons => 
      buttons.map(btn => btn.textContent.trim())
    );
    console.log('\n🔘 Buttons found on page:');
    serviceButtons.forEach((btn, i) => console.log(`   ${i + 1}. ${btn}`));
    
    // Check for pricing information
    const prices = await page.$$eval('[class*="price"], [class*="cost"], *:has-text("$")', elements => 
      elements.map(el => el.textContent.trim()).filter(text => text.includes('$'))
    );
    console.log('\n💰 Prices found:');
    prices.forEach(price => console.log(`   - ${price}`));
    
    // Look for forms
    const forms = await page.$$('form');
    console.log('\n📝 Forms found:', forms.length);
    
    // Check for emergency service
    const emergencyElements = await page.$$eval('*:has-text("emergency"), *:has-text("Emergency"), *:has-text("EMERGENCY")', 
      elements => elements.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 100)
      }))
    );
    console.log('\n🚨 Emergency elements:');
    emergencyElements.forEach(el => console.log(`   [${el.tag}] ${el.text}`));
    
    // Try to find the actual service selection
    console.log('\n2️⃣ Looking for service selection...');
    
    // Check if there's a different button text
    const allButtons = await page.$$eval('button, a[role="button"], [onclick]', elements => 
      elements.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        href: el.href || '',
        onclick: el.onclick ? 'has onclick' : 'no onclick'
      }))
    );
    
    console.log('\n🔘 All clickable elements:');
    allButtons.forEach(btn => {
      if (btn.text) {
        console.log(`   [${btn.tag}] "${btn.text}" - ${btn.onclick}`);
      }
    });
    
    // Save page HTML for inspection
    const html = await page.content();
    require('fs').writeFileSync('test-results/production-page.html', html);
    console.log('\n📄 Page HTML saved to test-results/production-page.html');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    await page.screenshot({ path: 'test-results/error-analysis.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n✅ Analysis completed');
  }
})();