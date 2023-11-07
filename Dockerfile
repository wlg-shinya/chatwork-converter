FROM node:18.18-alpine as prod
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
RUN npm install
RUN npm install -g serve
RUN npm run build
RUN npm run express:build

# FROM debian:bookworm-slim as prod
# WORKDIR /usr/src/app
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
# COPY --from=builder /usr/local/bin/serve /usr/local/bin/serve
# ENV NODE_ENV=production
# # https://github.com/nodesource/distributions#debian-and-ubuntu-based-distributions
# RUN apt-get update
# RUN apt-get install -y ca-certificates curl gnupg
# RUN mkdir -p /etc/apt/keyrings
# RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
# RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
# RUN apt-get update
# RUN apt-get install nodejs -y
