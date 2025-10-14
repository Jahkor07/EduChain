# EduChain Backend → Server Migration Script
# This script automates the renaming of backend/ to server/ and updates all references

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   EduChain: Backend → Server Migration" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all Node processes
Write-Host "Step 1: Stopping all Node.js processes..." -ForegroundColor Yellow
try {
    taskkill /F /IM node.exe 2>$null
    Write-Host "✓ All Node.js processes stopped" -ForegroundColor Green
} catch {
    Write-Host "⚠ No Node.js processes running" -ForegroundColor Yellow
}
Start-Sleep -Seconds 2

# Step 2: Delete old server folder if it exists
Write-Host "`nStep 2: Removing old server folder..." -ForegroundColor Yellow
if (Test-Path "server") {
    Remove-Item -Path "server" -Recurse -Force
    Write-Host "✓ Old server folder deleted" -ForegroundColor Green
} else {
    Write-Host "⚠ No old server folder found" -ForegroundColor Yellow
}

# Step 3: Rename backend to server
Write-Host "`nStep 3: Renaming backend/ to server/..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Rename-Item -Path "backend" -NewName "server"
    Write-Host "✓ Folder renamed: backend → server" -ForegroundColor Green
} else {
    Write-Host "✗ backend folder not found!" -ForegroundColor Red
    exit 1
}

# Step 4: Update root package.json
Write-Host "`nStep 4: Updating root package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw
    $packageJson = $packageJson -replace 'cd backend', 'cd server'
    $packageJson = $packageJson -replace '"backend/', '"server/'
    $packageJson | Set-Content "package.json"
    Write-Host "✓ Root package.json updated" -ForegroundColor Green
} else {
    Write-Host "⚠ Root package.json not found" -ForegroundColor Yellow
}

# Step 5: Update README.md
Write-Host "`nStep 5: Updating README.md..." -ForegroundColor Yellow
if (Test-Path "README.md") {
    $readme = Get-Content "README.md" -Raw
    $readme = $readme -replace 'backend/', 'server/'
    $readme = $readme -replace 'cd backend', 'cd server'
    $readme | Set-Content "README.md"
    Write-Host "✓ README.md updated" -ForegroundColor Green
} else {
    Write-Host "⚠ README.md not found" -ForegroundColor Yellow
}

# Step 6: Update documentation files
Write-Host "`nStep 6: Updating documentation files..." -ForegroundColor Yellow
$docFiles = Get-ChildItem -Path "." -Filter "*.md" -Recurse -File | Where-Object { $_.FullName -notlike "*node_modules*" }
$updatedCount = 0
foreach ($file in $docFiles) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'backend/', 'server/'
    $newContent = $newContent -replace 'cd backend', 'cd server'
    if ($content -ne $newContent) {
        $newContent | Set-Content $file.FullName
        $updatedCount++
    }
}
Write-Host "✓ Updated $updatedCount documentation files" -ForegroundColor Green

# Step 7: Create docs folder and move root documentation
Write-Host "`nStep 7: Organizing documentation..." -ForegroundColor Yellow
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" | Out-Null
}
$rootDocs = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" }
foreach ($doc in $rootDocs) {
    Move-Item -Path $doc.FullName -Destination "docs\" -Force
}
Write-Host "✓ Documentation organized in docs/ folder" -ForegroundColor Green

# Step 8: Verify structure
Write-Host "`nStep 8: Verifying new structure..." -ForegroundColor Yellow
$checks = @(
    @{Path="server"; Name="Server folder"},
    @{Path="server/index.js"; Name="Server entry point"},
    @{Path="server/package.json"; Name="Server package.json"},
    @{Path="client"; Name="Client folder"},
    @{Path="client/package.json"; Name="Client package.json"},
    @{Path="docs"; Name="Documentation folder"}
)

$allGood = $true
foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "  ✓ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($check.Name) - NOT FOUND" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "   ✅ Migration Completed Successfully!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. cd server && npm start      # Start backend" -ForegroundColor White
    Write-Host "  2. cd client && npm start      # Start frontend" -ForegroundColor White
    Write-Host "  3. Test all features" -ForegroundColor White
} else {
    Write-Host "   ⚠ Migration completed with warnings" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please check the missing items above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Project structure:" -ForegroundColor Cyan
Write-Host "  EduChain/" -ForegroundColor White
Write-Host "  ├── client/          # Frontend React app" -ForegroundColor White
Write-Host "  ├── server/          # Backend Express app (RENAMED)" -ForegroundColor Green
Write-Host "  ├── contracts/       # Smart contracts" -ForegroundColor White
Write-Host "  ├── scripts/         # Hardhat scripts" -ForegroundColor White
Write-Host "  ├── docs/            # Documentation" -ForegroundColor White
Write-Host "  ├── package.json     # Root package (UPDATED)" -ForegroundColor Green
Write-Host "  └── README.md        # Project README (UPDATED)" -ForegroundColor Green
Write-Host ""











