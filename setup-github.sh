#!/bin/bash
# Script to initialize and push Your Yoda Demo to GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Your Yoda Demo for GitHub${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${GREEN}Initializing git repository...${NC}"
    git init
else
    echo -e "${GREEN}Git repository already initialized.${NC}"
fi

# Create .gitignore if it doesn't exist (though we've already created one)
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}ERROR: .gitignore not found. Please make sure it exists.${NC}"
    exit 1
else
    echo -e "${GREEN}.gitignore file found.${NC}"
fi

# Stage all files that aren't gitignored
echo -e "${GREEN}Staging files...${NC}"
git add .

echo -e "${GREEN}Files staged. Preview of what will be committed:${NC}"
git status

# Prompt for commit message
echo -e "${YELLOW}Enter your commit message:${NC}"
read commit_message

# If no message provided, use a default
if [ -z "$commit_message" ]; then
    commit_message="Initial commit of Your Yoda Demo"
fi

# Commit changes
echo -e "${GREEN}Committing with message: ${commit_message}${NC}"
git commit -m "$commit_message"

# Prompt for GitHub repository URL
echo -e "${YELLOW}Enter your GitHub repository URL (e.g., https://github.com/yourusername/your-yoda-demo.git):${NC}"
read repo_url

# If no URL provided, exit
if [ -z "$repo_url" ]; then
    echo -e "${YELLOW}No GitHub repository URL provided. Your changes are committed locally.${NC}"
    echo -e "${YELLOW}To push later, use: git remote add origin YOUR_REPO_URL && git push -u origin main${NC}"
    exit 0
fi

# Add remote origin
echo -e "${GREEN}Adding remote repository...${NC}"
git remote add origin "$repo_url"

# Push to GitHub
echo -e "${GREEN}Pushing to GitHub...${NC}"
git push -u origin main

echo -e "${GREEN}Done! Your code has been pushed to GitHub.${NC}"
echo -e "${YELLOW}Repository URL: ${repo_url}${NC}"
