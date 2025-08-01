import { test, expect, request } from '@playwright/test';

/**
 * API Endpoint Tests for DiagnosticPro MVP
 * Direct testing of the backend API without browser overhead
 */

const API_BASE = process.env.BASE_URL || 'http://localhost:5173';

test.describe('API Endpoint Tests', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('API Health Check', async () => {
    console.log('🏥 Testing API health...');
    
    const response = await apiContext.get('/');
    expect(response.status()).toBe(200);
    
    console.log('✅ API is responding');
  });

  test('Diagnostic Submission - Valid Request', async () => {
    console.log('🔍 Testing valid diagnostic submission...');
    
    const diagnosticData = {
      equipmentType: 'Excavator',
      year: '2020',
      make: 'Caterpillar',
      model: '320D',
      serialNumber: 'CAT123456789',
      mileage: '3500 hours',
      errorCodes: 'P0012, P0016',
      problemDescription: 'Engine running rough, losing power under load. Started after recent maintenance.',
      fullName: 'API Test User',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'diagnostic'
    };

    const response = await apiContext.post('/api/submit-diagnosis', {
      data: diagnosticData
    });

    console.log(`📊 Response status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    console.log('📋 Response data:', JSON.stringify(responseData, null, 2));

    // Verify response structure
    expect(responseData.success).toBe(true);
    expect(responseData.message).toContain('completed');
    expect(responseData.emailDelivered).toBe(true);
    
    // Verify analysis preview exists
    expect(responseData.analysisPreview).toBeDefined();
    expect(responseData.analysisPreview.diagnosis).toBeDefined();
    
    console.log('✅ Valid diagnostic submission successful');
  });

  test('Quote Verification - Valid Request', async () => {
    console.log('💰 Testing quote verification...');
    
    const verificationData = {
      equipmentType: 'Tractor',
      year: '2018',
      make: 'John Deere',
      model: '6130R',
      errorCodes: 'SPN 94 FMI 1',
      problemDescription: 'Fuel pressure issues, engine stalling intermittently',
      shopQuote: '$8,500 for complete fuel system replacement. Parts: $5,300, Labor: $3,200',
      fullName: 'Quote Test User',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'verification'
    };

    const response = await apiContext.post('/api/submit-diagnosis', {
      data: verificationData
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    
    expect(responseData.success).toBe(true);
    expect(responseData.emailDelivered).toBe(true);
    
    console.log('✅ Quote verification successful');
  });

  test('Emergency Triage - Valid Request', async () => {
    console.log('🚨 Testing emergency triage...');
    
    const emergencyData = {
      equipmentType: 'Crane',
      make: 'Liebherr',
      model: 'LTM 1060',
      errorCodes: 'E001, E045',
      problemDescription: 'URGENT: Hydraulic system failure, boom will not lift, multiple warning lights',
      fullName: 'Emergency Test User',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'emergency'
    };

    const response = await apiContext.post('/api/submit-diagnosis', {
      data: emergencyData
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    
    expect(responseData.success).toBe(true);
    expect(responseData.emailDelivered).toBe(true);
    
    console.log('✅ Emergency triage successful');
  });

  test('Invalid Request - Missing Required Fields', async () => {
    console.log('❌ Testing invalid request handling...');
    
    const invalidData = {
      equipmentType: 'Tractor',
      // Missing required fields: problemDescription, email, fullName
    };

    const response = await apiContext.post('/api/submit-diagnosis', {
      data: invalidData
    });

    expect(response.status()).toBe(400);
    const responseData = await response.json();
    
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('Missing required fields');
    
    console.log('✅ Invalid request properly rejected');
  });

  test('API Response Time Performance', async () => {
    console.log('⚡ Testing API response times...');
    
    const diagnosticData = {
      equipmentType: 'Bulldozer',
      make: 'Caterpillar',
      model: 'D6T',
      problemDescription: 'Performance test - track engine vibration issue',
      fullName: 'Performance Test',
      email: 'jeremylongshore@gmail.com',
      selectedService: 'diagnostic'
    };

    const startTime = Date.now();
    const response = await apiContext.post('/api/submit-diagnosis', {
      data: diagnosticData
    });
    const responseTime = Date.now() - startTime;

    console.log(`📊 API response time: ${responseTime}ms`);
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(120000); // Should complete within 2 minutes
    
    console.log('✅ API performance within acceptable limits');
  });

  test('CORS Headers Validation', async () => {
    console.log('🌐 Testing CORS headers...');
    
    const response = await apiContext.options('/api/submit-diagnosis');
    
    expect(response.status()).toBe(200);
    
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe('*');
    expect(headers['access-control-allow-methods']).toContain('POST');
    expect(headers['access-control-allow-headers']).toContain('Content-Type');
    
    console.log('✅ CORS headers configured correctly');
  });

  test('Concurrent Request Handling', async () => {
    console.log('🔄 Testing concurrent request handling...');
    
    const createRequest = (index) => ({
      equipmentType: 'Tractor',
      make: 'John Deere',
      model: `Test${index}`,
      problemDescription: `Concurrent test ${index} - engine issue`,
      fullName: `Concurrent Test ${index}`,
      email: 'jeremylongshore@gmail.com',
      selectedService: 'diagnostic'
    });

    // Send 3 concurrent requests
    const requests = [1, 2, 3].map(i => 
      apiContext.post('/api/submit-diagnosis', {
        data: createRequest(i)
      })
    );

    const responses = await Promise.all(requests);
    
    // All should succeed
    responses.forEach((response, index) => {
      expect(response.status()).toBe(200);
      console.log(`✅ Concurrent request ${index + 1} successful`);
    });
    
    console.log('✅ Concurrent request handling successful');
  });
});