FROM node:22-alpine AS build

LABEL maintainer="yancyshepherd"
LABEL description="Dit Dit touchscreen CW trainer app"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
