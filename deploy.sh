#!/bin/bash

echo "--- 🟢 Starting Deployment ---"

# 1. Pull the latest code from GitHub
echo "Updating source code..."
git pull origin master

# 2. Rebuild the frontend (Production version)
# This forces Docker to run the 'npm run build' inside the Dockerfile again
echo "Rebuilding Frontend..."
docker compose up -d --build frontend

# 3. Optional: Rebuild the backend if you have Java changes
docker compose up -d --build app-prod

# 4. Clean up old/unused images to save disk space
echo "Cleaning up old images..."
docker image prune -f

echo "--- ✅ Deployment Complete! ---"
