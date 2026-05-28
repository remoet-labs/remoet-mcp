# Thin shim so Glama (and other directory build/scan systems) can build and
# introspect the Remoet MCP server. The actual server is closed-source and
# hosted at https://api.remoet.dev/mcp; this image exposes a local stdio MCP
# server that forwards initialize / tools/list / tools/call to that endpoint
# using a Bearer API key.
#
# End users do NOT need to build or run this image. Connect to the hosted
# server directly per README.md ("Quick install"). The Dockerfile exists so
# Glama can spin up a process, call `tools/list` to score the tool catalog
# (TDQS), and surface a score badge for the listing.

FROM node:20-slim

WORKDIR /app

# Glama injects the API key via the server-listing config so the
# introspection call can authenticate against /mcp. A free-tier key is
# available at https://remoet.dev/onboarding.
ENV REMOET_API_KEY=""

# Pre-install mcp-remote into the image so container start does not pay the
# npx fetch / cache cost on every run, and the build is reproducible.
# Pinned floor at ^0.1.16 to exclude CVE-2025-6514 (RCE in 0.0.5..0.1.15).
RUN npm install -g mcp-remote@^0.1.16

# `--transport http-only` matches our Streamable HTTP endpoint exactly and
# skips the default HTTP-then-SSE probe (one fewer code path).
# Shell form so ${REMOET_API_KEY} interpolates; exec so mcp-remote becomes
# PID 1 and signal handling works for clean container shutdown.
ENTRYPOINT ["sh", "-c", "exec mcp-remote https://api.remoet.dev/mcp --transport http-only --header \"Authorization: Bearer ${REMOET_API_KEY}\""]
