import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { pleasanterApiRequest } from './GenericFunctions';
import type { PleasanterOperation } from './PleasanterInterface';
import {
	itemGetDescription,
	itemCreateDescription,
	itemUpdateDescription,
	itemDeleteDescription,
} from './descriptions';

export class Pleasanter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pleasanter',
		name: 'pleasanter',
		icon: 'file:../../icons/pleasanter.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Pleasanter API',
		defaults: {
			name: 'Pleasanter',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'pleasanterApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
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
						action: 'Get record s',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a record',
						action: 'Update a record',
					},
				],
				default: 'get',
			},
			...itemGetDescription,
			...itemCreateDescription,
			...itemUpdateDescription,
			...itemDeleteDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as PleasanterOperation;

		for (let i = 0; i < items.length; i++) {
			try {
				let response;

				if (operation === 'get') {
					const siteIdOrRecordId = this.getNodeParameter('siteIdOrRecordId', i) as number;
					const options = this.getNodeParameter('options', i, {}) as IDataObject;

					const body: IDataObject = {};
					const view: IDataObject = {};

					// Boolean options
					if (options.incomplete) view.Incomplete = options.incomplete;
					if (options.own) view.Own = options.own;
					if (options.nearCompletionTime) view.NearCompletionTime = options.nearCompletionTime;
					if (options.delay) view.Delay = options.delay;
					if (options.overdue) view.Overdue = options.overdue;
					if (options.mergeSessionViewFilters) view.MergeSessionViewFilters = options.mergeSessionViewFilters;
					if (options.mergeSessionViewSorters) view.MergeSessionViewSorters = options.mergeSessionViewSorters;

					// String options
					if (options.search) view.Search = options.search;
					if (options.apiDataType) view.ApiDataType = options.apiDataType;
					if (options.apiColumnKeyDisplayType) view.ApiColumnKeyDisplayType = options.apiColumnKeyDisplayType;
					if (options.apiColumnValueDisplayType) view.ApiColumnValueDisplayType = options.apiColumnValueDisplayType;

					// JSON options
					if (options.columnFilterHash) {
						view.ColumnFilterHash = JSON.parse(options.columnFilterHash as string);
					}
					if (options.columnSorterHash) {
						view.ColumnSorterHash = JSON.parse(options.columnSorterHash as string);
					}
					if (options.apiColumnHash) {
						view.ApiColumnHash = JSON.parse(options.apiColumnHash as string);
					}
					if (options.gridColumns) {
						view.GridColumns = JSON.parse(options.gridColumns as string);
					}

					// Only add View if there are any options set
					if (Object.keys(view).length > 0) {
						body.View = view;
					}

					response = await pleasanterApiRequest.call(
						this,
						'POST',
						`/items/${siteIdOrRecordId}/get`,
						body,
					);
				} else if (operation === 'create') {
					const siteId = this.getNodeParameter('siteId', i) as number;
					const title = this.getNodeParameter('title', i, '') as string;
					const bodyContent = this.getNodeParameter('body', i, '') as string;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

					const body: IDataObject = {};
					if (title) body.Title = title;
					if (bodyContent) body.Body = bodyContent;

					// 追加フィールドを処理
					if (additionalFields.status) body.Status = additionalFields.status;
					if (additionalFields.manager) body.Manager = additionalFields.manager;
					if (additionalFields.owner) body.Owner = additionalFields.owner;
					if (additionalFields.startTime) body.StartTime = additionalFields.startTime;
					if (additionalFields.completionTime) body.CompletionTime = additionalFields.completionTime;
					if (additionalFields.workValue) body.WorkValue = additionalFields.workValue;
					if (additionalFields.progressRate) body.ProgressRate = additionalFields.progressRate;
					if (additionalFields.comments) body.Comments = additionalFields.comments;
					if (additionalFields.locked !== undefined) body.Locked = additionalFields.locked;

					// JSON フィールドを処理
					if (additionalFields.classHash) {
						body.ClassHash = JSON.parse(additionalFields.classHash as string);
					}
					if (additionalFields.numHash) {
						body.NumHash = JSON.parse(additionalFields.numHash as string);
					}
					if (additionalFields.dateHash) {
						body.DateHash = JSON.parse(additionalFields.dateHash as string);
					}
					if (additionalFields.descriptionHash) {
						body.DescriptionHash = JSON.parse(additionalFields.descriptionHash as string);
					}
					if (additionalFields.checkHash) {
						body.CheckHash = JSON.parse(additionalFields.checkHash as string);
					}

					response = await pleasanterApiRequest.call(
						this,
						'POST',
						`/items/${siteId}/create`,
						body,
					);
				} else if (operation === 'update') {
					const recordId = this.getNodeParameter('recordId', i) as number;
					const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

					const body: IDataObject = {};

					if (updateFields.title) body.Title = updateFields.title;
					if (updateFields.body) body.Body = updateFields.body;
					if (updateFields.status) body.Status = updateFields.status;
					if (updateFields.manager) body.Manager = updateFields.manager;
					if (updateFields.owner) body.Owner = updateFields.owner;
					if (updateFields.startTime) body.StartTime = updateFields.startTime;
					if (updateFields.completionTime) body.CompletionTime = updateFields.completionTime;
					if (updateFields.workValue) body.WorkValue = updateFields.workValue;
					if (updateFields.progressRate) body.ProgressRate = updateFields.progressRate;
					if (updateFields.comments) body.Comments = updateFields.comments;
					if (updateFields.locked !== undefined) body.Locked = updateFields.locked;

					// JSON フィールドを処理
					if (updateFields.classHash) {
						body.ClassHash = JSON.parse(updateFields.classHash as string);
					}
					if (updateFields.numHash) {
						body.NumHash = JSON.parse(updateFields.numHash as string);
					}
					if (updateFields.dateHash) {
						body.DateHash = JSON.parse(updateFields.dateHash as string);
					}
					if (updateFields.descriptionHash) {
						body.DescriptionHash = JSON.parse(updateFields.descriptionHash as string);
					}
					if (updateFields.checkHash) {
						body.CheckHash = JSON.parse(updateFields.checkHash as string);
					}

					response = await pleasanterApiRequest.call(
						this,
						'POST',
						`/items/${recordId}/update`,
						body,
					);
				} else if (operation === 'delete') {
					const recordId = this.getNodeParameter('recordId', i) as number;

					response = await pleasanterApiRequest.call(
						this,
						'POST',
						`/items/${recordId}/delete`,
						{},
					);
				}

				// レスポンスをNodeExecutionData形式に変換
				if (operation === 'get' && response?.Response?.Data) {
					// Get操作: Response.Data配列の各要素を個別のアイテムとして出力
					const records = response.Response.Data as IDataObject[];
					for (const record of records) {
						returnData.push({
							json: record,
							pairedItem: { item: i },
						});
					}
				} else {
					// その他の操作: レスポンス全体を出力
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(response as unknown as IDataObject),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
