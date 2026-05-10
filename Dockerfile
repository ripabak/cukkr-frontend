# Build and serve React Native Web (Expo) without Nginx
FROM node:22-alpine

WORKDIR /app

ENV CI=1

# Copy package config
COPY package.json package-lock.json* ./

# Install dependencies from lockfile to keep versions deterministic
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build static web output using script that exits cleanly when done
RUN chmod +x build_web.sh && sh build_web.sh

# Expose port used by expo serve
EXPOSE 8080

# Serve the exported web build
CMD ["npx", "expo", "serve", "dist", "--port", "8080"]
