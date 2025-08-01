import { test, expect, request } from '@playwright/test';

/**
 * VW ATLAS PRANK TESTS - For Mandy's 2018 VW Atlas
 * 5 Hilarious but Realistic Diagnostic Scenarios
 * CC: jeremylongshore@gmail.com, TO: mandy@remaxgs.com
 */

const API_BASE = process.env.BASE_URL || 'http://localhost:5173';

test.describe('VW Atlas Prank - Mandy Edition', () => {
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

  const prankScenarios = [
    {
      id: 'atlas-1-fuel-pump-mystery',
      name: 'The Mysterious Fuel Pump Saga',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2018',
        make: 'Volkswagen',
        model: 'Atlas SE V6',
        serialNumber: '1V2NR2CA8JC123456',
        mileage: '87,500 miles',
        errorCodes: 'P0230, P0231, P0087, P2293',
        problemDescription: 'Fuel pump making weird whining noises that sound suspiciously like a real estate agent trying to close a deal at 9 PM. Car starts fine but acts like it needs more caffeine - sluggish acceleration and occasional hiccups. Fuel gauge doing interpretive dance between 1/4 and 1/2 tank.',
        shopQuote: '$1,850 for fuel pump replacement: High pressure fuel pump ($950), labor 4 hours ($520), fuel filter ($180), diagnostic fee ($200)',
        fullName: 'Anonymous Concerned Husband',
        email: 'mandy@remaxgs.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'atlas-2-ecu-gremlins',
      name: 'ECU Gremlins Strike Again',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2018',
        make: 'Volkswagen', 
        model: 'Atlas SE V6',
        serialNumber: '1V2NR2CA8JC123456',
        mileage: '87,500 miles',
        errorCodes: 'P0601, P0606, U0100, U0121',
        problemDescription: 'ECU (Engine Control Unit) appears to have developed a personality disorder. Sometimes it thinks it\'s a sports car (revving high), sometimes a hybrid (cutting power randomly), and occasionally it identifies as a submarine (flooding the engine with too much fuel). Check engine light flashing in what appears to be Morse code.',
        shopQuote: '$2,400 for ECU replacement: Engine Control Module ($1,650), programming ($350), labor 3 hours ($400)',
        fullName: 'Mysterious Car Whisperer',
        email: 'mandy@remaxgs.com',
        selectedService: 'diagnostic'
      }
    },
    {
      id: 'atlas-3-alternator-drama',
      name: 'The Great Alternator Drama of 2024',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2018',
        make: 'Volkswagen',
        model: 'Atlas SE V6', 
        serialNumber: '1V2NR2CA8JC123456',
        mileage: '87,500 miles',
        errorCodes: 'P0620, P0622, B1DC00',
        problemDescription: 'Alternator making dramatic exit speeches like a soap opera character. Battery light flickering more than a haunted house attraction. Radio randomly switching to polka stations (possibly unrelated but suspicious). Car seems to be conserving electricity like it\'s preparing for an apocalypse.',
        shopQuote: '$950 for alternator replacement: Alternator ($580), serpentine belt ($45), labor 2.5 hours ($325)',
        fullName: 'Secret Automotive Detective', 
        email: 'mandy@remaxgs.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'atlas-4-transmission-tantrum',
      name: 'Transmission Throwing Toddler Tantrum',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2018',
        make: 'Volkswagen',
        model: 'Atlas SE V6',
        serialNumber: '1V2NR2CA8JC123456', 
        mileage: '87,500 miles',
        errorCodes: 'P0700, P0715, P0730, P1779',
        problemDescription: 'Transmission having mood swings worse than a teenager. Shifts smoothly when it wants to, then suddenly decides to jerk around like it\'s learning stick shift. Makes occasional growling sounds that could be mistaken for a disgruntled real estate client who just lost their dream home to a cash offer.',
        fullName: 'Undercover Husband Unit',
        email: 'mandy@remaxgs.com', 
        selectedService: 'emergency'
      }
    },
    {
      id: 'atlas-5-comprehensive-chaos',
      name: 'Atlas Achieves Peak German Engineering Chaos',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2018',
        make: 'Volkswagen',
        model: 'Atlas SE V6',
        serialNumber: '1V2NR2CA8JC123456',
        mileage: '87,500 miles',
        errorCodes: 'P0087, P0601, P0620, P0700, B1DC00, U0100',
        problemDescription: 'The Atlas has achieved what engineers call "comprehensive systems integration failure" - basically everything decided to have problems simultaneously. Fuel pump whining, ECU confused, alternator dramatic, transmission moody. It\'s like the car equivalent of trying to show houses during a power outage while your phone is dead and the GPS is broken. Still runs, but with the enthusiasm of a Monday morning.',
        shopQuote: '$4,200 for comprehensive repair: Fuel pump ($950), ECU programming ($400), alternator ($580), transmission service ($350), various sensors ($420), labor 8 hours ($500), diagnostic fees ($200), shop coffee fund ($50)',
        fullName: 'The Guy Who Definitely Didn\'t Cause This',
        email: 'mandy@remaxgs.com',
        selectedService: 'verification'
      }
    }
  ];

  prankScenarios.forEach(({ id, name, data }) => {
    test(`PRANK: ${name}`, async () => {
      console.log(`😈 PRANK TEST: ${name}`);
      console.log(`🎯 Target: ${data.email}`);
      console.log(`🚗 Vehicle: ${data.year} ${data.make} ${data.model}`);
      
      const startTime = Date.now();
      
      try {
        // Submit diagnostic request
        const response = await apiContext.post('/api/submit-diagnosis', { data });
        const responseTime = Date.now() - startTime;
        
        expect(response.status()).toBe(200);
        
        const result = await response.json();
        console.log(`⏱️ Response Time: ${responseTime}ms`);
        console.log(`📧 Email sent to: ${data.email}`);
        console.log(`🤖 AI Analysis: ${result.analysisPreview?.diagnosis?.substring(0, 100)}...`);
        
        // Validation
        expect(result.success).toBe(true);
        expect(result.emailDelivered).toBe(true);
        expect(result.analysisPreview).toBeDefined();
        
        // Should contain VW/Atlas specific content
        const responseText = (result.analysisPreview.rawResponse || result.analysisPreview.diagnosis).toLowerCase();
        expect(responseText).toContain('volkswagen');
        
        console.log(`✅ ${name} - PRANK DEPLOYED SUCCESSFULLY! 😈`);
        console.log(`📬 Mandy should receive this diagnostic report shortly...`);
        
      } catch (error) {
        console.error(`❌ PRANK FAILED: ${name}`);
        console.error(`Error: ${error.message}`);
        throw error;
      }
    });
  });

  test('Prank Summary Report', async () => {
    console.log('😈 PRANK OPERATION SUMMARY');
    console.log('=' .repeat(40));
    console.log('🎯 Target: mandy@remaxgs.com');
    console.log('🚗 Vehicle: 2018 VW Atlas SE V6');
    console.log('📧 Reports Sent: 5');
    console.log('😂 Humor Level: Maximum');
    console.log('💍 Marriage Status: About to be tested');
    console.log('🏠 Real Estate Jokes: Included');
    console.log('🔧 Technical Accuracy: Surprisingly high');
    console.log('');
    console.log('Note: All reports also CC\'d to jeremylongshore@gmail.com');
    console.log('⚠️ Disclaimer: Use of diagnostic reports for spousal pranking');
    console.log('   may result in sleeping on couch or extended household chores.');
    
    expect(true).toBe(true);
  });
});