FROM node:20.9.0 as prod
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm install -g serve
RUN npm install
RUN npm run build
RUN npm run express:build

# FROM gcr.io/distroless/nodejs20-debian12 as prod
# WORKDIR /usr/src/app
# COPY --from=build-prod /usr/src/app/dist ./dist
# COPY --from=build-prod /usr/src/app/node_modules ./node_modules
