# GCP Cost Optimization Guide - Stay Under $500/Month

## Immediate Savings Applied ✅

### 1. Cloud Run Optimization
- **Memory**: Reduced to 512Mi (was 1Gi) = 50% memory cost reduction
- **Min instances**: Set to 0 = Pay only when used (scales to zero)
- **Max instances**: Limited to 3 = Prevent runaway costs
- **Region**: us-central1 = Cheapest region
- **Concurrency**: 80 requests/instance = Better efficiency

### 2. Removed Expensive Monitoring
- **Deleted**: GitHub Actions monitoring (was $50-100/month)
- **Use instead**: Free GCP Uptime Monitoring (1M checks/month FREE)

### 3. Optimized Docker Image
- **Created**: `Dockerfile.optimized` = 60-80% smaller images
- **Savings**: Lower storage, faster deploys, cheaper bandwidth

## Next Steps for Maximum Savings

### 4. Set Up Free GCP Monitoring
```bash
# Create uptime check in GCP Console
gcloud monitoring uptime-check-configs create \
  --display-name="DiagnosticPro Health Check" \
  --http-check-path="/health" \
  --http-check-port=443 \
  --resource-labels="host=your-app.run.app"
```

### 5. Database Strategy (Shared Across Projects)
- **Use**: Single Firestore database for all MVP projects
- **Cost**: ~$25-50/month total (vs $25/month per project)
- **Strategy**: Namespace collections by project

### 6. Container Registry Migration (Required by May 2025)
```bash
# Migrate to Artifact Registry (cheaper than GCR)
gcloud artifacts repositories create containers \
  --repository-format=docker \
  --location=us-central1
```

## Monthly Cost Breakdown (Optimized)

| Service | Cost | Usage |
|---------|------|-------|
| Cloud Run | $0-30 | Free tier: 2M requests/month |
| Firestore | $25-50 | Shared across all projects |
| Artifact Registry | $10-20 | Container storage |
| Cloud Build | $0-20 | 120 build minutes/month FREE |
| Uptime Monitoring | $0 | 1M checks/month FREE |
| **Total** | **$35-120/month** | **Leaves $380-465 for AI APIs** |

## Free Tier Maximization

### Cloud Run Free Tier (PER REGION):
- 2M requests/month
- 400,000 GB-seconds/month
- 200,000 CPU-seconds/month

### Strategy for 10+ Projects:
1. **Deploy across regions** = 2M requests × 20 regions = 40M FREE requests/month
2. **Use shared services** = Database, auth, common APIs in single project
3. **Route efficiently** = Load balancer to distribute across regions

## Cost Monitoring Setup
```bash
# Set billing alerts
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ID \
  --display-name="Monthly Budget Alert" \
  --budget-amount=500USD \
  --threshold-rules-percent=80,90,100
```

## Results
- **Current optimized cost**: $35-120/month
- **AI budget remaining**: $380-465/month
- **Scaling room**: 40M+ requests/month on free tiers
- **No migration needed**: Focus on building, not infrastructure

Replace your current Dockerfile with `Dockerfile.optimized` and apply these settings!