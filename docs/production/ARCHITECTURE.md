# DiagnosticPro MVP - Production Architecture

## Live Production Environment
- **Primary URL**: https://www.diagnosticpro.io
- **Cloud Run Service**: https://diagnosticpro-mvp-970547573997.us-central1.run.app
- **Project ID**: diagnostic-pro-mvp
- **Region**: us-central1

## Active Resources
### Cloud Run Services
- **diagnosticpro-mvp**: Main application service
  - CPU: 1 vCPU
  - Memory: 1 GB
  - Concurrency: 80
  - Min instances: 0
  - Max instances: 10
  - Environment: Production

### Secrets Manager
- **STRIPE_SECRET_KEY**: Payment processing
- **STRIPE_PUBLISHABLE_KEY**: Frontend payment integration
- **DB_PASSWORD**: Database authentication
- **SENDGRID_API_KEY**: Email delivery backup
- **database-url**: Database connection string
- **diagnosticpro-db-url**: Database URL
- **email-service-config**: Email configuration

### Storage Buckets
- **diagnostic-pro-mvp_cloudbuild**: Build artifacts and deployment
- **run-sources-diagnostic-pro-mvp-us-central1**: Cloud Run source storage
- **diagnostic-pro-mvp-backups**: Application backups
- **diagnostic-pro-mvp-disaster-recovery**: Disaster recovery data

### Compute Resources
- **diagnosticpro-beast-upgraded**: High-performance compute instance
  - Type: c4d-highcpu-8
  - Zone: us-central1-a
  - Status: Running

## External Services
- **Stripe**: Payment processing (Live mode ready)
- **Gmail API**: Email delivery service
- **Vertex AI**: Diagnostic analysis engine
- **Domain**: diagnosticpro.io (mapped to Cloud Run)

## Dependencies
- SvelteKit application framework
- Node.js runtime
- PostgreSQL database (external/managed)
- Gmail service account for email delivery

## Security Configuration
- All secrets managed via Google Secret Manager
- IAM policies follow principle of least privilege
- HTTPS enforced for all traffic
- Environment variables secured
- Service account authentication

## Monitoring & Logging
- Cloud Run metrics in GCP Console
- Application logs via Cloud Logging
- Error tracking through application logs
- Performance monitoring active

## Backup Strategy
- Automated backups to gs://diagnostic-pro-mvp-backups
- Disaster recovery data in gs://diagnostic-pro-mvp-disaster-recovery
- Source code backups via GitHub
- Database backups (external service)

## Performance Specifications
- **Target Capacity**: 100+ diagnostics/day
- **Response Times**: 15-30 min (Emergency), 2-4 hrs (Standard)
- **Uptime Target**: 99.9%
- **Auto-scaling**: 0-10 instances based on demand

Last Updated: August 2, 2025
Environment: Production