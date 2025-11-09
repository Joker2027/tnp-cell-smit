# PowerShell Commands for T&P Cell Setup
# Windows-specific commands for easy copy-paste

# ============================================
# INITIAL SETUP
# ============================================

# 1. Navigate to project directory
cd "C:\Users\Shlok\OneDrive\Desktop\My WorkSpace\pbl"

# 2. Install all dependencies
npm install

# 3. Create environment file from example
Copy-Item .env.local.example .env.local

# 4. Open .env.local in default editor
notepad .env.local

# ============================================
# DEVELOPMENT COMMANDS
# ============================================

# Start development server
npm run dev

# Start development server on different port
$env:PORT=3001; npm run dev

# Build for production (test locally)
npm run build

# Run production build locally
npm start

# Run TypeScript type checking
npx tsc --noEmit

# Run linter
npm run lint

# Fix linting errors automatically
npm run lint -- --fix

# ============================================
# GIT COMMANDS
# ============================================

# Initialize git repository
git init

# Add all files to staging
git add .

# Commit with message
git commit -m "Initial commit - T&P Cell Management System"

# Add remote repository (replace with your URL)
git remote add origin https://github.com/yourusername/tnp-cell.git

# Push to GitHub
git push -u origin main

# Check git status
git status

# View commit history
git log --oneline

# ============================================
# ENVIRONMENT MANAGEMENT
# ============================================

# Create .env.local with PowerShell
@"
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath .env.local -Encoding utf8

# View environment variables
Get-Content .env.local

# Check if .env.local exists
Test-Path .env.local

# ============================================
# TROUBLESHOOTING COMMANDS
# ============================================

# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev

# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# List all installed packages
npm list --depth=0

# Update all packages to latest
npm update

# Check for outdated packages
npm outdated

# ============================================
# FILE OPERATIONS
# ============================================

# Create new component file
New-Item -Path "components\ui\my-component.tsx" -ItemType File -Force

# Create new page
New-Item -Path "app\my-page\page.tsx" -ItemType File -Force

# View file contents
Get-Content "app\page.tsx"

# Search for text in files
Select-String -Path "app\**\*.tsx" -Pattern "useRouter"

# Count lines of code
(Get-ChildItem -Path . -Include *.tsx,*.ts,*.css -Recurse | Get-Content).Count

# ============================================
# SUPABASE COMMANDS (if using Supabase CLI)
# ============================================

# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate TypeScript types from database
supabase gen types typescript --linked > lib\types\supabase.ts

# Pull database schema
supabase db pull

# Push database migrations
supabase db push

# Reset local database
supabase db reset

# ============================================
# DEPLOYMENT HELPERS
# ============================================

# Test production build
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    npm start
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}

# Create deployment package
npm run build
Compress-Archive -Path .next,public,package.json,next.config.js -DestinationPath deployment.zip

# ============================================
# UTILITY FUNCTIONS
# ============================================

# Function to start dev server and open browser
function Start-DevServer {
    Start-Process "http://localhost:3000"
    npm run dev
}

# Function to check project health
function Test-ProjectHealth {
    Write-Host "Checking Node.js..." -ForegroundColor Yellow
    node --version
    
    Write-Host "`nChecking npm..." -ForegroundColor Yellow
    npm --version
    
    Write-Host "`nChecking dependencies..." -ForegroundColor Yellow
    if (Test-Path node_modules) {
        Write-Host "✅ node_modules exists" -ForegroundColor Green
    } else {
        Write-Host "❌ node_modules missing - run 'npm install'" -ForegroundColor Red
    }
    
    Write-Host "`nChecking .env.local..." -ForegroundColor Yellow
    if (Test-Path .env.local) {
        Write-Host "✅ .env.local exists" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.local missing - copy from .env.local.example" -ForegroundColor Red
    }
    
    Write-Host "`nChecking git..." -ForegroundColor Yellow
    if (Test-Path .git) {
        Write-Host "✅ Git initialized" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Git not initialized - run 'git init'" -ForegroundColor Yellow
    }
}

# Function to clean project
function Clear-ProjectCache {
    Write-Host "Cleaning project..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Write-Host "✅ Cache cleared!" -ForegroundColor Green
    Write-Host "Run 'npm install' to reinstall dependencies" -ForegroundColor Cyan
}

# ============================================
# QUICK SETUP SCRIPT
# ============================================

function Initialize-TNPProject {
    Write-Host "🚀 Setting up T&P Cell Management System..." -ForegroundColor Cyan
    
    # Check Node.js
    Write-Host "`n1. Checking Node.js installation..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js $nodeVersion installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js not found! Install from https://nodejs.org" -ForegroundColor Red
        return
    }
    
    # Install dependencies
    Write-Host "`n2. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        return
    }
    
    # Create .env.local if not exists
    Write-Host "`n3. Checking environment file..." -ForegroundColor Yellow
    if (-not (Test-Path .env.local)) {
        Copy-Item .env.local.example .env.local
        Write-Host "✅ Created .env.local from example" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env.local with your Supabase credentials!" -ForegroundColor Yellow
        notepad .env.local
    } else {
        Write-Host "✅ .env.local already exists" -ForegroundColor Green
    }
    
    # Initialize git if not exists
    Write-Host "`n4. Checking Git repository..." -ForegroundColor Yellow
    if (-not (Test-Path .git)) {
        git init
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "✅ Git already initialized" -ForegroundColor Green
    }
    
    Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Configure .env.local with your Supabase credentials" -ForegroundColor White
    Write-Host "2. Run 'npm run dev' to start development server" -ForegroundColor White
    Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
}

# ============================================
# USAGE EXAMPLES
# ============================================

# To use these functions, source this file in your PowerShell session:
# . .\scripts.ps1

# Then you can run:
# Initialize-TNPProject       # Complete setup
# Test-ProjectHealth          # Check project status
# Clear-ProjectCache          # Clean and reset
# Start-DevServer             # Start dev server and open browser

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║     T&P Cell Management System - PowerShell Commands          ║
║                                                                 ║
║  Available Functions:                                          ║
║  • Initialize-TNPProject  - Complete project setup             ║
║  • Test-ProjectHealth     - Check project status               ║
║  • Clear-ProjectCache     - Clean project files                ║
║  • Start-DevServer        - Start dev and open browser         ║
║                                                                 ║
║  Quick Commands:                                               ║
║  • npm run dev            - Start development server           ║
║  • npm run build          - Build for production               ║
║  • npm start              - Run production server              ║
║                                                                 ║
║  Documentation:                                                ║
║  • README.md              - Project overview                   ║
║  • QUICKSTART.md          - 5-minute setup guide               ║
║  • SETUP.md               - Detailed setup instructions        ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Example: Auto-run project health check
# Uncomment the line below to run health check when this file is loaded
# Test-ProjectHealth
