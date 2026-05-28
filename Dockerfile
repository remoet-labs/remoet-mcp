# Multi-stage build for the local Remoet MCP server.
# Stage 1: install deps + compile TypeScript.
# Stage 2: minimal runtime image with only production deps + dist.

FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY tsconfig.json ./
COPY src/ src/
COPY data/ data/
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-slim
WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node

# REMOET_API_KEY is read at runtime from process env (`docker run -e ...` or
# Glama's server-listing config). Not declared as ENV here to avoid the
# `SecretsUsedInArgOrEnv` Docker linter warning, and because a declared
# default would leak into image inspection. Users running the package
# locally set it to their free-tier key from https://remoet.dev/onboarding.

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist/ dist/
COPY --chown=node:node --from=build /app/data/ data/
COPY --chown=node:node package.json ./

ENTRYPOINT ["node", "dist/index.js"]
