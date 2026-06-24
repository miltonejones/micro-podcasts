#!/bin/bash

# STATECAST - Automated CLI Deployment Setup
# Prerequisites: gh CLI authenticated, aws CLI configured with @Access2025 profile

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🚀 STATECAST - Automated Deployment Setup"
echo "=========================================="
echo ""

# Step 1: GitHub
echo "📦 Step 1: Setting up GitHub repository..."
if gh repo view micro-podcasts 2>/dev/null; then
    echo "  ℹ️  Repository already exists"
else
    gh repo create micro-podcasts \
        --public \
        --source=. \
        --remote=origin \
        --description "STATECAST - Angular Micro-frontend Podcast Application" || exit 1
    echo "  ✅ Repository created"
fi

echo ""
echo "📤 Step 2: Pushing branches to GitHub..."
git push -u origin main && echo "  ✅ main branch pushed"
git push -u origin develop && echo "  ✅ develop branch pushed"

echo ""
echo "🔐 Step 3: Configuring AWS Amplify..."

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --profile Access2025 --query Account --output text) || {
    echo "  ❌ Failed to get AWS account ID"
    exit 1
}
echo "  ℹ️  AWS Account ID: $ACCOUNT_ID"

# Initialize Amplify
export AWS_PROFILE=Access2025

if [ -d "amplify" ]; then
    echo "  ℹ️  Amplify already initialized"
else
    amplify init \
        --name micro-podcasts \
        --environment production \
        --defaultEditor code \
        --appType web \
        --framework angular \
        --yes || exit 1
    echo "  ✅ Amplify initialized"
fi

echo ""
echo "📱 Step 4: Building and deploying..."
npm run build:prod && echo "  ✅ Build successful"

echo ""
echo "🌐 Step 5: Publishing to Amplify..."
amplify publish --yes && echo "  ✅ Published to Amplify"

echo ""
echo "✅ Deployment setup complete!"
echo ""
echo "📊 Next steps:"
echo "  1. Check your app at: https://console.aws.amazon.com/amplify/"
echo "  2. Connect develop branch in Amplify Console for staging"
echo "  3. Set up branch protection rules on GitHub"
echo "  4. Push changes to main or develop to trigger deployments"
echo ""
