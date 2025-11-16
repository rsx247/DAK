#!/bin/bash
# Script to initialize git repository and prepare for GitHub push

REPO_URL="https://github.com/rsx247/DAK"

echo "Setting up git repository for GitHub..."
echo "Target repository: $REPO_URL"
echo ""

# Check if already a git repo
if [ -d .git ]; then
    echo "Git repository already exists."
    git remote -v
    exit 0
fi

# Initialize git repository
echo "1. Initializing git repository..."
git init

# Add remote
echo "2. Adding remote repository..."
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# Check if files exist
if [ -d "assets/logos" ]; then
    echo "3. Found assets/logos/ directory"
fi

if [ -f "venue-logos.md" ]; then
    echo "4. Found venue-logos.md"
fi

echo ""
echo "Next steps:"
echo "1. Review files to be committed:"
echo "   git status"
echo ""
echo "2. Stage files:"
echo "   git add assets/logos/ venue-logos.md"
echo ""
echo "3. Commit:"
echo "   git commit -m 'Add venue logos, thumbnails, and mapping file'"
echo ""
echo "4. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Or if the repo already exists on GitHub:"
echo "   git pull origin main --allow-unrelated-histories"
echo "   git push -u origin main"

