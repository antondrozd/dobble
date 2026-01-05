# Prune stage - create a pruned monorepo with only client dependencies
FROM node:24-alpine AS pruner

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app
COPY . .
RUN TURBO_VER=$(node -p "require('./package.json').devDependencies.turbo") && \
    pnpm dlx turbo@$TURBO_VER prune --scope=@dobble/client --docker

# Build stage
FROM node:24-alpine AS builder

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Copy pruned lockfile and package.jsons (better layer caching)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy pruned source code and build
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=@dobble/client

# Production stage
FROM node:24-alpine

RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/client/dist ./dist

ENV PORT=5173

CMD ["sh", "-c", "serve -s dist -l $PORT"]
