FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/acadmanage-frontend/browser /usr/share/nginx/html
RUN cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

EXPOSE 80
