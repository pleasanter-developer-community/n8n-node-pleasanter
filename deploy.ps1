# デプロイスクリプト（Windows PowerShell用）

# ビルド
Push-Location custom-node\n8n-node-pleasanter
npm run build
Pop-Location

# デプロイ先をクリーンアップ
if (Test-Path "volume\nodes\n8n-nodes-pleasanter\dist") {
    Remove-Item -Recurse -Force "volume\nodes\n8n-nodes-pleasanter\dist"
}

# ビルド成果物をコピー
Copy-Item -Recurse "custom-node\n8n-node-pleasanter\dist" "volume\nodes\n8n-nodes-pleasanter\"
Copy-Item "custom-node\n8n-node-pleasanter\package.json" "volume\nodes\n8n-nodes-pleasanter\"

Write-Host "デプロイ完了: volume/nodes/n8n-nodes-pleasanter/" -ForegroundColor Green
