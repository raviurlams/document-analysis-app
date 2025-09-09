#!/bin/bash
set -e

APP_NAME="document-analysis-app"
DIST_DIR="dist/$APP_NAME/browser"

echo "👉 Building Angular app for production..."
rm -rf dist
ng build --configuration production

echo "👉 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=$DIST_DIR

echo "✅ Deployment complete!"
echo "🌐 Visit: https://raviurlams.github.io/$APP_NAME/"
