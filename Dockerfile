FROM node:17-alpine3.15
WORKDIR /app
COPY package*.json /app
RUN npm ci && npm cache clean --force
COPY . /app
CMD [ "npm", "start" ]