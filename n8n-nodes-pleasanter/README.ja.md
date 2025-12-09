# n8n-nodes-pleasanter

n8n用のPleasanter APIカスタムノードです。

[Pleasanter OpenAPI仕様](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)に準拠して実装されています。

> 📖 [English README](./README.md)

## インストール

### コミュニティノードとして

1. n8nの設定 > Community nodes に移動
2. `n8n-nodes-pleasanter` を検索してインストール

### 手動インストール

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-pleasanter
```

## 機能

Pleasanter APIを通じて以下の操作が可能です：

| 操作 | 説明 |
|------|------|
| **Get** | レコードの取得（単一/複数） |
| **Create** | レコードの作成 |
| **Update** | レコードの更新 |
| **Delete** | レコードの削除 |

## クレデンシャル設定

| パラメータ | 説明 | 例 |
|------------|------|-----|
| **Base URL** | PleasanterサーバーのURL | `https://your-pleasanter.com` |
| **API Key** | Pleasanter APIキー | - |
| **API Version** | APIバージョン | `1.0` または `1.1` |

## 使用方法

### レコード取得 (Get)

サイトIDまたはレコードIDを指定してレコードを取得します。

**主要なオプション:**
- `Offset`: ページネーション用オフセット
- `Search`: 検索キーワード
- `ColumnFilterHash`: 列フィルタ条件
- `ColumnSorterHash`: ソート条件

### レコード作成 (Create)

サイトIDを指定して新しいレコードを作成します。

**設定可能なフィールド:**
- `Title`, `Body`: 基本項目
- `Status`, `Manager`, `Owner`: ステータス・担当者
- `ClassHash`, `NumHash`, `DateHash`: 分類・数値・日付項目

### レコード更新 (Update)

レコードIDを指定して既存レコードを更新します。

### レコード削除 (Delete)

レコードIDを指定してレコードを削除します。

## リンク

- [Pleasanter公式サイト](https://pleasanter.org/)
- [Pleasanter OpenAPI仕様](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)
- [n8n公式サイト](https://n8n.io/)
- [GitHubリポジトリ](https://github.com/pleasanter-developer-community/n8n-node-pleasanter)

## ライセンス

MIT
