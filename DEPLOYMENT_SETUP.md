# STATECAST - Deployment Setup Summary

## What Has Been Configured

### ✅ GitHub Actions CI/CD Pipelines

**1. Amplify Deployment Pipeline** (`.github/workflows/amplify-deploy.yml`)
- Triggers on push to `main` (production) and `develop` (staging)
- Builds the application
- Deploys to AWS Amplify
- Environment-aware deployment

**2. Test & Lint Pipeline** (`.github/workflows/test.yml`)
- Runs on PRs and push to develop
- Installs dependencies
- Builds the project
- Reports status checks

### ✅ AWS Amplify Configuration

**amplify.yml** - Build specification for Amplify
- Node version: 20.x
- Build output: `dist/host-app/`
- Caching configured for faster builds
- Pre-build: `npm ci`
- Build: `npm run build`

### ✅ Repository Configuration

**.gitignore** - Updated with:
- Amplify artifacts
- Storybook builds
- Environment files
- Build cache

### ✅ Package Scripts Enhanced

```json
"build": "ng build host-app"
"build:prod": "ng build host-app --configuration production"
```

### ✅ Documentation

- **DEPLOYMENT.md** - Complete deployment guide
- **setup-deployment.sh** - Automated setup script

## Your Next Steps (Manual)

### Step 1: Create GitHub Repository
```bash
gh repo create micro-podcasts \
  --public \
  --source=. \
  --remote=origin \
  --description "STATECAST - Angular Micro-frontend Podcast Application"
```

### Step 2: Set Up Git Branches
```bash
git add .
git commit -m "chore: initial deployment configuration"
git branch -M main
git push -u origin main

git checkout -b develop
git push -u origin develop
```

### Step 3: Configure AWS Amplify

#### Option A: Using AWS Console (Easiest)
1. Go to https://console.aws.amazon.com/amplify/
2. Click "New App" → "Host web app"
3. Select "GitHub" as source
4. Authorize GitHub and select `micro-podcasts` repo
5. Select `main` branch
6. Use build settings from `amplify.yml`
7. Click "Save and deploy"

#### Option B: Using AWS CLI
```bash
AWS_PROFILE=Access2025 amplify configure

amplify init \
  --name micro-podcasts \
  --environment production \
  --defaultEditor code \
  --appType web \
  --framework angular \
  --yes

amplify publish --yes
```

### Step 4: Enable Branch Deployments

In **Amplify Console**:
1. Go to "App Settings" → "Branches"
2. Connect `develop` branch
3. Set it as staging environment
4. (Optional) Add environment variables per branch

### Step 5: Set Up GitHub Branch Protection (Optional but Recommended)

**For `main` branch:**
- Settings → Branches → Add rule → `main`
- ✅ Require pull request reviews (1+ approval)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

## Deployment Flow

```
develop branch → Push → GitHub Actions (Test) → Deploy to Staging
                  ↓
             Create PR to main
                  ↓
             Review & Merge → GitHub Actions (Deploy) → Production
```

## Environment Variables

Create `.env` files in project root:

**`.env.production`**
```
VITE_API_ENDPOINT=https://api-prod.example.com
VITE_ENVIRONMENT=production
```

**`.env.staging`**
```
VITE_API_ENDPOINT=https://api-staging.example.com
VITE_ENVIRONMENT=staging
```

Note: These are loaded by Amplify build process automatically.

## Troubleshooting

### Build Fails in GitHub Actions
```bash
# Clear cache and rebuild locally first
rm -rf node_modules .angular dist
npm ci
npm run build
```

### Amplify Deployment Issues
```bash
# Verify AWS credentials
aws sts get-caller-identity --profile Access2025

# Check Amplify build logs in console
amplify status
amplify logs backend
```

### Access2025 Profile Not Found
```bash
# Verify profile exists
aws configure list --profile Access2025

# If missing, configure it
aws configure --profile Access2025
```

## GitHub Secrets (If Using OIDC)

In repository **Settings → Secrets and Variables → Actions**, add:

```
AWS_ROLE_TO_ASSUME = arn:aws:iam::ACCOUNT-ID:role/AmplifyDeployRole
```

Get your account ID:
```bash
aws sts get-caller-identity --profile Access2025 --query Account --output text
```

## Monitoring & Logs

**GitHub Actions:**
- Repository → Actions tab
- View workflow runs and logs

**AWS Amplify:**
- Console → Deployments tab
- View deployment history and logs

**AWS CloudWatch:**
- Console → Logs → Look for `/aws/amplify/`

## First Deployment Checklist

- [ ] GitHub repo created
- [ ] `main` and `develop` branches pushed
- [ ] Amplify app created in AWS Console
- [ ] GitHub repository connected to Amplify
- [ ] `main` branch deployment working
- [ ] `develop` branch connected for staging
- [ ] First build succeeded in Amplify
- [ ] App accessible at Amplify URL
- [ ] Branch protection rules configured
- [ ] GitHub Actions workflows triggering

## Support

For issues:
1. Check GitHub Actions workflow logs
2. Check Amplify deployment logs in Console
3. Verify AWS credentials: `aws sts get-caller-identity --profile Access2025`
4. Review DEPLOYMENT.md for detailed troubleshooting

---

**Ready to deploy!** 🚀
