/**
 * API utilities for DiagnosticPro MVP frontend
 * Handles all communication with the MCP Nexus backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nexus-mcp-efa4fua5kq-ul.a.run.app';

/**
 * Make an authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Submit a diagnostic request
 */
export async function submitDiagnosticRequest(formData) {
  return apiRequest('/api/diagnostics/submit', {
    method: 'POST',
    body: JSON.stringify({
      equipment_type: formData.equipmentType,
      equipment_category: formData.equipmentCategory,
      brand: formData.brand,
      model: formData.model,
      problem_description: formData.problem,
      urgency_level: formData.urgency,
      media_uploads: [...formData.images, ...formData.videos],
      customer_info: formData.contactInfo,
      payment_intent_id: formData.paymentIntentId
    })
  });
}

/**
 * Create a Stripe payment intent
 */
export async function createPaymentIntent(amount, plan) {
  return apiRequest('/api/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify({
      amount: amount * 100, // Convert to cents
      plan,
      currency: 'usd'
    })
  });
}

/**
 * Get diagnostic result
 */
export async function getDiagnosticResult(diagnosticId) {
  return apiRequest(`/api/diagnostics/${diagnosticId}`);
}

/**
 * Get equipment categories
 */
export async function getEquipmentCategories() {
  return apiRequest('/api/equipment/categories');
}

/**
 * Upload media file
 */
export async function uploadMedia(file, type) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return apiRequest('/api/media/upload', {
    method: 'POST',
    headers: {}, // Let browser set Content-Type for multipart
    body: formData
  });
}

/**
 * Track form analytics event
 */
export async function trackFormEvent(eventName, eventData) {
  // Fire and forget - don't wait for response
  apiRequest('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify({
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.warn('Analytics tracking failed:', err));
}

/**
 * Field-level abandonment tracking
 */
export function trackFieldAbandonment(fieldName, formStep) {
  trackFormEvent('field_abandoned', {
    field: fieldName,
    step: formStep,
    url: window.location.href,
    userAgent: navigator.userAgent
  });
}

/**
 * Track form interaction
 */
export function trackFormInteraction(formStep) {
  trackFormEvent('form_interaction', {
    step: formStep,
    url: window.location.href
  });
}

/**
 * Track form completion
 */
export function trackFormCompletion(formData) {
  trackFormEvent('form_completed', {
    equipment_type: formData.equipmentType,
    urgency: formData.urgency,
    plan: formData.selectedPlan
  });
}