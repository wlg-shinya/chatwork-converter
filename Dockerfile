FROM node:18.18-alpine as prod
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm install
RUN npm install -g serve
RUN npm run build
RUN npm run express:build
