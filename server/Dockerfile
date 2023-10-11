FROM node:18.18.0-bookworm-slim

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci --only=production

COPY . /usr/src/app
EXPOSE 3000

CMD ["npm", "start"]