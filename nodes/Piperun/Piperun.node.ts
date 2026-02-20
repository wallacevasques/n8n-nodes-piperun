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
				],
				default: "list",
			},

			// ----------------------------------
			//      List Filters (Query)
			// ----------------------------------
			{
				displayName: "Deal Status",
				name: "status",
				type: "options",
				options: [
					{
						name: "Open",
						value: "1",
					},
					{
						name: "Won",
						value: "2",
					},
					{
						name: "Lost",
						value: "3",
					},
				],
				default: "1",
				displayOptions: {
					show: {
						resource: ["deal"],
						operation: ["list"],
					},
				},
				description: "Filter deals by current status.",
				routing: {
					send: {
						type: "query",
						property: "status",
					},
				},
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
								url: "funnels",
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
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
				displayName: "Deal ID",
				name: "filterDealId",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["note"],
						operation: ["list"],
					},
				},
				description: "Filter notes by a specific deal ID.",
				routing: {
					send: {
						type: "query",
						property: "deal_id",
					},
				},
			},
			{
				displayName: "Person ID",
				name: "filterPersonId",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["note"],
						operation: ["list"],
					},
				},
				description: "Filter notes by a specific person ID.",
				routing: {
					send: {
						type: "query",
						property: "person_id",
					},
				},
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
						name: "List From Deal",
						value: "listFromDeal",
						description: "List proposals from a specific deal.",
						action: "List proposals from a deal",
						routing: {
							request: {
								method: "GET",
								url: '=deals/{{$parameter["dealId"]}}/proposals',
							},
							output: {
								postReceive: [
									{
										type: "rootProperty",
										properties: {
											property: "data",
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
				],
				default: "list",
			},

			// ----------------------------------
			//      Proposal Filters (Query)
			// ----------------------------------
			{
				displayName: "Proposal ID",
				name: "filterProposalId",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["list"],
					},
				},
				description: "Filter proposals by a specific proposal ID.",
				routing: {
					send: {
						type: "query",
						property: "id",
					},
				},
			},
			{
				displayName: "Deal ID",
				name: "filterDealIdProposal",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["list"],
					},
				},
				description: "Filter proposals by a specific deal ID.",
				routing: {
					send: {
						type: "query",
						property: "deal_id",
					},
				},
			},
			{
				displayName: "Payment Method ID",
				name: "filterPaymentMethodId",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["list"],
					},
				},
				description:
					"Filter proposals by a specific payment method ID.",
				routing: {
					send: {
						type: "query",
						property: "payment_method_id",
					},
				},
			},
			{
				displayName: "MRR Payment Method ID",
				name: "filterPaymentMethodMrrId",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["list"],
					},
				},
				description:
					"Filter proposals by a specific MRR payment method ID.",
				routing: {
					send: {
						type: "query",
						property: "payment_method_mrr_id",
					},
				},
			},
			{
				displayName: "Payment Method",
				name: "filterPaymentMethod",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						resource: ["proposal"],
						operation: ["list"],
					},
				},
				description:
					"Filter proposals by a specific payment method descriptor or slug.",
				routing: {
					send: {
						type: "query",
						property: "payment_method",
					},
				},
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
								url: '=/tags/{{$parameter["id"]}}',
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
								url: '=/tags/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: "list",
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
						operation: ["get", "update", "delete", "moveToStage"],
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
						operation: ["list", "listFromDeal"],
					},
				},
				default: false,
				description:
					"Whether to return all results or only up to a limit",
			},
			{
				displayName: "Limit",
				name: "limit",
				type: "number",
				displayOptions: {
					show: {
						operation: ["list", "listFromDeal"],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 50,
				description: "Max number of results to return",
			},

			// ----------------------------------
			//           Fields (Body)
			// ----------------------------------
			{
				displayName: "Name/Title",
				name: "name",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["person", "deal", "company", "tag"],
						operation: ["create"],
					},
				},
				description:
					"Name of the person, company, or deal title (e.g., Deal - ABC LTD).",
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
						operation: ["create", "listFromDeal"],
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
						description: "Deadline for completing the activity.",
						routing: {
							send: { property: "due_date", type: "body" },
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
						description:
							"Chance of closing the deal from 0 to 100.",
						routing: {
							send: { property: "probability", type: "body" },
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
						description: "Base monetary value of the deal.",
						routing: { send: { property: "value", type: "body" } },
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
		],
	};
}
