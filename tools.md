# Remoet MCP tools

Tools exposed by the Remoet MCP server at `https://api.remoet.dev/mcp`. The live `tools/list` request is the source of truth; this table is a map. Every tool carries safety annotations (read-only / creates / updates / deletes, plus open-world hints) for clients that surface them.

## Profile (read)

| Tool | Purpose |
|------|---------|
| `get_profile` | Full profile: personal info, jobs, projects, education, link trees. Call first. |
| `get_work_experience` | Work history entries |
| `get_projects` | Portfolio projects |
| `get_education` | Education history |
| `get_links` | Social and professional links |

## Profile (write)

| Tool | Purpose |
|------|---------|
| `update_profile` | Update profile fields (pass only what changes) |
| `create_work_experience` / `update_work_experience` / `delete_work_experience` | Manage work history |
| `create_project` / `update_project` / `delete_project` | Manage portfolio projects |
| `create_education` / `update_education` / `delete_education` | Manage education |

## Discovery

| Tool | Purpose |
|------|---------|
| `search_listings` | Search companies by `searchQuery`, `techStack[]`, `sortBy`. Auto-normalizes tech names. |
| `get_listing` | Detailed info on one company by slug |
| `get_starred_listings` | The user's starred shortlist |

## Stars

| Tool | Purpose |
|------|---------|
| `star_listing` | Star a company (free of budget cost, capped per plan) |
| `unstar_listing` | Remove a star (consumes unstar budget) |
| `get_star_count` | Star and budget status |

## Job feed

| Tool | Purpose |
|------|---------|
| `get_starred_jobs` | Jobs from starred companies. Filters: salary, location, remote policy, level, stack. The daily driver. |
| `save_job` / `unsave_job` / `get_saved_jobs` / `update_saved_job_note` | Manage saved jobs |

## Visibility

| Tool | Purpose |
|------|---------|
| `get_visibility` / `update_visibility` | Control whether partner companies can discover the user (`NONE`, `STARRED`, `ALL`) |

## Digests

| Tool | Purpose |
|------|---------|
| `get_digests` / `get_digest` | Weekly job-summary digests from starred companies |

## Apps

| Tool | Purpose |
|------|---------|
| `get_apps` | Approved third-party apps on the platform |

## Link trees

| Tool | Purpose |
|------|---------|
| `get_linktrees` / `get_linktree` / `create_linktree` / `delete_linktree` | Shareable developer profile pages with view/click tracking |

## Applications

| Tool | Purpose |
|------|---------|
| `apply_to_job` | Apply to an internal partner job (external jobs are applied to on the company site) |
| `get_applications` / `get_application` | List and read applications |
| `withdraw_application` / `accept_offer` / `reject_offer` | Manage application state (confirm with user first) |
| `add_application_note` / `get_application_events` | Notes and timeline |
| `send_application_message` / `get_application_messages` | Message companies on an application |

## Subscription

| Tool | Purpose |
|------|---------|
| `get_subscription` / `get_usage` | Current plan, limits, today's usage |
| `get_upgrade_link` | Stripe Checkout URL to upgrade (user completes payment in a browser) |
