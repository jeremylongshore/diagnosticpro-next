/**
 * Test API validation to understand why it's returning 400
 */

async function testAPIValidation() {
  console.log('🔍 Testing API validation...');
  
  // Test with minimal required data first
  const minimalData = {
    fullName: 'Mandy Longshore',
    email: 'jeremylongshore@gmail.com',
    problemDescription: 'Engine misfiring badly under load'
  };
  
  console.log('📤 Testing minimal data...');
  console.log('Data:', JSON.stringify(minimalData, null, 2));
  
  try {
    const response = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/submit-diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalData)
    });

    console.log(`📊 Response status: ${response.status}`);
    
    const result = await response.text();
    console.log('📥 Response:', result);
    
    if (response.status === 400) {
      console.log('❌ 400 Bad Request - checking what fields are missing');
      
      // Try with all fields
      const fullData = {
        fullName: 'Mandy Longshore',
        email: 'jeremylongshore@gmail.com',
        phone: '555-0123',
        selectedService: 'diagnosis',
        equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
        make: 'John Deere',
        model: '350G',
        year: '2018',
        vin: '',
        mileage: '1500',
        errorCodes: 'P0420, P0171',
        problemDescription: 'Engine is misfiring badly under load. Mechanic says I need new engine but seems extreme. Please verify.',
        shopQuote: ''
      };
      
      console.log('\n📤 Testing with complete data...');
      
      const fullResponse = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/submit-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData)
      });

      console.log(`📊 Full data response status: ${fullResponse.status}`);
      const fullResult = await fullResponse.text();
      console.log('📥 Full response:', fullResult);
      
      if (fullResponse.ok) {
        console.log('✅ SUCCESS with complete data!');
        const parsedResult = JSON.parse(fullResult);
        if (parsedResult.submissionId) {
          console.log(`🎯 Submission ID: ${parsedResult.submissionId}`);
          return true;
        }
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Request failed:', error);
    return false;
  }
}

// Test different field combinations to find the issue
async function findMissingField() {
  console.log('\n🔍 Finding missing required field...');
  
  const baseData = {
    fullName: 'Mandy Longshore',
    email: 'jeremylongshore@gmail.com',
    problemDescription: 'Engine misfiring badly under load'
  };
  
  const optionalFields = [
    { phone: '555-0123' },
    { selectedService: 'diagnosis' },
    { equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)' },
    { make: 'John Deere' },
    { model: '350G' },
    { year: '2018' },
    { mileage: '1500' },
    { errorCodes: 'P0420, P0171' }
  ];
  
  let testData = { ...baseData };
  
  for (let field of optionalFields) {
    testData = { ...testData, ...field };
    const fieldName = Object.keys(field)[0];
    
    console.log(`🧪 Testing with ${fieldName}...`);
    
    try {
      const response = await fetch('https://diagnosticpro-mvp-970547573997.us-central1.run.app/api/submit-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`✅ SUCCESS! Required fields: ${Object.keys(testData).join(', ')}`);
        return true;
      }
      
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  return false;
}

// Run tests
testAPIValidation().then(async (success) => {
  if (!success) {
    await findMissingField();
  }
});