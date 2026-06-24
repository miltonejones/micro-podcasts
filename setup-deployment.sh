#!/bin/bash

# STATECAST Deployment Setup Script
# This script sets up the repository for deployment to AWS Amplify

set -e

echo "🚀 STATECAST Deployment Setup"
echo "=============================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v git &> /dev/null || { echo "❌ Git not found"; exit 1; }
command -v npm &> /dev/null || { echo "❌ npm not found"; exit 1; }
command -v aws &> /dev/null || { echo "⚠️  AWS CLI not found (required for Amplify)"; }

echo "✓ All prerequisites found"
echo ""

# Display current branch status
echo "📋 Repository Status:"
echo "  Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo "  Commits: $(git rev-list --all --count)"
echo "  Remotes: $(git remote)"
echo ""

# Instructions for next steps
echo "📝 Next Steps:"
echo ""
echo "1. Create GitHub Repository:"
echo "   gh repo create micro-podcasts --public --source=. --remote=origin"
echo ""
echo "2. Set up branches:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo "   git checkout -b develop"
echo "   git push -u origin develop"
echo ""
echo "3. Configure AWS Amplify:"
echo "   AWS_PROFILE=Access2025 amplify configure"
echo "   amplify init --name micro-podcasts --yes"
echo ""
echo "4. Add GitHub Secrets in repository settings:"
echo "   AWS_ROLE_TO_ASSUME (optional, for OIDC)"
echo "   AMPLIFY_CONFIG (optional, for automated deployments)"
echo ""
echo "5. Connect in Amplify Console:"
echo "   - App Settings → Connect Repository"
echo "   - Select GitHub → Authorize → Select micro-podcasts"
echo "   - Set main branch for production deployment"
echo "   - Add develop branch for staging"
echo ""
echo "✅ Setup complete! Follow the steps above to complete deployment configuration."
echo ""
