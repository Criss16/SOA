FROM node:lts-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY authservice ./
COPY utils ./utils

ENTRYPOINT node main.js

