FROM node:18.18-alpine as prod
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm install -g serve
RUN npm install
RUN npm run build
RUN npm run express:build

# FROM gcr.io/distroless/nodejs18 as prod
# WORKDIR /usr/src/app
# COPY --from=build-prod /usr/src/app/dist ./dist
