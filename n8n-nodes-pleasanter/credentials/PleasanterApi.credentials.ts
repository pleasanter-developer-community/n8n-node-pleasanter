import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class PleasanterApi implements ICredentialType {
  name = 'pleasanterApi';
  displayName = 'Pleasanter API';
  documentationUrl = 'https://pleasanter.org/manual';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-pleasanter-server.com',
      description: 'The base URL of your Pleasanter instance',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'The API key for authentication',
      required: true,
    },
    {
      displayName: 'API Version',
      name: 'apiVersion',
      type: 'options',
      options: [
        {
          name: '1.0',
          value: '1.0',
        },
        {
          name: '1.1',
          value: '1.1',
        },
      ],
      default: '1.1',
      description: 'The API version to use',
    },
  ];

  // Pleasanterはボディベース認証を使用（ヘッダーベースではない）
  // 認証はGenericFunctions.tsで処理
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      method: 'POST',
      url: '={{$credentials.baseUrl}}/api/items/1/get',
      body: {
        ApiVersion: '={{$credentials.apiVersion}}',
        ApiKey: '={{$credentials.apiKey}}',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}
