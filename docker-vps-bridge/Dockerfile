# ═══════════════════════════════════════════════════════════
# Dockerfile — Docker VPS Bridge (Lightweight Alpine Node.js)
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application files
COPY server.js ./

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]
