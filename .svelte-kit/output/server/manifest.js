export const manifest = (() => {
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
		client: {start:"_app/immutable/entry/start.JDVV1bCB.js",app:"_app/immutable/entry/app.BlkLkztI.js",imports:["_app/immutable/entry/start.JDVV1bCB.js","_app/immutable/chunks/CxdnAclN.js","_app/immutable/chunks/zSbeApGB.js","_app/immutable/chunks/67ZfzKJv.js","_app/immutable/chunks/Bgrn9U60.js","_app/immutable/entry/app.BlkLkztI.js","_app/immutable/chunks/67ZfzKJv.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/zSbeApGB.js","_app/immutable/chunks/quhTSc-U.js","_app/immutable/chunks/CGLtcqIz.js","_app/immutable/chunks/BTXKou4E.js","_app/immutable/chunks/Bgrn9U60.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/api/create-checkout-session/_server.js'))
			},
			{
				id: "/api/form",
				pattern: /^\/api\/form\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/form/_server.js'))
			},
			{
				id: "/api/stripe-webhook",
				pattern: /^\/api\/stripe-webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/stripe-webhook/_server.js'))
			},
			{
				id: "/api/submit-diagnosis",
				pattern: /^\/api\/submit-diagnosis\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/submit-diagnosis/_server.js'))
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
