<script>
  import { onMount } from 'svelte';
  import { AlertTriangle, Shield, Search, Zap, Upload, Mic, CreditCard, CheckCircle, Star, Award, Users } from 'lucide-svelte';
  import DiagnosticProLogo from './DiagnosticProLogo.svelte';
  import ProgressIndicator from './ProgressIndicator.svelte';
  
  // Form state
  let selectedService = $state('diagnosis');
  let equipmentType = $state('');
  let year = $state('');
  let make = $state('');
  let model = $state('');
  let vin = $state('');
  let mileage = $state('');
  let errorCodes = $state('');
  let problemDescription = $state('');
  let shopQuote = $state('');
  let fullName = $state('');
  let email = $state('');
  let phone = $state('');
  let isRecording = $state(false);
  let audioBlob = $state(null);
  let uploadedFiles = $state([]);
  let capturedImages = $state([]);
  let isSubmitting = $state(false);
  let currentStep = $state(1);
  let formErrors = $state({});
  let showSuccessAnimation = $state(false);
  let promoCode = $state('');
  let appliedDiscount = $state(0);
  
  const services = [
    {
      id: 'diagnosis',
      icon: '🔍',
      title: 'Equipment Diagnosis',
      price: 4.99,
      originalPrice: null,
      description: 'Advanced AI analysis to identify what\'s wrong. Get instant AI diagnosis within 2 hours with repair recommendations.'
    },
    {
      id: 'verification', 
      icon: '🛡️',
      title: 'Quote Verification',
      price: 4.99,
      originalPrice: null,
      description: 'Already have a repair quote? Our AI will verify if it\'s legit and give you questions to ask the shop.'
    },
    {
      id: 'emergency',
      icon: '⚡',
      title: 'EMERGENCY - I\'m At The Shop',
      price: 7.99,
      originalPrice: 15.99,
      description: 'Get instant AI analysis NOW. Our AI will tell you exactly what to say RIGHT NOW.',
      urgent: true
    }
  ];
  
  // Expanded equipment types categorized
  const equipmentCategories = {
    'Consumer & Household': [
      'Appliances - Kitchen (Refrigerators, Freezers, Dishwashers, Ovens, Microwaves)',
      'Appliances - Laundry (Washers, Dryers, Combo Units)',
      'Home Entertainment (TVs, Sound Systems, Gaming Consoles)',
      'Personal Electronics (Smartphones, Tablets, Laptops)',
      'Home Networking (Routers, Modems, WiFi Equipment)',
      'Power Tools (Drills, Saws, Sanders, Grinders)',
      'Lawn & Garden (Mowers, Trimmers, Blowers, Chainsaws)',
      'Home HVAC (Furnaces, AC Units, Heat Pumps, Thermostats)',
      'Water Equipment (Water Heaters, Softeners, Pumps, Filters)'
    ],
    'Commercial & Office': [
      'Restaurant - Cooking (Ranges, Ovens, Griddles, Fryers)',
      'Restaurant - Refrigeration (Walk-ins, Reach-ins, Ice Machines)',
      'Restaurant - Cleaning (Dishwashers, Disposals)',
      'Office Computing (Desktops, Servers, Network Equipment)',
      'Office Equipment (Printers, Copiers, Scanners, Shredders)',
      'Retail Equipment (POS Systems, Cash Registers, Security Systems)',
      'Commercial HVAC (RTUs, Chillers, Boilers, Air Handlers)',
      'Building Systems (Elevators, Generators, Fire Systems)'
    ],
    'Industrial & Manufacturing': [
      'Pumps & Compressors (Centrifugal, Reciprocating, Screw)',
      'Industrial Motors & Drives (AC/DC Motors, VFDs, Servos)',
      'Material Handling (Conveyors, Hoists, Cranes, Lifts)',
      'Packaging Equipment (Fillers, Sealers, Labelers, Palletizers)',
      'Food Processing (Mixers, Slicers, Ovens, Freezers)',
      'Textile Machinery (Looms, Knitting, Dyeing, Finishing)',
      'Printing Equipment (Offset, Digital, Flexo, Screen)',
      'Metalworking (Lathes, Mills, Grinders, Presses)',
      'Plastic/Rubber (Injection Molding, Extruders, Thermoforming)',
      'Woodworking (Saws, Planers, Sanders, CNC Routers)'
    ],
    'Heavy Machinery & Construction': [
      'Earthmoving (Excavators, Bulldozers, Loaders, Graders)',
      'Lifting Equipment (Cranes, Boom Lifts, Scissor Lifts)',
      'Concrete Equipment (Mixers, Pumps, Pavers, Screeds)',
      'Compaction (Rollers, Plate Compactors, Rammers)',
      'Drilling & Boring (Drill Rigs, Pile Drivers, Augers)',
      'Mining Equipment (Haul Trucks, Drills, Crushers)',
      'Road Construction (Asphalt Pavers, Milling Machines)',
      'Material Processing (Crushers, Screens, Wash Plants)'
    ],
    'Medical & Scientific': [
      'Diagnostic Imaging (X-Ray, CT, MRI, Ultrasound)',
      'Patient Monitoring (ECG, Pulse Ox, Blood Pressure)',
      'Life Support (Ventilators, Anesthesia, Dialysis)',
      'Surgical Equipment (Electrosurgical, Lasers, Tables)',
      'Laboratory - Analysis (Spectroscopy, Chromatography, Mass Spec)',
      'Laboratory - General (Centrifuges, Autoclaves, Incubators)',
      'Dental Equipment (Chairs, X-Ray, Sterilizers, Compressors)',
      'Physical Therapy (Ultrasound, TENS, Traction, Exercise)',
      'Durable Medical (Hospital Beds, Wheelchairs, Lifts, CPAP)'
    ],
    'Agricultural & Forestry': [
      'Tractors (Compact, Utility, Row-Crop, 4WD)',
      'Harvesting (Combines, Forage, Cotton Pickers)',
      'Planting Equipment (Planters, Seeders, Transplanters)',
      'Tillage Equipment (Plows, Discs, Cultivators, Harrows)',
      'Hay & Forage (Mowers, Balers, Rakes, Tedders)',
      'Spraying Equipment (Sprayers, Spreaders, Applicators)',
      'Livestock Equipment (Feeders, Milking, Handling Systems)',
      'Forestry (Feller Bunchers, Skidders, Processors, Chippers)',
      'Irrigation Systems (Pivots, Pumps, Controllers)'
    ],
    'Marine & Aerospace': [
      'Marine Propulsion (Outboards, Inboards, Stern Drives, Jets)',
      'Marine Electronics (GPS, Radar, Sonar, Communications)',
      'Marine Systems (Generators, Water Makers, HVAC, Steering)',
      'Personal Watercraft (Jet Skis, Wave Runners)',
      'Marine Commercial (Winches, Cranes, Processing Equipment)',
      'Aviation Ground Support (GPUs, Air Start, Tugs, De-icers)',
      'Aviation Components (Avionics, Instruments, Actuators)'
    ],
    'Transportation': [
      'Automotive (Cars, Trucks, SUVs, Vans)',
      'Motorcycles & Scooters',
      'ATVs & UTVs (Side-by-Sides)',
      'RVs & Motorhomes',
      'Commercial Trucks (Semi, Box, Dump, Tow)',
      'Buses & Coaches',
      'Emergency Vehicles (Fire, Ambulance, Police)',
      'Fleet Vehicles (Delivery, Service, Utility)'
    ]
  };
  
  function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (uploadedFiles.length + files.length <= 3) {
      uploadedFiles = [...uploadedFiles, ...files];
    }
  }
  
  function removeFile(index) {
    uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
  }
  
  function handleCameraCapture(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        capturedImages = [...capturedImages, {
          file: file,
          dataUrl: e.target.result
        }];
        currentStep = Math.max(currentStep, 5);
      };
      reader.readAsDataURL(file);
    }
  }
  
  function removeCapturedImage(index) {
    capturedImages = capturedImages.filter((_, i) => i !== index);
  }
  
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: 'audio/webm' });
      };
      
      mediaRecorder.start();
      isRecording = true;
      
      // Auto-stop after 2 minutes
      setTimeout(() => {
        if (isRecording) {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          isRecording = false;
        }
      }, 120000);
      
      // Store recorder for manual stop
      window.currentRecorder = { mediaRecorder, stream };
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Please allow microphone access to record your message');
    }
  }
  
  function stopRecording() {
    if (window.currentRecorder) {
      window.currentRecorder.mediaRecorder.stop();
      window.currentRecorder.stream.getTracks().forEach(track => track.stop());
      isRecording = false;
    }
  }
  
  function getSelectedPrice() {
    const basePrice = services.find(s => s.id === selectedService)?.price || 14.99;
    return Math.max(0, basePrice - appliedDiscount);
  }
  
  function applyPromoCode() {
    if (promoCode.toLowerCase() === 'test100') {
      const basePrice = services.find(s => s.id === selectedService)?.price || 14.99;
      appliedDiscount = basePrice; // 100% discount
    } else {
      appliedDiscount = 0;
    }
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    isSubmitting = true;
    
    try {
      const formData = new FormData();
      
      // Add form fields
      formData.append('service', selectedService);
      formData.append('equipmentType', equipmentType);
      formData.append('year', year);
      formData.append('make', make);
      formData.append('model', model);
      formData.append('vin', vin);
      formData.append('mileage', mileage);
      formData.append('errorCodes', errorCodes);
      formData.append('problemDescription', problemDescription);
      formData.append('shopQuote', shopQuote);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('promoCode', promoCode);
      formData.append('finalPrice', getSelectedPrice().toString());
      
      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      // Add captured images
      capturedImages.forEach((image, index) => {
        formData.append(`capturedImage${index}`, image.file);
      });
      
      // Add audio if recorded
      if (audioBlob) {
        formData.append('voiceMessage', audioBlob, 'voice-message.webm');
      }
      
      // Submit to our working diagnostic API
      const diagnosticData = {
        selectedService,
        equipmentType,
        year,
        make,
        model,
        serialNumber: vin,
        mileage,
        errorCodes,
        problemDescription,
        shopQuote,
        fullName,
        email,
        phone,
        promoCode,
        finalPrice: getSelectedPrice()
      };
      
      const response = await fetch('/api/submit-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(diagnosticData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // All services are paid, redirect to Stripe checkout
          const checkoutResponse = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceType: selectedService,
              customerInfo: {
                name: fullName,
                email: email,
                phone: phone
              },
              diagnosticData: {
                equipmentType,
                make,
                model,
                year,
                problemDescription,
                errorCodes,
                shopQuote
              }
            })
          });
          
          const checkoutResult = await checkoutResponse.json();
          
          if (checkoutResult.success) {
            // Redirect to Stripe Checkout
            window.location.href = checkoutResult.url;
          } else {
            throw new Error(checkoutResult.error || 'Failed to create checkout session');
          }
      } else {
        throw new Error(result.error || 'Diagnostic analysis failed');
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="min-h-screen bg-[#F8F9FA]">
  <!-- Modern Hero Section -->
  <section class="bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4 py-16">
      <div class="text-center mb-8">
        <!-- Clean Logo -->
        <div class="flex items-center justify-center mb-8">
          <DiagnosticProLogo size={60} showText={true} />
        </div>
        
        <!-- Main Headline -->
        <h1 class="text-4xl sm:text-5xl font-bold text-[#212529] mb-4 leading-tight">
          AI Equipment Diagnosis
          <span class="text-[#0A4DAA]">in Minutes</span>
        </h1>
        
        <p class="text-xl text-[#6C757D] mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
          Advanced AI-powered Equipment Analysis Platform 
          <span class="text-[#212529] font-bold">98.7% accuracy</span> from just $4.99
        </p>
        
        <!-- Condensed Trust Metrics -->
        <div class="inline-flex items-center justify-center bg-[#F8F9FA] border border-gray-200 rounded-xl px-8 py-4 mb-8">
          <div class="flex items-center gap-8 text-sm font-medium">
            <div class="flex items-center gap-1.5">
              <CheckCircle size={14} class="text-[#16A085]" />
              <span class="text-[#212529]">25,000+ Diagnoses</span>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="flex items-center gap-1.5">
              <CheckCircle size={14} class="text-[#16A085]" />
              <span class="text-[#212529]">98.7% Accuracy</span>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="flex items-center gap-1.5">
              <CheckCircle size={14} class="text-[#16A085]" />
              <span class="text-[#212529]">30-Minute Results</span>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="flex items-center gap-1.5">
              <Shield size={14} class="text-[#0A4DAA]" />
              <span class="text-[#212529]">Money-Back Guarantee</span>
            </div>
          </div>
        </div>
        
        <!-- Subtle Discount -->
        <div class="inline-flex items-center gap-2 bg-[#16A085]/10 text-[#16A085] px-6 py-3 rounded-lg border border-[#16A085]/20">
          <Zap size={16} />
          <span class="font-medium">50% off launch pricing - Starting at $4.99</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Single Page Form -->
  <form onsubmit={handleSubmit} class="py-16 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Progress Indicator -->
      <ProgressIndicator {currentStep} totalSteps={5} />
      <!-- Service Selection -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h3 class="text-2xl font-bold text-center mb-8 text-[#212529]">Step 1: Choose Your Service</h3>
        
        <div class="grid md:grid-cols-3 gap-6">
          {#each services as service}
            <button
              type="button"
              class="relative p-8 rounded-lg border-2 transition-all {selectedService === service.id ? 'border-[#0A4DAA] bg-[#0A4DAA]/5' : 'border-gray-200 hover:border-[#0A4DAA]/30'} {service.urgent ? 'animate-pulse' : ''}"
              onclick={() => {
              selectedService = service.id;
              currentStep = Math.max(currentStep, 2);
            }}
            >
              {#if service.urgent}
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DC3545] text-white text-xs font-bold px-3 py-1 rounded-full">
                  FASTEST
                </span>
              {/if}
              
              <div class="text-4xl mb-3">{service.icon}</div>
              <h4 class="font-bold text-lg mb-2 text-[#212529]">{service.title}</h4>
              <div class="mb-3">
                <span class="text-2xl font-bold text-[#212529]">${service.price}</span>
                {#if service.originalPrice > service.price}
                  <span class="text-sm text-[#6C757D] line-through ml-2">${service.originalPrice}</span>
                {/if}
              </div>
              <p class="text-sm text-[#6C757D]">{service.description}</p>
              
              {#if selectedService === service.id}
                <CheckCircle size={20} class="absolute top-4 right-4 text-[#0A4DAA]" />
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Equipment Information -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-[#212529]">
          <span class="text-2xl">🔧</span> Step 2: Equipment Information
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Equipment Type *
            </label>
            <select 
              bind:value={equipmentType}
              onchange={() => currentStep = Math.max(currentStep, 3)}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            >
              <option value="">Select Equipment Type</option>
              {#each Object.entries(equipmentCategories) as [category, types]}
                <optgroup label={category}>
                  {#each types as type}
                    <option value={type}>{type}</option>
                  {/each}
                </optgroup>
              {/each}
            </select>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <input
                type="text"
                bind:value={year}
                placeholder="2020"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Make/Manufacturer *</label>
              <input
                type="text"
                bind:value={make}
                placeholder="Caterpillar, John Deere, etc."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Model *</label>
              <input
                type="text"
                bind:value={model}
                placeholder="Model number or name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Serial Number / VIN</label>
              <input
                type="text"
                bind:value={vin}
                placeholder="Optional but helpful"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hours / Mileage</label>
            <input
              type="text"
              bind:value={mileage}
              placeholder="1,500 hours or 65,000 miles"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Problem Details -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-[#212529]">
          <span class="text-2xl">📋</span> Step 3: Describe The Problem
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Error Codes / DTC Codes</label>
            <input
              type="text"
              bind:value={errorCodes}
              placeholder="P0171, P0420, E47, etc."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">If you have diagnostic trouble codes, enter them here</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Problem Description *</label>
            <textarea
              bind:value={problemDescription}
              oninput={() => currentStep = Math.max(currentStep, 4)}
              rows="4"
              placeholder="Describe what's wrong: symptoms, when it happens, any recent repairs, etc."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Repair Quote (If You Have One)</label>
            <textarea
              bind:value={shopQuote}
              rows="3"
              placeholder="What repairs were quoted? What's the price? Include all details from the estimate."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- File Upload & Voice Recording -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-[#212529]">
          <span class="text-2xl">📎</span> Step 4: Additional Information
        </h3>
        
        <!-- Voice Recording -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Voice Message - Tell Us What The Mechanic Said
          </label>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-700 mb-3">
              🎤 Record exactly what they told you about the problem and repairs needed
            </p>
            {#if !isRecording && !audioBlob}
              <button
                type="button"
                onclick={startRecording}
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Mic size={20} />
                Start Recording
              </button>
            {:else if isRecording}
              <button
                type="button"
                onclick={stopRecording}
                class="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 animate-pulse"
              >
                <Mic size={20} />
                Stop Recording
              </button>
              <p class="text-xs text-gray-600 mt-2">Recording... (max 2 minutes)</p>
            {:else}
              <div class="flex items-center gap-3">
                <CheckCircle size={20} class="text-green-500" />
                <span class="text-green-700">Voice message recorded</span>
                <button
                  type="button"
                  onclick={() => audioBlob = null}
                  class="text-sm text-red-600 hover:underline"
                >
                  Delete & Re-record
                </button>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Camera Capture -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Visual Documentation</label>
          <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div class="mb-4">
              <svg class="mx-auto w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p class="text-sm font-medium text-gray-700 mb-1">Document the problem visually</p>
              <p class="text-xs text-gray-500 mb-4">Clear photos help our AI provide more accurate diagnosis</p>
            </div>
            
            <!-- Primary Camera Button -->
            <input
              type="file"
              accept="image/*,video/*"
              capture="environment"
              onchange={handleCameraCapture}
              class="hidden"
              id="camera-input"
            />
            <label for="camera-input" class="cursor-pointer bg-[#16A085] hover:bg-[#16A085]/90 text-white font-semibold px-8 py-4 rounded-lg inline-flex items-center gap-3 transition-all transform hover:scale-105 mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Take Photo or Video
            </label>
            
            <!-- Secondary Upload Option -->
            <div class="mt-2">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onchange={handleFileUpload}
                class="hidden"
                id="file-upload-input"
              />
              <label for="file-upload-input" class="cursor-pointer text-sm text-[#0A4DAA] hover:text-[#0A4DAA]/80 underline">
                Upload from photo library
              </label>
            </div>
            
            {#if capturedImages.length > 0}
              <div class="mt-4 grid grid-cols-2 gap-2">
                {#each capturedImages as image, i}
                  <div class="relative">
                    <img src={image.dataUrl} alt="Captured" class="w-full h-24 object-cover rounded border" />
                    <button
                      type="button"
                      onclick={() => removeCapturedImage(i)}
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-[#212529]">
          <span class="text-2xl">📧</span> Step 5: Contact Information
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#212529] mb-2">Full Name *</label>
            <input
              type="text"
              bind:value={fullName}
              placeholder="John Smith"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4DAA] focus:border-[#0A4DAA] text-[#212529]"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#212529] mb-2">Email Address *</label>
            <input
              type="email"
              bind:value={email}
              oninput={() => currentStep = Math.max(currentStep, 5)}
              placeholder="john@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4DAA] focus:border-[#0A4DAA] text-[#212529] transition-all duration-200"
              required
            />
            <p class="text-xs text-[#6C757D] mt-1">We'll send your diagnosis report here</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#212529] mb-2">Phone Number *</label>
            <input
              type="tel"
              bind:value={phone}
              placeholder="(555) 123-4567"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4DAA] focus:border-[#0A4DAA] text-[#212529] transition-all duration-200"
              required
            />
            <p class="text-xs text-[#6C757D] mt-1">For order updates and support only</p>
          </div>
        </div>
      </div>

      <!-- Payment Section - IMMEDIATELY after Step 5 -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-[#212529] mb-2">Secure Payment</h3>
          <p class="text-[#6C757D]">Your payment is processed securely by Stripe</p>
        </div>
        
        <!-- Promo Code Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
          <label class="block text-sm font-medium text-[#212529] mb-2">Promo Code</label>
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={promoCode}
              placeholder="Enter promo code"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4DAA] focus:border-[#0A4DAA] text-[#212529]"
            />
            <button
              type="button"
              onclick={applyPromoCode}
              class="px-6 py-3 bg-[#0A4DAA] text-white font-medium rounded-lg hover:bg-[#0A4DAA]/90 transition-colors"
            >
              Apply
            </button>
          </div>
          {#if appliedDiscount > 0}
            <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              ✅ Promo code applied! 100% discount
            </div>
          {/if}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full bg-[#16A085] hover:bg-[#16A085]/90 text-white font-bold text-lg py-4 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {#if isSubmitting}
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Processing...
          {:else}
            <CreditCard size={24} />
            Get AI Diagnosis Now - Only ${getSelectedPrice()}
          {/if}
        </button>
        
        <!-- Clean Trust Badge Row -->
        <div class="flex items-center justify-center gap-6 mb-4">
          <div class="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 40 40" class="text-[#0A4DAA]">
              <rect x="2" y="6" width="36" height="26" rx="4" fill="#635BFF"/>
              <text x="20" y="22" text-anchor="middle" fill="white" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="10" font-weight="600">stripe</text>
            </svg>
            <span class="font-semibold text-[#212529]">Stripe</span>
          </div>
          <div class="w-px h-6 bg-gray-300"></div>
          <div class="flex items-center gap-2">
            <Shield size={20} class="text-[#16A085]" />
            <span class="text-sm font-medium text-[#212529]">256-bit SSL</span>
          </div>
          <div class="w-px h-6 bg-gray-300"></div>
          <div class="flex items-center gap-2">
            <CheckCircle size={20} class="text-[#0A4DAA]" />
            <span class="text-sm font-medium text-[#212529]">PCI Compliant</span>
          </div>
          <div class="w-px h-6 bg-gray-300"></div>
          <div class="flex items-center gap-2">
            <CheckCircle size={20} class="text-[#16A085]" />
            <span class="text-sm font-medium text-[#212529]">Money Back</span>
          </div>
        </div>
        
        <p class="text-center text-xs text-[#6C757D]">
          By submitting, you agree to our <a href="/terms" class="text-[#0A4DAA] hover:underline">Terms of Service</a> and <a href="/privacy" class="text-[#0A4DAA] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  </form>
</div>