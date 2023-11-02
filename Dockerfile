FROM node:20.9.0 as dev
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=development
RUN npm install --force

FROM node:20.9.0 as prod
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm install -g serve
RUN npm install --force
RUN npm run build

# FROM gcr.io/distroless/nodejs20-debian12 as prod
# WORKDIR /app
# COPY --from=build-prod /app/dist ./dist
# COPY --from=build-prod /app/node_modules ./node_modules
