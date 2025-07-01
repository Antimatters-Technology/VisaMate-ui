# VisaMate Chrome Extension Build Script (PowerShell)

Write-Host "🔨 Building VisaMate Chrome Extension..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Type check
Write-Host "🔍 Running type check..." -ForegroundColor Cyan
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check failed. Please fix TypeScript errors." -ForegroundColor Red
    exit 1
}

# Build the extension
Write-Host "⚙️ Building extension..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed." -ForegroundColor Red
    exit 1
}

# Create icons directory if it doesn't exist
if (-not (Test-Path "dist\icons")) {
    New-Item -ItemType Directory -Path "dist\icons" -Force
    Write-Host "📁 Created icons directory. Please add your icon files (16x16, 32x32, 48x48, 128x128 PNG)." -ForegroundColor Yellow
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Add icon files to dist\icons\ directory"
Write-Host "2. Open Chrome and go to chrome://extensions/"
Write-Host "3. Enable 'Developer mode'"
Write-Host "4. Click 'Load unpacked' and select the 'dist' folder"
Write-Host ""
Write-Host "🎯 Extension ready for testing!" -ForegroundColor Green 