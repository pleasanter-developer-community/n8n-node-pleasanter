# n8n カスタムノード - Pleasanter API 仕様書

## 概要

本ドキュメントは、n8n用のPleasanter APIカスタムノードを作成するための仕様書です。
AIエージェントがこの仕様に基づいてアプリケーションを自動生成することを目的としています。

---

## 1. プロジェクト構成

### 1.1 フォルダ構成

```
./
├── custom-node/
│   └── n8n-node-pleasanter/           # カスタムノードプロジェクト
│       ├── package.json               # パッケージ設定
│       ├── tsconfig.json              # TypeScript設定
│       ├── .eslintrc.js               # ESLint設定
│       ├── .prettierrc.js             # Prettier設定
│       ├── icons/
│       │   └── pleasanter.svg         # ノードアイコン
│       ├── nodes/
│       │   └── Pleasanter/
│       │       ├── Pleasanter.node.ts           # メインノードクラス
│       │       ├── PleasanterInterface.ts       # 型定義・インターフェース
│       │       ├── GenericFunctions.ts          # API呼び出し共通関数
│       │       └── descriptions/
│       │           ├── index.ts                 # descriptions エクスポート
│       │           ├── ItemGetDescription.ts    # Get操作のプロパティ定義
│       │           ├── ItemCreateDescription.ts # Create操作のプロパティ定義
│       │           ├── ItemUpdateDescription.ts # Update操作のプロパティ定義
│       │           └── ItemDeleteDescription.ts # Delete操作のプロパティ定義
│       ├── credentials/
│       │   └── PleasanterApi.credentials.ts     # 認証情報定義
│       └── dist/                                # ビルド出力先
├── docker-compose.yml                           # n8n実行環境構築用
├── volume/
│   └── custom-node/                             # カスタムノードのマウント先
└── spec.md                                      # 本仕様書
```

### 1.2 セットアップ手順

1. カスタムノードのひな形をClone
   ```bash
   mkdir -p custom-node
   cd custom-node
   git clone https://github.com/n8n-io/n8n-nodes-starter.git n8n-node-pleasanter
   cd n8n-node-pleasanter
   ```

2. 不要なサンプルコードの削除
   - `nodes/Example/` フォルダを削除
   - `nodes/GithubIssues/` フォルダを削除
   - `credentials/GithubIssuesApi.credentials.ts` を削除
   - `credentials/GithubIssuesOAuth2Api.credentials.ts` を削除
   - `icons/github.svg` を削除
   - `icons/github.dark.svg` を削除
   - `package.json` のサンプル参照を削除・更新

3. 依存関係のインストール
   ```bash
   npm install
   ```

4. ビルド
   ```bash
   npm run build
   ```

5. ビルド成果物を `./volume/custom-node` にコピー

---

## 2. 実装するファイルの詳細設計

### 2.1 クラス構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                        Credentials                               │
├─────────────────────────────────────────────────────────────────┤
│  PleasanterApi.credentials.ts                                   │
│  └── class PleasanterApi implements ICredentialType             │
│       - name: 'pleasanterApi'                                   │
│       - properties: baseUrl, apiKey, apiVersion                 │
│       - test: ICredentialTestRequest (認証テスト)               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          Node                                    │
├─────────────────────────────────────────────────────────────────┤
│  Pleasanter.node.ts                                             │
│  └── class Pleasanter implements INodeType                      │
│       - description: INodeTypeDescription                       │
│       - async execute(): Promise<INodeExecutionData[][]>        │
│                                                                  │
│  GenericFunctions.ts                                            │
│  └── pleasanterApiRequest()  - API呼び出し共通関数              │
│                                                                  │
│  PleasanterInterface.ts                                         │
│  └── interface IPleasanterCredentials                           │
│  └── interface IPleasanterRequestBody                           │
│  └── interface IPleasanterResponse                              │
│  └── interface IPleasanterView                                  │
│                                                                  │
│  descriptions/                                                   │
│  └── ItemGetDescription.ts      - Get操作のUI定義               │
│  └── ItemCreateDescription.ts   - Create操作のUI定義            │
│  └── ItemUpdateDescription.ts   - Update操作のUI定義            │
│  └── ItemDeleteDescription.ts   - Delete操作のUI定義            │
│  └── index.ts                   - エクスポート集約              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 PleasanterApi.credentials.ts

