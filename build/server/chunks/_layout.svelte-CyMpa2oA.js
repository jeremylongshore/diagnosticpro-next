import { V as slot, P as push, W as escape_html, T as pop, X as sanitize_props, Y as spread_props } from './index-BIp7ear_.js';
import { S as Shield, I as Icon } from './shield-CkldXizC.js';

function Mail($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.445.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      { "width": "20", "height": "16", "x": "2", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]
  ];
  Icon($$payload, spread_props([
    { name: "mail" },
    $$sanitized_props,
    {
      /**
       * @component @name Mail
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Im0yMiA3LTguOTcgNS43YTEuOTQgMS45NCAwIDAgMS0yLjA2IDBMMiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mail
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Footer($$payload, $$props) {
  push();
  $$payload.out.push(`<footer class="bg-gray-900 text-white"><div class="max-w-6xl mx-auto px-4 py-8"><div class="text-center"><div class="mb-6"><div class="flex items-center justify-center gap-2 mb-3">`);
  Shield($$payload, { class: "text-[#0A4DAA]", size: 24 });
  $$payload.out.push(`<!----> <h3 class="text-xl font-bold text-white">DiagnosticPro MVP</h3></div> <p class="text-[#6C757D] max-w-2xl mx-auto">AI-powered equipment diagnosis platform serving customers worldwide</p></div> <div class="mb-6"><a href="mailto:support@diagnosticpro.io" class="flex items-center justify-center gap-2 text-[#0A4DAA] hover:text-[#0A4DAA]/80 transition-colors">`);
  Mail($$payload, { size: 16 });
  $$payload.out.push(`<!----> support@diagnosticpro.io</a></div></div> <div class="border-t border-gray-800 mt-6 pt-6"><div class="flex flex-col items-center gap-4"><div class="flex gap-6 text-sm text-[#6C757D]"><a href="/privacy" class="hover:text-[#0A4DAA] transition-colors">Privacy Policy</a> <a href="/terms" class="hover:text-[#0A4DAA] transition-colors">Terms of Service</a></div> <div class="text-sm text-[#6C757D]">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} DiagnosticPro MVP. All rights reserved.</div></div></div></div></footer>`);
  pop();
}
function _layout($$payload, $$props) {
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"><main><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></main> `);
  Footer($$payload);
  $$payload.out.push(`<!----></div>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CyMpa2oA.js.map
