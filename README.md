# Remoet MCP server

Connect your AI agent to [Remoet](https://remoet.dev), the job platform built for agents. Search tech companies by their real tech stack, star the ones you'd actually work for, pull jobs from that shortlist, and manage your developer profile, all through conversation.

This repo ships a **local stdio MCP server** (Node + TypeScript) plus the metadata MCP clients and directory registries need. The local server advertises Remoet's full tool catalog (snapshotted from the live server) and forwards calls to the hosted MCP at `https://api.remoet.dev/mcp` with your Bearer key. The hosted server is closed source and remains the source of truth for execution.

Most users connect to the hosted server directly (see [Quick install](#quick-install) below). The local package is for clients that prefer stdio or build/scan systems that require a runnable local server.

- **Homepage:** https://remoet.dev
- **Docs:** https://docs.remoet.dev
- **MCP endpoint:** `https://api.remoet.dev/mcp`
- **Get a free API key:** https://remoet.dev/onboarding

## What it does

Remoet has company-level tech stack data nobody else has, so an agent can match you to companies by the technologies they actually use, not recruiter keyword tags. Star the companies that fit, and your agent pulls fresh jobs from that shortlist. It also manages your profile, applications, saved jobs, and weekly digests, all over MCP.

Free tier is the whole product with caps. Paid tiers unlock real-time job data and higher limits. No credit card for the free tier.

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

### As a skill (Hermes, OpenClaw)

Remoet also ships as an [agentskills.io](https://agentskills.io) skill:

```bash
# Hermes
hermes skills tap add remoet-labs/agent-skills
hermes skills install remoet-labs/agent-skills/skills/remoet

# OpenClaw
openclaw skills install remoet
```

## First prompt to try

> I work in Rails, React, and Postgres. Which companies on Remoet hire for that stack?

## Run locally (Node + Docker)

If you prefer a local stdio MCP server (or a build/scan system needs one), the same package is runnable directly.

**With Node:**

```bash
npm install
npm run build
REMOET_API_KEY="<your-key>" node dist/index.js
```

The server speaks MCP over stdio. Set `REMOET_API_KEY` to a free-tier key from [remoet.dev/onboarding](https://remoet.dev/onboarding). Optionally override the upstream endpoint with `REMOET_MCP_URL` (defaults to `https://api.remoet.dev/mcp`).

**With Docker:**

```bash
docker build -t remoet-mcp .
docker run --rm -i -e REMOET_API_KEY="<your-key>" remoet-mcp
```

The container's entrypoint runs the stdio server. Pipe MCP JSON-RPC frames into the container; tool calls are forwarded to the hosted server with your Bearer key.

The published tool catalog lives in [`data/tools.json`](./data/tools.json) (snapshotted from the live `tools/list`). Refresh it whenever the hosted server's tool surface changes.

## License

[MIT](./LICENSE). The wrapper is open; the Remoet backend it points at is a hosted service.
