# Stage 1: build
FROM node:22-slim AS builder

WORKDIR /app

ENV CI=1

# Copy package config
COPY package.json package-lock.json* ./

# Install dependencies from lockfile to keep versions deterministic
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build static web output
RUN npx expo export --platform web

# Stage 2: serve
FROM node:22-slim AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "dist", "--single", "--listen", "8080"]
