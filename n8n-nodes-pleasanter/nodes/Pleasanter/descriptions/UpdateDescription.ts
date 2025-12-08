import type { INodeProperties } from 'n8n-workflow';

/**
 * UPDATE操作用のフィールド定義
 */
export const updateFields: INodeProperties[] = [
  {
    displayName: 'Record ID',
    name: 'recordId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The ID of the record to update',
  },
];
