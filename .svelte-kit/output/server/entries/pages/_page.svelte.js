import { a6 as head, T as pop, P as push } from "../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>DiagnosticPro MVP - Expert Equipment Diagnosis in Minutes</title>`;
    $$payload2.out.push(`<meta name="description" content="Get expert diagnosis for any equipment problem. From cell phones to spaceships - we diagnose any equipment. Fast, accurate, affordable."/>`);
  });
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
export {
  _page as default
};
