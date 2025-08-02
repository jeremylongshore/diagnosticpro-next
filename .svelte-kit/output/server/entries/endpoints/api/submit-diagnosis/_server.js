import { json } from "@sveltejs/kit";
import "@google-cloud/vertexai";
import "@google/generative-ai";
import "nodemailer";
import "puppeteer";
import { d as databaseService } from "../../../../chunks/database.js";
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
    console.log("💾 Saving submission to database...");
    let savedSubmission;
    try {
      savedSubmission = await databaseService.saveSubmission(formData);
      console.log(`✅ Submission saved to database with ID: ${savedSubmission.id}`);
    } catch (dbError) {
      console.error("❌ DATABASE SAVE FAILED:", dbError);
      return json(
        {
          success: false,
          error: "Failed to save submission to database. Please try again.",
          details: dbError.message
        },
        { status: 500 }
      );
    }
    console.log("💳 Payment required - preparing checkout session...");
    return json({
      success: true,
      message: "Submission saved. Redirecting to payment...",
      submissionId: savedSubmission.id,
      requiresPayment: true,
      paymentRequired: true
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
export {
  OPTIONS,
  POST
};
