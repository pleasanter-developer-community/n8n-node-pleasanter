import type { INodeProperties } from 'n8n-workflow';

/**
 * DELETE操作用のフィールド定義
 */
export const deleteFields: INodeProperties[] = [
  {
    displayName: 'Record ID',
    name: 'recordIdDelete',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['record'],
        operation: ['delete'],
      },
    },
    default: '',
    description: 'The ID of the record to delete',
  },
];
