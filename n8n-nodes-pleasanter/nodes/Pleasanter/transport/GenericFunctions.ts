import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IPleasanterCredentials, IPleasanterApiResponse } from '../types';

/**
 * Pleasanter APIへのリクエストを実行
 */
export async function pleasanterApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
): Promise<IDataObject> {
  const credentials = (await this.getCredentials('pleasanterApi')) as IPleasanterCredentials;

  // リクエストボディに認証情報を追加（Pleasanter固有の仕様）
  const requestBody: IDataObject = {
    ApiVersion: credentials.apiVersion,
    ApiKey: credentials.apiKey,
    ...body,
  };

  const options: IHttpRequestOptions = {
    method,
    url: `${credentials.baseUrl.replace(/\/$/, '')}${endpoint}`,
    body: requestBody,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
  };

  try {
    const response = await this.helpers.httpRequest(options);
    return response as IDataObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * APIレスポンスがエラーかどうかを確認
 */
export function checkApiResponse(response: IPleasanterApiResponse): void {
  // Pleasanterは成功時にStatusCode 200を返す
  if (response.StatusCode !== 200) {
    throw new Error(
      `Pleasanter API Error: StatusCode ${response.StatusCode}${response.Message ? ` - ${response.Message}` : ''}`,
    );
  }
}

/**
 * ノードパラメータからレコードデータオブジェクトを構築
 * Pleasanter OpenAPIのItemDataおよびItemRequestスキーマに基づく
 */
export function buildRecordData(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  const recordData: IDataObject = {};

  // ==================== 基本フィールド ====================
  const title = this.getNodeParameter('title', itemIndex, '') as string;
  if (title) recordData.Title = title;

  const body = this.getNodeParameter('body', itemIndex, '') as string;
  if (body) recordData.Body = body;

  const status = this.getNodeParameter('status', itemIndex, '') as number | string;
  if (status !== '') recordData.Status = Number(status);

  const manager = this.getNodeParameter('manager', itemIndex, '') as number | string;
  if (manager !== '') recordData.Manager = Number(manager);

  const owner = this.getNodeParameter('owner', itemIndex, '') as number | string;
  if (owner !== '') recordData.Owner = Number(owner);

  // ==================== 日付フィールド（期限付きテーブルのみ） ====================
  const startTime = this.getNodeParameter('startTime', itemIndex, '') as string;
  if (startTime) recordData.StartTime = startTime;

  const completionTime = this.getNodeParameter('completionTime', itemIndex, '') as string;
  if (completionTime) recordData.CompletionTime = completionTime;

  // ==================== 進捗フィールド（期限付きテーブルのみ） ====================
  const workValue = this.getNodeParameter('workValue', itemIndex, '') as number | string;
  if (workValue !== '') recordData.WorkValue = Number(workValue);

  const progressRate = this.getNodeParameter('progressRate', itemIndex, '') as number | string;
  if (progressRate !== '') recordData.ProgressRate = Number(progressRate);

  const remainingWorkValue = this.getNodeParameter('remainingWorkValue', itemIndex, '') as number | string;
  if (remainingWorkValue !== '') recordData.RemainingWorkValue = Number(remainingWorkValue);

  // ==================== その他フィールド ====================
  const locked = this.getNodeParameter('locked', itemIndex, false) as boolean;
  if (locked) recordData.Locked = locked;

  const comments = this.getNodeParameter('comments', itemIndex, '') as string;
  if (comments) recordData.Comments = comments;

  // ==================== ハッシュフィールド（追加） ====================
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

  if (additionalFields.classHash) {
    recordData.ClassHash = parseJsonField(additionalFields.classHash);
  }
  if (additionalFields.numHash) {
    recordData.NumHash = parseJsonField(additionalFields.numHash);
  }
  if (additionalFields.dateHash) {
    recordData.DateHash = parseJsonField(additionalFields.dateHash);
  }
  if (additionalFields.descriptionHash) {
    recordData.DescriptionHash = parseJsonField(additionalFields.descriptionHash);
  }
  if (additionalFields.checkHash) {
    recordData.CheckHash = parseJsonField(additionalFields.checkHash);
  }
  if (additionalFields.attachmentsHash) {
    recordData.AttachmentsHash = parseJsonField(additionalFields.attachmentsHash);
  }

  return recordData;
}

/**
 * ノードパラメータからプロセスオプションを構築（ItemRequest固有）
 */
export function buildProcessOptions(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  const processData: IDataObject = {};
  const processOptions = this.getNodeParameter('processOptions', itemIndex, {}) as IDataObject;

  if (processOptions.processId !== undefined && processOptions.processId !== '') {
    processData.ProcessId = Number(processOptions.processId);
  }

  if (processOptions.processIds) {
    const processIds = (processOptions.processIds as string)
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));
    if (processIds.length > 0) {
      processData.ProcessIds = processIds;
    }
  }

  if (processOptions.recordPermissions) {
    const permissions = (processOptions.recordPermissions as string)
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (permissions.length > 0) {
      processData.RecordPermissions = permissions;
    }
  }

  return processData;
}

