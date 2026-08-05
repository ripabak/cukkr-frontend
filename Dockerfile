# Stage 1: build
FROM node:22-slim AS builder

ARG EXPO_PUBLIC_ENV_CODE
ARG EXPO_PUBLIC_ENV_API_URL
ARG EXPO_PUBLIC_ENV_AUTH_URL
ARG EXPO_PUBLIC_WEB_URL
ARG EXPO_PUBLIC_VAPID_PUBLIC_KEY

ENV EXPO_PUBLIC_ENV_CODE=$EXPO_PUBLIC_ENV_CODE
ENV EXPO_PUBLIC_ENV_API_URL=$EXPO_PUBLIC_ENV_API_URL
ENV EXPO_PUBLIC_ENV_AUTH_URL=$EXPO_PUBLIC_ENV_AUTH_URL
ENV EXPO_PUBLIC_WEB_URL=$EXPO_PUBLIC_WEB_URL
ENV EXPO_PUBLIC_VAPID_PUBLIC_KEY=$EXPO_PUBLIC_VAPID_PUBLIC_KEY

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
