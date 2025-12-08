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
        displayName: 'Column Filter (JSON)',
        name: 'columnFilterHash',
        type: 'json',
        default: '{}',
        description: 'Column filter conditions as JSON object. Example: {"ClassA": "value1", "Status": "100"}',
      },
      {
        displayName: 'Column Filter Search Types (JSON)',
        name: 'columnFilterSearchTypes',
        type: 'json',
        default: '{}',
        description: 'Search method for each column. Values: PartialMatch, ExactMatch, ForwardMatch, PartialMatchMultiple, ExactMatchMultiple, ForwardMatchMultiple. Example: {"ClassA": "ExactMatch"}',
      },
      {
        displayName: 'Column Filter Negatives',
        name: 'columnFilterNegatives',
        type: 'string',
        default: '',
        description: 'Comma-separated list of columns for negative filtering (否定条件にする項目名). Example: "ClassA,Status"',
      },
      {
        displayName: 'Column Sorter (JSON)',
        name: 'columnSorterHash',
        type: 'json',
        default: '{}',
        description: 'Sort conditions as JSON object. Values: asc, desc. Example: {"ClassA": "asc", "CreatedTime": "desc"}',
      },
      {
        displayName: 'Grid Columns',
        name: 'gridColumns',
        type: 'string',
        default: '',
        description: 'Comma-separated list of columns to return (返却される項目を制御). Example: "ResultId,Title,ClassA,Status"',
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
        displayName: 'API Column Hash (JSON)',
        name: 'apiColumnHash',
        type: 'json',
        default: '{}',
        description: 'Per-column Key/Value display settings (項目単位でKey/Valueの表示形式を指定)',
      },
      {
        displayName: 'Merge Session View Filters',
        name: 'mergeSessionViewFilters',
        type: 'boolean',
        default: false,
        description: 'Whether to merge with session view filters (セッションのフィルタ条件とマージするか)',
      },
      {
        displayName: 'Merge Session View Sorters',
        name: 'mergeSessionViewSorters',
        type: 'boolean',
        default: false,
        description: 'Whether to merge with session view sorters (セッションのソート条件とマージするか)',
      },
    ],
  },
];
