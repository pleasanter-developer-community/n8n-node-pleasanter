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
        displayName: 'Class Hash',
        name: 'classHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Classification fields (ClassA-ClassZ)',
        options: [
          {
            name: 'items',
            displayName: 'Items',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'ClassA',
                description: 'Field name (ClassA-ClassZ)',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Field value',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Num Hash',
        name: 'numHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Numeric fields (NumA-NumZ)',
        options: [
          {
            name: 'items',
            displayName: 'Items',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'NumA',
                description: 'Field name (NumA-NumZ)',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'number',
                default: 0,
                description: 'Numeric value',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Date Hash',
        name: 'dateHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Date fields (DateA-DateZ)',
        options: [
          {
            name: 'items',
            displayName: 'Items',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'DateA',
                description: 'Field name (DateA-DateZ)',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'dateTime',
                default: '',
                description: 'Date value',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Description Hash',
        name: 'descriptionHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Description fields (DescriptionA-DescriptionZ)',
        options: [
          {
            name: 'items',
            displayName: 'Items',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'DescriptionA',
                description: 'Field name (DescriptionA-DescriptionZ)',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                typeOptions: {
                  rows: 3,
                },
                default: '',
                description: 'Description text',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Check Hash',
        name: 'checkHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Checkbox fields (CheckA-CheckZ)',
        options: [
          {
            name: 'items',
            displayName: 'Items',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'CheckA',
                description: 'Field name (CheckA-CheckZ)',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'boolean',
                default: false,
                description: 'Checkbox value',
              },
            ],
          },
        ],
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
