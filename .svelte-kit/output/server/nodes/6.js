

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DkXfmXUr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Cylgqqy6.js","_app/immutable/chunks/DMGkYN9e.js"];
export const stylesheets = [];
export const fonts = [];
