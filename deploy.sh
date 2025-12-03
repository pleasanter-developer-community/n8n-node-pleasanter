#!/bin/bash
# デプロイスクリプト（Linux/Mac用）

# ビルド
cd custom-node/n8n-node-pleasanter
npm run build

# デプロイ先をクリーンアップ
rm -rf ../../volume/nodes/n8n-nodes-pleasanter/dist

# ビルド成果物をコピー
cp -r dist ../../volume/nodes/n8n-nodes-pleasanter/
cp package.json ../../volume/nodes/n8n-nodes-pleasanter/

echo "デプロイ完了: volume/nodes/n8n-nodes-pleasanter/"
