FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN mkdir -p /app
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
ENV NEXT_PUBLIC_ENV_TYPE=dev
RUN pnpm run build
EXPOSE 9002
CMD [ "pnpm", "start" ]