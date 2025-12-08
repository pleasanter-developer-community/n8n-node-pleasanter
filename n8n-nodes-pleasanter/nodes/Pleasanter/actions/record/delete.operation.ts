import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { pleasanterApiRequest, checkApiResponse } from '../../transport';
import type { IPleasanterMutationResponse } from '../../types';

/**
 * レコードリソースのDELETE操作を実行
 */
export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  const recordId = this.getNodeParameter('recordIdDelete', index) as string;

  const response = await pleasanterApiRequest.call(
    this,
    'POST',
    `/api/items/${recordId}/delete`,
    {},
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
