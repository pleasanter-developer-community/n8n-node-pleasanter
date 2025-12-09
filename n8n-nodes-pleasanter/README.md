# n8n-nodes-pleasanter

A custom node for n8n to integrate with Pleasanter API.

Implemented according to the [Pleasanter OpenAPI Specification](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml).

> 📖 [日本語 README](./README.ja.md)

## Installation

### As a Community Node

1. Go to n8n Settings > Community nodes
2. Search for `n8n-nodes-pleasanter` and install

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-pleasanter
```

## Features

The following operations are available through the Pleasanter API:

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve records (single/multiple) |
| **Create** | Create a new record |
| **Update** | Update an existing record |
| **Delete** | Delete a record |

## Credential Configuration

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Base URL** | Pleasanter server URL | `https://your-pleasanter.com` |
| **API Key** | Pleasanter API key | - |
| **API Version** | API version | `1.0` or `1.1` |

## Usage

### Get Record

Retrieve records by specifying Site ID or Record ID.

**Key Options:**
- `Offset`: Pagination offset
- `Search`: Search keyword
- `ColumnFilterHash`: Column filter conditions
- `ColumnSorterHash`: Sort conditions

### Create Record

Create a new record by specifying Site ID.

**Configurable Fields:**
- `Title`, `Body`: Basic fields
- `Status`, `Manager`, `Owner`: Status and assignees
- `ClassHash`, `NumHash`, `DateHash`: Classification, numeric, and date fields

### Update Record

Update an existing record by specifying Record ID.

### Delete Record

Delete a record by specifying Record ID.

## Links

- [Pleasanter Official Site](https://pleasanter.org/)
- [Pleasanter OpenAPI Specification](https://pleasanter-developer-community.github.io/pleasanter-open-api/pleasanterApi.yml)
- [n8n Official Site](https://n8n.io/)
- [GitHub Repository](https://github.com/pleasanter-developer-community/n8n-node-pleasanter)

## License

MIT
