type DynamicRoutes = {
	
};

type Layouts = {
	"/": undefined;
	"/api": undefined;
	"/api/create-checkout-session": undefined;
	"/api/create-payment-intent": undefined;
	"/api/stripe-webhook": undefined;
	"/api/submit-diagnosis": undefined;
	"/form": undefined;
	"/payment-success": undefined;
	"/privacy": undefined;
	"/terms": undefined
};

export type RouteId = "/" | "/api" | "/api/create-checkout-session" | "/api/create-payment-intent" | "/api/stripe-webhook" | "/api/submit-diagnosis" | "/form" | "/payment-success" | "/privacy" | "/terms";

export type RouteParams<T extends RouteId> = T extends keyof DynamicRoutes ? DynamicRoutes[T] : Record<string, never>;

export type LayoutParams<T extends RouteId> = Layouts[T] | Record<string, never>;

export type Pathname = "/" | "/api" | "/api/create-checkout-session" | "/api/create-payment-intent" | "/api/stripe-webhook" | "/api/submit-diagnosis" | "/form" | "/payment-success" | "/privacy" | "/terms";

export type ResolvedPathname = `${"" | `/${string}`}${Pathname}`;

export type Asset = "/favicon.png";