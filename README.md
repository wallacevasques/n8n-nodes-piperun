# n8n-nodes-piperun

This is an unofficial community node for **[n8n](https://n8n.io/)**, an extendable workflow automation tool. It integrates gracefully with **[PipeRun CRM](https://crmpiperun.com/)**, allowing you to automate your sales pipeline, manage communication limits, and significantly accelerate your commercial operations.

This integration lets you manipulate deals, persons, companies, notes, proposals, and other crucial entities right from your n8n workflows.

[n8n Community Node Documentation](https://docs.n8n.io/integrations/community-nodes/)

## ✨ Features

The node covers the core functionality of the PipeRun API using n8n's declarative capabilities and robust API design:

-   **Person (`pessoa`)**: Manage your contact information. (Create, Get, List, Update, Delete)
-   **Deal (`negócio`)**: Lead and opportunity management. Includes creating deals, moving stages, comprehensive list filters (Open/Won/Lost), and assigning tags. (Create, Get, List, Update, Delete, Move To Stage)
-   **Company (`empresa`)**: Organization databases including tax ID linkage and updates. (Create, Get, List, Update, Delete)
-   **Activity (`atividade`)**: Calendar and task management functionalities for calls and meetings. (Create, Get, List, Update, Delete)
-   **Note (`nota`)**: Full tracking and annotations linked strictly to your deals or persons for timeline tracking. (Create, Get, List, Update, Delete)
-   **Proposal (`proposta`)**: Control over proposals. Including specialized lookups directly from Deal IDs! (Create, Get, List, List From Deal, Update, Delete)
-   **Tag (`tag`)**: Customizing CRM workflows with tagging operations. (Create, Get, List, Update, Delete)
-   **Funnel & Stage**: Easy retrieval of funnel structures and stage IDs. (List)

## 🔑 Credentials

PipeRun provides token-based HTTP authentication for integrations.

1. Locate your **PipeRun API Token** in your PipeRun account platform under **Integrações** (Integrations) or in your user profile screen (`Meus Dados`).
2. Inside n8n, add a new **Piperun API** credential.
3. Your **Base URL** defaults to `https://api.pipe.run/v1/`.
4. Insert your **Token**. It is important to treat this token securely.

> Note: The node actively handles headers (`token`, `accept`, `content-type`) avoiding `401 Unauthorized` mismatches present in older or manual HTTP Node configurations.

## 🚀 Installation

To install this node, access your n8n UI, navigate to **Settings -> Community Nodes**, then click **Install**.

Enter `n8n-nodes-piperun` as the npm package name.

### Local Development Setup

If you wish to modify or contribute to this node:

1. Clone this repository to your local machine.
2. Run `npm install` to grab the dependencies.
3. Run `npm run build` to compile the TypeScript code.
4. Locally link the project using your global npm repository:

```bash
npm link
cd ~/.n8n/custom # Path to your global custom n8n nodes directory
npm link n8n-nodes-piperun
```

## ⚠️ Known Constraints & Best Practices

-   **Rate Limiting**: The PipeRun API implements standard rate limits, commonly peaking at **100 requests per minute**. If you design loops or extensive backfills using the `List` operation, please insert a **Wait** node in your n8n workflow to prevent HTTP `429 Too Many Requests` status codes.
-   **Language / Naming**: The node inputs and configurations follow n8n's English developer standards for integration readability, but directly map properties precisely to PipeRun’s Portuguese endpoints (`/pessoas`, `/negocios`) in the background payload.
-   **Pagination**: Listing operations utilize standard limit queries up to 500 items per request, actively mapped to the n8n "Return All" pagination mechanism. Use `Return All` if downloading massive datasets.

## 📝 License

[MIT](LICENSE.md)
