# ---------- Build Stage ----------
FROM node:20-alpine AS build

# Install git for git-based dependencies
RUN apk add --no-cache git

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 --fetch-timeout 300000

COPY . .

# Use production env for build; Vite reads VITE_* at build time
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Pass build-time environment variables
ARG VITE_API_BASE_URL
ARG VITE_LOGIN_URL
ARG VITE_API_BASE_URL_AUTH

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_LOGIN_URL=$VITE_LOGIN_URL
ENV VITE_API_BASE_URL_AUTH=$VITE_API_BASE_URL_AUTH

# Debug: Show environment variables
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL"
RUN echo "VITE_LOGIN_URL=$VITE_LOGIN_URL"
RUN echo "VITE_API_BASE_URL_AUTH=$VITE_API_BASE_URL_AUTH"

RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runtime

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy built assets
COPY --from=build /app/dist /app/dist

# Expose application port
EXPOSE 4007

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost:4007/ || exit 1

CMD ["serve", "-s", "dist", "-l", "4007"]