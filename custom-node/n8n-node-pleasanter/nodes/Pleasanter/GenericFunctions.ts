import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IPleasanterCredentials, IPleasanterResponse } from './PleasanterInterface';

/**
 * Pleasanter API リクエスト共通関数
 * APIキーをリクエストボディに含める特殊な認証方式に対応
 */
export async function pleasanterApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IPleasanterResponse> {
	const credentials = (await this.getCredentials('pleasanterApi')) as IPleasanterCredentials;

	// APIキーとバージョンをリクエストボディに追加
	const requestBody: IDataObject = {
		...body,
		ApiKey: credentials.apiKey,
	};

	if (credentials.apiVersion) {
		requestBody.ApiVersion = credentials.apiVersion;
	}

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl.replace(/\/$/, '')}/api${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		body: requestBody,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IPleasanterResponse;

		// Pleasanter APIはHTTP 200でもStatusCodeでエラーを返すことがある
		if (response.StatusCode && response.StatusCode >= 400) {
			throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
				message: response.Message || `API Error: ${response.StatusCode}`,
				httpCode: String(response.StatusCode),
			});
		}

		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
