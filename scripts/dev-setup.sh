#!/bin/bash

# Development Setup Script for Ace Photography Studio

echo "🎨 Setting up Ace Photography Studio for local development..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created! Please edit it with your actual values."
else
    echo "✅ .env file already exists."
fi

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "⚠️  Hugo is not installed. Please install Hugo first:"
    echo "   macOS: brew install hugo"
    echo "   Windows: choco install hugo"
    echo "   Linux: sudo apt-get install hugo"
    exit 1
fi

# Install Netlify functions dependencies
if [ -d "netlify/functions" ]; then
    echo "📦 Installing Netlify functions dependencies..."
    cd netlify/functions && npm install && cd ../..
fi

echo ""
echo "🚀 Setup complete! To start development:"
echo "   1. Edit .env file with your actual values"
echo "   2. Run: hugo server --disableKinds RSS"
echo "   3. Visit: http://localhost:1313"
echo ""
echo "📋 Required environment variables:"
echo "   - RECAPTCHA_SECRET_KEY (for contact form)"
echo "   - WHATSAPP_PHONE (for WhatsApp integration)"
echo "   - TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID (optional)" 