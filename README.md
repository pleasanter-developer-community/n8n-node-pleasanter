# n8n-nodes-pleasanter

n8n用のPleasanter APIカスタムノードです。

[Pleasanter OpenAPI仕様](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)に準拠して実装されています。

## 機能

Pleasanter APIを通じて以下の操作が可能です：

| 操作 | 説明 |
|------|------|
| **Get** | レコードの取得（単一/複数） |
| **Create** | レコードの作成 |
| **Update** | レコードの更新 |
| **Delete** | レコードの削除 |

## インストール

### コミュニティノードとして

1. n8nの設定 > Community nodes に移動
2. `n8n-nodes-pleasanter` を検索してインストール

### 手動インストール

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-pleasanter
```

### 開発環境

```bash
cd n8n-nodes-pleasanter
npm install
npm run build
```

## 設定

### クレデンシャル

| パラメータ | 説明 | 例 |
|------------|------|-----|
| **Base URL** | PleasanterサーバーのURL | `https://your-pleasanter.com` |
| **API Key** | Pleasanter APIキー | - |
| **API Version** | APIバージョン | `1.0` または `1.1` |

## 使用方法

### レコード取得 (Get)

サイトIDまたはレコードIDを指定してレコードを取得します。

#### ビューオプション

| パラメータ | 型 | 説明 |
|------------|------|------|
| Offset | number | ページネーション用オフセット |
| Incomplete | boolean | 未完了のレコードのみ取得 |
| Own | boolean | 自分が担当のレコードのみ取得 |
| NearCompletionTime | boolean | 期限が近いレコードのみ取得 |
| Delay | boolean | 遅延しているレコードのみ取得 |
| Overdue | boolean | 期限超過のレコードのみ取得 |
| Search | string | 検索キーワード |
| ColumnFilterHash | object | 列フィルタ条件（キーと値のペア） |
| ColumnSorterHash | object | ソート条件（項目名とasc/descのペア） |
| ColumnFilterSearchTypes | object | 項目ごとの検索方法 |
| ColumnFilterNegatives | array | 否定条件にする項目名の配列 |
| GridColumns | array | 返却される項目を制御する配列 |
| ApiDataType | string | APIの形式（Default/KeyValues） |
| ApiColumnKeyDisplayType | string | Keyの表示形式（LabelText/ColumnName） |
| ApiColumnValueDisplayType | string | Valueの表示形式（DisplayValue/Value/Text） |
| ApiColumnHash | object | 項目単位でKey/Valueの表示形式を指定 |
| MergeSessionViewFilters | boolean | セッションのフィルタ条件とマージ |
| MergeSessionViewSorters | boolean | セッションのソート条件とマージ |

#### レスポンスに含まれる情報

| フィールド | 説明 |
|------------|------|
| StatusCode | ステータスコード |
| LimitPerDate | 1日あたりのAPI呼び出し制限数 |
| LimitRemaining | 残りのAPI呼び出し可能数 |
| Offset | 現在のオフセット値 |
| PageSize | 1ページあたりの件数 |
| TotalCount | 総件数 |
| + レコードデータ | 各レコードのフィールド |

### レコード作成 (Create)

サイトIDを指定して新しいレコードを作成します。

#### レコードデータ

| パラメータ | 型 | 説明 |
|------------|------|------|
| Title | string | タイトル項目 |
| Body | string | 内容項目 |
| StartTime | datetime | 開始日時（期限付きテーブルのみ） |
| CompletionTime | datetime | 完了日時（期限付きテーブルのみ） |
| WorkValue | number | 作業量（期限付きテーブルのみ） |
| ProgressRate | number | 進捗率（期限付きテーブルのみ） |
| RemainingWorkValue | number | 残作業量（期限付きテーブルのみ） |
| Status | number | 状況項目 |
| Manager | number | 管理者のユーザID |
| Owner | number | 担当者のユーザID |
| Locked | boolean | ロック状態 |
| Comments | string | コメント項目 |
| ItemTitle | string | タイトル項目（別名） |
| ClassHash | object | 分類項目（ClassA〜ClassZ） |
| NumHash | object | 数値項目（NumA〜NumZ） |
| DateHash | object | 日付項目（DateA〜DateZ） |
| DescriptionHash | object | 説明項目（DescriptionA〜DescriptionZ） |
| CheckHash | object | チェック項目（CheckA〜CheckZ） |
| AttachmentsHash | object | 添付ファイル項目（AttachmentsA〜AttachmentsZ） |

#### プロセスオプション

| パラメータ | 型 | 説明 |
|------------|------|------|
| ProcessId | number | 実行するプロセスのID |
| ProcessIds | array | 実行する複数のプロセスIDの配列 |
| RecordPermissions | array | レコードのアクセス制御（例: User,10,1 / Dept,1,31） |

#### レスポンスに含まれる情報

| フィールド | 説明 |
|------------|------|
| StatusCode | ステータスコード |
| LimitPerDate | 1日あたりのAPI呼び出し制限数 |
| LimitRemaining | 残りのAPI呼び出し可能数 |
| Id | 作成されたレコードID |
| Message | 結果メッセージ |

### レコード更新 (Update)

レコードIDを指定して既存レコードを更新します。

設定可能なパラメータはレコード作成と同様です。

### レコード削除 (Delete)

レコードIDを指定してレコードを削除します。

#### レスポンスに含まれる情報

| フィールド | 説明 |
|------------|------|
| StatusCode | ステータスコード |
| LimitPerDate | 1日あたりのAPI呼び出し制限数 |
| LimitRemaining | 残りのAPI呼び出し可能数 |
| Id | 削除されたレコードID |
| Message | 結果メッセージ |

## プロジェクト構成

```
n8n-nodes-pleasanter/
├── nodes/Pleasanter/
│   ├── Pleasanter.node.ts          # メインノードクラス
│   ├── types.ts                    # 型定義
│   ├── pleasanter.svg              # アイコン
│   ├── transport/                  # API通信層
│   │   ├── index.ts
│   │   └── GenericFunctions.ts     # API関数
│   ├── actions/                    # 操作実行層
│   │   ├── index.ts
│   │   └── record/
│   │       ├── index.ts
│   │       ├── get.operation.ts
│   │       ├── create.operation.ts
│   │       ├── update.operation.ts
│   │       └── delete.operation.ts
│   └── descriptions/               # UIフィールド定義層
│       ├── index.ts
│       ├── CommonDescription.ts
│       ├── GetDescription.ts
│       ├── CreateDescription.ts
│       ├── UpdateDescription.ts
│       ├── DeleteDescription.ts
│       └── RecordDataDescription.ts
└── credentials/
    └── PleasanterApi.credentials.ts
```

## 開発

### Docker環境でテスト

```bash
# プロジェクトルートで
docker-compose up -d
```

n8nは http://localhost:5678 でアクセス可能です。

### ビルド

```bash
cd n8n-nodes-pleasanter
npm run build
```

### 監視モード

```bash
npm run dev
```

### リント

```bash
npm run lint
npm run lintfix
```

## 参考資料

- [Pleasanter OpenAPI仕様](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)
- [n8n開発ガイド](https://docs.n8n.io/integrations/creating-nodes/)
- [Pleasanter公式ドキュメント](https://pleasanter.org/manual)

## ライセンス

MIT
