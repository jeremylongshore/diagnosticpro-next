<script>
  import '../app.css';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
  <main>
    <slot />
  </main>
  <Footer />
</div>