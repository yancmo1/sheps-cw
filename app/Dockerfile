FROM node:22-alpine AS build

LABEL maintainer="yancyshepherd"
LABEL description="Didah Trainer - CW learning dashboard"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80