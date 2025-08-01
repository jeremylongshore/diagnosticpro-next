<script>
  import { onMount } from 'svelte';
  import { Shield, Clock, TrendingUp, Check, Zap, ArrowRight } from 'lucide-svelte';
  
  let mounted = $state(false);
  let selectedService = $state(null);
  let email = $state('');
  let name = $state('');
  
  const services = [
    {
      id: 'diagnosis',
      name: 'Equipment Diagnosis',
      price: 4.99,
      icon: 'diagnosis',
      description: 'AI-powered analysis to identify what\'s wrong. Get expert diagnosis in 30 minutes with repair recommendations.',
      features: [
        'Complete diagnostic analysis',
        'Repair cost estimation', 
        'Part recommendations',
        '30-minute response time'
      ]
    },
    {
      id: 'verification',
      name: 'Quote Verification',
      price: 4.99,
      icon: 'shield',
      description: 'Already have a repair quote? We\'ll verify if it\'s legit and give you questions to ask the shop.',
      features: [
        'Quote accuracy check',
        'Price comparison',
        'Questions to ask mechanic',
        'Red flag identification'
      ]
    },
    {
      id: 'emergency',
      name: 'EMERGENCY - I\'m At The Shop',
      price: 7.99,
      icon: 'emergency',
      description: 'Get expert analysis INSTANTLY. We\'ll tell you exactly what to say RIGHT NOW.',
      features: [
        'Instant response',
        'Live chat support',
        'Negotiation scripts',
        'Priority analysis'
      ]
    }
  ];

  const stats = [
    { icon: TrendingUp, label: 'Average Savings', value: '$2,800' },
    { icon: Clock, label: 'Expert Response', value: '30 min' },
    { icon: Shield, label: 'Satisfied Customers', value: '98%' }
  ];

  const features = [
    { icon: Check, text: 'Stop getting ripped off — know what\'s really wrong.' },
    { icon: Check, text: 'Get specific questions to ask your mechanic.' },
    { icon: Check, text: 'Verify repair quotes before you authorize work.' },
    { icon: Check, text: '100% money-back guarantee if not satisfied.' }
  ];

  function handleServiceSelect(service) {
    selectedService = service;
  }

  function handleGetStarted() {
    if (!selectedService) {
      alert('Please select a service first!');
      return;
    }

    if (!name || !email) {
      alert('Please enter your name and email address.');
      return;
    }

    // Redirect to form page with service and customer info
    const params = new URLSearchParams({
      service: selectedService.id,
      name: name,
      email: email
    });
    
    window.location.href = `/form?${params.toString()}`;
  }
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>DiagnosticPro MVP - Expert Equipment Diagnosis in Minutes</title>
  <meta name="description" content="Get expert diagnosis for any equipment problem. From cell phones to spaceships - we diagnose any equipment. Fast, accurate, affordable." />
</svelte:head>

{#if mounted}
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
    <!-- Hero Section -->
    <div class="text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-white/5"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <!-- Protection Badge -->
        <div class="inline-flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold mb-8 border border-white/20">
          <Shield size={20} />
          Protect Yourself Before Any Repair
        </div>

        <!-- Logo and Title -->
        <div class="mb-4">
          <Shield size={96} class="mx-auto text-white animate-pulse" />
        </div>
        <h1 class="text-5xl md:text-6xl font-black mb-6 leading-tight">
          <span class="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            DiagnosticPro MVP
          </span>
        </h1>

        <!-- Subtitle -->
        <h2 class="text-2xl md:text-3xl font-bold mb-6">
          Get Expert Analysis Before You Get Ripped Off.
        </h2>

        <!-- Description -->
        <p class="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          78% of drivers don't trust mechanics. Get your quote verified by experts in 30 minutes and know exactly what questions to ask.
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
          {#each stats as stat, index}
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <svelte:component this={stat.icon} size={32} class="text-yellow-400 mx-auto mb-2" />
              <div class="text-2xl font-black text-yellow-400">
                {stat.value}
              </div>
              <div class="text-sm text-white/80">
                {stat.label}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Bottom Wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L50 105C100 90 200 60 300 45C400 30 500 30 600 37.5C700 45 800 60 900 67.5C1000 75 1100 75 1150 75L1200 75V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>

    <!-- Service Selection Section -->
    <section class="py-20 px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">
            Choose Your Protection Service
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the service that best fits your current situation
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {#each services as service, index}
            <div 
              class="bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl {selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}"
              on:click={() => handleServiceSelect(service)}
            >
              <div class="text-center mb-6">
                {#if service.icon === 'diagnosis'}
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    🔍
                  </div>
                {:else if service.icon === 'shield'}
                  <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    🛡️
                  </div>
                {:else}
                  <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    ⚡
                  </div>
                {/if}
                
                <h3 class="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div class="text-3xl font-black text-blue-600">${service.price}</div>
              </div>
              
              <p class="text-gray-600 mb-6">{service.description}</p>
              
              <ul class="space-y-2">
                {#each service.features as feature}
                  <li class="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} class="text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>

        <!-- Promotion Banner -->
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 text-center mb-12 shadow-xl">
          <div class="flex items-center justify-center gap-2 text-xl font-bold">
            <Zap size={24} />
            First-Time Customers: 50% OFF - Use Code SAVE50
            <Zap size={24} />
          </div>
        </div>

        <!-- Features List -->
        <div class="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each features as feature, index}
              <div class="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50 border border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svelte:component this={feature.icon} size={20} />
                </div>
                <span class="text-gray-800 font-semibold text-lg">{feature.text}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Quick Contact Form -->
        <div class="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              Ready to Get Protected?
            </h3>
            <p class="text-gray-600">
              Enter your details and we'll get you started immediately
            </p>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  bind:value={name}
                  placeholder="Your full name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  bind:value={email}
                  placeholder="your@email.com"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              on:click={handleGetStarted}
              disabled={!selectedService || !email || !name}
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Continue to Payment
              <ArrowRight size={20} />
            </button>

            <div class="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
              <Shield size={16} />
              Secure payment processing by Stripe
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <div class="flex items-center justify-center gap-2 text-2xl font-bold mb-4">
          <Shield size={32} />
          DiagnosticPro MVP
        </div>
        <p class="text-gray-400 mb-8">
          Professional equipment diagnostic analysis to protect you from unnecessary repairs.<br/>
          <strong>From cell phones to spaceships - we diagnose any equipment!</strong>
        </p>
        <div class="border-t border-gray-700 pt-8">
          <div class="flex flex-wrap justify-center gap-8 mb-4">
            <a href="/privacy" class="text-blue-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" class="text-blue-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:support@diagnosticpro.io" class="text-blue-400 hover:text-white transition-colors">Contact</a>
          </div>
          <div class="text-sm text-gray-500">
            © 2025 DiagnosticPro MVP. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
{/if}