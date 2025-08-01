/**
 * DiagnosticPro MVP - Form Submission API
 * Handles diagnostic form submissions, AI analysis, and email reports
 */

import { json } from '@sveltejs/kit';
import AIAnalysisService from '$lib/services/aiAnalysisService.js';
import EmailService from '$lib/services/emailService.js';

export async function POST({ request }) {
    try {
        console.log('📝 New diagnostic form submission received');
        
        const formData = await request.json();
        
        // Validate required fields
        if (!formData.problemDescription || !formData.email || !formData.fullName) {
            return json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log(`🔍 Processing ${formData.selectedService} request for ${formData.fullName}`);

        // Skip admin notification for now to avoid blocking AI
        console.log('📧 Skipping admin notification to prioritize AI analysis');

        // Perform AI analysis based on service type
        let analysisResult;
        
        if (formData.selectedService === 'emergency') {
            // Emergency triage - fast response
            analysisResult = await AIAnalysisService.performEmergencyTriage(formData);
            console.log('⚡ Emergency analysis completed');
        } else {
            // Full diagnostic analysis
            analysisResult = await AIAnalysisService.analyzeDiagnosticRequest(formData);
            console.log('🎯 Full diagnostic analysis completed');
        }

        // Prepare report data for email
        const reportData = {
            equipmentType: formData.equipmentType || 'Equipment',
            make: formData.make || 'Unknown',
            model: formData.model || 'Unknown',
            year: formData.year,
            problemDescription: formData.problemDescription,
            errorCodes: formData.errorCodes,
            selectedService: formData.selectedService,
            ...analysisResult
        };

        // Send diagnostic report to customer
        try {
            await EmailService.sendDiagnosticReport(
                reportData,
                formData.email,
                formData.fullName
            );
            console.log('✅ Diagnostic report sent to customer');
        } catch (emailError) {
            console.error('❌ Failed to send customer email:', emailError);
            
            // Return analysis result even if email fails
            return json({
                success: true,
                message: 'Analysis completed but email delivery failed. Please contact support.',
                analysis: analysisResult,
                emailDelivered: false
            });
        }

        // Log successful completion
        console.log(`✅ ${formData.selectedService} request completed successfully for ${formData.email}`);

        return json({
            success: true,
            message: 'Diagnostic analysis completed! Check your email for the detailed report.',
            analysisPreview: {
                diagnosis: analysisResult.diagnosis,
                urgencyLevel: analysisResult.urgencyLevel,
                estimatedCost: analysisResult.estimatedCosts?.total || analysisResult.estimatedCost
            },
            emailDelivered: true
        });

    } catch (error) {
        console.error('❌ Diagnostic submission failed:', error);
        
        return json(
            { 
                success: false, 
                error: 'Analysis failed. Please try again or contact support.',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

// Handle preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}