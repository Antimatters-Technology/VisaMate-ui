#!/bin/bash
# VisaMate Chrome Extension Build Script

echo "🔨 Building VisaMate Chrome Extension..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Type check
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix TypeScript errors."
    exit 1
fi

# Build the extension
echo "⚙️ Building extension..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed."
    exit 1
fi

# Create icons directory if it doesn't exist
if [ ! -d "dist/icons" ]; then
    mkdir -p dist/icons
    echo "📁 Created icons directory. Please add your icon files (16x16, 32x32, 48x48, 128x128 PNG)."
fi

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add icon files to dist/icons/ directory"
echo "2. Open Chrome and go to chrome://extensions/"
echo "3. Enable 'Developer mode'"
echo "4. Click 'Load unpacked' and select the 'dist' folder"
echo ""
echo "🎯 Extension ready for testing!" 