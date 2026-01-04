# Prune stage - create a pruned monorepo with only client dependencies
FROM node:24-alpine AS pruner

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app
COPY . .
RUN npx turbo prune --scope=@dobble/client --docker

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
FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY --from=pruner /app/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
