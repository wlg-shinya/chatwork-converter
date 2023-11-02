FROM node:20.9.0
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g serve
RUN npm install --force