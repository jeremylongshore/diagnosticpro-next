# DiagnosticPro API Documentation

## Overview

The DiagnosticPro API provides endpoints for equipment diagnostic submissions, payment processing, and webhook handling. All API endpoints use JSON for data exchange and return standardized response formats.

**Base URL:** `https://your-domain.com/api` (Update with actual deployment URL)  
**Content-Type:** `application/json`  
**Authentication:** Not required for public endpoints

## Endpoints

### 1. Submit Diagnostic Request

**Endpoint:** `POST /api/submit-diagnosis`  
**Purpose:** Submit equipment diagnostic information and save to database  
**Authentication:** None required

#### Request Body

```json
{
  "selectedService": "diagnosis|verification|emergency",
  "equipmentType": "string",
  "make": "string", 
  "model": "string",
  "year": "number",
  "problemDescription": "string (minimum 50 characters)",
  "errorCodes": "string (optional)",
  "shopQuote": "string (optional)",
  "fullName": "string",
  "email": "string (valid email format)",
  "phone": "string (optional)"
}
```

#### Required Fields
- `selectedService`: Service type selection
- `problemDescription`: Detailed description of the issue
- `email`: Valid email address for report delivery
- `fullName`: Customer's full name

#### Response Format

**Success (200):**
```json
{
  "success": true,
  "message": "Submission saved. Redirecting to payment...",
  "submissionId": "uuid",
  "requiresPayment": true,
  "paymentRequired": true
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Error (500):**
```json
{
  "success": false,
  "error": "Failed to save submission to database. Please try again.",
  "details": "Error message"
}
```

### 2. Create Checkout Session

**Endpoint:** `POST /api/create-checkout-session`  
**Purpose:** Create Stripe checkout session for payment processing  
**Authentication:** None required

#### Request Body

```json
{
  "submissionId": "uuid",
  "priceId": "string (optional)",
  "serviceType": "diagnosis|verification|emergency",
  "customerInfo": {
    "email": "string",
    "name": "string",
    "phone": "string (optional)"
  },
  "diagnosticData": {
    "equipmentType": "string",
    "make": "string",
    "model": "string", 
    "year": "string",
    "problemDescription": "string",
    "errorCodes": "string (optional)",
    "shopQuote": "string (optional)"
  }
}
```

#### Service Pricing

| Service Type | Price | Description |
|-------------|-------|-------------|
| `diagnosis` | $4.99 | Standard equipment diagnosis |
| `verification` | $4.99 | Quote verification service |
| `emergency` | $7.99 | Priority emergency diagnosis |

#### Response Format

**Success (200):**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Error (500):**
```json
{
  "success": false,
  "error": "Failed to create checkout session. Please try again.",
  "details": "Error message"
}
```

### 3. Stripe Webhook Handler

**Endpoint:** `POST /api/stripe-webhook`  
**Purpose:** Process Stripe webhooks for completed payments  
**Authentication:** Stripe webhook signature verification

#### Webhook Events Handled

- `checkout.session.completed`: Triggers diagnostic analysis and report generation

#### Webhook Payload Processing

When a `checkout.session.completed` event is received:

1. **Extract metadata** from Stripe session
2. **Create diagnostic request** from payment metadata
3. **Perform AI analysis** based on service type:
   - Emergency: `AIAnalysisService.performEmergencyTriage()`
   - Standard: `AIAnalysisService.analyzeDiagnosticRequest()`
4. **Generate PDF report** and send via email
5. **Send payment confirmation** to admin

#### Metadata Structure

```json
{
  "submissionId": "uuid",
  "serviceType": "diagnosis|verification|emergency",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "equipmentType": "string",
  "make": "string",
  "model": "string",
  "year": "string",
  "problemDescription": "string",
  "errorCodes": "string",
  "shopQuote": "string",
  "timestamp": "ISO string",
  "source": "diagnosticpro-mvp"
}
```

## Data Models

### Diagnostic Request

```typescript
interface DiagnosticRequest {
  selectedService: 'diagnosis' | 'verification' | 'emergency';
  equipmentType: string;
  make: string;
  model: string;
  year?: number;
  problemDescription: string; // min 50 characters
  errorCodes?: string;
  shopQuote?: string;
  fullName: string;
  email: string; // valid email format
  phone?: string;
  sessionId?: string;
  amountPaid?: number;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
}
```

### Analysis Result

```typescript
interface AnalysisResult {
  diagnosis: string;
  likelyCauses: string[];
  repairSteps: string[];
  costEstimate: {
    parts: number;
    labor: number;
    total: number;
  };
  urgency: 'low' | 'medium' | 'high' | 'critical';
  shopQuestions: string[];
  technicalEducation: string;
  confidence: number; // 0-100
}
```

### Report Data

```typescript
interface ReportData {
  equipmentType: string;
  make: string;
  model: string;
  problemDescription: string;
  paymentStatus: 'PAID' | 'PENDING';
  paymentAmount: string;
  serviceLevel: 'DIAGNOSIS' | 'VERIFICATION' | 'EMERGENCY';
  diagnosis: string;
  likelyCauses: string[];
  repairSteps: string[];
  costEstimate: object;
  urgency: string;
  shopQuestions: string[];
  technicalEducation: string;
  confidence: number;
}
```

## Response Formats

### Standard Success Response

```json
{
  "success": true,
  "message": "Description of successful operation",
  "data": {
    // Response data object
  }
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error information (optional)"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid authentication |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error - Server-side error |

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing:

- **Public endpoints:** 100 requests per hour per IP
- **Payment endpoints:** 10 requests per minute per IP
- **Webhook endpoints:** No limit (Stripe managed)

## CORS Configuration

**Allowed Origins:** `*` (configure for production)  
**Allowed Methods:** `POST, OPTIONS`  
**Allowed Headers:** `Content-Type`

## Security Considerations

### Payment Security
- All payment processing handled by Stripe
- No credit card information stored on servers
- PCI DSS compliance through Stripe integration

### Data Protection
- All API communications over HTTPS
- Input validation on all endpoints
- Webhook signature verification for Stripe events
- No sensitive data in URL parameters

### Webhook Security
```javascript
// Webhook signature verification
const sig = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
```

## Integration Examples

### JavaScript (Frontend)

```javascript
// Submit diagnostic request
const response = await fetch('/api/submit-diagnosis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    selectedService: 'diagnosis',
    equipmentType: 'Excavator',
    make: 'Caterpillar',
    model: '320',
    year: 2018,
    problemDescription: 'Engine running rough with black smoke',
    errorCodes: 'P0171, P0174',
    fullName: 'John Smith',
    email: 'john.smith@email.com'
  })
});

const result = await response.json();
if (result.success) {
  // Redirect to payment
  window.location.href = `/payment?submissionId=${result.submissionId}`;
}
```

### Node.js (Backend Integration)

```javascript
// Create checkout session
const checkoutResponse = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    submissionId: 'uuid-here',
    serviceType: 'emergency',
    customerInfo: {
      email: 'customer@email.com',
      name: 'Jane Doe'
    },
    diagnosticData: {
      equipmentType: 'Bulldozer',
      make: 'John Deere',
      model: '850K',
      problemDescription: 'Hydraulic system failure'
    }
  })
});

const checkout = await checkoutResponse.json();
// Redirect user to checkout.url
```

## Environment Variables

```bash
# Required for API functionality
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VERTEX_AI_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GMAIL_APP_PASSWORD=your-app-password
DATABASE_CONNECTION_STRING=your-db-connection
```

## Testing

### Test Stripe Keys
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Test Webhooks
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:5173/api/stripe-webhook
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Data**
   - Missing required fields
   - Invalid email format
   - Problem description too short

2. **Payment Failures**
   - Stripe API errors
   - Invalid payment methods
   - Webhook processing failures

3. **Service Errors**
   - AI analysis failures
   - Email delivery issues
   - Database connection problems

### Error Logging

All errors are logged with:
- Timestamp
- Error type and message
- Request context
- User information (if available)

## Monitoring & Analytics

### Recommended Tracking

- **Submission Success Rate:** Track form submission completion
- **Payment Conversion:** Monitor checkout to payment completion
- **Report Delivery:** Track successful email delivery
- **Error Rates:** Monitor API error frequencies
- **Response Times:** Track API performance metrics

---

*Last updated: August 2, 2025*  
*For technical support: support@diagnosticpro.io*