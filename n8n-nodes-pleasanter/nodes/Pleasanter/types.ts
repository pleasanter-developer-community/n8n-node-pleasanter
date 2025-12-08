/**
 * Pleasanter API 型定義
 * 参照: https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml
 */

// APIリクエスト基底型
export interface IPleasanterApiRequest {
  ApiVersion: '1.0' | '1.1';
  ApiKey: string;
}

// 取得リクエスト
export interface IPleasanterGetRequest extends IPleasanterApiRequest {
  View?: IPleasanterView;
  Offset?: number;
  PageSize?: number;
}

// 作成/更新リクエスト
export interface IPleasanterCreateUpdateRequest extends IPleasanterApiRequest {
  Title?: string;
  Body?: string;
  StartTime?: string;
  CompletionTime?: string;
  WorkValue?: number;
  ProgressRate?: number;
  Status?: number;
  Manager?: number;
  Owner?: number;
  Locked?: boolean;
  Comments?: string;
  ClassHash?: Record<string, string>;
  NumHash?: Record<string, number>;
  DateHash?: Record<string, string>;
  DescriptionHash?: Record<string, string>;
  CheckHash?: Record<string, boolean>;
  AttachmentsHash?: Record<string, IPleasanterAttachment[]>;
}

// 削除リクエスト
export interface IPleasanterDeleteRequest extends IPleasanterApiRequest {}

// ビュー（フィルタ/ソート）
export interface IPleasanterView {
  Incomplete?: boolean;
  Own?: boolean;
  NearCompletionTime?: boolean;
  Delay?: boolean;
  Overdue?: boolean;
  Search?: string;
  ColumnFilterHash?: Record<string, string>;
  ColumnSorterHash?: Record<string, string>;
}

// 添付ファイル
export interface IPleasanterAttachment {
  Guid?: string;
  Name?: string;
  Size?: number;
  ContentType?: string;
  Base64?: string;
}

// APIレスポンス
export interface IPleasanterApiResponse {
  StatusCode: number;
  LimitPerDate?: number;
  LimitRemaining?: number;
  Message?: string;
  [key: string]: unknown;
}

// 取得レスポンス
export interface IPleasanterGetResponse extends IPleasanterApiResponse {
  Response?: {
    Offset?: number;
    PageSize?: number;
    TotalCount?: number;
    Data?: IPleasanterRecord[];
  };
}

// 作成/更新/削除レスポンス
export interface IPleasanterMutationResponse extends IPleasanterApiResponse {
  Id?: number;
  Message?: string;
}

// レコードデータ
export interface IPleasanterRecord {
  SiteId?: number;
  UpdatedTime?: string;
  ResultId?: number;
  IssueId?: number;
  Ver?: number;
  Title?: string;
  Body?: string;
  Status?: number;
  Manager?: number;
  Owner?: number;
  Locked?: boolean;
  Comments?: string;
  Creator?: number;
  Updator?: number;
  CreatedTime?: string;
  ItemTitle?: string;
  StartTime?: string;
  CompletionTime?: string;
  WorkValue?: number;
  ProgressRate?: number;
  RemainingWorkValue?: number;
  ClassHash?: Record<string, string>;
  NumHash?: Record<string, number>;
  DateHash?: Record<string, string>;
  DescriptionHash?: Record<string, string>;
  CheckHash?: Record<string, boolean>;
  AttachmentsHash?: Record<string, IPleasanterAttachment[]>;
}

// 認証情報
export interface IPleasanterCredentials {
  baseUrl: string;
  apiKey: string;
  apiVersion: '1.0' | '1.1';
}
