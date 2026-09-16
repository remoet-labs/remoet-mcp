# Remoet MCP server

Connect your AI agent to [Remoet](https://remoet.dev), the job platform built for agents. Search the public job catalogue, find tech companies by the stack they actually build on, star the ones you'd work for so their new jobs land in your feed, and manage your developer profile, all through conversation.

This repo ships a **local stdio MCP server** (Node + TypeScript) plus the metadata MCP clients and directory registries need. The local server advertises Remoet's full tool catalog, snapshotted from the live server. Executing a tool through it does not work yet (see [Run locally](#run-locally-not-working-yet)); the hosted MCP at `https://api.remoet.dev/mcp` is closed source and remains the source of truth for execution.

Connect to the hosted server directly (see [Quick install](#quick-install) below). That is the path that works today.

- **Homepage:** https://remoet.dev
- **Docs:** https://docs.remoet.dev
- **MCP endpoint:** `https://api.remoet.dev/mcp`
- **Get a free API key:** https://remoet.dev/onboarding

## What it does

The job catalogue is public. `search_jobs` reads every role on the open board at [remoet.dev/jobs](https://remoet.dev/jobs), across all companies, before you star anything.

A star is about delivery, not access. Remoet derives each company's tech stack from the roles it is hiring for right now, not from self-reported adoption lists that go stale, so an agent can match you to companies by the technologies they actually build on today. Star the ones that fit and their new jobs land in your feed, with the company's full stack unlocked. Remoet also keeps your profile and the jobs you save on file, and `get_feed` is the one stream your agent polls for what landed since: new roles from your starred companies, the daily pick, platform posts. A roundup of the same feed goes out by email on the schedule you set.

Remoet is free for job seekers. There are no paid plans and no credit card. One set of limits applies to every account, and `get_account` reports where you stand against them.

See [`tools.md`](./tools.md) for the full tool catalog.

## Works with

Claude Code, Claude Desktop, Claude Web, Cursor, VS Code, Windsurf, Codex, and any MCP-compatible client. Also installable as an [agentskills.io](https://agentskills.io) skill on OpenClaw (via ClawHub) and Hermes Agent. See [Quick install](#quick-install).

## Auth

Two transports, same tools:

- `https://api.remoet.dev/mcp` expects an API key as a Bearer header (`Authorization: Bearer <key>`). Best for CLI and always-on agents.
- `https://api.remoet.dev/mcp/oauth` runs OAuth 2.1 with PKCE and dynamic client registration. Best for browser clients like Claude Web and Desktop custom connectors.

Generate a key at [remoet.dev/onboarding](https://remoet.dev/onboarding). The same key works for MCP and the REST API.

## Quick install

### Claude Code

```bash
claude mcp add --transport http --scope user remoet https://api.remoet.dev/mcp --header "Authorization: Bearer YOUR_KEY"
```

Then restart Claude Code (exit and relaunch) so the new server's tools load in a fresh session.

### Cursor, VS Code, Windsurf

Add to your client's MCP config (the JSON in [`.mcp.json`](./.mcp.json) works as a template):

```json
{
  "mcpServers": {
    "remoet": {
      "type": "http",
      "url": "https://api.remoet.dev/mcp",
      "headers": { "Authorization": "Bearer YOUR_KEY" }
    }
  }
}
```

### Claude Web / Desktop (custom connector)

Add a custom connector pointing at `https://api.remoet.dev/mcp/oauth` and complete the browser sign-in. No API key to paste.

Remoet also ships as an [agentskills.io](https://agentskills.io) skill, with one-command installs on Hermes and OpenClaw.

### Hermes

```bash
hermes skills tap add remoet-labs/agent-skills
hermes skills install remoet-labs/agent-skills/skills/remoet
```

### OpenClaw

```bash
openclaw skills install remoet
```

## First prompt to try

> I work in Rails, React, and Postgres. Which companies on Remoet hire for that stack?

## Run locally (not working yet)

The local stdio server builds and runs, and it answers `tools/list` from the snapshot, which is what directory build and scan systems need. **It cannot execute a tool call.** The proxy demands an `mcp-session-id` header on the hosted server's initialize response, and the hosted server has been stateless since June 2026, so it never sends one and every call fails at that check. Use the hosted endpoints in [Quick install](#quick-install) instead. Fixing the proxy is a separate piece of work.

For the catalog-only use:

```bash
npm install
npm run build
REMOET_API_KEY="<your-key>" node dist/index.js
```

Set `REMOET_API_KEY` to a free key from [remoet.dev/onboarding](https://remoet.dev/onboarding). `REMOET_MCP_URL` overrides the upstream endpoint (defaults to `https://api.remoet.dev/mcp`). Docker works the same way, with the stdio server as the container entrypoint:

```bash
docker build -t remoet-mcp .
docker run --rm -i -e REMOET_API_KEY="<your-key>" remoet-mcp
```

The published tool catalog lives in [`data/tools.json`](./data/tools.json), snapshotted from the hosted server's live `tools/list`. Refresh it from a real `tools/list` response whenever the hosted tool surface changes, and keep [`tools.md`](./tools.md) in step.

## License

[MIT](./LICENSE). The wrapper is open; the Remoet backend it points at is a hosted service.
