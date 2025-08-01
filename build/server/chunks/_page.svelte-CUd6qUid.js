import { P as push, $ as head, T as pop } from './index-BIp7ear_.js';
import '@sveltejs/kit/internal';
import './exports-Cv9LZeD1.js';
import './state.svelte-Dmpip5ZC.js';

function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Payment Successful - DiagnosticPro MVP</title>`;
    $$payload2.out.push(`<meta name="description" content="Your payment was successful. Your diagnostic report is being processed."/>`);
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-success-50 to-white"><div class="max-w-4xl mx-auto px-4 py-16">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-20"><div class="w-16 h-16 bg-success-100 rounded-full mx-auto mb-6 flex items-center justify-center"><div class="w-8 h-8 border-4 border-success-600 border-t-transparent rounded-full animate-spin"></div></div> <h1 class="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h1> <p class="text-gray-600">Please wait while we confirm your payment.</p></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CUd6qUid.js.map
