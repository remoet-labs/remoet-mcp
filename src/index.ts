#!/usr/bin/env node
/**
 * Local MCP server for Remoet.
 *
 * Boots a stdio MCP server that:
 *   - Advertises Remoet's tool catalog (snapshotted in data/tools.json) so any
 *     MCP client (and any directory build/scan system, like Glama) can
 *     introspect the full surface without remote auth.
 *   - Proxies actual tool calls to the hosted MCP server at REMOET_MCP_URL
 *     (default https://api.remoet.dev/mcp) using the user's Bearer key from
 *     REMOET_API_KEY.
 *
 * The hosted server stays the source of truth for execution. This package is
 * a thin local entry point for clients that prefer stdio or for build/scan
 * systems that require a runnable local server (no proxy CLI).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface ToolDef {
  name: string;
  title?: string;
  description?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
  annotations?: Record<string, unknown>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLS: ToolDef[] = JSON.parse(
  readFileSync(join(__dirname, "..", "data", "tools.json"), "utf8"),
);

const REMOTE_URL =
  process.env.REMOET_MCP_URL?.trim() || "https://api.remoet.dev/mcp";

const server = new Server(
  { name: "remoet-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

/**
 * Forward a tool call to the hosted MCP server. Creates a fresh session per
 * call (stateless), so we don't hold any per-client state in the local proxy.
 */
async function callRemote(
  apiKey: string,
  params: unknown,
): Promise<unknown> {
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    Authorization: `Bearer ${apiKey}`,
  };

  const initRes = await fetch(REMOTE_URL, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "remoet-mcp-local", version: "1.0.0" },
      },
    }),
  });

  const sessionId = initRes.headers.get("mcp-session-id");
  if (!initRes.ok || !sessionId) {
    const body = await initRes.text();
    throw new Error(
      `Remote initialize failed (${initRes.status}): ${body.slice(0, 200)}`,
    );
  }

  const sessionHeaders = { ...baseHeaders, "Mcp-Session-Id": sessionId };

  await fetch(REMOTE_URL, {
    method: "POST",
    headers: sessionHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    }),
  });

  const callRes = await fetch(REMOTE_URL, {
    method: "POST",
    headers: sessionHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params,
    }),
  });

  const text = await callRes.text();
  // Streamable HTTP returns SSE; find the first `data:` frame.
  const dataLine = text.split("\n").find((l) => l.startsWith("data: "));
  const payload = dataLine ? dataLine.slice(6) : text;

  const parsed = JSON.parse(payload) as {
    error?: { message?: string };
    result?: unknown;
  };

  if (parsed.error) {
    throw new Error(parsed.error.message || "Remote tool call failed");
  }
  return parsed.result;
}

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const apiKey = process.env.REMOET_API_KEY?.trim();
  if (!apiKey || apiKey === "dummy") {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text:
            "REMOET_API_KEY is not set. Get a free key at https://remoet.dev/onboarding and set it as an environment variable before calling tools.",
        },
      ],
    };
  }

  try {
    const result = await callRemote(apiKey, req.params);
    return result as { content: Array<{ type: string; text: string }> };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [{ type: "text", text: `Remoet remote call failed: ${message}` }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
