#!/bin/bash
# Quick setup helper for local development

echo "🚀 Rahmat Grup - Development Setup"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js: $(node -v)"
echo "✓ npm: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Build
echo ""
echo "🔨 Building application..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  • Local development: npm start"
echo "  • Production build: npm run build"
echo "  • Preview build: npm run serve"
echo ""
echo "Deployment:"
echo "  📖 Read DEPLOYMENT.md for production setup"
echo "  🚀 or run: sudo ./scripts/deploy.sh (on your server)"