```typescript
import type {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
} from 'n8n-workflow';

export class PleasanterApi implements ICredentialType {
  name = 'pleasanterApi';
  displayName = 'Pleasanter API';
  documentationUrl = 'https://pleasanter.org/manual/api';
  
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://pleasanter.example.com',
      description: 'PleasanterサーバーのベースURL',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: '認証用APIキー',
      required: true,
    },
    {
      displayName: 'API Version',
      name: 'apiVersion',
      type: 'options',
      options: [
        { name: '1.1', value: '1.1' },
        { name: '1.0', value: '1.0' },
      ],
      default: '1.1',
      description: 'PleasanterのAPIバージョン',
    },
  ];

  // 認証テスト（サイトID=1でget実行）
  test: ICredentialTestRequest = {
    request: {
      method: 'POST',
      url: '={{$credentials.baseUrl}}/api/items/1/get',
      body: {
        ApiVersion: '={{$credentials.apiVersion}}',
        ApiKey: '={{$credentials.apiKey}}',
      },
      json: true,
    },
  };
}
```

### 2.3 PleasanterInterface.ts

```typescript
import type { IDataObject } from 'n8n-workflow';

// 認証情報の型定義
export interface IPleasanterCredentials {
  baseUrl: string;
  apiKey: string;
  apiVersion: string;
}

// Viewパラメータの型定義
export interface IPleasanterView {
  Incomplete?: boolean;
  Own?: boolean;
  NearCompetitionTime?: boolean;
  Delay?: boolean;
  Overdue?: boolean;
  Search?: string;
  ColumnFilterHash?: IDataObject;
  ColumnSorterHash?: IDataObject;
  ApiDataType?: 'Default' | 'KeyValues';
  ApiColumnKeyDisplayType?: 'LabelText' | 'ColumnName';
  ApiColumnValueDisplayType?: 'DisplayValue' | 'Value' | 'Text';
  ApiColumnHash?: IDataObject;
  GridColumns?: IDataObject;
  MergeSessionViewFilters?: boolean;
  MergeSessionViewSorters?: boolean;
}

// リクエストボディの型定義
export interface IPleasanterRequestBody {
  ApiVersion: string;
  ApiKey: string;
  View?: IPleasanterView;
  Title?: string;
  Body?: string;
  StartTime?: string;
  CompletionTime?: string;
  WorkValue?: number;
  ProgressRate?: number;
  RemainingWorkValue?: number;
  Status?: number;
  Manager?: number;
  Owner?: number;
  Locked?: boolean;
  Comments?: string;
  ClassHash?: IDataObject;
  NumHash?: IDataObject;
  DateHash?: IDataObject;
  DescriptionHash?: IDataObject;
  CheckHash?: IDataObject;
  AttachmentsHash?: IDataObject;
}

// APIレスポンスの型定義
export interface IPleasanterResponse {
  Id?: number;
  StatusCode: number;
  LimitPerDate?: number;
  LimitRemaining?: number;
  Message?: string;
  Response?: {
    Offset?: number;
    PageSize?: number;
    TotalCount?: number;
    Data?: IDataObject[];
  };
}

// 操作タイプ
export type PleasanterOperation = 'get' | 'create' | 'update' | 'delete';
```

### 2.4 GenericFunctions.ts

```typescript
import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { IPleasanterCredentials, IPleasanterResponse } from './PleasanterInterface';

/**
 * Pleasanter APIへのリクエストを実行する共通関数
 */
export async function pleasanterApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
): Promise<IPleasanterResponse> {
  const credentials = await this.getCredentials('pleasanterApi') as IPleasanterCredentials;
  
  // APIキーとバージョンをボディに追加
  const requestBody: IDataObject = {
    ApiVersion: credentials.apiVersion,
    ApiKey: credentials.apiKey,
    ...body,
  };

  const options: IHttpRequestOptions = {
    method,
    url: `${credentials.baseUrl.replace(/\/$/, '')}/api${endpoint}`,
    body: requestBody,
    json: true,
  };

  try {
    const response = await this.helpers.httpRequest(options);
    
    // Pleasanter APIのエラーチェック
    if (response.StatusCode && response.StatusCode >= 400) {
      throw new NodeApiError(this.getNode(), response as IDataObject, {
        message: response.Message || 'Pleasanter API Error',
        httpCode: String(response.StatusCode),
      });
    }
    
    return response as IPleasanterResponse;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as IDataObject);
  }
}
```

