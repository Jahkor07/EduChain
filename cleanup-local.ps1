# EduChain - Hardhat Build Artifacts Cleanup Script (PowerShell)
# This script removes all Hardhat build outputs and related artifacts

Write-Host "Starting EduChain build artifacts cleanup..." -ForegroundColor Cyan

# Function to safely remove directory if it exists
function Remove-DirectoryIfExists {
    param([string]$Path)
    if (Test-Path $Path -PathType Container) {
        Write-Host "  Removing directory: $Path" -ForegroundColor Yellow
        Remove-Item -Path $Path -Recurse -Force
        Write-Host "  Successfully removed: $Path" -ForegroundColor Green
    } else {
        Write-Host "  Directory does not exist, skipping: $Path" -ForegroundColor Gray
    }
}

# Function to safely remove file if it exists
function Remove-FileIfExists {
    param([string]$Path)
    if (Test-Path $Path -PathType Leaf) {
        Write-Host "  Removing file: $Path" -ForegroundColor Yellow
        Remove-Item -Path $Path -Force
        Write-Host "  Successfully removed: $Path" -ForegroundColor Green
    } else {
        Write-Host "  File does not exist, skipping: $Path" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Checking for Hardhat build artifacts..." -ForegroundColor Cyan

# Remove Hardhat build directories
Write-Host ""
Write-Host "Removing Hardhat build directories:" -ForegroundColor Cyan
Remove-DirectoryIfExists "artifacts"
Remove-DirectoryIfExists "cache"
Remove-DirectoryIfExists "deployments"
Remove-DirectoryIfExists "build"

# Remove Hardhat build files
Write-Host ""
Write-Host "Removing Hardhat build files:" -ForegroundColor Cyan
Remove-FileIfExists "artifacts.lnk"
Remove-DirectoryIfExists "typechain-types"

# Remove TypeScript build outputs
Write-Host ""
Write-Host "Removing TypeScript build outputs:" -ForegroundColor Cyan
Remove-DirectoryIfExists "dist"
Remove-DirectoryIfExists "typechain"

# Remove other common build artifacts
Write-Host ""
Write-Host "Removing other build artifacts:" -ForegroundColor Cyan
Remove-DirectoryIfExists ".hardhat"
Remove-DirectoryIfExists "coverage"
Remove-FileIfExists "coverage.json"

Write-Host ""
Write-Host "Cleanup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary of removed items:" -ForegroundColor Cyan
Write-Host "  - Hardhat artifacts directory" -ForegroundColor White
Write-Host "  - Hardhat cache directory" -ForegroundColor White
Write-Host "  - Hardhat deployments directory" -ForegroundColor White
Write-Host "  - Build directory" -ForegroundColor White
Write-Host "  - Build artifacts files" -ForegroundColor White
Write-Host "  - TypeScript build outputs" -ForegroundColor White
Write-Host ""
Write-Host "To rebuild your project:" -ForegroundColor Cyan
Write-Host "  - Run 'npx hardhat compile' to recompile contracts" -ForegroundColor White
Write-Host "  - Run 'npx hardhat deploy' to redeploy contracts" -ForegroundColor White
Write-Host "  - Run 'npm run build' to rebuild frontend" -ForegroundColor White
Write-Host ""
Write-Host "Your project is now clean and ready for fresh builds!" -ForegroundColor Green



Write-Host "Starting EduChain build artifacts cleanup..." -ForegroundColor Cyan

# Function to safely remove directory if it exists
function Remove-DirectoryIfExists {
    param([string]$Path)
    if (Test-Path $Path -PathType Container) {
        Write-Host "  Removing directory: $Path" -ForegroundColor Yellow
        Remove-Item -Path $Path -Recurse -Force
        Write-Host "  Successfully removed: $Path" -ForegroundColor Green
    } else {
        Write-Host "  Directory does not exist, skipping: $Path" -ForegroundColor Gray
    }
}

# Function to safely remove file if it exists
function Remove-FileIfExists {
    param([string]$Path)
    if (Test-Path $Path -PathType Leaf) {
        Write-Host "  Removing file: $Path" -ForegroundColor Yellow
        Remove-Item -Path $Path -Force
        Write-Host "  Successfully removed: $Path" -ForegroundColor Green
    } else {
        Write-Host "  File does not exist, skipping: $Path" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Checking for Hardhat build artifacts..." -ForegroundColor Cyan

# Remove Hardhat build directories
Write-Host ""
Write-Host "Removing Hardhat build directories:" -ForegroundColor Cyan
Remove-DirectoryIfExists "artifacts"
Remove-DirectoryIfExists "cache"
Remove-DirectoryIfExists "deployments"
Remove-DirectoryIfExists "build"

# Remove Hardhat build files
Write-Host ""
Write-Host "Removing Hardhat build files:" -ForegroundColor Cyan
Remove-FileIfExists "artifacts.lnk"
Remove-DirectoryIfExists "typechain-types"

# Remove TypeScript build outputs
Write-Host ""
Write-Host "Removing TypeScript build outputs:" -ForegroundColor Cyan
Remove-DirectoryIfExists "dist"
Remove-DirectoryIfExists "typechain"

# Remove other common build artifacts
Write-Host ""
Write-Host "Removing other build artifacts:" -ForegroundColor Cyan
Remove-DirectoryIfExists ".hardhat"
Remove-DirectoryIfExists "coverage"
Remove-FileIfExists "coverage.json"

Write-Host ""
Write-Host "Cleanup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary of removed items:" -ForegroundColor Cyan
Write-Host "  - Hardhat artifacts directory" -ForegroundColor White
Write-Host "  - Hardhat cache directory" -ForegroundColor White
Write-Host "  - Hardhat deployments directory" -ForegroundColor White
Write-Host "  - Build directory" -ForegroundColor White
Write-Host "  - Build artifacts files" -ForegroundColor White
Write-Host "  - TypeScript build outputs" -ForegroundColor White
Write-Host ""
Write-Host "To rebuild your project:" -ForegroundColor Cyan
Write-Host "  - Run 'npx hardhat compile' to recompile contracts" -ForegroundColor White
Write-Host "  - Run 'npx hardhat deploy' to redeploy contracts" -ForegroundColor White
Write-Host "  - Run 'npm run build' to rebuild frontend" -ForegroundColor White
Write-Host ""
Write-Host "Your project is now clean and ready for fresh builds!" -ForegroundColor Green



Write-Host "Starting EduChain build artifacts cleanup..." -ForegroundColor Cyan

# Function to safely remove directory if it exists
function Remove-DirectoryIfExists {
    param([string]$Path)
    if (Test-Path $Path -PathType Container) {
        Write-Host "  Removing directory: $Path" -ForegroundColor Yellow
        Remove-Item -Path $Path -Recurse -Force
        Write-Host "  Successfully removed: $Path" -ForegroundColor Green
    } else {
        Write-Host "  Directory does not exist, skipping: $Path" -ForegroundColor Gray
    }
}

# Function to safely remove file if it exists
function Remove-FileIfExists {
    param([string]$Path)
    if (Test-Path $Path -PathType Leaf) {
        Write-Host "  Removing file: $Path" -ForegroundColor Yellow
        Remove-Item -Path $Path -Force
        Write-Host "  Successfully removed: $Path" -ForegroundColor Green
    } else {
        Write-Host "  File does not exist, skipping: $Path" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Checking for Hardhat build artifacts..." -ForegroundColor Cyan

# Remove Hardhat build directories
Write-Host ""
Write-Host "Removing Hardhat build directories:" -ForegroundColor Cyan
Remove-DirectoryIfExists "artifacts"
Remove-DirectoryIfExists "cache"
Remove-DirectoryIfExists "deployments"
Remove-DirectoryIfExists "build"

# Remove Hardhat build files
Write-Host ""
Write-Host "Removing Hardhat build files:" -ForegroundColor Cyan
Remove-FileIfExists "artifacts.lnk"
Remove-DirectoryIfExists "typechain-types"

# Remove TypeScript build outputs
Write-Host ""
Write-Host "Removing TypeScript build outputs:" -ForegroundColor Cyan
Remove-DirectoryIfExists "dist"
Remove-DirectoryIfExists "typechain"

# Remove other common build artifacts
Write-Host ""
Write-Host "Removing other build artifacts:" -ForegroundColor Cyan
Remove-DirectoryIfExists ".hardhat"
Remove-DirectoryIfExists "coverage"
Remove-FileIfExists "coverage.json"

Write-Host ""
Write-Host "Cleanup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary of removed items:" -ForegroundColor Cyan
Write-Host "  - Hardhat artifacts directory" -ForegroundColor White
Write-Host "  - Hardhat cache directory" -ForegroundColor White
Write-Host "  - Hardhat deployments directory" -ForegroundColor White
Write-Host "  - Build directory" -ForegroundColor White
Write-Host "  - Build artifacts files" -ForegroundColor White
Write-Host "  - TypeScript build outputs" -ForegroundColor White
Write-Host ""
Write-Host "To rebuild your project:" -ForegroundColor Cyan
Write-Host "  - Run 'npx hardhat compile' to recompile contracts" -ForegroundColor White
Write-Host "  - Run 'npx hardhat deploy' to redeploy contracts" -ForegroundColor White
Write-Host "  - Run 'npm run build' to rebuild frontend" -ForegroundColor White
Write-Host ""
Write-Host "Your project is now clean and ready for fresh builds!" -ForegroundColor Green

