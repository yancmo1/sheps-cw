FROM node:22-alpine AS base

LABEL maintainer="yancyshepherd"
LABEL description="Dit Dit touchscreen CW trainer app"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

FROM base AS dev
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