### 2.5 descriptions/ItemGetDescription.ts

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const itemGetDescription: INodeProperties[] = [
  {
    displayName: 'Site ID or Record ID',
    name: 'siteIdOrRecordId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        operation: ['get'],
      },
    },
    description: 'テーブルのサイトIDまたは取得するレコードのID',
  },
  {
    displayName: 'View (JSON)',
    name: 'view',
    type: 'json',
    default: '{}',
    displayOptions: {
      show: {
        operation: ['get'],
      },
    },
    description: 'フィルター・ソート条件を指定するViewオブジェクト',
  },
];
```

### 2.6 descriptions/ItemCreateDescription.ts

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const itemCreateDescription: INodeProperties[] = [
  {
    displayName: 'Site ID',
    name: 'siteId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        operation: ['create'],
      },
    },
    description: 'レコードを作成するテーブルのサイトID',
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        operation: ['create'],
      },
    },
    description: 'レコードのタイトル',
  },
  {
    displayName: 'Body',
    name: 'body',
    type: 'string',
    typeOptions: {
      rows: 5,
    },
    default: '',
    displayOptions: {
      show: {
        operation: ['create'],
      },
    },
    description: 'レコードの本文',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'Status',
        type: 'number',
        default: 100,
        description: 'ステータス値',
      },
      {
        displayName: 'Manager',
        name: 'Manager',
        type: 'number',
        default: 0,
        description: '担当者のユーザーID',
      },
      {
        displayName: 'Owner',
        name: 'Owner',
        type: 'number',
        default: 0,
        description: '管理者のユーザーID',
      },
      {
        displayName: 'Start Time',
        name: 'StartTime',
        type: 'dateTime',
        default: '',
        description: '開始日時',
      },
      {
        displayName: 'Completion Time',
        name: 'CompletionTime',
        type: 'dateTime',
        default: '',
        description: '完了日時',
      },
      {
        displayName: 'Work Value',
        name: 'WorkValue',
        type: 'number',
        default: 0,
        description: '作業量',
      },
      {
        displayName: 'Progress Rate',
        name: 'ProgressRate',
        type: 'number',
        default: 0,
        description: '進捗率 (0-100)',
      },
      {
        displayName: 'Comments',
        name: 'Comments',
        type: 'string',
        default: '',
        description: 'コメント',
      },
      {
        displayName: 'Locked',
        name: 'Locked',
        type: 'boolean',
        default: false,
        description: 'ロック状態',
      },
      {
        displayName: 'Class Hash (JSON)',
        name: 'ClassHash',
        type: 'json',
        default: '{}',
        description: '分類項目 (ClassA-ClassZ)',
      },
      {
        displayName: 'Num Hash (JSON)',
        name: 'NumHash',
        type: 'json',
        default: '{}',
        description: '数値項目 (NumA-NumZ)',
      },
      {
        displayName: 'Date Hash (JSON)',
        name: 'DateHash',
        type: 'json',
        default: '{}',
        description: '日付項目 (DateA-DateZ)',
      },
      {
        displayName: 'Description Hash (JSON)',
        name: 'DescriptionHash',
        type: 'json',
        default: '{}',
        description: '説明項目 (DescriptionA-DescriptionZ)',
      },
      {
        displayName: 'Check Hash (JSON)',
        name: 'CheckHash',
        type: 'json',
        default: '{}',
        description: 'チェック項目 (CheckA-CheckZ)',
      },
    ],
  },
];
```

### 2.7 descriptions/ItemUpdateDescription.ts

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const itemUpdateDescription: INodeProperties[] = [
  {
    displayName: 'Record ID',
    name: 'recordId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        operation: ['update'],
      },
    },
    description: '更新するレコードのID',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        operation: ['update'],
      },
    },
    options: [
      // ItemCreateDescriptionと同様のフィールドを定義
      // Title, Body, Status, Manager, Owner, StartTime, CompletionTime,
      // WorkValue, ProgressRate, Comments, Locked, ClassHash, NumHash,
      // DateHash, DescriptionHash, CheckHash
    ],
  },
];
```

### 2.8 descriptions/ItemDeleteDescription.ts

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const itemDeleteDescription: INodeProperties[] = [
  {
    displayName: 'Record ID',
    name: 'recordId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        operation: ['delete'],
      },
    },
    description: '削除するレコードのID',
  },
];
```

### 2.9 descriptions/index.ts

```typescript
export * from './ItemGetDescription';
export * from './ItemCreateDescription';
export * from './ItemUpdateDescription';
export * from './ItemDeleteDescription';
```

### 2.10 Pleasanter.node.ts（メインノードクラス）

