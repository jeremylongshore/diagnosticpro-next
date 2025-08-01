import { a6 as head, T as pop, P as push } from "../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Diagnostic Form - DiagnosticPro MVP</title>`;
    $$payload2.out.push(`<meta name="description" content="Complete your equipment diagnostic form to get expert analysis."/>`);
  });
  {
    $$payload.out.push("<!--[!-->");
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
export {
  _page as default
};
