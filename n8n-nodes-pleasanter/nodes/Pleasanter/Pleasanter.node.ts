import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  resourceProperty,
  operationProperty,
  getFields,
  createFields,
  updateFields,
  deleteFields,
  recordDataFields,
} from './descriptions';

import { record } from './actions';

export class Pleasanter implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Pleasanter',
    name: 'pleasanter',
    icon: 'file:pleasanter.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Pleasanter API',
    defaults: {
      name: 'Pleasanter',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'pleasanterApi',
        required: true,
      },
    ],
    properties: [
      resourceProperty,
      operationProperty,
      // GET用フィールド
      ...getFields,
      // CREATE用フィールド
      ...createFields,
      // UPDATE用フィールド
      ...updateFields,
      // DELETE用フィールド
      ...deleteFields,
      // 共通レコードデータフィールド（create/update用）
      ...recordDataFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'record') {
          switch (operation) {
            case 'get': {
              const results = await record.get.execute.call(this, i);
              returnData.push(...results);
              break;
            }
            case 'create': {
              const result = await record.create.execute.call(this, i);
              returnData.push(result);
              break;
            }
            case 'update': {
              const result = await record.update.execute.call(this, i);
              returnData.push(result);
              break;
            }
            case 'delete': {
              const result = await record.delete.execute.call(this, i);
              returnData.push(result);
              break;
            }
            default:
              throw new Error(`Unknown operation: ${operation}`);
          }
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

