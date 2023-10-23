# Build image
FROM node:latest AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

RUN npm ci --omit=dev

# Production image
FROM node:20.8.1-bookworm-slim

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app/

CMD ["dumb-init", "node", "app.js"]