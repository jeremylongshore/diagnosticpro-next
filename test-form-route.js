const https = require('https');

const baseUrl = 'https://diagnosticpro-mvp-970547573997.us-central1.run.app';

console.log('🧪 Testing form route accessibility...\n');

// Test form route
const options = {
  hostname: 'diagnosticpro-mvp-970547573997.us-central1.run.app',
  port: 443,
  path: '/form',
  method: 'GET',
  headers: {
    'User-Agent': 'DiagnosticPro-Test/1.0'
  }
};

const req = https.request(options, (res) => {
  console.log(`Form route status: ${res.statusCode}`);
  console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Form route is working!');
      console.log('Response length:', data.length);
      if (data.includes('diagnostic') || data.includes('form')) {
        console.log('✅ Form content detected in response');
      } else {
        console.log('⚠️ Form content not detected - checking first 500 chars:');
        console.log(data.substring(0, 500));
      }
    } else {
      console.log('❌ Form route failed');
      console.log('Response:', data.substring(0, 1000));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();