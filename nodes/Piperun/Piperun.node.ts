import { INodeType, INodeTypeDescription } from "n8n-workflow";

export class Piperun implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Piperun",
		name: "piperun",
		icon: "file:piperun.svg",
		group: ["transform"],
		version: [1],
		defaultVersion: 1,
		subtitle:
			'={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			"Integration with Piperun CRM - manage people, deals, stages, and more.",
		defaults: {
			name: "Piperun",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "piperunApi",
				required: true,
			},
		],
		requestDefaults: {
			baseURL: "={{$credentials.baseUrl}}",
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
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Activity",
						value: "activity",
					},
					{
						name: "Company",
						value: "company",
					},
					{
						name: "Deal",
						value: "deal",
					},
					{
						name: "Funnel",
						value: "funnel",
					},
					{
						name: "Item",
						value: "item",
					},
					{
						name: "User",
						value: "user",
					},
					{
						name: "Note",
						value: "note",
					},
					{
						name: "Person",
						value: "person",
					},
					{
						name: "Proposal",
						value: "proposal",
					},
					{
						name: "Stage",
						value: "stage",
					},
					{
						name: "Tag",
						value: "tag",
					},
				],
				default: "person",
			},

			// ----------------------------------
			//         Person Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["person"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description:
							"Create a new person in the CRM. Represents an individual contact.",
						action: "Create a person",
						routing: {
							request: {
								method: "POST",
								url: "persons",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description:
							"Permanently remove a person from the CRM using the ID.",
						action: "Delete a person",
						routing: {
							request: {
								method: "DELETE",
								url: '=persons/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description:
							"Retrieve all details of a specific person via ID.",
						action: "Get a person",
						routing: {
							request: {
								method: "GET",
								url: '=persons/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description:
							"Returns a paginated list of registered people.",
						action: "List people",
						routing: {
							request: {
								method: "GET",
								url: "persons",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description:
							"Update existing fields of a person (name, email, etc.).",
						action: "Update a person",
						routing: {
							request: {
								method: "PUT",
								url: '=persons/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//      Deal Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["deal"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description:
							"Create a new sales opportunity (Deal). Requires Stage ID.",
						action: "Create a deal",
						routing: {
							request: {
								method: "POST",
								url: "deals",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Delete a specific deal from the funnel.",
						action: "Delete a deal",
						routing: {
							request: {
								method: "DELETE",
								url: '=deals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description:
							"Get detailed data (value, current stage, tags) of a deal.",
						action: "Get a deal",
						routing: {
							request: {
								method: "GET",
								url: '=deals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description:
							"List open or closed deals according to filters.",
						routing: {
							request: {
								method: "GET",
								url: "deals",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Move To Stage",
						value: "moveToStage",
						description:
							"Change the deal stage within the sales funnel.",
						action: "Move a deal to a stage",
						routing: {
							request: {
								method: "PUT",
								url: '=deals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description:
							"Modify information such as title, value, or owner of the deal.",
						action: "Update a deal",
						routing: {
							request: {
								method: "PUT",
								url: '=deals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List Origin Groups",
						value: "listOriginGroups",
						description:
							"List groups of origins for opportunities.",
						action: "List origin groups",
						routing: {
							request: {
								method: "GET",
								url: "originGroups",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Get Origin Group",
						value: "getOriginGroup",
						description: "Get details of a specific origin group.",
						action: "Get an origin group",
						routing: {
							request: {
								method: "GET",
								url: '=originGroups/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List Linked Items",
						value: "listLinkedItems",
						description:
							"List items (products) linked to a specific deal.",
						action: "List linked items",
						routing: {
							request: {
								method: "GET",
								url: '=deals/{{$parameter["deal_id"]}}/product',
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Get Linked Item",
						value: "getLinkedItem",
						description: "Get details of a specific linked item.",
						action: "Get a linked item",
						routing: {
							request: {
								method: "GET",
								url: '=deals/{{$parameter["deal_id"]}}/product/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List Origins",
						value: "listOrigins",
						description: "List opportunity origins.",
						action: "List origins",
						routing: {
							request: {
								method: "GET",
								url: "origins",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Get Origin",
						value: "getOrigin",
						description:
							"Get details of a specific opportunity origin.",
						action: "Get an origin",
						routing: {
							request: {
								method: "GET",
								url: '=origins/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//      List Filters (Query)
			// ----------------------------------
			// ----------------------------------
			//        Person Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "personListAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["person"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},
					{
						displayName: "Email",
						name: "email",
						type: "string",
						default: "",
						routing: { send: { property: "email", type: "query" } },
					},
					{
						displayName: "CPF",
						name: "cpf",
						type: "string",
						default: "",
						routing: { send: { property: "cpf", type: "query" } },
					},
					{
						displayName: "Company ID",
						name: "company_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "company_id", type: "query" },
						},
					},
					{
						displayName: "Tag ID",
						name: "tag_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "tag_id", type: "query" },
						},
					},
				],
			},

			// ----------------------------------
			//        Company Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "companyListAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["company"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},
					{
						displayName: "CNPJ",
						name: "cnpj",
						type: "string",
						default: "",
						routing: { send: { property: "cnpj", type: "query" } },
					},
				],
			},

			// ----------------------------------
			//      Deal Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "dealListAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Status",
						name: "status",
						type: "options",
						options: [
							{ name: "Open", value: "0" },
							{ name: "Won", value: "1" },
							{ name: "Lost", value: "3" },
						],
						default: "0",
						routing: {
							send: { property: "status", type: "query" },
						},
					},
					{
						displayName: "Person ID",
						name: "person_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "person_id", type: "query" },
						},
					},
					{
						displayName: "Company ID",
						name: "company_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "company_id", type: "query" },
						},
					},
					{
						displayName: "Owner ID",
						name: "owner_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "owner_id", type: "query" },
						},
					},
					{
						displayName: "Pipeline ID",
						name: "pipeline_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "pipeline_id", type: "query" },
						},
					},
					{
						displayName: "Stage ID",
						name: "stage_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "stage_id", type: "query" },
						},
					},
					{
						displayName: "Title",
						name: "title",
						type: "string",
						default: "",
						routing: { send: { property: "title", type: "query" } },
					},
					{
						displayName: "Sort",
						name: "sort",
						type: "options",
						options: [
							{ name: "Ascending", value: "ASC" },
							{ name: "Descending", value: "DESC" },
						],
						default: "DESC",
						routing: { send: { property: "sort", type: "query" } },
					},
					{
						displayName: "With (Relations)",
						name: "with",
						type: "string",
						default: "items,persons,companies",
						description:
							"Comma separated list of relations to include (e.g., items,persons,companies,users).",
						routing: { send: { property: "with", type: "query" } },
					},
					{
						displayName: "Origin ID",
						name: "origin_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "origin_id", type: "query" },
						},
					},
					{
						displayName: "Tag ID",
						name: "tag_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "tag_id", type: "query" },
						},
					},
					{
						displayName: "Temperature",
						name: "temperature",
						type: "options",
						options: [
							{ name: "Very Hot", value: 1 },
							{ name: "Hot", value: 2 },
							{ name: "Warm", value: 3 },
							{ name: "Cold", value: 4 },
						],
						default: 2,
						routing: {
							send: { property: "temperature", type: "query" },
						},
					},
				],
			},

			// ----------------------------------
			//        Company Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["company"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description:
							"Register a new Organization/Company in the CRM.",
						action: "Create a company",
						routing: {
							request: {
								method: "POST",
								url: "companies",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Delete the company record.",
						action: "Delete a company",
						routing: {
							request: {
								method: "DELETE",
								url: '=companies/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description:
							"Search for company data (Tax ID, address, linked contacts).",
						action: "Get a company",
						routing: {
							request: {
								method: "GET",
								url: '=companies/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List all registered companies.",
						routing: {
							request: {
								method: "GET",
								url: "companies",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description: "Change company registration information.",
						action: "Update a company",
						routing: {
							request: {
								method: "PUT",
								url: '=companies/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//       Activity Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["activity"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description:
							"Schedule a new activity (Task, Meeting, Call).",
						action: "Create an activity",
						routing: {
							request: {
								method: "POST",
								url: "activities",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Remove an activity from the schedule.",
						action: "Delete an activity",
						routing: {
							request: {
								method: "DELETE",
								url: '=activities/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description:
							"View details, times, and observations of an activity.",
						action: "Get an activity",
						routing: {
							request: {
								method: "GET",
								url: '=activities/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List the user's or account's activities.",
						routing: {
							request: {
								method: "GET",
								url: "activities",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description:
							"Mark as completed or change the time of an activity.",
						action: "Update an activity",
						routing: {
							request: {
								method: "PUT",
								url: '=activities/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//      Activity Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "activityAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["activity"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Status",
						name: "status",
						type: "options",
						options: [
							{ name: "Open", value: "0" },
							{ name: "Finished", value: "2" },
							{ name: "No Show", value: "4" },
						],
						default: "0",
						routing: {
							send: { property: "status", type: "query" },
						},
					},
					{
						displayName: "Deal ID",
						name: "deal_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "deal_id", type: "query" },
						},
					},
					{
						displayName: "Owner ID",
						name: "owner_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "owner_id", type: "query" },
						},
					},
					{
						displayName: "Requester ID",
						name: "requester_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "requester_id", type: "query" },
						},
					},
					{
						displayName: "Activity Type ID",
						name: "activity_type_id",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "activity_type_id",
								type: "query",
							},
						},
					},
					{
						displayName: "Title",
						name: "title",
						type: "string",
						default: "",
						routing: { send: { property: "title", type: "query" } },
					},
				],
			},

			// ----------------------------------
			//          Funnel Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["funnel"],
					},
				},
				options: [
					{
						name: "List",
						value: "list",
						description:
							"List the Pipelines (Sales Funnels) configured in the CRM.",
						action: "List funnels",
						routing: {
							request: {
								method: "GET",
								url: "pipelines",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//        Funnel Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "funnelAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["funnel"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},

					{
						displayName: "Sort",
						name: "sort",
						type: "options",
						options: [
							{ name: "Ascending", value: "ASC" },
							{ name: "Descending", value: "DESC" },
						],
						default: "DESC",
						routing: { send: { property: "sort", type: "query" } },
					},
				],
			},

			// ----------------------------------
			//          Stage Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["stage"],
					},
				},
				options: [
					{
						name: "List",
						value: "list",
						description:
							"Returns the stages of a funnel to obtain the ID required in the Business.",
						action: "List stages",
						routing: {
							request: {
								method: "GET",
								url: "stages",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//        Stage Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "stageAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["stage"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},

					{
						displayName: "Sort",
						name: "sort",
						type: "options",
						options: [
							{ name: "Ascending", value: "ASC" },
							{ name: "Descending", value: "DESC" },
						],
						default: "DESC",
						routing: { send: { property: "sort", type: "query" } },
					},
				],
			},

			// ----------------------------------
			//          Note Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["note"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description:
							"Add a note (comment) to a person or deal.",
						action: "Create a note",
						routing: {
							request: {
								method: "POST",
								url: "notes",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Remove a note permanently.",
						action: "Delete a note",
						routing: {
							request: {
								method: "DELETE",
								url: '=notes/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description:
							"Search for the detailed content of a specific note.",
						action: "Get a note",
						routing: {
							request: {
								method: "GET",
								url: '=notes/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List the notes registered in the CRM.",
						action: "List notes",
						routing: {
							request: {
								method: "GET",
								url: "notes",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description: "Update the text of an existing note.",
						action: "Update a note",
						routing: {
							request: {
								method: "PUT",
								url: '=notes/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//        Note Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "noteAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["note"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "User ID",
						name: "user_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "user_id", type: "query" },
						},
					},
					{
						displayName: "Deal ID",
						name: "deal_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "deal_id", type: "query" },
						},
					},
					{
						displayName: "Person ID",
						name: "person_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "person_id", type: "query" },
						},
					},
				],
			},

			// ----------------------------------
			//        Proposal Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["proposal"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description:
							"Generate a new commercial proposal linked to a deal.",
						action: "Create a proposal",
						routing: {
							request: {
								method: "POST",
								url: "proposals",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Remove a commercial proposal.",
						action: "Delete a proposal",
						routing: {
							request: {
								method: "DELETE",
								url: '=proposals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description:
							"Get details of a specific proposal (values, items, status).",
						action: "Get a proposal",
						routing: {
							request: {
								method: "GET",
								url: '=proposals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List the registered proposals.",
						action: "List proposals",
						routing: {
							request: {
								method: "GET",
								url: "proposals",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},

					{
						name: "Update",
						value: "update",
						description: "Update proposal information.",
						action: "Update a proposal",
						routing: {
							request: {
								method: "PUT",
								url: '=proposals/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List Signature Documents",
						value: "listSignatureDocuments",
						description: "List documents sent for signatures.",
						action: "List signature documents",
						routing: {
							request: {
								method: "GET",
								url: "signatureDocuments",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Get Signature Document",
						value: "getSignatureDocument",
						description:
							"Get details of a specific signature document.",
						action: "Get a signature document",
						routing: {
							request: {
								method: "GET",
								url: '=signatureDocuments/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List Signatures",
						value: "listSignatures",
						description: "List signatures from the CRM.",
						action: "List signatures",
						routing: {
							request: {
								method: "GET",
								url: "signatures",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Get Signature",
						value: "getSignature",
						description: "Get details of a specific signature.",
						action: "Get a signature",
						routing: {
							request: {
								method: "GET",
								url: '=signatures/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//      Proposal Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "proposalAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Proposal ID",
						name: "id",
						type: "string",
						default: "",
						routing: { send: { property: "id", type: "query" } },
					},
					{
						displayName: "Deal ID",
						name: "deal_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "deal_id", type: "query" },
						},
					},
					{
						displayName: "Status",
						name: "status",
						type: "string",
						default: "",
						routing: {
							send: { property: "status", type: "query" },
						},
					},
					{
						displayName: "User ID",
						name: "user_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "user_id", type: "query" },
						},
					},
					{
						displayName: "Payment Method ID",
						name: "payment_method_id",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "payment_method_id",
								type: "query",
							},
						},
					},
					{
						displayName: "Payment Method",
						name: "payment_method",
						type: "string",
						default: "",
						routing: {
							send: { property: "payment_method", type: "query" },
						},
					},
					{
						displayName: "Due Date",
						name: "due_date",
						type: "dateTime",
						default: "",
						routing: {
							send: { property: "due_date", type: "query" },
						},
					},
					{
						displayName: "Created At (Start)",
						name: "created_at_start",
						type: "dateTime",
						default: "",
						routing: {
							send: {
								property: "created_at_start",
								type: "query",
							},
						},
					},
					{
						displayName: "Created At (End)",
						name: "created_at_end",
						type: "dateTime",
						default: "",
						routing: {
							send: { property: "created_at_end", type: "query" },
						},
					},
				],
			},

			// ----------------------------------
			//          Tag Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["tag"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description: "Create a new tag for organization.",
						action: "Create a tag",
						routing: {
							request: {
								method: "POST",
								url: "tags",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Delete a tag permanently.",
						action: "Delete a tag",
						routing: {
							request: {
								method: "DELETE",
								url: '=tags/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description: "Search for tag information by ID.",
						action: "Get a tag",
						routing: {
							request: {
								method: "GET",
								url: '=tags/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List all account tags.",
						action: "List tags",
						routing: {
							request: {
								method: "GET",
								url: "tags",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description: "Change the name of a tag.",
						action: "Update a tag",
						routing: {
							request: {
								method: "PUT",
								url: '=tags/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//        Tag Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "tagAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["tag"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},
					{
						displayName: "Active",
						name: "active",
						type: "boolean",
						default: true,
						routing: {
							send: { property: "active", type: "query" },
						},
					},

					{
						displayName: "Belongs To",
						name: "belongs",
						type: "options",
						options: [
							{ name: "Persons", value: "1" },
							{ name: "Deals", value: "2" },
							{ name: "Companies", value: "3" },
						],
						default: "1",
						routing: {
							send: { property: "belongs", type: "query" },
						},
					},
				],
			},

			// ----------------------------------
			//      ID Identifiers (Path)
			// ----------------------------------
			{
				displayName: "ID",
				name: "id",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: [
							"person",
							"deal",
							"company",
							"activity",
							"note",
							"proposal",
							"tag",
						],
						operation: [
							"get",
							"update",
							"delete",
							"moveToStage",
							"getOriginGroup",
							"getLinkedItem",
							"getOrigin",
							"getSignatureDocument",
							"getSignature",
						],
					},
				},
				description:
					"The unique identifier (numeric ID) of the record in the PipeRun database.",
			},

			{
				displayName: "Return All",
				name: "returnAll",
				type: "boolean",
				displayOptions: {
					show: {
						operation: [
							"list",
							"listOriginGroups",
							"listOrigins",
							"listLinkedItems",
							"listSignatureDocuments",
							"listSignatures",
						],
					},
				},
				default: false,
				description:
					"Whether to return all results or only up to a given limit",
			},
			{
				displayName: "Limit",
				name: "limit",
				type: "number",
				displayOptions: {
					show: {
						operation: [
							"list",
							"listOriginGroups",
							"listOrigins",
							"listLinkedItems",
							"listSignatureDocuments",
							"listSignatures",
						],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: "Max number of results to return",
			},

			{
				displayName: "Load Custom Fields",
				name: "loadCustomFields",
				type: "boolean",
				default: false,
				displayOptions: {
					show: {
						resource: ["person", "deal", "company"],
						operation: ["get", "list"],
					},
				},
				description:
					"Whether to include custom fields in the response. Adds ?with=customFields to the request.",
				routing: {
					send: {
						type: "query",
						property: "with",
						value: '={{$value ? ($parameter["resource"] === "deal" ? "items,persons,companies,customFields" : "customFields") : ($parameter["resource"] === "deal" ? "items,persons,companies" : "")}}',
					},
				},
			},

			// ----------------------------------
			//           Fields (Body)
			// ----------------------------------
			{
				displayName: "Custom Fields",
				name: "customFields",
				type: "fixedCollection",
				placeholder: "Add Custom Field",
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ["person", "deal", "company"],
						operation: ["create", "update"],
					},
				},
				description: "The custom fields to set for the record.",
				options: [
					{
						name: "customFieldsValues",
						displayName: "Custom Field",
						values: [
							{
								displayName: "Field Hash",
								name: "hash",
								type: "string",
								default: "",
								description:
									"The unique hash of the custom field.",
							},
							{
								displayName: "Field Value",
								name: "value",
								type: "string",
								default: "",
								description:
									"The value to set for the custom field.",
							},
						],
					},
				],
				routing: {
					send: {
						type: "body",
						property: "custom_fields",
						value: "={{$value.customFieldsValues}}",
					},
				},
			},
			{
				displayName: "Deal ID",
				name: "deal_id",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["listLinkedItems", "getLinkedItem"],
					},
				},
				description:
					"The unique identifier of the deal to work with its linked items.",
			},
			// ----------------------------------
			//   Origin Group Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "originGroupAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["listOriginGroups"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},
					{
						displayName: "Active",
						name: "active",
						type: "boolean",
						default: true,
						routing: {
							send: { property: "active", type: "query" },
						},
					},
				],
			},
			// ----------------------------------
			//      Origin Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "originAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["listOrigins"],
					},
				},
				options: [
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { send: { property: "name", type: "query" } },
					},
					{
						displayName: "Active",
						name: "active",
						type: "boolean",
						default: true,
						routing: {
							send: { property: "active", type: "query" },
						},
					},
					{
						displayName: "Origin Group ID",
						name: "origin_group_id",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "origin_group_id",
								type: "query",
							},
						},
					},
					{
						displayName: "Hash",
						name: "hash",
						type: "string",
						default: "",
						routing: { send: { property: "hash", type: "query" } },
					},
				],
			},
			// ----------------------------------
			// Signature Doc Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "signatureDocumentAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["listSignatureDocuments"],
					},
				},
				options: [
					{
						displayName: "Status",
						name: "status",
						type: "string",
						default: "",
						routing: {
							send: { property: "status", type: "query" },
						},
					},
					{
						displayName: "Owner ID",
						name: "owner_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "owner_id", type: "query" },
						},
					},
					{
						displayName: "Pipeline ID",
						name: "pipeline_id",
						type: "string",
						default: "",
						routing: {
							send: { property: "pipeline_id", type: "query" },
						},
					},
				],
			},
			// ----------------------------------
			//      Signature Filters (Query)
			// ----------------------------------
			{
				displayName: "Additional Filters",
				name: "signatureAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["listSignatures"],
					},
				},
				options: [
					{
						displayName: "Signature Document ID",
						name: "signature_document_id",
						type: "string",
						default: "",
						routing: {
							send: {
								property: "signature_document_id",
								type: "query",
							},
						},
					},
				],
			},
			{
				displayName: "Title",
				name: "title",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["create"],
					},
				},
				description: "Title of the deal (e.g., Deal - ABC LTD).",
				routing: {
					send: {
						type: "body",
						property: "title",
					},
				},
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["person", "company", "tag"],
						operation: ["create"],
					},
				},
				description: "Name of the person, company, or tag.",
				routing: {
					send: {
						type: "body",
						property: "name",
					},
				},
			},
			{
				displayName: "Subject",
				name: "subject",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["activity"],
						operation: ["create"],
					},
				},
				description:
					"The title or subject of the task that will appear on the calendar.",
				routing: {
					send: {
						type: "body",
						property: "title",
					},
				},
			},
			{
				displayName: "Pipeline ID",
				name: "pipelineId",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["create"],
					},
				},
				description:
					"The numeric ID of the sales pipeline (funnel) where the deal should be created.",
				routing: {
					send: {
						type: "body",
						property: "pipeline_id",
					},
				},
			},
			{
				displayName: "Stage ID",
				name: "stageId",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["create", "moveToStage"],
					},
				},
				description:
					"The numeric ID of the funnel stage where the deal should be created or moved.",
				routing: {
					send: {
						type: "body",
						property: "stage_id",
					},
				},
			},
			{
				displayName: "Deal ID",
				name: "dealId",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["create"],
					},
				},
				description:
					"The ID of the deal to which this record is linked.",
				routing: {
					send: {
						type: "body",
						property: "deal_id",
					},
				},
			},
			{
				displayName: "Note Content",
				name: "noteContent",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["note"],
						operation: ["create"],
					},
				},
				description:
					"The text that will be recorded in the record history.",
				routing: {
					send: {
						type: "body",
						property: "text",
					},
				},
			},

			// ----------------------------------
			//        Additional Fields
			// ----------------------------------
			{
				displayName: "Additional Fields",
				name: "noteAdditionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: {
					show: {
						resource: ["note"],
						operation: ["create", "update"],
					},
				},
				description: "Additional optional fields for a Note.",
				options: [
					{
						displayName: "Call ID",
						name: "callId",
						type: "string",
						default: "",
						description:
							"ID of the call, if the note is a comment on a call.",
						routing: {
							send: { property: "call_id", type: "body" },
						},
					},
					{
						displayName: "Company ID",
						name: "companyId",
						type: "string",
						default: "",
						description:
							"ID of the company, if the note is linked to a company.",
						routing: {
							send: { property: "company_id", type: "body" },
						},
					},
					{
						displayName: "Deal ID",
						name: "dealId",
						type: "string",
						default: "",
						description:
							"ID of the deal, if the note is linked to a deal.",
						routing: {
							send: { property: "deal_id", type: "body" },
						},
					},
					{
						displayName: "Person ID",
						name: "personId",
						type: "string",
						default: "",
						description:
							"ID of the person, if the note is linked to a person.",
						routing: {
							send: { property: "person_id", type: "body" },
						},
					},
					{
						displayName: "User ID",
						name: "userId",
						type: "string",
						default: "",
						description:
							"ID of the PipeRun user responsible for the note.",
						routing: {
							send: { property: "user_id", type: "body" },
						},
					},
				],
			},

			// ----------------------------------
			//      General Additional Fields
			// ----------------------------------
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: {
					show: {
						resource: ["person", "deal", "company", "activity"],
						operation: ["create", "update"],
					},
				},
				description:
					"Additional optional fields supported by the PipeRun API to enrich the record.",
				options: [
					{
						displayName: "Company ID",
						name: "companyId",
						type: "string",
						default: "",
						description:
							"Link this record to an existing company via ID.",
						routing: {
							send: { property: "company_id", type: "body" },
						},
					},
					{
						displayName: "Due Date",
						name: "dueDate",
						type: "dateTime",
						default: "",
						description:
							"Deadline for completing the activity or expected close date for deals.",
						routing: {
							send: { property: "due_date", type: "body" },
						},
					},
					{
						displayName: "Expected Close Date",
						name: "probablyClosedAt",
						type: "dateTime",
						default: "",
						description:
							"The date the deal is expected to be closed.",
						routing: {
							send: {
								property: "probably_closed_at",
								type: "body",
							},
						},
					},
					{
						displayName: "Emails",
						name: "emails",
						type: "string",
						default: "",
						description: "Email address of the contact.",
						routing: { send: { property: "emails", type: "body" } },
					},
					{
						displayName: "Person ID",
						name: "personId",
						type: "string",
						default: "",
						description:
							"Link this record to a specific person via ID.",
						routing: {
							send: { property: "person_id", type: "body" },
						},
					},

					{
						displayName: "Phones",
						name: "phones",
						type: "string",
						default: "",
						description: "Phone or mobile number (with area code).",
						routing: { send: { property: "phones", type: "body" } },
					},
					{
						displayName: "Probability (%)",
						name: "probability",
						type: "number",
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 90,
						},
						description: "Chance of closing the deal from 0 to 90.",
						routing: {
							send: { property: "probability", type: "body" },
						},
					},
					{
						displayName: "Reference",
						name: "reference",
						type: "string",
						default: "",
						description: "External integration reference ID.",
						routing: {
							send: { property: "reference", type: "body" },
						},
					},
					{
						displayName: "Temperature",
						name: "temperature",
						type: "options",
						options: [
							{ name: "Very Hot", value: 1 },
							{ name: "Hot", value: 2 },
							{ name: "Warm", value: 3 },
							{ name: "Cold", value: 4 },
						],
						default: 2,
						description: "Heat level of the deal.",
						routing: {
							send: { property: "temperature", type: "body" },
						},
					},
					{
						displayName: "Origin ID",
						name: "origin_id",
						type: "string",
						default: "",
						description: "ID of the deal's origin/source.",
						routing: {
							send: { property: "origin_id", type: "body" },
						},
					},
					{
						displayName: "Lost Reason ID",
						name: "lost_reason_id",
						type: "string",
						default: "",
						description: "ID of the reason why the deal was lost.",
						routing: {
							send: { property: "lost_reason_id", type: "body" },
						},
					},
					{
						displayName: "Tax ID (CPF/CNPJ)",
						name: "taxId",
						type: "string",
						default: "",
						description: "Tax identification of the record.",
						routing: { send: { property: "cpf", type: "body" } },
					},
					{
						displayName: "Value",
						name: "value",
						type: "number",
						default: 0,
						description:
							"Base monetary value of the deal (products/services).",
						routing: { send: { property: "value", type: "body" } },
					},
					{
						displayName: "Value MRR",
						name: "value_mrr",
						type: "number",
						default: 0,
						description:
							"Monthly Recurring Revenue value of the deal.",
						routing: {
							send: { property: "value_mrr", type: "body" },
						},
					},
					{
						displayName: "Deal Status",
						name: "status",
						type: "options",
						options: [
							{ name: "Open", value: 0 },
							{ name: "Won", value: 1 },
							{ name: "Lost", value: 3 },
						],
						default: 0,
						description: "Current status of the deal.",
						routing: { send: { property: "status", type: "body" } },
					},
					{
						displayName: "Birthday",
						name: "birthday",
						type: "dateTime",
						default: "",
						description: "Date of birth of the person.",
						routing: {
							send: { property: "birth_day", type: "body" },
						},
					},
					{
						displayName: "Gender",
						name: "gender",
						type: "options",
						options: [
							{ name: "Male", value: "Masculino" },
							{ name: "Female", value: "Feminino" },
						],
						default: "Masculino",
						description: "Gender of the person.",
						routing: { send: { property: "gender", type: "body" } },
					},
					{
						displayName: "Job Title",
						name: "jobTitle",
						type: "string",
						default: "",
						description: "Professional role or position.",
						routing: {
							send: { property: "job_title", type: "body" },
						},
					},
				],
			},

			// ----------------------------------
			//         Item Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["item"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description: "Create a new item (product/service/MRR)",
						action: "Create an item",
						routing: {
							request: {
								method: "POST",
								url: "items",
							},
						},
					},
					{
						name: "Delete",
						value: "delete",
						description: "Delete an item",
						action: "Delete an item",
						routing: {
							request: {
								method: "DELETE",
								url: '=items/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description: "Get an item by ID",
						action: "Get an item",
						routing: {
							request: {
								method: "GET",
								url: '=items/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List items",
						action: "List items",
						routing: {
							request: {
								method: "GET",
								url: "items",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description: "Update an item",
						action: "Update an item",
						routing: {
							request: {
								method: "PUT",
								url: '=items/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//         User Operations
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["user"],
					},
				},
				options: [
					{
						name: "Create",
						value: "create",
						description: "Add a new user to CRM",
						action: "Create a user",
						routing: {
							request: {
								method: "POST",
								url: "users",
							},
						},
					},
					{
						name: "Get",
						value: "get",
						description: "Get a user by ID",
						action: "Get a user",
						routing: {
							request: {
								method: "GET",
								url: '=users/{{$parameter["id"]}}',
							},
						},
					},
					{
						name: "List",
						value: "list",
						description: "List CRM users",
						action: "List users",
						routing: {
							request: {
								method: "GET",
								url: "users",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
										},
									},
									{
										type: "limit",
										properties: {
											maxResults: "={{$parameter.limit}}",
										},
									},
								],
							},
							operations: {
								pagination: {
									type: "generic",
									properties: {
										continue:
											"={{!!$response.body.meta.cursor.next}}",
										request: {
											qs: {
												cursor: "={{$response.body.meta.cursor.next}}",
											},
										},
									},
								},
							},
						},
					},
					{
						name: "Update",
						value: "update",
						description: "Update an existing user",
						action: "Update a user",
						routing: {
							request: {
								method: "PUT",
								url: '=users/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
			},

			// ----------------------------------
			//            Item Fields
			// ----------------------------------
			{
				displayName: "ID",
				name: "id",
				type: "string",
				displayOptions: {
					show: {
						resource: ["item"],
						operation: ["get", "update", "delete"],
					},
				},
				default: "",
				required: true,
				description: "The ID of the item",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				displayOptions: {
					show: {
						resource: ["item"],
						operation: ["create"],
					},
				},
				default: "",
				required: true,
				routing: { request: { body: { name: "={{$value}}" } } },
			},
			{
				displayName: "Type",
				name: "type",
				type: "options",
				options: [
					{ name: "Product (0)", value: 0 },
					{ name: "Recurrence/MRR (1)", value: 1 },
					{ name: "Service (2)", value: 2 },
				],
				displayOptions: {
					show: {
						resource: ["item"],
						operation: ["create"],
					},
				},
				default: 0,
				required: true,
				routing: { request: { body: { type: "={{$value}}" } } },
			},
			{
				displayName: "Additional Fields",
				name: "itemAdditionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: {
					show: {
						resource: ["item"],
						operation: ["create", "update"],
					},
				},
				options: [
					{
						displayName: "Brand ID",
						name: "brand_id",
						type: "string",
						default: "",
						routing: {
							request: { body: { brand_id: "={{$value}}" } },
						},
					},
					{
						displayName: "Category ID",
						name: "category_id",
						type: "number",
						default: 0,
						routing: {
							request: { body: { category_id: "={{$value}}" } },
						},
					},
					{
						displayName: "Code",
						name: "code",
						type: "string",
						default: "",
						routing: { request: { body: { code: "={{$value}}" } } },
					},
					{
						displayName: "Commission",
						name: "commission",
						type: "number",
						default: 0,
						routing: {
							request: { body: { commission: "={{$value}}" } },
						},
					},
					{
						displayName: "Cost",
						name: "cost",
						type: "number",
						typeOptions: { numberPrecision: 2 },
						default: 0,
						routing: { request: { body: { cost: "={{$value}}" } } },
					},
					{
						displayName: "Description",
						name: "description",
						type: "string",
						default: "",
						routing: {
							request: { body: { description: "={{$value}}" } },
						},
					},
					{
						displayName: "IPI Tax",
						name: "ipi_tax",
						type: "number",
						typeOptions: { numberPrecision: 2 },
						default: 0,
						routing: {
							request: { body: { ipi_tax: "={{$value}}" } },
						},
					},
					{
						displayName: "Minimum Value (Selling Price)",
						name: "minimum_value",
						type: "number",
						typeOptions: { numberPrecision: 2 },
						default: 0,
						routing: {
							request: { body: { minimum_value: "={{$value}}" } },
						},
					},
					{
						displayName: "Photo URL",
						name: "photo",
						type: "string",
						default: "",
						routing: {
							request: { body: { photo: "={{$value}}" } },
						},
					},
					{
						displayName: "Reference",
						name: "reference",
						type: "string",
						default: "",
						routing: {
							request: { body: { reference: "={{$value}}" } },
						},
					},
					{
						displayName: "Status (Inactive)",
						name: "status",
						type: "boolean",
						description:
							"Whether the item is inactive (true/false). False means active.",
						default: false,
						routing: {
							request: { body: { status: "={{$value}}" } },
						},
					},
				],
			},
			{
				displayName: "Additional Filters",
				name: "itemAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["item"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Brand ID",
						name: "brand_id",
						type: "string",
						default: "",
						routing: {
							request: { qs: { brand_id: "={{$value}}" } },
						},
					},
					{
						displayName: "Category ID",
						name: "category_id",
						type: "number",
						default: 0,
						routing: {
							request: { qs: { category_id: "={{$value}}" } },
						},
					},
					{
						displayName: "Code",
						name: "code",
						type: "string",
						default: "",
						routing: { request: { qs: { code: "={{$value}}" } } },
					},
					{
						displayName: "Description",
						name: "description",
						type: "string",
						default: "",
						routing: {
							request: { qs: { description: "={{$value}}" } },
						},
					},
					{
						displayName: "Minimum Value",
						name: "minimum_value",
						type: "number",
						typeOptions: { numberPrecision: 2 },
						default: 0,
						routing: {
							request: { qs: { minimum_value: "={{$value}}" } },
						},
					},
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { request: { qs: { name: "={{$value}}" } } },
					},
					{
						displayName: "Reference",
						name: "reference",
						type: "string",
						default: "",
						routing: {
							request: { qs: { reference: "={{$value}}" } },
						},
					},
					{
						displayName: "Status (Inactive)",
						name: "status",
						type: "boolean",
						description: "Filter by inactive status",
						default: false,
						routing: { request: { qs: { status: "={{$value}}" } } },
					},
				],
			},
			// ----------------------------------
			//            User Fields
			// ----------------------------------
			{
				displayName: "ID",
				name: "id",
				type: "string",
				displayOptions: {
					show: {
						resource: ["user"],
						operation: ["get", "update"],
					},
				},
				default: "",
				required: true,
				description: "The ID of the user",
			},
			{
				displayName: "Email",
				name: "email",
				type: "string",
				displayOptions: {
					show: {
						resource: ["user"],
						operation: ["create"],
					},
				},
				default: "",
				required: true,
				routing: { request: { body: { email: "={{$value}}" } } },
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				displayOptions: {
					show: {
						resource: ["user"],
						operation: ["create"],
					},
				},
				default: "",
				required: true,
				routing: { request: { body: { name: "={{$value}}" } } },
			},
			{
				displayName: "Additional Fields",
				name: "userAdditionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: {
					show: {
						resource: ["user"],
						operation: ["create", "update"],
					},
				},
				options: [
					{
						displayName: "Active",
						name: "active",
						type: "boolean",
						default: true,
						routing: {
							request: { body: { active: "={{$value}}" } },
						},
					},
					{
						displayName: "Avatar URL",
						name: "avatar",
						type: "string",
						default: "",
						routing: {
							request: { body: { avatar: "={{$value}}" } },
						},
					},
					{
						displayName: "Birthday",
						name: "birth_day",
						type: "dateTime",
						default: "",
						routing: {
							request: { body: { birth_day: "={{$value}}" } },
						},
					},
					{
						displayName: "Cellphone",
						name: "cellphone",
						type: "string",
						default: "",
						routing: {
							request: { body: { cellphone: "={{$value}}" } },
						},
					},
					{
						displayName: "CPF",
						name: "cpf",
						type: "string",
						default: "",
						routing: { request: { body: { cpf: "={{$value}}" } } },
					},
					{
						displayName: "Email",
						name: "email",
						type: "string",
						displayOptions: { show: { "/operation": ["update"] } },
						default: "",
						routing: {
							request: { body: { email: "={{$value}}" } },
						},
					},
					{
						displayName: "Gender",
						name: "gender",
						type: "options",
						options: [
							{ name: "Male", value: "Masculino" },
							{ name: "Female", value: "Feminino" },
						],
						default: "Masculino",
						routing: {
							request: { body: { gender: "={{$value}}" } },
						},
					},
					{
						displayName: "Name",
						name: "name",
						type: "string",
						displayOptions: { show: { "/operation": ["update"] } },
						default: "",
						routing: { request: { body: { name: "={{$value}}" } } },
					},
					{
						displayName: "Signature Reference Email",
						name: "signature",
						type: "string",
						default: "",
						routing: {
							request: { body: { signature: "={{$value}}" } },
						},
					},
					{
						displayName: "Telephone",
						name: "telephone",
						type: "string",
						default: "",
						routing: {
							request: { body: { telephone: "={{$value}}" } },
						},
					},
				],
			},
			{
				displayName: "Additional Filters",
				name: "userAdditionalFilters",
				type: "collection",
				placeholder: "Add Filter",
				default: {},
				displayOptions: {
					show: {
						resource: ["user"],
						operation: ["list"],
					},
				},
				options: [
					{
						displayName: "Account ID",
						name: "account_id",
						type: "string",
						default: "",
						routing: {
							request: { qs: { account_id: "={{$value}}" } },
						},
					},
					{
						displayName: "Active Status",
						name: "active",
						type: "options",
						options: [
							{ name: "Active", value: "active" },
							{ name: "Inactive", value: "inactive" },
							{ name: "All", value: "all" },
						],
						default: "active",
						routing: { request: { qs: { active: "={{$value}}" } } },
					},
					{
						displayName: "Email",
						name: "email",
						type: "string",
						default: "",
						routing: { request: { qs: { email: "={{$value}}" } } },
					},
					{
						displayName: "Name",
						name: "name",
						type: "string",
						default: "",
						routing: { request: { qs: { name: "={{$value}}" } } },
					},
					{
						displayName: "Permission Level",
						name: "permission",
						type: "string",
						default: "",
						routing: {
							request: { qs: { permission: "={{$value}}" } },
						},
					},
				],
			},
		],
	};
}
