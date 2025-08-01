<script>
  import { Shield, Mail } from 'lucide-svelte';
</script>

<footer class="bg-gray-900 text-white">
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="text-center">
      <!-- Company Info -->
      <div class="mb-6">
        <div class="flex items-center justify-center gap-2 mb-3">
          <Shield class="text-[#0A4DAA]" size={24} />
          <h3 class="text-xl font-bold text-white">DiagnosticPro MVP</h3>
        </div>
        <p class="text-[#6C757D] max-w-2xl mx-auto">
          AI-powered equipment diagnosis platform serving customers worldwide
        </p>
      </div>
      
      <!-- Contact Email -->
      <div class="mb-6">
        <a href="mailto:support@diagnosticpro.io" class="flex items-center justify-center gap-2 text-[#0A4DAA] hover:text-[#0A4DAA]/80 transition-colors">
          <Mail size={16} />
          support@diagnosticpro.io
        </a>
      </div>
    </div>
    
    <!-- Bottom Border -->
    <div class="border-t border-gray-800 mt-6 pt-6">
      <div class="flex flex-col items-center gap-4">
        <!-- Legal Links -->
        <div class="flex gap-6 text-sm text-[#6C757D]">
          <a href="/privacy" class="hover:text-[#0A4DAA] transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" class="hover:text-[#0A4DAA] transition-colors">
            Terms of Service
          </a>
        </div>
        
        <!-- Copyright -->
        <div class="text-sm text-[#6C757D]">
          © {new Date().getFullYear()} DiagnosticPro MVP. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</footer>