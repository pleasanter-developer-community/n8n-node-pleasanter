import type { INodeProperties } from 'n8n-workflow';

/**
 * リソース選択プロパティ
 */
export const resourceProperty: INodeProperties = {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [
    {
      name: 'Record',
      value: 'record',
    },
  ],
  default: 'record',
};

/**
 * レコードリソース用の操作選択プロパティ
 */
export const operationProperty: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['record'],
    },
  },
  options: [
    {
      name: 'Create',
      value: 'create',
      description: 'Create a new record',
      action: 'Create a record',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a record',
      action: 'Delete a record',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get record(s)',
      action: 'Get record(s)',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update a record',
      action: 'Update a record',
    },
  ],
  default: 'get',
};
