import type { INodeProperties } from 'n8n-workflow';

/**
 * GET操作用のフィールド定義
 */
export const getFields: INodeProperties[] = [
  {
    displayName: 'Site ID or Record ID',
    name: 'siteIdOrRecordId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The Site ID to get multiple records, or Record ID to get a single record',
  },
  // Output format option
  {
    displayName: 'Output Format',
    name: 'outputFormat',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['get'],
      },
    },
    options: [
      {
        name: 'Flat',
        value: 'flat',
        description: 'Each record as separate item with metadata (n8n friendly)',
      },
      {
        name: 'Raw',
        value: 'raw',
        description: 'Original API response structure with Data array',
      },
    ],
    default: 'flat',
    description:
      'Output format for the response. Flat: each record as separate item. Raw: original API structure.',
  },
  // View options
  {
    displayName: 'View Options',
    name: 'viewOptions',
    type: 'collection',
    placeholder: 'Add View Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['get'],
      },
    },
    options: [
      {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        description: 'Number of records to skip for pagination',
      },
      {
        displayName: 'Incomplete Only',
        name: 'incomplete',
        type: 'boolean',
        default: false,
        description: 'Whether to get incomplete records only (未完了のレコードのみ取得)',
      },
      {
        displayName: 'Own Only',
        name: 'own',
        type: 'boolean',
        default: false,
        description: 'Whether to get own records only (自分が担当のレコードのみ取得)',
      },
      {
        displayName: 'Near Completion Time',
        name: 'nearCompletionTime',
        type: 'boolean',
        default: false,
        description: 'Whether to filter by near completion time (期限が近いレコードのみ取得)',
      },
      {
        displayName: 'Delay',
        name: 'delay',
        type: 'boolean',
        default: false,
        description: 'Whether to filter delayed records (遅延しているレコードのみ取得)',
      },
      {
        displayName: 'Overdue',
        name: 'overdue',
        type: 'boolean',
        default: false,
        description: 'Whether to filter overdue records (期限超過のレコードのみ取得)',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search keyword (検索キーワード)',
      },
      {
        displayName: 'Column Filter Hash',
        name: 'columnFilterHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Column filter conditions (e.g. ColumnA: value)',
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
                placeholder: 'ColumnA',
                description: 'Column name',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Filter value',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Column Sorter Hash',
        name: 'columnSorterHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Column sort conditions (e.g. ColumnA: asc)',
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
                placeholder: 'ColumnA',
                description: 'Column name',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'options',
                options: [
                  {
                    name: 'Ascending',
                    value: 'asc',
                    description: 'Sort in ascending order',
                  },
                  {
                    name: 'Descending',
                    value: 'desc',
                    description: 'Sort in descending order',
                  },
                ],
                default: 'asc',
                description: 'Sort direction',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Column Filter Search Types',
        name: 'columnFilterSearchTypes',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Search method for each column',
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
                placeholder: 'ColumnA',
                description: 'Column name',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'options',
                options: [
                  {
                    name: 'Partial Match',
                    value: 'PartialMatch',
                    description: 'Partial string matching',
                  },
                  {
                    name: 'Exact Match',
                    value: 'ExactMatch',
                    description: 'Exact string matching',
                  },
                  {
                    name: 'Forward Match',
                    value: 'ForwardMatch',
                    description: 'Forward string matching',
                  },
                  {
                    name: 'Partial Match Multiple',
                    value: 'PartialMatchMultiple',
                    description: 'Partial match with multiple values',
                  },
                  {
                    name: 'Exact Match Multiple',
                    value: 'ExactMatchMultiple',
                    description: 'Exact match with multiple values',
                  },
                  {
                    name: 'Forward Match Multiple',
                    value: 'ForwardMatchMultiple',
                    description: 'Forward match with multiple values',
                  },
                ],
                default: 'PartialMatch',
                description: 'Search method',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Column Filter Negatives',
        name: 'columnFilterNegatives',
        type: 'string',
        default: '',
        description:
          'Comma-separated list of columns for negative filtering (否定条件にする項目名). Example: "ClassA,Status"',
      },
      {
        displayName: 'Grid Columns',
        name: 'gridColumns',
        type: 'string',
        default: '',
        description:
          'Comma-separated list of columns to return (返却される項目を制御). Example: "ResultId,Title,ClassA,Status"',
      },
      {
        displayName: 'API Data Type',
        name: 'apiDataType',
        type: 'options',
        options: [
          {
            name: 'Default',
            value: 'Default',
          },
          {
            name: 'Key Values',
            value: 'KeyValues',
          },
        ],
        default: 'Default',
        description: 'Response format type (APIの形式を指定)',
      },
      {
        displayName: 'API Column Key Display Type',
        name: 'apiColumnKeyDisplayType',
        type: 'options',
        options: [
          {
            name: 'Column Name',
            value: 'ColumnName',
          },
          {
            name: 'Label Text',
            value: 'LabelText',
          },
        ],
        default: 'ColumnName',
        description: 'Display type for column keys in response (レスポンスのKeyの表示形式)',
      },
      {
        displayName: 'API Column Value Display Type',
        name: 'apiColumnValueDisplayType',
        type: 'options',
        options: [
          {
            name: 'Display Value',
            value: 'DisplayValue',
          },
          {
            name: 'Value',
            value: 'Value',
          },
          {
            name: 'Text',
            value: 'Text',
          },
        ],
        default: 'DisplayValue',
        description: 'Display type for column values in response (レスポンスのValueの表示形式)',
      },
      {
        displayName: 'API Column Hash',
        name: 'apiColumnHash',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Per-column Key/Value display settings',
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
                placeholder: 'ColumnA',
                description: 'Column name',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Display setting value',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Merge Session View Filters',
        name: 'mergeSessionViewFilters',
        type: 'boolean',
        default: false,
        description:
          'Whether to merge with session view filters (セッションのフィルタ条件とマージするか)',
      },
      {
        displayName: 'Merge Session View Sorters',
        name: 'mergeSessionViewSorters',
        type: 'boolean',
        default: false,
        description:
          'Whether to merge with session view sorters (セッションのソート条件とマージするか)',
      },
    ],
  },
];
