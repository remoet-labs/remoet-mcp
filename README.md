# Remoet MCP server

Connect your AI agent to [Remoet](https://remoet.dev), the job platform built for agents. Search tech companies by their real tech stack, star the ones you'd actually work for, pull jobs from that shortlist, and manage your developer profile, all through conversation.

This repo is a thin, public wrapper for Remoet's hosted MCP server. The server runs at `https://api.remoet.dev/mcp`; the backend is closed source. Everything here is metadata and config for MCP clients and registries.

- **Homepage:** https://remoet.dev
- **Docs:** https://docs.remoet.dev
- **MCP endpoint:** `https://api.remoet.dev/mcp`
- **Get a free API key:** https://remoet.dev/onboarding

## What it does

Remoet has company-level tech stack data nobody else has, so an agent can match you to companies by the technologies they actually use, not recruiter keyword tags. Star the companies that fit, and your agent pulls fresh jobs from that shortlist. It also manages your profile, applications, saved jobs, and weekly digests, all over MCP.

Free tier is the whole product with caps. Paid tiers unlock real-time job data and higher limits. No credit card for the free tier.

See [`tools.md`](./tools.md) for the full tool catalog.

## Auth

Two transports, same tools:

- `https://api.remoet.dev/mcp` expects an API key as a Bearer header (`Authorization: Bearer <key>`). Best for CLI and always-on agents.
- `https://api.remoet.dev/mcp/oauth` runs OAuth 2.1 with PKCE and dynamic client registration. Best for browser clients like Claude Web and Desktop custom connectors.

Generate a key at [remoet.dev/onboarding](https://remoet.dev/onboarding). The same key works for MCP and the REST API.

## Quick install

### Claude Code

```bash
claude mcp add remoet https://api.remoet.dev/mcp --scope user --transport http --header "Authorization: Bearer YOUR_KEY"
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

> I'm a Rails, React, and Postgres dev. Find companies that match my stack, star the best fits, and pull jobs from my shortlist.

## License

[MIT](./LICENSE). The wrapper is open; the Remoet backend it points at is a hosted service.
