<script>
  import { onMount } from 'svelte';
  import { CheckCircle, Mail, Phone, Linkedin, Twitter, ExternalLink } from 'lucide-svelte';
  import { page } from '$app/stores';
  
  let sessionId = '';
  let loading = true;
  let paymentDetails = null;
  
  onMount(async () => {
    // Get session ID from URL parameters
    sessionId = $page.url.searchParams.get('session_id');
    
    if (sessionId) {
      // In production, you'd fetch session details from your backend
      // For now, simulate payment completion
      setTimeout(() => {
        paymentDetails = {
          amount: '$49.99',
          service: 'Priority Diagnosis',
          email: 'customer@example.com'
        };
        loading = false;
      }, 1000);
    } else {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Payment Successful - DiagnosticPro MVP</title>
  <meta name="description" content="Your payment was successful. Your diagnostic report is being processed." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-success-50 to-white">
  <div class="max-w-4xl mx-auto px-4 py-16">
    {#if loading}
      <!-- Loading State -->
      <div class="text-center py-20">
        <div class="w-16 h-16 bg-success-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <div class="w-8 h-8 border-4 border-success-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h1>
        <p class="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    
    {:else if sessionId && paymentDetails}
      <!-- Success State -->
      <div class="text-center mb-12">
        <div class="w-20 h-20 bg-success-100 rounded-full mx-auto mb-8 flex items-center justify-center">
          <CheckCircle size={40} class="text-success-600" />
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Thank you for choosing DiagnosticPro! Your expert diagnostic analysis is now being processed by our AI system.
        </p>
      </div>

      <!-- Payment Details -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Order Confirmation</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Service Details</h3>
            <div class="space-y-2 text-gray-600">
              <p><strong>Service:</strong> {paymentDetails.service}</p>
              <p><strong>Amount:</strong> {paymentDetails.amount}</p>
              <p><strong>Status:</strong> <span class="text-success-600 font-semibold">PAID ✓</span></p>
              <p><strong>Order ID:</strong> {sessionId.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">What Happens Next?</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <CheckCircle size={20} class="text-success-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900">AI Analysis Started</p>
                  <p class="text-sm text-gray-600">Our expert AI is analyzing your equipment right now</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <CheckCircle size={20} class="text-success-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900">Report Generation</p>
                  <p class="text-sm text-gray-600">Comprehensive diagnostic report being compiled</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 border-2 border-success-500 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0"></div>
                <div>
                  <p class="font-medium text-gray-900">Email Delivery</p>
                  <p class="text-sm text-gray-600">Report will be sent to your email within 30 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-gradient-to-r from-trust-50 to-success-50 rounded-2xl p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help or Have Questions?</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Contact Details -->
          <div class="space-y-4">
            <h3 class="font-semibold text-gray-900 mb-4">Get in Touch</h3>
            
            <div class="space-y-3">
              <a href="mailto:jeremy@intentsoultions.io" class="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <Mail size={20} class="text-trust-600" />
                <div>
                  <p class="font-medium text-gray-900">Email Support</p>
                  <p class="text-sm text-gray-600">jeremy@intentsoultions.io</p>
                </div>
              </a>
              
              <a href="tel:+1234567890" class="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <Phone size={20} class="text-trust-600" />
                <div>
                  <p class="font-medium text-gray-900">Phone Support</p>
                  <p class="text-sm text-gray-600">Available during business hours</p>
                </div>
              </a>
            </div>
          </div>
          
          <!-- Social Links -->
          <div class="space-y-4">
            <h3 class="font-semibold text-gray-900 mb-4">Connect with Jeremy</h3>
            
            <div class="space-y-3">
              <a href="https://www.linkedin.com/in/jeremylongshore" target="_blank" class="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <Linkedin size={20} class="text-blue-600" />
                <div class="flex-1">
                  <p class="font-medium text-gray-900">LinkedIn Profile</p>
                  <p class="text-sm text-gray-600">Professional networking</p>
                </div>
                <ExternalLink size={16} class="text-gray-400" />
              </a>
              
              <a href="https://x.com/AsphaltCowb0y" target="_blank" class="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <Twitter size={20} class="text-blue-400" />
                <div class="flex-1">
                  <p class="font-medium text-gray-900">Twitter/X</p>
                  <p class="text-sm text-gray-600">@AsphaltCowb0y</p>
                </div>
                <ExternalLink size={16} class="text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Services -->
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Need Another Diagnosis?</h2>
        <p class="text-gray-600 mb-6">
          Got another piece of equipment giving you trouble? We're here to help!
        </p>
        
        <a href="/" class="inline-flex items-center gap-2 bg-trust-600 hover:bg-trust-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
          Get Another Diagnosis
          <ExternalLink size={20} />
        </a>
      </div>

    {:else}
      <!-- Error State -->
      <div class="text-center py-20">
        <div class="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <ExternalLink size={32} class="text-red-600" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Session Not Found</h1>
        <p class="text-gray-600 mb-6">We couldn't find your payment session. Please contact support.</p>
        
        <a href="/" class="inline-flex items-center gap-2 bg-trust-600 hover:bg-trust-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          Return Home
        </a>
      </div>
    {/if}
  </div>
</div>