```typescript
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { pleasanterApiRequest } from './GenericFunctions';
import type { PleasanterOperation } from './PleasanterInterface';
import {
  itemGetDescription,
  itemCreateDescription,
  itemUpdateDescription,
  itemDeleteDescription,
} from './descriptions';

export class Pleasanter implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Pleasanter',
    name: 'pleasanter',
    icon: 'file:../../icons/pleasanter.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Pleasanter APIを使用してレコードの操作を行う',
    defaults: {
      name: 'Pleasanter',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
      {
        name: 'pleasanterApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get',
            value: 'get',
            description: 'レコードを取得する',
            action: 'Get records',
          },
          {
            name: 'Create',
            value: 'create',
            description: '新規レコードを作成する',
            action: 'Create a record',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'レコードを更新する',
            action: 'Update a record',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'レコードを削除する',
            action: 'Delete a record',
          },
        ],
        default: 'get',
      },
      ...itemGetDescription,
      ...itemCreateDescription,
      ...itemUpdateDescription,
      ...itemDeleteDescription,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as PleasanterOperation;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject;

        if (operation === 'get') {
          const siteIdOrRecordId = this.getNodeParameter('siteIdOrRecordId', i) as number;
          const view = this.getNodeParameter('view', i, {}) as IDataObject;
          
          const body: IDataObject = {};
          if (Object.keys(view).length > 0) {
            body.View = view;
          }
          
          const response = await pleasanterApiRequest.call(
            this,
            'POST',
            `/items/${siteIdOrRecordId}/get`,
            body,
          );
          responseData = response as unknown as IDataObject;

        } else if (operation === 'create') {
          const siteId = this.getNodeParameter('siteId', i) as number;
          const title = this.getNodeParameter('title', i, '') as string;
          const body = this.getNodeParameter('body', i, '') as string;
          const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

          const requestBody: IDataObject = {
            ...additionalFields,
          };
          if (title) requestBody.Title = title;
          if (body) requestBody.Body = body;

          const response = await pleasanterApiRequest.call(
            this,
            'POST',
            `/items/${siteId}/create`,
            requestBody,
          );
          responseData = response as unknown as IDataObject;

        } else if (operation === 'update') {
          const recordId = this.getNodeParameter('recordId', i) as number;
          const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

          const response = await pleasanterApiRequest.call(
            this,
            'POST',
            `/items/${recordId}/update`,
            updateFields,
          );
          responseData = response as unknown as IDataObject;

        } else if (operation === 'delete') {
          const recordId = this.getNodeParameter('recordId', i) as number;

          const response = await pleasanterApiRequest.call(
            this,
            'POST',
            `/items/${recordId}/delete`,
            {},
          );
          responseData = response as unknown as IDataObject;

        } else {
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
```

### 2.11 package.json の設定

```json
{
  "name": "n8n-nodes-pleasanter",
  "version": "0.1.0",
  "description": "n8n node for Pleasanter API",
  "keywords": [
    "n8n-community-node-package",
    "pleasanter"
  ],
  "license": "MIT",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/n8n-nodes-pleasanter.git"
  },
  "main": "dist/index.js",
  "scripts": {
    "build": "n8n-node build",
    "dev": "n8n-node dev",
    "lint": "n8n-node lint",
    "lint:fix": "n8n-node lint --fix"
  },
  "devDependencies": {
    "@n8n/node-cli": "latest"
  },
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/PleasanterApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/Pleasanter/Pleasanter.node.js"
    ]
  }
}
```

---

## 3. Pleasanter API 仕様

### 3.1 API概要

- **ベースURL**: `https://{host}/api`
- **認証方式**: APIキー認証（リクエストボディに `ApiKey` を含める）
- **APIバージョン**: `1.1` または `1.0`
- **コンテンツタイプ**: `application/json`

### 3.2 エンドポイント一覧

| 操作 | メソッド | エンドポイント | 説明 |
|------|----------|----------------|------|
| Get | POST | `/items/{siteIdOrRecordId}/get` | レコードの取得（単一または複数） |
| Create | POST | `/items/{siteId}/create` | 新規レコードの作成 |
| Update | POST | `/items/{recordId}/update` | レコードの更新 |
| Delete | POST | `/items/{recordId}/delete` | レコードの削除 |

### 3.3 共通リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|------------|------|------|------|
| ApiVersion | string | いいえ | APIバージョン（`1.1` または `1.0`） |
| ApiKey | string | はい | 認証用APIキー |

### 3.4 Items Get（レコード取得）

**エンドポイント**: `POST /items/{siteIdOrRecordId}/get`

**リクエストボディ**:
```json
{
  "ApiVersion": "1.1",
  "ApiKey": "your-api-key",
  "View": {
    "Incomplete": false,
    "Own": false,
    "NearCompetitionTime": false,
    "Delay": false,
    "Overdue": false,
    "Search": "検索文字列",
    "ColumnFilterHash": {},
    "ColumnSorterHash": {},
    "ApiDataType": "Default",
    "ApiColumnKeyDisplayType": "ColumnName",
    "ApiColumnValueDisplayType": "Value",
    "ApiColumnHash": {},
    "GridColumns": {},
    "MergeSessionViewFilters": false,
    "MergeSessionViewSorters": false
  }
}
```

