# Remoet MCP server

Track tech jobs from companies you love, by asking your AI agent. No account needed to start.

```bash
claude mcp add --transport http --scope user remoet https://api.remoet.dev/mcp
```

**What it will and will not do**

- It searches the public job board and, with a free account, keeps your profile, starred companies and saved jobs on file.
- It does not apply on employer sites for you: for scraped roles (most of the board) it hands you the employer's link and you apply there.
- It writes only when you ask your agent to, and the one tool that can submit an application (partner jobs posted through Remoet) needs your explicit go-ahead.

**Try this first:**

> I work in Rails, React, and Postgres. Find open roles that use that stack and tell me which companies are hiring for it.

**The board, counted 2026-10-06:** 11,704 open tech roles at 762 hiring companies, counting a role posted in many cities once. Free for job seekers, no paid plans, up to 50 active stars per account. MIT licensed.

## No key vs. free account

The hosted server at `https://api.remoet.dev/mcp` answers the read-only catalogue tools with no key at all:

- `search_jobs`: every role on the open board at [remoet.dev/jobs](https://remoet.dev/jobs), across all companies.
- `search_listings`: companies by name or by the tech stack they hire for.
- `get_listing`: one company in detail.

Everything personal (profile, stars, saved jobs, your feed, applications) needs a free account. Get an API key at [remoet.dev/onboarding](https://remoet.dev/onboarding), or sign in with OAuth from a browser client. The same key works for MCP and the REST API. See [`tools.md`](./tools.md) for the full tool catalog.

## Quick install

### Claude Code

Keyless, for searching:

```bash
claude mcp add --transport http --scope user remoet https://api.remoet.dev/mcp
```

With a key, for the personal tools:

```bash
claude mcp add --transport http --scope user remoet https://api.remoet.dev/mcp --header "Authorization: Bearer YOUR_KEY"
```

Then restart Claude Code (exit and relaunch) so the new server's tools load in a fresh session.

### Cursor, VS Code, Windsurf

Add to your client's MCP config (the JSON in [`.mcp.json`](./.mcp.json) works as a template). Drop the `headers` block to search without a key:

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
openclaw skills install @remoet/remoet
```

## What it does

Remoet derives each company's tech stack from the roles it is hiring for right now, not from self-reported adoption lists that go stale, so an agent can match you to companies by the technologies they actually build on today. Star the ones that fit and their new jobs land in your feed, with the company's full stack unlocked. `get_feed` is the one stream your agent polls for what landed since: new roles from your starred companies, the daily pick, platform posts. A roundup of the same feed goes out by email on the schedule you set.

One set of limits applies to every account, and `get_account` reports where you stand against them.

## Works with

Claude Code, Claude Desktop, Claude Web, Cursor, VS Code, Windsurf, Codex, and any MCP-compatible client. Also installable as an [agentskills.io](https://agentskills.io) skill on OpenClaw (via ClawHub) and Hermes Agent.

## Auth

Two transports, same tools:

- `https://api.remoet.dev/mcp` accepts an API key as a Bearer header (`Authorization: Bearer <key>`), or none for the catalogue tools. Best for CLI and always-on agents.
- `https://api.remoet.dev/mcp/oauth` runs OAuth 2.1 with PKCE and dynamic client registration. Best for browser clients like Claude Web and Desktop custom connectors.

## Links

- **Homepage:** https://remoet.dev
- **Docs:** https://docs.remoet.dev
- **MCP endpoint:** `https://api.remoet.dev/mcp`
- **Get a free API key:** https://remoet.dev/onboarding

## Run locally (not working yet)

This repo ships a local stdio MCP server (Node + TypeScript) plus the metadata MCP clients and directory registries need. The hosted MCP at `https://api.remoet.dev/mcp` is closed source and remains the source of truth for execution; use it as shown in [Quick install](#quick-install).

The local stdio server builds and runs, and it answers `tools/list` from the snapshot, which is what directory build and scan systems need. **It cannot execute a tool call.** The proxy demands an `mcp-session-id` header on the hosted server's initialize response, and the hosted server has been stateless since June 2026, so it never sends one and every call fails at that check. Fixing the proxy is a separate piece of work.

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

The published tool catalog lives in [`data/tools.json`](./data/tools.json), snapshotted from the hosted server's live `tools/list`. Refresh it from a real `tools/list` response whenever the hosted tool surface changes, and keep [`tools.md`](./tools.md) in step. The snapshot shows the signed-in schema; read the note at the top of `tools.md` before regenerating.

## License

[MIT](./LICENSE). The wrapper is open; the Remoet backend it points at is a hosted service.
