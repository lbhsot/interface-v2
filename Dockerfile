# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
