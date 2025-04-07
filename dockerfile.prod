FROM node:20-alpine AS base
WORKDIR /app

# Base image optimizations
RUN apk update && \
    apk add --no-cache curl bash && \
    npm install -g npm@latest

###################################################
# final stage
###################################################

FROM base AS final
ENV NODE_ENV=production
WORKDIR /app

# Create a non-root user first
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeapp && \
    mkdir -p /app/uploads && \
    mkdir -p /app/prisma && \
    mkdir -p /app/node_modules && \
    chown -R nodeapp:nodejs /app

# Switch to non-root user
USER nodeapp

# Install production dependencies only
COPY --chown=nodeapp:nodejs backend/package.json backend/package-lock.json ./
RUN npm ci --only=production

# Copy backend files
COPY --chown=nodeapp:nodejs backend/src ./src
COPY --chown=nodeapp:nodejs backend/prisma ./prisma

# Generate Prisma client as non-root user
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "src/app.js"]