# Deployment Procedures

## Branch Strategy
- **production/live-v1.0.0**: Live production code (protected)
- **development/staging**: Staging environment for testing
- **feature/**: Feature development branches

## Pre-Deployment Checklist
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Staging environment tested
- [ ] Backup created
- [ ] Change management approval

## Deployment Steps

### 1. Prepare Release
```bash
# Create deployment branch
git checkout production/live-v1.0.0
git pull origin production/live-v1.0.0
git checkout -b deploy/v1.x.x

# Build application
npm install
npm run build
npm run lint
npm run test
```

### 2. Test Locally
```bash
# Test production build
npm run preview
```

### 3. Deploy to Production
```bash
# Deploy to Cloud Run
gcloud run deploy diagnosticpro-mvp \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production

# Verify deployment
curl -I https://diagnosticpro-mvp-970547573997.us-central1.run.app
```

### 4. Post-Deployment
- [ ] Monitor application metrics for 30 minutes
- [ ] Verify all functionality works
- [ ] Check error logs
- [ ] Test critical user flows
- [ ] Update documentation
- [ ] Notify stakeholders

### 5. Tag Release
```bash
git tag -a v1.x.x -m "Production release v1.x.x"
git push origin v1.x.x
```

## Rollback Procedure
If issues are detected:

### Immediate Rollback
```bash
# Revert to previous revision
gcloud run services update-traffic diagnosticpro-mvp \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region us-central1
```

### Full Rollback
```bash
# Scale down service temporarily
gcloud run services update diagnosticpro-mvp \
  --max-instances=0 \
  --region us-central1

# Fix issues and redeploy
# Scale back up
gcloud run services update diagnosticpro-mvp \
  --max-instances=10 \
  --region us-central1
```

## Emergency Procedures
For critical production issues:

1. **Scale down**: Reduce traffic to failing service
2. **Communicate**: Notify stakeholders via emergency contacts
3. **Investigate**: Check logs and metrics
4. **Fix**: Apply hotfix or rollback
5. **Verify**: Test fix thoroughly
6. **Scale up**: Return to normal operations
7. **Post-mortem**: Document incident and lessons learned

## Environment Variables
Production requires these environment variables:
- `NODE_ENV=production`
- `STRIPE_SECRET_KEY` (from Secret Manager)
- `STRIPE_PUBLISHABLE_KEY` (from Secret Manager)
- `DB_PASSWORD` (from Secret Manager)

## Security Considerations
- Never deploy with test credentials
- Verify all secrets are production-ready
- Ensure HTTPS is enforced
- Check IAM permissions are minimal
- Validate input sanitization

## Monitoring During Deployment
Watch these metrics:
- **Response time** < 10 seconds
- **Error rate** < 5%
- **Memory usage** < 80%
- **CPU usage** < 70%
- **Request count** matches expected traffic

## Deployment Schedule
- **Maintenance Window**: Sundays 2-4 AM CDT
- **Emergency Deployments**: As needed with approval
- **Regular Deployments**: Weekly during maintenance window

---

*Last Updated: August 2, 2025*