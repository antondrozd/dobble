# Prune stage - create a pruned monorepo with only server dependencies
FROM node:24-alpine AS pruner

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app
COPY . .
RUN TURBO_VER=$(node -p "require('./package.json').devDependencies.turbo") && \
    pnpm dlx turbo@$TURBO_VER prune --scope=@dobble/server --docker

# Build stage - install deps, build, and create standalone deployment
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Copy pruned lockfile and package.jsons (better layer caching)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy pruned source code and build
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=@dobble/server

# Create standalone deployment
RUN pnpm deploy --filter=@dobble/server --prod /app/deployed

# Production stage
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/deployed .

EXPOSE 3001

CMD ["node", "dist/main.js"]
