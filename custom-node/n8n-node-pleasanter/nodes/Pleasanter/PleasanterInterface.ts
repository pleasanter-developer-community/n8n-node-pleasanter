/**
 * Pleasanter API 型定義
 */

export interface IPleasanterCredentials {
	baseUrl: string;
	apiKey: string;
	apiVersion: string;
}

export interface IPleasanterView {
	Incomplete?: boolean;
	Own?: boolean;
	Search?: string;
	ColumnFilterHash?: Record<string, string>;
	ColumnSorterHash?: Record<string, string>;
	ApiDataType?: 'Default' | 'KeyValues';
	ApiColumnKeyDisplayType?: 'LabelText' | 'ColumnName';
	ApiColumnValueDisplayType?: 'DisplayValue' | 'Value' | 'Text';
}

export interface IPleasanterRequestBody {
	ApiVersion?: string;
	ApiKey: string;
	View?: IPleasanterView;
	Title?: string;
	Body?: string;
	Status?: number;
	Manager?: number;
	Owner?: number;
	StartTime?: string;
	CompletionTime?: string;
	WorkValue?: number;
	ProgressRate?: number;
	Comments?: string;
	Locked?: boolean;
	ClassHash?: Record<string, string>;
	NumHash?: Record<string, number>;
	DateHash?: Record<string, string>;
	DescriptionHash?: Record<string, string>;
	CheckHash?: Record<string, boolean>;
}

export interface IPleasanterResponseData {
	ResultId?: number;
	IssueId?: number;
	SiteId?: number;
	Title?: string;
	Body?: string;
	Status?: number;
	Manager?: number;
	Owner?: number;
	StartTime?: string;
	CompletionTime?: string;
	WorkValue?: number;
	ProgressRate?: number;
	Comments?: string;
	Locked?: boolean;
	ClassHash?: Record<string, string>;
	NumHash?: Record<string, number>;
	DateHash?: Record<string, string>;
	DescriptionHash?: Record<string, string>;
	CheckHash?: Record<string, boolean>;
	[key: string]: unknown;
}

export interface IPleasanterResponse {
	Id?: number;
	StatusCode: number;
	LimitPerDate?: number;
	LimitRemaining?: number;
	Message?: string;
	Response?: {
		Offset?: number;
		PageSize?: number;
		TotalCount?: number;
		Data?: IPleasanterResponseData[];
	};
}

export type PleasanterOperation = 'get' | 'create' | 'update' | 'delete';
