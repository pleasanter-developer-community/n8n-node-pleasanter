# n8n-node-pleasanter

[n8n](https://n8n.io/) 用の [Pleasanter](https://pleasanter.org/) API カスタムノードです。

> **Note**: このプロジェクトは [spec.md](./spec.md) の仕様書に基づいて実装されています。

## 機能概要

Pleasanter は、ノーコード・ローコードで業務アプリケーションを作成できるオープンソースの Web データベースです。本カスタムノードを使用することで、n8n のワークフローから Pleasanter のデータを操作できます。

### 対応操作

| 操作 | APIエンドポイント | 説明 |
|------|------------------|------|
| **Get** | `POST /api/items/{id}/get` | レコードを取得（View フィルタ・ソート対応） |
| **Create** | `POST /api/items/{siteId}/create` | 新規レコードを作成 |
| **Update** | `POST /api/items/{recordId}/update` | 既存レコードを更新 |
| **Delete** | `POST /api/items/{recordId}/delete` | レコードを削除 |

### 対応フィールド

- **基本フィールド**: Title, Body, Status, Manager, Owner, StartTime, CompletionTime, WorkValue, ProgressRate, Comments, Locked
- **拡張フィールド**: ClassHash (ClassA-Z), NumHash (NumA-Z), DateHash (DateA-Z), DescriptionHash (DescriptionA-Z), CheckHash (CheckA-Z)

## インストール

### npm からインストール（予定）

```bash
npm install n8n-nodes-pleasanter
```

### 手動インストール

1. このリポジトリをクローン：
   ```bash
   git clone https://github.com/pleasanter-developer-community/n8n-node-pleasanter.git
   cd n8n-node-pleasanter
   ```

2. 依存関係をインストールしてビルド：
   ```bash
   cd custom-node/n8n-node-pleasanter
   npm install
   npm run build
   ```

3. ビルド成果物（`dist/`）を n8n のカスタムノードディレクトリにコピー

### Docker での使用

同梱の `docker-compose.yml` を使用して n8n を起動できます：

```bash
docker-compose up -d
```

ブラウザで http://localhost:5678 にアクセスしてください。

## 使い方

### 1. 認証情報の設定

Pleasanter ノードを使用する前に、認証情報（Credentials）を設定する必要があります。

1. n8n で「Credentials」→「Add Credential」を選択
2. 「Pleasanter API」を検索して選択
3. 以下の情報を入力：

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| **Base URL** | Pleasanter サーバーの URL | `https://pleasanter.example.com` |
| **API Key** | Pleasanter の API キー | ユーザー設定画面から取得 |
| **API Version** | API バージョン | `1.1`（推奨） |

### 2. ノードの使用

ワークフローに「Pleasanter」ノードを追加し、操作を選択します。

#### レコードの取得（Get）

サイト ID を指定してテーブル内の全レコードを取得、または レコード ID を指定して単一レコードを取得します。

```
パラメータ:
- Site ID or Record ID: テーブルのサイト ID またはレコード ID
- View (JSON): フィルター条件（オプション）
```

**View の例** - ステータスが 100 のレコードのみ取得：
```json
{
  "ColumnFilterHash": {
    "Status": "[100]"
  }
}
```

**View の例** - 作成日で降順ソート：
```json
{
  "ColumnSorterHash": {
    "CreatedTime": "desc"
  }
}
```

#### レコードの作成（Create）

```
パラメータ:
- Site ID: レコードを作成するテーブルのサイト ID
- Title: レコードのタイトル
- Body: レコードの本文
- Additional Fields: Status, Manager, Owner, ClassHash など
```

#### レコードの更新（Update）

```
パラメータ:
- Record ID: 更新するレコードの ID
- Update Fields: 更新するフィールドの値
```

#### レコードの削除（Delete）

```
パラメータ:
- Record ID: 削除するレコードの ID
```

### 3. ワークフロー例

#### 例1: Pleasanter から Slack に通知

```
[Schedule Trigger] → [Pleasanter: Get] → [IF: 新規レコード?] → [Slack: Send Message]
```

#### 例2: フォーム送信から Pleasanter にレコード作成

```
[Webhook] → [Pleasanter: Create] → [Respond to Webhook]
```

## プロジェクト構造

```
n8n-node-pleasanter/
├── custom-node/n8n-node-pleasanter/
│   ├── credentials/
│   │   └── PleasanterApi.credentials.ts  # 認証情報定義
│   ├── nodes/Pleasanter/
│   │   ├── Pleasanter.node.ts            # メインノードクラス
│   │   ├── GenericFunctions.ts           # API 呼び出し共通関数
│   │   ├── PleasanterInterface.ts        # 型定義
│   │   └── descriptions/                 # 操作別 UI 定義
│   │       ├── ItemGetDescription.ts
│   │       ├── ItemCreateDescription.ts
│   │       ├── ItemUpdateDescription.ts
│   │       ├── ItemDeleteDescription.ts
│   │       └── index.ts
│   ├── icons/
│   │   └── pleasanter.svg                # ノードアイコン
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml                    # Docker 環境設定
├── spec.md                               # 実装仕様書
└── README.md
```

## 開発

### 前提条件

- Node.js 18 以上
- npm

### ビルド

```bash
cd custom-node/n8n-node-pleasanter
npm install
npm run build
```

### Lint

```bash
npm run lint
npm run lint:fix  # 自動修正
```

### ウォッチモード（開発時）

```bash
npm run build:watch
```

## 技術仕様

本プロジェクトは以下の仕様・ガイドラインに基づいて実装されています：

- **設計仕様書**: [spec.md](./spec.md)
- **Pleasanter API**: [OpenAPI 仕様](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)
- **n8n カスタムノード**: [開発ガイド](https://docs.n8n.io/integrations/creating-nodes/)
- **ベーステンプレート**: [n8n-nodes-starter](https://github.com/n8n-io/n8n-nodes-starter)

### API 認証方式

Pleasanter API は、一般的なヘッダー認証ではなく、リクエストボディに API キーを含める方式を採用しています。本ノードはこの仕様に対応した専用の API リクエスト関数を実装しています。

```typescript
// リクエストボディに ApiKey と ApiVersion を自動追加
{
  "ApiVersion": "1.1",
  "ApiKey": "your-api-key",
  // ...その他のパラメータ
}
```

## ライセンス

[MIT](custom-node/n8n-node-pleasanter/LICENSE.md)

## コントリビュート

Issue や Pull Request を歓迎します。

## リンク

- [Pleasanter 公式サイト](https://pleasanter.org/)
- [Pleasanter API マニュアル](https://pleasanter.org/manual/api)
- [n8n 公式サイト](https://n8n.io/)
- [n8n ドキュメント](https://docs.n8n.io/)

