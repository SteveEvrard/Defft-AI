FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production \
    PNPM_HOME=/root/.local/share/pnpm \
    PATH="$PNPM_HOME:$PATH" \
    COREPACK_ENABLE_STRICT=0

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .
RUN pnpm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]