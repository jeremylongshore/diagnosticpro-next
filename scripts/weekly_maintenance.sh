#!/bin/bash
# Weekly Production Health Check Script

set -e

echo "🔍 DiagnosticPro MVP - Weekly Production Health Check"
echo "====================================================="
echo "Date: $(date)"
echo ""

# Check service health
echo "1. 🏥 Service Health Status:"
echo "----------------------------"
HEALTH_STATUS=$(gcloud run services describe diagnosticpro-mvp \
  --region=us-central1 \
  --format="value(status.conditions[0].status)")
echo "Service Status: $HEALTH_STATUS"

SERVICE_URL=$(gcloud run services describe diagnosticpro-mvp \
  --region=us-central1 \
  --format="value(status.url)")
echo "Service URL: $SERVICE_URL"

# Test endpoint
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $SERVICE_URL || echo "FAILED")
echo "HTTP Status: $HTTP_STATUS"
echo ""

# Check recent errors
echo "2. 🚨 Recent Errors (last 24 hours):"
echo "------------------------------------"
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=ERROR' \
  --limit=5 \
  --format="table(timestamp,severity,textPayload)" \
  --freshness=1d || echo "No errors found"
echo ""

# Check resource usage
echo "3. 📊 Resource Usage Summary:"
echo "-----------------------------"
# Get latest revision
REVISION=$(gcloud run services describe diagnosticpro-mvp \
  --region=us-central1 \
  --format="value(status.latestReadyRevisionName)")
echo "Current Revision: $REVISION"

# Memory and CPU limits
MEMORY=$(gcloud run revisions describe $REVISION \
  --region=us-central1 \
  --format="value(spec.containers[0].resources.limits.memory)")
CPU=$(gcloud run revisions describe $REVISION \
  --region=us-central1 \
  --format="value(spec.containers[0].resources.limits.cpu)")
echo "Memory Limit: $MEMORY"
echo "CPU Limit: $CPU"
echo ""

# Check request volume (last 24h)
echo "4. 📈 Request Volume (last 24 hours):"
echo "-------------------------------------"
gcloud logging read \
  'resource.type="cloud_run_revision" httpRequest.requestMethod!=""' \
  --format="value(httpRequest.requestMethod)" \
  --freshness=1d | sort | uniq -c || echo "No requests logged"
echo ""

# Security check - IAM review
echo "5. 🔒 IAM Security Review:"
echo "-------------------------"
echo "Current IAM bindings:"
gcloud projects get-iam-policy diagnostic-pro-mvp \
  --flatten="bindings[].members" \
  --format="table(bindings.role,bindings.members)" \
  --filter="bindings.role:(roles/owner OR roles/editor OR roles/cloudsql)"
echo ""

# Backup verification
echo "6. 💾 Backup Verification:"
echo "-------------------------"
LATEST_BACKUP=$(gcloud storage ls gs://diagnostic-pro-mvp-backups/ | tail -1)
echo "Latest backup: $LATEST_BACKUP"
echo ""

# Cost analysis
echo "7. 💰 Cost Analysis:"
echo "-------------------"
echo "Checking current month billing..."
# Note: Requires billing API to be enabled
gcloud billing budgets list \
  --billing-account=$(gcloud billing projects describe diagnostic-pro-mvp \
  --format='value(billingAccountName)' | sed 's/.*\///') 2>/dev/null \
  || echo "Billing API access required for cost data"
echo ""

# Performance check
echo "8. ⚡ Performance Check:"
echo "----------------------"
echo "Testing response time..."
START_TIME=$(date +%s%N)
curl -s -o /dev/null $SERVICE_URL
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( ($END_TIME - $START_TIME) / 1000000 ))
echo "Response time: ${RESPONSE_TIME}ms"

if [ $RESPONSE_TIME -lt 5000 ]; then
  echo "✅ Response time: GOOD"
elif [ $RESPONSE_TIME -lt 10000 ]; then
  echo "⚠️ Response time: ACCEPTABLE"
else
  echo "❌ Response time: SLOW - Investigate"
fi
echo ""

# Summary
echo "9. 📋 Weekly Summary:"
echo "--------------------"
if [ "$HEALTH_STATUS" = "True" ] && [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Overall Status: HEALTHY"
else
  echo "⚠️ Overall Status: NEEDS ATTENTION"
fi

echo ""
echo "🎯 Action Items:"
echo "- Review any errors found above"
echo "- Check if response time needs optimization"
echo "- Verify backup completed successfully"
echo "- Review cost trends"
echo ""
echo "✅ Weekly health check completed: $(date)"
echo "📝 Save this report for monthly review"