FROM node:20.9.0
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=development
RUN npm install --force