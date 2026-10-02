# Remoet MCP tools

Tools exposed by the Remoet MCP server at `https://api.remoet.dev/mcp`. The live `tools/list` request is the source of truth; this table is a map. The machine-readable copy in [`data/tools.json`](./data/tools.json) is a snapshot of that same live response, so refresh it from a real `tools/list` rather than editing it by hand.

`search_jobs`, `search_listings` and `get_listing` work without an account or key; the other tools need a free Remoet account.

> **Regenerating:** a `tools/list` without a key returns the anonymous schema, where `search_jobs` and `search_listings` cap `pageSize` at 20 and `page` at 10. The snapshot publishes the signed-in limits, so take it with a key, or copy those two fields from the previous snapshot as the 2026-10-02 refresh did.

Every tool carries safety annotations (read-only / creates / updates / deletes, plus open-world hints) for clients that surface them.

## Jobs

| Tool | Purpose |
|------|---------|
| `search_jobs` | Search the public job catalogue: every role on the open board at [remoet.dev/jobs](https://remoet.dev/jobs), across all companies. No star needed and none consumed. The tool for "what is out there" for any technology, title, or company. |
| `get_starred_jobs` | Jobs from the companies the user has starred. Their own feed, empty until they star something. Filters: search query, location, tech stack, remote policy, experience level, minimum salary. |
| `save_job` | Save a job for later with an optional note. This is the agent's memory across sessions. |
| `get_saved_jobs` | The user's saved jobs, with notes and an `isActive` flag when a role has come off the company's careers page. |
| `update_saved_job_note` | Update the note on a saved job (`null` clears it). |
| `unsave_job` | Remove a job from the saved list. |

## Companies and stars

A star is a subscription to a company's postings: it puts that company's jobs in the user's feed and unlocks its full tech stack. The catalogue itself is public, so reach for `search_jobs` when the question is about what exists and for stars when it is about what the user wants delivered.

| Tool | Purpose |
|------|---------|
| `search_listings` | Search companies by `searchQuery`, `techStack[]`, `sortBy`; or list the user's starred companies with `starred: true`. Auto-normalizes tech names. Works without an account, except `starred: true`. |
| `get_listing` | Full detail on one company by slug: description, perks, job count, URLs. The tech stack is a preview until the company is starred. |
| `star_listing` | Star a company. Starring is free and consumes no budget; every account has the same cap on active stars. |
| `unstar_listing` | Remove a star. This one does consume the unstar budget. |

## Profile

| Tool | Purpose |
|------|---------|
| `get_profile` | Full profile in one call: personal info, work experience, projects, education (each entry with an `id`), plus the current visibility setting. Call first. |
| `update_profile` | Update profile fields and/or visibility (`NONE`, `STARRED`, `ALL`). Pass only what changes; `null` clears a field. |
| `save_work_experience` | Add or update a work experience entry (upsert: omit `id` to create, pass an `id` to update). |
| `save_project` | Add or update a portfolio project (upsert). |
| `save_education` | Add or update an education entry (upsert). |
| `delete_profile_item` | Delete a work experience, project, or education entry (`type` + `id`). |

## Applying

| Tool | Purpose |
|------|---------|
| `apply_to_job` | Apply to a job, or get its application link. Most of the catalogue is scraped, so the usual result is `applicationType: "external"` plus the `applicationUrl` where the user applies on the company's own site. Internal partner jobs are applied to end to end. Confirm with the user before calling. |

## Feed, digests, apps and link trees

| Tool | Purpose |
|------|---------|
| `get_feed` | The user's dashboard feed as one chronological stream: job items from starred companies, the daily editorial pick, and platform posts. Poll this to act as their notification layer. |
| `get_digests` | Stored job-summary digests from starred companies, kept for history (optional `id` for one digest's full body). No new ones are written, so a recent account has none; `get_feed` is what lands now. |
| `get_apps` | Approved third-party apps on the platform. |
| `get_linktrees` | The user's link tree pages (optional `slug` for one page plus view/click analytics). |
| `create_linktree` | Create a shareable link page with view/click tracking. |
| `delete_linktree` | Delete a link tree page by ID. |

## Account

| Tool | Purpose |
|------|---------|
| `get_account` | One status read: every budget the platform enforces with its reset time, the remaining limits, and any over-cap state. Free to call and never counts against a cap. |

Remoet is free for job seekers. There is no paid plan and nothing for an agent to sell, so when a user reaches a limit, help them work within it.
