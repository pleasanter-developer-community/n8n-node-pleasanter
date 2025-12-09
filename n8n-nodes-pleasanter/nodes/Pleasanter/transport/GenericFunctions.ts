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
 * 全てのフィールドはrecordDataコレクション内にあり、明示的に指定された項目のみ送信される
 */
export function buildRecordData(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  const result: IDataObject = {};
  const recordData = this.getNodeParameter('recordData', itemIndex, {}) as IDataObject;

  // ==================== 基本フィールド ====================
  if (recordData.title !== undefined && recordData.title !== '') {
    result.Title = recordData.title as string;
  }

  if (recordData.body !== undefined && recordData.body !== '') {
    result.Body = recordData.body as string;
  }

  if (recordData.status !== undefined) {
    result.Status = Number(recordData.status);
  }

  if (recordData.manager !== undefined) {
    result.Manager = Number(recordData.manager);
  }

  if (recordData.owner !== undefined) {
    result.Owner = Number(recordData.owner);
  }

  if (recordData.comments !== undefined && recordData.comments !== '') {
    result.Comments = recordData.comments as string;
  }

  if (recordData.locked !== undefined) {
    result.Locked = recordData.locked as boolean;
  }

  // ==================== 日付フィールド（期限付きテーブルのみ） ====================
  if (recordData.startTime !== undefined && recordData.startTime !== '') {
    result.StartTime = recordData.startTime as string;
  }

  if (recordData.completionTime !== undefined && recordData.completionTime !== '') {
    result.CompletionTime = recordData.completionTime as string;
  }

  // ==================== 進捗フィールド（期限付きテーブルのみ） ====================
  if (recordData.workValue !== undefined) {
    result.WorkValue = Number(recordData.workValue);
  }

  if (recordData.progressRate !== undefined) {
    result.ProgressRate = Number(recordData.progressRate);
  }

  if (recordData.remainingWorkValue !== undefined) {
    result.RemainingWorkValue = Number(recordData.remainingWorkValue);
  }

  // ==================== ハッシュフィールド ====================
  if (recordData.classHash) {
    result.ClassHash = parseJsonField(recordData.classHash);
  }
  if (recordData.numHash) {
    result.NumHash = parseJsonField(recordData.numHash);
  }
  if (recordData.dateHash) {
    result.DateHash = parseJsonField(recordData.dateHash);
  }
  if (recordData.descriptionHash) {
    result.DescriptionHash = parseJsonField(recordData.descriptionHash);
  }
  if (recordData.checkHash) {
    result.CheckHash = parseJsonField(recordData.checkHash);
  }
  if (recordData.attachmentsHash) {
    result.AttachmentsHash = parseJsonField(recordData.attachmentsHash);
  }

  return result;
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
