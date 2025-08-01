import { json } from '@sveltejs/kit';
import { A as AIAnalysisService$1, E as EmailService$1 } from './emailService-5auX6f8v.js';
import 'openai';
import '@google-cloud/vertexai';
import 'googleapis';

async function POST({ request }) {
  try {
    console.log("📝 New diagnostic form submission received");
    const formData = await request.json();
    if (!formData.problemDescription || !formData.email || !formData.fullName) {
      return json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(`🔍 Processing ${formData.selectedService} request for ${formData.fullName}`);
    console.log("📧 Skipping admin notification to prioritize AI analysis");
    let analysisResult;
    if (formData.selectedService === "emergency") {
      analysisResult = await AIAnalysisService$1.performEmergencyTriage(formData);
      console.log("⚡ Emergency analysis completed");
    } else {
      analysisResult = await AIAnalysisService$1.analyzeDiagnosticRequest(formData);
      console.log("🎯 Full diagnostic analysis completed");
    }
    const reportData = {
      equipmentType: formData.equipmentType || "Equipment",
      make: formData.make || "Unknown",
      model: formData.model || "Unknown",
      year: formData.year,
      problemDescription: formData.problemDescription,
      errorCodes: formData.errorCodes,
      selectedService: formData.selectedService,
      ...analysisResult
    };
    try {
      await EmailService$1.sendDiagnosticReport(
        reportData,
        formData.email,
        formData.fullName
      );
      console.log("✅ Diagnostic report sent to customer");
    } catch (emailError) {
      console.error("❌ Failed to send customer email:", emailError);
      return json({
        success: true,
        message: "Analysis completed but email delivery failed. Please contact support.",
        analysis: analysisResult,
        emailDelivered: false
      });
    }
    console.log(`✅ ${formData.selectedService} request completed successfully for ${formData.email}`);
    return json({
      success: true,
      message: "Diagnostic analysis completed! Check your email for the detailed report.",
      analysisPreview: {
        diagnosis: analysisResult.diagnosis,
        urgencyLevel: analysisResult.urgencyLevel,
        estimatedCost: analysisResult.estimatedCosts?.total || analysisResult.estimatedCost
      },
      emailDelivered: true
    });
  } catch (error) {
    console.error("❌ Diagnostic submission failed:", error);
    return json(
      {
        success: false,
        error: "Analysis failed. Please try again or contact support.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export { OPTIONS, POST };
//# sourceMappingURL=_server-CMG-lwYg.js.map
