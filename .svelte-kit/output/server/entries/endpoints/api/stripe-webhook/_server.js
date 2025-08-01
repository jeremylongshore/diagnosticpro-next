import { json } from "@sveltejs/kit";
import Stripe from "stripe";
import { A as AIAnalysisService, E as EmailService } from "../../../../chunks/emailService.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_your_secret_key_here", {
  apiVersion: "2023-10-16"
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
async function POST({ request }) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return json({ error: "Webhook signature verification failed" }, { status: 400 });
  }
  console.log(`🎣 Received Stripe webhook: ${event.type}`);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      console.log(`💰 Checkout completed: ${session.id} - $${session.amount_total / 100}`);
      const {
        serviceType,
        customerEmail,
        customerName,
        customerPhone,
        equipmentType,
        make,
        model,
        year,
        problemDescription,
        errorCodes,
        shopQuote,
        timestamp
      } = session.metadata;
      const diagnosticRequest = {
        selectedService: serviceType,
        equipmentType: equipmentType || "Equipment",
        make: make || "Unknown Make",
        model: model || "Unknown Model",
        year: year || null,
        problemDescription: problemDescription || "Customer paid for priority diagnostic service",
        errorCodes: errorCodes || null,
        shopQuote: shopQuote || null,
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone || null,
        sessionId: session.id,
        amountPaid: session.amount_total / 100,
        paymentStatus: "PAID"
      };
      let analysisResult;
      if (serviceType === "emergency") {
        analysisResult = await AIAnalysisService.performEmergencyTriage(diagnosticRequest);
        console.log("⚡ Emergency analysis completed for paid customer");
      } else {
        analysisResult = await AIAnalysisService.analyzeDiagnosticRequest(diagnosticRequest);
        console.log("🎯 Full diagnostic analysis completed for paid customer");
      }
      const reportData = {
        equipmentType: diagnosticRequest.equipmentType,
        make: diagnosticRequest.make,
        model: diagnosticRequest.model,
        problemDescription: diagnosticRequest.problemDescription,
        paymentStatus: "PAID",
        paymentAmount: `$${diagnosticRequest.amountPaid}`,
        serviceLevel: serviceType.toUpperCase(),
        ...analysisResult
      };
      await EmailService.sendDiagnosticReport(
        reportData,
        customerEmail,
        customerName,
        "jeremylongshore@gmail.com"
        // Always CC Jeremy for paid customers
      );
      console.log(`✅ Premium diagnostic report sent to ${customerEmail}`);
      await EmailService.notifyPaymentReceived({
        paymentIntentId: session.id,
        amount: session.amount_total / 100,
        customerEmail,
        customerName,
        serviceType
      });
    } catch (error) {
      console.error("❌ Failed to process paid diagnostic:", error);
    }
  }
  return json({ received: true });
}
export {
  POST
};
