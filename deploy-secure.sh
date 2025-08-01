#!/bin/bash
#
# SECURE DiagnosticPro MVP Frontend Deployment Script
# AUTHORIZED BY: CTO
# DATE: 2025-07-28
#

echo "🚀 Initiating SECURE deployment of DiagnosticPro MVP Frontend..."

# Automatically get the project ID from gcloud config
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ ERROR: Google Cloud project ID not found. Please run 'gcloud init'."
    exit 1
fi

echo "✅ Project ID set to: $PROJECT_ID"

# Step 1: Build the container using the existing Dockerfile
echo "🔧 Building container image with Cloud Build..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/diagnosticpro-frontend" .

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "❌ FATAL: Container build failed."
    exit 1
fi

echo "✅ Container build successful."

# Step 2: Deploy to Cloud Run with corrected security settings
echo "☁️ Deploying to Cloud Run in us-east5..."
gcloud run deploy diagnosticpro-frontend \
  --image "gcr.io/$PROJECT_ID/diagnosticpro-frontend" \
  --region "us-east5" \
  --port 3000 \
  --no-allow-unauthenticated \
  --set-secrets="DB_PASSWORD=DB_PASSWORD:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,SENDGRID_API_KEY=SENDGRID_API_KEY:latest,STRIPE_PUBLISHABLE_KEY=STRIPE_PUBLISHABLE_KEY:latest"

# Check if the deployment command was successful
if [ $? -ne 0 ]; then
    echo "❌ FATAL: Cloud Run deployment failed."
    exit 1
fi

SERVICE_URL=$(gcloud run services describe diagnosticpro-frontend --region=us-east5 --format="value(status.url)")

echo "✅✅✅ SECURE DEPLOYMENT COMPLETE! ✅✅✅"
echo "🌐 Service is now running at: $SERVICE_URL"
echo "🔐 Access is restricted to authenticated project users."