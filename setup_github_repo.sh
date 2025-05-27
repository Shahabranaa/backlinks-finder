#!/bin/bash

# This script helps set up a GitHub repository for the backlink finder

echo "Setting up GitHub repository for the backlink finder tool..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first."
    exit 1
fi

# Ask for repository name
read -p "Enter your desired GitHub repository name (e.g., backlink-finder): " repo_name

# Ask for GitHub username
read -p "Enter your GitHub username: " github_username

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Run the preparation script to generate docs folder
echo "Running preparation script..."
./prepare_for_github_pages.sh

# Create initial commit
echo "Creating initial commit..."
git add .
git commit -m "Initial commit"

# Instructions for connecting to GitHub
echo ""
echo "Next steps to complete setup:"
echo "1. Create a new repository on GitHub named '$repo_name'"
echo "   Visit: https://github.com/new"
echo ""
echo "2. Connect your local repository to GitHub with these commands:"
echo "   git remote add origin https://github.com/$github_username/$repo_name.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. After pushing, GitHub Actions will automatically deploy your site"
echo "   Your site will be available at: https://$github_username.github.io/$repo_name/"
echo ""
echo "4. To manually trigger deployment, make changes and push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Update website'"
echo "   git push"
echo "" 