/**
 * JSONフィールドをパース（文字列またはオブジェクト）
 */
function parseJsonField(value: unknown): IDataObject | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Object.keys(parsed).length > 0 ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return value as IDataObject;
}

/**
 * ノードパラメータからビューオプションを構築
 * Pleasanter OpenAPIのViewスキーマに基づく
 */
export function buildViewOptions(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject | undefined {
  const viewOptions = this.getNodeParameter('viewOptions', itemIndex, {}) as IDataObject;

  if (Object.keys(viewOptions).length === 0) {
    return undefined;
  }

  const view: IDataObject = {};

  // ==================== ブールフィルタ ====================
  if (viewOptions.incomplete !== undefined) view.Incomplete = viewOptions.incomplete;
  if (viewOptions.own !== undefined) view.Own = viewOptions.own;
  if (viewOptions.nearCompletionTime !== undefined) view.NearCompletionTime = viewOptions.nearCompletionTime;
  if (viewOptions.delay !== undefined) view.Delay = viewOptions.delay;
  if (viewOptions.overdue !== undefined) view.Overdue = viewOptions.overdue;

  // ==================== 検索 ====================
  if (viewOptions.search) view.Search = viewOptions.search;

  // ==================== カラムフィルタハッシュ（JSON） ====================
  if (viewOptions.columnFilterHash) {
    const filterHash = parseJsonFieldForView(viewOptions.columnFilterHash);
    if (filterHash) view.ColumnFilterHash = filterHash;
  }

  // ==================== カラムフィルタ検索タイプ（JSON） ====================
  if (viewOptions.columnFilterSearchTypes) {
    const searchTypes = parseJsonFieldForView(viewOptions.columnFilterSearchTypes);
    if (searchTypes) view.ColumnFilterSearchTypes = searchTypes;
  }

  // ==================== カラムフィルタ否定（カンマ区切り文字列を配列に変換） ====================
  if (viewOptions.columnFilterNegatives) {
    const negatives = (viewOptions.columnFilterNegatives as string)
      .split(',')
      .map((col) => col.trim())
      .filter((col) => col.length > 0);
    if (negatives.length > 0) {
      view.ColumnFilterNegatives = negatives;
    }
  }

  // ==================== カラムソータハッシュ（JSON） ====================
  if (viewOptions.columnSorterHash) {
    const sorterHash = parseJsonFieldForView(viewOptions.columnSorterHash);
    if (sorterHash) view.ColumnSorterHash = sorterHash;
  }

  // ==================== グリッドカラム（カンマ区切り文字列を配列に変換） ====================
  if (viewOptions.gridColumns) {
    const gridColumns = (viewOptions.gridColumns as string)
      .split(',')
      .map((col) => col.trim())
      .filter((col) => col.length > 0);
    if (gridColumns.length > 0) {
      view.GridColumns = gridColumns;
    }
  }

  // ==================== API表示タイプオプション ====================
  if (viewOptions.apiDataType && viewOptions.apiDataType !== 'Default') {
    view.ApiDataType = viewOptions.apiDataType;
  }
  if (viewOptions.apiColumnKeyDisplayType && viewOptions.apiColumnKeyDisplayType !== 'ColumnName') {
    view.ApiColumnKeyDisplayType = viewOptions.apiColumnKeyDisplayType;
  }
  if (viewOptions.apiColumnValueDisplayType && viewOptions.apiColumnValueDisplayType !== 'DisplayValue') {
    view.ApiColumnValueDisplayType = viewOptions.apiColumnValueDisplayType;
  }

  // ==================== APIカラムハッシュ（JSON） ====================
  if (viewOptions.apiColumnHash) {
    const columnHash = parseJsonFieldForView(viewOptions.apiColumnHash);
    if (columnHash) view.ApiColumnHash = columnHash;
  }

  // ==================== セッションマージオプション ====================
  if (viewOptions.mergeSessionViewFilters !== undefined) {
    view.MergeSessionViewFilters = viewOptions.mergeSessionViewFilters;
  }
  if (viewOptions.mergeSessionViewSorters !== undefined) {
    view.MergeSessionViewSorters = viewOptions.mergeSessionViewSorters;
  }

  return Object.keys(view).length > 0 ? view : undefined;
}

/**
 * ビューオプション用のJSONフィールドをパース
 */
function parseJsonFieldForView(value: unknown): IDataObject | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Object.keys(parsed).length > 0 ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return value as IDataObject;
}
