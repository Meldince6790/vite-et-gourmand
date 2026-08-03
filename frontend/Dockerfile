# Build stage — production Vite bundle
FROM node:24-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Injected at image build time (Vite embeds VITE_* in the bundle)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Runtime stage — static files + SPA fallback
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
