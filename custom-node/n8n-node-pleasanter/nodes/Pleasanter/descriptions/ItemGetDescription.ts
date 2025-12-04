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
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'API Column Hash (JSON)',
				name: 'apiColumnHash',
				type: 'json',
				default: '{}',
				description: 'Specify columns to retrieve and their settings as JSON object',
			},
			{
				displayName: 'API Column Key Display Type',
				name: 'apiColumnKeyDisplayType',
				type: 'options',
				options: [
					{ name: 'Label Text', value: 'LabelText' },
					{ name: 'Column Name', value: 'ColumnName' },
				],
				default: 'ColumnName',
				description: 'How to display column keys in the response',
			},
			{
				displayName: 'API Column Value Display Type',
				name: 'apiColumnValueDisplayType',
				type: 'options',
				options: [
					{ name: 'Display Value', value: 'DisplayValue' },
					{ name: 'Text', value: 'Text' },
					{ name: 'Value', value: 'Value' },
				],
				default: 'Value',
				description: 'How to display column values in the response',
			},
			{
				displayName: 'API Data Type',
				name: 'apiDataType',
				type: 'options',
				options: [
					{ name: 'Default', value: 'Default' },
					{ name: 'Key Values', value: 'KeyValues' },
				],
				default: 'Default',
				description: 'The format of the response data',
			},
			{
				displayName: 'Column Filter Hash (JSON)',
				name: 'columnFilterHash',
				type: 'json',
				default: '{}',
				description: 'Filter conditions as JSON object (e.g., {"ClassA": "value"})',
			},
			{
				displayName: 'Column Sorter Hash (JSON)',
				name: 'columnSorterHash',
				type: 'json',
				default: '{}',
				description: 'Sort conditions as JSON object (e.g., {"CreatedTime": "desc"})',
			},
			{
				displayName: 'Delay',
				name: 'delay',
				type: 'boolean',
				default: false,
				description: 'Whether to filter only delayed records',
			},
			{
				displayName: 'Grid Columns (JSON)',
				name: 'gridColumns',
				type: 'json',
				default: '[]',
				description: 'Specify which columns to include in the response as JSON array',
			},
			{
				displayName: 'Incomplete',
				name: 'incomplete',
				type: 'boolean',
				default: false,
				description: 'Whether to filter only incomplete records',
			},
			{
				displayName: 'Merge Session View Filters',
				name: 'mergeSessionViewFilters',
				type: 'boolean',
				default: false,
				description: 'Whether to merge with session view filters',
			},
			{
				displayName: 'Merge Session View Sorters',
				name: 'mergeSessionViewSorters',
				type: 'boolean',
				default: false,
				description: 'Whether to merge with session view sorters',
			},
			{
				displayName: 'Near Completion Time',
				name: 'nearCompletionTime',
				type: 'boolean',
				default: false,
				description: 'Whether to filter only records near completion time',
			},
			{
				displayName: 'Overdue',
				name: 'overdue',
				type: 'boolean',
				default: false,
				description: 'Whether to filter only overdue records',
			},
			{
				displayName: 'Own',
				name: 'own',
				type: 'boolean',
				default: false,
				description: 'Whether to filter only records owned by the current user',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search keyword to filter records',
			},
		],
	},
];
