#!/bin/bash

# Dragvertising Canva App - Quick Setup Script

echo "═══════════════════════════════════════════════════════════"
echo "   🎨 Dragvertising Canva App Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'ENVFILE'
DRAGVERTISING_API_URL=https://api.dragvertising.com
CANVA_APP_ID=your_app_id_here
ENVFILE
    echo "✅ .env file created"
    echo ""
    echo "⚠️  ACTION REQUIRED:"
    echo "   1. Create app at https://www.canva.com/developers/apps"
    echo "   2. Copy your App ID"
    echo "   3. Update CANVA_APP_ID in .env file"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Final instructions
echo "═══════════════════════════════════════════════════════════"
echo "   🎉 Setup Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Next Steps:"
echo ""
echo "1. Create Canva Developer Account:"
echo "   → https://www.canva.com/developers/"
echo ""
echo "2. Create New App:"
echo "   → https://www.canva.com/developers/apps"
echo "   → Development URL: http://localhost:8080"
echo ""
echo "3. Update .env file with your App ID"
echo ""
echo "4. Start development server:"
echo "   npm start"
echo ""
echo "5. Test in Canva:"
echo "   → https://www.canva.com/design?preview_app_id=YOUR_APP_ID"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "For complete documentation, see:"
echo "   → canva-app/README.md"
echo "   → docs/guides/CANVA_APPS_SDK_INTEGRATION.md"
echo ""
echo "Happy building! 🚀"
echo ""

