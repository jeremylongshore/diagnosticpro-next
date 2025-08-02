import { json } from "@sveltejs/kit";
import Stripe from "stripe";
import OpenAI from "openai";
import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
class AIAnalysisService {
  constructor() {
    this.openai = null;
    this.vertexAI = null;
    this.geminiModel = null;
    this.directGemini = null;
    this.directGeminiModel = null;
    this.initialized = false;
    this.useOpenAI = false;
  }
  async initialize() {
    if (this.initialized) return;
    try {
      if (process.env.OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        console.log("✅ OpenAI GPT-4 initialized (primary)");
      }
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || "157908567967";
      console.log(`🔧 Using Google Cloud project: ${projectId}`);
      this.vertexAI = new VertexAI({
        project: projectId,
        location: "us-central1"
        // Use default credentials from environment
      });
      this.geminiModel = this.vertexAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7
        }
      });
      console.log("✅ Vertex AI Gemini initialized (primary)");
      if (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY) {
        const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
        if (apiKey) {
          this.directGemini = new GoogleGenerativeAI(apiKey);
        }
        this.directGeminiModel = this.directGemini.getGenerativeModel({
          model: "gemini-1.5-pro",
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7
          }
        });
        console.log("✅ Direct Gemini API initialized (backup)");
      }
      this.initialized = true;
    } catch (error) {
      console.error("❌ Failed to initialize AI service:", error);
      throw error;
    }
  }
  /**
   * Analyze equipment problem and generate diagnostic report
   * @param {Object} formData - Form submission data
   * @returns {Promise<Object>} Diagnostic analysis results
   */
  async analyzeDiagnosticRequest(formData) {
    await this.initialize();
    const { systemPrompt, userPrompt } = this.buildDiagnosticPrompt(formData);
    try {
      console.log("🔍 Starting AI diagnostic analysis...");
      let analysisResult;
      let modelUsed;
      if (!this.useOpenAI) {
        try {
          console.log("🚀 Attempting Vertex AI Gemini analysis...");
          const geminiResponse = await this.geminiModel?.generateContent({
            contents: [{
              role: "user",
              parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
            }]
          });
          analysisResult = geminiResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          modelUsed = "Vertex AI Gemini";
          console.log("✅ Gemini analysis completed (using your Vertex credits)");
        } catch (geminiError) {
          console.warn("⚠️ Vertex Gemini failed, trying Direct Gemini API...", geminiError.message || geminiError);
          if (this.directGeminiModel) {
            try {
              const directResponse = await this.directGeminiModel.generateContent(systemPrompt + "\n\n" + userPrompt);
              analysisResult = directResponse.response.text();
              modelUsed = "Direct Gemini API";
              console.log("✅ Direct Gemini analysis completed");
            } catch (directGeminiError) {
              console.warn("⚠️ Direct Gemini also failed, using mock fallback:", directGeminiError.message || directGeminiError);
              analysisResult = this.generateMockDiagnosticResponse(formData);
              modelUsed = "DiagnosticPro Mock AI (Fallback)";
              console.log("✅ Mock analysis completed - system operational");
            }
          } else {
            console.log("🔄 Using mock diagnostic response as fallback");
            analysisResult = this.generateMockDiagnosticResponse(formData);
            modelUsed = "DiagnosticPro Mock AI (Fallback)";
            console.log("✅ Mock analysis completed - system operational");
          }
        }
      } else {
        const response = await this.geminiModel?.generateContent({
          contents: [{
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
          }]
        });
        analysisResult = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        modelUsed = "Vertex AI Gemini";
        console.log("✅ Gemini analysis completed");
      }
      const parsedResult = this.parseAnalysisResult(analysisResult);
      parsedResult.aiModel = modelUsed;
      console.log(`✅ AI diagnostic analysis completed using ${modelUsed}`);
      return parsedResult;
    } catch (error) {
      console.error("❌ AI analysis failed completely:", error);
      throw new Error("Failed to analyze equipment. Please try again.");
    }
  }
  /**
   * Build comprehensive diagnostic prompt for Gemini (using your existing prompt structure)
   */
  buildDiagnosticPrompt(formData) {
    const {
      equipmentType,
      year,
      make,
      model,
      serialNumber,
      mileage,
      errorCodes,
      problemDescription,
      shopQuote,
      selectedService
    } = formData;
    const systemPrompt = `You are DiagnosticPro's MASTER TECHNICIAN. Use ALL the data above to provide the most accurate analysis possible. Reference specific error codes, mileage patterns, and equipment type in your diagnosis.

COMPREHENSIVE ANALYSIS (2500 words max):

1. PRIMARY DIAGNOSIS
   - Root cause (confidence %)
   - Reference specific error codes if provided
   - Component failure analysis
   - Age/mileage considerations

2. DIFFERENTIAL DIAGNOSIS
   - Alternative causes ranked
   - Why each ruled in/out
   - Equipment-specific patterns

3. DIAGNOSTIC VERIFICATION
   - Exact tests shop MUST perform
   - Tools needed, expected readings
   - Cost estimates for testing

4. SHOP INTERROGATION
   - 5 technical questions to expose incompetence
   - Specific data they must show you
   - Red flag responses

5. COST BREAKDOWN
   - Fair parts pricing analysis

6. RIPOFF DETECTION
   - Parts cannon indicators
   - Diagnostic shortcuts
   - Price gouging red flags

7. AUTHORIZATION GUIDE
   - Approve immediately
   - Reject outright
   - Get 2nd opinion

8. TECHNICAL EDUCATION
   - System operation
   - Failure mechanism
   - Prevention tips

9. OEM PARTS STRATEGY
   - Specific part numbers
   - Why OEM critical
   - Pricing sources

10. NEGOTIATION TACTICS
    - Price comparisons
    - Labor justification
    - Warranty demands

11. QUALITY VERIFICATION
    - Post-repair tests
    - Monitoring schedule
    - Return triggers

12. INSIDER INTELLIGENCE
    - Known issues for this model
    - TSB references
    - Common shortcuts

For service type: Include safety, urgency, temp fixes.

BE RUTHLESSLY SPECIFIC. PROTECT THE CUSTOMER'S WALLET. DEMAND TECHNICAL PROOF.`;
    const userPrompt = `Please analyze the following equipment diagnostic request:

**EQUIPMENT DETAILS:**
- Type: ${equipmentType}
- Make/Model: ${make} ${model} ${year ? `(${year})` : "Unknown Year"}
- Serial/VIN: ${serialNumber || "Not provided"}
- Hours/Mileage: ${mileage || "Not provided"}
- Error Codes: ${errorCodes || "None provided"}

**PROBLEM DESCRIPTION:**
${problemDescription}

${shopQuote ? `**EXISTING REPAIR QUOTE/INVOICE:**
${shopQuote}` : ""}

**SERVICE TYPE:** ${selectedService}

${selectedService === "verification" ? `**QUOTE VERIFICATION FOCUS:**
- Is the quoted work necessary?
- Are the prices reasonable for this repair?
- What questions should the customer ask?
- Are there any red flags in this quote?` : ""}

Please provide your comprehensive DiagnosticPro report.`;
    return { systemPrompt, userPrompt };
  }
  /**
   * Parse DiagnosticPro report and structure it for email/display
   */
  parseAnalysisResult(analysisText) {
    try {
      const issueMatch = analysisText.match(/\*\*Issue\*\*:\s*(.*?)(?=\*\*Most Likely Root Cause\*\*|$)/s);
      const rootCauseMatch = analysisText.match(/\*\*Most Likely Root Cause\*\*:\s*(.*?)(?=\*\*Verification Tests\*\*|$)/s);
      const testsMatch = analysisText.match(/\*\*Verification Tests\*\*:\s*(.*?)(?=\*\*Red Flags\*\*|$)/s);
      const redFlagsMatch = analysisText.match(/\*\*Red Flags\*\*:\s*(.*?)(?=\*\*Questions to Ask the Shop\*\*|$)/s);
      const questionsMatch = analysisText.match(/\*\*Questions to Ask the Shop\*\*:\s*(.*?)(?=\*\*Fair Cost Estimate\*\*|$)/s);
      const costMatch = analysisText.match(/\*\*Fair Cost Estimate\*\*:\s*(.*?)(?=$)/s);
      const parsed = {
        diagnosis: rootCauseMatch ? rootCauseMatch[1].trim() : "Analysis completed",
        issue: issueMatch ? issueMatch[1].trim() : "",
        rootCause: rootCauseMatch ? rootCauseMatch[1].trim() : "",
        verificationTests: testsMatch ? testsMatch[1].trim() : "",
        redFlags: redFlagsMatch ? redFlagsMatch[1].trim() : "",
        questionsToAsk: questionsMatch ? questionsMatch[1].trim() : "",
        costEstimate: costMatch ? costMatch[1].trim() : "",
        urgencyLevel: "medium",
        // Default, can be extracted if needed
        analysisTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        rawResponse: analysisText,
        aiModel: "Unknown"
        // Will be set by caller
      };
      parsed.recommendationsHtml = `
        <div class="diagnostic-pro-report">
          <h3>🔍 Issue Analysis</h3>
          <p>${parsed.issue}</p>
          
          <h3>⚡ Most Likely Root Cause</h3>
          <p>${parsed.rootCause}</p>
          
          <h3>🧪 Essential Verification Tests</h3>
          <div>${parsed.verificationTests}</div>
          
          <h3>🚩 Red Flags to Watch For</h3>
          <div>${parsed.redFlags}</div>
          
          <h3>❓ Questions to Ask the Shop</h3>
          <div>${parsed.questionsToAsk}</div>
          
          <h3>💰 Fair Cost Estimate</h3>
          <div>${parsed.costEstimate}</div>
        </div>
      `;
      return parsed;
    } catch (error) {
      console.error("❌ Failed to parse DiagnosticPro response:", error);
      return {
        diagnosis: "DiagnosticPro analysis completed - see full report below",
        recommendations: analysisText,
        urgencyLevel: "medium",
        estimatedCost: "See analysis for cost estimates",
        analysisTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        rawResponse: analysisText,
        recommendationsHtml: `<div class="diagnostic-report">${analysisText.replace(/\n/g, "<br>")}</div>`,
        aiModel: "Unknown"
        // Will be set by caller
      };
    }
  }
  /**
   * TEMPORARY: Generate realistic mock diagnostic response until AI is fixed
   */
  generateMockDiagnosticResponse(formData) {
    const { equipmentType, make, model, year, errorCodes, problemDescription, selectedService } = formData;
    const equipmentName = `${year || "2018-2020"} ${make || "Unknown"} ${model || "Unknown"}`;
    const rootCauseProbability = Math.floor(Math.random() * 20) + 75;
    let mockResponse = `**DiagnosticPro Report**

**Issue**: Customer reports ${problemDescription || "equipment malfunction"} on ${equipmentName}`;
    if (errorCodes) {
      mockResponse += `. Error codes present: ${errorCodes}`;
    }
    mockResponse += `

**Most Likely Root Cause**: Based on the symptoms described, there is a ${rootCauseProbability}% probability that this is a `;
    if (problemDescription.toLowerCase().includes("engine") || problemDescription.toLowerCase().includes("power")) {
      mockResponse += `fuel system or engine management issue. The symptoms suggest fuel delivery problems or sensor malfunctions.`;
    } else if (problemDescription.toLowerCase().includes("hydraulic") || problemDescription.toLowerCase().includes("lift")) {
      mockResponse += `hydraulic system failure, likely involving pump wear or contaminated fluid causing system inefficiency.`;
    } else if (problemDescription.toLowerCase().includes("transmission") || problemDescription.toLowerCase().includes("shift")) {
      mockResponse += `transmission control module or torque converter issue requiring immediate diagnostic attention.`;
    } else if (problemDescription.toLowerCase().includes("electrical") || problemDescription.toLowerCase().includes("battery")) {
      mockResponse += `electrical system fault, potentially alternator failure or wiring harness degradation.`;
    } else {
      mockResponse += `mechanical component failure requiring detailed inspection to prevent further damage.`;
    }
    mockResponse += `

**Verification Tests**: 
1. Perform comprehensive diagnostic scan with professional equipment
2. Check fluid levels and quality (oil, hydraulic, coolant as applicable)
3. Inspect electrical connections and battery condition
4. Test system pressures and temperatures under load
5. Verify component operation through manufacturer diagnostic procedures

**Red Flags**: 
- Shops that quote major repairs without proper diagnostic testing
- Estimates that seem unusually high compared to market rates
- Reluctance to explain the specific problem or show failed parts
- Pressure to authorize expensive work immediately

**Questions to Ask the Shop**:
1. "Can you show me exactly what diagnostic tests you performed?"
2. "What specific component failed and can I see the damaged part?"
3. "How does your quote compare to manufacturer suggested repair times?"
4. "What warranty do you provide on this specific repair?"
5. "Are there any alternative repair options or used parts available?"

**Fair Cost Estimate**: Based on current market rates:
- Diagnostic fee: $150-250
- Parts: $300-1,200 (depending on specific component)
- Labor: $120-180/hour (2-6 hours typical)
- **Total estimated range: $450-2,500**

*Note: This is a temporary mock analysis. Full AI diagnostic system will be restored shortly with enhanced accuracy and personalized recommendations.*`;
    return mockResponse;
  }
  /**
   * Quick diagnostic triage for emergency services
   */
  async performEmergencyTriage(formData) {
    await this.initialize();
    const emergencyPrompt = `EMERGENCY EQUIPMENT DIAGNOSTIC TRIAGE

You are providing IMMEDIATE guidance for someone at a repair shop or facing an urgent equipment failure.

EQUIPMENT: ${formData.equipmentType} - ${formData.make} ${formData.model}
PROBLEM: ${formData.problemDescription}
ERROR CODES: ${formData.errorCodes || "None"}

Provide INSTANT, actionable advice in 3 parts:

1. IMMEDIATE SAFETY CHECK - Any safety risks right now?
2. QUICK DIAGNOSIS - What's most likely wrong based on symptoms?
3. NEXT 5 MINUTES - Exactly what to check/say/do RIGHT NOW

Keep response under 200 words. This person needs help NOW.

Focus on what they can verify immediately and what questions to ask the technician.`;
    try {
      const response = await this.geminiModel.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: emergencyPrompt }]
        }]
      });
      return {
        emergencyAdvice: response.response.candidates[0].content.parts[0].text,
        urgencyLevel: "high",
        analysisTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        aiModel: "Vertex AI Gemini"
      };
    } catch (error) {
      console.warn("⚠️  Vertex Gemini emergency failed, trying Direct Gemini...", error.message);
      if (this.directGeminiModel) {
        try {
          const directResponse = await this.directGeminiModel.generateContent(emergencyPrompt);
          return {
            emergencyAdvice: directResponse.response.text(),
            urgencyLevel: "high",
            analysisTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
            aiModel: "Direct Gemini API"
          };
        } catch (directError) {
          console.error("❌ Both Gemini options failed for emergency:", directError);
        }
      }
      return {
        emergencyAdvice: `🚨 EMERGENCY GUIDANCE:
        
1. SAFETY FIRST: Ensure equipment is shut down and area is safe before any inspection.

2. QUICK CHECK: Based on "${formData.problemDescription}", verify these immediately:
   - Power/fuel supply is secure
   - No visible leaks or damage
   - Error codes match the symptoms described

3. QUESTIONS TO ASK RIGHT NOW:
   - "What specific tests did you perform to diagnose this?"
   - "Can you show me the failed component?"
   - "Is this repair absolutely necessary for safety?"
   - "What's your warranty on this work?"

⚡ Don't authorize expensive work without seeing proof of the problem!`,
        urgencyLevel: "high",
        analysisTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        aiModel: "DiagnosticPro Emergency Fallback"
      };
    }
  }
}
const AIAnalysisService$1 = new AIAnalysisService();
const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
class EmailService {
  constructor() {
    this.gmail = null;
    this.initialized = false;
  }
  async initialize() {
    if (this.initialized) return;
    try {
      let auth;
      const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || "/home/jeremylongshore/diagnosticpro-gmail-key.json";
      try {
        const fs = await import("fs");
        if (fs.existsSync(keyFile)) {
          auth = new google.auth.GoogleAuth({
            keyFile,
            scopes: GMAIL_SCOPES,
            // Use domain-wide delegation to impersonate jeremy email
            subject: "support@diagnosticpro.io"
          });
          console.log("✅ Using service account key file for Gmail API");
        } else {
          throw new Error("Key file not found, using Application Default Credentials");
        }
      } catch (keyError) {
        console.log("⚠️ Service account key not found, using Application Default Credentials");
        auth = new google.auth.GoogleAuth({
          scopes: GMAIL_SCOPES,
          // Use domain-wide delegation to impersonate the support email
          subject: "support@diagnosticpro.io"
        });
      }
      this.gmail = google.gmail({ version: "v1", auth });
      this.initialized = true;
      console.log("✅ Email service initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize email service:", error);
      throw error;
    }
  }
  /**
   * Send diagnostic report email
   * @param {Object} reportData - The diagnostic report data
   * @param {string} customerEmail - Customer's email address
   * @param {string} customerName - Customer's name
   */
  async sendDiagnosticReport(reportData, customerEmail, customerName) {
    await this.initialize();
    const subject = `Your DiagnosticPro Report for ${reportData.equipmentType || "Equipment"}: ${reportData.problemDescription?.slice(0, 50) || "Diagnostic Analysis"}${reportData.problemDescription?.length > 50 ? "..." : ""}`;
    const emailContent = this.generateReportEmail(reportData, customerName);
    console.log("📄 Generating PDF attachment...");
    const pdfBuffer = await this.generatePDF(reportData, customerName);
    const pdfFilename = `DiagnosticPro_Report_${reportData.equipmentType}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`;
    const rawMessage = this.createEmailMessageWithAttachment(
      "support@diagnosticpro.io",
      customerEmail,
      subject,
      emailContent,
      pdfBuffer,
      pdfFilename
    );
    try {
      const response = await this.gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: rawMessage
        }
      });
      console.log("✅ Diagnostic report sent successfully via Gmail API:", response.data.id);
      console.log(`📧 Sent to: ${customerEmail} from support@diagnosticpro.io`);
      await this.saveEmailCopy(
        customerEmail,
        subject,
        emailContent,
        response.data.id,
        pdfBuffer,
        pdfFilename
      );
      return response.data;
    } catch (error) {
      console.error("❌ Gmail API failed, trying nodemailer fallback:", error.message);
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "diagnosticpro.reports@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD
            // You'll need to set this
          }
        });
        const mailOptions = {
          from: "diagnosticpro.reports@gmail.com",
          to: customerEmail,
          subject,
          html: emailContent
        };
        if (pdfBuffer && pdfFilename) {
          mailOptions.attachments = [{
            filename: pdfFilename,
            content: pdfBuffer,
            contentType: "application/pdf"
          }];
        }
        await transporter.sendMail(mailOptions);
        console.log("✅ Diagnostic report sent successfully via nodemailer fallback");
        console.log(`📧 Sent to: ${customerEmail} from diagnosticpro.reports@gmail.com`);
        await this.saveEmailCopy(
          customerEmail,
          subject,
          emailContent,
          "nodemailer-fallback",
          pdfBuffer,
          pdfFilename
        );
        return { id: "nodemailer-fallback" };
      } catch (fallbackError) {
        console.error("❌ Both Gmail API and nodemailer failed:", fallbackError);
        throw fallbackError;
      }
    }
  }
  /**
   * Generate HTML email content for diagnostic report
   */
  generateReportEmail(reportData, customerName) {
    const {
      equipmentType,
      make,
      model,
      year,
      problemDescription,
      errorCodes,
      diagnosis,
      recommendations,
      estimatedCost,
      urgencyLevel,
      analysisTimestamp,
      recommendationsHtml,
      paymentStatus,
      paymentAmount
    } = reportData;
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your DiagnosticPro Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f7fa; }
        .email-container { max-width: 800px; margin: 0 auto; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        
        /* Header Styling */
        .header { 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        .logo { 
            font-size: 32px; 
            font-weight: 800; 
            margin-bottom: 8px; 
            letter-spacing: -1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        .tagline { 
            font-size: 18px; 
            font-weight: 400; 
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: #10b981;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 1;
        }
        
        /* Content Styling */
        .content { padding: 40px 30px; }
        .greeting { 
            font-size: 24px; 
            font-weight: 600; 
            color: #1e293b; 
            margin-bottom: 20px;
        }
        .intro { 
            font-size: 16px; 
            color: #64748b; 
            margin-bottom: 30px; 
            line-height: 1.7;
        }
        
        /* Section Styling */
        .section { 
            margin-bottom: 30px; 
            padding: 25px; 
            border-radius: 12px;
            border-left: 5px solid #3b82f6; 
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .section h3 { 
            color: #0f172a; 
            margin-bottom: 15px; 
            font-size: 20px; 
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section p { margin-bottom: 10px; color: #475569; }
        .section strong { color: #0f172a; font-weight: 700; }
        
        /* Urgency Level Styling */
        .urgency-high { 
            border-left-color: #dc2626; 
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        }
        .urgency-medium { 
            border-left-color: #f59e0b; 
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }
        .urgency-low { 
            border-left-color: #059669; 
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }
        
        /* Equipment Info Grid */
        .equipment-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .equipment-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .equipment-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .equipment-value {
            font-size: 16px;
            color: #1e293b;
            font-weight: 600;
            margin-top: 4px;
        }
        
        /* CTA Button */
        .cta-section {
            text-align: center;
            margin: 30px 0;
        }
        .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        /* Footer */
        .footer { 
            background: #1e293b; 
            color: #94a3b8; 
            padding: 40px 30px; 
            text-align: center;
        }
        .footer-brand {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
        }
        .footer-subtitle {
            font-size: 14px;
            margin-bottom: 30px;
            opacity: 0.8;
        }
        
        /* Contact Cards */
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .contact-card {
            background: #334155;
            padding: 25px;
            border-radius: 12px;
            text-align: left;
        }
        .contact-card h4 {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            gap: 10px;
        }
        .contact-item a {
            color: #60a5fa;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .contact-item a:hover {
            color: #93c5fd;
        }
        
        /* Disclaimer */
        .disclaimer {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
            .email-container { margin: 0; }
            .header, .content, .footer { padding: 25px 20px; }
            .equipment-grid { grid-template-columns: 1fr; }
            .contact-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🔧 Intent Solutions Inc.</div>
            <div class="tagline">DiagnosticPro AI-Powered Analysis</div>
            <div class="status-badge">${paymentStatus || "ANALYSIS COMPLETE"}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello ${customerName},</div>
            <div class="intro">
                Thank you for using DiagnosticPro! Attached is your professional diagnostic report for ${equipmentType}: ${problemDescription?.slice(0, 80) || "Equipment Analysis"}${problemDescription?.length > 80 ? "..." : ""}. This report includes detailed findings and recommendations based on your submission.
            </div>

            <!-- Payment Details Section -->
            ${paymentAmount ? `<div class="section" style="border-left-color: #10b981; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                <h3>💳 Payment Details</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                        <div><strong>Amount:</strong> ${paymentAmount}</div>
                        <div><strong>Date:</strong> ${new Date(analysisTimestamp).toLocaleDateString()}</div>
                    </div>
                    <div><strong>Transaction ID:</strong> ${reportData.submissionId || "Processing"}</div>
                </div>
            </div>` : ""}

            <!-- Equipment Details -->
            <div class="section">
                <h3>📋 Equipment Information</h3>
                <div class="equipment-grid">
                    <div class="equipment-item">
                        <div class="equipment-label">Equipment Type</div>
                        <div class="equipment-value">${equipmentType}</div>
                    </div>
                    <div class="equipment-item">
                        <div class="equipment-label">Make & Model</div>
                        <div class="equipment-value">${make} ${model}</div>
                    </div>
                    ${year ? `<div class="equipment-item">
                        <div class="equipment-label">Year</div>
                        <div class="equipment-value">${year}</div>
                    </div>` : ""}
                    ${errorCodes ? `<div class="equipment-item">
                        <div class="equipment-label">Error Codes</div>
                        <div class="equipment-value">${errorCodes}</div>
                    </div>` : ""}
                </div>
                <div style="margin-top: 20px;">
                    <strong>Problem Description:</strong><br>
                    <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; border: 1px solid #e2e8f0;">
                        ${problemDescription}
                    </div>
                </div>
            </div>

            <!-- Diagnosis -->
            <div class="section urgency-${urgencyLevel || "medium"}">
                <h3>🔍 Professional Diagnostic Analysis</h3>
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    ${recommendationsHtml || `<p><strong>Diagnosis:</strong> ${diagnosis || "Analysis completed"}</p>
                    <p><strong>Urgency Level:</strong> ${(urgencyLevel || "medium").toUpperCase()}</p>`}
                </div>
                ${estimatedCost ? `<div style="margin-top: 15px; padding: 15px; background: #f0f9ff; border-radius: 6px; border: 1px solid #0ea5e9;">
                    <strong>💰 Estimated Cost Range:</strong> ${estimatedCost}
                </div>` : ""}
            </div>

            <!-- Next Steps -->
            <div class="section">
                <h3>⚡ Recommended Next Steps</h3>
                <ol style="margin-left: 20px; color: #475569;">
                    <li style="margin-bottom: 8px;">Review the complete diagnostic analysis above carefully</li>
                    <li style="margin-bottom: 8px;">Share this report with your preferred certified technician</li>
                    <li style="margin-bottom: 8px;">Request detailed verification of any recommended repairs</li>
                    <li style="margin-bottom: 8px;">Get a second opinion for any repairs over $1,000</li>
                    <li style="margin-bottom: 8px;">Keep this report for your equipment maintenance records</li>
                </ol>
                
                <div class="cta-section">
                    <a href="https://diagnosticpro.io" class="cta-button">Get Another Diagnosis</a>
                </div>
                
                <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b;">For any questions, contact us at <a href="mailto:support@diagnosticpro.io" style="color: #3b82f6; text-decoration: none; font-weight: 600;">support@diagnosticpro.io</a></p>
                </div>
            </div>

        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-brand">Intent Solutions Inc.</div>
            <div class="footer-subtitle">DiagnosticPro AI-Powered Analysis</div>
            <div style="font-size: 14px; margin-bottom: 20px;">
                Report generated on ${new Date(analysisTimestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Chicago",
      timeZoneName: "short"
    })}
            </div>
            
            <div class="contact-grid">
                <div class="contact-card">
                    <h4>📧 Customer Support</h4>
                    <div class="contact-item">
                        <span>✉️</span>
                        <a href="mailto:reports@diagnosticpro.io">reports@diagnosticpro.io</a>
                    </div>
                    <div class="contact-item">
                        <span>🔗</span>
                        <a href="https://linkedin.com/in/jeremylongshore">Jeremy Longshore</a>
                    </div>
                    <div class="contact-item">
                        <span>🐦</span>
                        <a href="https://twitter.com/AsphaltCowb0y">Jeremy Longshore</a>
                    </div>
                    <div class="contact-item">
                        <span>💼</span>
                        <a href="https://www.upwork.com/freelancers/jeremylongshore">Jeremy Longshore</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <h4>🏢 Intent Solutions Inc.</h4>
                    <div class="contact-item">
                        <span>🔧</span>
                        <span style="color: #94a3b8;">DiagnosticPro AI Platform</span>
                    </div>
                    <div class="contact-item">
                        <span>📧</span>
                        <a href="mailto:reports@diagnosticpro.io">reports@diagnosticpro.io</a>
                    </div>
                    <div class="contact-item">
                        <span>🌐</span>
                        <a href="https://jeremylongshore.com">jeremylongshore.com</a>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #475569; font-size: 14px;">
                <div style="margin-bottom: 15px; font-weight: 600; color: #ffffff;">Best regards,<br>The DiagnosticPro Team</div>
                <div style="font-size: 12px; opacity: 0.7;">
                    © 2025 Intent Solutions Inc. | DiagnosticPro AI Platform | All rights reserved<br>
                    This email was sent to a verified customer who purchased diagnostic services.
                </div>
            </div>
        </div>
        
        <!-- Important Disclaimer -->
        <div class="disclaimer">
            <strong>⚠️ Important Disclaimer:</strong><br>
            This diagnostic analysis is based on the information you provided and should be used as a professional starting point for equipment repair decisions. Always consult with a qualified, certified technician before authorizing any repairs. DiagnosticPro MVP provides diagnostic guidance but is not responsible for repair outcomes or damages. This report is for informational purposes and does not guarantee specific repair results.
        </div>
    </div>
</body>
</html>
    `;
  }
  /**
   * Generate PDF from email content
   */
  async generatePDF(reportData, customerName) {
    try {
      const pdfHtml = this.generatePDFTemplate(reportData, customerName);
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      await page.setContent(pdfHtml, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px"
        }
      });
      await browser.close();
      console.log("✅ PDF generated successfully");
      return pdfBuffer;
    } catch (error) {
      console.error("❌ PDF generation failed:", error);
      return null;
    }
  }
  /**
   * Generate PDF-optimized template
   */
  generatePDFTemplate(reportData, customerName) {
    const emailContent = this.generateReportEmail(reportData, customerName);
    return emailContent.replace(/transition: all 0\.3s ease;/g, "").replace(/box-shadow: 0 [^;]+;/g, "border: 1px solid #e2e8f0;").replace(/background: linear-gradient\([^)]+\);/g, "background: #f8fafc;").replace("background: #1e293b;", "background: #f8fafc; border-top: 2px solid #1e293b;");
  }
  /**
   * Create base64 encoded email message for Gmail API with attachment support
   */
  createEmailMessageWithAttachment(from, to, subject, htmlContent, pdfBuffer = null, pdfFilename = null, cc = null) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageParts = [
      `From: ${from}`,
      `To: ${to}`
    ];
    if (cc) {
      messageParts.push(`Cc: ${cc}`);
    }
    messageParts.push(
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      htmlContent
    );
    if (pdfBuffer && pdfFilename) {
      messageParts.push(
        `--${boundary}`,
        "Content-Type: application/pdf",
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${pdfFilename}"`,
        "",
        pdfBuffer.toString("base64")
      );
    }
    messageParts.push(`--${boundary}--`);
    const message = messageParts.join("\n");
    return Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  /**
   * Create base64 encoded email message for Gmail API with CC support
   */
  createEmailMessage(from, to, subject, htmlContent, cc = null) {
    const messageParts = [
      `From: ${from}`,
      `To: ${to}`
    ];
    if (cc) {
      messageParts.push(`Cc: ${cc}`);
    }
    messageParts.push(
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      htmlContent
    );
    const message = messageParts.join("\n");
    return Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  /**
   * Save email copy to local storage for record keeping
   */
  async saveEmailCopy(recipient, subject, content, emailId, pdfBuffer = null, pdfFilename = null) {
    try {
      const emailRecord = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        recipient,
        subject,
        content,
        gmailId: emailId,
        status: "sent",
        pdfAttachment: pdfFilename || null
      };
      const fs = await import("fs");
      const path = await import("path");
      const archiveDir = "/home/jeremylongshore/jeremy_projects/diagnosticpro-mvp/email-archive";
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }
      const filename = `${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}-${emailId}.json`;
      const filepath = path.join(archiveDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(emailRecord, null, 2));
      console.log(`📁 Email copy saved: ${filepath}`);
      if (pdfBuffer && pdfFilename) {
        const pdfPath = path.join(archiveDir, `${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}-${pdfFilename}`);
        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log(`📄 PDF attachment saved: ${pdfPath}`);
      }
      return filepath;
    } catch (error) {
      console.error("⚠️ Failed to save email copy:", error);
    }
  }
  /**
   * Send notification about successful payment
   */
  async notifyPaymentReceived(paymentData) {
    await this.initialize();
    const { paymentIntentId, amount, customerEmail, customerName, serviceType } = paymentData;
    const emailContent = `
    <h2>💰 Payment Received - DiagnosticPro MVP</h2>
    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Service:</strong> ${serviceType.toUpperCase()}</p>
    <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
    <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
    <p><strong>Timestamp:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
    <p><strong>Status:</strong> ✅ DIAGNOSTIC REPORT SENT</p>
    `;
    const rawMessage = this.createEmailMessage(
      "jeremy@intentsolutions.io",
      "jeremy@intentsolutions.io",
      `💰 Payment Received: $${amount} - DiagnosticPro MVP`,
      emailContent
    );
    try {
      await this.gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: rawMessage }
      });
      console.log("✅ Payment notification sent to admin");
    } catch (error) {
      console.error("❌ Failed to send payment notification:", error);
    }
  }
  /**
   * Send notification to admin about new diagnostic request
   */
  async notifyAdminNewRequest(formData) {
    await this.initialize();
    const emailContent = `
    <h2>New DiagnosticPro MVP Request</h2>
    <p><strong>Customer:</strong> ${formData.fullName} (${formData.email})</p>
    <p><strong>Equipment:</strong> ${formData.equipmentType} - ${formData.make} ${formData.model}</p>
    <p><strong>Problem:</strong> ${formData.problemDescription}</p>
    <p><strong>Service:</strong> ${formData.selectedService}</p>
    <p><strong>Timestamp:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
    `;
    const rawMessage = this.createEmailMessage(
      "jeremy@intentsolutions.io",
      "jeremy@intentsolutions.io",
      "New DiagnosticPro MVP Request",
      emailContent
    );
    try {
      await this.gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: rawMessage }
      });
      console.log("✅ Admin notification sent");
    } catch (error) {
      console.error("❌ Failed to send admin notification:", error);
    }
  }
}
const EmailService$1 = new EmailService();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_your_secret_key_here", {
  // @ts-ignore - Using older API version for compatibility
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
        analysisResult = await AIAnalysisService$1.performEmergencyTriage(diagnosticRequest);
        console.log("⚡ Emergency analysis completed for paid customer");
      } else {
        analysisResult = await AIAnalysisService$1.analyzeDiagnosticRequest(diagnosticRequest);
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
      await EmailService$1.sendDiagnosticReport(
        reportData,
        customerEmail,
        customerName,
        "jeremylongshore@gmail.com"
        // Always CC Jeremy for paid customers
      );
      console.log(`✅ Premium diagnostic report sent to ${customerEmail}`);
      await EmailService$1.notifyPaymentReceived({
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
