<script>
  import { onMount } from 'svelte';
  import { Star, CheckCircle, Quote } from 'lucide-svelte';
  
  let currentTestimonial = $state(0);
  
  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "iPhone 14 Pro",
      text: "Screen went black, thought it was dead. Expert diagnosed it in 10 minutes - just a loose connection. Saved me $300!",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Industrial Printer",
      text: "Our $50K printer broke during a critical deadline. DiagnosticPro MVP expert guided us through the fix remotely. Amazing!",
      rating: 5,
      image: "👨‍🏭"
    },
    {
      name: "Dr. Lisa Park",
      role: "Medical Equipment",
      text: "X-ray machine malfunction. The expert identified the issue and provided step-by-step repair instructions. Hospital saved!",
      rating: 5,
      image: "👩‍⚕️"
    }
  ];
  
  const successStories = [
    "✅ Tesla Model S charging issue - Fixed in 20 minutes",
    "✅ Commercial HVAC system - Diagnosed remotely, $15K saved",
    "✅ Gaming PC blue screen - Software fix identified instantly",
    "✅ Restaurant equipment failure - Prevented $5K loss",
  ];
  
  onMount(() => {
    const interval = setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }, 4000);
    
    return () => clearInterval(interval);
  });
</script>

<section class="py-16 px-4 bg-white">
  <div class="max-w-6xl mx-auto">
    <!-- Section Header -->
    <div class="text-center mb-8 sm:mb-12 px-4">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Real People, Real Results
      </h2>
      <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
        Join thousands who've solved their equipment problems with our expert network
      </p>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Rotating Testimonials -->
      <div class="relative">
        <div class="bg-gray-50 rounded-2xl p-8 shadow-lg min-h-[280px] flex flex-col justify-between">
          {#each testimonials as testimonial, i}
            <div class="absolute inset-8 {i === currentTestimonial ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 flex flex-col justify-between h-[calc(100%-4rem)]">
              <div>
                <Quote size={24} class="text-trust-400 mb-4" />
                <blockquote class="text-lg text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
              </div>
              
              <div class="flex items-center gap-4 mt-auto">
                <div class="text-3xl flex-shrink-0">{testimonial.image}</div>
                <div class="min-w-0 flex-1">
                  <div class="font-semibold text-gray-900 truncate">{testimonial.name}</div>
                  <div class="text-gray-600 text-sm truncate">{testimonial.role}</div>
                  <div class="flex gap-1 mt-1">
                    {#each Array(testimonial.rating) as _}
                      <Star size={16} class="text-yellow-400 fill-current" />
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Testimonial Indicators -->
        <div class="flex justify-center gap-2 mt-4">
          {#each testimonials as _, i}
            <button 
              class="w-3 h-3 rounded-full {i === currentTestimonial ? 'bg-trust-500' : 'bg-gray-300'} transition-all duration-200"
              onclick={() => currentTestimonial = i}
            ></button>
          {/each}
        </div>
      </div>
      
      <!-- Recent Success Stories -->
      <div class="space-y-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">
          Recent Success Stories
        </h3>
        
        {#each successStories as story, i}
          <div class="flex items-start gap-3 bg-success-50 border-l-4 border-success-400 p-4 rounded-r-lg animate-fade-in" style="animation-delay: {i * 200}ms">
            <CheckCircle size={20} class="text-success-500 mt-0.5 flex-shrink-0" />
            <span class="text-gray-700 leading-relaxed">{story}</span>
          </div>
        {/each}
        
        <!-- Trust Badges -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-trust-600">4.9/5</div>
              <div class="text-sm text-gray-600">Average Rating</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-trust-600">&lt; 30min</div>
              <div class="text-sm text-gray-600">Average Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>