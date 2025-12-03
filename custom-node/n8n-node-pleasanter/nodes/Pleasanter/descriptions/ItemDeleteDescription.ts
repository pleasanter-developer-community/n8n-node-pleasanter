import type { INodeProperties } from 'n8n-workflow';

export const itemDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'number',
		required: true,
		default: 0,
		description: 'The ID of the record to delete',
		displayOptions: {
			show: {
				operation: ['delete'],
			},
		},
	},
];
