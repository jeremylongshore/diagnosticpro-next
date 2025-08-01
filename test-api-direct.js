/**
 * Direct API test to verify database fix
 * Tests the /api/submit-diagnosis endpoint directly
 */

async function testApiDirectly() {
  console.log('🔧 Testing API endpoint directly...');
  
  const testData = {
    fullName: 'Mandy Longshore',
    email: 'jeremylongshore@gmail.com',
    phone: '555-0123',
    selectedService: 'diagnosis',
    equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
    make: 'John Deere',
    model: '350G',
    year: '2018',
    mileage: '1500',
    errorCodes: 'P0420, P0171',
    problemDescription: 'Engine is misfiring badly, especially under load. Started yesterday and getting worse. Mechanic says I need a new engine but that seems extreme.',
  };

  try {
    console.log('📤 Sending POST request to /api/submit-diagnosis...');
    
    const response = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/submit-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log(`📊 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Success response:', result);
    
    if (result.success && result.submissionId && result.requiresPayment) {
      console.log(`🎯 Database fix worked! Submission ID: ${result.submissionId}`);
      console.log('💳 Form is correctly requesting payment');
      return true;
    } else {
      console.log('⚠️ Unexpected response structure');
      return false;
    }

  } catch (error) {
    console.error('❌ Request failed:', error);
    return false;
  }
}

// Run the test
testApiDirectly().then(success => {
  if (success) {
    console.log('\n🎉 DATABASE FIX SUCCESSFUL!');
    console.log('✅ API accepts form submissions');
    console.log('✅ Database connection/fallback is working');
    console.log('✅ Payment redirect logic is functioning');
  } else {
    console.log('\n❌ DATABASE FIX FAILED');
    console.log('🔍 API is still having issues');
  }
  process.exit(success ? 0 : 1);
});