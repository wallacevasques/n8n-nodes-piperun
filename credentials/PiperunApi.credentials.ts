import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class PiperunApi implements ICredentialType {
	name = "piperunApi";
	displayName = "Piperun API";
	documentationUrl = "https://developers.pipe.run/";

	properties: INodeProperties[] = [
		{
			displayName: "Base URL",
			name: "baseUrl",
			type: "string",
			default: "https://api.pipe.run/v1/",
			description:
				"The base URL of your account for the API (e.g., https://api.pipe.run/v1/)",
			required: true,
		},
		{
			displayName: "Token",
			name: "token",
			type: "string",
			typeOptions: { password: true },
			default: "",
			description: "Your PipeRun Integration Token",
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				token: "={{$credentials.token}}",
				accept: "application/json",
				"content-type": "application/json",
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: "={{$credentials.baseUrl}}",
			url: "me",
		},
	};
}
