#!/bin/bash
# Production Backup Script
# Creates comprehensive backup of production environment

set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
PROJECT_ID="diagnostic-pro-mvp"

echo "🔄 Starting production backup..."
echo "Backup directory: $BACKUP_DIR"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup Cloud Run configuration
echo "📦 Backing up Cloud Run service configuration..."
gcloud run services describe diagnosticpro-mvp \
  --region=us-central1 \
  --format=export > $BACKUP_DIR/cloudrun_service_config.yaml

# Backup IAM policies
echo "🔐 Backing up IAM policies..."
gcloud projects get-iam-policy $PROJECT_ID \
  --format=json > $BACKUP_DIR/iam_policy.json

# Backup secrets list (not values for security)
echo "🔑 Backing up secrets metadata..."
gcloud secrets list \
  --format="table(name,created,labels)" > $BACKUP_DIR/secrets_list.txt

# Backup storage bucket list
echo "🗄️ Backing up storage configuration..."
gcloud storage buckets list \
  --format="table(name,location,storageClass)" > $BACKUP_DIR/storage_buckets.txt

# Backup source code
echo "💾 Backing up source code..."
git archive --format=tar.gz \
  --output=$BACKUP_DIR/source_code_$(git rev-parse --short HEAD).tar.gz HEAD

# Create backup manifest
echo "📋 Creating backup manifest..."
cat > $BACKUP_DIR/backup_manifest.txt << EOF
DiagnosticPro MVP Production Backup
===================================
Date: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)
Project ID: $PROJECT_ID

Contents:
- cloudrun_service_config.yaml: Cloud Run service configuration
- iam_policy.json: IAM policies and permissions
- secrets_list.txt: List of secrets (metadata only)
- storage_buckets.txt: Storage bucket configuration
- source_code_*.tar.gz: Complete source code archive

Notes:
- Secret values are NOT included for security
- Database backups handled separately
- File backups stored in gs://diagnostic-pro-mvp-backups/
EOF

# Upload to cloud storage
echo "☁️ Uploading backup to cloud storage..."
gcloud storage cp -r $BACKUP_DIR gs://diagnostic-pro-mvp-backups/

# Cleanup local backup (keep cloud copy)
rm -rf $BACKUP_DIR

echo "✅ Backup completed successfully!"
echo "📁 Cloud location: gs://diagnostic-pro-mvp-backups/$(basename $BACKUP_DIR)"
echo "🕐 Timestamp: $(date)"