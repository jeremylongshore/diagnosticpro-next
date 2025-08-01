#!/bin/bash
#
# FINAL & SECURE DiagnosticPro MVP Ecosystem Deployment
# AUTHORIZED BY: CTO
# DATE: 2025-07-28
#

set -e # Exit immediately if a command exits with a non-zero status.

# --- CONFIGURATION ---
export PROJECT_ID="crafty-nova-466504-c7"
export REGION="us-east5"
export BACKEND_SERVICE_NAME="nexus-mcp"
export FRONTEND_SERVICE_NAME="diagnosticpro-frontend"
export DB_INSTANCE="diagnosticpro-db" # Assuming DB is in this project or accessible

echo "🚀 INITIATING FINAL PRODUCTION DEPLOYMENT to project: $PROJECT_ID"
echo "════════════════════════════════════════════════════════════════"

echo "📍 Setting active project..."
gcloud config set project $PROJECT_ID

echo "⚡ Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com secretmanager.googleapis.com sqladmin.googleapis.com

# --- BACKEND DEPLOYMENT (NEXUS MCP) ---
echo ""
echo "🤖 DEPLOYING SECURE BACKEND: $BACKEND_SERVICE_NAME"
echo "──────────────────────────────────────────────────"

cd mcp-nexus || { echo "❌ ERROR: mcp-nexus directory not found."; exit 1; }

echo "🔨 Building backend container..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME" .

echo "☁️ Deploying backend to Cloud Run with secure settings..."
gcloud run deploy $BACKEND_SERVICE_NAME \
  --image "gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME" \
  --region "$REGION" \
  --no-allow-unauthenticated \
  --set-secrets="DB_PASSWORD=DB_PASSWORD:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,SENDGRID_API_KEY=SENDGRID_API_KEY:latest" \
  --add-cloudsql-instances "${PROJECT_ID}:${REGION}:${DB_INSTANCE}" \
  --set-env-vars="NODE_ENV=production,PROJECT_ID=$PROJECT_ID" \
  --memory=1Gi \
  --cpu=1

echo "✅ Secure backend deployment complete."

# --- MORE STEPS WILL BE ADDED HERE ---
# --- FRONTEND DEPLOYMENT ---
echo ""
echo "🌐 DEPLOYING SECURE FRONTEND: $FRONTEND_SERVICE_NAME"
echo "──────────────────────────────────────────────────────"

# Navigate back to the parent directory to find the frontend source
cd .. || { echo "❌ ERROR: Failed to navigate out of mcp-nexus."; exit 1; }

echo "🔨 Building frontend container..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME" .

echo "☁️ Deploying frontend to Cloud Run with secure settings..."
gcloud run deploy $FRONTEND_SERVICE_NAME \
  --image "gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME" \
  --region "$REGION" \
  --no-allow-unauthenticated \
  --set-secrets="STRIPE_PUBLISHABLE_KEY=STRIPE_PUBLISHABLE_KEY:latest" \
  --set-env-vars="NODE_ENV=production,PORT=3000,API_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --region=$REGION --format='value(status.url)')" \
  --memory=1Gi \
  --cpu=1

echo "✅ Secure frontend deployment complete."

# --- FINAL SUMMARY ---
echo ""
echo "🎉 PRODUCTION ECOSYSTEM DEPLOYMENT COMPLETE\!"
echo "═════════════════════════════════════════════"
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --region=$REGION --format="value(status.url)")
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE_NAME --region=$REGION --format="value(status.url)")
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🤖 Backend (NEXUS MCP) URL: $BACKEND_URL"
echo "🔐 Both services require authentication."
echo "✅ Ready for final end-to-end testing."
EOF < /dev/null
