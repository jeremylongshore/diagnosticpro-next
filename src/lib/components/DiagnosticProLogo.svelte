<script>
  export let size = 40;
  export let showText = true;
</script>

<div class="flex items-center gap-3">
  <!-- Professional Logo SVG -->
  <div class="relative">
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      class="drop-shadow-lg"
    >
      <!-- Background Circle -->
      <circle cx="20" cy="20" r="18" fill="#1e40af" stroke="#3b82f6" stroke-width="2"/>
      
      <!-- Diagnostic Cross -->
      <path d="M20 8 L20 32 M8 20 L32 20" stroke="white" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Center Dot -->
      <circle cx="20" cy="20" r="3" fill="#fbbf24"/>
      
      <!-- Corner Dots -->
      <circle cx="14" cy="14" r="1.5" fill="#60a5fa"/>
      <circle cx="26" cy="14" r="1.5" fill="#60a5fa"/>
      <circle cx="14" cy="26" r="1.5" fill="#60a5fa"/>
      <circle cx="26" cy="26" r="1.5" fill="#60a5fa"/>
    </svg>
    
    <!-- Pulse Animation for Emergency -->
    <div class="absolute inset-0 rounded-full bg-red-500 opacity-0 animate-ping"></div>
  </div>
  
  {#if showText}
    <div class="flex flex-col">
      <span class="text-xl font-bold text-white tracking-tight">DiagnosticPro MVP</span>
      <span class="text-xs text-blue-200 font-medium">Expert Analysis Platform</span>
    </div>
  {/if}
</div>