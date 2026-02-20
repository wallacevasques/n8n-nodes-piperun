import { INodeType } from 'n8n-workflow';
import { Piperun } from './nodes/Piperun/Piperun.node';
import { PiperunApi } from './credentials/PiperunApi.credentials';

export const nodeTypes: INodeType[] = [
    new Piperun(),
];

export const credentialTypes = [
    PiperunApi,
];
