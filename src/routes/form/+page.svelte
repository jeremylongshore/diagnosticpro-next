<script>
  import { onMount } from 'svelte';
  import { ArrowLeft, Shield } from 'lucide-svelte';
  import MVPDiagnosticForm from '$lib/components/MVPDiagnosticForm.svelte';
  
  let mounted = $state(false);
  // Initialize with default service so page renders server-side
  let selectedService = $state({ id: 'diagnosis', name: 'Equipment Diagnosis', price: 4.99 });
  let customerInfo = $state({ name: '', email: '' });

  onMount(() => {
    // Get service and customer info from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    
    if (serviceId && name && email) {
      selectedService = {
        id: serviceId,
        name: serviceId === 'diagnosis' ? 'Equipment Diagnosis' : 
              serviceId === 'verification' ? 'Quote Verification' : 
              'EMERGENCY - I\'m At The Shop',
        price: serviceId === 'emergency' ? 7.99 : 4.99
      };
      customerInfo = { name, email };
    }
    
    mounted = true;
  });
</script>

<svelte:head>
  <title>Diagnostic Form - DiagnosticPro MVP</title>
  <meta name="description" content="Complete your equipment diagnostic form to get expert analysis." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
  <!-- Header -->
  <div class="bg-white/10 backdrop-blur-sm border-b border-white/20 relative z-10">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Services</span>
        </a>
        
        <div class="flex items-center gap-2 text-white">
          <Shield size={24} />
          <span class="font-bold">DiagnosticPro MVP</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Service Info -->
  <div class="bg-white/10 backdrop-blur-sm border-b border-white/20">
    <div class="max-w-4xl mx-auto px-6 py-6 text-center text-white">
      <h1 class="text-2xl font-bold mb-2">Complete Your {selectedService.name}</h1>
      <p class="text-white/80">
        Service Price: <span class="font-bold text-yellow-300">${selectedService.price}</span>
        {#if customerInfo.name && customerInfo.email}
          • Customer: <span class="font-semibold">{customerInfo.name}</span> ({customerInfo.email})
        {/if}
      </p>
    </div>
  </div>

  <!-- Form Content -->
  <div class="py-8">
    <MVPDiagnosticForm />
  </div>
</div>