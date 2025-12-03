# n8n-node-pleasanter

[n8n](https://n8n.io/) 用の [Pleasanter](https://pleasanter.org/) API カスタムノードです。

## 機能

Pleasanter API を使用して、以下の操作を実行できます：

| 操作 | 説明 |
|------|------|
| **Get** | レコードを取得（Viewフィルタ対応） |
| **Create** | 新規レコードを作成 |
| **Update** | 既存レコードを更新 |
| **Delete** | レコードを削除 |

## インストール

### npm からインストール

```bash
npm install n8n-nodes-pleasanter
```

### 手動インストール

1. このリポジトリをクローン：
   ```bash
   git clone https://github.com/pleasanter-developer-community/n8n-node-pleasanter.git
   ```

2. 依存関係をインストールしてビルド：
   ```bash
   cd custom-node/n8n-node-pleasanter
   npm install
   npm run build
   ```

3. n8n のカスタムノードディレクトリにリンクまたはコピー

### Docker での使用

`docker-compose.yml` を使用して n8n を起動できます：

```bash
docker-compose up -d
```

その後、http://localhost:5678 でアクセスできます。

## 設定

### 認証情報（Credentials）

Pleasanter ノードを使用するには、以下の認証情報を設定する必要があります：

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| **Base URL** | Pleasanter サーバーの URL | `https://pleasanter.example.com` |
| **API Key** | Pleasanter の API キー | ユーザー設定から取得 |
| **API Version** | API バージョン | `1.1`（推奨） |

## 使用例

### レコードの取得（Get）

サイトID または レコードID を指定してレコードを取得します。

**パラメータ：**
- `Site ID or Record ID`: テーブルのサイトIDまたは個別レコードのID
- `View (JSON)`: フィルタ条件（オプション）

**View の例：**
```json
{
  "ColumnFilterHash": {
    "Status": "[100]"
  }
}
```

### レコードの作成（Create）

**パラメータ：**
- `Site ID`: レコードを作成するテーブルのサイトID
- `Title`: レコードのタイトル
- `Body`: レコードの本文
- `Additional Fields`: Status, Manager, Owner, ClassHash など

### レコードの更新（Update）

**パラメータ：**
- `Record ID`: 更新するレコードのID
- `Update Fields`: 更新するフィールド

### レコードの削除（Delete）

**パラメータ：**
- `Record ID`: 削除するレコードのID

## 開発

### ビルド

```bash
cd custom-node/n8n-node-pleasanter
npm install
npm run build
```

### Lint

```bash
npm run lint
```

### ウォッチモード

```bash
npm run build:watch
```

## プロジェクト構造

```
n8n-node-pleasanter/
├── custom-node/n8n-node-pleasanter/
│   ├── credentials/
│   │   └── PleasanterApi.credentials.ts
│   ├── nodes/Pleasanter/
│   │   ├── Pleasanter.node.ts
│   │   ├── GenericFunctions.ts
│   │   ├── PleasanterInterface.ts
│   │   └── descriptions/
│   │       ├── ItemGetDescription.ts
│   │       ├── ItemCreateDescription.ts
│   │       ├── ItemUpdateDescription.ts
│   │       └── ItemDeleteDescription.ts
│   ├── icons/
│   │   └── pleasanter.svg
│   └── package.json
├── docker-compose.yml
└── spec.md
```

## ライセンス

[MIT](custom-node/n8n-node-pleasanter/LICENSE.md)

## リンク

- [Pleasanter 公式サイト](https://pleasanter.org/)
- [Pleasanter API マニュアル](https://pleasanter.org/manual/api)
- [n8n 公式サイト](https://n8n.io/)
- [n8n カスタムノード開発ガイド](https://docs.n8n.io/integrations/creating-nodes/)
