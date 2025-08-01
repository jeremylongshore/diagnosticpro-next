const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.VrxLGiL5.js",app:"_app/immutable/entry/app.ChyAMiJQ.js",imports:["_app/immutable/entry/start.VrxLGiL5.js","_app/immutable/chunks/DCGROdja.js","_app/immutable/chunks/C7Xs150S.js","_app/immutable/chunks/DMGkYN9e.js","_app/immutable/chunks/pnAsnFuK.js","_app/immutable/entry/app.ChyAMiJQ.js","_app/immutable/chunks/DMGkYN9e.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7Xs150S.js","_app/immutable/chunks/hdGH68Ds.js","_app/immutable/chunks/DWQz6Mue.js","_app/immutable/chunks/BfafQ8-E.js","_app/immutable/chunks/pnAsnFuK.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-PS6x70vI.js')),
			__memo(() => import('./chunks/1-CiqGwJQS.js')),
			__memo(() => import('./chunks/2-DfUbIkzV.js')),
			__memo(() => import('./chunks/3-CqgB6yWY.js')),
			__memo(() => import('./chunks/4-C9Vj3Esy.js')),
			__memo(() => import('./chunks/5-CkFTZl8u.js')),
			__memo(() => import('./chunks/6-CeCQhVo-.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/create-checkout-session",
				pattern: /^\/api\/create-checkout-session\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-CStNPDsI.js'))
			},
			{
				id: "/api/create-payment-intent",
				pattern: /^\/api\/create-payment-intent\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-QSJcKU5o.js'))
			},
			{
				id: "/api/stripe-webhook",
				pattern: /^\/api\/stripe-webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-DOYPK26g.js'))
			},
			{
				id: "/api/submit-diagnosis",
				pattern: /^\/api\/submit-diagnosis\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-CMG-lwYg.js'))
			},
			{
				id: "/form",
				pattern: /^\/form\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/payment-success",
				pattern: /^\/payment-success\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
