# Branch Protection Rules - CI/CD Pipeline Protection

## STRICT POLICY: CI/CD Pipeline Cannot Be Modified

To protect your deployment pipeline from unauthorized changes, set up these branch protection rules in GitHub:

### 1. Main Branch Protection (Production)

**GitHub Settings > Branches > Add Branch Protection Rule**

**Branch name pattern:** `main`

**Required Settings:**
- ✅ **Restrict pushes that create files**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `Code Quality Gates`
    - `Security Scanning` 
    - `Test Suite`
    - `Build Application`
    - `Performance Testing`
- ✅ **Require conversation resolution before merging**
- ✅ **Restrict pushes that create files**
- ✅ **Do not allow bypassing the above settings**
- ✅ **Restrict pushes that create files**

### 2. Develop Branch Protection (Staging)

**Branch name pattern:** `develop`

**Required Settings:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1
- ✅ **Require status checks to pass before merging**
  - Required status checks:
    - `Code Quality Gates`
    - `Security Scanning`
    - `Test Suite`
    - `Build Application`

### 3. CI/CD File Protection

**Protected Files (Cannot be modified without review):**
- `.github/workflows/*.yml`
- `cloudbuild.yaml`
- `Dockerfile.optimized`
- `package.json` (scripts section)

### 4. CODEOWNERS File Setup

Create `.github/CODEOWNERS`:
```
# CI/CD Pipeline Protection
/.github/workflows/ @jeremylongshore
/cloudbuild.yaml @jeremylongshore  
/Dockerfile.optimized @jeremylongshore
/package.json @jeremylongshore

# Deployment configurations
/.env.* @jeremylongshore
/src/routes/api/ @jeremylongshore
```

### 5. Repository Settings

**Settings > General:**
- ✅ Disable merge commits (only squash and rebase)
- ✅ Automatically delete head branches

**Settings > Actions > General:**
- ✅ Disable fork pull request workflows
- ✅ Require approval for first-time contributors

## Commands to Apply Protection (GitHub CLI)

```bash
# Install GitHub CLI if not installed
# Run these commands to apply protection rules

gh api repos/YOUR_USERNAME/diagnostic-pro-mvp/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Code Quality Gates","Security Scanning","Test Suite","Build Application","Performance Testing"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null

gh api repos/YOUR_USERNAME/diagnostic-pro-mvp/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Code Quality Gates","Security Scanning","Test Suite","Build Application"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

## Result

✅ **No one can push directly to main or develop**
✅ **All CI/CD changes require pull request + approval**  
✅ **All tests must pass before deployment**
✅ **Pipeline files are protected from unauthorized changes**
✅ **Cost optimizations remain intact**

Your deployment pipeline is now bulletproof! 🛡️