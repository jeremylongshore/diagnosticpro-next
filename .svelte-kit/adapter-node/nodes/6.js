

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CSt1QOM1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CQ1Qo5sC.js","_app/immutable/chunks/67ZfzKJv.js"];
export const stylesheets = [];
export const fonts = [];
