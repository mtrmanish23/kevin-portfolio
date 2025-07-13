#!/bin/bash
set -e

echo "Starting Hugo build..."

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "Hugo is not installed. Installing..."
    # This would be handled by Netlify's Hugo installation
    exit 1
fi

# Build the site
hugo --gc --minify

echo "Build completed successfully!" 