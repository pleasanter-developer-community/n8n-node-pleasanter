import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { pleasanterApiRequest, checkApiResponse, buildRecordData, buildProcessOptions } from '../../transport';
import type { IPleasanterMutationResponse } from '../../types';

/**
 * レコードリソースのCREATE操作を実行
 */
export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  const siteId = this.getNodeParameter('siteId', index) as string;
  const recordData = buildRecordData.call(this, index);
  const processOptions = buildProcessOptions.call(this, index);

  // レコードデータとプロセスオプションをマージ
  const body: IDataObject = {
    ...recordData,
    ...processOptions,
  };

  const response = await pleasanterApiRequest.call(
    this,
    'POST',
    `/api/items/${siteId}/create`,
    body,
  );

  checkApiResponse(response as IPleasanterMutationResponse);

  // APIレスポンスから全ての情報を含める
  const mutationResponse = response as IPleasanterMutationResponse;
  return {
    json: {
      // APIレスポンスベースの情報（レート制限情報等）
      StatusCode: mutationResponse.StatusCode,
      LimitPerDate: mutationResponse.LimitPerDate,
      LimitRemaining: mutationResponse.LimitRemaining,
      // ミューテーション固有の情報
      Id: mutationResponse.Id,
      Message: mutationResponse.Message,
    } as IDataObject,
    pairedItem: { item: index },
  };
}
