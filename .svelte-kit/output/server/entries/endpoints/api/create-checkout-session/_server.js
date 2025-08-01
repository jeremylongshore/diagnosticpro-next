import { json } from "@sveltejs/kit";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_your_secret_key_here", {
  // @ts-ignore - Using older API version for compatibility
  apiVersion: "2023-10-16"
});
async function POST({ request, url }) {
  try {
    console.log("🛒 Creating Stripe checkout session...");
    const { submissionId, priceId, serviceType, customerInfo, diagnosticData } = await request.json();
    const servicePrices = {
      "diagnosis": { amount: 499, name: "Equipment Diagnosis" },
      // $4.99
      "verification": { amount: 499, name: "Quote Verification" },
      // $4.99
      "emergency": { amount: 799, name: "EMERGENCY Diagnosis" }
      // $7.99
    };
    const selectedService = servicePrices[serviceType] || servicePrices.diagnosis;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `DiagnosticPro ${selectedService.name}`,
              description: `Expert AI diagnosis for ${diagnosticData?.equipmentType || "your equipment"}`,
              images: ["https://diagnosticpro.io/logo.png"]
              // Add your logo URL
            },
            unit_amount: selectedService.amount
          },
          quantity: 1
        }
      ],
      customer_email: customerInfo?.email,
      metadata: {
        submissionId: submissionId || "unknown",
        // Link to saved form data
        serviceType,
        customerName: customerInfo?.name || "Unknown",
        customerEmail: customerInfo?.email || "",
        customerPhone: customerInfo?.phone || "",
        equipmentType: diagnosticData?.equipmentType || "Unknown",
        make: diagnosticData?.make || "",
        model: diagnosticData?.model || "",
        year: diagnosticData?.year || "",
        problemDescription: diagnosticData?.problemDescription || "",
        errorCodes: diagnosticData?.errorCodes || "",
        shopQuote: diagnosticData?.shopQuote || "",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        source: "diagnosticpro-mvp"
      },
      success_url: `${url.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/?payment=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"]
      }
    });
    console.log(`✅ Checkout session created: ${session.id}`);
    return json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error("❌ Failed to create checkout session:", error);
    return json(
      {
        success: false,
        error: "Failed to create checkout session. Please try again.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
export {
  POST
};
