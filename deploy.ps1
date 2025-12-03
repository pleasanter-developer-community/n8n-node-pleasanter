# deploy.ps1 - Pleasanter NodeをビルドしてN8Nにデプロイするスクリプト

param(
    [switch]$SkipBuild,
    [switch]$Restart
)

$ErrorActionPreference = "Stop"

$scriptDir = $PSScriptRoot
$sourceDir = Join-Path $scriptDir "custom-node\n8n-node-pleasanter"
$deployDir = Join-Path $scriptDir "volume\custom-nodes\n8n-nodes-pleasanter"

Write-Host "=== Pleasanter Node Deploy Script ===" -ForegroundColor Cyan
Write-Host "Source Directory: $sourceDir"
Write-Host "Deploy Directory: $deployDir"

# ビルド
if (-not $SkipBuild) {
    Write-Host "`n[1/3] Building pleasanter-node..." -ForegroundColor Yellow
    Push-Location $sourceDir
    try {
        npm install
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed"
        }
        Write-Host "Build completed successfully!" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "`n[1/3] Skipping build (--SkipBuild specified)" -ForegroundColor Yellow
}

# デプロイディレクトリの準備
Write-Host "`n[2/3] Deploying to $deployDir..." -ForegroundColor Yellow

if (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null

# 必要なファイルをコピー
Copy-Item -Path (Join-Path $sourceDir "dist") -Destination $deployDir -Recurse
Copy-Item -Path (Join-Path $sourceDir "package.json") -Destination $deployDir

Write-Host "Deploy completed!" -ForegroundColor Green

# n8nコンテナの再起動
if ($Restart) {
    Write-Host "`n[3/3] Restarting n8n container..." -ForegroundColor Yellow
    Push-Location $scriptDir
    try {
        docker-compose restart n8n
        Write-Host "n8n container restarted!" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "`n[3/3] Skipping restart (use -Restart to restart n8n container)" -ForegroundColor Yellow
}

Write-Host "`n=== Deploy Complete ===" -ForegroundColor Cyan
Write-Host "To apply changes, restart n8n container:" -ForegroundColor White
Write-Host "  docker-compose restart n8n" -ForegroundColor Gray
