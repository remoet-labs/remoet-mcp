# Remoet MCP tools

Tools exposed by the Remoet MCP server at `https://api.remoet.dev/mcp`. The live `tools/list` request is the source of truth; this table is a map. Every tool carries safety annotations (read-only / creates / updates / deletes, plus open-world hints) for clients that surface them.

## Profile

| Tool | Purpose |
|------|---------|
| `get_profile` | Full profile in one call: personal info, work experience, projects, education (each entry with an `id`), plus the current visibility setting. Call first. |
| `update_profile` | Update profile fields and/or visibility (`NONE`, `STARRED`, `ALL`). Pass only what changes; `null` clears a field. |
| `save_work_experience` | Add or update a work experience entry (upsert: omit `id` to create, pass an `id` to update) |
| `save_project` | Add or update a portfolio project (upsert) |
| `save_education` | Add or update an education entry (upsert) |
| `delete_profile_item` | Delete a work experience, project, or education entry (`type` + `id`) |

## Discovery & Stars

Stars are the core noise filter. Only star companies whose tech stack overlaps the user's skills.

| Tool | Purpose |
|------|---------|
| `search_listings` | Search companies by `searchQuery`, `techStack[]`, `sortBy`; or list the user's starred shortlist with `starred: true`. Auto-normalizes tech names. |
| `get_listing` | Detailed info on one company by slug |
| `star_listing` | Star a company (free of budget cost, capped per plan) |
| `unstar_listing` | Remove a star (consumes unstar budget) |
| `get_starred_jobs` | Jobs from starred companies. Filters: salary, location, remote policy, level, stack. The daily driver. |
| `save_job` | Save a job for later with an optional note |
| `get_saved_jobs` | The user's saved-jobs list |
| `update_saved_job_note` | Update the note on a saved job |
| `unsave_job` | Remove a job from the saved list |

## Applications

| Tool | Purpose |
|------|---------|
| `apply_to_job` | Apply to an internal partner job (external jobs are applied to on the company site) |
| `get_applications` | List applications, or read one in full with `applicationId` (details + event timeline + message thread) |
| `withdraw_application` | Withdraw an application (confirm with user first) |
| `respond_to_offer` | Accept or reject an offer (`decision` accept or reject; status must be `offer_extended`) |
| `add_application_note` | Private note on an application (user-only) |
| `send_application_message` | Message the company on an application |

## Digests, Apps & Link trees

| Tool | Purpose |
|------|---------|
| `get_digests` | Weekly job-summary digests from starred companies (optional `id` for one digest's full body) |
| `get_apps` | Approved third-party apps on the platform |
| `get_linktrees` | The user's link tree pages (optional `slug` for one page plus view/click analytics) |
| `create_linktree` | Create a shareable link page with view/click tracking |
| `delete_linktree` | Delete a link tree page by ID |

## Account & Subscription

| Tool | Purpose |
|------|---------|
| `get_account` | One status read: plan, all budgets (with reset times), plan limits, over-cap state |
| `get_upgrade_link` | Stripe Checkout URL to upgrade (user completes payment in a browser) |
