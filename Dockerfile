FROM node:20.9.0-alpine as prod
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm install -g serve
RUN npm install
RUN npm run build
RUN npm run express:build
