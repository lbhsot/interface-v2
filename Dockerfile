# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY yarn.lock ./
RUN yarn
COPY . .
