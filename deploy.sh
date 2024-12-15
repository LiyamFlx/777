#!/bin/bash

# Navigate to the project directory
cd /Users/wix/Downloads/engagesense_full_project || { echo "Directory not found"; exit 1; }

# Add all changes to git
git add . || { echo "Failed to add changes"; exit 1; }

# Commit changes with a message
git commit -m "Deploy full EngageSense" || { echo "Failed to commit changes"; exit 1; }

# Push changes to the remote repository
git push || { echo "Failed to push changes"; exit 1; }

echo "Deployment complete!"
