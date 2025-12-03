import type {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
	Icon,
} from 'n8n-workflow';

export class PleasanterApi implements ICredentialType {
	name = 'pleasanterApi';

	displayName = 'Pleasanter API';

	documentationUrl = 'https://pleasanter.org/manual/api';

	icon: Icon = 'file:../icons/pleasanter.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://pleasanter.example.com',
			description: 'PleasanterサーバーのベースURL（末尾のスラッシュは不要）',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: '認証用APIキー',
			required: true,
		},
		{
			displayName: 'API Version',
			name: 'apiVersion',
			type: 'options',
			options: [
				{ name: '1.1', value: '1.1' },
				{ name: '1.0', value: '1.0' },
			],
			default: '1.1',
			description: 'PleasanterのAPIバージョン',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: '={{$credentials.baseUrl}}/api/items/1/get',
			body: {
				ApiVersion: '={{$credentials.apiVersion}}',
				ApiKey: '={{$credentials.apiKey}}',
			},
			json: true,
		},
	};
}
