# Deployment Preparation Script for My PCC Admin Dashboard

Write-Host "Starting deployment preparation..." -ForegroundColor Cyan

# 1. Clean up build artifacts
if (Test-Path ".next") {
    Write-Host "Removing old build artifacts..."
    Remove-Item -Recurse -Force ".next"
}

# 2. Verify .env.example
if (!(Test-Path ".env.example")) {
    Write-Host "Creating .env.example..."
    Get-Content ".env" | Where-Object { $_ -notmatch "DATABASE_URL=" -and $_ -notmatch "NEXT_PUBLIC_" } > .env.example
    Add-Content ".env.example" "DATABASE_URL=\"mysql://user:password@host:port/dbname\""
}

# 3. Final check for node_modules in gitignore
$gitignore = Get-Content ".gitignore"
if ($gitignore -notcontains "/node_modules") {
    Write-Host "Adding /node_modules to .gitignore..."
    Add-Content ".gitignore" "`n/node_modules"
}

Write-Host "`nPreparation complete!" -ForegroundColor Green
Write-Host "Next steps once Git is installed:" -ForegroundColor Yellow
Write-Host "1. git init"
Write-Host "2. git add ."
Write-Host "3. git commit -m 'Initial commit'"
Write-Host "4. Create repo on GitHub and follow push instructions."
