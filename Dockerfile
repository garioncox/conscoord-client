FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . .
RUN npm run build

# nginx
FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]