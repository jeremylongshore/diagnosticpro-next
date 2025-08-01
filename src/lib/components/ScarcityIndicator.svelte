<script>
  import { onMount } from 'svelte';
  import { Users, Clock } from 'lucide-svelte';
  
  let expertsAvailable = $state(3);
  let timeRemaining = $state(15);
  let currentUsers = $state(47);
  
  onMount(() => {
    // Simulate dynamic scarcity
    const interval = setInterval(() => {
      expertsAvailable = Math.max(1, expertsAvailable + (Math.random() > 0.7 ? -1 : 0));
      currentUsers = Math.min(60, currentUsers + (Math.random() > 0.5 ? 1 : -1));
      timeRemaining = Math.max(5, timeRemaining + (Math.random() > 0.8 ? -1 : 0));
    }, 3000);
    
    return () => clearInterval(interval);
  });
</script>

<div class="bg-urgency-50 border-t-4 border-urgency-500 py-4 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
      <!-- Expert Availability -->
      <div class="flex items-center gap-2 scarcity-indicator urgency-pulse">
        <Users size={18} class="text-urgency-600" />
        <span class="font-semibold text-urgency-800">
          Only {expertsAvailable} experts available now
        </span>
      </div>
      
      <!-- Current Activity -->
      <div class="flex items-center gap-2 text-gray-700">
        <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
        <span class="text-sm">
          {currentUsers} people getting diagnosed right now
        </span>
      </div>
      
      <!-- Time Urgency -->
      <div class="flex items-center gap-2 text-urgency-700">
        <Clock size={18} />
        <span class="text-sm font-medium">
          Next available slot in {timeRemaining} minutes
        </span>
      </div>
    </div>
  </div>
</div>