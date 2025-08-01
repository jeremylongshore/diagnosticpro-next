import { test, expect, request } from '@playwright/test';

/**
 * AI Response Quality and Validation Tests
 * Ensures DiagnosticPro AI delivers high-quality, accurate diagnostic reports
 */

test.describe('AI Response Quality Validation', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:5173',
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  const qualityTestCases = [
    {
      name: 'Complex Hydraulic System Diagnosis',
      data: {
        equipmentType: 'Excavator', 
        make: 'Caterpillar',
        model: '330D',
        year: '2019',
        mileage: '4200 hours',
        errorCodes: 'E039, E041, U0100',
        problemDescription: 'Hydraulic system operating sluggishly, intermittent loss of power to boom and bucket, excessive hydraulic fluid temperature, occasional complete hydraulic failure requiring restart',
        selectedService: 'diagnostic',
        fullName: 'AI Quality Test',
        email: 'jeremylongshore@gmail.com'
      },
      expectedQualityMarkers: [
        'hydraulic',
        'pump',
        'filter',
        'temperature',
        'pressure',
        'verification tests',
        'cost estimate',
        '%' // probability percentage
      ],
      shouldContainSections: [
        'Most Likely Root Cause',
        'Verification Tests',
        'Questions to Ask',
        'Fair Cost Estimate'
      ]
    },
    {
      name: 'Sophisticated Engine Diagnostic',
      data: {
        equipmentType: 'Tractor',
        make: 'John Deere',
        model: '8320R',
        year: '2020',
        mileage: '2800 hours',
        errorCodes: 'SPN 94 FMI 1, SPN 157 FMI 18, SPN 1569 FMI 31',
        problemDescription: 'Engine exhibits rough idle, black smoke under load, reduced power output by approximately 30%, DEF consumption higher than normal, intermittent limp mode activation',
        selectedService: 'diagnostic',
        fullName: 'Engine Test',
        email: 'jeremylongshore@gmail.com'
      },
      expectedQualityMarkers: [
        'fuel',
        'injection',
        'turbo',
        'def',
        'emission',
        'sensor',
        'diagnostic',
        'test'
      ],
      shouldContainSections: [
        'DiagnosticPro Report',
        'Issue',
        'Root Cause',
        'Verification Tests'
      ]
    },
    {
      name: 'Quote Verification - Overpriced Repair',
      data: {
        equipmentType: 'Bulldozer',
        make: 'Caterpillar',
        model: 'D6T',
        year: '2018',
        errorCodes: 'E230, E240',
        problemDescription: 'Transmission slipping in forward gears, harsh shifting, occasional inability to engage drive',
        shopQuote: '$18,500 for complete transmission rebuild including: New torque converter ($3,200), Complete transmission rebuild ($8,900), New transmission cooler ($1,400), 40 hours labor at $125/hr ($5,000)',
        selectedService: 'verification',
        fullName: 'Quote Test',
        email: 'jeremylongshore@gmail.com'
      },
      expectedQualityMarkers: [
        'red flags',
        'unnecessary',
        'overpriced',
        'questions',
        'fair cost',
        'transmission',
        'rebuild'
      ],
      shouldContainSections: [
        'Red Flags',
        'Questions to Ask the Shop',
        'Fair Cost Estimate'
      ]
    }
  ];

  qualityTestCases.forEach(({ name, data, expectedQualityMarkers, shouldContainSections }) => {
    test(`AI Quality: ${name}`, async () => {
      console.log(`🧠 Testing AI quality for: ${name}`);
      
      const startTime = Date.now();
      const response = await apiContext.post('/api/submit-diagnosis', { data });
      const responseTime = Date.now() - startTime;
      
      expect(response.status()).toBe(200);
      const result = await response.json();
      
      expect(result.success).toBe(true);
      expect(result.emailDelivered).toBe(true);
      
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`🤖 AI Model used: ${result.analysisPreview?.aiModel || 'Unknown'}`);
      
      // Verify we got a meaningful response
      expect(result.analysisPreview).toBeDefined();
      expect(result.analysisPreview.diagnosis).toBeDefined();
      expect(result.analysisPreview.diagnosis.length).toBeGreaterThan(20);
      
      // Get the full raw response for quality analysis
      const fullResponse = result.analysisPreview?.rawResponse || result.analysisPreview?.diagnosis;
      expect(fullResponse).toBeDefined();
      
      const responseText = fullResponse.toLowerCase();
      
      // Verify expected quality markers are present
      let foundMarkers = 0;
      expectedQualityMarkers.forEach(marker => {
        if (responseText.includes(marker.toLowerCase())) {
          foundMarkers++;
          console.log(`✅ Found quality marker: "${marker}"`);
        } else {
          console.log(`⚠️ Missing quality marker: "${marker}"`);
        }
      });
      
      // Should find at least 60% of quality markers
      const markerRatio = foundMarkers / expectedQualityMarkers.length;
      expect(markerRatio).toBeGreaterThan(0.6);
      console.log(`📊 Quality marker ratio: ${(markerRatio * 100).toFixed(1)}%`);
      
      // Verify required sections are present
      shouldContainSections.forEach(section => {
        expect(fullResponse).toContain(section);
        console.log(`✅ Found required section: "${section}"`);
      });
      
      // Verify response length indicates thorough analysis
      expect(fullResponse.length).toBeGreaterThan(500);
      console.log(`📝 Response length: ${fullResponse.length} characters`);
      
      console.log(`✅ AI quality validation passed for: ${name}`);
    });
  });

  test('AI Consistency Test', async () => {
    console.log('🔄 Testing AI response consistency...');
    
    const testData = {
      equipmentType: 'Excavator',
      make: 'Caterpillar',
      model: '320D',
      errorCodes: 'P0012, P0016',
      problemDescription: 'Engine timing issues, rough idle, power loss',
      selectedService: 'diagnostic',
      fullName: 'Consistency Test',
      email: 'jeremylongshore@gmail.com'
    };

    // Send same request 3 times
    const responses = await Promise.all([
      apiContext.post('/api/submit-diagnosis', { data: testData }),
      apiContext.post('/api/submit-diagnosis', { data: testData }),
      apiContext.post('/api/submit-diagnosis', { data: testData })
    ]);

    // All should succeed
    responses.forEach((response, index) => {
      expect(response.status()).toBe(200);
      console.log(`✅ Consistency test ${index + 1} successful`);
    });

    const results = await Promise.all(responses.map(r => r.json()));
    
    // Verify all contain similar key elements
    results.forEach((result, index) => {
      expect(result.success).toBe(true);
      expect(result.analysisPreview.diagnosis).toContain('timing');
      console.log(`✅ Response ${index + 1} contains expected content`);
    });
    
    console.log('✅ AI consistency validation passed');
  });

  test('AI Safety and Appropriateness Check', async () => {
    console.log('🛡️ Testing AI safety and appropriateness...');
    
    const testData = {
      equipmentType: 'Tractor',
      make: 'John Deere',
      model: '6130R',
      problemDescription: 'Safety critical: Braking system intermittent failure, steering becomes unresponsive at high speeds',
      selectedService: 'diagnostic',
      fullName: 'Safety Test',
      email: 'jeremylongshore@gmail.com'
    };

    const response = await apiContext.post('/api/submit-diagnosis', { data: testData });
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    const responseText = result.analysisPreview?.rawResponse?.toLowerCase() || 
                        result.analysisPreview?.diagnosis?.toLowerCase();
    
    // Should emphasize safety for critical systems
    expect(responseText).toContain('safety');
    expect(responseText).toContain('immediate');
    
    // Should not contain inappropriate content
    const inappropriateTerms = ['hack', 'bypass', 'disable safety', 'ignore warning'];
    inappropriateTerms.forEach(term => {
      expect(responseText).not.toContain(term);
    });
    
    console.log('✅ AI safety validation passed');
  });

  test('AI Model Performance Comparison', async () => {
    console.log('🥊 Testing AI model performance...');
    
    const testData = {
      equipmentType: 'Crane',
      make: 'Liebherr',
      model: 'LTM 1060-3.1',
      errorCodes: 'E001, E045, E067',
      problemDescription: 'Hydraulic system pressure fluctuations, boom movement jerky, load capacity reduced by 40%, multiple warning lights active',
      selectedService: 'diagnostic',
      fullName: 'Performance Test',
      email: 'jeremylongshore@gmail.com'
    };

    const startTime = Date.now();
    const response = await apiContext.post('/api/submit-diagnosis', { data: testData });
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const result = await response.json();
    
    console.log(`⏱️ Total processing time: ${responseTime}ms`);
    console.log(`🤖 Model used: ${result.analysisPreview?.aiModel || 'Unknown'}`);
    
    // Performance benchmarks
    expect(responseTime).toBeLessThan(120000); // Under 2 minutes
    
    // Quality benchmarks
    const responseText = result.analysisPreview?.rawResponse || result.analysisPreview?.diagnosis;
    expect(responseText.length).toBeGreaterThan(800); // Substantial response
    expect(responseText).toContain('hydraulic');
    expect(responseText).toContain('pressure');
    expect(responseText).toContain('%'); // Should include probability
    
    console.log('✅ AI performance benchmarks passed');
  });

  test('Edge Case Handling', async () => {
    console.log('🎯 Testing AI edge case handling...');
    
    const edgeCases = [
      {
        name: 'Minimal Information',
        data: {
          equipmentType: 'Unknown',
          problemDescription: 'Broken',
          selectedService: 'diagnostic',
          fullName: 'Edge Test 1',
          email: 'jeremylongshore@gmail.com'
        }
      },
      {
        name: 'Very Detailed Information',
        data: {
          equipmentType: 'Excavator',
          make: 'Caterpillar',
          model: '330D L',
          year: '2021',
          serialNumber: 'CAT3306DXXXX123456789',
          mileage: '1,247.3 hours',
          errorCodes: 'E039, E041, E043, P0001, P0002, P0003, U0100, U0101, SPN 94 FMI 1, SPN 157 FMI 18',
          problemDescription: 'Comprehensive issue report: Primary hydraulic pump experiencing pressure fluctuations between 180-220 bar instead of steady 210 bar. Boom lift speed reduced by approximately 35% compared to baseline. Hydraulic oil temperature reading 85°C continuously during operation (normal range 60-75°C). Intermittent complete hydraulic failure requiring engine restart. Occurs most frequently after 2+ hours continuous operation. Recently serviced 50 hours ago with OEM filters and fluids. Operator reports unusual vibration through joystick controls. Problem began gradually over past 2 weeks.',
          selectedService: 'diagnostic',
          fullName: 'Edge Test 2', 
          email: 'jeremylongshore@gmail.com'
        }
      }
    ];

    for (const { name, data } of edgeCases) {
      console.log(`🧪 Testing edge case: ${name}`);
      
      const response = await apiContext.post('/api/submit-diagnosis', { data });
      expect(response.status()).toBe(200);
      
      const result = await response.json();
      expect(result.success).toBe(true);
      
      // Should still provide meaningful response even with edge cases
      const responseText = result.analysisPreview?.rawResponse || result.analysisPreview?.diagnosis;
      expect(responseText.length).toBeGreaterThan(100);
      
      console.log(`✅ Edge case handled: ${name}`);
    }
    
    console.log('✅ Edge case handling validation passed');
  });
});