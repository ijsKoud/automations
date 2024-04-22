FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --- Builder ---
FROM base AS builder
WORKDIR /automations

RUN apk add --no-cache libc6-compat
RUN apk update

COPY . .


# --- Installer ---
FROM base AS installer
WORKDIR /automations

RUN apk add --no-cache libc6-compat
RUN apk update

# Install dependencies
COPY .gitignore .gitignore
COPY --from=builder /automations/package.json ./package.json
COPY --from=builder /automations/pnpm-lock.yaml ./pnpm-lock.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /automations/src/ ./src/
COPY --from=builder /automations/tsconfig.json tsconfig.json
RUN pnpm build

# Remove dev-dependencies from node_modules
RUN pnpm pinst --disable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod


# --- Runner ---
FROM base AS runner

WORKDIR /automations

ENV NODE_ENV="production"

# Set the user
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

# Copy over the application
COPY --from=installer --chown=app:app /automations/dist ./dist
COPY --from=installer --chown=app:app /automations/package.json package.json
COPY --from=installer --chown=app:app /automations/node_modules node_modules

CMD pnpm start