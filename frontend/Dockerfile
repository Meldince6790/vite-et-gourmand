# Build stage — production Vite bundle
FROM node:24-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Required at build time — Vite embeds VITE_* into the client bundle.
# Pass via: docker compose build / docker build --build-arg VITE_API_URL=...
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN if [ -z "$VITE_API_URL" ]; then \
      echo "ERROR: VITE_API_URL build arg is required (set it in root .env or --build-arg)."; \
      exit 1; \
    fi \
 && npm run build

# Runtime stage — static files + SPA fallback
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
