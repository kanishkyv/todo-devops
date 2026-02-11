# syntax=docker/dockerfile:1

########################
# 1) deps (install)
########################
FROM node:20-alpine AS deps
WORKDIR /app

# Install only based on lockfile
COPY package*.json ./
RUN npm ci

########################
# 2) test (optional stage)
########################
FROM node:20-alpine AS test
WORKDIR /app
ENV NODE_ENV=test

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run unit tests here (fast, no docker-in-docker needed)
RUN npm run test:unit

########################
# 3) prod deps (prune dev)
########################
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

########################
# 4) runtime (small + non-root)
########################
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./

USER app
EXPOSE 3000

# Healthcheck uses your existing endpoint
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["node", "src/server.js"]
