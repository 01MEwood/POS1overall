# POS1 Cockpit — Multi-Stage-Build: Frontend bauen, Backend + Build ausliefern
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app/backend
# better-sqlite3 braucht Build-Tools nur, falls kein Prebuild passt
RUN apk add --no-cache python3 make g++
COPY backend/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY backend/ ./
COPY --from=frontend /app/frontend/dist /app/frontend/dist

ENV PORT=5317
ENV DATA_DIR=/data
VOLUME /data
EXPOSE 5317
CMD ["node", "src/index.js"]
