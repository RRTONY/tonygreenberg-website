FROM node:22-slim AS builder

WORKDIR /app

COPY . .

RUN npm install -g corepack@latest \
    && corepack enable \
    && corepack pnpm install --frozen-lockfile \
    && corepack pnpm run build

FROM node:22-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", ".next/standalone/server.js"]