**レスポンス**:
```json
{
  "StatusCode": 200,
  "LimitPerDate": 10000,
  "LimitRemaining": 9999,
  "Response": {
    "Offset": 0,
    "PageSize": 200,
    "TotalCount": 1,
    "Data": [
      {
        "SiteId": 123,
        "ResultId": 456,
        "IssueId": 789,
        "Ver": 1,
        "Title": "タイトル",
        "Body": "本文",
        "Status": 100,
        "ClassHash": {},
        "NumHash": {},
        "DateHash": {},
        "DescriptionHash": {},
        "CheckHash": {},
        "AttachmentsHash": {}
      }
    ]
  }
}
```

### 3.5 Items Create（レコード作成）

**エンドポイント**: `POST /items/{siteId}/create`

**リクエストボディ**:
```json
{
  "ApiVersion": "1.1",
  "ApiKey": "your-api-key",
  "Title": "タイトル",
  "Body": "本文",
  "StartTime": "2024-01-01T00:00:00",
  "CompletionTime": "2024-12-31T23:59:59",
  "WorkValue": 0,
  "ProgressRate": 0,
  "Status": 100,
  "Manager": 1,
  "Owner": 1,
  "Locked": false,
  "Comments": "コメント",
  "ClassHash": {},
  "NumHash": {},
  "DateHash": {},
  "DescriptionHash": {},
  "CheckHash": {},
  "AttachmentsHash": {}
}
```

**レスポンス**:
```json
{
  "Id": 123,
  "StatusCode": 200,
  "LimitPerDate": 10000,
  "LimitRemaining": 9999,
  "Message": "作成しました。"
}
```

### 3.6 Items Update（レコード更新）

**エンドポイント**: `POST /items/{recordId}/update`

**リクエストボディ**: Items Createと同様

**レスポンス**: Items Createと同様

### 3.7 Items Delete（レコード削除）

**エンドポイント**: `POST /items/{recordId}/delete`

**リクエストボディ**:
```json
{
  "ApiVersion": "1.1",
  "ApiKey": "your-api-key"
}
```

**レスポンス**:
```json
{
  "Id": 123,
  "StatusCode": 200,
  "LimitPerDate": 10000,
  "LimitRemaining": 9999,
  "Message": "削除しました。"
}
```

---

## 4. Docker環境設定

### 4.1 docker-compose.yml

```yaml
version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_FUNCTION_ALLOW_EXTERNAL=*
      - GENERIC_TIMEZONE=Asia/Tokyo
      - TZ=Asia/Tokyo
    volumes:
      - ./volume:/home/node/.n8n
      - ./volume/custom-node:/home/node/.n8n/custom
```

### 4.2 ボリュームマウント構成

| ホストパス | コンテナパス | 説明 |
|------------|--------------|------|
| ./volume | /home/node/.n8n | n8nデータディレクトリ |
| ./volume/custom-node | /home/node/.n8n/custom | カスタムノード配置先 |

---

## 5. ビルド・デプロイ手順

### 5.1 ビルド

```bash
cd custom-node/n8n-node-pleasanter
npm run build
```

### 5.2 カスタムノードの配置

```bash
# ビルド成果物をコピー
cp -r dist/* ../../volume/custom-node/
cp package.json ../../volume/custom-node/
```

### 5.3 n8n起動

```bash
cd ../..
docker-compose up -d
```

### 5.4 動作確認

1. ブラウザで `http://localhost:5678` にアクセス
2. ワークフローを新規作成
3. ノード追加で「Pleasanter」を検索
4. Pleasanterノードが表示されることを確認

---

## 6. テスト要件

### 6.1 単体テスト

- 各操作（Get, Create, Update, Delete）のリクエスト構築テスト
- エラーハンドリングテスト
- 認証情報の検証テスト

### 6.2 統合テスト

- 実際のPleasanterサーバーに対する接続テスト
- 各操作の実行テスト
- エラーケースのテスト

---

## 7. 参考リンク

- [Pleasanter API OpenAPI仕様](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)
- [n8n カスタムノード開発ガイド](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n-nodes-starter リポジトリ](https://github.com/n8n-io/n8n-nodes-starter)

---

## 8. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|------------|----------|
| 2025-12-03 | 1.0.0 | 初版作成 |
| 2025-12-03 | 1.1.0 | 詳細なファイル構成とクラス設計を追加 |
