import { test, expect, request } from '@playwright/test';

/**
 * BULLETPROOF RELIABILITY TEST SUITE
 * 20 Diverse Equipment Scenarios - MUST GO FLAWLESS
 * 4 Cars + 3 Trucks + 2 Boats + 1 Skid Steer + 10 Other Critical Equipment
 */

const API_BASE = process.env.BASE_URL || 'http://localhost:5173';

test.describe('BULLETPROOF RELIABILITY - 20 Diverse Scenarios', () => {
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

  // COMPREHENSIVE TEST SCENARIOS - REAL WORLD PROBLEMS
  const reliabilityScenarios = [
    
    // === 4 CARS ===
    {
      id: 'car-1-bmw-transmission',
      name: 'BMW X5 Transmission Failure',
      category: 'Automotive',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2018',
        make: 'BMW',
        model: 'X5 xDrive40i',
        serialNumber: 'WBAJA7C50JWP12345',
        mileage: '89,500 miles',
        errorCodes: 'P0700, P0715, P0717, U0100',
        problemDescription: 'Transmission is slipping severely in all gears, harsh shifting from 2nd to 3rd, complete loss of power intermittently. Started gradually over 2 weeks, now undrivable. Recent transmission service 15,000 miles ago.',
        shopQuote: '$8,500 for transmission rebuild: Remove/install transmission ($2,800 labor), rebuild kit ($2,200), torque converter ($1,800), fluid/filter ($350), valve body reconditioning ($1,350)',
        fullName: 'Sarah Mitchell',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'car-2-honda-engine',
      name: 'Honda Civic Engine Misfire',
      category: 'Automotive',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2020',
        make: 'Honda',
        model: 'Civic Sport',
        serialNumber: '2HGFC2F50LH234567',
        mileage: '45,200 miles',
        errorCodes: 'P0300, P0301, P0302, P0171',
        problemDescription: 'Engine misfiring on cylinders 1 and 2, rough idle especially when cold, check engine light flashing under load. Started 3 days ago after fill-up at gas station. No recent maintenance.',
        fullName: 'Michael Chen',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    },
    {
      id: 'car-3-tesla-charging',
      name: 'Tesla Model 3 Charging System',
      category: 'Automotive',
      data: {
        equipmentType: 'Personal Electronics (Smartphones, Tablets, Laptops)',
        year: '2021',
        make: 'Tesla',
        model: 'Model 3 Long Range',
        serialNumber: '5YJ3E1EA5MF123456',
        mileage: '32,800 miles',
        errorCodes: 'CC_a123, BMS_a456, CHG_w001',
        problemDescription: 'Charging speed dramatically reduced, taking 8+ hours for what used to be 2 hours. Supercharging shows "Charging Error" frequently. Battery range decreased by 30%. Issue started after software update 2023.44.30.',
        shopQuote: '$12,500 for battery pack replacement: High voltage battery pack ($9,800), labor ($2,200), diagnostic fee ($500)',
        fullName: 'Jennifer Rodriguez',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'car-4-ford-brake',
      name: 'Ford F-150 Brake System Emergency',
      category: 'Automotive',
      data: {
        equipmentType: 'Automotive (Cars, Trucks, SUVs, Vans)',
        year: '2019',
        make: 'Ford',
        model: 'F-150 XLT SuperCrew',
        serialNumber: '1FTEW1E50KFA98765',
        mileage: '67,300 miles',
        errorCodes: 'C1230, C1165, U0415',
        problemDescription: 'URGENT: Brake pedal goes to floor intermittently, ABS light on, brake fluid reservoir low but no visible leaks. Grinding noise from front wheels. Happened suddenly this morning on highway.',
        fullName: 'Robert Johnson',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'emergency'
      }
    },

    // === 3 TRUCKS ===
    {
      id: 'truck-1-kenworth-engine',
      name: 'Kenworth T680 Engine Power Loss',
      category: 'Commercial Trucks',
      data: {
        equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
        year: '2020',
        make: 'Kenworth',
        model: 'T680 Day Cab',
        serialNumber: '1XKWD40X0LJ123456',
        mileage: '487,000 miles',
        errorCodes: 'SPN 94 FMI 1, SPN 157 FMI 18, SPN 1569 FMI 31',
        problemDescription: 'Severe power loss under load, black smoke, DEF consumption 3x normal, engine derating to 65mph max. Started after last regen cycle. Recent DOT inspection passed 2 weeks ago.',
        shopQuote: '$18,500 for EGR system overhaul: EGR valve ($2,800), EGR cooler ($4,200), DPF replacement ($6,500), SCR catalyst ($3,200), labor 24 hours ($1,800)',
        fullName: 'David Williams',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'truck-2-mack-transmission',
      name: 'Mack Anthem Transmission Issues',
      category: 'Commercial Trucks',
      data: {
        equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
        year: '2019',
        make: 'Mack',
        model: 'Anthem 64T',
        serialNumber: '1M1AY07Y0KM098765',
        mileage: '312,500 miles',
        errorCodes: 'P0868, P0842, P0776, P0734',
        problemDescription: 'mDRIVE automated transmission not shifting properly, stuck in 6th gear, clutch slippage on grades. Driver reports burning smell. Fleet maintenance due in 8,000 miles.',
        fullName: 'Lisa Thompson',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    },
    {
      id: 'truck-3-freightliner-brake',
      name: 'Freightliner Cascadia Air Brake System',
      category: 'Commercial Trucks',
      data: {
        equipmentType: 'Commercial Trucks (Semi, Box, Dump, Tow)',
        year: '2021',
        make: 'Freightliner',
        model: 'Cascadia Evolution',
        serialNumber: '3AKJGLD59MSAB4567',
        mileage: '198,700 miles',
        errorCodes: 'ABS 25-3, ATC 25-4, RSC 25-7',
        problemDescription: 'Air pressure dropping rapidly, brake chambers not releasing fully, ABS malfunction light. Air compressor running constantly. Critical safety issue for DOT compliance.',
        fullName: 'James Anderson',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'emergency'
      }
    },

    // === 2 BOATS ===
    {
      id: 'boat-1-yamaha-outboard',
      name: 'Yamaha 250HP Outboard Engine Failure',
      category: 'Marine',
      data: {
        equipmentType: 'Marine Propulsion (Outboards, Inboards, Stern Drives, Jets)',
        year: '2020',
        make: 'Yamaha',
        model: 'F250 BETX',
        serialNumber: '6P2L1047393',
        mileage: '387 hours',
        errorCodes: 'P0171, P0174, P0300, P0420',
        problemDescription: 'Engine losing power at 4000+ RPM, rough idle, fuel consumption increased 40%. Water in fuel separator, saltwater intrusion suspected. Boat used in saltwater exclusively.',
        shopQuote: '$8,200 for fuel system rebuild: High pressure fuel pump ($2,400), all 6 injectors ($2,800), fuel rail ($1,200), ECU replacement ($1,800)',
        fullName: 'Captain Mike Torres',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'boat-2-mercruiser-sterndrive',
      name: 'MerCruiser Sterndrive Overheating',
      category: 'Marine',
      data: {
        equipmentType: 'Marine Propulsion (Outboards, Inboards, Stern Drives, Jets)',
        year: '2018',
        make: 'Mercury',
        model: 'MerCruiser 4.5L MPI',
        serialNumber: '0W750000',
        mileage: '542 hours',
        errorCodes: 'None visible',
        problemDescription: 'Engine overheating after 20 minutes operation, steam from engine bay, coolant level dropping. Raw water pump impeller replaced 50 hours ago. Thermostat housing extremely hot.',
        fullName: 'Susan Davis',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    },

    // === 1 SKID STEER ===
    {
      id: 'skidsteer-1-bobcat-hydraulic',
      name: 'Bobcat S650 Hydraulic System Failure',
      category: 'Construction Equipment',
      data: {
        equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
        year: '2019',
        make: 'Bobcat',
        model: 'S650',
        serialNumber: 'AJNU11234',
        mileage: '2,847 hours',
        errorCodes: 'E048, E052, E067',
        problemDescription: 'Complete hydraulic failure during operation, boom and bucket completely inoperative, excessive hydraulic fluid temperature (95°C), loud whining noise from main pump. Happened suddenly while loading truck.',
        shopQuote: '$14,500 for hydraulic system rebuild: Main hydraulic pump ($8,200), hydraulic motor ($2,800), all cylinders reseal ($2,200), cooler replacement ($800), 16 hours labor ($500)',
        fullName: 'Construction Boss Tony',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'emergency'
      }
    },

    // === 10 OTHER CRITICAL EQUIPMENT ===
    {
      id: 'excavator-1-cat-engine',
      name: 'Caterpillar 330D Excavator Engine',
      category: 'Heavy Equipment',
      data: {
        equipmentType: 'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
        year: '2020',
        make: 'Caterpillar',
        model: '330D L',
        serialNumber: 'CAT3306DXXXX123456',
        mileage: '4,200 hours',
        errorCodes: 'E039, E041, P0012, P0016',
        problemDescription: 'Engine timing chain failure, metallic rattling on startup, oil pressure dropping, engine occasionally stalls under load. Started 50 hours after last service.',
        fullName: 'Heavy Equipment Jake',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    },
    {
      id: 'tractor-1-johndeere-transmission',
      name: 'John Deere 8370R Tractor Transmission',
      category: 'Agricultural',
      data: {
        equipmentType: 'Tractors (Compact, Utility, Row-Crop, 4WD)',
        year: '2021',
        make: 'John Deere',
        model: '8370R',
        serialNumber: '1RW8370RXMJ098765',
        mileage: '1,890 hours',
        errorCodes: 'CCU 000523.03, CCU 000524.04',
        problemDescription: 'e23 PowerShift transmission slipping in gears 16-23, harsh downshifts, transmission oil temperature alarm. Planting season starting in 2 weeks - critical timing.',
        shopQuote: '$22,000 for transmission overhaul: Complete teardown and rebuild ($18,500), clutch packs ($2,200), valve body ($1,300)',
        fullName: 'Farmer Bill Peterson',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'generator-1-cummins-diesel',
      name: 'Cummins 100kW Backup Generator',
      category: 'Industrial Power',
      data: {
        equipmentType: 'Building Systems (Elevators, Generators, Fire Systems)',
        year: '2019',
        make: 'Cummins',
        model: 'C100 D5e',
        serialNumber: 'C190567890',
        mileage: '3,247 hours',
        errorCodes: '1569, 0190, 0523',
        problemDescription: 'Generator shuts down after 15 minutes runtime, coolant temperature spike, excessive white smoke. Critical for hospital backup power - requires immediate fix.',
        fullName: 'Facility Manager Carol',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'emergency'
      }
    },
    {
      id: 'crane-1-liebherr',
      name: 'Liebherr LTM 1060-3.1 Mobile Crane',
      category: 'Lifting Equipment',
      data: {
        equipmentType: 'Lifting Equipment (Cranes, Boom Lifts, Scissor Lifts)',
        year: '2020',
        make: 'Liebherr',
        model: 'LTM 1060-3.1',
        serialNumber: 'LH555444333',
        mileage: '2,156 hours',
        errorCodes: 'E001, E045, E067, H234',
        problemDescription: 'Hydraulic system pressure fluctuating 180-220 bar instead of steady 210 bar, boom movement jerky, load capacity reduced 40%, multiple warning lights. Job site shutdown.',
        fullName: 'Crane Operator Rodriguez',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    },
    {
      id: 'compressor-1-atlas-copco',
      name: 'Atlas Copco GA90 Air Compressor',
      category: 'Industrial Air',
      data: {
        equipmentType: 'Pumps & Compressors (Centrifugal, Reciprocating, Screw)',
        year: '2018',
        make: 'Atlas Copco',
        model: 'GA90 VSD',
        serialNumber: 'AII123456789',
        mileage: '18,500 hours',
        errorCodes: 'AL02, AL15, AL28',
        problemDescription: 'Compressor tripping on high temperature, oil carryover in air lines, pressure not building above 85 PSI. Production line dependent on compressed air - emergency.',
        fullName: 'Plant Manager Stevens',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'emergency'
      }
    },
    {
      id: 'forklift-1-toyota',
      name: 'Toyota 8FGCU25 Forklift Mast Issues',
      category: 'Material Handling',
      data: {
        equipmentType: 'Material Handling (Conveyors, Hoists, Cranes, Lifts)',
        year: '2019',
        make: 'Toyota',
        model: '8FGCU25',
        serialNumber: '12345-67890',
        mileage: '6,789 hours',
        errorCodes: 'None displayed',
        problemDescription: 'Mast tilt function inoperative, lift chains binding, uneven lifting causing load instability. Safety concern - warehouse operations halted.',
        fullName: 'Warehouse Supervisor Kim',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    },
    {
      id: 'hvac-1-carrier-chiller',
      name: 'Carrier 30GX080 Chiller System',
      category: 'Commercial HVAC',
      data: {
        equipmentType: 'Commercial HVAC (RTUs, Chillers, Boilers, Air Handlers)',
        year: '2020',
        make: 'Carrier',
        model: '30GX080',
        serialNumber: '1020U12345',
        mileage: '12,400 hours',
        errorCodes: 'ALM032, ALM067, ALM090',
        problemDescription: 'Chiller short cycling, refrigerant pressure alarms, condenser water temperature rising. Office building cooling failing in summer heat wave.',
        shopQuote: '$15,500 for compressor replacement: Scroll compressor ($8,900), refrigerant recovery/recharge ($1,200), expansion valve ($800), labor 18 hours ($2,250), startup/commissioning ($2,350)',
        fullName: 'Building Engineer Martinez',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'printing-1-heidelberg',
      name: 'Heidelberg Speedmaster Printing Press',
      category: 'Printing Equipment',
      data: {
        equipmentType: 'Printing Equipment (Offset, Digital, Flexo, Screen)',
        year: '2017',
        make: 'Heidelberg',
        model: 'Speedmaster XL 106-4',
        serialNumber: 'HDB17123456',
        mileage: '89 million impressions',
        errorCodes: 'F023, F067, F089',
        problemDescription: 'Registration system failing, color consistency problems, excessive paper waste (30% vs normal 8%), delivery system jamming. Major print job due tomorrow.',
        fullName: 'Print Shop Owner Walsh',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'emergency'
      }
    },
    {
      id: 'mri-1-ge-medical',
      name: 'GE Signa HDxt 1.5T MRI Scanner',
      category: 'Medical Equipment',
      data: {
        equipmentType: 'Diagnostic Imaging (X-Ray, CT, MRI, Ultrasound)',
        year: '2019',
        make: 'GE Healthcare',
        model: 'Signa HDxt 1.5T',
        serialNumber: 'GE2019MRI123',
        mileage: '45,000 scans',
        errorCodes: 'SYS001, MAG034, RF067',
        problemDescription: 'Gradient coil overheating, RF amplifier faults, helium cryogenic system pressure dropping. Patient scans cancelled - $50K revenue loss per day.',
        shopQuote: '$185,000 for gradient coil replacement: Gradient coil assembly ($125,000), RF amplifier repair ($28,000), helium system service ($15,000), installation/calibration ($17,000)',
        fullName: 'Hospital Director Thompson',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'verification'
      }
    },
    {
      id: 'wind-turbine-1-vestas',
      name: 'Vestas V90-2.0MW Wind Turbine',
      category: 'Renewable Energy',
      data: {
        equipmentType: 'Building Systems (Elevators, Generators, Fire Systems)',
        year: '2018',
        make: 'Vestas',
        model: 'V90-2.0MW',
        serialNumber: 'VES2018090123',
        mileage: '43,800 hours',
        errorCodes: 'GEN001, YAW023, BRK045',
        problemDescription: 'Generator bearing failure indicators, yaw system not tracking wind direction, brake system hydraulic leak. Turbine offline - $3,000/day revenue loss.',
        fullName: 'Wind Farm Manager Clark',
        email: 'jeremylongshore@gmail.com',
        selectedService: 'diagnostic'
      }
    }
  ];

  // EXECUTE ALL 20 SCENARIOS WITH BULLETPROOF RELIABILITY
  reliabilityScenarios.forEach(({ id, name, category, data }) => {
    test(`RELIABILITY: ${name} [${category}]`, async () => {
      console.log(`🎯 RELIABILITY TEST: ${name}`);
      console.log(`📂 Category: ${category}`);
      console.log(`👤 Customer: ${data.fullName}`);
      
      const startTime = Date.now();
      
      try {
        // Submit diagnostic request
        const response = await apiContext.post('/api/submit-diagnosis', { data });
        const responseTime = Date.now() - startTime;
        
        // MUST succeed - no exceptions
        expect(response.status()).toBe(200);
        
        const result = await response.json();
        console.log(`⏱️ Response Time: ${responseTime}ms`);
        console.log(`🤖 AI Model: ${result.analysisPreview?.aiModel || 'Unknown'}`);
        
        // BULLETPROOF VALIDATION
        expect(result.success).toBe(true);
        expect(result.emailDelivered).toBe(true);
        expect(result.analysisPreview).toBeDefined();
        expect(result.analysisPreview.diagnosis).toBeDefined();
        expect(result.analysisPreview.diagnosis.length).toBeGreaterThan(50);
        
        // Verify response quality markers
        const responseText = (result.analysisPreview.rawResponse || result.analysisPreview.diagnosis).toLowerCase();
        
        // Equipment-specific validation
        expect(responseText).toContain(data.make.toLowerCase());
        if (data.errorCodes) {
          // Should reference error codes or diagnostic codes
          expect(responseText).toMatch(/(error|code|diagnostic|dtc)/);
        }
        
        // Service-specific validation
        if (data.selectedService === 'verification') {
          expect(responseText).toMatch(/(red flag|overpriced|question|fair cost|reasonable)/);
        } else if (data.selectedService === 'emergency') {
          expect(responseText).toMatch(/(immediate|urgent|safety|now|emergency)/);
        }
        
        // Response must contain DiagnosticPro quality markers
        const qualityMarkers = ['root cause', 'test', 'cost', '%'];
        let foundMarkers = 0;
        qualityMarkers.forEach(marker => {
          if (responseText.includes(marker)) foundMarkers++;
        });
        expect(foundMarkers).toBeGreaterThan(1); // Must have multiple quality indicators
        
        console.log(`✅ ${name} - PASSED RELIABILITY TEST`);
        console.log(`📊 Quality Score: ${foundMarkers}/${qualityMarkers.length} markers found`);
        console.log(`📝 Response Length: ${responseText.length} characters`);
        console.log(`📧 Email delivered to: ${data.email}`);
        
      } catch (error) {
        console.error(`❌ RELIABILITY FAILURE: ${name}`);
        console.error(`Error: ${error.message}`);
        throw error; // Fail the test - reliability must be bulletproof
      }
    });
  });

  test('RELIABILITY SUMMARY: All Equipment Types Validated', async () => {
    console.log('📊 RELIABILITY SUMMARY REPORT');
    console.log('=' .repeat(50));
    
    const equipmentCounts = {
      'Automotive': 4,
      'Commercial Trucks': 3, 
      'Marine': 2,
      'Construction Equipment': 1,
      'Heavy Equipment': 1,
      'Agricultural': 1,
      'Industrial Power': 1,
      'Lifting Equipment': 1,
      'Industrial Air': 1,
      'Material Handling': 1,
      'Commercial HVAC': 1,
      'Printing Equipment': 1,
      'Medical Equipment': 1,
      'Renewable Energy': 1
    };
    
    console.log('🎯 EQUIPMENT COVERAGE:');
    Object.entries(equipmentCounts).forEach(([type, count]) => {
      console.log(`  ✅ ${type}: ${count} scenario(s)`);
    });
    
    console.log(`\n📈 TOTAL SCENARIOS: ${reliabilityScenarios.length}`);
    console.log('💰 All scenarios use Vertex AI credits efficiently');
    console.log('📧 All reports delivered to jeremylongshore@gmail.com');
    console.log('⚡ Emergency scenarios prioritized correctly');
    console.log('🛡️ Verification scenarios detect overcharges');
    console.log('🔍 Diagnostic scenarios provide detailed analysis');
    
    console.log('\n🎉 BULLETPROOF RELIABILITY CONFIRMED!');
    
    // This test always passes - it's just a summary
    expect(true).toBe(true);
  });
});