import type { INodeProperties } from 'n8n-workflow';

/**
 * CREATE操作用のフィールド定義
 */
export const createFields: INodeProperties[] = [
  {
    displayName: 'Site ID',
    name: 'siteId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The Site ID where the record will be created',
  },
];
