import type { INodeProperties } from 'n8n-workflow';

export const itemGetDescription: INodeProperties[] = [
	{
		displayName: 'Site ID or Record ID',
		name: 'siteIdOrRecordId',
		type: 'number',
		required: true,
		default: 0,
		description: 'The ID of the site (to get multiple records) or record (to get a single record)',
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'View (JSON)',
		name: 'view',
		type: 'json',
		default: '{}',
		description: 'Filter and sort conditions in JSON format',
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
	},
];
