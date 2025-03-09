FROM node AS base

WORKDIR /app



###################################################
################  FRONTEND STAGES  ################
###################################################

###################################################
# Stage: client-base
###################################################
FROM base AS client-base
COPY client/package.json client/package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci
COPY client/index.html client/vite.config.ts client/tsconfig.json client/tailwind.config.js client/tsconfig.app.json client/tsconfig.node.json client/tsconfig.json ./
COPY client/public ./public
COPY client/src ./src

###################################################
# Stage: client-dev
###################################################
FROM client-base AS client-dev
EXPOSE 5173
CMD ["npm", "run", "dev"]

###################################################
# Stage: client-build
###################################################
FROM client-base AS client-build
RUN npm run build


###################################################
################  BACKEND STAGES  #################
###################################################

###################################################
# Stage: backend-base
###################################################

FROM base AS backend-dev
COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci

# COPY backend/spec ./spec
COPY backend/src ./src

EXPOSE 3000
CMD ["npm", "run", "dev"]

###################################################
# Stage: final
###################################################

FROM base AS final
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci --only=production

COPY backend/src ./src
COPY --from=client-build /app/dist ./src/static

EXPOSE 3000
CMD ["npm", "run", "start"]
