# STATECAST - Deployment Guide

## Prerequisites

- AWS Account with Amplify enabled
- GitHub Account
- AWS CLI v2 installed locally
- Node.js 20+ installed

## GitHub Setup

1. **Create GitHub Repository**
   ```bash
   gh repo create micro-podcasts --public --source=.
   git branch -M main
   git push -u origin main
   ```

2. **Create develop branch**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

## AWS Amplify Setup

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure Amplify (using @Access2025 profile)**
   ```bash
   AWS_PROFILE=Access2025 amplify configure
   ```
   Or interactively:
   ```bash
   amplify configure
   # Select AWS profile: Access2025
   ```

3. **Initialize Amplify App**
   ```bash
   amplify init \
     --name micro-podcasts \
     --environment production \
     --defaultEditor code \
     --appType web \
     --framework angular \
     --yes
   ```

4. **Connect GitHub Repository**
   - Go to AWS Amplify Console
   - Click "New App" → "Host web app"
   - Select GitHub as source
   - Authorize and select `micro-podcasts` repo
   - Select `main` branch for production
   - Click "Save and deploy"

5. **Setup Branch Deployments**
   - In Amplify Console → App Settings → Branches
   - Connect `develop` branch for staging environment
   - Set branch-specific environment variables if needed

## Deployment Workflow

### From develop (Staging)
```bash
git checkout develop
git pull origin develop
# Make changes
git add .
git commit -m "feat: add feature"
git push origin develop
# GitHub Actions automatically deploys to staging
```

### From main (Production)
```bash
git checkout main
git pull origin main
# Create PR from develop to main
# After review and merge, automatically deploys to production
```

## GitHub Secrets Configuration

Add these secrets in GitHub Settings → Secrets and Variables → Actions:

```
AWS_ROLE_TO_ASSUME: arn:aws:iam::ACCOUNT-ID:role/AmplifyRole
AMPLIFY_CONFIG: (base64 encoded Amplify config)
```

## Environment Variables

Create `.env.production` and `.env.staging` files with:
```
VITE_API_ENDPOINT=https://api-prod.example.com
VITE_ENVIRONMENT=production
```

## Troubleshooting

### Build Fails
- Check `build-storybook.log` for errors
- Verify Node.js version matches (v20)
- Clear cache: `rm -rf node_modules .angular dist`

### Deployment Issues
- Check Amplify Console logs
- Verify AWS credentials: `aws sts get-caller-identity --profile Access2025`
- Ensure branch protection rules don't block deployments

### GitHub Actions Secrets
- Update AWS credentials in GitHub Settings if they expire
- Rotate AWS keys regularly

## Monitoring

- **Amplify Console**: https://console.aws.amazon.com/amplify
- **GitHub Actions**: Repository → Actions tab
- **CloudWatch Logs**: AWS Console → CloudWatch

## Branch Protection Rules

Recommended settings for `main`:
- Require pull request reviews (1+ approval)
- Require status checks to pass (Build & Test)
- Require branches to be up to date before merging
- Include administrators in restrictions
