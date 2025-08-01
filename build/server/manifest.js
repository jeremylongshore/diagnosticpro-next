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
		client: {start:"_app/immutable/entry/start.DLIGqDLi.js",app:"_app/immutable/entry/app.D2xj_UR1.js",imports:["_app/immutable/entry/start.DLIGqDLi.js","_app/immutable/chunks/DFDvtOAm.js","_app/immutable/chunks/zSbeApGB.js","_app/immutable/chunks/67ZfzKJv.js","_app/immutable/chunks/Bgrn9U60.js","_app/immutable/entry/app.D2xj_UR1.js","_app/immutable/chunks/67ZfzKJv.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/zSbeApGB.js","_app/immutable/chunks/quhTSc-U.js","_app/immutable/chunks/CGLtcqIz.js","_app/immutable/chunks/BTXKou4E.js","_app/immutable/chunks/Bgrn9U60.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-2LKNYIip.js')),
			__memo(() => import('./chunks/1-D5xQTPf8.js')),
			__memo(() => import('./chunks/2-BXOy3_Cv.js')),
			__memo(() => import('./chunks/3-BQPwOmYD.js')),
			__memo(() => import('./chunks/4-YJt6h5E3.js')),
			__memo(() => import('./chunks/5-Dl4zj6Cp.js')),
			__memo(() => import('./chunks/6-DVOzu_tg.js'))
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
				endpoint: __memo(() => import('./chunks/_server-Bvev1KZM.js'))
			},
			{
				id: "/api/stripe-webhook",
				pattern: /^\/api\/stripe-webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-DAYRKybG.js'))
			},
			{
				id: "/api/submit-diagnosis",
				pattern: /^\/api\/submit-diagnosis\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-B_BeDFjm.js'))
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
