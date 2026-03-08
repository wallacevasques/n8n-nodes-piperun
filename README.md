# n8n-nodes-piperun

This is an unofficial community node for **[n8n](https://n8n.io/)**, an extendable workflow automation tool. It integrates with **[PipeRun CRM](https://crmpiperun.com/)**, allowing you to automate your entire sales pipeline — from managing deals and contacts to controlling proposals, signatures, and tags.

[n8n Community Node Documentation](https://docs.n8n.io/integrations/community-nodes/)

---

## ✨ Resources & Operations

### 👤 Person (`pessoa`)

Manage your individual contacts and leads.

| Operation | Description                                               |
| --------- | --------------------------------------------------------- |
| Create    | Add a new person to the CRM                               |
| Get       | Retrieve a specific person by ID                          |
| List      | List persons with filters (name, email, CPF, company, tag) |
| Update    | Edit person data (name, phone, address, custom fields)    |
| Delete    | Permanently remove a person from the CRM                  |

---

### 🏢 Company (`empresa`)

Manage client organizations and their data.

| Operation | Description                                      |
| --------- | ------------------------------------------------ |
| Create    | Add a new company                                |
| Get       | Retrieve a specific company by ID                |
| List      | List companies with optional filters             |
| Update    | Modify company information (name, CNPJ, address) |
| Delete    | Remove a company from the CRM                    |

---

### 🤝 Deal (`oportunidade`)

Full lifecycle management of sales opportunities.

| Operation     | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| Create        | Open a new deal in a specific funnel and stage                       |
| Get           | Get full details of a deal (value, stage, tags, custom fields)       |
| List          | List deals with rich filters (status, pipeline, stage, dates, owner, person, company, tag) |
| Update        | Modify any deal attribute                                            |
| Delete        | Remove a deal permanently                                            |
| Move To Stage | Change a deal's stage within the funnel                              |

**Associated Deal Operations:**

| Operation          | Description                                      |
| ------------------ | ------------------------------------------------ |
| List Origin Groups | List groups of opportunity origin sources        |
| Get Origin Group   | Get details of a specific origin group           |
| List Origins       | List all opportunity origin sources with filters |
| Get Origin         | Get details of a specific origin source          |
| List Linked Items  | List products/items linked to an opportunity     |
| Get Linked Item    | Get details of a specific linked product/item    |

---

### 📋 Activity (`atividade`)

Schedule and track calls, meetings, and tasks.

| Operation | Description                                      |
| --------- | ------------------------------------------------ |
| Create    | Create a new activity linked to a deal or person |
| Get       | Get activity details                             |
| List      | List activities with date and type filters       |
| Update    | Modify activity data                             |
| Delete    | Remove an activity                               |

---

### 📝 Note (`nota`)

Add and manage annotations on deals and contacts.

| Operation | Description                            |
| --------- | -------------------------------------- |
| Create    | Create a note tied to a deal or person |
| Get       | Get a specific note                    |
| List      | List notes filtered by deal or person  |
| Update    | Edit a note                            |
| Delete    | Delete a note                          |

---

### 📄 Proposal (`proposta`)

Control the complete lifecycle of commercial proposals and electronic signatures.

| Operation | Description                                                     |
| --------- | --------------------------------------------------------------- |
| Create    | Create a new proposal linked to a deal                          |
| Get       | Get full details of a specific proposal (values, items, status) |
| List      | List proposals with filters (deal_id, status, user_id, dates)   |
| Update    | Modify an existing proposal                                     |
| Delete    | Remove a proposal                                               |

**Associated Proposal Operations:**

| Operation                | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| List Signature Documents | List all documents sent for electronic signatures            |
| Get Signature Document   | Get details of a specific signature document                 |
| List Signatures          | List individual signatures, filterable by signature document |
| Get Signature            | Get details of a specific signature record                   |

---

### 🏷️ Tag (`tag`)

Organize deals and persons with custom labels.

| Operation | Description                                              |
| --------- | -------------------------------------------------------- |
| Create    | Create a new tag                                         |
| Get       | Get a specific tag                                       |
| List      | List tags with filters (name, active, belongs-to entity) |
| Update    | Rename or modify a tag                                   |
| Delete    | Remove a tag                                             |

---

### 🛒 Item (`item`)

Manage your product/service catalog and recurring revenue items.

| Operation | Description                                               |
| --------- | --------------------------------------------------------- |
| Create    | Add a new item (product, service, or MRR)                 |
| Get       | Retrieve a specific item by ID                            |
| List      | List items with filters (name, code, category, type)      |
| Update    | Modify item data (price, description, category)           |
| Delete    | Remove an item from the catalog                           |

---

### 👥 User (`user`)

Manage CRM users and their profiles.

| Operation | Description                                               |
| --------- | --------------------------------------------------------- |
| Create    | Add a new user to the CRM                                 |
| Get       | Retrieve a specific user by ID                            |
| List      | List users with filters (name, email, active status)      |
| Update    | Modify user data (name, email, phone, avatar)             |

---

### 🔀 Funnel (`funil`) & Stage (`etapa`)

Query your sales pipeline structure.

| Operation    | Description                                           |
| ------------ | ----------------------------------------------------- |
| List Funnels | Retrieve all sales funnels with name filter           |
| List Stages  | Retrieve all stages, optionally filtered by funnel ID |

---

## 🔑 Credentials

PipeRun uses token-based authentication.

1. In your PipeRun account, go to **Integrações** → **Tokens de Acesso** to find or generate your API token.
2. In n8n, add a new credential of type **Piperun API**.
3. Fill in:
    - **Token**: Your PipeRun API token.
    - **Base URL**: Defaults to `https://api.pipe.run/v1/` (do **not** change unless you have a custom domain).

> The node automatically injects required headers (`token`, `Accept: application/json`) on every request.

---

## 🚀 Installation

### From n8n UI (Recommended)

1. In your n8n instance, go to **Settings → Community Nodes**.
2. Click **Install**.
3. Enter the package name: `n8n-nodes-piperun`
4. Confirm and restart n8n when prompted.

### Manual (npm)

```bash
# In your n8n root directory (where custom nodes are stored):
npm install n8n-nodes-piperun
```

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/wallacevasques/n8n-nodes-piperun.git
cd n8n-nodes-piperun

# 2. Install dependencies
npm install

# 3. Build the TypeScript code
npm run build

# 4. Link to your local n8n instance
npm link

# In your local n8n custom nodes directory (~/.n8n/custom or equivalent):
npm link n8n-nodes-piperun

# 5. Start n8n
n8n start
```

---

## ⚠️ Known Constraints & Best Practices

-   **Rate Limiting**: The PipeRun API allows up to **100 requests per minute**. In workflows with loops or bulk operations, add a **Wait** node to avoid `429 Too Many Requests` errors.

-   **Pagination**: All `List` operations support automatic pagination. Toggle **Return All** to fetch every record, or set a **Limit** to cap results.

-   **Proposal IDs vs Deal IDs**: These are different resources with different ID sequences. To find a proposal for a specific deal, use **Proposal → List** with the `Deal ID` filter inside _Additional Filters_ — do **not** pass a deal ID directly to **Proposal → Get**.

-   **Multiple Inputs (n8n loop behavior)**: When a List node receives multiple input items, n8n executes the operation once per input item. Use a **Filter** node before a **Get** operation if you only need to process a specific subset of items.

-   **Custom Fields**: For deals, persons, and companies, custom fields can be set via the _Additional Options_ collection in Create/Update operations. Use the field's **hash** (not the display name) as the identifier.

---

## 🔗 Related Links

-   [PipeRun API Reference](https://developers.pipe.run/)
-   [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
-   [n8n Community Forum](https://community.n8n.io/)

---

## 📝 License

[MIT](LICENSE.md)
