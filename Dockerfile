FROM node:20-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Dev
FROM base as dev
RUN apt-get update && apt-get install -y procps
WORKDIR /app

# Build
FROM base as build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --frozen-lockfile
RUN pnpm build

# Production [api]
FROM base AS prod
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist /app/dist
CMD [ "pnpm", "start:prod" ]