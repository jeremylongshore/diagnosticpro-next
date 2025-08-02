# Production Cleanup Plan

## Resources Found:

### COMPUTE INSTANCES (1)
- diagnosticpro-beast-upgraded (us-central1-a, RUNNING, c4d-highcpu-8) - **KEEP for now**

### CLOUD RUN SERVICES (5)
- **KEEP**: diagnosticpro-mvp (us-central1) - Main production service
- **DELETE**: bobs-ai-house (us-central1) - Failed/unused service
- **DELETE**: diagnosticpro-frontend (us-central1) - Duplicate/unused
- **DELETE**: diagnosticpro-frontend (us-east5) - Duplicate/unused  
- **DELETE**: diagnosticpro-mvp (us-east5) - Duplicate/old region

### STORAGE BUCKETS (8)
- **KEEP**: diagnostic-pro-mvp_cloudbuild - Build artifacts
- **KEEP**: run-sources-diagnostic-pro-mvp-us-central1 - Cloud Run sources
- **DELETE**: run-sources-diagnostic-pro-mvp-us-east5 - Old region sources
- **EVALUATE**: diagnostic-pro-mvp-backups - Check contents
- **EVALUATE**: diagnostic-pro-mvp-disaster-recovery - Check contents  
- **DELETE**: diagnosticpro-disaster-recovery - Duplicate
- **DELETE**: diagnosticpro-docs-backup - Redundant
- **DELETE**: cloud-ai-platform-* - Auto-generated, likely unused

### SECRETS (9)
- **KEEP**: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY - Production payment
- **KEEP**: DB_PASSWORD - Database access
- **DELETE**: stripe-secret-key (duplicate)
- **DELETE**: openai-api-key (unused - using Vertex AI)
- **EVALUATE**: Others based on usage

## Cleanup Actions:
1. Delete unused Cloud Run services
2. Delete duplicate/unused storage buckets  
3. Delete duplicate/unused secrets
4. Verify production service is unaffected