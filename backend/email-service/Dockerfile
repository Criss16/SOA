FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY email-service ./

ENTRYPOINT node main.js