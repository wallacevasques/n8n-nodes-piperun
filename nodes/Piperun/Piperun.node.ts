import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Piperun implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Piperun',
        name: 'piperun',
        icon: 'file:piperun.svg',
        group: ['transform'],
        version: [1],
        defaultVersion: 1,
        subtitle: '={{$parameter["operacao"] + ": " + $parameter["recurso"]}}',
        description: 'Integração com PipeRun CRM de Vendas brasileiro - gerencie pessoas, oportunidades, etapas e mais.',
        defaults: {
            name: 'Piperun',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'piperunApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '={{$credentials.baseUrl}}',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        /**
         * Observações sobre Rate Limit:
         * A API do PipeRun permite até 100 requisições por minuto. 
         * É recomendado adicionar atrasos em loops maiores em seus workflows 
         * para não receber o status 429 Too Many Requests.
         * 
         * Os erros HTTP (400-500) retornados são tratados nativamente pelo backend
         * de Nodes Declarativos do n8n, retornando os detalhes repassados pela API.
         */
        properties: [
            {
                displayName: 'Resource',
                name: 'recurso',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Atividade',
                        value: 'atividade',
                    },
                    {
                        name: 'Empresa',
                        value: 'empresa',
                    },
                    {
                        name: 'Etapa',
                        value: 'fase',
                    },
                    {
                        name: 'Funil',
                        value: 'funil',
                    },
                    {
                        name: 'Nota',
                        value: 'nota',
                    },
                    {
                        name: 'Oportunidade',
                        value: 'negocio',
                    },
                    {
                        name: 'Pessoa',
                        value: 'pessoa',
                    },
                    {
                        name: 'Proposta',
                        value: 'proposta',
                    },
                    {
                        name: 'Tag',
                        value: 'tag',
                    },
                ],
                default: 'pessoa',
            },

            // ----------------------------------
            //         Pessoa Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['pessoa'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Cria uma nova pessoa no CRM. Representa um contato individual.',
                        action: 'Criar uma pessoa',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/pessoas',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Remove permanentemente uma pessoa do CRM usando o ID.',
                        action: 'Deletar uma pessoa',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/pessoas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Recupera todos os detalhes de uma pessoa específica via ID.',
                        action: 'Buscar uma pessoa',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/pessoas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Retorna uma lista paginada de pessoas cadastradas.',
                        action: 'Listar pessoas',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/pessoas',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Atualiza campos existentes de uma pessoa (nome, e-mail, etc.).',
                        action: 'Atualizar uma pessoa',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/pessoas/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //      Oportunidade Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['negocio'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Cria uma nova oportunidade de venda (Deal). Requer ID da Etapa.',
                        action: 'Criar uma oportunidade',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/negocios',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Deleta uma oportunidade específica do funil.',
                        action: 'Deletar uma oportunidade',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/negocios/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Obtém dados detalhados (valor, etapa atual, tags) de uma oportunidade.',
                        action: 'Buscar uma oportunidade',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/negocios/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista oportunidades abertas ou fechadas de acordo com os filtros.',
                        action: 'Listar oportunidades',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/negocios',
                            },
                        },
                    },
                    {
                        name: 'Move To Etapa',
                        value: 'moveToFase',
                        description: 'Muda o estágio da oportunidade dentro do funil de vendas.',
                        action: 'Mover para etapa uma oportunidade',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/negocios/{{$parameter["id"]}}/moverFase',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Modifica informações como título, valor ou proprietário da oportunidade.',
                        action: 'Atualizar uma oportunidade',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/negocios/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //      List Filters (Query)
            // ----------------------------------
            {
                displayName: 'Status da Oportunidade',
                name: 'status',
                type: 'options',
                options: [
                    {
                        name: 'Aberto',
                        value: '1',
                    },
                    {
                        name: 'Ganho (Vencido)',
                        value: '2',
                    },
                    {
                        name: 'Perdido (Perdido)',
                        value: '3',
                    },
                ],
                default: '1',
                displayOptions: {
                    show: {
                        recurso: ['negocio'],
                        operacao: ['list'],
                    },
                },
                description: 'Filtra as oportunidades por status atual.',
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },

            // ----------------------------------
            //        Empresa Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['empresa'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Cadastra uma nova Organização/Empresa no CRM.',
                        action: 'Criar uma empresa',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/empresas',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Exclui o registro da empresa.',
                        action: 'Deletar uma empresa',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/empresas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Busca dados da empresa (CNPJ, endereço, contatos vinculados).',
                        action: 'Buscar uma empresa',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/empresas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista todas as empresas registradas.',
                        action: 'Listar empresas',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/empresas',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Altera informações cadastrais da empresa.',
                        action: 'Atualizar uma empresa',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/empresas/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //       Atividade Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['atividade'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Agenda uma nova atividade (Tarefa, Reunião, Ligação).',
                        action: 'Criar uma atividade',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/atividades',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Remove uma atividade da agenda.',
                        action: 'Deletar uma atividade',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/atividades/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Vê detalhes, horários e observações de uma atividade.',
                        action: 'Buscar uma atividade',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/atividades/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista as atividades do usuário ou da conta.',
                        action: 'Listar atividades',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/atividades',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Marca como concluída ou altera o horário de uma atividade.',
                        action: 'Atualizar uma atividade',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/atividades/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //          Funil Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['funil'],
                    },
                },
                options: [
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista os Pipelines (Funis de Venda) configurados no CRM.',
                        action: 'Listar funis',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/funis',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //          Etapa Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['fase'],
                    },
                },
                options: [
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Retorna as etapas de um funil para obter o ID necessário no Business.',
                        action: 'Listar etapas',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/fases',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //          Nota Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['nota'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Adiciona uma nota (comentário) a uma pessoa ou oportunidade.',
                        action: 'Criar uma nota',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/notas',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Remove uma nota permanentemente.',
                        action: 'Deletar uma nota',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/notas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Busca o conteúdo detalhado de uma nota específica.',
                        action: 'Buscar uma nota',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/notas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista as notas registradas no CRM.',
                        action: 'Listar notas',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/notas',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Atualiza o texto de uma nota existente.',
                        action: 'Atualizar uma nota',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/notas/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //        Proposta Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['proposta'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Gera uma nova proposta comercial vinculada a uma oportunidade.',
                        action: 'Criar uma proposta',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/propostas',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Remove uma proposta comercial.',
                        action: 'Deletar uma proposta',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/propostas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Obtém detalhes de uma proposta específica (valores, itens, status).',
                        action: 'Buscar uma proposta',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/propostas/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista as propostas registradas.',
                        action: 'Listar propostas',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/propostas',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Atualiza informações de uma proposta.',
                        action: 'Atualizar uma proposta',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/propostas/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //          Tag Operations
            // ----------------------------------
            {
                displayName: 'Operation',
                name: 'operacao',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        recurso: ['tag'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Cria uma nova tag para organização.',
                        action: 'Criar uma tag',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/tags',
                            },
                        },
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Apaga uma tag permanentemente.',
                        action: 'Deletar uma tag',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/tags/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Busca informações de uma tag pelo ID.',
                        action: 'Buscar uma tag',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/tags/{{$parameter["id"]}}',
                            },
                        },
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'Lista todas as tags da conta.',
                        action: 'Listar tags',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/tags',
                            },
                        },
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Altera o nome de uma tag.',
                        action: 'Atualizar uma tag',
                        routing: {
                            request: {
                                method: 'PUT',
                                url: '=/tags/{{$parameter["id"]}}',
                            },
                        },
                    },
                ],
                default: 'list',
            },

            // ----------------------------------
            //      ID Identifiers (Path)
            // ----------------------------------
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        recurso: ['pessoa', 'negocio', 'empresa', 'atividade', 'nota', 'proposta', 'tag'],
                        operacao: ['get', 'update', 'delete', 'moveToFase'],
                    },
                },
                description: 'O identificador único (ID numérico) do registro no banco de dados do PipeRun.',
            },

            // ----------------------------------
            //        Pagination (Query)
            // ----------------------------------
            {
                displayName: 'Página',
                name: 'pagina',
                type: 'number',
                default: 1,
                displayOptions: {
                    show: {
                        recurso: ['pessoa', 'negocio', 'fase', 'empresa', 'atividade', 'nota', 'proposta', 'tag', 'funil'],
                        operacao: ['list'],
                    },
                },
                description: 'Número da página de resultados que deseja buscar (Padrão: 1).',
                routing: {
                    send: {
                        type: 'query',
                        property: 'pagina',
                    },
                },
            },
            {
                displayName: 'Limite',
                name: 'limite',
                type: 'number',
                default: 50,
                displayOptions: {
                    show: {
                        recurso: ['pessoa', 'negocio', 'fase', 'empresa', 'atividade', 'nota', 'proposta', 'tag', 'funil'],
                        operacao: ['list'],
                    },
                },
                description: 'Quantidade de registros por página (Máximo 100).',
                routing: {
                    send: {
                        type: 'query',
                        property: 'limite',
                    },
                },
            },

            // ----------------------------------
            //           Fields (Body)
            // ----------------------------------
            {
                displayName: 'Nome/Título',
                name: 'nome',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        recurso: ['pessoa', 'negocio', 'empresa', 'tag'],
                        operacao: ['create'],
                    },
                },
                description: 'Nome da pessoa, empresa ou título da oportunidade (Ex: Oportunidade - ABC LTDA).',
                routing: {
                    send: {
                        type: 'body',
                        property: 'nome',
                    },
                },
            },
            {
                displayName: 'Assunto',
                name: 'titulo',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        recurso: ['atividade'],
                        operacao: ['create'],
                    },
                },
                description: 'O título ou assunto da tarefa que aparecerá na agenda.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'titulo',
                    },
                },
            },
            {
                displayName: 'ID da Etapa',
                name: 'id_fase',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        recurso: ['negocio'],
                        operacao: ['create', 'moveToFase'],
                    },
                },
                description: 'O ID numérico da etapa do funil onde a oportunidade deve ser criada ou movida.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'id_fase',
                    },
                },
            },
            {
                displayName: 'ID da Oportunidade',
                name: 'negocio_id',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        recurso: ['proposta'],
                        operacao: ['create'],
                    },
                },
                description: 'O ID da oportunidade à qual este registro está vinculado.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'negocio_id',
                    },
                },
            },
            {
                displayName: 'Conteúdo da Nota',
                name: 'texto',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        recurso: ['nota'],
                        operacao: ['create'],
                    },
                },
                description: 'O texto que será gravado no histórico do registro.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'texto',
                    },
                },
            },

            // ----------------------------------
            //        Additional Fields
            // ----------------------------------
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Adicionar Campo',
                default: {},
                displayOptions: {
                    show: {
                        recurso: ['pessoa', 'negocio', 'empresa', 'atividade', 'nota'],
                        operacao: ['create', 'update'],
                    },
                },
                description: 'Campos opcionais adicionais suportados pela API do PipeRun para enriquecer o registro.',
                options: [
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        default: '',
                        description: 'Endereço de e-mail principal do contato.',
                    },
                    {
                        displayName: 'Telefone',
                        name: 'telefone',
                        type: 'string',
                        default: '',
                        description: 'Número de telefone ou celular (com DDD).',
                    },
                    {
                        displayName: 'CPF/CNPJ',
                        name: 'cpf_cnpj',
                        type: 'string',
                        default: '',
                        description: 'Identificação fiscal do registro.',
                    },
                    {
                        displayName: 'Valor',
                        name: 'valor',
                        type: 'number',
                        default: 0,
                        description: 'Valor monetário base da oportunidade.',
                    },
                    {
                        displayName: 'ID da Empresa (Vinculada)',
                        name: 'id_empresa',
                        type: 'string',
                        default: '',
                        description: 'Vincule este registro a uma empresa existente via ID.',
                    },
                    {
                        displayName: 'ID da Pessoa (Vinculada)',
                        name: 'id_pessoa',
                        type: 'string',
                        default: '',
                        description: 'Vincule esta oportunidade a uma pessoa específica via ID.',
                    },
                    {
                        displayName: 'Pessoa ID (Para Nota)',
                        name: 'pessoa_id',
                        type: 'string',
                        default: '',
                        description: 'ID da pessoa onde a nota será anexada (opcional se usar Oportunidade ID).',
                    },
                    {
                        displayName: 'Probabilidade (%)',
                        name: 'probabilidade',
                        type: 'number',
                        default: 0,
                        description: 'Chance de fechamento da oportunidade de 0 a 100.',
                    },
                    {
                        displayName: 'Data de Vencimento',
                        name: 'data_vencimento',
                        type: 'dateTime',
                        default: '',
                        description: 'Prazo limite para conclusão da atividade.',
                    },
                ],
                routing: {
                    send: {
                        type: 'body',
                        property: '={{$value}}',
                    },
                },
            },
        ],
    };
}
