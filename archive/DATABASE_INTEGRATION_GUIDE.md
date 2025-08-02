# DiagnosticPro Database Integration & Analytics Guide

## Overview

This guide covers the enhanced database integration for DiagnosticPro, including BigQuery analytics, PostgreSQL storage, monitoring, backups, and data export capabilities.

## 🏗️ Architecture

### Dual Storage Strategy
- **PostgreSQL**: Primary transactional database for real-time operations
- **BigQuery**: Analytics warehouse for marketing insights and data export
- **File Storage**: Fallback for development and offline scenarios

### Data Flow
1. Customer submissions → PostgreSQL + BigQuery + Analytics tracking
2. AI analysis results → PostgreSQL updates + BigQuery events
3. Marketing analytics → BigQuery queries with PostgreSQL fallback
4. Data exports → BigQuery-first with PostgreSQL backup

## 🚀 Features Implemented

### ✅ Database Integration
- [x] Enhanced PostgreSQL service with error handling
- [x] BigQuery integration for analytics
- [x] Dual-write strategy for data redundancy
- [x] Automatic fallback mechanisms
- [x] File-based storage for development

### ✅ Analytics Dashboard
- [x] Real-time conversion tracking
- [x] Customer submission metrics
- [x] Service health monitoring
- [x] Marketing funnel analysis
- [x] Date range filtering and exports

### ✅ Data Export & Scripts
- [x] CSV export functionality
- [x] Command-line data export tool
- [x] Marketing analysis exports
- [x] Automated backup scripts
- [x] Multiple export formats

### ✅ Backup Strategies
- [x] PostgreSQL dump backups
- [x] BigQuery data exports
- [x] System health snapshots
- [x] Automated cleanup policies
- [x] Backup verification

### ✅ Real-time Monitoring
- [x] Health check endpoints
- [x] System metrics collection
- [x] Prometheus metrics format
- [x] Database connection monitoring
- [x] Performance tracking

### ✅ Testing & Verification
- [x] Comprehensive test suite
- [x] Data persistence verification
- [x] Integration testing
- [x] Stress testing capabilities
- [x] Monitoring validation

## 📊 API Endpoints

### Health Monitoring
```bash
# Basic health check
GET /api/health

# Health with metrics
GET /api/health?metrics=true

# Prometheus format
GET /api/health?format=prometheus
```

### Analytics Dashboard
```bash
# Dashboard data
GET /api/analytics?action=dashboard&startDate=2024-01-01&endDate=2024-12-31

# Conversion funnel
GET /api/analytics?action=conversions

# Data export (CSV)
GET /api/analytics?action=export&startDate=2024-01-01&endDate=2024-12-31

# System health
GET /api/analytics?action=health
```

### Admin Analytics Interface
- **URL**: `/admin/analytics`
- **Features**: Interactive dashboard, date range selection, CSV exports
- **Requirements**: Admin access (implement authentication as needed)

## 🛠️ Scripts & Tools

### Data Export Script
```bash
# Export submissions (last 30 days)
node scripts/data-export.js

# Export specific date range
node scripts/data-export.js --startDate 2024-01-01 --endDate 2024-01-31

# Export all data types
node scripts/data-export.js --type all --output marketing-data

# Export analytics only
node scripts/data-export.js --type analytics
```

### Backup Script
```bash
# Full backup
node scripts/backup-database.js

# Custom backup directory
BACKUP_DIR=/data/backups node scripts/backup-database.js

# With retention policy
BACKUP_RETENTION_DAYS=60 node scripts/backup-database.js
```

## ⚙️ Configuration

### Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:5432/diagnosticpro_mvp
BIGQUERY_DATASET_ID=diagnosticpro_analytics

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
VERTEX_AI_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Backup Configuration
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
```

### BigQuery Setup
1. Create Google Cloud Project
2. Enable BigQuery API
3. Create service account with BigQuery permissions
4. Download service account key
5. Set environment variables

### PostgreSQL Setup
1. Create database: `diagnosticpro_mvp`
2. Set connection string in `DATABASE_URL`
3. Tables will be created automatically

## 📈 Analytics Capabilities

### Key Metrics Tracked
- Total submissions per day/week/month
- Unique customers and return rate
- Average quote values and trends
- AI analysis completion rate
- Service type distribution
- Equipment type breakdown

### Conversion Funnel
- `submission_created`: New customer submission
- `ai_analysis_completed`: AI processing finished
- `email_sent`: Diagnostic email delivered
- Custom events: Payment, follow-up, etc.

### Marketing Insights
- Customer acquisition trends
- Quote value analysis
- Service demand patterns
- Geographic distribution (if location data added)
- Seasonal trends and patterns

## 🔧 Maintenance

### Daily Tasks
- Monitor health endpoints
- Check backup completion
- Review submission volume

### Weekly Tasks
- Export analytics data
- Review system performance
- Clean up old backups
- Update conversion tracking

### Monthly Tasks
- Analyze marketing trends
- Export data for analysis
- Review storage costs
- Update retention policies

## 🧪 Testing

### Run Database Tests
```bash
# Full test suite
npm run test

# Database-specific tests
npx playwright test tests/database-persistence.test.js

# Integration tests
npm run test:api
```

### Manual Verification
1. Submit test form at `/`
2. Check health endpoint: `/api/health`
3. View analytics: `/admin/analytics`
4. Export test data
5. Verify backup creation

## 🚨 Troubleshooting

### Common Issues

**BigQuery Connection Failed**
- Verify service account key
- Check project ID configuration
- Ensure BigQuery API is enabled
- Validate permissions

**PostgreSQL Connection Failed**
- Check DATABASE_URL format
- Verify database exists
- Test network connectivity
- Review firewall settings

**Analytics Not Working**
- Check BigQuery configuration
- Verify dataset creation
- Review service account permissions
- Check for initialization errors

**Export Failures**
- Verify data exists in date range
- Check BigQuery query limits
- Review export permissions
- Test with smaller date ranges

### Monitoring

Monitor these metrics for system health:
- Database connection status
- Response times < 2 seconds
- Memory usage < 80%
- Submission success rate > 95%
- Analytics data freshness < 1 hour

## 📚 Next Steps

### Immediate Improvements
1. Add authentication to admin dashboard
2. Implement real-time alerts
3. Add geographic analytics
4. Create automated reports

### Advanced Features
1. Machine learning insights
2. Predictive analytics
3. Customer segmentation
4. Revenue forecasting

## 📞 Support

For issues or questions:
1. Check system health: `/api/health`
2. Review logs for errors
3. Test with minimal data
4. Verify environment configuration
5. Contact development team

---

**Status**: ✅ All database integration tasks completed
**Last Updated**: 2025-08-02
**Version**: 1.0.0