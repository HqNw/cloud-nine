FROM node as base

WORKDIR /app




###################################################
################  BACKEND STAGES  #################
###################################################

FROM base AS backend-dev
COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci

# COPY backend/spec ./spec
COPY backend/src ./src

EXPOSE 3000
CMD ["npm", "run", "dev"]



FROM base AS final
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci --only=production

COPY backend/src ./src
# COPY --from=client-build /app/dist ./src/static

EXPOSE 3000
CMD ["npm", "run", "start"]
