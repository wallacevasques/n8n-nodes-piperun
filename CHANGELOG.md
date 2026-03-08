# Changelog

All notable changes to this project will be documented in this file.

---

## [0.3.0] - 2026-03-08

### Added
- **Item resource** (`item`): Create, Get, List, Update, Delete — manage products, services, and MRR items from the catalog
- **User resource** (`user`): Create, Get, List, Update — manage CRM users and their profiles
- **Person → List**: new filters `company_id` and `tag_id`
- **Deal → List**: new filters `person_id`, `company_id`, `owner_id`, and `tag_id`

---

## [0.2.0] - 2025-01-01

### Added
- **Proposal**: new sub-operations `List Signature Documents`, `Get Signature Document`, `List Signatures`, `Get Signature`
- **Deal**: new sub-operations `List Origin Groups`, `Get Origin Group`, `List Origins`, `Get Origin`, `List Linked Items`, `Get Linked Item`
- **All List operations**: replaced `Show` (page size) with `Return All` toggle + `Limit` field with automatic cursor-based pagination
- **Proposal → Get**: fix incorrect URL construction

---

## [0.1.0] - 2024-12-01

### Added
- Initial release
- Resources: Person, Company, Deal, Activity, Note, Proposal, Tag, Funnel, Stage
- Full CRUD operations for all resources
- Cursor-based pagination for all List operations
- Token-based authentication via PipeRun API
