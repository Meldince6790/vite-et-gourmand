FROM node:24-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

# Production dependencies only (no nodemon / test tooling)
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

USER node

EXPOSE 3000

# Direct node process so SIGTERM/SIGINT reach the app (not an npm wrapper)
CMD ["node", "src/app.js"]
