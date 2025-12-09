import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { pleasanterApiRequest, checkApiResponse, buildViewOptions } from '../../transport';
import type { IPleasanterGetResponse } from '../../types';

/**
 * レコードリソースのGET操作を実行
 */
export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const siteIdOrRecordId = this.getNodeParameter('siteIdOrRecordId', index) as string;
  const outputFormat = this.getNodeParameter('outputFormat', index, 'flat') as string;
  const viewOptions = this.getNodeParameter('viewOptions', index, {}) as IDataObject;

  const body: IDataObject = {};

  // ページネーションオフセットを追加（リクエストボディのトップレベル）
  if (viewOptions.offset !== undefined) body.Offset = viewOptions.offset;

  // ビューオプションを追加
  const view = buildViewOptions.call(this, index);
  if (view) body.View = view;

  const response = await pleasanterApiRequest.call(
    this,
    'POST',
    `/api/items/${siteIdOrRecordId}/get`,
    body,
  );

  checkApiResponse(response as IPleasanterGetResponse);

  // レスポンスからデータを返却
  const getResponse = response as unknown as IPleasanterGetResponse;

  // Raw形式: 元のAPIレスポンス構造をそのまま返却
  if (outputFormat === 'raw') {
    returnData.push({
      json: response,
      pairedItem: { item: index },
    });
    return returnData;
  }

  // Flat形式: 各レコードを個別のアイテムとしてメタデータ付きで返却
  if (getResponse.Response?.Data) {
    // APIレスポンスベースのメタデータ（レート制限情報等）
    const apiMetadata = {
      StatusCode: getResponse.StatusCode,
      LimitPerDate: getResponse.LimitPerDate,
      LimitRemaining: getResponse.LimitRemaining,
    };

    // レスポンス固有のメタデータ（ページネーション情報）
    const responseMetadata = {
      Offset: getResponse.Response.Offset,
      PageSize: getResponse.Response.PageSize,
      TotalCount: getResponse.Response.TotalCount,
    };

    for (const record of getResponse.Response.Data) {
      returnData.push({
        json: {
          ...apiMetadata,
          ...responseMetadata,
          ...(record as unknown as IDataObject),
        },
        pairedItem: { item: index },
      });
    }
  } else {
    // 単一レコード取得またはデータなしの場合はレスポンス全体を返却
    returnData.push({
      json: response,
      pairedItem: { item: index },
    });
  }

  return returnData;
}
