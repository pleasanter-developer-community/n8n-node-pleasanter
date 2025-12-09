import type { INodeProperties } from 'n8n-workflow';

/**
 * CreateとUpdate操作用の共通フィールド
 * Pleasanter OpenAPIのItemDataおよびItemRequestスキーマに基づく
 * 全てのフィールドはオプショナルで、明示的に指定された項目のみAPIに送信される
 */
export const recordDataFields: INodeProperties[] = [
  // ==================== 基本フィールド（Additional Fields） ====================
  {
    displayName: 'Record Data',
    name: 'recordData',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['create', 'update'],
      },
    },
    description: 'Record data fields. Only explicitly specified fields will be sent to the API.',
    options: [
      // ==================== 基本フィールド ====================
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The title of the record (タイトル項目)',
      },
      {
        displayName: 'Body',
        name: 'body',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The body content of the record (内容項目)',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'number',
        default: 0,
        description: 'The status code of the record (状況項目)',
      },
      {
        displayName: 'Manager',
        name: 'manager',
        type: 'number',
        default: 0,
        description: 'The manager user ID (管理者のユーザID)',
      },
      {
        displayName: 'Owner',
        name: 'owner',
        type: 'number',
        default: 0,
        description: 'The owner user ID (担当者のユーザID)',
      },
      {
        displayName: 'Comments',
        name: 'comments',
        type: 'string',
        typeOptions: {
          rows: 2,
        },
        default: '',
        description: 'Comments for the record (コメント項目)',
      },
      {
        displayName: 'Locked',
        name: 'locked',
        type: 'boolean',
        default: false,
        description: 'Whether the record is locked (ロック状態)',
      },

      // ==================== 日付/時間フィールド（期限付きテーブルのみ） ====================
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
        description: 'The start time of the record (開始日時、期限付きテーブルのみ)',
      },
      {
        displayName: 'Completion Time',
        name: 'completionTime',
        type: 'dateTime',
        default: '',
        description: 'The completion time of the record (完了日時、期限付きテーブルのみ)',
      },

      // ==================== 進捗フィールド（期限付きテーブルのみ） ====================
      {
        displayName: 'Work Value',
        name: 'workValue',
        type: 'number',
        default: 0,
        description: 'The work value of the record (作業量、期限付きテーブルのみ)',
      },
      {
        displayName: 'Progress Rate',
        name: 'progressRate',
        type: 'number',
        default: 0,
        description: 'The progress rate 0-100 (進捗率、期限付きテーブルのみ)',
      },
      {
        displayName: 'Remaining Work Value',
        name: 'remainingWorkValue',
        type: 'number',
        default: 0,
        description: 'The remaining work value (残作業量、期限付きテーブルのみ)',
      },

      // ==================== ハッシュフィールド ====================
      {
        displayName: 'Class Hash (JSON)',
        name: 'classHash',
        type: 'json',
        default: '{}',
        description: 'Classification fields (ClassA-ClassZ) as JSON object. Example: {"ClassA": "value1", "ClassB": "value2"}',
      },
      {
        displayName: 'Num Hash (JSON)',
        name: 'numHash',
        type: 'json',
        default: '{}',
        description: 'Numeric fields (NumA-NumZ) as JSON object. Example: {"NumA": 100, "NumB": 200}',
      },
      {
        displayName: 'Date Hash (JSON)',
        name: 'dateHash',
        type: 'json',
        default: '{}',
        description: 'Date fields (DateA-DateZ) as JSON object. Example: {"DateA": "2024-01-01T00:00:00"}',
      },
      {
        displayName: 'Description Hash (JSON)',
        name: 'descriptionHash',
        type: 'json',
        default: '{}',
        description: 'Description fields (DescriptionA-DescriptionZ) as JSON object. Example: {"DescriptionA": "text"}',
      },
      {
        displayName: 'Check Hash (JSON)',
        name: 'checkHash',
        type: 'json',
        default: '{}',
        description: 'Checkbox fields (CheckA-CheckZ) as JSON object. Example: {"CheckA": true, "CheckB": false}',
      },
      {
        displayName: 'Attachments Hash (JSON)',
        name: 'attachmentsHash',
        type: 'json',
        default: '{}',
        description: 'Attachment files (AttachmentsA-AttachmentsZ). Each value is an array of {Guid, Name, ContentType, Base64, Deleted}',
      },
    ],
  },

  // ==================== プロセスフィールド（ItemRequest固有） ====================
  {
    displayName: 'Process Options',
    name: 'processOptions',
    type: 'collection',
    placeholder: 'Add Process Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Process ID',
        name: 'processId',
        type: 'number',
        default: 0,
        description: 'ID of the process to execute (実行するプロセスのID)',
      },
      {
        displayName: 'Process IDs',
        name: 'processIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of process IDs to execute (実行する複数のプロセスIDをカンマ区切り)',
      },
      {
        displayName: 'Record Permissions',
        name: 'recordPermissions',
        type: 'string',
        default: '',
        description: 'Comma-separated record permissions. Format: Type,Id,Permission. Example: "User,10,1" or "Dept,1,31" or "Group,1,511"',
      },
    ],
  },
];
