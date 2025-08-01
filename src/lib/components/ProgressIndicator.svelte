<script>
  export let currentStep = 1;
  export let totalSteps = 5;
  
  const steps = [
    { number: 1, title: 'Service', description: 'Choose service type' },
    { number: 2, title: 'Equipment', description: 'Equipment details' },
    { number: 3, title: 'Problem', description: 'Describe issue' },
    { number: 4, title: 'Media', description: 'Upload files/audio' },
    { number: 5, title: 'Contact', description: 'Your information' }
  ];
</script>

<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900">Your Progress</h3>
    <span class="text-sm text-gray-600">{currentStep} of {totalSteps} steps</span>
  </div>
  
  <!-- Progress Bar -->
  <div class="relative mb-6">
    <div class="flex items-center">
      <div class="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style="width: {(currentStep / totalSteps) * 100}%"
        ></div>
      </div>
    </div>
  </div>
  
  <!-- Step Indicators -->
  <div class="grid grid-cols-5 gap-2">
    {#each steps as step}
      <div class="text-center">
        <div class="relative mb-2">
          <div class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 {
            step.number <= currentStep 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-500'
          }">
            {#if step.number < currentStep}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            {:else}
              {step.number}
            {/if}
          </div>
        </div>
        <div class="text-xs">
          <div class="font-medium text-gray-900 {step.number === currentStep ? 'text-blue-600' : ''}">{step.title}</div>
          <div class="text-gray-500 hidden sm:block">{step.description}</div>
        </div>
      </div>
    {/each}
  </div>
</div>