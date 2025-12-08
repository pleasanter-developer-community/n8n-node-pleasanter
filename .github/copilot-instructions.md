# Copilot Instructions - n8n Pleasanter Custom Node

## プロジェクト概要

n8n用のPleasanter APIカスタムノードプロジェクト。

- **実装言語**: TypeScript
- **テスト環境**: Docker

## プロジェクト構成

n8n本体はDockerコンテナで起動し、カスタムノードのテスト環境として利用する。

```
project-root/
├── docker-compose.yml             # n8n起動用Docker設定
├── n8n-nodes-pleasanter/          # カスタムノードのソースコード
│   └── dist/                      # ビルド出力ディレクトリ／カスタムノード読み込み先としてマウント
└── volume/                        # n8nデータのdocker volumeマウント先
           
```

## 設計方針

以下のドキュメントを基準として設計・実装を行う。

### 1. Pleasanter OpenAPI定義

- **参照URL**: https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml

#### 必須ルール

- Pleasanter APIに関する仕様は、このドキュメントを正式な仕様とすること
- このドキュメントに記載されていない仕様について、憶測で設計・実装を行わないこと

### 2. n8n開発ガイド

- **参照URL**: https://docs.n8n.io/integrations/creating-nodes/

#### 必須ルール
- n8nカスタムノードの設計、実装を行う際には必ず開発ガイドを参照すること
- 開発ガイドに記載されているベストプラクティス・推奨事項に従って実装を行うこと
- 拡張性・保守性を考慮したモジュール構成、ファイル構成とすること