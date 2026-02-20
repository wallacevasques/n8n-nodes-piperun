import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PiperunApi implements ICredentialType {
	name = 'piperunApi';
	displayName = 'Piperun API';
	documentationUrl = 'https://developers.pipe.run/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.pipe.run/api/v1',
			description: 'A URL base da sua conta para a API (ex: https://dominio.pipe.run/api/v1)',
			required: true,
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'O seu Token de Integração do PipeRun',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Token: '{{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/pessoas',
		},
	};
}
