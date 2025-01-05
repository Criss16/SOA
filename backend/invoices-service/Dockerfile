FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY invoices-service ./
COPY utils ./utils

ENTRYPOINT node main.js